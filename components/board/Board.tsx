'use client';

import React, { useState, useCallback, useEffect } from 'react';
import { Column } from './Column';
import { DragDropContext, Droppable, DropResult } from '@hello-pangea/dnd';
import { useKanbanBoard } from '@/hooks/useKanbanBoard';
import { useKeyboardShortcuts } from '@/hooks/useKeyboardShortcuts';
import { TaskModal } from './TaskModal';
import { ColumnModal } from './ColumnModal';
import { ConfirmDeleteModal } from './ConfirmDeleteModal';
import { Plus, LayoutList, ChevronRight, ChevronLeft } from 'lucide-react';
import { EmptyState } from '../ui/EmptyState';
import { Button } from '../ui/Button';
import { BoardSkeleton } from './BoardSkeleton';
import { MobileFABs } from '../layout/MobileFABs';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

const MotionButton = motion.create(Button);

function ScrollIndicator({ direction, onClick }: { direction: 'left' | 'right'; onClick: () => void }) {
  const isLeft = direction === 'left';
  return (
    <div className={cn(
      "absolute top-1/2 -translate-y-1/2 w-24 h-full from-surface to-transparent pointer-events-none flex items-center px-2",
      isLeft ? "left-0 bg-gradient-to-r" : "right-0 bg-gradient-to-l justify-end"
    )}>
      <Button
        variant="secondary"
        size="icon"
        className="rounded-full shadow-lg pointer-events-auto shrink-0 bg-surface border-outline"
        onClick={onClick}
        aria-label={`Scroll ${direction}`}
      >
        {isLeft ? <ChevronLeft className="w-5 h-5" /> : <ChevronRight className="w-5 h-5" />}
      </Button>
    </div>
  );
}

function getTodayDateStr() {
  const today = new Date();
  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, '0');
  const day = String(today.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

export function Board() {
  const {
    board, updateBoard, isLoaded,
    isModalOpen, setIsModalOpen,
    editingTaskId, addTask, updateTask, deleteTask,
    addColumn, updateColumn, deleteColumn,
    isColumnModalOpen, setIsColumnModalOpen,
    editingColumn, setEditingColumn,
    searchQuery, assigneeFilter, priorityFilter, labelFilter, dateFilter
  } = useKanbanBoard();

  useKeyboardShortcuts();

  const [deletingColumnId, setDeletingColumnId] = useState<string | null>(null);
  const scrollRef = React.useRef<HTMLDivElement>(null);
  const [canScrollRight, setCanScrollRight] = useState(false);
  const [canScrollLeft, setCanScrollLeft] = useState(false);

  const checkScroll = useCallback(() => {
    if (scrollRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
      setCanScrollLeft(scrollLeft > 0);
      setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 10);
    }
  }, []);

  React.useEffect(() => {
    checkScroll();
    window.addEventListener('resize', checkScroll);
    return () => window.removeEventListener('resize', checkScroll);
  }, [checkScroll, board.columns.length]);

  const scrollRight = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollTo({ left: scrollRef.current.scrollWidth, behavior: 'smooth' });
    }
  };
  
  const scrollLeft = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollTo({ left: 0, behavior: 'smooth' });
    }
  };

  const todayStr = getTodayDateStr();

  const filteredTasks = board.tasks.filter(task => {
    if (searchQuery && !task.title.toLowerCase().includes(searchQuery.toLowerCase())) return false;
    if (assigneeFilter && task.assignee?.id !== assigneeFilter) return false;
    if (priorityFilter && task.priority !== priorityFilter) return false;
    if (labelFilter && !task.labels?.some(l => l.id === labelFilter)) return false;
    if (dateFilter && dateFilter !== todayStr && task.dueDate !== dateFilter) return false;
    return true;
  });

  const onDragEnd = (result: DropResult) => {
    const { source, destination, draggableId, type } = result;
    if (!destination) return;
    if (source.droppableId === destination.droppableId && source.index === destination.index) return;

    const newBoard = { ...board, tasks: [...board.tasks], columns: [...board.columns] };

    if (type === 'column') {
      const [removedColumn] = newBoard.columns.splice(source.index, 1);
      newBoard.columns.splice(destination.index, 0, removedColumn);
      updateBoard(newBoard);
      return;
    }

    const taskIndex = newBoard.tasks.findIndex(t => t.id === draggableId);
    if (taskIndex === -1) return;
    const task = newBoard.tasks[taskIndex];
    newBoard.tasks.splice(taskIndex, 1);
    const updatedTask = { ...task, status: destination.droppableId };

    const destFilteredTasks = filteredTasks.filter(t => t.status === destination.droppableId && t.id !== draggableId);

    if (destFilteredTasks.length === 0) {
      newBoard.tasks.push(updatedTask);
    } else if (destination.index >= destFilteredTasks.length - 1) {
      const lastDestTask = destFilteredTasks[destFilteredTasks.length - 1];
      const lastDestTaskGlobalIndex = newBoard.tasks.findIndex(t => t.id === lastDestTask.id);
      newBoard.tasks.splice(lastDestTaskGlobalIndex + 1, 0, updatedTask);
    } else {
      const taskAtDest = destFilteredTasks[destination.index];
      const insertGlobalIndex = newBoard.tasks.findIndex(t => t.id === taskAtDest.id);
      newBoard.tasks.splice(insertGlobalIndex, 0, updatedTask);
    }

    updateBoard(newBoard);
  };

  useEffect(() => {
    let animationFrameId: number;
    let pointerX = 0;
    let pointerY = 0;
    let isPointerDown = false;
    
    const handlePointerDown = (e: PointerEvent) => { isPointerDown = true; };
    const handlePointerUp = (e: PointerEvent) => { isPointerDown = false; };
    
    const handlePointerMove = (e: PointerEvent) => {
      if (!isPointerDown && e.buttons !== 1) return; // Only track when dragging/holding
      pointerX = e.clientX;
      pointerY = e.clientY;
    };

    const scrollLoop = () => {
      if (scrollRef.current && (isPointerDown || pointerX > 0)) {
        const rect = scrollRef.current.getBoundingClientRect();
        if (pointerY >= rect.top && pointerY <= rect.bottom) {
          const threshold = 120; 
          const maxSpeed = 20;
          let scrollDelta = 0;
          
          if (pointerX > rect.right - threshold && pointerX <= rect.right + 50) {
         
            const intensity = Math.max(0, Math.min(1, (pointerX - (rect.right - threshold)) / threshold));
            scrollDelta = intensity * maxSpeed;
          } else if (pointerX < rect.left + threshold && pointerX >= rect.left - 50) {
            const intensity = Math.max(0, Math.min(1, ((rect.left + threshold) - pointerX) / threshold));
            scrollDelta = -intensity * maxSpeed;
          }
          
          if (scrollDelta !== 0) {
            scrollRef.current.scrollBy({ left: scrollDelta });
          }
        }
      }
      animationFrameId = requestAnimationFrame(scrollLoop);
    };

    window.addEventListener('pointerdown', handlePointerDown);
    window.addEventListener('pointerup', handlePointerUp);
    window.addEventListener('pointermove', handlePointerMove);
    animationFrameId = requestAnimationFrame(scrollLoop);

    return () => {
      window.removeEventListener('pointerdown', handlePointerDown);
      window.removeEventListener('pointerup', handlePointerUp);
      window.removeEventListener('pointermove', handlePointerMove);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  if (!isLoaded) return <BoardSkeleton />;

  const editingTask = editingTaskId ? board.tasks.find(t => t.id === editingTaskId) : undefined;

  const handleEditColumn = (id: string, title: string) => {
    setEditingColumn({ id, title });
    setIsColumnModalOpen(true);
  };

  const handleAddColumnClick = () => {
    setEditingColumn(undefined);
    setIsColumnModalOpen(true);
  };



  return (
    <>
      <DragDropContext onDragEnd={onDragEnd}>
        {board.columns.length === 0 ? (
          <div className="flex-1 p-6 h-full">
            <EmptyState
              icon={LayoutList}
              title="No Columns Found"
              description="Your board is completely empty. Create a column from the top right to start organizing your tasks."
            />
          </div>
        ) : (
          <Droppable droppableId="board-columns" direction="horizontal" type="column">
            {(provided) => (
              <div className="tour-drag-drop relative flex-1 overflow-hidden">
                <div
                  className="overflow-auto p-6 h-full flex items-start gap-6 relative"
                  ref={(el) => {
                    provided.innerRef(el);
                    (scrollRef as React.MutableRefObject<HTMLDivElement | null>).current = el;
                  }}
                  onScroll={checkScroll}
                  {...provided.droppableProps}
                >
                  {board.columns.map((col, index) => {
                    const columnTasks = filteredTasks.filter(task => task.status === col.id);
                    return (
                      <Column
                        key={col.id}
                        id={col.id}
                        title={col.title}
                        tasks={columnTasks}
                        index={index}
                        onEdit={handleEditColumn}
                        onDelete={(id) => setDeletingColumnId(id)}
                      />
                    );
                  })}
                  {provided.placeholder}
                </div>
                
                {/* Scroll Indicators */}
                {canScrollLeft && (
                  <ScrollIndicator direction="left" onClick={scrollLeft} />
                )}
                {canScrollRight && (
                  <ScrollIndicator direction="right" onClick={scrollRight} />
                )}
              </div>
            )}
          </Droppable>
        )}
      </DragDropContext>

      <TaskModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        initialData={editingTask}
        onSave={(task) => {
          if (editingTask) {
            updateTask(task.id, task);
          } else {
            addTask(task);
          }
        }}
        onDelete={deleteTask}
      />

      <ColumnModal
        isOpen={isColumnModalOpen}
        onClose={() => setIsColumnModalOpen(false)}
        initialData={editingColumn}
        onSave={(title) => {
          if (editingColumn) {
            updateColumn(editingColumn.id, title);
          } else {
            addColumn(title);
          }
        }}
      />

      <ConfirmDeleteModal
        isOpen={!!deletingColumnId}
        onClose={() => setDeletingColumnId(null)}
        title="Delete Column?"
        description="Are you sure you want to delete this column? all tasks inside this column will be permanently deleted. This action cannot be undone."
        onConfirm={() => {
          if (deletingColumnId) deleteColumn(deletingColumnId);
        }}
      />
      
      <MobileFABs />
    </>
  );
}

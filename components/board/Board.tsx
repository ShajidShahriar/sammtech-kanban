'use client';

import React, { useState } from 'react';
import { Column } from './Column';
import { DragDropContext, Droppable, DropResult } from '@hello-pangea/dnd';
import { useKanbanBoard } from '@/hooks/useKanbanBoard';
import { TaskModal } from './TaskModal';
import { ColumnModal } from './ColumnModal';
import { ConfirmDeleteModal } from './ConfirmDeleteModal';
import { Plus, LayoutList } from 'lucide-react';
import { EmptyState } from '../ui/EmptyState';
import { Button } from '../ui/Button';
import { BoardSkeleton } from './BoardSkeleton';
import { motion } from 'framer-motion';

const MotionButton = motion.create(Button);

export function Board() {
  const {
    board, updateBoard, isLoaded,
    isModalOpen, setIsModalOpen,
    editingTaskId, addTask, updateTask, deleteTask,
    addColumn, updateColumn, deleteColumn,
    searchQuery, assigneeFilter, priorityFilter, labelFilter
  } = useKanbanBoard();

  const [isColumnModalOpen, setIsColumnModalOpen] = useState(false);
  const [editingColumn, setEditingColumn] = useState<{ id: string; title: string } | undefined>();
  const [deletingColumnId, setDeletingColumnId] = useState<string | null>(null);

  const filteredTasks = board.tasks.filter(task => {
    if (searchQuery && !task.title.toLowerCase().includes(searchQuery.toLowerCase())) return false;
    if (assigneeFilter && task.assignee?.id !== assigneeFilter) return false;
    if (priorityFilter && task.priority !== priorityFilter) return false;
    if (labelFilter && !task.labels?.some(l => l.id === labelFilter)) return false;
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
    } else if (destination.index >= destFilteredTasks.length) {
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
              description="Your board is completely empty. Create a column to start organizing your tasks."
              action={
                <MotionButton
                  key="add-column-empty"
                  layout="position"
                  layoutId="new-column"
                  variant="primary"
                  onClick={handleAddColumnClick}
                  className="flex items-center gap-2"
                >
                  <Plus className="w-4 h-4" />
                  Add Column
                </MotionButton>
              }
            />
          </div>
        ) : (
          <Droppable droppableId="board-columns" direction="horizontal" type="column">
            {(provided) => (
              <div
                className="flex-1 overflow-x-auto overflow-y-hidden p-6 h-full flex items-start gap-6"
                ref={provided.innerRef}
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

                {/* Add Column Ghost Button */}
                <MotionButton
                  key="add-column-ghost"
                  layout="position"
                  layoutId="new-column"
                  variant="secondary"
                  onClick={handleAddColumnClick}
                  className="shrink-0 w-[320px] h-[72px] flex items-center justify-center gap-2 rounded-lg font-medium transition-all border-dashed"
                >
                  <Plus className="w-5 h-5 shrink-0" />
                  Add Column
                </MotionButton>
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
    </>
  );
}

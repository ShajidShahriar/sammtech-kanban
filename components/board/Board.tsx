'use client';

import React from 'react';
import { Column } from './Column';
import { DragDropContext, DropResult } from '@hello-pangea/dnd';
import { useKanbanBoard } from '@/hooks/useKanbanBoard';

export function Board() {
  const { board, updateBoard, isLoaded } = useKanbanBoard();

  const onDragEnd = (result: DropResult) => {
    const { source, destination, draggableId } = result;
    if (!destination) return;

    if (source.droppableId === destination.droppableId && source.index === destination.index) {
      return;
    }

    const newBoard = { ...board, tasks: [...board.tasks] };

    const taskIndex = newBoard.tasks.findIndex(t => t.id === draggableId);
    if (taskIndex === -1) return;
    const task = newBoard.tasks[taskIndex];

    newBoard.tasks.splice(taskIndex, 1);

    const updatedTask = { ...task, status: destination.droppableId };

    const destTasks = newBoard.tasks.filter(t => t.status === destination.droppableId);

    if (destTasks.length === 0) {
      newBoard.tasks.push(updatedTask);
    } else if (destination.index >= destTasks.length) {
      const lastDestTask = destTasks[destTasks.length - 1];
      const lastDestTaskGlobalIndex = newBoard.tasks.findIndex(t => t.id === lastDestTask.id);
      newBoard.tasks.splice(lastDestTaskGlobalIndex + 1, 0, updatedTask);
    } else {
      const taskAtDest = destTasks[destination.index];
      const insertGlobalIndex = newBoard.tasks.findIndex(t => t.id === taskAtDest.id);
      newBoard.tasks.splice(insertGlobalIndex, 0, updatedTask);
    }

    updateBoard(newBoard);
  };

  if (!isLoaded) {
    return null;
  }

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <div className="flex-1 overflow-x-auto overflow-y-hidden p-6 h-full flex items-start gap-6">
        {board.columns.map(col => {
          const columnTasks = board.tasks.filter(task => task.status === col.id);
          return (
            <Column
              key={col.id}
              id={col.id}
              title={col.title}
              tasks={columnTasks}
            />
          );
        })}
      </div>
    </DragDropContext>
  );
}

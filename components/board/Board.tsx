'use client';

import React, { useState, useEffect } from 'react';
import { Column } from './Column';
import { initialBoardData } from '@/lib/dummy-data';
import { DragDropContext, DropResult } from '@hello-pangea/dnd';

export function Board() {
  const [board, setBoard] = useState(initialBoardData);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const onDragEnd = (result: DropResult) => {
    const { source, destination, draggableId } = result;
    if (!destination) return;

    if (source.droppableId === destination.droppableId && source.index === destination.index) {
      return;
    }

    const newBoard = { ...board, tasks: [...board.tasks] };
    
    // Find the task being dragged
    const taskIndex = newBoard.tasks.findIndex(t => t.id === draggableId);
    if (taskIndex === -1) return;
    const task = newBoard.tasks[taskIndex];
    
    // Remove from old position
    newBoard.tasks.splice(taskIndex, 1);
    
    // Update status if it changed column
    const updatedTask = { ...task, status: destination.droppableId };
    
    // Get all tasks currently in the destination column (excluding the one we removed)
    const destTasks = newBoard.tasks.filter(t => t.status === destination.droppableId);
    
    // Find where to insert in the global array
    if (destTasks.length === 0) {
      // If destination column is empty, append to the end of global array
      newBoard.tasks.push(updatedTask);
    } else if (destination.index >= destTasks.length) {
      // Placed at the end of the destination column
      const lastDestTask = destTasks[destTasks.length - 1];
      const lastDestTaskGlobalIndex = newBoard.tasks.findIndex(t => t.id === lastDestTask.id);
      newBoard.tasks.splice(lastDestTaskGlobalIndex + 1, 0, updatedTask);
    } else {
      // Placed somewhere in the middle or beginning
      const taskAtDest = destTasks[destination.index];
      const insertGlobalIndex = newBoard.tasks.findIndex(t => t.id === taskAtDest.id);
      newBoard.tasks.splice(insertGlobalIndex, 0, updatedTask);
    }
    
    setBoard(newBoard);
  };

  if (!isMounted) {
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

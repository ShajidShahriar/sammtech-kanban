'use client';

import React, { useState } from 'react';
import { Column } from './Column';
import { initialBoardData } from '@/lib/dummy-data';

export function Board() {
  const [board, setBoard] = useState(initialBoardData);

  return (
    <div className="flex-1 overflow-x-auto overflow-y-hidden p-6 h-full flex items-start gap-6">
      {board.columns.map(col => {
        const columnTasks = board.tasks.filter(task => task.status === col.id);
        return (
          <Column 
            key={col.id} 
            title={col.title} 
            tasks={columnTasks} 
          />
        );
      })}
    </div>
  );
}

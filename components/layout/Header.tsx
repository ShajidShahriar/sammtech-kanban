'use client';

import { Button } from '../ui/Button';
import { Plus } from 'lucide-react';
import { useKanbanBoard } from '@/hooks/useKanbanBoard';

export function Header() {
  const { setIsSidebarOpen, setEditingTaskId } = useKanbanBoard();

  return (
    <header className="flex items-center justify-between w-full h-16 shrink-0 px-6 bg-surface border-b border-outline">
      <h2 className="text-lg font-semibold text-foreground">Frontend Internship Task</h2>
      
      <div className="flex items-center gap-3">
        <Button 
          onClick={() => {
            setEditingTaskId(null); // Ensure it's for creating a new task
            setIsSidebarOpen(true);
          }}
          className="gap-2"
        >
          <Plus className="w-4 h-4" />
          <span>Add Task</span>
        </Button>
      </div>
    </header>
  );
}
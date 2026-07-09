'use client';

import { useKanbanBoard } from '@/hooks/useKanbanBoard';
import { Plus, LayoutList } from 'lucide-react';

export function MobileFABs() {
  const { 
    setIsModalOpen, 
    setEditingTaskId,
    setIsColumnModalOpen,
    setEditingColumn,
  } = useKanbanBoard();

  return (
    <div className="fixed bottom-24 right-4 z-50 flex sm:hidden flex-col gap-3">
      <button
        onClick={() => {
          setEditingColumn(undefined);
          setIsColumnModalOpen(true);
        }}
        className="tour-add-column flex items-center justify-center w-12 h-12 bg-secondary text-secondary-foreground rounded-full shadow-lg shadow-black/10 dark:shadow-white/5 active:scale-95 transition-transform"
        aria-label="Add Column"
      >
        <LayoutList className="w-5 h-5" />
      </button>
      
      <button
        onClick={() => {
          setEditingTaskId(null);
          setIsModalOpen(true);
        }}
        className="tour-add-task flex items-center justify-center w-14 h-14 bg-primary text-primary-foreground rounded-full shadow-xl shadow-primary/30 active:scale-95 transition-transform"
        aria-label="Add Task"
      >
        <Plus className="w-6 h-6" />
      </button>
    </div>
  );
}

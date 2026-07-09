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
    <div className="fixed bottom-24 right-4 z-40 flex sm:hidden flex-col gap-3">
      <button
        onClick={() => {
          setEditingColumn(undefined);
          setIsColumnModalOpen(true);
        }}
        className="tour-add-column w-12 h-12 flex items-center justify-center bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 rounded-full shadow-xl active:scale-95 transition-transform border border-gray-300 dark:border-gray-600"
        aria-label="Add Column"
      >
        <LayoutList className="w-5 h-5" />
      </button>
      
      <button
        onClick={() => {
          setEditingTaskId(null);
          setIsModalOpen(true);
        }}
        className="tour-add-task w-14 h-14 flex items-center justify-center bg-primary text-primary-foreground rounded-full shadow-xl active:scale-95 transition-transform border border-primary-foreground/20"
        aria-label="Add Task"
      >
        <Plus className="w-6 h-6" />
      </button>
    </div>
  );
}

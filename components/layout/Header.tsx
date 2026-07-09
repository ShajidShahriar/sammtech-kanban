'use client';

import { Button } from '../ui/Button';
import { Undo2, Redo2, Moon, Sun, Plus, HelpCircle } from 'lucide-react';
import { useKanbanBoard } from '@/hooks/useKanbanBoard';
import { useTheme } from '@/hooks/useTheme';
import { useTour } from '@/components/TourProvider';
import { motion } from 'framer-motion';
import { HorizontalCalendar } from '../board/HorizontalCalendar';

const MotionButton = motion.create(Button);

export function Header() {
  const { 
    setIsModalOpen, 
    setEditingTaskId,
    setIsColumnModalOpen,
    setEditingColumn,
    undo, 
    redo,
    canUndo,
    canRedo
  } = useKanbanBoard();
  
  const { isDark, toggle, mounted } = useTheme();
  const { startTour } = useTour();

  return (
    <header className="flex flex-col w-full shrink-0 bg-surface">
      <div className="flex items-center justify-between h-16 px-6 border-b border-outline">
        <div className="flex-1" /> {/* Spacer to push items to the right */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1 border-r border-outline pr-3">
            <Button variant="ghost" size="icon" onClick={undo} disabled={!canUndo} title="Undo (Ctrl/Cmd+Z)">
              <Undo2 className="w-4 h-4" />
            </Button>
            <Button variant="ghost" size="icon" onClick={redo} disabled={!canRedo} title="Redo (Ctrl/Cmd+Shift+Z)">
              <Redo2 className="w-4 h-4" />
            </Button>
          </div>
          {mounted && (
            <Button variant="ghost" size="icon" onClick={toggle} title="Toggle Theme" aria-label="Toggle Theme">
              {isDark ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </Button>
          )}
          <Button variant="ghost" onClick={startTour} className="gap-2 text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-100">
            <HelpCircle className="w-4 h-4" />
            <span className="hidden sm:inline">Tips</span>
          </Button>
          <MotionButton 
            layoutId="new-column"
            variant="secondary"
            onClick={() => {
              setEditingColumn(undefined);
              setIsColumnModalOpen(true);
            }}
            className="gap-2 ml-2 tour-add-column"
          >
            <Plus className="w-4 h-4" />
            <span className="hidden sm:inline">Add Column</span>
          </MotionButton>
          <MotionButton 
            layoutId="new-task"
            onClick={() => {
              setEditingTaskId(null);
              setIsModalOpen(true);
            }}
            className="gap-2 tour-add-task"
          >
            <Plus className="w-4 h-4" />
            <span className="hidden sm:inline">Add Task</span>
          </MotionButton>
        </div>
      </div>
      
      {/* Horizontal Calendar */}
      <HorizontalCalendar /> 

    </header>
  );
}
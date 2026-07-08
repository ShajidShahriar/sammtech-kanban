'use client';

import { useEffect } from 'react';
import { useKanbanBoard } from './useKanbanBoard';

export function useKeyboardShortcuts() {
  const {
    isModalOpen,
    isColumnModalOpen,
    setIsModalOpen,
    setEditingTaskId,
    undo,
    redo,
    canUndo,
    canRedo
  } = useKanbanBoard();

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement;
      const isInput = target.tagName === 'INPUT' || target.tagName === 'TEXTAREA' || target.isContentEditable;


      if (isInput) {
        if (e.key === 'Escape' && !isModalOpen && !isColumnModalOpen) {
          setIsModalOpen(false);
          setEditingTaskId(null);
        }
        return;
      }

      switch (e.key.toLowerCase()) {
        case 'n':
          if (!e.metaKey && !e.ctrlKey) {
            e.preventDefault();
            setEditingTaskId(null);
            setIsModalOpen(true);
          }
          break;
        case 'escape':
          if (!isModalOpen && !isColumnModalOpen) {
            setIsModalOpen(false);
            setEditingTaskId(null);
          }
          break;
        case 'z':
          if (e.metaKey || e.ctrlKey) {
            e.preventDefault();
            if (e.shiftKey) {
              if (canRedo) redo();
            } else {
              if (canUndo) undo();
            }
          }
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [setIsModalOpen, setEditingTaskId, undo, redo, canUndo, canRedo, isModalOpen, isColumnModalOpen]);
}

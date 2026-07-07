'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { BoardData, Task } from '@/types';
import { initialBoardData } from '@/lib/dummy-data';

const STORAGE_KEY = 'sammtech_kanban_board_data';

interface KanbanContextType {
  board: BoardData;
  isLoaded: boolean;
  updateBoard: (newBoard: BoardData) => void;
  addTask: (task: Task) => void;
  updateTask: (taskId: string, updates: Partial<Task>) => void;
  deleteTask: (taskId: string) => void;
  // UI state for sidebar
  isSidebarOpen: boolean;
  setIsSidebarOpen: (isOpen: boolean) => void;
  editingTaskId: string | null;
  setEditingTaskId: (id: string | null) => void;
}

const KanbanContext = createContext<KanbanContextType | undefined>(undefined);

export function KanbanProvider({ children }: { children: React.ReactNode }) {
  const [board, setBoard] = useState<BoardData>(initialBoardData);
  const [isLoaded, setIsLoaded] = useState(false);
  
  // Sidebar state
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [editingTaskId, setEditingTaskId] = useState<string | null>(null);

  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        setBoard(JSON.parse(stored));
      }
    } catch (e) {
      console.error('Failed to load board data from local storage', e);
    }
    setIsLoaded(true);
  }, []);

  useEffect(() => {
    if (isLoaded) {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(board));
      } catch (e) {
        console.error('Failed to save board data to local storage', e);
      }
    }
  }, [board, isLoaded]);

  const updateBoard = (newBoard: BoardData) => {
    setBoard(newBoard);
  };

  const addTask = (task: Task) => {
    setBoard(prev => ({
      ...prev,
      tasks: [...prev.tasks, task]
    }));
  };

  const updateTask = (taskId: string, updates: Partial<Task>) => {
    setBoard(prev => ({
      ...prev,
      tasks: prev.tasks.map(t => (t.id === taskId ? { ...t, ...updates } : t))
    }));
  };

  const deleteTask = (taskId: string) => {
    setBoard(prev => ({
      ...prev,
      tasks: prev.tasks.filter(t => t.id !== taskId)
    }));
  };

  return React.createElement(
    KanbanContext.Provider,
    {
      value: { 
        board, updateBoard, addTask, updateTask, deleteTask, isLoaded,
        isSidebarOpen, setIsSidebarOpen, editingTaskId, setEditingTaskId
      }
    },
    children
  );
}

export function useKanbanBoard() {
  const context = useContext(KanbanContext);
  if (context === undefined) {
    throw new Error('useKanbanBoard must be used within a KanbanProvider');
  }
  return context;
}

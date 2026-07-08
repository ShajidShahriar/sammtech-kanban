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
  addColumn: (title: string) => void;
  updateColumn: (columnId: string, title: string) => void;
  deleteColumn: (columnId: string) => void;
  addLabel: (name: string, color: string, id?: string) => void;
  deleteLabel: (labelId: string) => void;
  undo: () => void;
  redo: () => void;
  canUndo: boolean;
  canRedo: boolean;
  // UI state for sidebar
  isModalOpen: boolean;
  setIsModalOpen: (isOpen: boolean) => void;
  editingTaskId: string | null;
  setEditingTaskId: (id: string | null) => void;
  isColumnModalOpen: boolean;
  setIsColumnModalOpen: (isOpen: boolean) => void;
  editingColumn: { id: string; title: string } | undefined;
  setEditingColumn: (column: { id: string; title: string } | undefined) => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  assigneeFilter: string;
  setAssigneeFilter: (id: string) => void;
  priorityFilter: string;
  setPriorityFilter: (priority: string) => void;
  labelFilter: string;
  setLabelFilter: (id: string) => void;
  dateFilter: string | null;
  setDateFilter: (date: string | null) => void;
}

const KanbanContext = createContext<KanbanContextType | undefined>(undefined);

export function KanbanProvider({ children }: { children: React.ReactNode }) {
  const [historyState, setHistoryState] = useState<{
    past: BoardData[];
    present: BoardData;
    future: BoardData[];
  }>({
    past: [],
    present: initialBoardData,
    future: []
  });
  const board = historyState.present;

  const [isLoaded, setIsLoaded] = useState(false);

  // Custom setBoard to handle history and broadcasting
  const setBoard = (newBoard: BoardData | ((prev: BoardData) => BoardData), addToHistory = true, broadcast = true) => {
    setHistoryState(curr => {
      const resolvedBoard = typeof newBoard === 'function' ? newBoard(curr.present) : newBoard;
      
      let nextState = { ...curr, present: resolvedBoard };

      if (addToHistory) {
        const newPast = [...curr.past, curr.present];
        if (newPast.length > 50) newPast.shift();
        nextState = {
          past: newPast,
          present: resolvedBoard,
          future: []
        };
      }

      if (broadcast) {
        try {
          const channel = new BroadcastChannel('kanban_sync');
          channel.postMessage(resolvedBoard);
          channel.close();
        } catch (e) {
          console.error('BroadcastChannel failed', e);
        }
      }

      return nextState;
    });
  };

  const undo = () => {
    setHistoryState(curr => {
      if (curr.past.length === 0) return curr;
      const previous = curr.past[curr.past.length - 1];
      const newPast = curr.past.slice(0, curr.past.length - 1);
      
      const nextState = {
        past: newPast,
        present: previous,
        future: [curr.present, ...curr.future]
      };

      try {
        const channel = new BroadcastChannel('kanban_sync');
        channel.postMessage(previous);
        channel.close();
      } catch (e) {}

      return nextState;
    });
  };

  const redo = () => {
    setHistoryState(curr => {
      if (curr.future.length === 0) return curr;
      const next = curr.future[0];
      const newFuture = curr.future.slice(1);

      const nextState = {
        past: [...curr.past, curr.present],
        present: next,
        future: newFuture
      };

      try {
        const channel = new BroadcastChannel('kanban_sync');
        channel.postMessage(next);
        channel.close();
      } catch (e) {}

      return nextState;
    });
  };

  const canUndo = historyState.past.length > 0;
  const canRedo = historyState.future.length > 0;

  // Sidebar state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTaskId, setEditingTaskId] = useState<string | null>(null);

  // Column modal state
  const [isColumnModalOpen, setIsColumnModalOpen] = useState(false);
  const [editingColumn, setEditingColumn] = useState<{ id: string; title: string } | undefined>();

  const [searchQuery, setSearchQuery] = useState('');
  const [assigneeFilter, setAssigneeFilter] = useState('');
  const [priorityFilter, setPriorityFilter] = useState('');
  const [labelFilter, setLabelFilter] = useState('');
  const [dateFilter, setDateFilter] = useState<string | null>(null);

  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        
        // Ensure old stored data gets the outline style for labels
        if (!parsed.labels) {
          parsed.labels = initialBoardData.labels;
        } else {
          parsed.labels = parsed.labels.map((l: any) => ({ ...l, color: 'outline' }));
        }

        if (parsed.tasks) {
          parsed.tasks = parsed.tasks.map((t: any) => ({
            ...t,
            labels: t.labels ? t.labels.map((l: any) => ({ ...l, color: 'outline' })) : []
          }));
        }

        setHistoryState({ past: [], present: parsed, future: [] });
      } else {
        setHistoryState({ past: [], present: initialBoardData, future: [] });
      }
    } catch (e) {
      console.error('Failed to load board data from local storage', e);
      setHistoryState({ past: [], present: initialBoardData, future: [] });
    }
    setIsLoaded(true);

    // Setup BroadcastChannel for cross-tab sync
    const channel = new BroadcastChannel('kanban_sync');
    channel.onmessage = (event) => {
      const newBoard = event.data;
      setHistoryState(curr => ({ ...curr, present: newBoard }));
    };
    return () => channel.close();
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

  const addColumn = (title: string) => {
    const newColumn = { id: `col-${Date.now()}`, title };
    setBoard(prev => ({
      ...prev,
      columns: [...prev.columns, newColumn]
    }));
  };

  const updateColumn = (columnId: string, title: string) => {
    setBoard(prev => ({
      ...prev,
      columns: prev.columns.map(c => c.id === columnId ? { ...c, title } : c)
    }));
  };

  const deleteColumn = (columnId: string) => {
    setBoard(prev => ({
      ...prev,
      columns: prev.columns.filter(c => c.id !== columnId),
      // Option A: Delete all tasks associated with this column
      tasks: prev.tasks.filter(t => t.status !== columnId)
    }));
  };

  const addLabel = (name: string, color: string, id?: string) => {
    const newLabel = { id: id || `label-${Date.now()}`, name, color };
    setBoard(prev => ({
      ...prev,
      labels: [...(prev.labels || []), newLabel]
    }));
  };

  const deleteLabel = (labelId: string) => {
    setBoard(prev => ({
      ...prev,
      labels: (prev.labels || []).filter(l => l.id !== labelId),
      // Also remove it from all tasks
      tasks: prev.tasks.map(t => ({
        ...t,
        labels: t.labels.filter(l => l.id !== labelId)
      }))
    }));
  };

  return React.createElement(
    KanbanContext.Provider,
    {
      value: { 
        board, updateBoard, addTask, updateTask, deleteTask, isLoaded,
        addColumn, updateColumn, deleteColumn, addLabel, deleteLabel,
        undo, redo, canUndo, canRedo,
        isModalOpen, setIsModalOpen, editingTaskId, setEditingTaskId,
        isColumnModalOpen, setIsColumnModalOpen, editingColumn, setEditingColumn,
        searchQuery, setSearchQuery, assigneeFilter, setAssigneeFilter,
        priorityFilter, setPriorityFilter, labelFilter, setLabelFilter,
        dateFilter, setDateFilter
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

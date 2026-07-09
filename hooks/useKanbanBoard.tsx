'use client';

import React, { createContext, useContext, useState, useEffect, useCallback, useRef } from 'react';
import { BoardData, Task, LabelColor } from '@/types';
import { initialBoardData } from '@/lib/dummy-data';

const STORAGE_KEY = 'sammtech_kanban_board_data';
const HISTORY_LIMIT = 50;


interface BoardDataContextType {
  board: BoardData;
  isLoaded: boolean;
  updateBoard: (newBoard: BoardData) => void;
  addTask: (task: Task) => void;
  updateTask: (taskId: string, updates: Partial<Task>) => void;
  deleteTask: (taskId: string) => void;
  addColumn: (title: string) => void;
  updateColumn: (columnId: string, title: string) => void;
  deleteColumn: (columnId: string) => void;
  addLabel: (name: string, color: LabelColor, id?: string) => void;
  deleteLabel: (labelId: string) => void;
  undo: () => void;
  redo: () => void;
  canUndo: boolean;
  canRedo: boolean;
}

const BoardDataContext = createContext<BoardDataContextType | undefined>(undefined);


interface BoardUIContextType {
  isModalOpen: boolean;
  setIsModalOpen: (isOpen: boolean) => void;
  editingTaskId: string | null;
  setEditingTaskId: (id: string | null) => void;
  isColumnModalOpen: boolean;
  setIsColumnModalOpen: (isOpen: boolean) => void;
  editingColumn: { id: string; title: string } | undefined;
  setEditingColumn: (column: { id: string; title: string } | undefined) => void;
}

const BoardUIContext = createContext<BoardUIContextType | undefined>(undefined);


interface FilterContextType {
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

const FilterContext = createContext<FilterContextType | undefined>(undefined);

function getTodayDateStr() {
  const today = new Date();
  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, '0');
  const day = String(today.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}


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

  const channelRef = useRef<BroadcastChannel | null>(null);

  const broadcast = useCallback((data: BoardData) => {
    try {
      if (!channelRef.current) {
        channelRef.current = new BroadcastChannel('kanban_sync');
      }
      channelRef.current.postMessage(data);
    } catch (e) {
      console.error('BroadcastChannel failed', e);
    }
  }, []);

  const setBoard = useCallback((
    newBoard: BoardData | ((prev: BoardData) => BoardData),
    addToHistory = true,
    shouldBroadcast = true
  ) => {
    setHistoryState(curr => {
      const resolvedBoard = typeof newBoard === 'function' ? newBoard(curr.present) : newBoard;

      let nextState = { ...curr, present: resolvedBoard };

      if (addToHistory) {
        const newPast = [...curr.past, curr.present].slice(-HISTORY_LIMIT);
        nextState = {
          past: newPast,
          present: resolvedBoard,
          future: []
        };
      }

      return nextState;
    });

    if (shouldBroadcast) {
      const resolvedForBroadcast = typeof newBoard === 'function'
        ? newBoard(historyState.present)
        : newBoard;
      broadcast(resolvedForBroadcast);
    }
  }, [broadcast, historyState.present]);

  const undo = useCallback(() => {
    setHistoryState(curr => {
      if (curr.past.length === 0) return curr;
      const previous = curr.past[curr.past.length - 1];
      const newPast = curr.past.slice(0, -1);

      broadcast(previous);

      return {
        past: newPast,
        present: previous,
        future: [curr.present, ...curr.future]
      };
    });
  }, [broadcast]);

  const redo = useCallback(() => {
    setHistoryState(curr => {
      if (curr.future.length === 0) return curr;
      const next = curr.future[0];
      const newFuture = curr.future.slice(1);

      broadcast(next);

      return {
        past: [...curr.past, curr.present],
        present: next,
        future: newFuture
      };
    });
  }, [broadcast]);

  const canUndo = historyState.past.length > 0;
  const canRedo = historyState.future.length > 0;

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTaskId, setEditingTaskId] = useState<string | null>(null);
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

    const receiveChannel = new BroadcastChannel('kanban_sync');
    receiveChannel.onmessage = (event) => {
      const newBoard = event.data;
      setHistoryState(curr => ({ ...curr, present: newBoard }));
    };
    return () => {
      receiveChannel.close();
      channelRef.current?.close();
      channelRef.current = null;
    };
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

  const updateBoard = useCallback((newBoard: BoardData) => {
    setBoard(newBoard);
  }, [setBoard]);

  const addTask = useCallback((task: Task) => {
    setBoard(prev => ({
      ...prev,
      tasks: [...prev.tasks, task]
    }));
  }, [setBoard]);

  const updateTask = useCallback((taskId: string, updates: Partial<Task>) => {
    setBoard(prev => ({
      ...prev,
      tasks: prev.tasks.map(t => (t.id === taskId ? { ...t, ...updates } : t))
    }));
  }, [setBoard]);

  const deleteTask = useCallback((taskId: string) => {
    setBoard(prev => ({
      ...prev,
      tasks: prev.tasks.filter(t => t.id !== taskId)
    }));
  }, [setBoard]);

  const addColumn = useCallback((title: string) => {
    const newColumn = { id: crypto.randomUUID(), title };
    setBoard(prev => ({
      ...prev,
      columns: [...prev.columns, newColumn]
    }));
  }, [setBoard]);

  const updateColumn = useCallback((columnId: string, title: string) => {
    setBoard(prev => ({
      ...prev,
      columns: prev.columns.map(c => c.id === columnId ? { ...c, title } : c)
    }));
  }, [setBoard]);

  const deleteColumn = useCallback((columnId: string) => {
    setBoard(prev => ({
      ...prev,
      columns: prev.columns.filter(c => c.id !== columnId),
      tasks: prev.tasks.filter(t => t.status !== columnId)
    }));
  }, [setBoard]);

  const addLabel = useCallback((name: string, color: LabelColor, id?: string) => {
    const newLabel = { id: id || crypto.randomUUID(), name, color };
    setBoard(prev => ({
      ...prev,
      labels: [...(prev.labels || []), newLabel]
    }));
  }, [setBoard]);

  const deleteLabel = useCallback((labelId: string) => {
    setBoard(prev => ({
      ...prev,
      labels: (prev.labels || []).filter(l => l.id !== labelId),
      tasks: prev.tasks.map(t => ({
        ...t,
        labels: t.labels.filter(l => l.id !== labelId)
      }))
    }));
  }, [setBoard]);

  const boardDataValue: BoardDataContextType = {
    board, isLoaded, updateBoard, addTask, updateTask, deleteTask,
    addColumn, updateColumn, deleteColumn, addLabel, deleteLabel,
    undo, redo, canUndo, canRedo
  };

  const boardUIValue: BoardUIContextType = {
    isModalOpen, setIsModalOpen, editingTaskId, setEditingTaskId,
    isColumnModalOpen, setIsColumnModalOpen, editingColumn, setEditingColumn
  };

  const filterValue: FilterContextType = {
    searchQuery, setSearchQuery, assigneeFilter, setAssigneeFilter,
    priorityFilter, setPriorityFilter, labelFilter, setLabelFilter,
    dateFilter, setDateFilter
  };

  return (
    <BoardDataContext.Provider value={boardDataValue}>
      <BoardUIContext.Provider value={boardUIValue}>
        <FilterContext.Provider value={filterValue}>
          {children}
        </FilterContext.Provider>
      </BoardUIContext.Provider>
    </BoardDataContext.Provider>
  );
}


export function useBoardData() {
  const context = useContext(BoardDataContext);
  if (context === undefined) {
    throw new Error('useBoardData must be used within a KanbanProvider');
  }
  return context;
}

export function useBoardUI() {
  const context = useContext(BoardUIContext);
  if (context === undefined) {
    throw new Error('useBoardUI must be used within a KanbanProvider');
  }
  return context;
}

export function useFilters() {
  const context = useContext(FilterContext);
  if (context === undefined) {
    throw new Error('useFilters must be used within a KanbanProvider');
  }
  return context;
}


export function useKanbanBoard() {
  return {
    ...useBoardData(),
    ...useBoardUI(),
    ...useFilters()
  };
}

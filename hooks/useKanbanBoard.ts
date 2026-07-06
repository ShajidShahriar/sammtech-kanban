import { useState, useEffect } from 'react';
import { BoardData } from '@/types';
import { initialBoardData } from '@/lib/dummy-data';

const STORAGE_KEY = 'sammtech_kanban_board_data';

export function useKanbanBoard() {
  const [board, setBoard] = useState<BoardData>(initialBoardData);
  const [isLoaded, setIsLoaded] = useState(false);

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

  return { board, updateBoard, isLoaded };
}

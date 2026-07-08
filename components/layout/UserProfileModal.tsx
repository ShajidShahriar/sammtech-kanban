'use client';

import React, { useRef } from 'react';
import { Modal } from '../ui/Modal';
import { Heatmap } from '../ui/Heatmap';
import { Avatar } from '../ui/Avatar';
import { Button } from '../ui/Button';
import { Download, Upload, LogOut } from 'lucide-react';
import { useKanbanBoard } from '@/hooks/useKanbanBoard';
import { BoardData } from '@/types';

interface UserProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
}

// Issue #2: Structural validation for imported JSON
function validateBoardJson(json: any): json is { tasks: any[]; columns: any[]; labels?: any[] } {
  if (!json || typeof json !== 'object') return false;
  if (!Array.isArray(json.tasks) || !Array.isArray(json.columns)) return false;

  // Validate each column
  for (const col of json.columns) {
    if (!col || typeof col.id !== 'string' || typeof col.title !== 'string') return false;
  }

  // Validate each task
  for (const task of json.tasks) {
    if (!task || typeof task.id !== 'string' || typeof task.title !== 'string') return false;
    if (typeof task.status !== 'string' || typeof task.priority !== 'string') return false;
    if (typeof task.description !== 'string') return false;
    if (!Array.isArray(task.labels)) return false;
  }

  // Validate labels if present
  if (json.labels !== undefined) {
    if (!Array.isArray(json.labels)) return false;
    for (const label of json.labels) {
      if (!label || typeof label.id !== 'string' || typeof label.name !== 'string') return false;
    }
  }

  return true;
}

export function UserProfileModal({ isOpen, onClose }: UserProfileModalProps) {
  const { board, updateBoard } = useKanbanBoard();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [importError, setImportError] = React.useState<string | null>(null);

  const handleExport = () => {
    const dataStr = JSON.stringify(board, null, 2);
    const blob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `kanban-backup-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const handleImportClick = () => {
    setImportError(null);
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const json = JSON.parse(event.target?.result as string);
        if (validateBoardJson(json)) {
          if (!json.labels) json.labels = [];
          updateBoard(json as BoardData);
          setImportError(null);
          onClose();
        } else {
          setImportError('Invalid format: missing required fields (tasks, columns, or their properties).');
        }
      } catch {
        setImportError('Failed to parse JSON file. Make sure it\'s a valid JSON file.');
      }
    };
    reader.readAsText(file);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleSignOut = () => {
    localStorage.removeItem('theme');
    setImportError(null);
    onClose();
    // In a real app this would redirect to login
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="User Profile"
      layoutId="user-profile"
    >
      <div className="flex flex-col gap-8">
        <div className="flex items-center gap-4">
          <Avatar src="https://api.dicebear.com/7.x/avataaars/svg?seed=Me" alt="My Avatar" className="w-16 h-16 border border-gray-200 dark:border-white/20" />
          <div className="flex flex-col">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">Admin User</h2>
            <p className="text-sm text-gray-500 dark:text-gray-400">admin@example.com</p>
          </div>
        </div>

        <div className="flex flex-col gap-3">
          <h3 className="text-sm font-semibold text-gray-900 dark:text-gray-100">Activity Heatmap</h3>
          <div className="p-4 rounded-xl border border-gray-200 dark:border-white/20 bg-card-muted dark:bg-card-muted-dark overflow-x-auto flex justify-center">
            <Heatmap />
          </div>
        </div>

        <div className="flex flex-col gap-3">
          <h3 className="text-sm font-semibold text-gray-900 dark:text-gray-100">Settings</h3>
          <div className="flex flex-col gap-2">
            <Button variant="outline" className="justify-start gap-2 w-full text-gray-700 dark:text-gray-300" onClick={handleExport}>
              <Download className="w-4 h-4" />
              Export Data (JSON)
            </Button>
            <input 
              type="file" 
              accept=".json" 
              ref={fileInputRef} 
              className="hidden" 
              onChange={handleFileChange}
            />
            <Button variant="outline" className="justify-start gap-2 w-full text-gray-700 dark:text-gray-300" onClick={handleImportClick}>
              <Upload className="w-4 h-4" />
              Import Data (JSON)
            </Button>
            {importError && (
              <p className="text-xs text-red-500 px-1">{importError}</p>
            )}
            <Button 
              variant="outline" 
              className="justify-start gap-2 w-full text-red-600 dark:text-red-500 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-950/30"
              onClick={handleSignOut}
            >
              <LogOut className="w-4 h-4" />
              Sign Out
            </Button>
          </div>
        </div>
      </div>
    </Modal>
  );
}

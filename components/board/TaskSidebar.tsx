'use client';

import React, { useState, useEffect } from 'react';
import { Task, Priority } from '@/types';
import { Drawer } from '../ui/Drawer';
import { Input } from '../ui/Input';
import { Textarea } from '../ui/Textarea';
import { Select } from '../ui/Select';
import { Button } from '../ui/Button';
import { MarkdownRenderer } from '../ui/MarkdownRenderer';
import { DUMMY_USERS } from '@/lib/dummy-data';
import { useKanbanBoard } from '@/hooks/useKanbanBoard';
import { cn } from '@/lib/utils';

interface TaskSidebarProps {
  isOpen: boolean;
  onClose: () => void;
  initialData?: Task;
  onSave: (task: Task) => void;
  onDelete?: (taskId: string) => void;
}

export function TaskSidebar({ isOpen, onClose, initialData, onSave, onDelete }: TaskSidebarProps) {
  const { board } = useKanbanBoard();

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [status, setStatus] = useState(board.columns[0]?.id || '');
  const [priority, setPriority] = useState<Priority>('Medium');
  const [dueDate, setDueDate] = useState('');
  const [assigneeId, setAssigneeId] = useState('');
  const [selectedLabels, setSelectedLabels] = useState<string[]>([]);

  const [previewMode, setPreviewMode] = useState(false);

  useEffect(() => {
    if (isOpen) {
      if (initialData) {
        setTitle(initialData.title);
        setDescription(initialData.description);
        setStatus(initialData.status);
        setPriority(initialData.priority);
        setDueDate(initialData.dueDate || '');
        setAssigneeId(initialData.assignee?.id || '');
        setSelectedLabels(initialData.labels.map(l => l.id));
      } else {
        setTitle('');
        setDescription('');
        setStatus(board.columns[0]?.id || '');
        setPriority('Medium');
        setDueDate('');
        setAssigneeId('');
        setSelectedLabels([]);
      }
      setPreviewMode(false);
    }
  }, [isOpen, initialData, board.columns]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    const assignee = DUMMY_USERS.find(u => u.id === assigneeId);
    const labels = (board.labels || []).filter(l => selectedLabels.includes(l.id));

    const taskData: Task = {
      id: initialData?.id || crypto.randomUUID(),
      title,
      description,
      status,
      priority,
      labels,
      assignee,
      dueDate: dueDate || undefined,
    };

    onSave(taskData);
    onClose();
  };

  const toggleLabel = (labelId: string) => {
    setSelectedLabels(prev =>
      prev.includes(labelId) ? prev.filter(id => id !== labelId) : [...prev, labelId]
    );
  };

  const isEditing = !!initialData;
  const availableLabels = board.labels || [];

  return (
    <Drawer
      isOpen={isOpen}
      onClose={onClose}
      title={isEditing ? 'Edit Task' : 'Create New Task'}
    >
      <form onSubmit={handleSubmit} className="flex flex-col gap-6 h-full pb-8">

        <div className="flex flex-col gap-2">
          <label className="text-sm font-medium text-foreground">Title</label>
          <Input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="e.g. Build UI layout"
            autoFocus
            required
          />
        </div>

        <div className="flex flex-col gap-2">
          <div className="flex items-center justify-between">
            <label className="text-sm font-medium text-foreground">Description</label>
            <button
              type="button"
              onClick={() => setPreviewMode(!previewMode)}
              className="text-xs text-gray-900 dark:text-gray-100 font-medium hover:underline"
            >
              {previewMode ? 'Edit Markdown' : 'Preview'}
            </button>
          </div>
          {previewMode ? (
            <div className="min-h-32 p-3 border border-gray-200 dark:border-white/10 rounded-md bg-card dark:bg-card-dark overflow-y-auto">
              <MarkdownRenderer content={description || '*No description provided.*'} />
            </div>
          ) : (
            <Textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Use markdown (**bold**, _italic_, - lists)"
              className="min-h-32"
            />
          )}
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium text-foreground">Status</label>
            <Select value={status} onChange={(e) => setStatus(e.target.value)}>
              {board.columns.map(col => (
                <option key={col.id} value={col.id}>{col.title}</option>
              ))}
            </Select>
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium text-foreground">Priority</label>
            <Select value={priority} onChange={(e) => setPriority(e.target.value as Priority)}>
              <option value="Low">Low</option>
              <option value="Medium">Medium</option>
              <option value="High">High</option>
            </Select>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium text-foreground">Assignee</label>
            <Select value={assigneeId} onChange={(e) => setAssigneeId(e.target.value)}>
              <option value="">Unassigned</option>
              {DUMMY_USERS.map(user => (
                <option key={user.id} value={user.id}>{user.name}</option>
              ))}
            </Select>
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium text-foreground">Due Date</label>
            <Input
              type="date"
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
            />
          </div>
        </div>

        <div className="flex flex-col gap-2">
          <label className="text-sm font-medium text-foreground">Labels</label>
          <div className="flex flex-wrap gap-2">
            {availableLabels.map(label => {
              const isSelected = selectedLabels.includes(label.id);
              return (
                <button
                  key={label.id}
                  type="button"
                  onClick={() => toggleLabel(label.id)}
                  className={cn(
                    "px-3 py-1 text-xs font-medium rounded-md border transition-colors",
                    isSelected
                      ? "bg-gray-900 dark:bg-white text-white dark:text-black border-transparent"
                      : "bg-white dark:bg-card-dark text-gray-600 dark:text-gray-400 border-gray-200 dark:border-white/10 hover:bg-gray-50 dark:hover:bg-white/5"
                  )}
                >
                  {label.name}
                </button>
              );
            })}
          </div>
        </div>

        <div className="mt-auto pt-6 flex flex-col gap-3">
          <Button type="submit" className="w-full">
            {isEditing ? 'Save Changes' : 'Create Task'}
          </Button>

          {isEditing && onDelete && (
            <Button
              type="button"
              variant="danger"
              className="w-full"
              onClick={() => {
                onDelete(initialData.id);
                onClose();
              }}
            >
              Delete Task
            </Button>
          )}
        </div>
      </form>
    </Drawer>
  );
}

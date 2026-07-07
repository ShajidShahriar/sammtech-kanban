import React, { useState, useEffect } from 'react';
import { Task, Priority, Label, Assignee } from '@/types';
import { Modal } from '../ui/Modal';
import { Input } from '../ui/Input';
import { Textarea } from '../ui/Textarea';
import { Select } from '../ui/Select';
import { Button } from '../ui/Button';
import { Badge } from '../ui/Badge';
import { ToggleBadge } from '../ui/ToggleBadge';
import { MarkdownBox } from '../ui/MarkdownBox';
import { AVAILABLE_LABELS, DUMMY_USERS } from '@/lib/dummy-data';
import { cn } from '@/lib/utils';

interface TaskModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialData?: Task;
  onSave: (task: Task) => void;
  onDelete?: (taskId: string) => void;
}

export function TaskModal({ isOpen, onClose, initialData, onSave, onDelete }: TaskModalProps) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [status, setStatus] = useState('Todo');
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
        setSelectedLabels(initialData.labels?.map(l => l.id) || []);
      } else {
        setTitle('');
        setDescription('');
        setStatus('Todo');
        setPriority('Medium');
        setDueDate('');
        setAssigneeId('');
        setSelectedLabels([]);
      }
      setPreviewMode(false);
    }
  }, [isOpen, initialData]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    const assignee = DUMMY_USERS.find(u => u.id === assigneeId);
    const labels = AVAILABLE_LABELS.filter(l => selectedLabels.includes(l.id));

    const taskData: Task = {
      id: initialData?.id || `task-${Date.now()}`,
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

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={isEditing ? 'Edit Task' : 'Create New Task'}
      layoutId={isEditing ? initialData.id : 'new-task'}
    >
      <form onSubmit={handleSubmit} className="flex flex-col gap-6">
        
        <div className="flex flex-col gap-2">
          <label className="text-sm font-medium text-gray-900 dark:text-gray-100">Title</label>
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
            <label className="text-sm font-medium text-gray-900 dark:text-gray-100">Description</label>
            <button 
              type="button" 
              onClick={() => setPreviewMode(!previewMode)}
              className="text-xs text-blue-600 dark:text-blue-400 font-medium hover:underline"
            >
              {previewMode ? 'Edit Markdown' : 'Preview'}
            </button>
          </div>
          {previewMode ? (
            <MarkdownBox content={description || '*No description provided.*'} className="min-h-32" />
          ) : (
            <Textarea 
              value={description} 
              onChange={(e) => setDescription(e.target.value)} 
              placeholder="Use markdown (**bold**, _italic_, - lists)" 
              className="min-h-32"
            />
          )}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
          <div className="flex flex-col gap-4">
            <div className="flex flex-col gap-2">
              <label className="text-sm font-medium text-gray-900 dark:text-gray-100">Status</label>
              <Select value={status} onChange={(e) => setStatus(e.target.value)}>
                <option value="Backlog">Backlog</option>
                <option value="Todo">Todo</option>
                <option value="In Progress">In Progress</option>
                <option value="Review">Review</option>
                <option value="Done">Done</option>
              </Select>
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-sm font-medium text-gray-900 dark:text-gray-100">Priority</label>
              <Select value={priority} onChange={(e) => setPriority(e.target.value as Priority)}>
                <option value="Low">Low</option>
                <option value="Medium">Medium</option>
                <option value="High">High</option>
              </Select>
            </div>
          </div>

          <div className="flex flex-col gap-4">
            <div className="flex flex-col gap-2">
              <label className="text-sm font-medium text-gray-900 dark:text-gray-100">Assignee</label>
              <Select value={assigneeId} onChange={(e) => setAssigneeId(e.target.value)}>
                <option value="">Unassigned</option>
                {DUMMY_USERS.map(user => (
                  <option key={user.id} value={user.id}>{user.name}</option>
                ))}
              </Select>
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-sm font-medium text-gray-900 dark:text-gray-100">Due Date</label>
              <Input 
                type="date" 
                value={dueDate} 
                onChange={(e) => setDueDate(e.target.value)} 
              />
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-2">
          <label className="text-sm font-medium text-gray-900 dark:text-gray-100">Labels</label>
          <div className="flex flex-wrap gap-2">
            {AVAILABLE_LABELS.map(label => {
              const isSelected = selectedLabels.includes(label.id);
              return (
                <ToggleBadge
                  key={label.id}
                  selected={isSelected}
                  selectedColor={label.color}
                  onClick={() => toggleLabel(label.id)}
                >
                  {label.name}
                </ToggleBadge>
              );
            })}
          </div>
        </div>

        <div className="pt-6 flex items-center justify-end gap-3 mt-4 border-t border-gray-200 dark:border-white/10">
          {isEditing && onDelete && (
            <Button 
              type="button" 
              variant="danger" 
              className="mr-auto"
              onClick={() => {
                onDelete(initialData.id);
                onClose();
              }}
            >
              Delete
            </Button>
          )}
          
          <Button type="button" variant="ghost" onClick={onClose}>
            Cancel
          </Button>
          
          <Button type="submit">
            {isEditing ? 'Save Changes' : 'Create Task'}
          </Button>
        </div>
      </form>
    </Modal>
  );
}

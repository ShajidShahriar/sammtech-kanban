import React, { useState, useEffect } from 'react';
import { Task, Priority } from '@/types';
import { Drawer } from '../ui/Drawer';
import { Input } from '../ui/Input';
import { Textarea } from '../ui/Textarea';
import { Select } from '../ui/Select';
import { Button } from '../ui/Button';

interface TaskSidebarProps {
  isOpen: boolean;
  onClose: () => void;
  initialData?: Task;
  onSave: (task: Task) => void;
  onDelete?: (taskId: string) => void;
}

export function TaskSidebar({ isOpen, onClose, initialData, onSave, onDelete }: TaskSidebarProps) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [status, setStatus] = useState('Todo');
  const [priority, setPriority] = useState<Priority>('Medium');

  useEffect(() => {
    if (isOpen) {
      if (initialData) {
        setTitle(initialData.title);
        setDescription(initialData.description);
        setStatus(initialData.status);
        setPriority(initialData.priority);
      } else {
        setTitle('');
        setDescription('');
        setStatus('Todo');
        setPriority('Medium');
      }
    }
  }, [isOpen, initialData]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    const taskData: Task = {
      id: initialData?.id || `task-${Date.now()}`,
      title,
      description,
      status,
      priority,
      labels: initialData?.labels || [],
      assignee: initialData?.assignee,
      dueDate: initialData?.dueDate,
    };

    onSave(taskData);
    onClose();
  };

  const isEditing = !!initialData;

  return (
    <Drawer
      isOpen={isOpen}
      onClose={onClose}
      title={isEditing ? 'Edit Task' : 'Create New Task'}
    >
      <form onSubmit={handleSubmit} className="flex flex-col gap-5 h-full">
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
          <label className="text-sm font-medium text-foreground">Description</label>
          <Textarea 
            value={description} 
            onChange={(e) => setDescription(e.target.value)} 
            placeholder="Add a more detailed description..." 
          />
        </div>

        <div className="flex flex-col gap-2">
          <label className="text-sm font-medium text-foreground">Status</label>
          <Select value={status} onChange={(e) => setStatus(e.target.value)}>
            <option value="Backlog">Backlog</option>
            <option value="Todo">Todo</option>
            <option value="In Progress">In Progress</option>
            <option value="Review">Review</option>
            <option value="Done">Done</option>
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

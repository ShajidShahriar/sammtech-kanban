import React, { useState, useEffect } from 'react';
import { Modal } from '../ui/Modal';
import { Input } from '../ui/Input';
import { Button } from '../ui/Button';

interface ColumnModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialData?: { id: string; title: string };
  onSave: (title: string) => void;
}

export function ColumnModal({ isOpen, onClose, initialData, onSave }: ColumnModalProps) {
  const [title, setTitle] = useState('');

  useEffect(() => {
    if (isOpen) {
      setTitle(initialData ? initialData.title : '');
    }
  }, [isOpen, initialData]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (title.trim()) {
      onSave(title.trim());
      onClose();
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={initialData ? 'Edit Column' : 'Add New Column'}
      layoutId={initialData ? `column-${initialData.id}` : 'new-column'}
    >
      <form onSubmit={handleSubmit} className="flex flex-col gap-6">
        <div className="flex flex-col gap-2">
          <label className="text-sm font-medium text-gray-900 dark:text-gray-100">Column Title</label>
          <Input 
            value={title} 
            onChange={(e) => setTitle(e.target.value)} 
            placeholder="e.g. Needs Review" 
            autoFocus
            required 
          />
        </div>
        <div className="pt-2 flex items-center justify-end gap-3">
          <Button type="button" variant="ghost" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit">
            {initialData ? 'Save Changes' : 'Add Column'}
          </Button>
        </div>
      </form>
    </Modal>
  );
}

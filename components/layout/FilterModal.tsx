'use client';

import React from 'react';
import { Modal } from '../ui/Modal';
import { Select } from '../ui/Select';
import { useKanbanBoard } from '@/hooks/useKanbanBoard';
import { DUMMY_USERS } from '@/lib/dummy-data';
import { X } from 'lucide-react';
import { Button } from '../ui/Button';

interface FilterModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function FilterModal({ isOpen, onClose }: FilterModalProps) {
  const {
    board,
    assigneeFilter, setAssigneeFilter,
    labelFilter, setLabelFilter,
    priorityFilter, setPriorityFilter,
    dateFilter, setDateFilter
  } = useKanbanBoard();

  const handleClearFilters = () => {
    setAssigneeFilter('');
    setLabelFilter('');
    setPriorityFilter('');
    setDateFilter(null);
  };

  const hasActiveFilters = assigneeFilter || labelFilter || priorityFilter || dateFilter;

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Filter Tasks">
      <div className="space-y-6">
        
        <div className="space-y-2">
          <label className="text-sm font-medium text-foreground">Assignee</label>
          <Select
            value={assigneeFilter}
            onChange={(e) => setAssigneeFilter(e.target.value)}
            className="w-full"
            aria-label="Filter by assignee"
          >
            <option value="">All Assignees</option>
            {DUMMY_USERS.map(u => (
              <option key={u.id} value={u.id}>{u.name}</option>
            ))}
          </Select>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-foreground">Label</label>
          <Select
            value={labelFilter}
            onChange={(e) => setLabelFilter(e.target.value)}
            className="w-full"
            aria-label="Filter by label"
          >
            <option value="">All Labels</option>
            {board.labels.map(l => (
              <option key={l.id} value={l.id}>{l.name}</option>
            ))}
          </Select>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-foreground">Priority</label>
          <Select
            value={priorityFilter}
            onChange={(e) => setPriorityFilter(e.target.value)}
            className="w-full"
            aria-label="Filter by priority"
          >
            <option value="">All Priorities</option>
            <option value="High">High Priority</option>
            <option value="Medium">Medium Priority</option>
            <option value="Low">Low Priority</option>
          </Select>
        </div>

        {dateFilter && (
          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">Date</label>
            <div>
              <button
                onClick={() => setDateFilter(null)}
                className="inline-flex items-center gap-1 px-3 py-1.5 bg-primary/10 text-primary rounded-lg text-sm font-medium hover:bg-primary/20 transition-colors"
              >
                {dateFilter}
                <X className="w-3 h-3" />
              </button>
            </div>
          </div>
        )}

      </div>
      
      <div className="mt-8 flex justify-end gap-3">
        {hasActiveFilters && (
          <Button variant="ghost" onClick={handleClearFilters}>
            Clear Filters
          </Button>
        )}
        <Button onClick={onClose}>
          Done
        </Button>
      </div>
    </Modal>
  );
}

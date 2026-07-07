'use client';

import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { Select } from '../ui/Select';
import { Plus, Search, Moon, Sun } from 'lucide-react';
import { useKanbanBoard } from '@/hooks/useKanbanBoard';
import { useTheme } from '@/hooks/useTheme';
import { DUMMY_USERS, AVAILABLE_LABELS } from '@/lib/dummy-data';
import { motion } from 'framer-motion';

const MotionButton = motion.create(Button);

export function Header() {
  const { 
    setIsModalOpen, 
    setEditingTaskId,
    searchQuery, setSearchQuery,
    assigneeFilter, setAssigneeFilter,
    priorityFilter, setPriorityFilter,
    labelFilter, setLabelFilter
  } = useKanbanBoard();
  
  const { isDark, toggle, mounted } = useTheme();

  return (
    <header className="flex flex-col w-full shrink-0 bg-surface border-b border-outline">
      <div className="flex items-center justify-between h-16 px-6">
        <h2 className="text-lg font-semibold text-foreground">Frontend Internship Task</h2>
        <div className="flex items-center gap-3">
          {mounted && (
            <Button variant="ghost" size="icon" onClick={toggle} title="Toggle Theme" aria-label="Toggle Theme">
              {isDark ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </Button>
          )}
          <MotionButton 
            layoutId="new-task"
            onClick={() => {
              setEditingTaskId(null);
              setIsModalOpen(true);
            }}
            className="gap-2"
          >
            <Plus className="w-4 h-4" />
            <span>Add Task</span>
          </MotionButton>
        </div>
      </div>
      
      {/* Filters Bar */}
      <div className="flex items-center gap-4 px-6 py-3 bg-surface-variant border-t border-outline overflow-x-auto">
        <div className="w-64 shrink-0">
          <Input 
            icon={<Search className="w-4 h-4" />}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search tasks..." 
            aria-label="Search tasks"
          />
        </div>

        <Select 
          value={assigneeFilter} 
          onChange={(e) => setAssigneeFilter(e.target.value)}
          className="w-40"
          aria-label="Filter by assignee"
        >
          <option value="">All Assignees</option>
          {DUMMY_USERS.map(u => (
            <option key={u.id} value={u.id}>{u.name}</option>
          ))}
        </Select>

        <Select 
          value={labelFilter} 
          onChange={(e) => setLabelFilter(e.target.value)}
          className="w-40"
          aria-label="Filter by label"
        >
          <option value="">All Labels</option>
          {AVAILABLE_LABELS.map(l => (
            <option key={l.id} value={l.id}>{l.name}</option>
          ))}
        </Select>

        <Select 
          value={priorityFilter} 
          onChange={(e) => setPriorityFilter(e.target.value)}
          className="w-40"
          aria-label="Filter by priority"
        >
          <option value="">All Priorities</option>
          <option value="High">High</option>
          <option value="Medium">Medium</option>
          <option value="Low">Low</option>
        </Select>
      </div>
    </header>
  );
}
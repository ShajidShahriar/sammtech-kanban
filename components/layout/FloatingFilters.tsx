'use client';

import { Search, X } from 'lucide-react';
import { useKanbanBoard } from '@/hooks/useKanbanBoard';
import { Input } from '../ui/Input';
import { Select } from '../ui/Select';
import { DUMMY_USERS } from '@/lib/dummy-data';

export function FloatingFilters() {
  const {
    board,
    searchQuery, setSearchQuery,
    assigneeFilter, setAssigneeFilter,
    labelFilter, setLabelFilter,
    priorityFilter, setPriorityFilter,
    dateFilter, setDateFilter
  } = useKanbanBoard();

  return (
    <>{/*invisible triger at the bottom */}
      <div className="fixed bottom-0 left-1/2 -translate-x-1/2 w-3/5 max-w-3xl h-16 z-[49] peer" />

      <div className="tour-filters fixed bottom-6 left-1/2 -translate-x-1/2 z-50 flex items-center gap-3 p-3 bg-surface/90 backdrop-blur-xl border border-outline rounded-2xl shadow-2xl overflow-x-auto max-w-[90vw] [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none] transform translate-y-32 opacity-0 hover:translate-y-0 hover:opacity-100 peer-hover:translate-y-0 peer-hover:opacity-100 transition-all duration-300">

        <div className="w-48 shrink-0 relative">
          <Input
            icon={<Search className="w-4 h-4" />}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search..."
            aria-label="Search tasks"
          />
        </div>

        <Select
          value={assigneeFilter}
          onChange={(e) => setAssigneeFilter(e.target.value)}
          className="w-36 shrink-0"
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
          className="w-36 shrink-0"
          aria-label="Filter by label"
        >
          <option value="">All Labels</option>
          {board.labels.map(l => (
            <option key={l.id} value={l.id}>{l.name}</option>
          ))}
        </Select>

        <Select
          value={priorityFilter}
          onChange={(e) => setPriorityFilter(e.target.value)}
          className="w-36 shrink-0"
          aria-label="Filter by priority"
        >
          <option value="">All Priorities</option>
          <option value="High">High Priority</option>
          <option value="Medium">Medium Priority</option>
          <option value="Low">Low Priority</option>
        </Select>

        {dateFilter && (
          <button
            onClick={() => setDateFilter(null)}
            className="shrink-0 flex items-center gap-1 px-3 py-1.5 bg-primary/10 text-primary rounded-lg text-sm font-medium hover:bg-primary/20 transition-colors"
          >
            {dateFilter}
            <X className="w-3 h-3" />
          </button>
        )}

      </div>
    </>
  );
}

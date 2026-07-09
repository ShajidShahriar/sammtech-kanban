'use client';

import React, { useMemo, useRef, useEffect } from 'react';
import { useKanbanBoard } from '@/hooks/useKanbanBoard';
import { cn } from '@/lib/utils';

export function HorizontalCalendar() {
  const { board, dateFilter, setDateFilter } = useKanbanBoard();
  const scrollRef = useRef<HTMLDivElement>(null);

  const dates = useMemo(() => {
    const arr = [];
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    for (let i = -7; i <= 23; i++) {
      const d = new Date(today);
      d.setDate(today.getDate() + i);
      arr.push(d);
    }
    return arr;
  }, []);

  const formatDateStr = (date: Date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  const todayStr = useMemo(() => formatDateStr(new Date()), []);
  const selectedDate = dateFilter ?? todayStr;

  const deadlines = useMemo(() => {
    const map = new Map<string, string>();
    board.tasks.forEach(task => {
      if (task.dueDate) {
        const existingColor = map.get(task.dueDate);
        if (existingColor === 'bg-red-500') return;

        if (task.priority === 'High') {
          map.set(task.dueDate, 'bg-red-500');
        } else if (task.priority === 'Medium' && existingColor !== 'bg-red-500') {
          map.set(task.dueDate, 'bg-yellow-500');
        } else if (task.priority === 'Low' && !existingColor) {
          map.set(task.dueDate, 'bg-green-500');
        }
      }
    });
    return map;
  }, [board.tasks]);

  useEffect(() => {
    if (scrollRef.current) {
      const todayEl = scrollRef.current.querySelector('[data-istoday="true"]') as HTMLElement;
      if (todayEl) {
        const containerWidth = scrollRef.current.clientWidth;
        const scrollPos = todayEl.offsetLeft - (containerWidth / 2) + (todayEl.offsetWidth / 2);
        scrollRef.current.scrollTo({ left: scrollPos, behavior: 'smooth' });
      }
    }
  }, []);

  const daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  return (
    <div
      ref={scrollRef}
      className="flex items-center gap-2 px-6 py-3 bg-surface-variant overflow-x-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none] scroll-smooth"
    >
      {dates.map((date, i) => {
        const dateStr = formatDateStr(date);
        const isSelected = selectedDate === dateStr;
        const dotColor = deadlines.get(dateStr);
        const dayName = daysOfWeek[date.getDay()];

        return (
          <button
            key={dateStr}
            data-istoday={dateStr === todayStr}
            aria-pressed={isSelected}
            onClick={() => setDateFilter(dateStr === todayStr ? null : dateStr)}
            className={cn(
              "relative flex flex-col items-center justify-center shrink-0 w-14 h-16 rounded-lg transition-all cursor-pointer hover:-translate-y-1 bg-surface text-foreground/80 hover:text-foreground shadow-sm hover:shadow-md",
              isSelected
                ? "border-2 border-primary bg-primary/10 text-foreground shadow-lg scale-105"
                : "border border-transparent hover:bg-black/10 dark:hover:bg-white/10"
            )}
          >
            <span className="text-xs font-medium uppercase tracking-wider">{dayName}</span>
            <span className="text-lg font-bold">{date.getDate()}</span>

            {dotColor && (
              <span className={cn("absolute top-1.5 right-1.5 w-2 h-2 rounded-full shadow-sm animate-fade-in", dotColor)} />
            )}
          </button>
        );
      })}
    </div>
  );
}

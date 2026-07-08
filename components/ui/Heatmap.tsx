'use client';

import React, { useState, useMemo } from 'react';
import { cn } from '@/lib/utils';

interface HeatmapProps {
  className?: string;
  data?: number[];
}

export function Heatmap({ className, data }: HeatmapProps) {
  // Issue #4: Memoize random data so it doesn't re-randomize on every render
  const heatmapData = useMemo(() => {
    return data || Array.from({ length: 98 }).map(() => {
      const rand = Math.random();
      if (rand < 0.6) return 0;
      if (rand < 0.8) return 1;
      if (rand < 0.9) return 2;
      if (rand < 0.95) return 3;
      return 4;
    });
  }, [data]);

  return (
    <div className={cn("flex flex-col", className)}>
      <div className="grid grid-rows-7 grid-flow-col gap-1">
        {heatmapData.map((level, i) => (
          <div
            key={i}
            className={cn(
              "w-2.5 h-2.5 rounded-[2px] transition-colors",
              level === 0 ? "bg-white dark:bg-black border border-gray-200 dark:border-white/10" :
                level === 1 ? "bg-gray-300 dark:bg-white/30 border border-transparent" :
                  level === 2 ? "bg-gray-500 dark:bg-white/60 border border-transparent" :
                    level === 3 ? "bg-gray-700 dark:bg-white/80 border border-transparent" :
                      "bg-gray-900 dark:bg-white border border-transparent"
            )}
            title={`Activity level: ${level}`}
          />
        ))}
      </div>
      <div className="flex items-center justify-end gap-1 mt-2 text-[10px] text-gray-500 dark:text-gray-400 font-medium">
        <span>Less</span>
        <div className="flex gap-1 items-center">
          <div className="w-2.5 h-2.5 rounded-[2px] bg-white dark:bg-black border border-gray-200 dark:border-white/10" />
          <div className="w-2.5 h-2.5 rounded-[2px] bg-gray-300 dark:bg-white/30" />
          <div className="w-2.5 h-2.5 rounded-[2px] bg-gray-500 dark:bg-white/60" />
          <div className="w-2.5 h-2.5 rounded-[2px] bg-gray-700 dark:bg-white/80" />
          <div className="w-2.5 h-2.5 rounded-[2px] bg-gray-900 dark:bg-white" />
        </div>
        <span>More</span>
      </div>
    </div>
  );
}

import React from 'react';
import { Card } from '../ui/Card';

export function BoardSkeleton() {
  return (
    <div className="flex-1 overflow-x-hidden p-6 h-full flex items-start gap-6 animate-pulse">
      {Array.from({ length: 5 }).map((_, colIndex) => (
        <div
          key={colIndex}
          className="flex flex-col w-[320px] shrink-0 bg-card-muted dark:bg-card-muted-dark border border-gray-200 dark:border-white/10 rounded-lg p-3 max-h-full"
        >
          <div className="flex items-center justify-between mb-4 px-1">
            <div className="h-5 bg-gray-200 dark:bg-white/10 rounded w-24" />
            <div className="h-5 w-6 bg-gray-200 dark:bg-white/10 rounded-full" />
          </div>

          {/* Task Cards Skeletons */}
          <div className="flex flex-col gap-3 pb-2">
            {/* Generate random number of tasks per column (1 to 3) */}
            {Array.from({ length: 3 - (colIndex % 3) }).map((_, taskIndex) => (
              <Card
                key={taskIndex}
                className="p-4 flex flex-col gap-3 border-transparent dark:border-white/5"
              >
                {/* Title */}
                <div className="h-4 bg-gray-200 dark:bg-white/10 rounded w-3/4" />
                <div className="h-4 bg-gray-200 dark:bg-white/10 rounded w-1/2" />

                {/* Footer */}
                <div className="flex items-center justify-between mt-2 pt-2">
                  <div className="h-5 w-16 bg-gray-200 dark:bg-white/10 rounded-full" />
                  <div className="h-6 w-6 bg-gray-200 dark:bg-white/10 rounded-full" />
                </div>
              </Card>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

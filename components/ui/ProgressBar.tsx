import React from 'react';
import { cn } from '@/lib/utils';

interface ProgressBarProps {
  progress: number;
  className?: string;
}

export function ProgressBar({ progress, className }: ProgressBarProps) {
  const clampedProgress = Math.max(0, Math.min(100, progress || 0));

  return (
    <div className={cn("w-full h-2 rounded-full overflow-hidden border border-gray-200 dark:border-white/20 bg-white dark:bg-black", className)}>
      <div
        className="h-full bg-gray-900 dark:bg-white transition-all duration-300 ease-out"
        style={{ width: `${clampedProgress}%` }}
        role="progressbar"
        aria-valuenow={clampedProgress}
        aria-valuemin={0}
        aria-valuemax={100}
      />
    </div>
  );
}

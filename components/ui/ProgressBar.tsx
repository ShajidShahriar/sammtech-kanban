import React from 'react';
import { cn } from '@/lib/utils';

interface ProgressBarProps {
  progress: number; // 0 to 100
  className?: string;
}

export function ProgressBar({ progress, className }: ProgressBarProps) {
  // Clamp progress between 0 and 100
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

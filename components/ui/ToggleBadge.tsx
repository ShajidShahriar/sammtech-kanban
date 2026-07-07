import * as React from 'react';
import { cn } from '@/lib/utils';

interface ToggleBadgeProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  selected?: boolean;
  selectedColor?: string;
}

export function ToggleBadge({ selected, selectedColor, className, children, ...props }: ToggleBadgeProps) {
  return (
    <button
      type="button"
      className={cn(
        "inline-flex items-center px-3 py-1 text-xs font-medium rounded-full border transition-colors cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-gray-300 dark:focus-visible:ring-gray-700",
        selected 
          ? cn("border-transparent", selectedColor) 
          : "bg-white dark:bg-[#0a0a0a] text-gray-700 dark:text-gray-300 border-gray-200 dark:border-white/10 hover:bg-gray-50 dark:hover:bg-gray-900",
        className
      )}
      {...props}
    >
      {children}
    </button>
  );
}

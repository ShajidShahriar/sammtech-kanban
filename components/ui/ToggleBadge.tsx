import * as React from 'react';
import { cn } from '@/lib/utils';
import { badgeVariants } from './Badge';
import { type VariantProps } from 'class-variance-authority';

interface ToggleBadgeProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  selected?: boolean;
  selectedColor?: VariantProps<typeof badgeVariants>['variant'];
}

export function ToggleBadge({ selected, selectedColor = 'default', className, children, ...props }: ToggleBadgeProps) {
  return (
    <button
      type="button"
      className={cn(
        "cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-gray-300 dark:focus-visible:ring-gray-700 transition-colors",
        selected 
          ? badgeVariants({ variant: selectedColor }) 
          : badgeVariants({ variant: 'outline', className: "opacity-60 hover:opacity-100 hover:bg-gray-50 dark:hover:bg-white/5" }),
        className
      )}
      {...props}
    >
      {children}
    </button>
  );
}

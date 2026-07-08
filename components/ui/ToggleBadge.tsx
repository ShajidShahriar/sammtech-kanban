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
          ? badgeVariants({ variant: selectedColor, className: "shadow-sm scale-105" }) 
          : badgeVariants({ variant: 'outline', className: "opacity-70 hover:opacity-100 hover:bg-gray-100 dark:hover:bg-white/10 hover:-translate-y-0.5 hover:shadow-sm" }),
        className
      )}
      {...props}
    >
      {children}
    </button>
  );
}

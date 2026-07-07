import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';

import { cn } from '@/lib/utils';

const badgeVariants = cva('inline-flex items-center px-2 py-0.5 text-xs font-medium rounded-md border bg-transparent', {
  variants: {
    variant: {
      default: 'border-gray-200 text-gray-600 dark:border-white/20 dark:text-gray-400',
      blue: 'border-blue-500 text-blue-600 dark:border-blue-400 dark:text-blue-400',
      outline: 'border-gray-200 text-gray-500 dark:border-white/20 dark:text-gray-500',
      success: 'border-green-500 text-green-700 dark:border-green-400 dark:text-green-400',
      danger: 'border-red-500 text-red-700 dark:border-red-400 dark:text-red-400',
      warning: 'border-yellow-500 text-yellow-700 dark:border-yellow-400 dark:text-yellow-400',
    },
  },
  defaultVariants: {
    variant: 'default',
  },
});

export interface BadgeProps extends React.HTMLAttributes<HTMLDivElement>, VariantProps<typeof badgeVariants> {}

export function Badge({ className, variant, ...props }: BadgeProps) {
  return <div className={cn(badgeVariants({ variant }), className)} {...props} />;
}

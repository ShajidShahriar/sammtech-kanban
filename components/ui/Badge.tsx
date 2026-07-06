import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';

import { cn } from '@/lib/utils';

const badgeVariants = cva('inline-flex items-center px-2 py-1 rounded-badge text-[10px] font-bold uppercase tracking-wide', {
  variants: {
    variant: {
      danger: 'bg-red-100 text-red-700',
      warning: 'bg-amber-100 text-amber-700',
      success: 'bg-green-100 text-green-700',
      info: 'bg-primary-light text-primary',
      neutral: 'bg-slate-200 text-slate-600',
    },
  },
  defaultVariants: {
    variant: 'neutral',
  },
});

export interface BadgeProps extends React.HTMLAttributes<HTMLDivElement>, VariantProps<typeof badgeVariants> {}

export function Badge({ className, variant, ...props }: BadgeProps) {
  return <div className={cn(badgeVariants({ variant }), className)} {...props} />;
}

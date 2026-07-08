import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';

import { cn } from '@/lib/utils';

const buttonVariants = cva(
  'inline-flex items-center justify-center font-medium transition-colors focus:outline-none active:scale-95 disabled:pointer-events-none disabled:opacity-50 transition-all',
  {
    variants: {
      variant: {
        primary: 'bg-gray-900 dark:bg-white text-white dark:text-black hover:bg-gray-800 dark:hover:bg-gray-100',
        secondary: 'border border-gray-200 dark:border-white/20 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800',
        danger: 'bg-red-600 text-white hover:bg-red-700',
        ghost: 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800',
        icon: 'border border-gray-200 dark:border-white/20 text-gray-500 hover:bg-gray-50 dark:hover:bg-gray-800',
        // Issue #17: Missing outline variant used in UserProfileModal
        outline: 'border border-gray-200 dark:border-white/20 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-white/5 bg-transparent',
      },
      size: {
        default: 'px-4 py-2 text-sm rounded-lg',
        sm: 'px-3 py-1 text-xs rounded-md',
        compact: 'px-3 py-1.5 text-xs rounded-md',
        icon: 'p-2 rounded-lg',
        tinyIcon: 'p-1 rounded-md',
      },
    },
    defaultVariants: {
      variant: 'primary',
      size: 'default',
    },
  },
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, ...props }, ref) => {
    return (
      <button 
        className={cn(buttonVariants({ variant, size, className }))} 
        ref={ref}
        {...props} 
      />
    );
  }
);
Button.displayName = 'Button';

import React from 'react';
import { LucideIcon } from 'lucide-react';

interface EmptyStateProps {
  icon: LucideIcon;
  title: string;
  description: string;
  action?: React.ReactNode;
}

export function EmptyState({ icon: Icon, title, description, action }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center p-8 text-center bg-card-muted dark:bg-card-muted-dark border border-dashed border-gray-200 dark:border-white/10 rounded-lg h-full min-h-[200px]">
      <div className="w-10 h-10 flex items-center justify-center rounded-full bg-white dark:bg-black border border-gray-200 dark:border-white/10 mb-4">
        <Icon className="w-5 h-5 text-gray-400 dark:text-gray-500" />
      </div>
      <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-2">{title}</h3>
      <p className="text-sm text-gray-500 max-w-sm mb-6">
        {description}
      </p>
      {action}
    </div>
  );
}

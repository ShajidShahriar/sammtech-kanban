import React from 'react';
import { cn } from '@/lib/utils';
import { MarkdownRenderer } from './MarkdownRenderer';

interface MarkdownBoxProps {
  content: string;
  className?: string;
}

export function MarkdownBox({ content, className }: MarkdownBoxProps) {
  return (
    <div 
      className={cn(
        "flex min-h-[80px] w-full rounded-lg border border-gray-200 dark:border-white/10 bg-white dark:bg-[#0a0a0a] px-3 py-2 text-sm text-gray-900 dark:text-white overflow-y-auto transition-colors",
        className
      )}
    >
      <MarkdownRenderer content={content} />
    </div>
  );
}

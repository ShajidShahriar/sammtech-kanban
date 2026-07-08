'use client';

import React from 'react';
import DOMPurify from 'dompurify';
import { cn } from '@/lib/utils';

interface MarkdownRendererProps {
  content: string;
  className?: string;
}

const PURIFY_CONFIG = {
  ALLOWED_TAGS: ['strong', 'em', 'code', 'a', 'br', 'div', 'span'],
  ALLOWED_ATTR: ['href', 'target', 'rel', 'class'],
};

export function MarkdownRenderer({ content, className }: MarkdownRendererProps) {
  const renderBasicMarkdown = (text: string) => {
    if (!text) return { __html: '' };

    let html = text
      // Escape basic HTML tags to prevent XSS
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      // Bold
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      // Italic
      .replace(/_(.*?)_/g, '<em>$1</em>')
      // Code
      .replace(/`([^`]+)`/g, '<code class="bg-gray-100 dark:bg-gray-800 px-1.5 py-0.5 rounded-md font-mono text-xs">$1</code>')
      // Links
      .replace(/\[(.*?)\]\((.*?)\)/g, '<a href="$2" target="_blank" rel="noopener noreferrer" class="text-gray-700 dark:text-gray-300 underline hover:text-gray-900 dark:hover:text-white">$1</a>')
      // Lists (naive approach)
      .replace(/^-\s+(.*)$/gm, '<div class="flex gap-2"><span class="text-gray-400">•</span><span>$1</span></div>')
      // Newlines
      .replace(/\n/g, '<br />');

    // Sanitize the final HTML output with DOMPurify (Issue #1)
    const sanitized = DOMPurify.sanitize(html, PURIFY_CONFIG);
    return { __html: sanitized };
  };

  return (
    <div
      className={cn("text-sm text-gray-700 dark:text-gray-300 leading-relaxed", className)}
      dangerouslySetInnerHTML={renderBasicMarkdown(content)}
    />
  );
}

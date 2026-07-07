import * as React from 'react';
import { cn } from '@/lib/utils';

export interface AvatarProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  fallback?: string;
}

export function Avatar({ className, src, alt, fallback, ...props }: AvatarProps) {
  const [error, setError] = React.useState(false);

  return (
    <div className={cn("relative flex h-6 w-6 shrink-0 overflow-hidden rounded-full border border-gray-200 dark:border-white/10 bg-gray-100 dark:bg-gray-800", className)}>
      {src && !error ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={src}
          alt={alt}
          className="aspect-square h-full w-full object-cover"
          onError={() => setError(true)}
          {...props}
        />
      ) : (
        <span className="flex h-full w-full items-center justify-center font-medium text-[10px] text-gray-700 dark:text-gray-300 uppercase">
          {fallback || alt?.charAt(0) || '?'}
        </span>
      )}
    </div>
  );
}

'use client';

import * as React from 'react';
import { cn } from '@/lib/utils';

export interface AvatarProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  fallback?: string;
}

export function Avatar({ className, src, alt, fallback, ...props }: AvatarProps) {
  const [error, setError] = React.useState(false);
  // Issue #29: Track loading state for shimmer skeleton
  const [loading, setLoading] = React.useState(!!src);

  // Reset loading/error when src changes
  React.useEffect(() => {
    if (src) {
      setLoading(true);
      setError(false);
    }
  }, [src]);

  return (
    <div className={cn("relative flex h-6 w-6 shrink-0 overflow-hidden rounded-full border border-gray-200 dark:border-white/10 bg-gray-100 dark:bg-gray-800", className)}>
      {src && !error ? (
        <>
          {loading && (
            <div className="absolute inset-0 bg-gray-200 dark:bg-gray-700 animate-pulse rounded-full" />
          )}
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={src}
            alt={alt}
            className={cn("aspect-square h-full w-full object-cover transition-opacity", loading ? "opacity-0" : "opacity-100")}
            onLoad={() => setLoading(false)}
            onError={() => { setError(true); setLoading(false); }}
            {...props}
          />
        </>
      ) : (
        <span className="flex h-full w-full items-center justify-center font-medium text-[10px] text-gray-700 dark:text-gray-300 uppercase">
          {fallback || alt?.charAt(0) || '?'}
        </span>
      )}
    </div>
  );
}

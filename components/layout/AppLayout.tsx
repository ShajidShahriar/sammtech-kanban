'use client';

import { Sidebar } from '@/components/layout/Sidebar';

export function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex h-screen w-full overflow-hidden bg-background text-foreground font-sans text-sm antialiased">
      <Sidebar />
      {children}
    </div>
  );
}

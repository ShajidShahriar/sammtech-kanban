import { Sidebar } from '@/components/layout/Sidebar';
import { KanbanProvider } from '@/hooks/useKanbanBoard';

export function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <KanbanProvider>
      <div className="flex h-screen w-full overflow-hidden bg-background text-foreground font-sans text-sm antialiased" >
        <Sidebar />
        {children}
      </div>
    </KanbanProvider>
  );
}

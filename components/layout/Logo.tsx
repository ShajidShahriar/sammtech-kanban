import { Kanban } from 'lucide-react';

export function Logo() {
  return (
    <div className="flex items-center justify-center w-full h-16 border-b border-outline shrink-0 bg-primary/5">
      <Kanban className="w-7 h-7 text-primary" strokeWidth={2.5} />
    </div>
  );
}
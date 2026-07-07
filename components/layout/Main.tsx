import { Header } from './Header';
import { Board } from '@/components/board/Board';
import { KanbanProvider } from '@/hooks/useKanbanBoard';

export function Main() {
  return (
    <KanbanProvider>
      <div className="flex flex-col flex-1 h-full min-w-0 bg-surface relative">
        <Header />
        <Board />
      </div>
    </KanbanProvider>
  );
}
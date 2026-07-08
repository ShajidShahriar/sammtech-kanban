import { Header } from './Header';
import { Board } from '@/components/board/Board';
import { FloatingFilters } from './FloatingFilters';

export function Main() {
  return (
    <div className="flex flex-col flex-1 h-full min-w-0 bg-surface relative">
      <Header />
      <Board />
      <FloatingFilters />
    </div>
  );
}
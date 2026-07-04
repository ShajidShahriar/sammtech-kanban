import { Header } from './Header';
import { Board } from '@/components/board/Board';

export function Main() {
  return (
    <div className="flex flex-col flex-1 h-full min-w-0 bg-white" >
      <Header />
      <Board />
    </div>
  );
}
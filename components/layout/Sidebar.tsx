import { Logo } from './Logo';
import { Navigation } from './Navigation';

export function Sidebar() {
  return (
    <aside className="flex flex-col w-[220px] h-full shrink-0 bg-gray-50 border-r border-gray-200">
      <Logo />
      <Navigation />
    </aside>
  );
}
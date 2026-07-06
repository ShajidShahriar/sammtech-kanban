import { Logo } from './Logo';
import { Navigation } from './Navigation';

export function Sidebar() {
  return (
    <aside className="flex flex-col w-[220px] h-full shrink-0 bg-background border-r border-outline">
      <Logo />
      <Navigation />
    </aside>
  );
}
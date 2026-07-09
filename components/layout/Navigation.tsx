'use client';

import { LayoutGrid, Users, PieChart, Settings, Bell } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';

export function Navigation() {
  const pathname = usePathname();

  const navItems = [
    { name: 'Kanban Board', href: '/', icon: LayoutGrid },
    { name: 'Team Members (Demo)', href: '/team', icon: Users },
    { name: 'Analytics (Demo)', href: '/analytics', icon: PieChart },
    { name: 'Notifications (Demo)', href: '/notifications', icon: Bell },
  ];

  return (
    <nav className="flex flex-row sm:flex-col flex-1 w-full px-2 sm:p-2 gap-2 mt-0 sm:mt-2 items-center justify-center sm:justify-start">
      {navItems.map((item) => {
        const isActive = pathname === item.href;
        return (
          <Link
            key={item.href}
            href={item.href}
            title={item.name}
            className={cn(
              "flex items-center justify-center w-full h-10 rounded-xl transition-all",
              isActive 
                ? "bg-primary/10 text-primary hover:bg-primary/20" 
                : "text-foreground/50 hover:text-foreground hover:bg-black/10 dark:hover:bg-white/10"
            )}
          >
            <item.icon className="w-5 h-5 shrink-0" />
          </Link>
        );
      })}

      <div className="hidden sm:block flex-1" />

      <Link 
        href="/settings"
        title="Settings (Demo)"
        className={cn(
          "flex items-center justify-center w-full h-10 rounded-xl transition-all mt-auto",
          pathname === '/settings'
            ? "bg-primary/10 text-primary hover:bg-primary/20"
            : "text-foreground/50 hover:text-foreground hover:bg-black/10 dark:hover:bg-white/10"
        )}
      >
        <Settings className="w-5 h-5 shrink-0" />
      </Link>
    </nav>
  );
}
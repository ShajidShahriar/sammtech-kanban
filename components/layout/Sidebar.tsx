'use client';

import { useState } from 'react';
import { Logo } from './Logo';
import { Navigation } from './Navigation';
import { Avatar } from '../ui/Avatar';
import { UserProfileModal } from './UserProfileModal';

export function Sidebar() {
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  return (
    <aside className="flex flex-row sm:flex-col w-full sm:w-16 h-16 sm:h-full shrink-0 bg-background border-t sm:border-t-0 sm:border-r border-outline z-40 relative items-center justify-between sm:justify-start sm:py-0 px-2 sm:px-0">
      <Logo />
      <Navigation />
      
      <div className="ml-auto sm:ml-0 sm:mt-auto p-2 sm:p-3 sm:border-t border-outline flex justify-center items-center">
        <button 
          onClick={() => setTimeout(() => setIsProfileOpen(true), 50)}
          className="flex items-center justify-center w-10 h-10 rounded-md hover:bg-black/10 dark:hover:bg-white/10 transition-colors"
          title="Admin User (View Profile)"
        >
          <Avatar src="https://api.dicebear.com/7.x/avataaars/svg?seed=Me" alt="User" />
        </button>
      </div>

      <UserProfileModal 
        isOpen={isProfileOpen} 
        onClose={() => setIsProfileOpen(false)} 
      />
    </aside>
  );
}
'use client';

import { useState } from 'react';
import { Logo } from './Logo';
import { Navigation } from './Navigation';
import { Avatar } from '../ui/Avatar';
import { UserProfileModal } from './UserProfileModal';

export function Sidebar() {
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  return (
    <aside className="flex flex-col w-16 h-full shrink-0 bg-background border-r border-outline">
      <Logo />
      <Navigation />
      
      <div className="mt-auto p-3 border-t border-outline flex justify-center">
        <button 
          onClick={() => setIsProfileOpen(true)}
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
'use client';

import { useState } from 'react';
import { Logo } from './Logo';
import { Navigation } from './Navigation';
import { Avatar } from '../ui/Avatar';
import { UserProfileModal } from './UserProfileModal';

export function Sidebar() {
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  return (
    <aside className="flex flex-col w-[220px] h-full shrink-0 bg-background border-r border-outline">
      <Logo />
      <Navigation />
      
      <div className="mt-auto p-4 border-t border-outline">
        <button 
          onClick={() => setIsProfileOpen(true)}
          className="flex items-center gap-3 w-full p-2 -mx-2 rounded-md hover:bg-gray-100 dark:hover:bg-white/5 transition-colors text-left"
        >
          <Avatar src="https://api.dicebear.com/7.x/avataaars/svg?seed=Me" alt="User" />
          <div className="flex flex-col overflow-hidden">
            <span className="text-sm font-medium text-gray-900 dark:text-gray-100 truncate">Admin User</span>
            <span className="text-xs text-gray-500 truncate">View Profile</span>
          </div>
        </button>
      </div>

      <UserProfileModal 
        isOpen={isProfileOpen} 
        onClose={() => setIsProfileOpen(false)} 
      />
    </aside>
  );
}
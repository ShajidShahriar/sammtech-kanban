import { AppLayout } from '@/components/layout/AppLayout';
import { Bell } from 'lucide-react';

export default function NotificationsPage() {
  return (
    <AppLayout>
      <div className="flex-1 flex flex-col items-center justify-center bg-surface gap-4">
        <Bell className="w-16 h-16 text-gray-300 dark:text-gray-700" />
        <h1 className="text-2xl font-bold text-gray-400 dark:text-gray-600">Notifications</h1>
        <p className="text-gray-500 dark:text-gray-500 max-w-sm text-center">This is a placeholder page for recent alerts and notifications.</p>
      </div>
    </AppLayout>
  );
}

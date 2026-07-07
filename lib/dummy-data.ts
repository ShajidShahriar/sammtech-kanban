import { BoardData, Label, Assignee } from '@/types';

export const AVAILABLE_LABELS: Label[] = [
  { id: 'l1', name: 'Setup', color: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400' },
  { id: 'l2', name: 'Frontend', color: 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400' },
  { id: 'l3', name: 'Backend', color: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' },
  { id: 'l4', name: 'Bug', color: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400' },
  { id: 'l5', name: 'Design', color: 'bg-pink-100 text-pink-700 dark:bg-pink-900/30 dark:text-pink-400' },
];

export const DUMMY_USERS: Assignee[] = [
  { id: 'u1', name: 'Alice Smith', avatarUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Alice' },
  { id: 'u2', name: 'Bob Jones', avatarUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Bob' },
  { id: 'u3', name: 'Charlie Brown', avatarUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Charlie' },
];

export const initialBoardData: BoardData = {
  columns: [
    { id: 'Backlog', title: 'Backlog' },
    { id: 'Todo', title: 'Todo' },
    { id: 'In Progress', title: 'In Progress' },
    { id: 'Review', title: 'Review' },
    { id: 'Done', title: 'Done' },
  ],
  tasks: [
    {
      id: 'task-1',
      title: 'Set up Next.js Project',
      description: 'Initialize with App Router, TypeScript, and Tailwind.\n\n- Need to configure basic `globals.css`\n- Setup **ESLint** rules.',
      status: 'Todo',
      priority: 'High',
      labels: [AVAILABLE_LABELS[0]],
      assignee: DUMMY_USERS[0],
      dueDate: '2023-12-01',
    },
    {
      id: 'task-2',
      title: 'Build UI Layout',
      description: 'Create responsive flex layout for columns.',
      status: 'In Progress',
      priority: 'Medium',
      labels: [AVAILABLE_LABELS[1]],
      assignee: DUMMY_USERS[1],
    }
  ],
};
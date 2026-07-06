import { BoardData } from '@/types';

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
      description: 'Initialize with App Router, TypeScript, and Tailwind.',
      status: 'Todo',
      priority: 'High',
      labels: [{ id: 'l1', name: 'Setup', color: 'bg-blue-500' }],
    },
    {
      id: 'task-2',
      title: 'Build UI Layout',
      description: 'Create responsive flex layout for columns.',
      status: 'In Progress',
      priority: 'Medium',
      labels: [{ id: 'l2', name: 'Frontend', color: 'bg-purple-500' }],
    }
  ],
};
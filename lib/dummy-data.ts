import { BoardData, Label, Assignee, LabelColor } from '@/types';

function relativeDateStr(offsetDays: number): string {
  const d = new Date();
  d.setDate(d.getDate() + offsetDays);
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

export const AVAILABLE_LABELS: Label[] = [
  { id: 'l1', name: 'Setup', color: 'outline' },
  { id: 'l2', name: 'Frontend', color: 'outline' },
  { id: 'l3', name: 'Backend', color: 'outline' },
  { id: 'l4', name: 'Bug', color: 'outline' },
  { id: 'l5', name: 'Design', color: 'outline' },
];

export const DUMMY_USERS: Assignee[] = [
  { id: 'u1', name: 'Alice Smith', avatarUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Alice' },
  { id: 'u2', name: 'Bob Jones', avatarUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Bob' },
  { id: 'u3', name: 'Charlie Brown', avatarUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Charlie' },
];

export const initialBoardData: BoardData = {
  columns: [],
  labels: AVAILABLE_LABELS,
  tasks: [],
};
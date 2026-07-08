export type Priority = 'High' | 'Medium' | 'Low';

export type LabelColor =
  | 'default'
  | 'blue'
  | 'purple'
  | 'pink'
  | 'outline'
  | 'success'
  | 'danger'
  | 'warning';

export interface Label {
  id: string;
  name: string;
  color: LabelColor;
}

export interface Assignee {
  id: string;
  name: string;
  avatarUrl?: string;
}

export interface Task {
  id: string;
  title: string;
  description: string;
  status: string;
  assignee?: Assignee;
  labels: Label[];
  priority: Priority;
  dueDate?: string;
  progress?: number;
}

export interface BoardData {
  tasks: Task[];
  columns: {
    id: string;
    title: string;
  }[];
  labels: Label[];
}
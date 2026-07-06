import { Task } from '@/types';
import { TaskCard } from './TaskCard';

interface ColumnProps {
  title: string;
  tasks: Task[];
}

export function Column({ title, tasks }: ColumnProps) {
  return (
    <div className="flex flex-col w-[320px] shrink-0 bg-surface-container rounded-card p-3 max-h-full">
      <div className="flex items-center justify-between mb-4 px-1">
        <h3 className="font-semibold text-sm text-foreground">{title}</h3>
        <span className="text-xs font-medium text-foreground bg-surface-variant px-2 py-0.5 rounded-badge">
          {tasks.length}
        </span>
      </div>
      
      <div className="flex flex-col gap-3 overflow-y-auto min-h-[150px] pb-2">
        {tasks.map(task => (
          <TaskCard key={task.id} task={task} />
        ))}
      </div>
    </div>
  );
}
import { Task } from '@/types';
import { Card, CardHeader, CardContent } from '../ui/Card';
import { Badge } from '../ui/Badge';
import { Clock, MoreHorizontal } from 'lucide-react';
import { Draggable } from '@hello-pangea/dnd';
import { useKanbanBoard } from '@/hooks/useKanbanBoard';
import { Avatar } from '../ui/Avatar';
import { motion } from 'framer-motion';
import { springTransition } from '@/lib/animations';
import { ProgressBar } from '../ui/ProgressBar';
import { cn } from '@/lib/utils';

const MotionCard = motion.create(Card);

interface TaskCardProps {
  task: Task;
  index: number;
}

export function TaskCard({ task, index }: TaskCardProps) {
  const { setEditingTaskId, setIsModalOpen } = useKanbanBoard();

  const priorityVariant = {
    High: 'danger',
    Medium: 'warning',
    Low: 'default',
  } as const;

  return (
    <Draggable draggableId={task.id} index={index}>
      {(provided, snapshot) => (
        <div
          ref={provided.innerRef}
          className="touch-none"
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          style={{ ...provided.draggableProps.style, opacity: snapshot.isDragging ? 0.8 : 1 }}
          onClick={() => {
            setEditingTaskId(task.id);
            setIsModalOpen(true);
          }}
        >
          <MotionCard
            layout={!snapshot.isDragging ? "position" : false}
            layoutId={!snapshot.isDragging ? task.id : undefined}
            transition={springTransition}
            className="group cursor-grab active:cursor-grabbing hover:border-gray-400 dark:hover:border-white/40 transition-colors duration-200 shadow-sm hover:shadow-md"
            role="button"
            tabIndex={0}
            aria-label={`Task: ${task.title}, Status: ${task.status}, Priority: ${task.priority}`}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                setEditingTaskId(task.id);
                setIsModalOpen(true);
              }
            }}
          >
            <CardHeader className="p-4 flex items-start justify-between">
              <div className="flex flex-col min-w-0">
                <p className="text-sm font-semibold text-gray-900 dark:text-white truncate">
                  {task.title}
                </p>
              </div>
              <div className="flex items-center gap-1.5 shrink-0">
                <button
                  className="p-1 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-400 transition-colors opacity-0 group-hover:opacity-100"
                  aria-label="More options"
                >
                  <MoreHorizontal className="w-4 h-4 shrink-0" />
                </button>
              </div>
            </CardHeader>

            {task.labels && task.labels.length > 0 && (
              <div className="px-4 pb-3 flex flex-wrap gap-1">
                {task.labels.map(label => (
                  <Badge key={label.id} variant={label.color as any}>
                    {label.name}
                  </Badge>
                ))}
              </div>
            )}

            <CardContent className="px-4 pb-4 pt-0 flex flex-col gap-3">
              {task.description && (
                <p className="text-sm text-gray-700 dark:text-gray-300 truncate">
                  {task.description}
                </p>
              )}

              {task.progress !== undefined && task.progress > 0 && (
                <ProgressBar progress={task.progress} className="mt-1" />
              )}

              <div className="flex items-center justify-between mt-1">
                <Badge variant={priorityVariant[task.priority]}>{task.priority}</Badge>
                <div className="flex items-center gap-2">
                  {task.dueDate && (
                    <span className="flex items-center gap-1 text-xs text-gray-500 font-medium">
                      <Clock className="w-3 h-3 shrink-0" />
                      <span>{task.dueDate}</span>
                    </span>
                  )}
                  {task.assignee && (
                    <Avatar
                      src={task.assignee.avatarUrl}
                      alt={task.assignee.name}
                      title={task.assignee.name}
                    />
                  )}
                </div>
              </div>
            </CardContent>
          </MotionCard>
        </div>
      )}
    </Draggable>
  );
}
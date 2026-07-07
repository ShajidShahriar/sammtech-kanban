import { Task } from '@/types';
import { Card, CardHeader, CardContent } from '../ui/Card';
import { Badge } from '../ui/Badge';
import { Clock } from 'lucide-react';
import { Draggable } from '@hello-pangea/dnd';
import { useKanbanBoard } from '@/hooks/useKanbanBoard';

interface TaskCardProps {
  task: Task;
  index: number;
}

export function TaskCard({ task, index }: TaskCardProps) {
  const { setEditingTaskId, setIsSidebarOpen } = useKanbanBoard();

  const priorityVariant = {
    High: 'danger',
    Medium: 'warning',
    Low: 'neutral',
  } as const;

  return (
    <Draggable draggableId={task.id} index={index}>
      {(provided, snapshot) => (
        <div
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          style={{ ...provided.draggableProps.style, opacity: snapshot.isDragging ? 0.8 : 1 }}
          onClick={() => {
            setEditingTaskId(task.id);
            setIsSidebarOpen(true);
          }}
        >
          <Card className="cursor-grab active:cursor-grabbing hover:border-primary/50 group hover:shadow-md transition-shadow">
            <CardHeader className="flex flex-col space-y-2 p-3 pb-2">
              <div className="flex items-start justify-between gap-2">
                <h4 className="font-semibold text-sm leading-tight text-foreground">{task.title}</h4>
              </div>
              {task.labels && task.labels.length > 0 && (
                <div className="flex flex-wrap gap-1">
                  {task.labels.map(label => (
                    <Badge key={label.id} variant="neutral" className={label.color}>
                      {label.name}
                    </Badge>
                  ))}
                </div>
              )}
            </CardHeader>
            <CardContent className="p-3 pt-0 flex flex-col gap-3">
              <div className="flex items-center justify-between mt-1">
                <Badge variant={priorityVariant[task.priority]}>{task.priority}</Badge>
                
                {task.dueDate && (
                  <div className="flex items-center text-xs text-foreground/60 font-medium">
                    <Clock className="w-3 h-3 mr-1" />
                    <span>{task.dueDate}</span>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </Draggable>
  );
}
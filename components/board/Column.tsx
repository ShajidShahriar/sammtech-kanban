'use client';

import { Task } from '@/types';
import { TaskCard } from './TaskCard';
import { Droppable, Draggable } from '@hello-pangea/dnd';
import { Edit2, Trash2 } from 'lucide-react';
import { Button } from '../ui/Button';
import { Badge } from '../ui/Badge';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

interface ColumnProps {
  id: string;
  title: string;
  tasks: Task[];
  index: number;
  onEdit: (id: string, title: string) => void;
  onDelete: (id: string) => void;
}

export function Column({ id, title, tasks, index, onEdit, onDelete }: ColumnProps) {
  return (
    <Draggable draggableId={id} index={index}>
      {(provided) => (
        <div
          className="flex flex-col w-[85vw] sm:w-[320px] max-w-[320px] shrink-0 bg-card-muted dark:bg-card-muted-dark border border-gray-200 dark:border-white/10 rounded-lg p-3 max-h-full"
          ref={provided.innerRef}
          {...provided.draggableProps}
        >
          <div
            className="flex items-center justify-between mb-4 px-1 group cursor-grab active:cursor-grabbing"
            {...provided.dragHandleProps}
          >
            <div className="flex items-center gap-2">
              <h3 className="font-semibold text-sm text-gray-900 dark:text-white">{title}</h3>
              <Badge variant="default" className="px-2 py-0.5">
                {tasks.length}
              </Badge>
            </div>

            <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
              <Button variant="ghost" size="tinyIcon" onClick={() => onEdit(id, title)} title="Edit Column" aria-label="Edit Column">
                <Edit2 className="w-3 h-3 shrink-0" />
              </Button>
              <Button variant="ghost" size="tinyIcon" onClick={() => onDelete(id)} title="Delete Column" aria-label="Delete Column">
                <Trash2 className="w-3 h-3 shrink-0 text-red-500 hover:text-red-600" />
              </Button>
            </div>
          </div>

          <Droppable droppableId={id} type="task">
            {(provided, snapshot) => (
              <div
                className={cn(
                  "flex flex-col gap-3 overflow-y-auto min-h-[150px] pb-2 rounded-lg transition-colors [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]",
                  snapshot.isDraggingOver && "bg-black/5 dark:bg-white/5"
                )}
                ref={provided.innerRef}
                {...provided.droppableProps}
              >
                {tasks.map((task, index) => (
                  <TaskCard key={task.id} task={task} index={index} />
                ))}
                {provided.placeholder}
              </div>
            )}
          </Droppable>
        </div>
      )}
    </Draggable>
  );
}
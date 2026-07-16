'use client';

import { memo } from 'react';
import { Task } from '@/types/task';
import TaskItem from './TaskItem';
import { TaskCardSkeleton } from '@/components/ui/Skeleton';

interface TaskListProps {
  readonly tasks: Task[];
  readonly onToggle: (task: Task) => void;
  readonly onDeleteRequest: (id: number) => void;
  readonly onEditTask: (task: Task) => void;
  readonly loading?: boolean;
}

function TaskList({ tasks, onToggle, onDeleteRequest, onEditTask, loading }: TaskListProps) {
  if (loading) {
    return (
      <div className="space-y-3 animate-fade-in">
        {Array.from({ length: 4 }).map((_, i) => (
          <TaskCardSkeleton key={i} />
        ))}
      </div>
    );
  }

  if (tasks.length === 0) {
    return (
      <div className='flex flex-col items-center justify-center py-16 text-center bg-gray-800/30 rounded-xl border border-dashed border-gray-700/60 animate-fade-in'>
        <svg className="w-16 h-16 text-gray-600 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
        </svg>
        <p className='text-lg text-gray-500 font-medium'>No hay tareas pendientes</p>
        <p className='text-sm text-gray-600 mt-1'>Usa el panel de IA para crear tu primera tarea</p>
      </div>
    )
  }

  return (
    <div className='space-y-3 animate-fade-in'>
      {tasks.map(task => (
        <TaskItem
          key={task.id}
          task={task}
          onToggle={onToggle}
          onDelete={onDeleteRequest}
          onEdit={onEditTask}
        />
      ))}
    </div>
  );
}

export default memo(TaskList);

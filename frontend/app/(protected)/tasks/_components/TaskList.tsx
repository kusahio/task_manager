'use client';

import { memo } from 'react';
import { Task } from '@/types/task';
import TaskItem from './TaskItem';

interface TaskListProps {
  readonly tasks: Task[];
  readonly onToggle: (task: Task) => void;
  readonly onDeleteRequest: (id: number) => void;
  readonly onEditTask: (task: Task) => void;
}

function TaskList({ tasks, onToggle, onDeleteRequest, onEditTask }: TaskListProps) {
  if (tasks.length === 0) {
    return (
      <div className='text-center py-10 text-gray-500 bg-gray-800/50 rounded-xl border border-dashed border-gray-700'>
        <p className='text-lg'>No hay tareas pendientes</p>
      </div>
    )
  }

  return (
    <div className='space-y-3'>
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
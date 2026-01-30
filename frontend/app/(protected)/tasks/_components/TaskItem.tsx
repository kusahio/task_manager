'use client';

import Button from '@/components/ui/Button';
import { Task } from '@/services/task';

interface TaskItemProps {
  task: Task;
  onToggle: (task: Task) => void;
  onDelete: (id: number) => void;
  onEdit: (task: Task) => void;
}

export default function TaskItem({ task, onToggle, onDelete, onEdit }: TaskItemProps) {
  
  const formatDate = (dateString?: string) => {
    if (!dateString) return null;

    return new Date(dateString).toLocaleDateString('es-ES', {
      day: 'numeric',
      month: 'short'
    });
  };

  return (
    <div className={`group flex items-start gap-4 p-4 rounded-xl border transition-all duration-200
    ${task.completed 
      ? 'bg-gray-900/30 border-gray-800 opacity-60'
      : 'bg-gray-800 border-gray-700 hover:border-gray-600 shadow-sm'}`
    }>
      <button
        onClick={() => onToggle(task)}
        className={`cursor-pointer mt-1 w-6 h-6 rounded-full border-2 flex items-center justify-center transition-colors
        ${task.completed 
          ? 'bg-green-500 border-green-500 text-white' 
          : 'border-gray-500 hover:border-blue-500 text-transparent'}`
        }
      >
        ✓
      </button>

      <div className='flex-1 min-w-0'>
        <h3 className={`text-lg font-medium truncate transition-all
          ${task.completed ? 'text-gray-500 line-through' : 'text-white'}`}>
          {task.title}
        </h3>
        {task.description && (
          <p className={`text-sm mt-1 ${task.completed ? 'text-gray-600' : 'text-gray-400'}`}>
            {task.description}
          </p>
        )}
        <div className='flex flex-wrap items-center gap-3 mt-3'>
          {task.deadline && (
            <span className={`text-xs flex items-center gap-1 ${task.completed ? 'text-gray-600' : 'text-red-400'}`}>
              {formatDate(task.deadline)}
            </span>
          )}

          {task.tags.map(tag => (
            <span
              key={tag.id}
              className='px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider text-white shadow-sm'
              style={{backgroundColor: tag.color || '#6b7280'}}
            >
              {tag.name}
            </span>
          ))}
        </div>
      </div>

      <div className="flex flex-col gap-1 opacity-0 group-hover:opacity-100 transition-opacity focus-within:opacity-100">
        
        <Button
          variant='ghost'
          onClick={() => onEdit(task)}
          className='text-gray-500 hover:text-blue-400 hover:bg-blue-500/10 p-2 h-auto'
          title='Editar Tarea'
        >
          Editar
        </Button>
        <Button
          variant='ghost'
          onClick={() => onDelete(task.id)}
          className='text-gray-500 hover:text-red-500 hover:bg-red-500/10 p-2 h-auto'
          title='Eliminar Tarea'
        >
          Eliminar
        </Button>
      </div>

    </div>
  );
}
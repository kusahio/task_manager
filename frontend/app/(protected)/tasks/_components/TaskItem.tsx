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
    <div className={`group flex items-start gap-3 md:gap-4 p-3 md:p-4 rounded-xl border transition-all duration-200
    ${task.completed 
      ? 'bg-gray-900/30 border-gray-800 opacity-60'
      : 'bg-gray-800 border-gray-700 hover:border-gray-600 shadow-sm'}`
    }>
      <button
        onClick={() => onToggle(task)}
        className={`cursor-pointer shrink-0 mt-1 w-6 h-6 rounded-full border-2 flex items-center justify-center transition-colors cursor-pointer
        ${task.completed 
          ? 'bg-green-500 border-green-500 text-white' 
          : 'border-gray-500 hover:border-blue-500 text-transparent'}`
        }
      >
        ✓
      </button>

      <div className='flex-1 min-w-0'>
        <h3 className={`text-base md:text-lg font-medium truncate transition-all
          ${task.completed ? 'text-gray-500 line-through' : 'text-white'}`}
        >
          {task.title}
        </h3>
        {task.description && (
          <p className={`text-xs md:text-sm mt-1 line-clamp-2 ${task.completed ? 'text-gray-600' : 'text-gray-400'}`}>
            {task.description}
          </p>
        )}
        <div className='flex flex-wrap items-center gap-2 md:gap-3 mt-2 md:mt-3'>
          {task.deadline && (
            <span className={`text-xs flex items-center gap-1 ${task.completed ? 'text-gray-600' : 'text-red-400'}`}>
              {formatDate(task.deadline)}
            </span>
          )}

          {task.tags.map(tag => (
            <span
              key={tag.id}
              className='px-1.5 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider text-white shadow-sm'
              style={{backgroundColor: tag.color || '#6b7280'}}
            >
              {tag.name}
            </span>
          ))}
        </div>
      </div>

      <div className={`
        flex flex-col gap-1 
        transition-opacity duration-200 
        opacity-100 lg:opacity-0 lg:group-hover:opacity-100 focus-within:opacity-100
      `}>
        
        <Button
          variant='ghost'
          onClick={() => onEdit(task)}
          className='text-gray-400 hover:text-blue-400 hover:bg-blue-500/10 p-2 md:h-auto md:w-auto flex items-center justify-center'
          title='Editar Tarea'
        >
          Editar
        </Button>
        <Button
          variant='ghost'
          onClick={() => onDelete(task.id)}
          className='text-gray-400 hover:text-red-500 hover:bg-red-500/10 p-2 md:h-auto md:w-auto flex items-center justify-center'
          title='Eliminar Tarea'
        >
          Eliminar
        </Button>
      </div>

    </div>
  );
}
'use client';

import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'sonner';
import { Tag } from '@/services/tag';
import { Task, taskService } from '@/services/task';
import { TaskSchema, taskSchema } from '@/schemas/task';
import TagSelector from './TagSelector';
import Button from '@/components/ui/Button';
import { title } from 'process';

interface TaskFormProps {
  tags: Tag[];
  onSuccess: () => void;
  taskToEdit?: Task | null;
  onCancel?: () => void;
}

export default function TaskForm({ tags, onSuccess, taskToEdit, onCancel }: TaskFormProps) {
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors, isSubmitting }
  } = useForm<TaskSchema>({
    resolver: zodResolver(taskSchema),
    defaultValues: {
      title: '',
      description: '',
      tags: [],
      deadline: ''
    }
  })

  useEffect(() => {
    if (taskToEdit) {
      const formatedDate = taskToEdit.deadline
        ? new Date(taskToEdit.deadline).toISOString().split('T')[0]
        : ''

      reset({
        title: taskToEdit.title,
        description: taskToEdit.description,
        deadline: formatedDate,
        tags: taskToEdit?.tags.map(tag => tag.id)
      });
    } else {
      reset({ title: '', description: '', deadline: '', tags: [] });
    }


  }, [taskToEdit, reset])

  const selectedTags = watch('tags') || [];

  const onSubmit = async (data: TaskSchema) => {
    try {
      const payload = {
        title: data.title,
        description: data.description || undefined,
        tags: data.tags,
        deadline: data.deadline ? new Date(data.deadline).toISOString() : null
      };

      if (taskToEdit) {
        await taskService.update(taskToEdit.id, payload);
        toast.success('La tarea se ha actualizado')
      } else {
        await taskService.create(payload)
        toast.success('Tarea creada exitosamente');
        reset();
      }
      onSuccess();
    } catch (err: any) {
      toast.error(err.toString() || 'Hubo un error al crear/actualizar la tarea');
    }
  }
  return (
    <div className={`${!taskToEdit ? 'bg-gray-800 p-6 rounded-xl shadow-lg border border-gray-700' : ''} h-fit`}>
      <h2 className='text-xl font-bold text-white mb-4 flex intems-center gap-2'>
        {taskToEdit ? 'Editar Tarea' : 'Crear Nueva Tarea'}
      </h2>

      <form onSubmit={handleSubmit(onSubmit)} className='space-y-4'>
        <div>
          <input
            {...register('title')}
            placeholder='¿Qué necesitas hacer?'
            className='w-full bg-transparent text-lg font-medium text-white placeholder-gray-500
            focus:outline-none border-b border-gray-600 focus:border-blue-500 pb-2 transition-colors'
            autoComplete='off'
          />
          {errors.title && <span className='text-red-400 text-xs mt-1 block'>{errors.title.message}</span>}
        </div>
        <div>
          <textarea
            {...register('description')}
            placeholder='Detalles de la tarea (opcional)'
            rows={3}
            className='w-full bg-gray-900/50 text-sm text-gray-300 rounded-lg p-3 focus:outline-none focus:ring-1
            focus:ring-blue-500/50 resize-none border border-transparent focus:border-blue-500/30 transition-all'
          />
        </div>
        <div className='flex flex-col gap-1'>
          <label className='text-xs uppercase font-bold text-gray-500'>
            Fecha Límite
          </label>
          <input
            type='date'
            {...register('deadline')}
            className='bg-gray-700 text-white text-sm rounded-lg px-3 py-2 outline-none focus:ring-1
            focus:ring-blue-500 w-full cursor-pointer'
          />
        </div>
        <div className='flex flex-col gap-1'>
          <label className='text-xs uppercase font-bold text-gray-500'>Etiquetas</label>
          <TagSelector
            availableTags={tags}
            selectedTagIds={selectedTags}
            onChange={(newTags) => setValue('tags', newTags)}
          />
        </div>
        <div className='flex gap-3 pt-2'>
          {taskToEdit && onCancel && (
            <Button
              type='button'
              variant='ghost'
              onClick={onCancel}
              className='flex-1'
            >
              Cancelar
            </Button>
          )}
          <Button
            type='submit'
            variant='primary'
            isLoading={isSubmitting}
            className={taskToEdit ? 'flex-1' : 'w-full'}
          >
            {isSubmitting ? 'Guardando...' : (taskToEdit ? 'Guardar Cambios' : 'Crear Tarea')}
          </Button>
        </div>
      </form>
    </div>
  )
}
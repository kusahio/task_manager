'use client';

import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'sonner';
import { Tag } from '@/types/tag';
import { Task } from '@/types/task'
import { taskService } from '@/services/task';
import { parseTaskWithAI } from '@/services/ai';
import { TaskSchema, taskSchema } from '@/schemas/task';
import TagSelector from './TagSelector';
import Button from '@/components/ui/Button';

interface TaskFormProps {
  tags: Tag[];
  onSuccess: () => void;
  taskToEdit?: Task | null;
  onCancel?: () => void;
}

export default function TaskForm({ tags, onSuccess, taskToEdit, onCancel }: TaskFormProps) {
  
  const [aiPrompt, setAiPrompt] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  
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

  const handleAiParse = async () => {
    if(!aiPrompt.trim()) return;
    setIsAnalyzing(true);

    try{
      const parsedData = await parseTaskWithAI(aiPrompt);

      if(parsedData.title.includes('Error:')){
        toast.warning('La IA indica que el texto no parece una tarea válida.');
        return;
      }

      setValue('title', parsedData.title, { shouldValidate: true });

      if(parsedData.description){
        setValue('description', parsedData.description, { shouldValidate: true });
      }

      if(parsedData.deadline){
        const formattedDate = new Date(parsedData.deadline).toISOString().split('T')[0];
        setValue('deadline', formattedDate, { shouldValidate: true})
      }

      if(parsedData.tags && parsedData.tags.length > 0){
        const matchedTagIds = tags
          .filter(existingTag => 
            parsedData.tags.some(aiTag => aiTag.toLowerCase() === existingTag.name.toLowerCase())
          )
          .map(t => t.id);

          if(matchedTagIds.length > 0){
            setValue('tags', matchedTagIds, { shouldValidate: true });
          }
      }

      toast.success('Formulario autocompletado con éxito')
      setAiPrompt('');
    } catch (err){
      toast.error('Hubo un error al analizar el texto con IA')
      console.error(err);
    } finally {
      setIsAnalyzing(false);
    }
  }

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

      {!taskToEdit && (
        <div className="mb-6 p-4 bg-gradient-to-br from-blue-900/30 to-purple-900/30 border border-blue-700/50 rounded-xl shadow-inner">
          <label className="text-xs font-bold text-blue-300 uppercase mb-2 block">
            Asistente de IA para crear tareas
          </label>
          <div className="flex gap-2">
            <input
              type="text"
              value={aiPrompt}
              onChange={(e) => setAiPrompt(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  handleAiParse();
                }
              }}
              placeholder="Ej: Dentista pasado mañana a las 16hs #salud #urgente"
              className="flex-1 bg-gray-900/60 text-sm text-white rounded-lg px-3 py-2 border border-blue-800/50 focus:outline-none focus:border-blue-500 transition-colors"
              disabled={isAnalyzing}
              autoComplete="off"
            />
            <Button
              type="button"
              variant="primary"
              onClick={handleAiParse}
              isLoading={isAnalyzing}
              disabled={!aiPrompt.trim()}
              className="px-4 py-2"
            >
              {!isAnalyzing && 'Analizar'}
            </Button>
          </div>
          <p className="text-gray-400 text-[11px] mt-2 leading-tight">
            Escribe de forma natural y Gemini auto-completará el título, la fecha y las etiquetas por ti.
          </p>
        </div>
      )}

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
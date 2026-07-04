'use client';

import { useTaskForm } from '@/hooks/useTaskForm';
import { Tag } from '@/types/tag';
import { Task } from '@/types/task';
import TagSelector from './TagSelector';
import Button from '@/components/ui/Button';

interface TaskFormProps {
  tags: Tag[];
  onSuccess: () => void;
  taskToEdit?: Task | null;
  onCancel?: () => void;
}

export default function TaskForm({ tags, onSuccess, taskToEdit, onCancel }: Readonly<TaskFormProps>) {
  const { ai, form, meta } = useTaskForm({ tags, onSuccess, taskToEdit, onCancel });

  let submitButtonLabel = 'Crear Tarea';
  if (form.isSubmitting) {
    submitButtonLabel = 'Guardando...';
  } else if (meta.taskToEdit) {
    submitButtonLabel = 'Guardar Cambios';
  }

  return (
    <div className={`${meta.taskToEdit ? '' : 'bg-gray-800 p-6 rounded-xl shadow-lg border border-gray-700'} h-fit`}>
      <h2 className='text-xl font-bold text-white mb-4 flex items-center gap-2'>
        {meta.taskToEdit ? 'Editar Tarea' : 'Crear Nueva Tarea'}
      </h2>

      {!meta.taskToEdit && (
        <div className="mb-6 p-4 bg-gradient-to-br from-blue-900/30 to-purple-900/30 border border-blue-700/50 rounded-xl shadow-inner">
          <label className="text-xs font-bold text-blue-300 uppercase mb-2 block">
            Asistente de IA para crear tareas
          </label>
          <div className="flex gap-2">
            <input
              type="text"
              value={ai.prompt}
              onChange={(e) => ai.setPrompt(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  ai.handleParse();
                }
              }}
              placeholder="Ej: Dentista pasado mañana a las 16hs #salud #urgente"
              className="flex-1 bg-gray-900/60 text-sm text-white rounded-lg px-3 py-2 border border-blue-800/50 focus:outline-none focus:border-blue-500 transition-colors"
              disabled={ai.isAnalyzing}
              autoComplete="off"
            />
            <Button
              type="button"
              variant="primary"
              onClick={ai.handleParse}
              isLoading={ai.isAnalyzing}
              disabled={!ai.prompt.trim()}
              className="px-4 py-2"
            >
              {!ai.isAnalyzing && 'Analizar'}
            </Button>
          </div>
          <p className="text-gray-400 text-[11px] mt-2 leading-tight">
            Escribe de forma natural y Gemini auto-completará el título, la fecha y las etiquetas por ti.
          </p>
        </div>
      )}

      <form onSubmit={form.handleSubmit} className='space-y-4'>
        <div>
          <input
            {...form.register('title')}
            placeholder='¿Qué necesitas hacer?'
            className='w-full bg-transparent text-lg font-medium text-white placeholder-gray-500
            focus:outline-none border-b border-gray-600 focus:border-blue-500 pb-2 transition-colors'
            autoComplete='off'
          />
          {form.errors.title && <span className='text-red-400 text-xs mt-1 block'>{form.errors.title.message}</span>}
        </div>
        <div>
          <textarea
            {...form.register('description')}
            placeholder='Detalles de la tarea (opcional)'
            rows={3}
            className='w-full bg-gray-900/50 text-sm text-gray-300 rounded-lg p-3 focus:outline-none focus:ring-1
            focus:ring-blue-500/50 resize-none border border-transparent focus:border-blue-500/30 transition-all'
          />
        </div>
        <div className='flex flex-col gap-1'>
          <label className='text-xs uppercase font-bold text-gray-500'>Fecha Límite</label>
          <input
            type='date'
            {...form.register('deadline')}
            className='bg-gray-700 text-white text-sm rounded-lg px-3 py-2 outline-none focus:ring-1
            focus:ring-blue-500 w-full cursor-pointer'
          />
        </div>
        <div className='flex flex-col gap-1'>
          <label className='text-xs uppercase font-bold text-gray-500'>Etiquetas</label>
          <TagSelector
            availableTags={tags}
            selectedTagIds={form.selectedTags}
            onChange={(newTags) => form.setValue('tags', newTags)}
          />
        </div>
        <div className='flex gap-3 pt-2'>
          {meta.taskToEdit && meta.onCancel && (
            <Button type='button' variant='ghost' onClick={meta.onCancel} className='flex-1'>
              Cancelar
            </Button>
          )}
          <Button
            type='submit'
            variant='primary'
            isLoading={form.isSubmitting}
            className={meta.taskToEdit ? 'flex-1' : 'w-full'}
          >
            {submitButtonLabel}
          </Button>
        </div>
      </form>
    </div>
  );
}
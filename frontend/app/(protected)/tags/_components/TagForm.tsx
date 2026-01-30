'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { tagService } from '@/services/tag';
import { TagSchemaType, tagSchema } from '@/schemas/tag';
import { toast } from 'sonner';

interface TagFormProps{
  onSuccess: () => void;
}

export default function TagForm({onSuccess} : TagFormProps){
  const {
    register,
    handleSubmit,
    reset,
    formState: {
      errors,
      isSubmitting
    }
  } = useForm<TagSchemaType>({
    resolver: zodResolver(tagSchema),
    defaultValues: {
      name: '',
      color: '#3B82F6'
    }
  });

  const onSubmit = async (data: TagSchemaType) => {
    try {
      await tagService.create({ ...data, color: data.color || '#3b82f6' });
      toast.success('Etiqueta creada correctamente!')
      reset();
      onSuccess();
    } catch (err) {
      toast.error('Error al crear crear la etiqueta');
    }
  }

  return (
    <div className='bg-gray-800 p-6 rounded-xl shadow-lg h-fit'>
      <h2 className='text-xl font-semibold text-blue-400 mb-4'>Nuevo Tag</h2>

      <form onSubmit={handleSubmit(onSubmit)} className='space-y-4'>
        <div>
          <label className='block text-sm text-gray-400 mb-1'>Nombre de la etiqueta</label>
          <input
            {...register('name')}
            className={`w-full bg-gray-700 text-white rounder p-2 focus:outline-none border 
            ${errors.name ? 'border-red-500' : 'border-transparent focus:border-blue-500'}`}
            placeholder='Ej: Trabajo, Compras...'
          />
          {errors.name && <span className='text-red-400 text-xs'>{errors.name.message}</span>}
        </div>
        <div>
          <label className='block text-sm text-gray-400 mb-1'>Color</label>
          <input
            {...register('color')}
            type='color'
            className='h-10 w-20 bg-transparent cursor-pointer'
          />
        </div>
        <button
          type='submit'
          className='w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 rounded transition disabled:opacity-50 cursor-pointer'
        >
          {isSubmitting ? 'Guardando...' : 'Crear etiqueta'}
        </button>
      </form>
    </div>
  )
}
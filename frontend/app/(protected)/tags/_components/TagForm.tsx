'use client';

import { useTagForm } from '@/hooks/useTagForm';

interface TagFormProps {
  readonly onSuccess: () => void;
}

export default function TagForm({ onSuccess }: TagFormProps) {
  const { register, errors, isSubmitting, handleSubmit } = useTagForm(onSuccess);

  return (
    <div className='bg-gray-800 p-6 rounded-xl shadow-lg h-fit'>
      <h2 className='text-xl font-semibold text-blue-400 mb-4'>Nuevo Tag</h2>

      <form onSubmit={handleSubmit} className='space-y-4'>
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
  );
}
'use client';

import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Tag, tagService } from '@/services/tag';
import { TagSchemaType, tagSchema } from '@/schemas/tag';
import { toast } from 'sonner';

export default function TagsPage() {
  const [tags, setTags] = useState<Tag[]>([]);
  const [loading, setLoading] = useState(true);

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

  useEffect(() => { loadTags() }, []);

  const loadTags = async () => {
    try {
      const data = await tagService.getAll();
      setTags(data);
    } catch (err: any) {
      console.error(`No se pudieron cargar las etiquetas | ${err}`);
      toast.error(err)
    } finally {
      setLoading(false);
    }
  }

  const onSubmit = async (data: TagSchemaType) => {
    try {
      await tagService.create({ ...data, color: data.color || '#3b82f6' });
      reset();
      loadTags();
      toast.success('Tag creado correctamente!')
    } catch (err) {
      toast.error('Error al crear el Tag');
    }
  }

  const handleDelete = async (id: number) => {
    if (!confirm('¿Estás seguro de eliminar esta etiqueta?')) {
      return;
    }

    try {
      await tagService.delete(id);
      setTags((prevTags) => prevTags.filter(tag => tag.id !== id))
      toast.success('Tag eliminado');
    } catch (err) {
      toast.error('No se pudo eliminar el Tag');
    }
  }

  if (loading) {
    return <div className='text-white p-8'>Cargando etiquetas...</div>
  }

  return (
    <div className='p-8'>
      <h1 className='text-3xl font-bold text-white mb-8'>Etiquetas</h1>
      <div className='grid grid-cols-1 md:grid-cols-2 gap-8'>
        <div className='bg-gray-800 p-6 rounded-xl shadow-lg h-fit'>
          <h2 className='text-xl font-semibold text-blue-400 mb-4'>Crear nueva etiqueta</h2>
          <form onSubmit={handleSubmit(onSubmit)} className='space-y-4'>
            <div>
              <label className='block text-sm text-gray-400 mb-1'>Nombre de etiqueta</label>
              <input {...register('name')} type="text" placeholder='Ej: Trabajo, Urgente...'
                className='w-full bg-gray-700 text-white rounded p-2 focus:ring-2 focus:ring-blue-500 outline-none' />
              {errors.name && <span className='text-red-400 text-xs'>{errors.name.message}</span>}
            </div>
            <div>
              <label className="block text-sm text-gray-400 mb-1">Color</label>
              <div className="flex items-center gap-4">
                <input
                  {...register('color')}
                  type="color"
                  className="h-10 w-20 cursor-pointer bg-transparent rounded"
                  defaultValue="#3B82F6"
                />
                <span className="text-gray-500 text-sm">
                  {errors.color ?
                    (<span className="text-red-400">{errors.color.message}</span>) :
                    ("Elige un color distintivo")
                  }
                </span>
              </div>
            </div>
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 rounded transition"
            >
              {isSubmitting ? 'Guardando...' : 'Crear Etiqueta'}
            </button>
          </form>
        </div>
        <div className="bg-gray-800 p-6 rounded-xl shadow-lg">
          <h2 className="text-xl font-semibold text-green-400 mb-4">Mis Etiquetas ({tags.length})</h2>

          {tags.length === 0 ? (
            <p className="text-gray-500">No hay etiquetas creadas aún.</p>
          ) : (
            <div className="space-y-3 max-h-[400px] overflow-y-auto pr-2">
              {tags.map((tag) => (
                <div key={tag.id} className="flex items-center justify-between p-3 bg-gray-700/50 rounded-lg hover:bg-gray-700 transition">
                  <div className="flex items-center gap-3">
                    <span
                      className="w-4 h-4 rounded-full shadow-sm"
                      style={{ backgroundColor: tag.color || '#ccc' }}
                    />
                    <span className="text-white font-medium">{tag.name}</span>
                  </div>

                  <button
                    onClick={() => handleDelete(tag.id)}
                    className="text-red-400 hover:text-red-300 text-sm px-2 py-1 rounded hover:bg-red-400/10"
                  >
                    Eliminar
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
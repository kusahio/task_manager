'use client';

import { useEffect, useState } from 'react';
import { Tag, tagService } from '@/services/tag';
import { toast } from 'sonner';
import ConfirmModal from '@/components/ConfirmModal';
import TagForm from './_components/TagForm';
import TagList from './_components/TagList';

export default function TagsPage() {
  const [tags, setTags] = useState<Tag[]>([]);
  const [loading, setLoading] = useState(true);
  const [tagToDelete, setTagToDelete] = useState<number | null>(null)

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

  useEffect(() => { loadTags() }, []);

  const onDeleteConfirm = async () => {
    if (tagToDelete === null) return;

    try {
      await tagService.delete(tagToDelete);
      setTags((prev) => prev.filter((tag) => tag.id !== tagToDelete));
      toast.success('Etiqueta eliminada')
    } catch (err: any) {
      toast.error('No se pudo eliminar la etiqueta')
    }
    setTagToDelete(null)
  }


  if (loading) {
    return <div className='text-white p-8'>Cargando etiquetas...</div>
  }

  return (
    <div className='p-4 md:p-8 max-w-6xl mx-auto'>
      <h1 className='text-2xl md:text-3xl font-bold text-white mb-6 md:mb-8'>Etiquetas</h1>
      <div className='grid grid-cols-1 lg:grid-cols-2 gap-8 items-start'>
        <div className='bg-gray-800 p-5 md:p-6 rounded-xl border border-gray-700 shadow-lg'>
          <TagForm onSuccess={loadTags} />
        </div>
        <div className='bg-gray-800/50 p-5 md:p-6 rounded-xl border border-gray-700'>
          <TagList
            tags={tags}
            onDelete={(id) => setTagToDelete(id)}
            onRefresh={loadTags}
          />
        </div>
      </div>
      <ConfirmModal
        isOpen={tagToDelete !== null}
        onClose={() => setTagToDelete(null)}
        onConfirm={onDeleteConfirm}
        title='¿Eliminar etiqueta?'
        message='Esta acción no se puede deshacer. La etiqueta desaparecerá de todas las tareas asignadas.'
      />
    </div>
  )
}
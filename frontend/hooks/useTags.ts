'use client';

import { useCallback, useEffect, useState } from 'react';
import { toast } from 'sonner';
import { tagService } from '@/services/tag';
import { Tag } from '@/types/tag';

export function useTags() {
  const [tags, setTags] = useState<Tag[]>([]);
  const [loading, setLoading] = useState(true);
  const [tagToDelete, setTagToDelete] = useState<number | null>(null);

  const loadTags = useCallback(async () => {
    setLoading(true);
    try {
      const data = await tagService.getAll();
      setTags(data);
    } catch {
      toast.error('Error al cargar etiquetas');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { loadTags(); }, [loadTags]);

  const deleteTag = async () => {
    if (tagToDelete === null) return;
    try {
      await tagService.delete(tagToDelete);
      setTags((prev) => prev.filter((tag) => tag.id !== tagToDelete));
      toast.success('Etiqueta eliminada');
    } catch {
      toast.error('No se pudo eliminar la etiqueta');
    }
    setTagToDelete(null);
  };

  return { tags, loading, loadTags, deleteTag, tagToDelete, setTagToDelete };
}
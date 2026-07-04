'use client';

import { useState } from 'react';
import { toast } from 'sonner';
import { tagService } from '@/services/tag';
import { Tag } from '@/types/tag';
import { DEFAULT_TAG_COLOR } from '@/constants';

type EditingTag = { id: number; name: string; color: string } | null;

export function useTagEdit(onRefresh: () => void) {
  const [editing, setEditing] = useState<EditingTag>(null);

  const startEditing = (tag: Tag) => {
    setEditing({ id: tag.id, name: tag.name, color: tag.color || DEFAULT_TAG_COLOR });
  };

  const cancelEditing = () => setEditing(null);

  const updateField = (field: 'name' | 'color', value: string) => {
    setEditing((prev) => (prev ? { ...prev, [field]: value } : prev));
  };

  const handleSave = async () => {
    if (!editing) return;
    if (!editing.name.trim()) {
      toast.error('El nombre de la etiqueta no puede estar vacío');
      return;
    }
    try {
      await tagService.update(editing.id, { name: editing.name.trim(), color: editing.color });
      toast.success('La etiqueta se actualizó correctamente');
      onRefresh();
      cancelEditing();
    } catch {
      toast.error('No se pudo actualizar la etiqueta');
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') handleSave();
    if (e.key === 'Escape') cancelEditing();
  };

  return { editing, startEditing, cancelEditing, updateField, handleSave, handleKeyDown };
}
'use client';

import { useState } from 'react';
import { toast } from 'sonner';
import { tagService } from '@/services/tag';
import { Tag } from '@/types/tag';
import { DEFAULT_TAG_COLOR } from '@/constants/index';

export function useTagEdit(onRefresh: () => void) {
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editName, setEditName] = useState('');
  const [editColor, setEditColor] = useState('');

  const startEditing = (tag: Tag) => {
    setEditingId(tag.id);
    setEditName(tag.name);
    setEditColor(tag.color || DEFAULT_TAG_COLOR);
  };

  const cancelEditing = () => {
    setEditingId(null);
    setEditName('');
    setEditColor('');
  };

  const handleSave = async (id: number) => {
    if (!editName.trim()) {
      toast.error('El nombre de la etiqueta no puede estar vacío');
      return;
    }
    try {
      await tagService.update(id, { name: editName.trim(), color: editColor });
      toast.success('La etiqueta se actualizó correctamente');
      onRefresh();
      cancelEditing();
    } catch {
      toast.error('No se pudo actualizar la etiqueta');
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent, id: number) => {
    if (e.key === 'Enter') handleSave(id);
    if (e.key === 'Escape') cancelEditing();
  };

  return { editingId, editName, editColor, setEditName, setEditColor, startEditing, cancelEditing, handleSave, handleKeyDown };
}
'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'sonner';
import { tagService } from '@/services/tag';
import { TagSchemaType, tagSchema } from '@/schemas/tag';

export function useTagForm(onSuccess: () => void) {
  const { register, handleSubmit, reset, formState: { errors, isSubmitting } } = useForm<TagSchemaType>({
    resolver: zodResolver(tagSchema),
    defaultValues: { name: '', color: '#3B82F6' }
  });

  const onSubmit = async (data: TagSchemaType) => {
    try {
      await tagService.create({ ...data, color: data.color || '#3b82f6' });
      toast.success('Etiqueta creada correctamente!');
      reset();
      onSuccess();
    } catch {
      toast.error('Error al crear la etiqueta');
    }
  };

  return { register, errors, isSubmitting, handleSubmit: handleSubmit(onSubmit) };
}
'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'sonner';
import { tagService } from '@/services/tag';
import { TagSchemaType, tagSchema } from '@/schemas/tag';
import { DEFAULT_TAG_COLOR } from '@/constants/index';

export function useTagForm(onSuccess: () => void) {
  const { register, handleSubmit, reset, formState: { errors, isSubmitting } } = useForm<TagSchemaType>({
    resolver: zodResolver(tagSchema),
    defaultValues: { name: '', color: DEFAULT_TAG_COLOR }
  });

  const onSubmit = async (data: TagSchemaType) => {
    try {
      await tagService.create({ ...data, color: data.color || DEFAULT_TAG_COLOR });
      toast.success('Etiqueta creada correctamente!');
      reset();
      onSuccess();
    } catch {
      toast.error('Error al crear la etiqueta');
    }
  };

  return { register, errors, isSubmitting, handleSubmit: handleSubmit(onSubmit) };
}
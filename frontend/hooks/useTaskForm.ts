'use client';

import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'sonner';
import { taskService } from '@/services/task';
import { parseTaskWithAI } from '@/services/ai';
import { TaskSchema, taskSchema } from '@/schemas/task';
import { formatDateForInput, formatDateToISO } from '@/utils/date';
import { matchTagsFromAI } from '@/utils/task-parser';
import { Tag } from '@/types/tag';
import { Task } from '@/types/task';

interface UseTaskFormProps {
  tags: Tag[];
  onSuccess: () => void;
  taskToEdit?: Task | null;
  onCancel?: () => void;
}

export function useTaskForm({ tags, onSuccess, taskToEdit, onCancel }: UseTaskFormProps) {
  const [aiPrompt, setAiPrompt] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const form = useForm<TaskSchema>({
    resolver: zodResolver(taskSchema),
    defaultValues: {
      title: '',
      description: '',
      tags: [],
      deadline: ''
    }
  });

  const { setValue, watch, reset, register, handleSubmit, formState: { errors, isSubmitting } } = form;

  useEffect(() => {
    if (taskToEdit) {
      reset({
        title: taskToEdit.title,
        description: taskToEdit.description,
        deadline: formatDateForInput(taskToEdit.deadline),
        tags: taskToEdit.tags.map(tag => tag.id)
      });
    } else {
      reset({ title: '', description: '', deadline: '', tags: [] });
    }
  }, [taskToEdit, reset]);

  const selectedTags = watch('tags') || [];

  const handleAiParse = async () => {
    if (!aiPrompt.trim()) return;
    setIsAnalyzing(true);

    try {
      const parsedData = await parseTaskWithAI(aiPrompt);

      if (parsedData.title.includes('Error:')) {
        toast.warning('La IA indica que el texto no parece una tarea válida.');
        return;
      }

      setValue('title', parsedData.title, { shouldValidate: true });

      if (parsedData.description) {
        setValue('description', parsedData.description, { shouldValidate: true });
      }

      if (parsedData.deadline) {
        setValue('deadline', formatDateForInput(parsedData.deadline), { shouldValidate: true });
      }

      if (parsedData.tags && parsedData.tags.length > 0) {
        const matchedTagIds = matchTagsFromAI(parsedData.tags, tags);
        if (matchedTagIds.length > 0) {
          setValue('tags', matchedTagIds, { shouldValidate: true });
        }
      }

      toast.success('Formulario autocompletado con éxito');
      setAiPrompt('');
    } catch {
      toast.error('Hubo un error al analizar el texto con IA');
    } finally {
      setIsAnalyzing(false);
    }
  };

  const onSubmit = async (data: TaskSchema) => {
    try {
      const payload = {
        title: data.title,
        description: data.description || undefined,
        tags: data.tags,
        deadline: data.deadline ? formatDateToISO(data.deadline) : null
      };

      if (taskToEdit) {
        await taskService.update(taskToEdit.id, payload);
        toast.success('La tarea se ha actualizado');
      } else {
        await taskService.create(payload);
        toast.success('Tarea creada exitosamente');
        reset();
      }
      onSuccess();
    } catch {
      toast.error('Hubo un error al crear o actualizar la tarea');
    }

  };

  return {
    aiPrompt,
    setAiPrompt,
    isAnalyzing,
    register,
    handleSubmit: handleSubmit(onSubmit),
    errors,
    isSubmitting,
    selectedTags,
    setValue,
    taskToEdit,
    onCancel,
    handleAiParse
  };
}
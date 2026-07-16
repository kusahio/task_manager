'use client';

import { useCallback, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'sonner';
import { ChatMessage } from '@/types/chat';
import { ChatResponse, TagSuggestionItem, TaskPreview } from '@/types/ai';
import { chatWithAI, suggestTaskData } from '@/services/ai';
import { taskService } from '@/services/task';
import { TaskSchema, taskSchema } from '@/schemas/task';
import { formatDateToISO } from '@/utils/date';


export function useAIChat(onTaskCreated?: () => void) {
  const [isOpen, setIsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<'manual' | 'ai'>('manual');

  const toggle = useCallback(() => setIsOpen((prev) => !prev), []);
  const close = useCallback(() => setIsOpen(false), []);

  const form = useForm<TaskSchema>({
    resolver: zodResolver(taskSchema),
    defaultValues: {
      title: '',
      description: '',
      tags: [],
      deadline: ''
    }
  })

  const { setValue, watch, reset, register, handleSubmit, formState: { errors, isSubmitting } } = form;
  const selectedTags = watch('tags') || [];

  const [tagSuggestions, setTagSuggestions] = useState<TagSuggestionItem[]>([]);
  const [selectedNewSuggestionNames, setSelectedNewSuggestionNames] = useState<string[]>([]);

  const fetchSuggestions = useCallback(async (title: string, description: string) => {
    try {
      const results = await suggestTaskData(title, description);
      setTagSuggestions(results.suggested_tags);
    } catch {
      setTagSuggestions([]);
    }
  }, [])

  const handleManualSubmit = async (data: TaskSchema) => {
    try {
      const payload = {
        title: data.title,
        description: data.description || undefined,
        tags: data.tags,
        new_tag_names: selectedNewSuggestionNames,
        deadline: data.deadline ? formatDateToISO(data.deadline) : null
      };

      await taskService.create(payload);
      toast.success('Tarea creada exitosamente');
      reset();
      setTagSuggestions([]);
      setSelectedNewSuggestionNames([]);
      onTaskCreated?.();
    } catch {
      toast.error('Error al crear la tarea')
    }
  }

  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [pendingResponse, setPendingResponse] = useState<ChatResponse | null>(null);

  const sendMessage = useCallback(async (text: string) => {
    if (!text.trim()) return;

    const userMsg: ChatMessage = { id: crypto.randomUUID(), role: 'user', content: text };
    setMessages((prev) => [...prev, userMsg]);
    setIsProcessing(true);
    setPendingResponse(null);

    try {
      const allMessages = [...messages, userMsg];
      const response = await chatWithAI(allMessages);

      const assistantMsg: ChatMessage = {
        id: crypto.randomUUID(),
        role: 'assistant',
        content: response.message,
      };
      setMessages((prev) => [...prev, assistantMsg]);

      if (response.action.type === 'create_tasks' && response.action.data?.tasks?.length) {
        setPendingResponse(response);
      }
    } catch {
      const errorMsg: ChatMessage = {
        id: crypto.randomUUID(),
        role: 'assistant',
        content: 'Hubo un error al procesar tu mensaje. Intenta de nuevo.',
      };
      setMessages((prev) => [...prev, errorMsg]);
    } finally {
      setIsProcessing(false);
    }
  }, [messages]);

  const confirmTasks = useCallback(async () => {
    if (!pendingResponse?.action?.data?.tasks) return;

    const tasks: TaskPreview[] = pendingResponse.action.data.tasks;
    let created = 0;

    for (const task of tasks) {
      try {
        await taskService.create({
          title: task.title,
          description: task.description || undefined,
          deadline: task.deadline ? formatDateToISO(task.deadline) : null,
          tags: task.existing_tag_ids,
          new_tag_names: task.new_tag_names,
        });
        created++;
      } catch {
        toast.error(`Error al crear: ${task.title}`);
      }
    }

    const successMsg: ChatMessage = {
      id: crypto.randomUUID(),
      role: 'system',
      content: `${created} tarea(s) creada(s) exitosamente`,
    };
    setMessages((prev) => [...prev, successMsg]);
    setPendingResponse(null);
    toast.success(`${created} tarea(s) creada(s)`);
    if (created > 0) onTaskCreated?.();
  }, [pendingResponse, onTaskCreated]);

  const cancelTasks = useCallback(() => {
    const cancelMsg: ChatMessage = {
      id: crypto.randomUUID(),
      role: 'system',
      content: 'Creación cancelada',
    };
    setMessages((prev) => [...prev, cancelMsg]);
    setPendingResponse(null);
  }, []);

  const clear = useCallback(() => {
    setMessages([]);
    setPendingResponse(null);
  }, []);

  return {
    isOpen, toggle, close,
    activeTab, setActiveTab,

    form: { register, handleSubmit: handleSubmit(handleManualSubmit), errors, isSubmitting, selectedTags, setValue, reset },
    tagSuggestions, fetchSuggestions, setTagSuggestions,
    selectedNewSuggestionNames, setSelectedNewSuggestionNames,

    messages, isProcessing, pendingResponse,
    sendMessage, confirmTasks, cancelTasks, clear,
  };
}
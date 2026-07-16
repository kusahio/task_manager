'use client';

import { useState } from 'react';
import { toast } from 'sonner';
import { taskService } from '@/services/task';

export function useTaskDelete(onTaskUpdate: () => void) {
  const [taskToDelete, setTaskToDelete] = useState<number | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const confirmDelete = async () => {
    if (taskToDelete === null) return;
    setIsDeleting(true);
    try {
      await taskService.delete(taskToDelete);
      toast.success('La tarea ha sido eliminada');
      onTaskUpdate();
      setTaskToDelete(null);
    } catch {
      toast.error('Ha ocurrido un error al intentar eliminar la tarea');
    } finally {
      setIsDeleting(false);
    }
  };

  return { taskToDelete, setTaskToDelete, isDeleting, confirmDelete };
}
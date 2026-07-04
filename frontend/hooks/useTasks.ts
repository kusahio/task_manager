'use client';

import { useCallback, useEffect, useState } from 'react';
import { toast } from 'sonner';
import { taskService } from '@/services/task';
import { Task } from '@/types/task';

export function useTasks() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);

  const loadData = useCallback(async () => {
    setLoading(true);
    try {
      const taskData = await taskService.getAll();
      setTasks(taskData);
    } catch {
      toast.error('Hubo un error al cargar los datos');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { loadData(); }, [loadData]);

  return { tasks, loading, loadData };
}
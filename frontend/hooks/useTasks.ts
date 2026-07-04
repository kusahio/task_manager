'use client';

import { useCallback, useEffect, useState } from 'react';
import { toast } from 'sonner';
import { taskService } from '@/services/task';
import { tagService } from '@/services/tag';
import { Task } from '@/types/task';
import { Tag } from '@/types/tag';

export function useTasks() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [tags, setTags] = useState<Tag[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingTask, setEditingTask] = useState<Task | null>(null);

  const loadData = useCallback(async () => {
    setLoading(true);
    try {
      const [taskData, tagsData] = await Promise.all([
        taskService.getAll(),
        tagService.getAll()
      ]);
      setTasks(taskData);
      setTags(tagsData);
    } catch (err: any) {
      toast.error(`Hubo un error al cargar los datos | ${err}`);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { loadData(); }, [loadData]);

  return { tasks, tags, loading, editingTask, setEditingTask, loadData };
}
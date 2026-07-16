import api from "@/utils/api";
import { baseURL } from "@/constants/index";
import { Task, TaskCreate, TaskSummary, TaskUpdate } from "@/types/task";
import { PaginatedResponse } from "@/types/api";

export const SESSION_EXPIRED = 'SESSION_EXPIRED' as const;

export const taskService = {
  getAll: async () => {
    const { data } = await api.get<PaginatedResponse<Task>>('/tasks/');
    return data.data;
  },

  getById: async (id: number) => {
    const { data } = await api.get<Task>(`/tasks/${id}`);
    return data;
  },

  create: async (task: TaskCreate) => {
    const { data } = await api.post<Task>('/tasks/', task);
    return data;
  },

  update: async (id: number, task: TaskUpdate) => {
    const { data } = await api.patch<Task>(`/tasks/${id}`, task);
    return data;
  },

  delete: async (id: number) => {
    await api.delete(`/tasks/${id}`);
  },

  toggleComplete: async (id: number, currentStatus: boolean) => {
    const { data } = await api.patch<Task>(`/tasks/${id}`, {
      completed: !currentStatus
    });
    return data;
  },

  getSummary: async () => {
    const { data } = await api.get<TaskSummary>('/tasks/summary');
    return data;
  },

  getSummaryWithToken: async (accessToken: string): Promise<TaskSummary | null | typeof SESSION_EXPIRED> => {
    try {
      const response = await fetch(`${baseURL}/tasks/summary`, {
        headers: { Authorization: `Bearer ${accessToken}` },
        cache: "no-store",
      });
      if (response.status === 401) return SESSION_EXPIRED;
      if (!response.ok) return null;
      return response.json();
    } catch {
      return null;
    }
  }
}
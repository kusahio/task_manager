import api from "@/utils/api";
import { Task, TaskCreate, TaskUpdate } from "@/types/task";
import { PaginatedResponse } from "@/types/api";

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
  }
}
import api from "@/utils/api"
import { Tag } from "./tag";

export interface Task{
  id: number;
  title: string;
  description?: string;
  completed: boolean;
  deadline?: string | null;
  tags: Tag[]
}

export interface TaskCreate{
  title: string;
  description?: string;
  deadline?: string | null;
  tags?: number[];
}

export interface TaskUpdate{
  title?: string;
  description?: string;
  completed?: boolean;
  deadline?: string | null;
  tags?: number[];
}

export const taskService = {
  getAll: async() =>{
    const { data } = await api.get<Task[]>('/tasks/');
    return data
  },

  gerById: async (id: number) => {
    const { data } = await api.get<Task>(`/tasks/${id}`);
    return data
  },

  create: async (task: TaskCreate) =>{
    const { data } = await api.post<Tag>('/tasks/', task);
    return data;
  },

  update: async (id: number, task: TaskUpdate) => {
    const { data } = await api.patch(`/tasks/${id}`, task);
    return data
  },

  delete: async (id: number) => {
    await api.delete<Tag>(`/tasks/${id}`)
  },

  toggleComplete: async (id: number, currentStatus: boolean) => {
    const { data } = await api.patch(`/tasks/${id}`, {
      completed: !currentStatus
    });
    return data
  }
}
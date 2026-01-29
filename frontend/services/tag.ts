import api from "@/utils/api";

export interface Tag{
  id: number;
  name: string;
  color: string | null;
}

export interface TagCreate{
  name: string;
  color?: string;
}

export interface TagUpdate{
  name?: string;
  color?: string;
}

export const tagService = {
  getAll: async () => {
    const { data } = await api.get<Tag[]>('/tags/');
    return data;
  },

  create: async (tag: TagCreate) => {
    const { data } = await api.post<Tag>('/tags/', tag);
    return data;
  },

  update: async (id: number, tag: TagUpdate) => {
    const { data } = await api.patch<Tag>(`/tags/${id}`, tag);
    return data;
  },

  delete: async (id: number) => {
    await api.delete<Tag>(`/tags/${id}`)
  },
}
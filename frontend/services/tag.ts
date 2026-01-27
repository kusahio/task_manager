import { getSession } from 'next-auth/react';

const API_URL = process.env.NEXT_PUBLIC_BACKEND_URL;

export interface Tag{
  id: number;
  name: string;
  color: string | null;
}

export interface TagCreate{
  name: string;
  color?: string;
}

async function getAuthHeaders() {
  const session = await getSession();

  return{
    'Content-Type' : 'application/json',
    'Authorization' : `Bearer ${session?.accessToken}`
  };
}

interface TagUpdate{
  name?: string;
  color?: string;
}

export const tagService = {
  getAll: async (): Promise<Tag[]> => {
    const headers = await getAuthHeaders();
    const response = await fetch(`${API_URL}/tags/`, {
      method: 'GET',
      headers
    });

    if (!response.ok){
      throw new Error('Error al cargar las etiquetas')
    }

    return response.json()
  },

  create: async (data: TagCreate) : Promise<Tag> => {
    const headers = await getAuthHeaders();
    const response = await fetch(`${API_URL}/tags/`, {
      method: 'POST',
      headers,
      body: JSON.stringify(data)
    });

    if(!response.ok){
      throw new Error('Error al crear la etiqueta')
    }

    return response.json()
  },

  delete: async (id: number) : Promise<void> => {
    const headers = await getAuthHeaders();
    const response = await fetch(`${API_URL}/tags/${id}`, {
      method: 'DELETE',
      headers,
    });

    if (!response.ok){
      throw new Error('No se pudo eliminar la etiqueta')
    }
  },
  update: async (id: number, data: TagUpdate): Promise<Tag> => {
    const headers = await getAuthHeaders();
    const response = await fetch(`${API_URL}/tags/${id}`, {
      method: 'PATCH',
      headers,
      body: JSON.stringify(data)
    });

    if(!response.ok){
      throw new Error('Error al actualizar la etiqueta')
    }

    return response.json()
  }
}
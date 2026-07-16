import axios from 'axios';
import { getSession, signOut } from 'next-auth/react';
import { baseURL } from '@/constants/index';

const api = axios.create({
  baseURL,
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use(async (config) => {
  const session = await getSession();

  if (session?.user?.accessToken) {
    config.headers.Authorization = `Bearer ${session.user.accessToken}`;
  }
  
  return config;
});

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const isClient = globalThis.window !== undefined;
    const isUnauthorized = error.response?.status === 401;

    if (isClient && isUnauthorized && !globalThis.location.pathname.includes('/login')){
      await signOut();
    }

    return Promise.reject(error);
  }
);

export default api;
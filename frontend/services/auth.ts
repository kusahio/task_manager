import api from '@/utils/api';

export const login = async (email: string, password: string) => {
  try {
    const response = await api.post('/users/login', { 
        username: email,
        password: password 
    }, {

        headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
    });
    
    return response.data; 
  } catch (error: any) {
    throw error.response?.data?.detail || 'Error al conectar con el servidor';
  }
};
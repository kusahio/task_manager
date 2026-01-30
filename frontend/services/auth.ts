import axios from 'axios';

const apiURL = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://127.0.0.1:8000/api/v1'

export const login = async (email: string, password: string) => {
  try {
    const response = await axios.post(`${apiURL}/users/login`, 
      {
        email: email,
        password: password
      }, 
      {
        headers: { 'Content-Type': 'application/json' }
      }
    );
    
    return response.data; 
  } catch (error: any) {
    throw error.response?.data?.detail || 'Error al conectar con el servidor';
  }
};
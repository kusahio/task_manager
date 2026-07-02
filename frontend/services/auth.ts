import axios from 'axios';

const apiURL = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://127.0.0.1:8000/api/v1'

export const login = async (email: string, password: string) => {
  const response = await axios.post(`${apiURL}/users/login`, { email, password });
  return response.data;
};
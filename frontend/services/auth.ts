import axios from "axios";
import { LoginResponse } from "@/types/auth";

export const login = async (email: string, password: string): Promise<LoginResponse> => {
  const params = new URLSearchParams();
  params.append('username', email);
  params.append('password', password);

  const baseURL = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://127.0.0.1:8000/api/v1';

  const { data } = await axios.post<LoginResponse>(`${baseURL}/users/token`, params, {
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
  });
  
  return data;
};
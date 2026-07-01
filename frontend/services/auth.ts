import api from "@/utils/api";
import { LoginRequest, LoginResponse } from "@/types/auth";

export const login = async (email: string, password: string): Promise<LoginResponse> => {
  const payload: LoginRequest = { email, password };
  const { data } = await api.post<LoginResponse>('/users/login', payload);
  return data;
};
import axios from "axios";
import { baseURL } from "@/constants/index";
import { LoginResponse } from "@/types/auth";

export const login = async (email: string, password: string): Promise<LoginResponse> => {
  const params = new URLSearchParams();
  params.append('username', email);
  params.append('password', password);

  const { data } = await axios.post<LoginResponse>(`${baseURL}/users/token`, params, {
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
  });

  return data;
};
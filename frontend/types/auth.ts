export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  message: string;
  access_token: string;
  token_type: string;
  user: {
    id: number;
    email: string;
    name: string;
  };
}
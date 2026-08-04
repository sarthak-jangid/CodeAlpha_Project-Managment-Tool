import api from './axios';
import type { ApiResponse, User } from '../types';

export const loginUser = async (payload: { email: string; password: string }) => {
  const { data } = await api.post<ApiResponse<User>>('/auth/login', payload);
  return data;
};

export const registerUser = async (payload: { username: string; name: string; email: string; password: string }) => {
  const { data } = await api.post<ApiResponse<User>>('/auth/register', payload);
  return data;
};

export const logoutUser = async () => {
  const { data } = await api.post<ApiResponse<null>>('/auth/logout');
  return data;
};

export const getCurrentUser = async () => {
  const { data } = await api.get<ApiResponse<User>>('/auth/me');
  return data;
};

import api from './axios';
import type { ApiResponse, Task } from '../types';

export const getTasksByProject = async (projectId: string) => {
  const { data } = await api.get<ApiResponse<Task[]>>(`/projects/${projectId}/tasks`);
  return data;
};

export const createTask = async (projectId: string, payload: Partial<Task>) => {
  const { data } = await api.post<ApiResponse<Task>>(`/projects/${projectId}/tasks`, payload);
  return data;
};

export const updateTask = async (taskId: string, payload: Partial<Task>) => {
  const { data } = await api.patch<ApiResponse<Task>>(`/tasks/${taskId}`, payload);
  return data;
};

export const updateTaskStatus = async (taskId: string, status: Task['status']) => {
  const { data } = await api.patch<ApiResponse<Task>>(`/tasks/${taskId}/status`, { status });
  return data;
};

export const deleteTask = async (taskId: string) => {
  const { data } = await api.delete<ApiResponse<null>>(`/tasks/${taskId}`);
  return data;
};

import api from './axios';
import type { ApiResponse, Task, TaskStatus } from '../types';

export interface CreateTaskPayload {
  title: string;
  description?: string;
  priority?: Task['priority'];
  dueDate?: string;
  assignedTo?: string;
}

export interface UpdateTaskPayload {
  title?: string;
  description?: string;
  priority?: Task['priority'];
  dueDate?: string;
}

export const getTasksByProject = async (projectId: string) => {
  const { data } = await api.get<ApiResponse<Task[]>>(`/projects/${projectId}/tasks`);
  return data;
};

export const getTaskById = async (taskId: string) => {
  const { data } = await api.get<ApiResponse<Task>>(`/tasks/${taskId}`);
  return data;
};

export const createTask = async (projectId: string, payload: CreateTaskPayload) => {
  const { data } = await api.post<ApiResponse<Task>>(`/projects/${projectId}/tasks`, payload);
  return data;
};

export const updateTask = async (taskId: string, payload: UpdateTaskPayload) => {
  const { data } = await api.patch<ApiResponse<Task>>(`/tasks/${taskId}`, payload);
  return data;
};

export const assignTask = async (taskId: string, assignedTo: string) => {
  const { data } = await api.patch<ApiResponse<Task>>(`/tasks/${taskId}/assign`, { assignedTo });
  return data;
};

export const updateTaskStatus = async (taskId: string, status: TaskStatus) => {
  const { data } = await api.patch<ApiResponse<Task>>(`/tasks/${taskId}/status`, { status });
  return data;
};

export const deleteTask = async (taskId: string) => {
  const { data } = await api.delete<ApiResponse<null>>(`/tasks/${taskId}`);
  return data;
};

import api from './axios';
import type { ApiResponse, Project, User } from '../types';

export const getProjects = async () => {
  const { data } = await api.get<ApiResponse<Project[]>>('/projects');
  return data;
};

export const createProject = async (payload: Partial<Project>) => {
  const { data } = await api.post<ApiResponse<Project>>('/projects', payload);
  return data;
};

export const updateProject = async (projectId: string, payload: Partial<Project>) => {
  const { data } = await api.patch<ApiResponse<Project>>(`/projects/${projectId}`, payload);
  return data;
};

export const deleteProject = async (projectId: string) => {
  const { data } = await api.delete<ApiResponse<null>>(`/projects/${projectId}`);
  return data;
};

export const joinProject = async (inviteCode: string) => {
  const { data } = await api.post<ApiResponse<Project>>('/projects/join', { inviteCode });
  return data;
};

export const getProjectMembers = async (projectId: string) => {
  const { data } = await api.get<ApiResponse<User[]>>(`/projects/${projectId}/members`);
  return data;
};

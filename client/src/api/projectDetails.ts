import api from './axios';
import type { ApiResponse, Project, User } from '../types';

export const getProjectById = async (projectId: string) => {
  const { data } = await api.get<ApiResponse<Project>>(`/projects/${projectId}`);
  return data;
};

export const getProjectMembers = async (projectId: string) => {
  const { data } = await api.get<ApiResponse<User[]>>(`/projects/${projectId}/members`);
  return data;
};

export const removeProjectMember = async (projectId: string, memberId: string) => {
  const { data } = await api.delete<ApiResponse<null>>(`/projects/${projectId}/members/${memberId}`);
  return data;
};

export const regenerateInviteCode = async (projectId: string) => {
  const { data } = await api.patch<ApiResponse<Project>>(`/projects/${projectId}/invite-code`);
  return data;
};

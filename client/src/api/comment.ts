import api from './axios';
import type { ApiResponse, Comment } from '../types';

export const getCommentsByProject = async (projectId: string) => {
  const { data } = await api.get<ApiResponse<Comment[]>>(`/projects/${projectId}/comments`);
  return data;
};

export const createComment = async (projectId: string, payload: { message: string }) => {
  const { data } = await api.post<ApiResponse<Comment>>(`/projects/${projectId}/comments`, payload);
  return data;
};

export const updateComment = async (commentId: string, payload: { message: string }) => {
  const { data } = await api.patch<ApiResponse<Comment>>(`/comments/${commentId}`, payload);
  return data;
};

export const deleteComment = async (commentId: string) => {
  const { data } = await api.delete<ApiResponse<null>>(`/comments/${commentId}`);
  return data;
};

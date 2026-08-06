export interface User {
  _id: string;
  username: string;
  name: string;
  email: string;
  avatar?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface Project {
  _id: string;
  name: string;
  description?: string;
  status: 'planning' | 'active' | 'completed' | 'on_hold';
  inviteCode?: string;
  owner: string;
  members?: string[];
  createdAt?: string;
  updatedAt?: string;
}

export type TaskStatus = 'Todo' | 'In_Progress' | 'Review' | 'Done';
export type TaskPriority = 'low' | 'medium' | 'high' | 'urgent';

export interface Task {
  _id: string;
  title: string;
  description?: string;
  priority?: TaskPriority;
  status?: TaskStatus;
  dueDate?: string;
  assignedTo?: User | string;
  project?: string;
  projectId?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface Comment {
  _id: string;
  message: string;
  taskId?: string;
  user?: User;
  createdAt?: string;
  updatedAt?: string;
}

export interface ApiResponse<T> {
  success: boolean;
  message?: string;
  user?: User;
  project?: Project;
  projects?: Project[];
  task?: Task;
  tasks?: Task[];
  comment?: Comment;
  comments?: Comment[];
  members?: User[];
  inviteCode?: string;
  data?: T;
}

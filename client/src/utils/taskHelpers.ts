import type { Task, TaskPriority, TaskStatus, User } from '../types';

export const TASK_STATUSES: TaskStatus[] = ['Todo', 'In_Progress', 'Review', 'Done'];

export const STATUS_LABELS: Record<TaskStatus, string> = {
  Todo: 'Todo',
  In_Progress: 'In Progress',
  Review: 'Review',
  Done: 'Done',
};

export const STATUS_BADGE_VARIANT: Record<TaskStatus, 'todo' | 'in_progress' | 'review' | 'done'> = {
  Todo: 'todo',
  In_Progress: 'in_progress',
  Review: 'review',
  Done: 'done',
};

export const PRIORITY_LABELS: Record<TaskPriority, string> = {
  low: 'Low',
  medium: 'Medium',
  high: 'High',
  urgent: 'Urgent',
};

export const PRIORITY_ORDER: Record<TaskPriority, number> = {
  urgent: 4,
  high: 3,
  medium: 2,
  low: 1,
};

export const getAssigneeId = (task: Task): string | undefined => {
  if (!task.assignedTo) return undefined;
  if (typeof task.assignedTo === 'string') return task.assignedTo;
  return task.assignedTo._id;
};

export const getAssigneeUser = (task: Task): User | undefined => {
  if (!task.assignedTo || typeof task.assignedTo === 'string') return undefined;
  return task.assignedTo;
};

export const isAssignedToUser = (task: Task, userId?: string): boolean => {
  if (!userId) return false;
  return String(getAssigneeId(task)) === String(userId);
};

export const canEditTask = (isOwner: boolean): boolean => isOwner;

export const canDeleteTask = (isOwner: boolean): boolean => isOwner;

export const canAssignTask = (isOwner: boolean): boolean => isOwner;

export const canChangeTaskStatus = (task: Task, userId?: string, isOwner = false): boolean => {
  if (isOwner) return true;
  return isAssignedToUser(task, userId);
};

export const formatDueDate = (dueDate?: string): string => {
  if (!dueDate) return 'No due date';
  return new Date(dueDate).toLocaleDateString(undefined, {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
};

export const toDateInputValue = (dueDate?: string): string => {
  if (!dueDate) return '';
  const date = new Date(dueDate);
  if (Number.isNaN(date.getTime())) return '';
  return date.toISOString().slice(0, 10);
};

export const toIsoDueDate = (dateValue: string): string | undefined => {
  if (!dateValue) return undefined;
  const date = new Date(`${dateValue}T12:00:00.000Z`);
  return date.toISOString();
};

export const getInitials = (name: string): string =>
  name
    .split(' ')
    .map((part) => part[0])
    .slice(0, 2)
    .join('')
    .toUpperCase();

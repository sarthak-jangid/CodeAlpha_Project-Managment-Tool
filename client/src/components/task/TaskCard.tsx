import {
  Calendar,
  ClipboardList,
  MoreHorizontal,
  Pencil,
  Trash2,
  UserPlus,
} from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { Badge } from '../common/Badge';
import { PriorityBadge } from './PriorityBadge';
import { StatusDropdown } from './StatusDropdown';
import {
  STATUS_BADGE_VARIANT,
  STATUS_LABELS,
  canAssignTask,
  canChangeTaskStatus,
  canDeleteTask,
  canEditTask,
  formatDueDate,
  getAssigneeUser,
  getInitials,
} from '../../utils/taskHelpers';
import type { Task, TaskStatus } from '../../types';

export const TaskCard = ({
  task,
  currentUserId,
  isOwner,
  statusUpdating,
  onEdit,
  onDelete,
  onAssign,
  onStatusChange,
}: {
  task: Task;
  currentUserId?: string;
  isOwner: boolean;
  statusUpdating?: boolean;
  onEdit: (task: Task) => void;
  onDelete: (task: Task) => void;
  onAssign: (task: Task) => void;
  onStatusChange: (task: Task, status: TaskStatus) => void;
}) => {
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  const assignee = getAssigneeUser(task);
  const status = task.status ?? 'Todo';

  const showEdit = canEditTask(isOwner);
  const showDelete = canDeleteTask(isOwner);
  const showAssign = canAssignTask(isOwner);
  const showStatus = canChangeTaskStatus(task, currentUserId);

  const hasActions = showEdit || showDelete || showAssign || showStatus;

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <article className="group rounded-2xl border border-white/10 bg-slate-900/70 p-4 shadow-[0_10px_30px_rgba(15,23,42,0.25)] backdrop-blur-md transition-all duration-200 hover:-translate-y-0.5 hover:border-sky-500/20 hover:shadow-[0_16px_40px_rgba(59,130,246,0.12)]">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0 flex-1">
          <h4 className="truncate text-sm font-semibold text-slate-100">{task.title}</h4>
          {task.description ? (
            <p className="mt-2 line-clamp-2 text-sm leading-relaxed text-slate-400">
              {task.description}
            </p>
          ) : (
            <p className="mt-2 text-sm text-slate-500">No description</p>
          )}
        </div>

        {hasActions ? (
          <div ref={menuRef} className="relative shrink-0">
            <button
              type="button"
              onClick={() => setMenuOpen((prev) => !prev)}
              className="rounded-xl border border-white/10 bg-white/5 p-2 text-slate-400 opacity-0 transition-all duration-200 hover:text-slate-200 group-hover:opacity-100"
              aria-label="Task actions"
            >
              <MoreHorizontal className="h-4 w-4" />
            </button>

            {menuOpen ? (
              <div className="absolute right-0 z-20 mt-2 w-44 overflow-hidden rounded-2xl border border-white/10 bg-slate-900/95 p-1 shadow-2xl backdrop-blur-md animate-[fadeIn_220ms_ease-out]">
                {showEdit ? (
                  <button
                    type="button"
                    onClick={() => {
                      setMenuOpen(false);
                      onEdit(task);
                    }}
                    className="flex w-full items-center gap-2 rounded-xl px-3 py-2 text-sm text-slate-200 transition-colors hover:bg-white/5"
                  >
                    <Pencil className="h-4 w-4" />
                    Edit
                  </button>
                ) : null}
                {showAssign ? (
                  <button
                    type="button"
                    onClick={() => {
                      setMenuOpen(false);
                      onAssign(task);
                    }}
                    className="flex w-full items-center gap-2 rounded-xl px-3 py-2 text-sm text-slate-200 transition-colors hover:bg-white/5"
                  >
                    <UserPlus className="h-4 w-4" />
                    Assign Member
                  </button>
                ) : null}
                {showDelete ? (
                  <button
                    type="button"
                    onClick={() => {
                      setMenuOpen(false);
                      onDelete(task);
                    }}
                    className="flex w-full items-center gap-2 rounded-xl px-3 py-2 text-sm text-rose-300 transition-colors hover:bg-rose-500/10"
                  >
                    <Trash2 className="h-4 w-4" />
                    Delete
                  </button>
                ) : null}
              </div>
            ) : null}
          </div>
        ) : null}
      </div>

      <div className="mt-4 flex flex-wrap items-center gap-2">
        <PriorityBadge priority={task.priority} />
        <Badge variant={STATUS_BADGE_VARIANT[status]}>{STATUS_LABELS[status]}</Badge>
      </div>

      <div className="mt-4 flex items-center gap-2 text-xs text-slate-400">
        <Calendar className="h-3.5 w-3.5 shrink-0 text-slate-500" />
        <span>{formatDueDate(task.dueDate)}</span>
      </div>

      <div className="mt-4 flex items-center justify-between gap-3 border-t border-white/5 pt-4">
        {assignee ? (
          <div className="flex min-w-0 items-center gap-2">
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-sky-500/15 text-xs font-semibold text-sky-300">
              {assignee.avatar ? (
                <img
                  src={assignee.avatar}
                  alt={assignee.name}
                  className="h-8 w-8 rounded-xl object-cover"
                />
              ) : (
                getInitials(assignee.name)
              )}
            </div>
            <span className="truncate text-sm text-slate-300">{assignee.name}</span>
          </div>
        ) : (
          <span className="text-sm text-slate-500">Unassigned</span>
        )}

        {showStatus ? (
          <StatusDropdown
            status={status}
            loading={statusUpdating}
            onChange={(nextStatus) => onStatusChange(task, nextStatus)}
          />
        ) : null}
      </div>
    </article>
  );
};

export const TaskCardSkeleton = () => (
  <div className="animate-pulse rounded-2xl border border-white/10 bg-slate-900/70 p-4">
    <div className="h-4 w-3/4 rounded-lg bg-white/10" />
    <div className="mt-3 h-3 w-full rounded-lg bg-white/5" />
    <div className="mt-2 h-3 w-2/3 rounded-lg bg-white/5" />
    <div className="mt-4 flex gap-2">
      <div className="h-6 w-16 rounded-full bg-white/10" />
      <div className="h-6 w-16 rounded-full bg-white/10" />
    </div>
    <div className="mt-4 h-3 w-24 rounded-lg bg-white/5" />
    <div className="mt-4 flex items-center justify-between border-t border-white/5 pt-4">
      <div className="h-8 w-28 rounded-xl bg-white/5" />
      <div className="h-8 w-20 rounded-xl bg-white/5" />
    </div>
  </div>
);

export const TaskColumnEmptyState = () => (
  <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-white/10 bg-slate-900/40 px-4 py-10 text-center">
    <div className="mb-3 rounded-2xl border border-white/10 bg-white/5 p-3 text-slate-400">
      <ClipboardList className="h-5 w-5" />
    </div>
    <p className="text-sm font-medium text-slate-300">No Tasks</p>
    <p className="mt-1 text-xs text-slate-500">Tasks will appear here</p>
  </div>
);

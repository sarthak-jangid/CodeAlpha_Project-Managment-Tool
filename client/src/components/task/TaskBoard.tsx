import {
  ArrowDownAZ,
  Filter,
  Plus,
  RefreshCw,
  Search,
  SlidersHorizontal,
  X,
} from 'lucide-react';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
  assignTask,
  createTask,
  deleteTask,
  getTasksByProject,
  updateTask,
  updateTaskStatus,
} from '../../api/task';
import { Button } from '../common/Button';
import { Card } from '../common/Card';
import { Input } from '../common/Input';
import { AssignModal } from './AssignModal';
import { DeleteTaskDialog } from './DeleteTaskDialog';
import { TaskBoardSkeleton, TaskColumn } from './TaskColumn';
import { TaskModal, type TaskFormValues } from './TaskModal';
import {
  PRIORITY_ORDER,
  STATUS_LABELS,
  TASK_STATUSES,
  getAssigneeId,
  toIsoDueDate,
} from '../../utils/taskHelpers';
import type { Task, TaskPriority, TaskStatus, User } from '../../types';

type SortOption = 'newest' | 'oldest' | 'dueDate' | 'priority';

type FilterState = {
  priority: TaskPriority | 'all';
  status: TaskStatus | 'all';
  assignee: string | 'all';
};

const defaultFilters: FilterState = {
  priority: 'all',
  status: 'all',
  assignee: 'all',
};

export const TaskBoard = ({
  projectId,
  members,
  isOwner,
  currentUserId,
  onTaskCountChange,
  showToast,
}: {
  projectId: string;
  members: User[];
  isOwner: boolean;
  currentUserId?: string;
  onTaskCountChange?: (count: number) => void;
  showToast: (type: 'success' | 'error', message: string) => void;
}) => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [updatingTaskId, setUpdatingTaskId] = useState<string | null>(null);

  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<SortOption>('newest');
  const [filters, setFilters] = useState<FilterState>(defaultFilters);
  const [filterOpen, setFilterOpen] = useState(false);
  const [sortOpen, setSortOpen] = useState(false);

  const [createOpen, setCreateOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [assignOpen, setAssignOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);

  const filterRef = useRef<HTMLDivElement>(null);
  const sortRef = useRef<HTMLDivElement>(null);

  const fetchTasks = useCallback(async () => {
    if (!projectId) return;

    try {
      setLoading(true);
      setError('');
      const response = await getTasksByProject(projectId);
      const nextTasks = response.tasks ?? [];
      setTasks(nextTasks);
      onTaskCountChange?.(nextTasks.length);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Unable to load tasks.';
      setError(message);
    } finally {
      setLoading(false);
    }
  }, [projectId, onTaskCountChange]);

  useEffect(() => {
    void fetchTasks();
  }, [fetchTasks]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (filterRef.current && !filterRef.current.contains(event.target as Node)) {
        setFilterOpen(false);
      }
      if (sortRef.current && !sortRef.current.contains(event.target as Node)) {
        setSortOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const filteredTasks = useMemo(() => {
    let result = [...tasks];

    const query = searchQuery.trim().toLowerCase();
    if (query) {
      result = result.filter((task) => task.title.toLowerCase().includes(query));
    }

    if (filters.priority !== 'all') {
      result = result.filter((task) => (task.priority ?? 'medium') === filters.priority);
    }

    if (filters.status !== 'all') {
      result = result.filter((task) => (task.status ?? 'Todo') === filters.status);
    }

    if (filters.assignee !== 'all') {
      result = result.filter((task) => String(getAssigneeId(task) ?? '') === filters.assignee);
    }

    result.sort((a, b) => {
      if (sortBy === 'newest') {
        return new Date(b.createdAt ?? 0).getTime() - new Date(a.createdAt ?? 0).getTime();
      }

      if (sortBy === 'oldest') {
        return new Date(a.createdAt ?? 0).getTime() - new Date(b.createdAt ?? 0).getTime();
      }

      if (sortBy === 'dueDate') {
        const aTime = a.dueDate ? new Date(a.dueDate).getTime() : Number.MAX_SAFE_INTEGER;
        const bTime = b.dueDate ? new Date(b.dueDate).getTime() : Number.MAX_SAFE_INTEGER;
        return aTime - bTime;
      }

      const aPriority = PRIORITY_ORDER[a.priority ?? 'medium'];
      const bPriority = PRIORITY_ORDER[b.priority ?? 'medium'];
      return bPriority - aPriority;
    });

    return result;
  }, [tasks, searchQuery, filters, sortBy]);

  const tasksByStatus = useMemo(() => {
    const grouped: Record<TaskStatus, Task[]> = {
      Todo: [],
      In_Progress: [],
      Review: [],
      Done: [],
    };

    filteredTasks.forEach((task) => {
      const status = task.status ?? 'Todo';
      grouped[status].push(task);
    });

    return grouped;
  }, [filteredTasks]);

  const activeFilterCount = useMemo(() => {
    let count = 0;
    if (filters.priority !== 'all') count += 1;
    if (filters.status !== 'all') count += 1;
    if (filters.assignee !== 'all') count += 1;
    return count;
  }, [filters]);

  const handleCreateTask = async (values: TaskFormValues) => {
    try {
      setSubmitting(true);

      const response = await createTask(projectId, {
        title: values.title,
        description: values.description || undefined,
        priority: values.priority,
        dueDate: toIsoDueDate(values.dueDate),
        assignedTo: values.assignedTo || undefined,
      });

      const createdTask = response.task;

      if (
        createdTask &&
        values.status !== 'Todo' &&
        values.assignedTo &&
        String(values.assignedTo) === String(currentUserId)
      ) {
        await updateTaskStatus(createdTask._id, values.status);
      }

      setCreateOpen(false);
      await fetchTasks();
      showToast('success', 'Task created successfully.');
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Unable to create task.';
      showToast('error', message);
    } finally {
      setSubmitting(false);
    }
  };

  const handleEditTask = async (values: TaskFormValues) => {
    if (!selectedTask) return;

    try {
      setSubmitting(true);
      await updateTask(selectedTask._id, {
        title: values.title,
        description: values.description || undefined,
        priority: values.priority,
        dueDate: toIsoDueDate(values.dueDate),
      });
      setEditOpen(false);
      setSelectedTask(null);
      await fetchTasks();
      showToast('success', 'Task updated successfully.');
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Unable to update task.';
      showToast('error', message);
    } finally {
      setSubmitting(false);
    }
  };

  const handleAssignTask = async (assignedTo: string) => {
    if (!selectedTask) return;

    try {
      setSubmitting(true);
      await assignTask(selectedTask._id, assignedTo);
      setAssignOpen(false);
      setSelectedTask(null);
      await fetchTasks();
      showToast('success', 'Task assigned successfully.');
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Unable to assign task.';
      showToast('error', message);
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteTask = async () => {
    if (!selectedTask) return;

    try {
      setSubmitting(true);
      await deleteTask(selectedTask._id);
      setDeleteOpen(false);
      setSelectedTask(null);
      await fetchTasks();
      showToast('success', 'Task deleted successfully.');
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Unable to delete task.';
      showToast('error', message);
    } finally {
      setSubmitting(false);
    }
  };

  const handleStatusChange = async (task: Task, status: TaskStatus) => {
    try {
      setUpdatingTaskId(task._id);
      await updateTaskStatus(task._id, status);
      await fetchTasks();
      showToast('success', 'Task status updated.');
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Unable to update task status.';
      showToast('error', message);
    } finally {
      setUpdatingTaskId(null);
    }
  };

  const openEditModal = (task: Task) => {
    setSelectedTask(task);
    setEditOpen(true);
  };

  const openAssignModal = (task: Task) => {
    setSelectedTask(task);
    setAssignOpen(true);
  };

  const openDeleteDialog = (task: Task) => {
    setSelectedTask(task);
    setDeleteOpen(true);
  };

  const clearFilters = () => {
    setFilters(defaultFilters);
  };

  const sortLabels: Record<SortOption, string> = {
    newest: 'Newest',
    oldest: 'Oldest',
    dueDate: 'Due Date',
    priority: 'Priority',
  };

  return (
    <Card className="p-6">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
        <div>
          <h2 className="text-xl font-semibold text-slate-100">Tasks</h2>
          <p className="mt-1 text-sm text-slate-400">Manage project tasks efficiently.</p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          {isOwner ? (
            <Button variant="primary" onClick={() => setCreateOpen(true)}>
              <Plus className="mr-2 h-4 w-4" />
              New Task
            </Button>
          ) : null}

          <div ref={filterRef} className="relative">
            <Button variant="outline" onClick={() => setFilterOpen((prev) => !prev)}>
              <Filter className="mr-2 h-4 w-4" />
              Filter
              {activeFilterCount > 0 ? (
                <span className="ml-2 rounded-full bg-sky-500/20 px-2 py-0.5 text-xs text-sky-300">
                  {activeFilterCount}
                </span>
              ) : null}
            </Button>

            {filterOpen ? (
              <div className="absolute right-0 z-20 mt-2 w-72 rounded-2xl border border-white/10 bg-slate-900/95 p-4 shadow-2xl backdrop-blur-md animate-[fadeIn_220ms_ease-out]">
                <div className="mb-4 flex items-center justify-between">
                  <p className="text-sm font-medium text-slate-200">Filters</p>
                  {activeFilterCount > 0 ? (
                    <button
                      type="button"
                      onClick={clearFilters}
                      className="text-xs text-sky-400 hover:text-sky-300"
                    >
                      Clear all
                    </button>
                  ) : null}
                </div>

                <div className="space-y-4">
                  <div className="space-y-2">
                    <label className="text-xs text-slate-400">Priority</label>
                    <select
                      value={filters.priority}
                      onChange={(event) =>
                        setFilters((prev) => ({
                          ...prev,
                          priority: event.target.value as FilterState['priority'],
                        }))
                      }
                      className="h-10 w-full rounded-xl border border-white/10 bg-slate-900/70 px-3 text-sm text-slate-100 focus:border-sky-500 focus:outline-none"
                    >
                      <option value="all">All priorities</option>
                      <option value="low">Low</option>
                      <option value="medium">Medium</option>
                      <option value="high">High</option>
                      <option value="urgent">Urgent</option>
                    </select>
                  </div>

                  <div className="space-y-2">
                    <label className="text-xs text-slate-400">Status</label>
                    <select
                      value={filters.status}
                      onChange={(event) =>
                        setFilters((prev) => ({
                          ...prev,
                          status: event.target.value as FilterState['status'],
                        }))
                      }
                      className="h-10 w-full rounded-xl border border-white/10 bg-slate-900/70 px-3 text-sm text-slate-100 focus:border-sky-500 focus:outline-none"
                    >
                      <option value="all">All statuses</option>
                      {TASK_STATUSES.map((status) => (
                        <option key={status} value={status}>
                          {STATUS_LABELS[status]}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="space-y-2">
                    <label className="text-xs text-slate-400">Assigned Member</label>
                    <select
                      value={filters.assignee}
                      onChange={(event) =>
                        setFilters((prev) => ({
                          ...prev,
                          assignee: event.target.value,
                        }))
                      }
                      className="h-10 w-full rounded-xl border border-white/10 bg-slate-900/70 px-3 text-sm text-slate-100 focus:border-sky-500 focus:outline-none"
                    >
                      <option value="all">All members</option>
                      <option value="">Unassigned</option>
                      {members.map((member) => (
                        <option key={member._id} value={member._id}>
                          {member.name}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>
            ) : null}
          </div>

          <div ref={sortRef} className="relative">
            <Button variant="outline" onClick={() => setSortOpen((prev) => !prev)}>
              <SlidersHorizontal className="mr-2 h-4 w-4" />
              Sort
            </Button>

            {sortOpen ? (
              <div className="absolute right-0 z-20 mt-2 w-48 rounded-2xl border border-white/10 bg-slate-900/95 p-1 shadow-2xl backdrop-blur-md animate-[fadeIn_220ms_ease-out]">
                {(Object.keys(sortLabels) as SortOption[]).map((option) => (
                  <button
                    key={option}
                    type="button"
                    onClick={() => {
                      setSortBy(option);
                      setSortOpen(false);
                    }}
                    className={`flex w-full items-center gap-2 rounded-xl px-3 py-2 text-sm transition-colors hover:bg-white/5 ${
                      sortBy === option ? 'bg-sky-500/10 text-sky-200' : 'text-slate-200'
                    }`}
                  >
                    <ArrowDownAZ className="h-4 w-4" />
                    {sortLabels[option]}
                  </button>
                ))}
              </div>
            ) : null}
          </div>
        </div>
      </div>

      <div className="relative mt-6">
        <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
        <Input
          value={searchQuery}
          onChange={(event) => setSearchQuery(event.target.value)}
          placeholder="Search tasks by title..."
          className="pl-11"
        />
        {searchQuery ? (
          <button
            type="button"
            onClick={() => setSearchQuery('')}
            className="absolute right-4 top-1/2 -translate-y-1/2 rounded-lg p-1 text-slate-400 hover:text-slate-200"
            aria-label="Clear search"
          >
            <X className="h-4 w-4" />
          </button>
        ) : null}
      </div>

      {activeFilterCount > 0 ? (
        <div className="mt-4 flex flex-wrap gap-2">
          {filters.priority !== 'all' ? (
            <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-slate-300">
              Priority: {filters.priority}
            </span>
          ) : null}
          {filters.status !== 'all' ? (
            <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-slate-300">
              Status: {STATUS_LABELS[filters.status]}
            </span>
          ) : null}
          {filters.assignee !== 'all' ? (
            <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-slate-300">
              Assignee:{' '}
              {filters.assignee === ''
                ? 'Unassigned'
                : members.find((member) => member._id === filters.assignee)?.name ?? 'Member'}
            </span>
          ) : null}
        </div>
      ) : null}

      <div className="mt-6">
        {loading ? (
          <TaskBoardSkeleton />
        ) : error ? (
          <div className="flex flex-col items-center justify-center gap-4 rounded-2xl border border-white/10 bg-slate-900/60 px-8 py-12 text-center">
            <div className="rounded-2xl border border-white/10 bg-white/5 p-4 text-slate-300">
              <RefreshCw className="h-6 w-6" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-slate-100">Unable to load tasks</h3>
              <p className="mt-2 text-sm text-slate-400">{error}</p>
            </div>
            <Button variant="primary" onClick={() => void fetchTasks()}>
              Retry
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
            {TASK_STATUSES.map((status) => (
              <TaskColumn
                key={status}
                status={status}
                tasks={tasksByStatus[status]}
                currentUserId={currentUserId}
                isOwner={isOwner}
                updatingTaskId={updatingTaskId}
                onEdit={openEditModal}
                onDelete={openDeleteDialog}
                onAssign={openAssignModal}
                onStatusChange={handleStatusChange}
              />
            ))}
          </div>
        )}
      </div>

      <TaskModal
        open={createOpen}
        mode="create"
        members={members}
        loading={submitting}
        isOwner={isOwner}
        onClose={() => setCreateOpen(false)}
        onSubmit={handleCreateTask}
      />

      <TaskModal
        open={editOpen}
        mode="edit"
        task={selectedTask}
        members={members}
        loading={submitting}
        isOwner={isOwner}
        onClose={() => {
          setEditOpen(false);
          setSelectedTask(null);
        }}
        onSubmit={handleEditTask}
      />

      <AssignModal
        open={assignOpen}
        task={selectedTask}
        members={members}
        loading={submitting}
        onClose={() => {
          setAssignOpen(false);
          setSelectedTask(null);
        }}
        onAssign={handleAssignTask}
      />

      <DeleteTaskDialog
        open={deleteOpen}
        taskTitle={selectedTask?.title ?? ''}
        loading={submitting}
        onClose={() => {
          setDeleteOpen(false);
          setSelectedTask(null);
        }}
        onConfirm={handleDeleteTask}
      />
    </Card>
  );
};

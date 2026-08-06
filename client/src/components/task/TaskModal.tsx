import { useEffect, useState } from 'react';
import { Button } from '../common/Button';
import { Input } from '../common/Input';
import { Modal } from '../common/Modal';
import { Textarea } from '../common/Textarea';
import { STATUS_LABELS, TASK_STATUSES, toDateInputValue } from '../../utils/taskHelpers';
import type { Task, TaskPriority, TaskStatus, User } from '../../types';

export type TaskFormValues = {
  title: string;
  description: string;
  priority: TaskPriority;
  dueDate: string;
  assignedTo: string;
  status: TaskStatus;
};

export const TaskModal = ({
  open,
  mode,
  task,
  members,
  loading,
  isOwner,
  onClose,
  onSubmit,
}: {
  open: boolean;
  mode: 'create' | 'edit';
  task?: Task | null;
  members: User[];
  loading: boolean;
  isOwner: boolean;
  onClose: () => void;
  onSubmit: (values: TaskFormValues) => Promise<void>;
}) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState<TaskPriority>('medium');
  const [dueDate, setDueDate] = useState('');
  const [assignedTo, setAssignedTo] = useState('');
  const [status, setStatus] = useState<TaskStatus>('Todo');
  const [error, setError] = useState('');

  useEffect(() => {
    if (open) {
      setTitle(task?.title ?? '');
      setDescription(task?.description ?? '');
      setPriority(task?.priority ?? 'medium');
      setDueDate(toDateInputValue(task?.dueDate));
      setAssignedTo(
        task?.assignedTo
          ? typeof task.assignedTo === 'string'
            ? task.assignedTo
            : task.assignedTo._id
          : '',
      );
      setStatus(task?.status ?? 'Todo');
      setError('');
    }
  }, [open, task]);

  const selectClassName =
    'h-11 w-full rounded-2xl border border-white/10 bg-slate-900/70 px-4 text-sm text-slate-100 focus:border-sky-500 focus:outline-none focus:ring-2 focus:ring-sky-500/20';

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!title.trim()) {
      setError('Task title is required.');
      return;
    }

    if (title.trim().length > 100) {
      setError('Task title must be 100 characters or less.');
      return;
    }

    setError('');
    await onSubmit({
      title: title.trim(),
      description: description.trim(),
      priority,
      dueDate,
      assignedTo,
      status,
    });
  };

  const showAssignField = mode === 'create' && isOwner;
  const showStatusField = mode === 'create' && isOwner;

  return (
    <Modal open={open} onClose={onClose} className="max-w-xl">
      <div className="space-y-4">
        <div>
          <h3 className="text-xl font-semibold text-slate-100">
            {mode === 'create' ? 'Create Task' : 'Edit Task'}
          </h3>
          <p className="mt-1 text-sm text-slate-400">
            {mode === 'create'
              ? 'Add a new task to your project board.'
              : 'Update the task details below.'}
          </p>
        </div>

        {error ? (
          <div className="rounded-xl border border-rose-500/30 bg-rose-500/10 px-3 py-2 text-sm text-rose-300">
            {error}
          </div>
        ) : null}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm text-slate-300" htmlFor="task-title">
              Title
            </label>
            <Input
              id="task-title"
              value={title}
              onChange={(event) => setTitle(event.target.value)}
              placeholder="Design landing page"
              disabled={loading}
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm text-slate-300" htmlFor="task-description">
              Description
            </label>
            <Textarea
              id="task-description"
              value={description}
              onChange={(event) => setDescription(event.target.value)}
              placeholder="Describe what needs to be done"
              disabled={loading}
            />
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <label className="text-sm text-slate-300" htmlFor="task-priority">
                Priority
              </label>
              <select
                id="task-priority"
                value={priority}
                onChange={(event) => setPriority(event.target.value as TaskPriority)}
                className={selectClassName}
                disabled={loading}
              >
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
                <option value="urgent">Urgent</option>
              </select>
            </div>

            <div className="space-y-2">
              <label className="text-sm text-slate-300" htmlFor="task-due-date">
                Due Date
              </label>
              <Input
                id="task-due-date"
                type="date"
                value={dueDate}
                onChange={(event) => setDueDate(event.target.value)}
                disabled={loading}
              />
            </div>
          </div>

          {showAssignField ? (
            <div className="space-y-2">
              <label className="text-sm text-slate-300" htmlFor="task-assignee">
                Assign Member (optional)
              </label>
              <select
                id="task-assignee"
                value={assignedTo}
                onChange={(event) => setAssignedTo(event.target.value)}
                className={selectClassName}
                disabled={loading}
              >
                <option value="">Unassigned</option>
                {members.map((member) => (
                  <option key={member._id} value={member._id}>
                    {member.name}
                  </option>
                ))}
              </select>
            </div>
          ) : null}

          {showStatusField ? (
            <div className="space-y-2">
              <label className="text-sm text-slate-300" htmlFor="task-status">
                Status
              </label>
              <select
                id="task-status"
                value={status}
                onChange={(event) => setStatus(event.target.value as TaskStatus)}
                className={selectClassName}
                disabled={loading}
              >
                {TASK_STATUSES.map((item) => (
                  <option key={item} value={item}>
                    {STATUS_LABELS[item]}
                  </option>
                ))}
              </select>
            </div>
          ) : null}

          <div className="flex justify-end gap-3 pt-2">
            <Button type="button" variant="ghost" onClick={onClose} disabled={loading}>
              Cancel
            </Button>
            <Button type="submit" variant="primary" disabled={loading}>
              {loading ? 'Saving...' : mode === 'create' ? 'Create' : 'Update'}
            </Button>
          </div>
        </form>
      </div>
    </Modal>
  );
};

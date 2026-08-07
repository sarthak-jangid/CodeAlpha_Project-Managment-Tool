import { useEffect, useState } from 'react';
import { Button } from '../common/Button';
import { Input } from '../common/Input';
import { Modal } from '../common/Modal';
import { Textarea } from '../common/Textarea';
import type { Project } from '../../types';

export const ProjectFormModal = ({
  open,
  mode,
  project,
  loading,
  onClose,
  onSubmit,
}: {
  open: boolean;
  mode: 'create' | 'edit';
  project?: Project | null;
  loading: boolean;
  onClose: () => void;
  onSubmit: (payload: { name: string; description: string; status: Project['status'] }) => Promise<void>;
}) => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [status, setStatus] = useState<Project['status']>('planning');
  const [error, setError] = useState('');

  useEffect(() => {
    if (open) {
      setName(project?.name ?? '');
      setDescription(project?.description ?? '');
      setStatus(project?.status ?? 'planning');
      setError('');
    }
  }, [open, project]);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!name.trim()) {
      setError('Project name is required.');
      return;
    }

    setError('');
    await onSubmit({ name: name.trim(), description: description.trim(), status });
  };

  return (
    <Modal open={open} onClose={onClose} className="max-w-xl">
      <div className="space-y-4">
        <div>
          <h3 className="text-xl font-semibold text-slate-100">{mode === 'create' ? 'Create Project' : 'Edit Project'}</h3>
          <p className="mt-1 text-sm text-slate-400">{mode === 'create' ? 'Start a new project workspace.' : 'Adjust the current project details.'}</p>
        </div>

        {error ? <div className="rounded-xl border border-rose-500/30 bg-rose-500/10 px-3 py-2 text-sm text-rose-300">{error}</div> : null}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm text-slate-300" htmlFor="project-name">Project Name</label>
            <Input id="project-name" value={name} onChange={(event) => setName(event.target.value)} placeholder="Marketing launch" disabled={loading} maxLength={80} />
          </div>

          <div className="space-y-2">
            <label className="text-sm text-slate-300" htmlFor="project-description">Description</label>
            <Textarea id="project-description" value={description} onChange={(event) => setDescription(event.target.value)} placeholder="Describe the project goals" disabled={loading} maxLength={280} />
          </div>

          <div className="space-y-2">
            <label className="text-sm text-slate-300" htmlFor="project-status">Status</label>
            <select id="project-status" value={status} onChange={(event) => setStatus(event.target.value as Project['status'])} className="h-11 w-full rounded-2xl border border-white/10 bg-slate-900/70 px-4 text-sm text-slate-100 focus:border-sky-500 focus:outline-none focus:ring-2 focus:ring-sky-500/20" disabled={loading}>
              <option value="planning">Planning</option>
              <option value="active">Active</option>
              <option value="completed">Completed</option>
              <option value="on_hold">On Hold</option>
            </select>
          </div>

          <div className="flex justify-end gap-3 pt-2">
            <Button type="button" variant="ghost" onClick={onClose} disabled={loading}>Cancel</Button>
            <Button type="submit" variant="primary" disabled={loading}>{loading ? 'Saving...' : mode === 'create' ? 'Create Project' : 'Update Project'}</Button>
          </div>
        </form>
      </div>
    </Modal>
  );
};

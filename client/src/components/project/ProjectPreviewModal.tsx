import { Button } from '../common/Button';
import { Modal } from '../common/Modal';
import type { Project } from '../../types';

export const ProjectPreviewModal = ({ open, project, onClose }: { open: boolean; project: Project | null; onClose: () => void }) => {
  if (!project) return null;

  return (
    <Modal open={open} onClose={onClose} className="max-w-lg">
      <div className="space-y-4">
        <div>
          <p className="text-sm font-medium uppercase tracking-[0.2em] text-sky-400">Project Preview</p>
          <h3 className="mt-2 text-xl font-semibold text-slate-100">{project.name}</h3>
          <p className="mt-2 text-sm text-slate-400">{project.description || 'No description available.'}</p>
        </div>

        <div className="grid gap-3 rounded-2xl border border-white/10 bg-slate-900/60 p-4 text-sm text-slate-300 sm:grid-cols-2">
          <div>
            <p className="text-slate-400">Status</p>
            <p className="mt-1 font-medium text-slate-100">{project.status}</p>
          </div>
          <div>
            <p className="text-slate-400">Invite Code</p>
            <p className="mt-1 font-medium text-slate-100">{project.inviteCode || '—'}</p>
          </div>
          <div>
            <p className="text-slate-400">Members</p>
            <p className="mt-1 font-medium text-slate-100">{project.members?.length ?? 0}</p>
          </div>
          <div>
            <p className="text-slate-400">Created</p>
            <p className="mt-1 font-medium text-slate-100">{project.createdAt ? new Date(project.createdAt).toLocaleDateString() : '—'}</p>
          </div>
        </div>

        <div className="flex justify-end">
          <Button variant="primary" onClick={onClose}>Close</Button>
        </div>
      </div>
    </Modal>
  );
};

import { Copy, Edit3, ExternalLink, Trash2 } from 'lucide-react';
import type { Project } from '../../types';
import { Badge } from '../common/Badge';
import { Button } from '../common/Button';

const statusConfig: Record<string, { label: string; variant: 'planning' | 'active' | 'completed' | 'on_hold' }> = {
  planning: { label: 'Planning', variant: 'planning' },
  active: { label: 'Active', variant: 'active' },
  completed: { label: 'Completed', variant: 'completed' },
  on_hold: { label: 'On Hold', variant: 'on_hold' },
};

export const ProjectCard = ({
  project,
  canManageProject,
  onOpen,
  onEdit,
  onDelete,
  onCopyInvite,
}: {
  project: Project;
  canManageProject: boolean;
  onOpen: () => void;
  onEdit: () => void;
  onDelete: () => void;
  onCopyInvite: () => void;
}) => {
  const status = statusConfig[project.status] ?? statusConfig.planning;

  return (
    <div className="group rounded-2xl border border-white/10 bg-slate-800/70 p-5 shadow-[0_16px_40px_rgba(2,8,23,0.25)] backdrop-blur-md transition-all duration-200 hover:-translate-y-1 hover:shadow-[0_24px_60px_rgba(59,130,246,0.14)]">
      <div className="flex items-start justify-between gap-3">
        <div>
          <h3 className="text-lg font-semibold text-slate-100">{project.name}</h3>
          <p className="mt-2 text-sm text-slate-400">{project.description || 'No description yet.'}</p>
        </div>
        <Badge variant={status.variant}>{status.label}</Badge>
      </div>

      <div className="mt-5 space-y-3 text-sm text-slate-400">
        <div className="flex items-center justify-between">
          <span>Owner</span>
          <span className="font-medium text-slate-200">{project.owner}</span>
        </div>
        <div className="flex items-center justify-between">
          <span>Members</span>
          <span className="font-medium text-slate-200">{project.members?.length ?? 0}</span>
        </div>
        <div className="flex items-center justify-between">
          <span>Created</span>
          <span className="font-medium text-slate-200">{project.createdAt ? new Date(project.createdAt).toLocaleDateString() : '—'}</span>
        </div>
        <div className="flex items-center justify-between">
          <span>Invite</span>
          <span className="font-medium text-slate-200">{project.inviteCode || '—'}</span>
        </div>
      </div>

      <div className="mt-5 flex flex-wrap gap-2">
        <Button variant="primary" size="sm" onClick={onOpen}>
          <ExternalLink className="mr-2 h-4 w-4" />
          Open
        </Button>
        {canManageProject ? (
          <>
            <Button variant="outline" size="sm" onClick={onEdit}>
              <Edit3 className="mr-2 h-4 w-4" />
              Edit
            </Button>
            <Button variant="danger" size="sm" onClick={onDelete}>
              <Trash2 className="mr-2 h-4 w-4" />
              Delete
            </Button>
          </>
        ) : null}
        <Button variant="ghost" size="sm" onClick={onCopyInvite}>
          <Copy className="mr-2 h-4 w-4" />
          Copy
        </Button>
      </div>
    </div>
  );
};

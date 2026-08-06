import { Search, UserCheck } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import { Button } from '../common/Button';
import { Input } from '../common/Input';
import { Modal } from '../common/Modal';
import { getAssigneeId, getInitials } from '../../utils/taskHelpers';
import type { Task, User } from '../../types';

export const AssignModal = ({
  open,
  task,
  members,
  loading,
  onClose,
  onAssign,
}: {
  open: boolean;
  task: Task | null;
  members: User[];
  loading: boolean;
  onClose: () => void;
  onAssign: (assignedTo: string) => Promise<void>;
}) => {
  const [search, setSearch] = useState('');
  const [selectedMemberId, setSelectedMemberId] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    if (open) {
      setSearch('');
      setSelectedMemberId(task ? getAssigneeId(task) ?? '' : '');
      setError('');
    }
  }, [open, task]);

  const filteredMembers = useMemo(() => {
    const query = search.trim().toLowerCase();
    if (!query) return members;

    return members.filter(
      (member) =>
        member.name.toLowerCase().includes(query) ||
        member.username.toLowerCase().includes(query) ||
        member.email.toLowerCase().includes(query),
    );
  }, [members, search]);

  const handleAssign = async () => {
    if (!selectedMemberId) {
      setError('Please select a member to assign.');
      return;
    }

    setError('');
    await onAssign(selectedMemberId);
  };

  return (
    <Modal open={open} onClose={onClose} className="max-w-lg">
      <div className="space-y-4">
        <div>
          <h3 className="text-xl font-semibold text-slate-100">Assign Member</h3>
          <p className="mt-1 text-sm text-slate-400">
            Choose a project member to assign to{' '}
            <span className="font-medium text-slate-200">{task?.title}</span>.
          </p>
        </div>

        <div className="relative">
          <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
          <Input
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Search members..."
            className="pl-11"
            disabled={loading}
          />
        </div>

        {error ? (
          <div className="rounded-xl border border-rose-500/30 bg-rose-500/10 px-3 py-2 text-sm text-rose-300">
            {error}
          </div>
        ) : null}

        <div className="max-h-64 space-y-2 overflow-y-auto pr-1">
          {filteredMembers.length === 0 ? (
            <div className="rounded-2xl border border-white/10 bg-slate-900/60 px-4 py-8 text-center text-sm text-slate-400">
              No members found.
            </div>
          ) : (
            filteredMembers.map((member) => {
              const selected = selectedMemberId === member._id;

              return (
                <button
                  key={member._id}
                  type="button"
                  disabled={loading}
                  onClick={() => setSelectedMemberId(member._id)}
                  className={`flex w-full items-center gap-3 rounded-2xl border px-4 py-3 text-left transition-all duration-200 ${
                    selected
                      ? 'border-sky-400/40 bg-sky-500/10 shadow-[0_8px_24px_rgba(59,130,246,0.12)]'
                      : 'border-white/10 bg-slate-900/60 hover:border-sky-500/20 hover:bg-slate-800/70'
                  }`}
                >
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-sky-500/15 text-sm font-semibold text-sky-300">
                    {member.avatar ? (
                      <img
                        src={member.avatar}
                        alt={member.name}
                        className="h-10 w-10 rounded-2xl object-cover"
                      />
                    ) : (
                      getInitials(member.name)
                    )}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="truncate font-medium text-slate-100">{member.name}</p>
                    <p className="truncate text-sm text-slate-400">@{member.username}</p>
                  </div>
                  {selected ? <UserCheck className="h-4 w-4 shrink-0 text-sky-400" /> : null}
                </button>
              );
            })
          )}
        </div>

        <div className="flex justify-end gap-3">
          <Button variant="ghost" onClick={onClose} disabled={loading}>
            Cancel
          </Button>
          <Button variant="primary" onClick={() => void handleAssign()} disabled={loading}>
            {loading ? 'Assigning...' : 'Assign'}
          </Button>
        </div>
      </div>
    </Modal>
  );
};

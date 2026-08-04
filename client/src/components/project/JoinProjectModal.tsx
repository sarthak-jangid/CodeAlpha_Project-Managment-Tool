import { useEffect, useState } from 'react';
import { Button } from '../common/Button';
import { Input } from '../common/Input';
import { Modal } from '../common/Modal';

export const JoinProjectModal = ({
  open,
  loading,
  onClose,
  onSubmit,
}: {
  open: boolean;
  loading: boolean;
  onClose: () => void;
  onSubmit: (inviteCode: string) => Promise<void>;
}) => {
  const [inviteCode, setInviteCode] = useState('');

  useEffect(() => {
    if (open) {
      setInviteCode('');
    }
  }, [open]);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    await onSubmit(inviteCode.trim().toUpperCase());
  };

  return (
    <Modal open={open} onClose={onClose} className="max-w-md">
      <div className="space-y-4">
        <div>
          <h3 className="text-xl font-semibold text-slate-100">Join a project</h3>
          <p className="mt-1 text-sm text-slate-400">Enter the invite code shared by your team.</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <Input value={inviteCode} onChange={(event) => setInviteCode(event.target.value)} placeholder="PROJ-ABC123" maxLength={12} disabled={loading} />
          <div className="flex justify-end gap-3">
            <Button type="button" variant="ghost" onClick={onClose} disabled={loading}>Cancel</Button>
            <Button type="submit" variant="primary" disabled={loading}>{loading ? 'Joining...' : 'Join Project'}</Button>
          </div>
        </form>
      </div>
    </Modal>
  );
};

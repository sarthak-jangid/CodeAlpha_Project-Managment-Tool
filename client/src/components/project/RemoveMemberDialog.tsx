import { Button } from '../common/Button';
import { Modal } from '../common/Modal';

export const RemoveMemberDialog = ({
  open,
  memberName,
  loading,
  onClose,
  onConfirm,
}: {
  open: boolean;
  memberName: string;
  loading: boolean;
  onClose: () => void;
  onConfirm: () => Promise<void>;
}) => {
  return (
    <Modal open={open} onClose={onClose} className="max-w-md">
      <div className="space-y-4">
        <div>
          <h3 className="text-xl font-semibold text-slate-100">Remove member</h3>
          <p className="mt-1 text-sm text-slate-400">
            Are you sure you want to remove{' '}
            <span className="font-semibold text-slate-100">{memberName}</span> from this project?
            They will lose access immediately.
          </p>
        </div>

        <div className="flex justify-end gap-3">
          <Button variant="ghost" onClick={onClose} disabled={loading}>
            Cancel
          </Button>
          <Button variant="danger" onClick={() => void onConfirm()} disabled={loading}>
            {loading ? 'Removing...' : 'Remove Member'}
          </Button>
        </div>
      </div>
    </Modal>
  );
};

import { Button } from '../common/Button';
import { Modal } from '../common/Modal';

export const DeleteTaskDialog = ({
  open,
  taskTitle,
  loading,
  onClose,
  onConfirm,
}: {
  open: boolean;
  taskTitle: string;
  loading: boolean;
  onClose: () => void;
  onConfirm: () => Promise<void>;
}) => {
  return (
    <Modal open={open} onClose={onClose} className="max-w-md">
      <div className="space-y-4">
        <div>
          <h3 className="text-xl font-semibold text-slate-100">Delete task</h3>
          <p className="mt-1 text-sm text-slate-400">
            This action cannot be undone. The task{' '}
            <span className="font-semibold text-slate-100">{taskTitle}</span> will be permanently
            removed.
          </p>
        </div>

        <div className="flex justify-end gap-3">
          <Button variant="ghost" onClick={onClose} disabled={loading}>
            Cancel
          </Button>
          <Button variant="danger" onClick={() => void onConfirm()} disabled={loading}>
            {loading ? 'Deleting...' : 'Delete Task'}
          </Button>
        </div>
      </div>
    </Modal>
  );
};

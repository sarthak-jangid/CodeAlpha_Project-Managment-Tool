import { Button } from '../common/Button';
import { Modal } from '../common/Modal';

type DeleteCommentDialogProps = {
  open: boolean;
  commentPreview: string;
  loading?: boolean;
  onClose: () => void;
  onConfirm: () => void;
};

export const DeleteCommentDialog = ({ open, commentPreview, loading = false, onClose, onConfirm }: DeleteCommentDialogProps) => {
  return (
    <Modal open={open} onClose={onClose} className="max-w-md">
      <div className="space-y-4">
        <div>
          <h3 className="text-xl font-semibold text-slate-100">Delete comment</h3>
          <p className="mt-2 text-sm text-slate-400">
            This will remove the following comment permanently.
          </p>
          <div className="mt-3 rounded-2xl border border-white/10 bg-slate-900/70 p-3 text-sm text-slate-300">
            {commentPreview}
          </div>
        </div>

        <div className="flex justify-end gap-3">
          <Button type="button" variant="ghost" onClick={onClose} disabled={loading}>
            Cancel
          </Button>
          <Button type="button" variant="danger" onClick={onConfirm} disabled={loading}>
            {loading ? 'Deleting...' : 'Delete Comment'}
          </Button>
        </div>
      </div>
    </Modal>
  );
};

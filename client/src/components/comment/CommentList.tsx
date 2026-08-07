import { EmptyState } from '../common/EmptyState';
import { CommentCard } from './CommentCard';
import { CommentListSkeleton } from './CommentSkeleton';
import type { Comment } from '../../types';

const getAuthorId = (comment: Comment) => {
  if (!comment.author) return '';
  if (typeof comment.author === 'string') return comment.author;
  return comment.author._id;
};

type CommentListProps = {
  comments: Comment[];
  loading?: boolean;
  error?: string;
  currentUserId?: string;
  canManageComments?: boolean;
  editingCommentId?: string | null;
  editingMessage?: string;
  submitting?: boolean;
  onEdit: (comment: Comment) => void;
  onDelete: (comment: Comment) => void;
  onEditValueChange?: (value: string) => void;
  onSaveEdit?: (message: string) => void;
  onCancelEdit?: () => void;
  onRetry?: () => void;
};

export const CommentList = ({ comments, loading = false, error, currentUserId, canManageComments = false, editingCommentId, editingMessage = '', submitting = false, onEdit, onDelete, onEditValueChange, onSaveEdit, onCancelEdit, onRetry }: CommentListProps) => {
  if (loading) {
    return <CommentListSkeleton />;
  }

  if (error) {
    return (
      <div className="rounded-2xl border border-white/10 bg-slate-900/60 p-6 text-center">
        <p className="text-sm font-medium text-slate-200">Unable to load comments</p>
        <p className="mt-2 text-sm text-slate-400">{error}</p>
        {onRetry ? (
          <button type="button" onClick={onRetry} className="mt-4 text-sm text-sky-400 hover:text-sky-300">
            Try again
          </button>
        ) : null}
      </div>
    );
  }

  if (comments.length === 0) {
    return <EmptyState title="No comments yet" description="Be the first to start the discussion." />;
  }

  return (
    <div className="space-y-3">
      {comments.map((comment) => (
        <CommentCard
          key={comment._id}
          comment={comment}
          isAuthor={String(getAuthorId(comment)) === String(currentUserId)}
          canManageComment={canManageComments}
          editing={editingCommentId === comment._id}
          editValue={editingMessage}
          loading={submitting}
          onEdit={onEdit}
          onDelete={onDelete}
          onEditValueChange={onEditValueChange}
          onSaveEdit={onSaveEdit}
          onCancelEdit={onCancelEdit}
        />
      ))}
    </div>
  );
};

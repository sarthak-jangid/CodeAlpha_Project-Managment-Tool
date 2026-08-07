import { Edit3, Trash2 } from 'lucide-react';
import { Avatar } from '../common/Avatar';
import { Badge } from '../common/Badge';
import { CommentInput } from './CommentInput';
import type { Comment, User } from '../../types';

type CommentCardProps = {
  comment: Comment;
  isAuthor: boolean;
  canManageComment?: boolean;
  editing?: boolean;
  editValue?: string;
  loading?: boolean;
  onEdit: (comment: Comment) => void;
  onDelete: (comment: Comment) => void;
  onEditValueChange?: (value: string) => void;
  onSaveEdit?: (message: string) => void;
  onCancelEdit?: () => void;
};

export const CommentCard = ({
  comment,
  isAuthor,
  canManageComment = false,
  editing = false,
  editValue = '',
  loading = false,
  onEdit,
  onDelete,
  onEditValueChange,
  onSaveEdit,
  onCancelEdit,
}: CommentCardProps) => {
  const author = (comment as Comment & { author?: User | string }).author as User | undefined;
  const isEdited = Boolean(comment.updatedAt && comment.updatedAt !== comment.createdAt);

  return (
    <article className="rounded-2xl border border-white/10 bg-slate-900/70 p-4 shadow-[0_8px_24px_rgba(2,8,23,0.16)] transition-all duration-200 hover:border-sky-500/20 hover:bg-slate-900/80">
      <div className="flex items-start gap-3">
        <Avatar src={author?.avatar} name={author?.name ?? 'User'} size="md" />

        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <p className="text-sm font-semibold text-slate-100">{author?.name ?? 'Unknown user'}</p>
            {author?.username ? (
              <p className="text-xs text-slate-500">@{author.username}</p>
            ) : null}
            {isEdited ? <Badge variant="review">Edited</Badge> : null}
          </div>

          <p className="mt-1 text-xs text-slate-500">
            {comment.createdAt ? new Date(comment.createdAt).toLocaleString(undefined, { month: 'short', day: 'numeric', year: 'numeric', hour: 'numeric', minute: '2-digit' }) : 'Just now'}
          </p>

          <p className="mt-3 whitespace-pre-wrap text-sm leading-relaxed text-slate-300">{comment.message}</p>
        </div>

        {(isAuthor || canManageComment) ? (
          <div className="flex shrink-0 items-center gap-2">
            {isAuthor ? (
              <button
                type="button"
                onClick={() => onEdit(comment)}
                className="rounded-xl border border-white/10 bg-white/5 p-2 text-slate-400 transition-colors hover:text-slate-100"
                aria-label="Edit comment"
              >
                <Edit3 className="h-4 w-4" />
              </button>
            ) : null}
            <button
              type="button"
              onClick={() => onDelete(comment)}
              className="rounded-xl border border-white/10 bg-white/5 p-2 text-slate-400 transition-colors hover:text-rose-300"
              aria-label="Delete comment"
            >
              <Trash2 className="h-4 w-4" />
            </button>
          </div>
        ) : null}
      </div>

      {editing ? (
        <div className="mt-4">
          <CommentInput
            mode="edit"
            loading={loading}
            initialValue={editValue}
            onSubmit={(message) => {
              if (onEditValueChange) onEditValueChange(message);
              if (onSaveEdit) onSaveEdit(message);
            }}
            onCancel={onCancelEdit}
          />
        </div>
      ) : null}
    </article>
  );
};

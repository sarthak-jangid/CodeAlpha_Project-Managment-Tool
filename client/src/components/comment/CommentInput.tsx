import { useEffect, useMemo, useState } from 'react';
import { SendHorizonal } from 'lucide-react';
import { Button } from '../common/Button';
import { Textarea } from '../common/Textarea';

type CommentInputProps = {
  loading?: boolean;
  onSubmit: (message: string) => Promise<void> | void;
  onCancel?: () => void;
  initialValue?: string;
  mode?: 'create' | 'edit';
};

export const CommentInput = ({
  loading = false,
  onSubmit,
  onCancel,
  initialValue = '',
  mode = 'create',
}: CommentInputProps) => {
  const [message, setMessage] = useState(initialValue);

  useEffect(() => {
    setMessage(initialValue);
  }, [initialValue]);

  const charCount = useMemo(() => message.trim().length, [message]);

  const handleSubmit = async () => {
    const trimmed = message.trim();
    if (!trimmed) return;
    await onSubmit(trimmed);
  };

  const onKeyDown = async (event: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (event.key === 'Enter' && (event.metaKey || event.ctrlKey)) {
      event.preventDefault();
      await handleSubmit();
    }
  };

  return (
    <div className="rounded-2xl border border-white/10 bg-slate-900/60 p-4 shadow-[0_10px_30px_rgba(2,8,23,0.18)] backdrop-blur-md">
      <Textarea
        value={message}
        onChange={(event) => setMessage(event.target.value)}
        placeholder={mode === 'edit' ? 'Edit your comment...' : 'Write a comment...'}
        disabled={loading}
        onKeyDown={onKeyDown}
      />

      <div className="mt-3 flex flex-wrap items-center justify-between gap-3">
        <p className="text-xs text-slate-500">
          {mode === 'edit' ? 'Update your comment' : 'Press Ctrl + Enter to send'}
        </p>
        <div className="flex items-center gap-2">
          {onCancel ? (
            <Button type="button" variant="ghost" onClick={onCancel} disabled={loading}>
              Cancel
            </Button>
          ) : null}
          <Button type="button" variant="primary" onClick={() => void handleSubmit()} disabled={loading || !message.trim()}>
            {loading ? (mode === 'edit' ? 'Saving...' : 'Sending...') : mode === 'edit' ? 'Save' : 'Send Comment'}
            {!loading ? <SendHorizonal className="ml-2 h-4 w-4" /> : null}
          </Button>
        </div>
      </div>

      <div className="mt-2 text-right text-xs text-slate-500">{charCount} characters</div>
    </div>
  );
};

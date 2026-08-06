import { Check, Copy } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Button } from '../common/Button';
import { Input } from '../common/Input';
import { Modal } from '../common/Modal';

type InviteMemberModalProps = {
  open: boolean;
  loading: boolean;
  inviteCode?: string;
  onClose: () => void;
  onSubmit?: (inviteCode: string) => Promise<void>;
  onCopySuccess?: () => void;
};

export const InviteMemberModal = ({
  open,
  loading,
  inviteCode,
  onClose,
  onSubmit,
  onCopySuccess,
}: InviteMemberModalProps) => {
  const [code, setCode] = useState('');
  const [copied, setCopied] = useState(false);

  const isShareMode = Boolean(inviteCode);

  useEffect(() => {
    if (open) {
      setCode('');
      setCopied(false);
    }
  }, [open]);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!onSubmit) return;
    await onSubmit(code.trim().toUpperCase());
  };

  const handleCopy = async () => {
    if (!inviteCode) return;
    try {
      await navigator.clipboard.writeText(inviteCode);
      setCopied(true);
      onCopySuccess?.();
      setTimeout(() => setCopied(false), 1500);
    } catch {
      // parent handles error toast
    }
  };

  return (
    <Modal open={open} onClose={onClose} className="max-w-md">
      <div className="space-y-4">
        <div>
          <h3 className="text-xl font-semibold text-slate-100">
            {isShareMode ? 'Invite a teammate' : 'Join a project'}
          </h3>
          <p className="mt-1 text-sm text-slate-400">
            {isShareMode
              ? 'Share this invite code so someone can join your project.'
              : 'Enter the invite code shared by your team.'}
          </p>
        </div>

        {isShareMode ? (
          <div className="space-y-4">
            <div className="rounded-2xl border border-sky-400/20 bg-sky-500/5 p-4">
              <p className="text-xs font-medium uppercase tracking-[0.2em] text-sky-400">Invite Code</p>
              <div className="mt-3 flex items-center gap-3">
                <Input
                  readOnly
                  value={inviteCode}
                  className="font-mono text-base tracking-wider text-sky-200"
                />
                <Button
                  type="button"
                  variant={copied ? 'success' : 'outline'}
                  onClick={() => void handleCopy()}
                  disabled={loading}
                  className="shrink-0"
                >
                  {copied ? (
                    <>
                      <Check className="mr-2 h-4 w-4" />
                      Copied!
                    </>
                  ) : (
                    <>
                      <Copy className="mr-2 h-4 w-4" />
                      Copy
                    </>
                  )}
                </Button>
              </div>
            </div>

            <div className="flex justify-end gap-3">
              <Button type="button" variant="primary" onClick={onClose} disabled={loading}>
                Done
              </Button>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              value={code}
              onChange={(event) => setCode(event.target.value)}
              placeholder="PROJ-ABC123"
              disabled={loading}
            />
            <div className="flex justify-end gap-3">
              <Button type="button" variant="ghost" onClick={onClose} disabled={loading}>
                Cancel
              </Button>
              <Button type="submit" variant="primary" disabled={loading}>
                {loading ? 'Joining...' : 'Join Project'}
              </Button>
            </div>
          </form>
        )}
      </div>
    </Modal>
  );
};

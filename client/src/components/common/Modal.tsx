import { X } from 'lucide-react';
import { useEffect, type ReactNode } from 'react';
import { cn } from '../../utils/cn';

export const Modal = ({ open, onClose, children, className }: { open: boolean; onClose: () => void; children: ReactNode; className?: string }) => {
  useEffect(() => {
    if (!open) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };

    document.body.style.overflow = 'hidden';
    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.body.style.overflow = '';
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 px-4 py-6 backdrop-blur-sm" onClick={onClose}>
      <div
        role="dialog"
        aria-modal="true"
        aria-label="Dialog"
        className={cn('max-h-[min(90vh,760px)] w-full max-w-lg overflow-y-auto animate-[fadeIn_220ms_ease-out] rounded-2xl border border-white/10 bg-slate-900/95 p-6 shadow-[0_20px_70px_rgba(2,8,23,0.45)]', className)}
        onClick={(event) => event.stopPropagation()}
      >
        <div className="mb-4 flex items-center justify-end">
          <button onClick={onClose} aria-label="Close dialog" className="rounded-xl border border-white/10 bg-white/5 p-2 text-slate-300 transition-colors hover:bg-white/10 hover:text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-500/60">
            <X className="h-4 w-4" />
          </button>
        </div>
        {children}
      </div>
    </div>
  );
};

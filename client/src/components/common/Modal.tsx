import { X } from 'lucide-react';
import { useEffect, useRef, type ReactNode } from 'react';
import { cn } from '../../utils/cn';

export const Modal = ({ open, onClose, children, className }: { open: boolean; onClose: () => void; children: ReactNode; className?: string }) => {
  const modalRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!open) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };

    const previouslyFocused = document.activeElement as HTMLElement | null;
    document.body.style.overflow = 'hidden';
    document.addEventListener('keydown', handleKeyDown);

    requestAnimationFrame(() => {
      modalRef.current?.querySelector<HTMLElement>('button, input, select, textarea')?.focus();
    });

    return () => {
      document.body.style.overflow = '';
      document.removeEventListener('keydown', handleKeyDown);
      previouslyFocused?.focus();
    };
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 px-4 py-6 backdrop-blur-xl" onClick={onClose}>
      <div
        ref={modalRef}
        role="dialog"
        aria-modal="true"
        aria-label="Dialog"
        className={cn(
          'max-h-[min(90vh,760px)] w-full max-w-lg overflow-hidden rounded-3xl border border-white/10 bg-slate-900/95 shadow-[0_24px_80px_rgba(2,8,23,0.55)] backdrop-blur-md animate-[fadeScaleIn_200ms_ease-out]',
          className,
        )}
        onClick={(event) => event.stopPropagation()}
      >
        <div className="flex h-full flex-col overflow-hidden rounded-3xl">
          <div className="flex items-center justify-between gap-4 border-b border-white/10 bg-slate-950/95 px-5 py-4 backdrop-blur-sm">
            <div />
            <button
              onClick={onClose}
              aria-label="Close dialog"
              className="rounded-2xl border border-white/10 bg-white/5 p-2 text-slate-300 transition-colors duration-200 hover:bg-white/10 hover:text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-500/60"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
          <div className="max-h-[calc(90vh-72px)] overflow-y-auto px-6 py-5">{children}</div>
        </div>
      </div>
    </div>
  );
};

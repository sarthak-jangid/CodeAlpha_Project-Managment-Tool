import { X } from 'lucide-react';
import { cn } from '../../utils/cn';

export const Modal = ({ open, onClose, children, className }: { open: boolean; onClose: () => void; children: React.ReactNode; className?: string }) => {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 px-4 backdrop-blur-sm">
      <div className={cn('w-full max-w-lg rounded-2xl border border-white/10 bg-slate-900/90 p-6 shadow-2xl', className)}>
        <div className="mb-4 flex items-center justify-end">
          <button onClick={onClose} className="rounded-xl border border-white/10 bg-white/5 p-2 text-slate-300">
            <X className="h-4 w-4" />
          </button>
        </div>
        {children}
      </div>
    </div>
  );
};

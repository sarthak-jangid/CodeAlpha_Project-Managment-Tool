import { ChevronDown } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { Badge } from '../common/Badge';
import { cn } from '../../utils/cn';
import {
  STATUS_BADGE_VARIANT,
  STATUS_LABELS,
  TASK_STATUSES,
} from '../../utils/taskHelpers';
import type { TaskStatus } from '../../types';

export const StatusDropdown = ({
  status = 'Todo',
  loading,
  onChange,
}: {
  status?: TaskStatus;
  loading?: boolean;
  onChange: (status: TaskStatus) => void;
}) => {
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSelect = (nextStatus: TaskStatus) => {
    if (nextStatus === status) {
      setOpen(false);
      return;
    }
    onChange(nextStatus);
    setOpen(false);
  };

  return (
    <div ref={containerRef} className="relative">
      <button
        type="button"
        disabled={loading}
        onClick={() => setOpen((prev) => !prev)}
        className={cn(
          'inline-flex items-center gap-2 rounded-xl border border-white/10 bg-slate-900/70 px-3 py-1.5 text-xs font-medium text-slate-200 transition-all duration-200 hover:border-sky-500/30 hover:bg-slate-800/80',
          loading && 'cursor-not-allowed opacity-60',
        )}
      >
        <Badge variant={STATUS_BADGE_VARIANT[status]}>{STATUS_LABELS[status]}</Badge>
        <ChevronDown className={cn('h-3.5 w-3.5 text-slate-400 transition-transform', open && 'rotate-180')} />
      </button>

      {open ? (
        <div className="absolute right-0 z-20 mt-2 w-44 overflow-hidden rounded-2xl border border-white/10 bg-slate-900/95 p-1 shadow-2xl backdrop-blur-md animate-[fadeIn_220ms_ease-out]">
          {TASK_STATUSES.map((item, index) => (
            <button
              key={item}
              type="button"
              disabled={loading}
              onClick={() => handleSelect(item)}
              className={cn(
                'flex w-full items-center justify-between rounded-xl px-3 py-2 text-left text-sm transition-colors hover:bg-white/5',
                item === status && 'bg-sky-500/10 text-sky-200',
              )}
            >
              <Badge variant={STATUS_BADGE_VARIANT[item]}>{STATUS_LABELS[item]}</Badge>
              {index < TASK_STATUSES.length - 1 ? (
                <span className="text-[10px] text-slate-500">↓</span>
              ) : null}
            </button>
          ))}
        </div>
      ) : null}
    </div>
  );
};

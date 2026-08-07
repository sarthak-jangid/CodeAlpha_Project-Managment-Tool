import { cn } from '../../utils/cn';
import { getInitials } from '../../utils/taskHelpers';

export const Avatar = ({
  src,
  name,
  size = 'md',
  className,
}: {
  src?: string;
  name: string;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}) => {
  const sizeClasses = {
    sm: 'h-8 w-8 text-xs',
    md: 'h-10 w-10 text-sm',
    lg: 'h-11 w-11 text-sm',
  } as const;

  return (
    <div className={cn('flex shrink-0 items-center justify-center rounded-2xl bg-sky-500/15 font-semibold text-sky-300', sizeClasses[size], className)}>
      {src ? <img src={src} alt={name} className="h-full w-full rounded-2xl object-cover" /> : getInitials(name)}
    </div>
  );
};

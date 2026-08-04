import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '../../utils/cn';

const badgeVariants = cva('inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium', {
  variants: {
    variant: {
      default: 'bg-slate-700 text-slate-200',
      planning: 'bg-slate-700 text-slate-200',
      active: 'bg-sky-500/15 text-sky-300',
      completed: 'bg-emerald-500/15 text-emerald-300',
      on_hold: 'bg-amber-500/15 text-amber-300',
      low: 'bg-slate-700 text-slate-200',
      medium: 'bg-sky-500/15 text-sky-300',
      high: 'bg-amber-500/15 text-amber-300',
      urgent: 'bg-rose-500/15 text-rose-300',
      todo: 'bg-slate-700 text-slate-200',
      in_progress: 'bg-sky-500/15 text-sky-300',
      review: 'bg-amber-500/15 text-amber-300',
      done: 'bg-emerald-500/15 text-emerald-300',
    },
  },
  defaultVariants: {
    variant: 'default',
  },
});

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement>, VariantProps<typeof badgeVariants> {}

export const Badge = ({ className, variant, ...props }: BadgeProps) => {
  return <span className={cn(badgeVariants({ variant }), className)} {...props} />;
};

import { cva, type VariantProps } from 'class-variance-authority';
import { forwardRef } from 'react';
import { cn } from '../../utils/cn';

const buttonVariants = cva(
  'inline-flex items-center justify-center rounded-xl px-4 py-2.5 text-sm font-medium transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-500/60 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-950 disabled:cursor-not-allowed disabled:opacity-60 active:scale-[0.98]',
  {
    variants: {
      variant: {
        primary: 'bg-sky-600 text-white hover:bg-sky-500 shadow-[0_10px_30px_rgba(59,130,246,0.25)] hover:shadow-[0_16px_40px_rgba(59,130,246,0.28)]',
        secondary: 'bg-slate-800/90 text-slate-100 hover:bg-slate-700 border border-white/10',
        outline: 'border border-white/10 bg-transparent text-slate-200 hover:bg-white/5 hover:border-sky-500/30',
        ghost: 'bg-transparent text-slate-300 hover:bg-white/5 hover:text-white',
        danger: 'bg-rose-600 text-white hover:bg-rose-500 shadow-[0_10px_30px_rgba(244,63,94,0.2)]',
        success: 'bg-emerald-600 text-white hover:bg-emerald-500 shadow-[0_10px_30px_rgba(16,185,129,0.2)]',
      },
      size: {
        sm: 'h-9 px-3 text-sm',
        md: 'h-10 px-4 text-sm',
        lg: 'h-12 px-5 text-base',
      },
    },
    defaultVariants: {
      variant: 'primary',
      size: 'md',
    },
  }
);

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement>, VariantProps<typeof buttonVariants> {}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(({ className, variant, size, type = 'button', ...props }, ref) => {
  return <button ref={ref} type={type} className={cn(buttonVariants({ variant, size, className }))} {...props} />;
});

Button.displayName = 'Button';

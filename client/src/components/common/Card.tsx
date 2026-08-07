import { cn } from '../../utils/cn';

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {}

export const Card = ({ className, children, ...props }: CardProps) => {
  return (
    <div
      className={cn(
        'rounded-2xl border border-white/10 bg-slate-800/70 p-5 shadow-[0_12px_35px_rgba(2,8,23,0.25)] backdrop-blur-md transition-all duration-200 hover:-translate-y-0.5 hover:border-sky-500/20 hover:shadow-[0_20px_50px_rgba(59,130,246,0.16)]',
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
};

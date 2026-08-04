import { cn } from '../../utils/cn';

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {}

export const Card = ({ className, children, ...props }: CardProps) => {
  return (
    <div
      className={cn(
        'rounded-2xl border border-white/10 bg-slate-800/70 p-5 shadow-[0_10px_30px_rgba(15,23,42,0.35)] backdrop-blur-md transition-all duration-200 hover:-translate-y-0.5 hover:shadow-[0_18px_45px_rgba(59,130,246,0.12)]',
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
};

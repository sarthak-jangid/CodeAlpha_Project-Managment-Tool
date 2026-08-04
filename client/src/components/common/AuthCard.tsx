import { Card } from './Card';

export const AuthCard = ({ children, title, subtitle }: { children: React.ReactNode; title: string; subtitle: string }) => (
  <div className="w-full max-w-md animate-[fadeIn_200ms_ease-out]">
    <Card className="border-white/10 bg-slate-800/70 px-6 py-8 shadow-[0_25px_80px_rgba(2,8,23,0.45)] sm:px-8">
      <div className="mb-6 text-center">
        <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-sky-500/15 text-sky-300">
          P
        </div>
        <h2 className="text-2xl font-semibold text-slate-100">{title}</h2>
        <p className="mt-2 text-sm text-slate-400">{subtitle}</p>
      </div>
      {children}
    </Card>
  </div>
);

import { Inbox } from 'lucide-react';

export const EmptyState = ({ title, description, icon: Icon = Inbox }: { title: string; description: string; icon?: React.ElementType }) => (
  <div className="flex flex-col items-center justify-center rounded-2xl border border-white/10 bg-slate-900/60 px-6 py-12 text-center shadow-[0_10px_35px_rgba(2,8,23,0.16)]">
    <div className="mb-4 rounded-2xl border border-white/10 bg-white/5 p-3 text-slate-300">
      <Icon className="h-5 w-5" />
    </div>
    <h3 className="text-base font-semibold text-slate-100">{title}</h3>
    <p className="mt-2 max-w-sm text-sm text-slate-400">{description}</p>
  </div>
);

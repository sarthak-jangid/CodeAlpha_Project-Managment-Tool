import { Inbox } from 'lucide-react';

export const EmptyState = ({ title, description }: { title: string; description: string }) => (
  <div className="flex flex-col items-center justify-center rounded-2xl border border-white/10 bg-slate-900/60 px-6 py-12 text-center">
    <div className="mb-3 rounded-full bg-white/5 p-3 text-slate-300">
      <Inbox className="h-5 w-5" />
    </div>
    <h3 className="text-base font-semibold text-slate-100">{title}</h3>
    <p className="mt-2 max-w-sm text-sm text-slate-400">{description}</p>
  </div>
);

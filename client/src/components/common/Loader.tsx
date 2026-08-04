import { Spinner } from './Spinner';

export const Loader = ({ label = 'Loading...' }: { label?: string }) => (
  <div className="flex flex-col items-center justify-center gap-3 py-6 text-sm text-slate-400">
    <Spinner />
    <span>{label}</span>
  </div>
);

export const CommentSkeleton = () => (
  <div className="animate-pulse rounded-2xl border border-white/10 bg-slate-900/70 p-4">
    <div className="flex items-start gap-3">
      <div className="h-10 w-10 shrink-0 rounded-2xl bg-white/10" />
      <div className="flex-1 space-y-2">
        <div className="h-4 w-24 rounded-lg bg-white/10" />
        <div className="h-3 w-32 rounded-lg bg-white/5" />
        <div className="h-3 w-full rounded-lg bg-white/5" />
        <div className="h-3 w-2/3 rounded-lg bg-white/5" />
      </div>
    </div>
  </div>
);

export const CommentListSkeleton = () => (
  <div className="space-y-3">
    {Array.from({ length: 3 }).map((_, index) => (
      <CommentSkeleton key={index} />
    ))}
  </div>
);

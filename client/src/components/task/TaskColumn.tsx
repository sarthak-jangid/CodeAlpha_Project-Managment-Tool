import { TaskCard, TaskCardSkeleton, TaskColumnEmptyState } from './TaskCard';
import { STATUS_LABELS } from '../../utils/taskHelpers';
import type { Task, TaskStatus } from '../../types';

const COLUMN_ACCENTS: Record<TaskStatus, string> = {
  Todo: 'from-slate-500/10 to-transparent',
  In_Progress: 'from-sky-500/10 to-transparent',
  Review: 'from-amber-500/10 to-transparent',
  Done: 'from-emerald-500/10 to-transparent',
};

export const TaskColumn = ({
  status,
  tasks,
  loading,
  currentUserId,
  isOwner,
  updatingTaskId,
  onEdit,
  onDelete,
  onAssign,
  onStatusChange,
}: {
  status: TaskStatus;
  tasks: Task[];
  loading?: boolean;
  currentUserId?: string;
  isOwner: boolean;
  updatingTaskId?: string | null;
  onEdit: (task: Task) => void;
  onDelete: (task: Task) => void;
  onAssign: (task: Task) => void;
  onStatusChange: (task: Task, status: TaskStatus) => void;
}) => {
  return (
    <section className="flex min-h-[420px] flex-col rounded-2xl border border-white/10 bg-slate-900/50 backdrop-blur-md">
      <div
        className={`border-b border-white/10 bg-gradient-to-r ${COLUMN_ACCENTS[status]} px-4 py-4`}
      >
        <div className="flex items-center justify-between gap-3">
          <h3 className="text-sm font-semibold text-slate-100">{STATUS_LABELS[status]}</h3>
          <span className="rounded-full border border-white/10 bg-white/5 px-2.5 py-1 text-xs font-medium text-slate-300">
            {tasks.length}
          </span>
        </div>
      </div>

      <div className="flex-1 space-y-3 overflow-y-auto p-3 sm:p-4">
        {loading ? (
          Array.from({ length: 2 }).map((_, index) => <TaskCardSkeleton key={index} />)
        ) : tasks.length === 0 ? (
          <TaskColumnEmptyState />
        ) : (
          tasks.map((task) => (
            <TaskCard
              key={task._id}
              task={task}
              currentUserId={currentUserId}
              isOwner={isOwner}
              statusUpdating={updatingTaskId === task._id}
              onEdit={onEdit}
              onDelete={onDelete}
              onAssign={onAssign}
              onStatusChange={onStatusChange}
            />
          ))
        )}
      </div>
    </section>
  );
};

export const TaskBoardSkeleton = () => (
  <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
    {Array.from({ length: 4 }).map((_, index) => (
      <div
        key={index}
        className="min-h-[420px] rounded-2xl border border-white/10 bg-slate-900/50 p-4"
      >
        <div className="mb-4 h-5 w-24 animate-pulse rounded-lg bg-white/10" />
        <div className="space-y-3">
          {Array.from({ length: 2 }).map((__, cardIndex) => (
            <TaskCardSkeleton key={cardIndex} />
          ))}
        </div>
      </div>
    ))}
  </div>
);

import { Crown, UserMinus } from 'lucide-react';
import type { User } from '../../types';
import { Avatar } from '../common/Avatar';
import { Button } from '../common/Button';

export const MemberCard = ({
  user,
  isOwner,
  onRemove,
}: {
  user: User;
  isOwner: boolean;
  onRemove?: () => void;
}) => {
  return (
    <div className="rounded-2xl border border-white/10 bg-slate-900/60 p-4 transition-all duration-200 hover:-translate-y-0.5 hover:border-sky-500/30 hover:shadow-[0_12px_30px_rgba(59,130,246,0.08)]">
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-3">
          <Avatar src={user.avatar} name={user.name} size="lg" />
          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <p className="truncate font-medium text-slate-100">{user.name}</p>
              {isOwner ? <Crown className="h-4 w-4 shrink-0 text-sky-400" /> : null}
            </div>
            <p className="truncate text-sm text-slate-400">@{user.username}</p>
            <p className="truncate text-sm text-slate-500">{user.email}</p>
          </div>
        </div>

        <span
          className={`shrink-0 rounded-full px-2.5 py-1 text-xs font-medium ${
            isOwner
              ? 'border border-sky-400/40 bg-transparent text-sky-300'
              : 'border border-white/10 bg-white/5 text-slate-300'
          }`}
        >
          {isOwner ? 'Owner' : 'Member'}
        </span>
      </div>

      {onRemove ? (
        <div className="mt-4 flex justify-end border-t border-white/5 pt-3">
          <Button variant="ghost" size="sm" onClick={onRemove}>
            <UserMinus className="mr-2 h-4 w-4" />
            Remove
          </Button>
        </div>
      ) : null}
    </div>
  );
};

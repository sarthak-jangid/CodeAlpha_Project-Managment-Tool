import { Crown, UserCircle2 } from 'lucide-react';
import type { User } from '../../types';
import { Badge } from '../common/Badge';
import { Button } from '../common/Button';

export const MemberCard = ({ user, isOwner, onRemove }: { user: User; isOwner: boolean; onRemove?: () => void }) => {
  const initials = user.name
    .split(' ')
    .map((part) => part[0])
    .slice(0, 2)
    .join('')
    .toUpperCase();

  return (
    <div className="rounded-2xl border border-white/10 bg-slate-900/60 p-4 transition-all duration-200 hover:-translate-y-0.5 hover:border-sky-500/30">
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-sky-500/15 text-sm font-semibold text-sky-300">
            {user.avatar ? <img src={user.avatar} alt={user.name} className="h-11 w-11 rounded-2xl object-cover" /> : initials}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <p className="font-medium text-slate-100">{user.name}</p>
              {isOwner ? <Crown className="h-4 w-4 text-sky-400" /> : null}
            </div>
            <p className="text-sm text-slate-400">@{user.username}</p>
            <p className="text-sm text-slate-500">{user.email}</p>
          </div>
        </div>
        <Badge variant={isOwner ? 'active' : 'default'}>{isOwner ? 'Owner' : 'Member'}</Badge>
      </div>

      {onRemove ? (
        <div className="mt-4 flex justify-end">
          <Button variant="ghost" size="sm" onClick={onRemove} disabled={isOwner}>
            <UserCircle2 className="mr-2 h-4 w-4" />
            Remove
          </Button>
        </div>
      ) : null}
    </div>
  );
};

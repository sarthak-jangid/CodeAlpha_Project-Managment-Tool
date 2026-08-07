import { Bell, LogOut, Search, Settings, UserCircle2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Button } from '../common/Button';
import { Input } from '../common/Input';

export const Navbar = () => {
  const { user, logout } = useAuth();

  return (
    <header className="sticky top-0 z-30 border-b border-white/10 bg-slate-950/80 backdrop-blur-md">
      <div className="flex items-center justify-between px-4 py-3 sm:px-6 lg:px-8">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-sky-500/15 text-sky-300">P</div>
          <div>
            <p className="text-sm font-semibold text-slate-100">ProjectFlow</p>
            <p className="text-xs text-slate-400">Workspace</p>
          </div>
        </div>

        <div className="hidden flex-1 items-center px-6 md:flex">
          <div className="relative w-full max-w-xl">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <Input placeholder="Search projects or tasks" className="pl-9" />
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Button variant="ghost" size="sm" className="hidden md:inline-flex">
            <Settings className="mr-2 h-4 w-4" />
            Settings
          </Button>
          <button className="rounded-xl border border-white/10 bg-white/5 p-2 text-slate-300 transition-colors hover:bg-white/10 hover:text-white">
            <Bell className="h-4 w-4" />
          </button>
          <Link to="/profile" className="flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-sm text-slate-200 transition-colors hover:bg-white/10 hover:text-white">
            <UserCircle2 className="h-4 w-4" />
            <span className="hidden sm:inline">{user?.name ?? 'User'}</span>
          </Link>
          <button onClick={() => void logout()} className="rounded-xl border border-white/10 bg-white/5 p-2 text-slate-300 transition-colors hover:bg-white/10 hover:text-white">
            <LogOut className="h-4 w-4" />
          </button>
        </div>
      </div>
    </header>
  );
};

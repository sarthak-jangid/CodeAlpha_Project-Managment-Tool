import { FolderKanban, LayoutGrid, LogOut, PanelLeftClose, PanelLeftOpen, Settings, UserCircle2 } from 'lucide-react';
import { NavLink } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Button } from '../common/Button';

const links = [
  { to: '/dashboard', label: 'Dashboard', icon: LayoutGrid },
  { to: '/projects', label: 'Projects', icon: FolderKanban },
  { to: '/profile', label: 'Profile', icon: UserCircle2 },
  { to: '/settings', label: 'Settings', icon: Settings },
];

export const Sidebar = ({ collapsed, onToggle }: { collapsed: boolean; onToggle: () => void }) => {
  const { logout } = useAuth();

  return (
    <aside className="flex h-full flex-col border-r border-white/10 bg-slate-950/80 backdrop-blur-md">
      <div className="flex items-center justify-between px-4 py-4">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-sky-500/15 text-sky-300">P</div>
          {!collapsed && (
            <div>
              <p className="text-sm font-semibold text-slate-100">ProjectFlow</p>
              <p className="text-xs text-slate-400">SaaS Suite</p>
            </div>
          )}
        </div>
        <button onClick={onToggle} className="rounded-xl border border-white/10 bg-white/5 p-2 text-slate-300">
          {collapsed ? <PanelLeftOpen className="h-4 w-4" /> : <PanelLeftClose className="h-4 w-4" />}
        </button>
      </div>

      <nav className="mt-4 flex-1 px-2">
        {links.map(({ to, label, icon: Icon }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) =>
              `mb-2 flex items-center gap-3 rounded-2xl px-3 py-3 text-sm transition-all duration-200 ${isActive ? 'bg-sky-500/15 text-sky-300 shadow-[0_10px_30px_rgba(59,130,246,0.15)]' : 'text-slate-300 hover:bg-white/5 hover:text-white'} ${collapsed ? 'justify-center' : ''}`
            }
          >
            <Icon className="h-4 w-4" />
            {!collapsed && <span>{label}</span>}
          </NavLink>
        ))}
      </nav>

      <div className="border-t border-white/10 p-3">
        <Button variant="ghost" className="w-full justify-start" onClick={() => void logout()}>
          <LogOut className="mr-2 h-4 w-4" />
          {!collapsed && 'Logout'}
        </Button>
      </div>
    </aside>
  );
};

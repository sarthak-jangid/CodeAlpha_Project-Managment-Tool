import { FolderKanban, LayoutGrid, LogOut, PanelLeftClose, PanelLeftOpen, Settings, UserCircle2 } from 'lucide-react';
import { useEffect, useState } from 'react';
import { NavLink } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Button } from '../common/Button';
import { useOptionalSidebar } from '../../context/SidebarContext';
import { Avatar } from '../common/Avatar';

const links = [
  { to: '/dashboard', label: 'Dashboard', icon: LayoutGrid },
  { to: '/projects', label: 'Projects', icon: FolderKanban },
  { to: '/profile', label: 'Profile', icon: UserCircle2 },
  { to: '/settings', label: 'Settings', icon: Settings },
];

export const Sidebar = ({ collapsed = false, onToggle = () => {} }: { collapsed?: boolean; onToggle?: () => void }) => {
  const sidebar = useOptionalSidebar();
  const isCollapsed = sidebar?.collapsed ?? collapsed;
  const toggleSidebar = sidebar?.toggleCollapsed ?? onToggle;
  const mobileOpen = sidebar?.mobileOpen ?? false;
  const closeMobile = sidebar?.closeMobile ?? (() => {});
  const { logout, user } = useAuth();
  const [isDesktop, setIsDesktop] = useState(false);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const media = window.matchMedia('(min-width: 1024px)');
    const update = () => setIsDesktop(media.matches);
    update();
    media.addEventListener('change', update);
    return () => media.removeEventListener('change', update);
  }, []);

  const effectiveCollapsed = isDesktop ? false : isCollapsed;

  const renderNavItem = ({ to, label, icon: Icon }: typeof links[number]) => {
    const showLabel = !effectiveCollapsed;

    return (
      <NavLink
        key={to}
        to={to}
        className={({ isActive }) =>
          `group mb-3 flex items-center gap-3 rounded-3xl px-3 py-3 text-sm font-medium transition-all duration-200 ${
            isActive
              ? 'bg-sky-500/15 text-sky-100 shadow-[0_10px_30px_rgba(59,130,246,0.14)] border-l-4 border-sky-400'
              : 'text-slate-300 hover:bg-white/5 hover:text-white'
          } ${effectiveCollapsed ? 'justify-center' : 'pr-4'}`
        }
        onClick={closeMobile}
      >
        {({ isActive }) => (
          <>
            <span
              className={`flex h-11 w-11 items-center justify-center rounded-2xl ${
                isActive
                  ? 'bg-slate-900/95 text-sky-300 shadow-sm shadow-sky-500/20'
                  : 'bg-slate-900/90 text-slate-300 group-hover:bg-slate-900/80 group-hover:text-slate-100'
              } transition-all duration-200`}
            >
              <Icon className="h-5 w-5" />
            </span>
            <span className={`${showLabel ? 'inline' : 'hidden lg:inline'} transition-all duration-200`}>
              {label}
            </span>
          </>
        )}
      </NavLink>
    );
  };

  return (
    <>
      <aside
        className={`hidden sm:flex h-full flex-col border-r border-white/10 bg-slate-950/95 backdrop-blur-xl transition-all duration-300 ${
          effectiveCollapsed ? 'w-20' : 'w-[220px]'
        }`}
      >
        <div className="flex h-full flex-col justify-between">
          <div className="space-y-4 px-4 py-3">
            <div className="flex items-center justify-between gap-3">
             
              <button
                onClick={toggleSidebar}
                className="hidden h-10 w-10 items-center justify-center rounded-2xl border border-white/10 bg-white/5 text-slate-300 transition-colors duration-200 hover:border-sky-400/30 hover:bg-white/10 hover:text-white lg:hidden"
                aria-label={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
              >
                {isCollapsed ? <PanelLeftOpen className="h-4 w-4" /> : <PanelLeftClose className="h-4 w-4" />}
              </button>
            </div>

            <nav className="mt-4 flex flex-col gap-3">{links.map((link) => renderNavItem(link))}</nav>
          </div>

          <div className="px-4 pb-4">
            <div className="flex items-center justify-between rounded-3xl border border-white/10 bg-slate-900/85 p-3">
              <div className="flex items-center gap-3">
                <Avatar name={user?.name ?? 'User'} size="sm" />
                <div className={`flex flex-col ${isCollapsed ? 'hidden lg:flex' : 'flex'}`}>
                  <div className="flex items-center gap-2">
                    <p className="text-sm font-semibold text-slate-100">{user?.name ?? 'Guest'}</p>
                    <span className="h-2 w-2 rounded-full bg-emerald-400 ring-1 ring-white/10" />
                  </div>
                  <p className="text-xs text-slate-500">Online</p>
                </div>
              </div>
              <Button
                variant="ghost"
                className="h-10 rounded-2xl px-3 text-sm"
                onClick={() => void logout()}
              >
                <LogOut className="h-4 w-4 text-slate-300 transition-colors duration-200 hover:text-white" />
              </Button>
            </div>
          </div>
        </div>
      </aside>

      <div
        className={`fixed inset-0 z-40 bg-slate-950/60 backdrop-blur-sm transition-opacity duration-300 sm:hidden ${
          mobileOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
        onClick={closeMobile}
      />
      <aside
        className={`fixed inset-y-0 left-0 z-50 flex w-72 flex-col bg-slate-950/95 shadow-2xl shadow-slate-950/40 backdrop-blur-xl transition-transform duration-300 sm:hidden ${
          mobileOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex h-full flex-col justify-between px-4 py-5">
          <div>
            <div className="flex items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-3xl bg-sky-500/10 text-sky-300 ring-1 ring-white/10">
                  P
                </div>
                <div>
                  <p className="text-sm font-semibold text-slate-100">ProjectFlow</p>
                  <p className="text-xs uppercase tracking-[0.24em] text-slate-500">Workspace</p>
                </div>
              </div>
              <button
                onClick={closeMobile}
                className="grid h-10 w-10 place-items-center rounded-2xl border border-white/10 bg-white/5 text-slate-300 transition-colors duration-200 hover:border-sky-400/30 hover:bg-white/10 hover:text-white"
                aria-label="Close sidebar"
              >
                <PanelLeftClose className="h-4 w-4" />
              </button>
            </div>
            <nav className="mt-6 flex flex-col gap-2">{links.map((link) => renderNavItem(link))}</nav>
          </div>
          <div className="space-y-3">
            <div className="rounded-3xl border border-white/10 bg-slate-900/70 p-4">
              <div className="flex items-center gap-3">
                <Avatar name={user?.name ?? 'User'} size="sm" />
                <div>
                  <p className="text-sm font-medium text-slate-100">{user?.name ?? 'Guest'}</p>
                  <p className="text-xs text-slate-500">Signed in</p>
                </div>
              </div>
            </div>
            <Button variant="ghost" className="w-full justify-center" onClick={() => void logout()}>
              <LogOut className="mr-2 h-4 w-4" />
              Logout
            </Button>
          </div>
        </div>
      </aside>
    </>
  );
};

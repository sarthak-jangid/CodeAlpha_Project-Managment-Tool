import { Bell, ChevronDown, Menu, Search, Settings, UserCircle2 } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useSidebar } from '../../context/SidebarContext';
import { Input } from '../common/Input';

export const Navbar = () => {
  const { user, logout } = useAuth();
  const { openMobile } = useSidebar();
  const navigate = useNavigate();
  const [profileOpen, setProfileOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const handleClick = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setProfileOpen(false);
      }
    };
    window.addEventListener('mousedown', handleClick);
    return () => window.removeEventListener('mousedown', handleClick);
  }, []);

  return (
    <header className="sticky top-0 z-30 border-b border-white/10 bg-slate-950/80 backdrop-blur-xl">
      <div className="relative w-full px-4 py-3 sm:px-6 lg:px-7">
        <div className="flex mx-auto items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={openMobile}
              className="inline-flex h-10 w-10 items-center justify-center rounded-2xl border border-white/10 bg-white/5 text-slate-300 transition-colors hover:bg-white/10 hover:text-white lg:hidden"
              aria-label="Open navigation"
            >
              <Menu className="h-5 w-5" />
            </button>

            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-sky-500/10 text-sky-300 ring-1 ring-white/10">
              P
            </div>

            <div className="hidden flex-col gap-0.5 lg:flex">
              <p className="truncate text-sm font-semibold text-slate-100">ProjectFlow</p>
              <p className="truncate text-xs text-slate-400">Workspace overview</p>
            </div>
          </div>

          <div className="pointer-events-none absolute inset-x-0 top-1/2 hidden -translate-y-1/2 items-center justify-center lg:flex">
            <div className="w-full max-w-2xl">
              <div className="relative">
                <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                <Input placeholder="Search projects or tasks" className="w-full pl-11 pr-4" />
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              type="button"
              className="relative inline-flex h-11 w-11 items-center justify-center rounded-2xl border border-white/10 bg-white/5 text-slate-300 transition-all duration-200 hover:border-sky-400/40 hover:bg-white/10 hover:text-white"
              aria-label="Notifications"
            >
              <Bell className="h-5 w-5" />
              <span className="absolute -right-0.5 top-0.5 inline-flex h-2.5 w-2.5 rounded-full bg-rose-500 ring-2 ring-slate-950" />
            </button>

            <button
              type="button"
              className="inline-flex h-11 w-11 items-center justify-center rounded-2xl border border-white/10 bg-white/5 text-slate-300 transition-all duration-200 hover:border-sky-400/40 hover:bg-white/10 hover:text-white"
              aria-label="Settings"
              onClick={() => navigate('/settings')}
            >
              <Settings className="h-5 w-5" />
            </button>

            <div ref={dropdownRef} className="relative">
              <button
                type="button"
                onClick={() => setProfileOpen((open) => !open)}
                className="inline-flex h-11 min-w-[120px] items-center gap-2 rounded-2xl border border-white/10 bg-white/5 px-3 text-sm text-slate-200 transition-all duration-200 hover:border-sky-400/40 hover:bg-white/10 hover:text-white"
              >
                <UserCircle2 className="h-5 w-5" />
                <span className="hidden sm:inline truncate">{user?.name ?? 'You'}</span>
                <ChevronDown className="h-4 w-4 text-slate-400" />
              </button>
              {profileOpen ? (
                <div className="absolute right-0 top-full z-20 mt-3 w-48 overflow-hidden rounded-[28px] border border-white/10 bg-slate-950/95 p-2 shadow-[0_24px_64px_rgba(0,0,0,0.32)] backdrop-blur-xl">
                  <Link
                    to="/profile"
                    onClick={() => setProfileOpen(false)}
                    className="block rounded-2xl px-4 py-3 text-sm text-slate-100 transition-all duration-200 hover:bg-white/5"
                  >
                    My profile
                  </Link>
                  <button
                    type="button"
                    onClick={() => {
                      setProfileOpen(false);
                      void logout();
                    }}
                    className="mt-1 block w-full rounded-2xl px-4 py-3 text-left text-sm text-slate-100 transition-all duration-200 hover:bg-white/5"
                  >
                    Sign out
                  </button>
                </div>
              ) : null}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

import { useNavigate } from 'react-router-dom';
import { ShieldCheck, Sparkles, UserCircle2, Users } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import { getProjects } from '../api/project';
import { getTasksByProject } from '../api/task';
import { useAuth } from '../context/AuthContext';
import { Button } from '../components/common/Button';
import { Card } from '../components/common/Card';
import { EmptyState } from '../components/common/EmptyState';
import { Loader } from '../components/common/Loader';
import { Navbar } from '../components/layout/Navbar';
import { Sidebar } from '../components/layout/Sidebar';
import type { Project } from '../types';
import { getApiErrorMessage } from '../utils/error';

const ProfilePage = () => {
  const navigate = useNavigate();
  const { user, loading } = useAuth();
  const [projects, setProjects] = useState<Project[]>([]);
  const [loadingProjects, setLoadingProjects] = useState(true);
  const [error, setError] = useState('');
  const [assignedTasks, setAssignedTasks] = useState(0);
  const [completedTasks, setCompletedTasks] = useState(0);

  useEffect(() => {
    const fetchProfileData = async () => {
      if (!user) return;
      try {
        setLoadingProjects(true);
        setError('');
        const response = await getProjects();
        const nextProjects = response.projects ?? [];
        setProjects(nextProjects);

        const tasksList = await Promise.all(
          nextProjects.map(async (project) => {
            const response = await getTasksByProject(project._id);
            return response.tasks ?? [];
          }),
        );

        const allTasks = tasksList.flat();
        const assigned = allTasks.filter((task) => {
          if (!task.assignedTo) return false;
          if (typeof task.assignedTo === 'string') {
            return task.assignedTo === user._id;
          }
          return task.assignedTo._id === user._id;
        }).length;

        const completed = allTasks.filter((task) => task.status === 'Done').length;

        setAssignedTasks(assigned);
        setCompletedTasks(completed);
      } catch (err: unknown) {
        setError(getApiErrorMessage(err));
      } finally {
        setLoadingProjects(false);
      }
    };

    void fetchProfileData();
  }, [user]);

  const ownedProjects = useMemo(
    () => projects.filter((project) => String(project.owner) === String(user?._id)),
    [projects, user],
  );

  const joinedProjects = useMemo(
    () => projects.filter((project) => String(project.owner) !== String(user?._id)),
    [projects, user],
  );

  if (loading || loadingProjects) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-950 text-slate-300">
        <Loader label="Loading profile..." />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top_left,_rgba(59,130,246,0.16),_transparent_30%),linear-gradient(135deg,_#020617_0%,_#0f172a_50%,_#111827_100%)] text-slate-100">
      <div className="flex min-h-screen flex-col">
        <Navbar />
        <div className="flex flex-1 overflow-hidden">
          <Sidebar collapsed={false} onToggle={() => undefined} />
          <main className="flex-1 overflow-y-auto px-4 py-6 sm:px-6 lg:px-8">
            <div className="mx-auto flex max-w-7xl flex-col gap-6">
              <Card className="p-6 sm:p-8">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                  <div className="flex items-center gap-3">
                    <div className="flex h-14 w-14 items-center justify-center rounded-3xl bg-sky-500/15 text-sky-300">
                      <UserCircle2 className="h-7 w-7" />
                    </div>
                    <div>
                      <h1 className="text-2xl font-semibold text-slate-100">Profile</h1>
                      <p className="text-sm text-slate-400">Account details, projects, and assigned work.</p>
                    </div>
                  </div>
                  <Button variant="secondary" onClick={() => navigate('/settings')}>
                    Open Settings
                  </Button>
                </div>
              </Card>

              {error ? (
                <Card className="flex flex-col items-center justify-center gap-4 px-8 py-12 text-center">
                  <div className="rounded-2xl border border-white/10 bg-white/5 p-4 text-slate-300">
                    <ShieldCheck className="h-6 w-6" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-slate-100">Unable to load profile</h3>
                    <p className="mt-2 text-sm text-slate-400">{error}</p>
                  </div>
                </Card>
              ) : (
                <div className="grid gap-6 xl:grid-cols-[1.2fr_0.8fr]">
                  <div className="space-y-6">
                    <Card className="p-6">
                      <div className="space-y-4">
                        <div>
                          <p className="text-sm font-medium uppercase tracking-[0.2em] text-sky-400">Account Information</p>
                          <h2 className="mt-2 text-xl font-semibold text-slate-100">Personal details</h2>
                        </div>
                        <div className="grid gap-4 sm:grid-cols-2">
                          <div className="rounded-2xl border border-white/10 bg-slate-900/60 p-4">
                            <p className="text-sm text-slate-400">Name</p>
                            <p className="mt-1 text-lg font-medium text-slate-100">{user?.name ?? 'Unknown'}</p>
                          </div>
                          <div className="rounded-2xl border border-white/10 bg-slate-900/60 p-4">
                            <p className="text-sm text-slate-400">Email</p>
                            <p className="mt-1 text-lg font-medium text-slate-100">{user?.email ?? 'No email'}</p>
                          </div>
                          <div className="rounded-2xl border border-white/10 bg-slate-900/60 p-4">
                            <p className="text-sm text-slate-400">Username</p>
                            <p className="mt-1 text-lg font-medium text-slate-100">{user?.username ?? '—'}</p>
                          </div>
                          <div className="rounded-2xl border border-white/10 bg-slate-900/60 p-4">
                            <p className="text-sm text-slate-400">Member since</p>
                            <p className="mt-1 text-lg font-medium text-slate-100">
                              {user?.createdAt
                                ? new Date(user.createdAt).toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' })
                                : '—'}
                            </p>
                          </div>
                        </div>
                      </div>
                    </Card>

                    <Card className="p-6">
                      <div className="flex items-center gap-3 text-sm font-medium uppercase tracking-[0.2em] text-sky-400">
                        <Users className="h-4 w-4" />
                        Projects overview
                      </div>
                      <div className="mt-6 space-y-4">
                        <div className="grid gap-4 sm:grid-cols-2">
                          <div className="rounded-2xl border border-white/10 bg-slate-900/60 p-4">
                            <p className="text-sm text-slate-400">Projects Owned</p>
                            <p className="mt-1 text-2xl font-semibold text-slate-100">{ownedProjects.length}</p>
                          </div>
                          <div className="rounded-2xl border border-white/10 bg-slate-900/60 p-4">
                            <p className="text-sm text-slate-400">Projects Joined</p>
                            <p className="mt-1 text-2xl font-semibold text-slate-100">{joinedProjects.length}</p>
                          </div>
                        </div>
                        {ownedProjects.length + joinedProjects.length === 0 ? (
                          <EmptyState
                            title="No project memberships"
                            description="Create or join a project to see your work appear here."
                          />
                        ) : (
                          <div className="space-y-3">
                            {ownedProjects.length > 0 ? (
                              <div>
                                <p className="text-sm text-slate-400">Owned projects</p>
                                <div className="mt-3 space-y-2">
                                  {ownedProjects.slice(0, 3).map((project) => (
                                    <div key={project._id} className="rounded-2xl border border-white/10 bg-slate-900/60 p-4">
                                      <div className="flex items-center justify-between gap-3 text-sm text-slate-200">
                                        <span>{project.name}</span>
                                        <span className="text-slate-400">{project.status}</span>
                                      </div>
                                      <p className="mt-1 text-sm text-slate-400">{project.description || 'No description'}</p>
                                    </div>
                                  ))}
                                </div>
                              </div>
                            ) : null}
                            {joinedProjects.length > 0 ? (
                              <div>
                                <p className="text-sm text-slate-400">Joined projects</p>
                                <div className="mt-3 space-y-2">
                                  {joinedProjects.slice(0, 3).map((project) => (
                                    <div key={project._id} className="rounded-2xl border border-white/10 bg-slate-900/60 p-4">
                                      <div className="flex items-center justify-between gap-3 text-sm text-slate-200">
                                        <span>{project.name}</span>
                                        <span className="text-slate-400">{project.status}</span>
                                      </div>
                                      <p className="mt-1 text-sm text-slate-400">{project.description || 'No description'}</p>
                                    </div>
                                  ))}
                                </div>
                              </div>
                            ) : null}
                          </div>
                        )}
                      </div>
                    </Card>

                    <Card className="p-6">
                      <div className="flex items-center gap-3 text-sm font-medium uppercase tracking-[0.2em] text-sky-400">
                        <Sparkles className="h-4 w-4" />
                        Task summary
                      </div>
                      <div className="mt-6 grid gap-4 sm:grid-cols-2">
                        <div className="rounded-2xl border border-white/10 bg-slate-900/60 p-4">
                          <p className="text-sm text-slate-400">Assigned tasks</p>
                          <p className="mt-1 text-2xl font-semibold text-slate-100">{assignedTasks}</p>
                        </div>
                        <div className="rounded-2xl border border-white/10 bg-slate-900/60 p-4">
                          <p className="text-sm text-slate-400">Completed tasks</p>
                          <p className="mt-1 text-2xl font-semibold text-slate-100">{completedTasks}</p>
                        </div>
                      </div>
                    </Card>
                  </div>

                  <div className="space-y-6">
                    <Card className="p-6">
                      <div className="flex items-center gap-2 text-sm font-medium uppercase tracking-[0.2em] text-sky-400">
                        <ShieldCheck className="h-4 w-4" />
                        Security & access
                      </div>
                      <p className="mt-4 text-sm text-slate-400">
                        Your account details are derived from the authenticated session and the active workspace membership data.
                      </p>
                      <div className="mt-6 space-y-4">
                        <div className="rounded-2xl border border-white/10 bg-slate-900/60 p-4">
                          <p className="text-sm text-slate-400">Email verified</p>
                          <p className="mt-1 text-slate-100">{user?.email ? 'Yes' : 'Not available'}</p>
                        </div>
                        <div className="rounded-2xl border border-white/10 bg-slate-900/60 p-4">
                          <p className="text-sm text-slate-400">Project access</p>
                          <p className="mt-1 text-slate-100">{projects.length > 0 ? 'Active member' : 'No projects yet'}</p>
                        </div>
                      </div>
                    </Card>
                    <Card className="p-6">
                      <div className="flex items-center justify-between gap-3">
                        <div>
                          <p className="text-sm font-medium uppercase tracking-[0.2em] text-sky-400">Shortcut</p>
                          <h2 className="mt-2 text-xl font-semibold text-slate-100">Profile settings</h2>
                        </div>
                        <Button variant="primary" onClick={() => navigate('/settings')}>
                          Open
                        </Button>
                      </div>
                    </Card>
                  </div>
                </div>
              )}
            </div>
          </main>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;

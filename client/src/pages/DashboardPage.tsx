import { FolderPlus, Plus, RefreshCw } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createProject, getProjects, joinProject } from '../api/project';
import { getTasksByProject } from '../api/task';
import { useAuth } from '../context/AuthContext';
import { Button } from '../components/common/Button';
import { Card } from '../components/common/Card';
import { EmptyState } from '../components/common/EmptyState';
import { Loader } from '../components/common/Loader';
import { Navbar } from '../components/layout/Navbar';
import { Sidebar } from '../components/layout/Sidebar';
import { JoinProjectModal } from '../components/project/JoinProjectModal';
import { ProjectCard } from '../components/project/ProjectCard';
import { ProjectFormModal } from '../components/project/ProjectFormModal';
import type { Project } from '../types';

const DashboardPage = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [assignedTasks, setAssignedTasks] = useState(0);
  const [completedTasks, setCompletedTasks] = useState(0);
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isJoinOpen, setIsJoinOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const fetchDashboard = async () => {
    try {
      setLoading(true);
      setError('');
      const response = await getProjects();
      const nextProjects = response.projects ?? [];
      setProjects(nextProjects);

      const tasksPerProject = await Promise.all(
        nextProjects.map(async (project) => {
          const taskResponse = await getTasksByProject(project._id);
          return taskResponse.tasks ?? [];
        }),
      );

      const allTasks = tasksPerProject.flat();
      const assigned = allTasks.filter((task) => {
        if (!task.assignedTo) return false;
        if (typeof task.assignedTo === 'string') {
          return task.assignedTo === user?._id;
        }
        return task.assignedTo._id === user?._id;
      }).length;
      const completed = allTasks.filter((task) => task.status === 'Done').length;

      setAssignedTasks(assigned);
      setCompletedTasks(completed);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Unable to load dashboard data.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void fetchDashboard();
  }, [user?._id]);

  const recentProjects = useMemo(() => projects.slice(0, 5), [projects]);
  const activeProjects = useMemo(
    () => projects.filter((project) => project.status === 'active').length,
    [projects],
  );

  const handleCreate = async (payload: { name: string; description: string; status: Project['status'] }) => {
    try {
      setSubmitting(true);
      await createProject(payload);
      setIsCreateOpen(false);
      void fetchDashboard();
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Unable to create project.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleJoin = async (inviteCode: string) => {
    try {
      setSubmitting(true);
      await joinProject(inviteCode);
      setIsJoinOpen(false);
      void fetchDashboard();
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Unable to join project.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top_left,_rgba(59,130,246,0.16),_transparent_30%),linear-gradient(135deg,_#020617_0%,_#0f172a_50%,_#111827_100%)] text-slate-100">
      <div className="flex min-h-screen flex-col">
        <Navbar />
        <div className="flex flex-1 overflow-hidden">
          <Sidebar collapsed={false} onToggle={() => undefined} />
          <main className="flex-1 overflow-y-auto px-4 py-6 sm:px-6 lg:px-8">
            <div className="mx-auto flex max-w-7xl flex-col gap-6">
              <div className="flex flex-col gap-4 rounded-3xl border border-white/10 bg-slate-900/70 p-6 shadow-[0_18px_50px_rgba(2,8,23,0.28)] backdrop-blur-md sm:flex-row sm:items-end sm:justify-between">
                <div>
                  <p className="text-sm font-medium uppercase tracking-[0.2em] text-sky-400">Dashboard</p>
                  <h1 className="mt-2 text-3xl font-semibold text-slate-100 sm:text-4xl">Overview</h1>
                  <p className="mt-2 max-w-2xl text-sm leading-relaxed text-slate-400">
                    Track your most important projects and tasks from one central workspace.
                  </p>
                </div>
                <div className="flex flex-wrap gap-3">
                  <Button variant="secondary" onClick={() => setIsJoinOpen(true)}>
                    <FolderPlus className="mr-2 h-4 w-4" />
                    Join Project
                  </Button>
                  <Button variant="primary" onClick={() => setIsCreateOpen(true)}>
                    <Plus className="mr-2 h-4 w-4" />
                    New Project
                  </Button>
                </div>
              </div>

              {loading ? (
                <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
                  {Array.from({ length: 4 }).map((_, index) => (
                    <Card key={index} className="p-5">
                      <Loader label="Loading stats..." />
                    </Card>
                  ))}
                </div>
              ) : error ? (
                <Card className="flex flex-col items-center justify-center gap-4 px-8 py-12 text-center">
                  <div className="rounded-2xl border border-white/10 bg-white/5 p-4 text-slate-300">
                    <RefreshCw className="h-6 w-6" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-slate-100">Unable to load dashboard</h3>
                    <p className="mt-2 text-sm text-slate-400">{error}</p>
                  </div>
                  <Button variant="primary" onClick={() => void fetchDashboard()}>
                    Retry
                  </Button>
                </Card>
              ) : (
                <>
                  <Card className="grid gap-4 md:grid-cols-2 xl:grid-cols-4 p-4">
                    <div className="rounded-3xl border border-white/10 bg-slate-900/70 p-5">
                      <p className="text-sm text-slate-400">Total Projects</p>
                      <p className="mt-3 text-3xl font-semibold text-slate-100">{projects.length}</p>
                    </div>
                    <div className="rounded-3xl border border-white/10 bg-slate-900/70 p-5">
                      <p className="text-sm text-slate-400">Active Projects</p>
                      <p className="mt-3 text-3xl font-semibold text-slate-100">{activeProjects}</p>
                    </div>
                    <div className="rounded-3xl border border-white/10 bg-slate-900/70 p-5">
                      <p className="text-sm text-slate-400">My Assigned Tasks</p>
                      <p className="mt-3 text-3xl font-semibold text-slate-100">{assignedTasks}</p>
                    </div>
                    <div className="rounded-3xl border border-white/10 bg-slate-900/70 p-5">
                      <p className="text-sm text-slate-400">Completed Tasks</p>
                      <p className="mt-3 text-3xl font-semibold text-slate-100">{completedTasks}</p>
                    </div>
                  </Card>

                  <div className="grid gap-6 lg:grid-cols-[1.6fr_0.8fr]">
                    <Card className="p-6">
                      <div className="flex items-center justify-between gap-4">
                        <div>
                          <p className="text-sm font-medium uppercase tracking-[0.2em] text-sky-400">Recent Projects</p>
                          <h2 className="mt-2 text-2xl font-semibold text-slate-100">Latest workspaces</h2>
                        </div>
                        <Button variant="outline" onClick={() => navigate('/projects')}>
                          View all
                        </Button>
                      </div>
                      <div className="mt-6 grid gap-4 md:grid-cols-2">
                        {recentProjects.length > 0 ? (
                          recentProjects.map((project) => (
                            <ProjectCard
                              key={project._id}
                              project={project}
                              canManageProject={false}
                              onOpen={() => navigate(`/projects/${project._id}`)}
                              onEdit={() => undefined}
                              onDelete={() => undefined}
                              onCopyInvite={() => undefined}
                            />
                          ))
                        ) : (
                          <div className="col-span-full">
                            <EmptyState
                              title="No recent projects"
                              description="Create or join a project to see it appear here."
                            />
                          </div>
                        )}
                      </div>
                    </Card>

                    <div className="space-y-6">
                      <Card className="p-6">
                        <div>
                          <p className="text-sm font-medium uppercase tracking-[0.2em] text-sky-400">Recent Activity</p>
                          <h2 className="mt-2 text-2xl font-semibold text-slate-100">Project updates</h2>
                        </div>
                        <div className="mt-6 space-y-4">
                          {recentProjects.length > 0 ? (
                            recentProjects.map((project) => (
                              <div key={project._id} className="rounded-2xl border border-white/10 bg-slate-900/60 p-4">
                                <p className="text-sm text-slate-400">Status: {project.status}</p>
                                <p className="mt-1 text-base font-medium text-slate-100">{project.name}</p>
                              </div>
                            ))
                          ) : (
                            <EmptyState
                              title="No activity yet"
                              description="Create a project or join your team to begin tracking activity."
                            />
                          )}
                        </div>
                      </Card>
                      <Card className="p-6">
                        <div>
                          <p className="text-sm font-medium uppercase tracking-[0.2em] text-sky-400">Upcoming Deadlines</p>
                          <h2 className="mt-2 text-2xl font-semibold text-slate-100">Next due dates</h2>
                        </div>
                        <div className="mt-6 space-y-4">
                          <div className="rounded-2xl border border-white/10 bg-slate-900/60 p-4">
                            <p className="text-sm text-slate-400">No deadlines available</p>
                            <p className="mt-2 text-base font-medium text-slate-100">Tasks with due dates will appear here.</p>
                          </div>
                        </div>
                      </Card>
                    </div>
                  </div>
                </>
              )}
            </div>
          </main>
        </div>
      </div>

      <ProjectFormModal
        open={isCreateOpen}
        mode="create"
        loading={submitting}
        onClose={() => setIsCreateOpen(false)}
        onSubmit={handleCreate}
      />
      <JoinProjectModal
        open={isJoinOpen}
        loading={submitting}
        onClose={() => setIsJoinOpen(false)}
        onSubmit={handleJoin}
      />
    </div>
  );
};

export default DashboardPage;

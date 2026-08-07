import { FolderPlus, Plus, RefreshCw, Search as SearchIcon } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { createProject, deleteProject, getProjects, joinProject, updateProject } from '../api/project';
import { useAuth } from '../context/AuthContext';
import { Button } from '../components/common/Button';
import { Card } from '../components/common/Card';
import { EmptyState } from '../components/common/EmptyState';
import { Input } from '../components/common/Input';
import { Loader } from '../components/common/Loader';
import { Navbar } from '../components/layout/Navbar';
import { Sidebar } from '../components/layout/Sidebar';
import { DeleteProjectDialog } from '../components/project/DeleteProjectDialog';
import { JoinProjectModal } from '../components/project/JoinProjectModal';
import { ProjectCard } from '../components/project/ProjectCard';
import { ProjectFormModal } from '../components/project/ProjectFormModal';
import type { Project } from '../types';
import { getApiErrorMessage } from '../utils/error';

const ProjectsPage = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [search, setSearch] = useState(searchParams.get('search') ?? '');
  const [statusFilter, setStatusFilter] = useState<Project['status'] | 'all'>('all');
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [isJoinOpen, setIsJoinOpen] = useState(false);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const fetchProjects = async () => {
    try {
      setLoading(true);
      setError('');
      const response = await getProjects();
      setProjects(response.projects ?? []);
    } catch (err: unknown) {
      setError(getApiErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void fetchProjects();
  }, []);

  useEffect(() => {
    setSearch(searchParams.get('search') ?? '');
  }, [searchParams]);

  const filteredProjects = useMemo(() => {
    const term = search.toLowerCase();

    return projects.filter((project) => {
      const matchesText =
        project.name.toLowerCase().includes(term) ||
        project.description?.toLowerCase().includes(term);

      const matchesStatus = statusFilter === 'all' || project.status === statusFilter;

      return matchesText && matchesStatus;
    });
  }, [projects, search, statusFilter]);

  const handleCreate = async (payload: { name: string; description: string; status: Project['status'] }) => {
    try {
      setSubmitting(true);
      await createProject(payload);
      setIsCreateOpen(false);
      await fetchProjects();
    } catch (err: unknown) {
      setError(getApiErrorMessage(err));
    } finally {
      setSubmitting(false);
    }
  };

  const handleEdit = async (payload: { name: string; description: string; status: Project['status'] }) => {
    if (!selectedProject) return;
    try {
      setSubmitting(true);
      await updateProject(selectedProject._id, payload);
      setIsEditOpen(false);
      setSelectedProject(null);
      await fetchProjects();
    } catch (err: unknown) {
      setError(getApiErrorMessage(err));
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!selectedProject) return;
    try {
      setSubmitting(true);
      await deleteProject(selectedProject._id);
      setIsDeleteOpen(false);
      setSelectedProject(null);
      await fetchProjects();
    } catch (err: unknown) {
      setError(getApiErrorMessage(err));
    } finally {
      setSubmitting(false);
    }
  };

  const handleJoin = async (inviteCode: string) => {
    try {
      setSubmitting(true);
      await joinProject(inviteCode);
      setIsJoinOpen(false);
      await fetchProjects();
    } catch (err: unknown) {
      setError(getApiErrorMessage(err));
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
                  <p className="text-sm font-medium uppercase tracking-[0.2em] text-sky-400">Projects</p>
                  <h1 className="mt-2 text-3xl font-semibold text-slate-100 sm:text-4xl">Project Listing</h1>
                  <p className="mt-2 max-w-2xl text-sm leading-relaxed text-slate-400">
                    Search and filter active workspaces, then open the one you want to manage.
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

              <div className="grid gap-4 xl:grid-cols-[1.1fr_0.9fr]">
                <Card className="p-4">
                  <div className="relative">
                    <SearchIcon className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                    <Input
                      value={search}
                      onChange={(event) => {
                        const nextValue = event.target.value;
                        setSearch(nextValue);

                        const nextParams = new URLSearchParams(searchParams);
                        if (nextValue.trim()) {
                          nextParams.set('search', nextValue.trim());
                        } else {
                          nextParams.delete('search');
                        }
                        setSearchParams(nextParams);
                      }}
                      placeholder="Search projects by name or description"
                      className="pl-10"
                    />
                  </div>
                </Card>
                <Card className="p-4">
                  <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                      <p className="text-sm font-medium uppercase tracking-[0.2em] text-sky-400">Status</p>
                      <p className="mt-1 text-sm text-slate-400">Filter by current workflow stage.</p>
                    </div>
                    <select
                      value={statusFilter}
                      onChange={(event) => setStatusFilter(event.target.value as Project['status'] | 'all')}
                      className="mt-2 h-11 w-full rounded-2xl border border-white/10 bg-slate-900/70 px-4 text-sm text-slate-100 outline-none transition-all focus:border-sky-500 focus:ring-2 focus:ring-sky-500/20 sm:mt-0 sm:w-auto"
                    >
                      <option value="all">All statuses</option>
                      <option value="planning">Planning</option>
                      <option value="active">Active</option>
                      <option value="completed">Completed</option>
                      <option value="on_hold">On Hold</option>
                    </select>
                  </div>
                </Card>
              </div>

              {loading ? (
                <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                  {Array.from({ length: 6 }).map((_, index) => (
                    <Card key={index} className="p-5">
                      <Loader label="Loading projects..." />
                    </Card>
                  ))}
                </div>
              ) : error ? (
                <Card className="flex flex-col items-center justify-center gap-4 px-8 py-12 text-center">
                  <div className="rounded-2xl border border-white/10 bg-white/5 p-4 text-slate-300">
                    <RefreshCw className="h-6 w-6" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-slate-100">Something went wrong</h3>
                    <p className="mt-2 text-sm text-slate-400">{error}</p>
                  </div>
                  <Button variant="primary" onClick={() => void fetchProjects()}>
                    Retry
                  </Button>
                </Card>
              ) : filteredProjects.length === 0 ? (
                <EmptyState
                  title="No Projects Found"
                  description="Try changing your search or create a new project to get started."
                />
              ) : (
                <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                  {filteredProjects.map((project) => (
                    <ProjectCard
                      key={project._id}
                      project={project}
                      canManageProject={String(project.owner) === String(user?._id)}
                      onOpen={() => navigate(`/projects/${project._id}`)}
                      onEdit={() => {
                        setSelectedProject(project);
                        setIsEditOpen(true);
                      }}
                      onDelete={() => {
                        setSelectedProject(project);
                        setIsDeleteOpen(true);
                      }}
                      onCopyInvite={async () => {
                        if (!project.inviteCode) return;
                        try {
                          await navigator.clipboard.writeText(project.inviteCode);
                        } catch {
                          setError('Unable to copy invite code.');
                        }
                      }}
                    />
                  ))}
                </div>
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
      <ProjectFormModal
        open={isEditOpen}
        mode="edit"
        project={selectedProject}
        loading={submitting}
        onClose={() => {
          setIsEditOpen(false);
          setSelectedProject(null);
        }}
        onSubmit={handleEdit}
      />
      <DeleteProjectDialog
        open={isDeleteOpen}
        projectName={selectedProject?.name ?? ''}
        loading={submitting}
        onClose={() => {
          setIsDeleteOpen(false);
          setSelectedProject(null);
        }}
        onConfirm={handleDelete}
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

export default ProjectsPage;

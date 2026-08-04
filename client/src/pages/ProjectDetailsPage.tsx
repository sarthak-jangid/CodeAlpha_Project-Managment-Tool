import { Copy, RefreshCw, UserPlus, Users } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import { useParams } from 'react-router-dom';
import { getProjectById, getProjectMembers, regenerateInviteCode, removeProjectMember } from '../api/projectDetails';
import { Button } from '../components/common/Button';
import { Card } from '../components/common/Card';
import { EmptyState } from '../components/common/EmptyState';
import { Loader } from '../components/common/Loader';
import { Navbar } from '../components/layout/Navbar';
import { Sidebar } from '../components/layout/Sidebar';
import { InviteMemberModal } from '../components/project/InviteMemberModal';
import { MemberCard } from '../components/project/MemberCard';
import { useAuth } from '../context/AuthContext';
import type { Project, User } from '../types';

const ProjectDetailsPage = () => {
  const { projectId } = useParams();
  const { user } = useAuth();
  const [project, setProject] = useState<Project | null>(null);
  const [members, setMembers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [inviteOpen, setInviteOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [copied, setCopied] = useState(false);

  const fetchProject = async () => {
    if (!projectId) return;
    try {
      setLoading(true);
      setError('');
      const projectResponse = await getProjectById(projectId);
      const membersResponse = await getProjectMembers(projectId);
      setProject(projectResponse.project ?? null);
      setMembers(membersResponse.members ?? []);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Unable to load project details.';
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void fetchProject();
  }, [projectId]);

  const isOwner = useMemo(() => project?.owner === user?._id, [project, user]);

  const copyInviteCode = async () => {
    if (!project?.inviteCode) return;
    try {
      await navigator.clipboard.writeText(project.inviteCode);
      setCopied(true);
      setTimeout(() => setCopied(false), 1200);
    } catch {
      setError('Unable to copy invite code.');
    }
  };

  const handleRegenerateInviteCode = async () => {
    if (!projectId) return;
    try {
      setSubmitting(true);
      const response = await regenerateInviteCode(projectId);
      setProject((prev) => prev ? { ...prev, inviteCode: response.inviteCode } : prev);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Unable to regenerate invite code.';
      setError(message);
    } finally {
      setSubmitting(false);
    }
  };

  const handleRemoveMember = async (memberId: string) => {
    if (!projectId || !window.confirm('Remove this member from the project?')) return;
    try {
      setSubmitting(true);
      await removeProjectMember(projectId, memberId);
      await fetchProject();
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Unable to remove member.';
      setError(message);
    } finally {
      setSubmitting(false);
    }
  };

  const handleJoinInvite = async (inviteCode: string) => {
    if (!projectId) return;
    try {
      setSubmitting(true);
      await fetch(`/${projectId}/${inviteCode}`);
      setInviteOpen(false);
    } catch {
      setError('Unable to join project.');
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
              {loading ? (
                <div className="grid gap-4 lg:grid-cols-[1.5fr_0.8fr]">
                  <Card className="p-6"><Loader label="Loading project details..." /></Card>
                  <Card className="p-6"><Loader label="Loading members..." /></Card>
                </div>
              ) : error ? (
                <Card className="flex flex-col items-center justify-center gap-4 px-8 py-12 text-center">
                  <RefreshCw className="h-6 w-6 text-slate-300" />
                  <div>
                    <h3 className="text-lg font-semibold text-slate-100">Something went wrong</h3>
                    <p className="mt-2 text-sm text-slate-400">{error}</p>
                  </div>
                  <Button variant="primary" onClick={() => void fetchProject()}>Retry</Button>
                </Card>
              ) : project ? (
                <>
                  <Card className="overflow-hidden border-white/10 bg-slate-900/70 p-6 shadow-[0_18px_50px_rgba(2,8,23,0.28)] backdrop-blur-md">
                    <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                      <div className="space-y-3">
                        <div className="flex flex-wrap items-center gap-3">
                          <h1 className="text-3xl font-semibold text-slate-100">{project.name}</h1>
                          <span className="rounded-full border border-sky-400/20 bg-sky-500/10 px-3 py-1 text-sm text-sky-300">{project.status}</span>
                        </div>
                        <p className="max-w-2xl text-sm text-slate-400">{project.description || 'No project description yet.'}</p>
                        <div className="flex flex-wrap gap-4 text-sm text-slate-400">
                          <span>Created {project.createdAt ? new Date(project.createdAt).toLocaleDateString() : '—'}</span>
                          <span>Owner {project.owner}</span>
                        </div>
                      </div>

                      <div className="flex flex-wrap gap-3">
                        <Button variant="outline" onClick={copyInviteCode}>
                          <Copy className="mr-2 h-4 w-4" />
                          {copied ? 'Copied!' : 'Copy Invite Code'}
                        </Button>
                        {isOwner ? (
                          <>
                            <Button variant="secondary" onClick={() => void handleRegenerateInviteCode()} disabled={submitting}>
                              <RefreshCw className="mr-2 h-4 w-4" />
                              Regenerate
                            </Button>
                            <Button variant="primary" onClick={() => setInviteOpen(true)}>
                              <UserPlus className="mr-2 h-4 w-4" />
                              Invite Member
                            </Button>
                          </>
                        ) : null}
                      </div>
                    </div>

                    <div className="mt-6 grid gap-4 md:grid-cols-3">
                      <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                        <p className="text-sm text-slate-400">Tasks</p>
                        <p className="mt-2 text-2xl font-semibold text-slate-100">0</p>
                      </div>
                      <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                        <p className="text-sm text-slate-400">Members</p>
                        <p className="mt-2 text-2xl font-semibold text-slate-100">{members.length}</p>
                      </div>
                      <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                        <p className="text-sm text-slate-400">Comments</p>
                        <p className="mt-2 text-2xl font-semibold text-slate-100">0</p>
                      </div>
                    </div>
                  </Card>

                  <div className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
                    <Card className="p-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <h2 className="text-xl font-semibold text-slate-100">Project Information</h2>
                          <p className="mt-1 text-sm text-slate-400">Key project details.</p>
                        </div>
                      </div>
                      <div className="mt-6 space-y-4 text-sm text-slate-300">
                        <div className="rounded-2xl border border-white/10 bg-slate-900/60 p-4">
                          <p className="text-slate-400">Project Name</p>
                          <p className="mt-1 font-medium text-slate-100">{project.name}</p>
                        </div>
                        <div className="rounded-2xl border border-white/10 bg-slate-900/60 p-4">
                          <p className="text-slate-400">Description</p>
                          <p className="mt-1 font-medium text-slate-100">{project.description || 'No description available.'}</p>
                        </div>
                        <div className="rounded-2xl border border-white/10 bg-slate-900/60 p-4">
                          <p className="text-slate-400">Status</p>
                          <p className="mt-1 font-medium text-slate-100">{project.status}</p>
                        </div>
                        <div className="rounded-2xl border border-white/10 bg-slate-900/60 p-4">
                          <p className="text-slate-400">Owner</p>
                          <p className="mt-1 font-medium text-slate-100">{project.owner}</p>
                        </div>
                        <div className="rounded-2xl border border-white/10 bg-slate-900/60 p-4">
                          <p className="text-slate-400">Created</p>
                          <p className="mt-1 font-medium text-slate-100">{project.createdAt ? new Date(project.createdAt).toLocaleDateString() : '—'}</p>
                        </div>
                        <div className="rounded-2xl border border-white/10 bg-slate-900/60 p-4">
                          <p className="text-slate-400">Updated</p>
                          <p className="mt-1 font-medium text-slate-100">{project.updatedAt ? new Date(project.updatedAt).toLocaleDateString() : '—'}</p>
                        </div>
                      </div>
                    </Card>

                    <Card className="p-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <h2 className="text-xl font-semibold text-slate-100">Members</h2>
                          <p className="mt-1 text-sm text-slate-400">Project collaborators.</p>
                        </div>
                        <div className="rounded-2xl border border-white/10 bg-white/5 p-2">
                          <Users className="h-4 w-4 text-slate-300" />
                        </div>
                      </div>

                      {members.length === 0 ? (
                        <div className="mt-6"><EmptyState title="No members yet" description="Invite your first teammate to the project." /></div>
                      ) : (
                        <div className="mt-6 grid gap-3">
                          {members.map((member) => (
                            <MemberCard key={member._id} user={member} isOwner={member._id === project.owner} onRemove={isOwner && member._id !== project.owner && member._id !== user?._id ? () => void handleRemoveMember(member._id) : undefined} />
                          ))}
                        </div>
                      )}
                    </Card>
                  </div>
                </>
              ) : null}
            </div>
          </main>
        </div>
      </div>

      <InviteMemberModal open={inviteOpen} loading={submitting} onClose={() => setInviteOpen(false)} onSubmit={handleJoinInvite} />
    </div>
  );
};

export default ProjectDetailsPage;

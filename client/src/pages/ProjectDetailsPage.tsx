import {
  Calendar,
  CheckCircle2,
  Copy,
  Edit3,
  MessageSquare,
  RefreshCw,
  Trash2,
  UserPlus,
  Users,
  ListTodo,
} from 'lucide-react';
import { useEffect, useMemo, useRef, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { deleteProject, updateProject } from '../api/project';
import {
  getProjectById,
  getProjectMembers,
  regenerateInviteCode,
  removeProjectMember,
} from '../api/projectDetails';
import { getApiErrorMessage } from '../utils/error';
import { Badge } from '../components/common/Badge';
import { Button } from '../components/common/Button';
import { Card } from '../components/common/Card';
import { EmptyState } from '../components/common/EmptyState';
import { Navbar } from '../components/layout/Navbar';
import { Sidebar } from '../components/layout/Sidebar';
import { DeleteProjectDialog } from '../components/project/DeleteProjectDialog';
import { InviteMemberModal } from '../components/project/InviteMemberModal';
import { MemberCard } from '../components/project/MemberCard';
import { ProjectFormModal } from '../components/project/ProjectFormModal';
import { RemoveMemberDialog } from '../components/project/RemoveMemberDialog';
import { TaskBoard } from '../components/task/TaskBoard';
import { CommentInput } from '../components/comment/CommentInput';
import { CommentList } from '../components/comment/CommentList';
import { DeleteCommentDialog } from '../components/comment/DeleteCommentDialog';
import { useAuth } from '../context/AuthContext';
import { createComment, deleteComment, getCommentsByProject, updateComment } from '../api/comment';
import type { Comment, Project, User } from '../types';

type Toast = {
  type: 'success' | 'error';
  message: string;
};

const statusConfig: Record<
  Project['status'],
  { label: string; variant: 'planning' | 'active' | 'completed' | 'on_hold' }
> = {
  planning: { label: 'Planning', variant: 'planning' },
  active: { label: 'Active', variant: 'active' },
  completed: { label: 'Completed', variant: 'completed' },
  on_hold: { label: 'On Hold', variant: 'on_hold' },
};

const ProjectDetailsSkeleton = () => (
  <>
    <Card className="animate-pulse p-6">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
        <div className="space-y-3">
          <div className="h-9 w-64 rounded-xl bg-white/10" />
          <div className="h-4 w-full max-w-xl rounded-lg bg-white/5" />
          <div className="h-4 w-48 rounded-lg bg-white/5" />
        </div>
        <div className="flex gap-3">
          <div className="h-10 w-32 rounded-xl bg-white/10" />
          <div className="h-10 w-32 rounded-xl bg-white/10" />
        </div>
      </div>
      <div className="mt-6 grid gap-4 md:grid-cols-3">
        {Array.from({ length: 3 }).map((_, index) => (
          <div key={index} className="h-24 rounded-2xl bg-white/5" />
        ))}
      </div>
      <div className="mt-6 h-28 rounded-2xl bg-white/5" />
    </Card>

    <div className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
      <Card className="animate-pulse p-6">
        <div className="h-6 w-40 rounded-lg bg-white/10" />
        <div className="mt-6 space-y-4">
          {Array.from({ length: 6 }).map((_, index) => (
            <div key={index} className="h-16 rounded-2xl bg-white/5" />
          ))}
        </div>
      </Card>
      <Card className="animate-pulse p-6">
        <div className="h-6 w-32 rounded-lg bg-white/10" />
        <div className="mt-6 space-y-3">
          {Array.from({ length: 3 }).map((_, index) => (
            <div key={index} className="h-24 rounded-2xl bg-white/5" />
          ))}
        </div>
      </Card>
    </div>
  </>
);

const ProjectDetailsPage = () => {
  const { projectId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [project, setProject] = useState<Project | null>(null);
  const [members, setMembers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [copied, setCopied] = useState(false);
  const [toast, setToast] = useState<Toast | null>(null);

  const [inviteOpen, setInviteOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [removeMemberOpen, setRemoveMemberOpen] = useState(false);
  const [memberToRemove, setMemberToRemove] = useState<User | null>(null);
  const [taskCount, setTaskCount] = useState(0);
  const [comments, setComments] = useState<Comment[]>([]);
  const [commentsLoading, setCommentsLoading] = useState(true);
  const [commentsError, setCommentsError] = useState('');
  const [commentSubmitting, setCommentSubmitting] = useState(false);
  const [commentDraft, setCommentDraft] = useState('');
  const [editingCommentId, setEditingCommentId] = useState<string | null>(null);
  const [editingMessage, setEditingMessage] = useState('');
  const [deleteCommentId, setDeleteCommentId] = useState<string | null>(null);
  const pageTopRef = useRef<HTMLDivElement | null>(null);
  const mainRef = useRef<HTMLDivElement | null>(null);
  const commentsEndRef = useRef<HTMLDivElement | null>(null);
  const toastTimerRef = useRef<number | null>(null);

  useEffect(() => {
    return () => {
      if (toastTimerRef.current) {
        window.clearTimeout(toastTimerRef.current);
      }
    };
  }, []);

  const showToast = (type: Toast['type'], message: string) => {
    if (toastTimerRef.current) {
      window.clearTimeout(toastTimerRef.current);
    }

    setToast({ type, message });
    toastTimerRef.current = window.setTimeout(() => setToast(null), 3200);
  };

  const fetchProject = async () => {
    if (!projectId) return;
    try {
      setLoading(true);
      setError('');
      const [projectResponse, membersResponse] = await Promise.all([
        getProjectById(projectId),
        getProjectMembers(projectId),
      ]);
      setProject(projectResponse.project ?? null);
      setMembers(membersResponse.members ?? []);
    } catch (err: unknown) {
      const message = getApiErrorMessage(err);
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void fetchProject();
  }, [projectId]);

  useEffect(() => {
    mainRef.current?.scrollTo({ top: 0, behavior: 'smooth' });
  }, [projectId]);

  const isOwner = useMemo(
    () => String(project?.owner) === String(user?._id),
    [project, user],
  );

  const ownerUser = useMemo(
    () => members.find((member) => String(member._id) === String(project?.owner)),
    [members, project],
  );

  const status = project ? statusConfig[project.status] ?? statusConfig.planning : statusConfig.planning;

  const copyInviteCode = async () => {
    if (!project?.inviteCode) return;
    try {
      await navigator.clipboard.writeText(project.inviteCode);
      setCopied(true);
      showToast('success', 'Invite code copied to clipboard.');
      setTimeout(() => setCopied(false), 1500);
    } catch {
      showToast('error', 'Unable to copy invite code.');
    }
  };

  const handleRegenerateInviteCode = async () => {
    if (!projectId) return;
    try {
      setSubmitting(true);
      const response = await regenerateInviteCode(projectId);
      setProject((prev) => (prev ? { ...prev, inviteCode: response.inviteCode } : prev));
      showToast('success', 'Invite code regenerated successfully.');
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Unable to regenerate invite code.';
      showToast('error', message);
    } finally {
      setSubmitting(false);
    }
  };

  const handleEditProject = async (payload: {
    name: string;
    description: string;
    status: Project['status'];
  }) => {
    if (!projectId) return;
    try {
      setSubmitting(true);
      await updateProject(projectId, payload);
      setEditOpen(false);
      await fetchProject();
      showToast('success', 'Project updated successfully.');
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Unable to update project.';
      showToast('error', message);
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteProject = async () => {
    if (!projectId) return;
    try {
      setSubmitting(true);
      await deleteProject(projectId);
      setDeleteOpen(false);
      navigate('/dashboard');
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Unable to delete project.';
      showToast('error', message);
    } finally {
      setSubmitting(false);
    }
  };

  const openRemoveMemberDialog = (member: User) => {
    setMemberToRemove(member);
    setRemoveMemberOpen(true);
  };

  const fetchComments = async () => {
    if (!project?._id) return;
    try {
      setCommentsLoading(true);
      setCommentsError('');
      const response = await getCommentsByProject(project._id);
      setComments(response.comments ?? []);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Unable to load comments.';
      setCommentsError(message);
    } finally {
      setCommentsLoading(false);
    }
  };

  useEffect(() => {
    void fetchComments();
  }, [project?._id]);

  const handleCreateComment = async (message: string) => {
    if (!project?._id) return;
    try {
      setCommentSubmitting(true);
      await createComment(project._id, { message });
      setCommentDraft('');
      await fetchComments();
      showToast('success', 'Comment sent.');
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Unable to create comment.';
      showToast('error', message);
    } finally {
      setCommentSubmitting(false);
    }
  };

  const handleEditComment = async (comment: Comment) => {
    setEditingCommentId(comment._id);
    setEditingMessage(comment.message);
  };

  const handleSaveEdit = async (message: string) => {
    if (!editingCommentId) return;
    try {
      setCommentSubmitting(true);
      await updateComment(editingCommentId, { message });
      setEditingCommentId(null);
      setEditingMessage('');
      await fetchComments();
      showToast('success', 'Comment updated.');
    } catch (err: unknown) {
      const messageText = err instanceof Error ? err.message : 'Unable to update comment.';
      showToast('error', messageText);
    } finally {
      setCommentSubmitting(false);
    }
  };

  const handleDeleteComment = async () => {
    if (!deleteCommentId) return;
    try {
      setCommentSubmitting(true);
      await deleteComment(deleteCommentId);
      setDeleteCommentId(null);
      await fetchComments();
      showToast('success', 'Comment deleted.');
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Unable to delete comment.';
      showToast('error', message);
    } finally {
      setCommentSubmitting(false);
    }
  };

  const handleRemoveMember = async () => {
    if (!projectId || !memberToRemove) return;
    try {
      setSubmitting(true);
      await removeProjectMember(projectId, memberToRemove._id);
      setRemoveMemberOpen(false);
      setMemberToRemove(null);
      await fetchProject();
      showToast('success', 'Member removed successfully.');
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Unable to remove member.';
      showToast('error', message);
    } finally {
      setSubmitting(false);
    }
  };

  const canRemoveMember = (member: User) => {
    if (!isOwner || !project) return false;
    if (String(member._id) === String(project.owner)) return false;
    if (String(member._id) === String(user?._id)) return false;
    return true;
  };

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top_left,_rgba(59,130,246,0.16),_transparent_30%),linear-gradient(135deg,_#020617_0%,_#0f172a_50%,_#111827_100%)] text-slate-100">
      <div className="flex min-h-screen flex-col">
        <Navbar />
        <div className="flex flex-1 overflow-hidden">
          <Sidebar collapsed={false} onToggle={() => undefined} />
          <main ref={mainRef} className="flex-1 overflow-y-auto px-4 py-6 sm:px-6 lg:px-8">
            <div className="mx-auto flex max-w-7xl flex-col gap-6">
              {loading ? (
                <ProjectDetailsSkeleton />
              ) : error ? (
                <Card className="flex animate-[fadeIn_220ms_ease-out] flex-col items-center justify-center gap-4 px-8 py-12 text-center">
                  <div className="rounded-2xl border border-white/10 bg-white/5 p-4 text-slate-300">
                    <RefreshCw className="h-6 w-6" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-slate-100">Something went wrong</h3>
                    <p className="mt-2 text-sm text-slate-400">{error}</p>
                  </div>
                  <Button variant="primary" onClick={() => void fetchProject()}>
                    Retry
                  </Button>
                </Card>
              ) : project ? (
                <div className="animate-[fadeIn_220ms_ease-out] space-y-6">
                  <Card className="overflow-hidden border-white/10 bg-slate-900/70 p-6 shadow-[0_18px_50px_rgba(2,8,23,0.28)] backdrop-blur-md">
                    <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
                      <div className="space-y-4">
                        <div className="flex flex-wrap items-center gap-3">
                          <h1 className="text-3xl font-semibold text-slate-100 sm:text-4xl">{project.name}</h1>
                          <Badge variant={status.variant}>{status.label}</Badge>
                        </div>
                        <p className="max-w-2xl text-sm leading-relaxed text-slate-400">
                          {project.description || 'No project description yet.'}
                        </p>
                        <div className="flex flex-wrap gap-4 text-sm text-slate-400">
                          <span className="inline-flex items-center gap-2">
                            <Calendar className="h-4 w-4 text-slate-500" />
                            Created{' '}
                            {project.createdAt
                              ? new Date(project.createdAt).toLocaleDateString(undefined, {
                                  year: 'numeric',
                                  month: 'short',
                                  day: 'numeric',
                                })
                              : '—'}
                          </span>
                          <span>
                            Owner{' '}
                            <span className="font-medium text-slate-200">
                              {ownerUser?.name ?? 'Unknown'}
                            </span>
                          </span>
                        </div>
                      </div>

                      <div className="flex flex-wrap gap-3">
                        <Button variant="outline" onClick={() => void copyInviteCode()}>
                          <Copy className="mr-2 h-4 w-4" />
                          {copied ? 'Copied!' : 'Copy Invite Code'}
                        </Button>
                        {isOwner ? (
                          <>
                            <Button
                              variant="secondary"
                              onClick={() => void handleRegenerateInviteCode()}
                              disabled={submitting}
                            >
                              <RefreshCw className="mr-2 h-4 w-4" />
                              Regenerate
                            </Button>
                            <Button variant="outline" onClick={() => setEditOpen(true)}>
                              <Edit3 className="mr-2 h-4 w-4" />
                              Edit Project
                            </Button>
                            <Button variant="danger" onClick={() => setDeleteOpen(true)}>
                              <Trash2 className="mr-2 h-4 w-4" />
                              Delete Project
                            </Button>
                            <Button variant="primary" onClick={() => setInviteOpen(true)}>
                              <UserPlus className="mr-2 h-4 w-4" />
                              Invite Member
                            </Button>
                          </>
                        ) : null}
                      </div>
                    </div>

                    <div className="mt-6 grid gap-4 sm:grid-cols-3">
                      <div className="rounded-2xl border border-white/10 bg-white/5 p-4 transition-all duration-200 hover:border-sky-500/20">
                        <div className="flex items-center gap-2 text-sm text-slate-400">
                          <ListTodo className="h-4 w-4" />
                          Tasks
                        </div>
                        <p className="mt-2 text-2xl font-semibold text-slate-100">{taskCount}</p>
                      </div>
                      <div className="rounded-2xl border border-white/10 bg-white/5 p-4 transition-all duration-200 hover:border-sky-500/20">
                        <div className="flex items-center gap-2 text-sm text-slate-400">
                          <Users className="h-4 w-4" />
                          Members
                        </div>
                        <p className="mt-2 text-2xl font-semibold text-slate-100">{members.length}</p>
                      </div>
                      <div className="rounded-2xl border border-white/10 bg-white/5 p-4 transition-all duration-200 hover:border-sky-500/20">
                        <div className="flex items-center gap-2 text-sm text-slate-400">
                          <MessageSquare className="h-4 w-4" />
                          Comments
                        </div>
                        <p className="mt-2 text-2xl font-semibold text-slate-100">{comments.length}</p>
                      </div>
                    </div>

                    {project.inviteCode ? (
                      <div className="relative mt-6 overflow-hidden rounded-2xl border border-sky-400/20 bg-gradient-to-br from-sky-500/10 via-slate-900/40 to-slate-900/60 p-5">
                        <p className="text-xs font-medium uppercase tracking-[0.2em] text-sky-400">
                          Project Invite Code
                        </p>
                        <div className="mt-3 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                          <p className="font-mono text-2xl font-semibold tracking-[0.15em] text-sky-200 sm:text-3xl">
                            {project.inviteCode}
                          </p>
                          <div className="flex flex-wrap gap-2">
                            <Button variant="outline" size="sm" onClick={() => void copyInviteCode()}>
                              <Copy className="mr-2 h-4 w-4" />
                              {copied ? 'Copied!' : 'Copy'}
                            </Button>
                            {isOwner ? (
                              <Button
                                variant="secondary"
                                size="sm"
                                onClick={() => void handleRegenerateInviteCode()}
                                disabled={submitting}
                              >
                                <RefreshCw className="mr-2 h-4 w-4" />
                                Regenerate
                              </Button>
                            ) : null}
                          </div>
                        </div>
                        {copied ? (
                          <div className="absolute right-4 top-4 flex items-center gap-1 rounded-full border border-emerald-400/30 bg-emerald-500/10 px-3 py-1 text-xs text-emerald-300">
                            <CheckCircle2 className="h-3.5 w-3.5" />
                            Copied!
                          </div>
                        ) : null}
                      </div>
                    ) : null}
                  </Card>

                  <div className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
                    <Card className="p-6">
                      <div>
                        <h2 className="text-xl font-semibold text-slate-100">Project Information</h2>
                        <p className="mt-1 text-sm text-slate-400">Key project details and metadata.</p>
                      </div>
                      <div className="mt-6 grid gap-4 sm:grid-cols-2">
                        <div className="rounded-2xl border border-white/10 bg-slate-900/60 p-4">
                          <p className="text-sm text-slate-400">Project Name</p>
                          <p className="mt-1 font-medium text-slate-100">{project.name}</p>
                        </div>
                        <div className="rounded-2xl border border-white/10 bg-slate-900/60 p-4">
                          <p className="text-sm text-slate-400">Status</p>
                          <p className="mt-1 font-medium capitalize text-slate-100">
                            {status.label}
                          </p>
                        </div>
                        <div className="rounded-2xl border border-white/10 bg-slate-900/60 p-4 sm:col-span-2">
                          <p className="text-sm text-slate-400">Description</p>
                          <p className="mt-1 font-medium text-slate-100">
                            {project.description || 'No description available.'}
                          </p>
                        </div>
                        <div className="rounded-2xl border border-white/10 bg-slate-900/60 p-4">
                          <p className="text-sm text-slate-400">Owner</p>
                          <p className="mt-1 font-medium text-slate-100">
                            {ownerUser?.name ?? 'Unknown'}
                          </p>
                          {ownerUser?.email ? (
                            <p className="mt-1 text-sm text-slate-500">{ownerUser.email}</p>
                          ) : null}
                        </div>
                        <div className="rounded-2xl border border-white/10 bg-slate-900/60 p-4">
                          <p className="text-sm text-slate-400">Created</p>
                          <p className="mt-1 font-medium text-slate-100">
                            {project.createdAt
                              ? new Date(project.createdAt).toLocaleDateString(undefined, {
                                  year: 'numeric',
                                  month: 'long',
                                  day: 'numeric',
                                })
                              : '—'}
                          </p>
                        </div>
                        <div className="rounded-2xl border border-white/10 bg-slate-900/60 p-4 sm:col-span-2">
                          <p className="text-sm text-slate-400">Last Updated</p>
                          <p className="mt-1 font-medium text-slate-100">
                            {project.updatedAt
                              ? new Date(project.updatedAt).toLocaleDateString(undefined, {
                                  year: 'numeric',
                                  month: 'long',
                                  day: 'numeric',
                                })
                              : '—'}
                          </p>
                        </div>
                      </div>
                    </Card>

                    <Card className="p-6">
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <h2 className="text-xl font-semibold text-slate-100">Members</h2>
                          <p className="mt-1 text-sm text-slate-400">
                            {members.length} collaborator{members.length === 1 ? '' : 's'} on this project.
                          </p>
                        </div>
                        <div className="rounded-2xl border border-white/10 bg-white/5 p-2">
                          <Users className="h-4 w-4 text-slate-300" />
                        </div>
                      </div>

                      {members.length === 0 ? (
                        <div className="mt-6">
                          <EmptyState
                            title="No members yet"
                            description="Invite your first teammate using the project invite code."
                          />
                        </div>
                      ) : (
                        <div className="mt-6 grid gap-3">
                          {members.map((member) => (
                            <MemberCard
                              key={member._id}
                              user={member}
                              isOwner={String(member._id) === String(project.owner)}
                              onRemove={
                                canRemoveMember(member)
                                  ? () => openRemoveMemberDialog(member)
                                  : undefined
                              }
                            />
                          ))}
                        </div>
                      )}
                    </Card>
                  </div>

                  <TaskBoard
                    projectId={project._id}
                    members={members}
                    isOwner={isOwner}
                    currentUserId={user?._id}
                    onTaskCountChange={setTaskCount}
                    showToast={showToast}
                  />

                  <Card className="p-6">
                    <div className="flex flex-col gap-2">
                      <h2 className="text-xl font-semibold text-slate-100">Comments</h2>
                      <p className="text-sm text-slate-400">Collaborate with your team.</p>
                    </div>

                    <div className="mt-6 space-y-4">
                      <CommentInput
                        loading={commentSubmitting}
                        initialValue={commentDraft}
                        onSubmit={async (message) => {
                          setCommentDraft(message);
                          await handleCreateComment(message);
                        }}
                        onCancel={() => setCommentDraft('')}
                      />

                      <div className="max-h-[560px] space-y-3 overflow-y-auto pr-1">
                        <CommentList
                          comments={comments}
                          loading={commentsLoading}
                          error={commentsError}
                          currentUserId={user?._id}
                          canManageComments={isOwner}
                          editingCommentId={editingCommentId}
                          editingMessage={editingMessage}
                          submitting={commentSubmitting}
                          onEdit={handleEditComment}
                          onDelete={(comment) => setDeleteCommentId(comment._id)}
                          onEditValueChange={setEditingMessage}
                          onSaveEdit={(message) => void handleSaveEdit(message)}
                          onCancelEdit={() => {
                            setEditingCommentId(null);
                            setEditingMessage('');
                          }}
                          onRetry={() => void fetchComments()}
                        />
                        <div ref={commentsEndRef} />
                      </div>
                    </div>
                  </Card>
                </div>
              ) : null}
            </div>
          </main>
        </div>
      </div>

      {toast ? (
        <div
          role="status"
          aria-live="polite"
          className={`fixed bottom-6 right-6 z-50 animate-[fadeIn_220ms_ease-out] rounded-2xl border px-4 py-3 text-sm shadow-2xl backdrop-blur-md ${
            toast.type === 'success'
              ? 'border-emerald-400/30 bg-emerald-500/15 text-emerald-200'
              : 'border-rose-400/30 bg-rose-500/15 text-rose-200'
          }`}
        >
          {toast.message}
        </div>
      ) : null}

      <InviteMemberModal
        open={inviteOpen}
        loading={submitting}
        inviteCode={project?.inviteCode}
        onClose={() => setInviteOpen(false)}
        onCopySuccess={() => showToast('success', 'Invite code copied to clipboard.')}
      />

      <ProjectFormModal
        open={editOpen}
        mode="edit"
        project={project}
        loading={submitting}
        onClose={() => setEditOpen(false)}
        onSubmit={handleEditProject}
      />

      <DeleteProjectDialog
        open={deleteOpen}
        projectName={project?.name ?? ''}
        loading={submitting}
        onClose={() => setDeleteOpen(false)}
        onConfirm={handleDeleteProject}
      />

      <RemoveMemberDialog
        open={removeMemberOpen}
        memberName={memberToRemove?.name ?? ''}
        loading={submitting}
        onClose={() => {
          setRemoveMemberOpen(false);
          setMemberToRemove(null);
        }}
        onConfirm={handleRemoveMember}
      />

      <DeleteCommentDialog
        open={Boolean(deleteCommentId)}
        commentPreview={comments.find((comment) => comment._id === deleteCommentId)?.message ?? ''}
        loading={commentSubmitting}
        onClose={() => setDeleteCommentId(null)}
        onConfirm={() => void handleDeleteComment()}
      />
    </div>
  );
};

export default ProjectDetailsPage;

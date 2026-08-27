import { randomUUID } from 'node:crypto';

export type CommentGrant = { actorRef: string; projectId: string; active: boolean };
export type CommentTask = { id: string; projectId: string };
export type TaskComment = { externalId: string; taskId: string; authorRef: string; body: string; sourceRef: string; parentCommentId?: string };

export class CommentAccessError extends Error {}

export class InMemoryTaskCommentService {
  readonly comments: TaskComment[] = [];
  readonly events: Array<{ type: 'COMMENT'; taskId: string; actorRef: string; sourceRef: string }> = [];
  constructor(private readonly tasks: CommentTask[], private readonly grants: CommentGrant[]) {}

  create(input: { actorRef: string; taskId: string; body: string; idempotencyKey: string; claimedAuthorRef?: string; parentCommentId?: string }) {
    const task = this.tasks.find(({ id }) => id === input.taskId);
    if (!task || !this.grants.some((g) => g.active && g.actorRef === input.actorRef && g.projectId === task.projectId)) throw new CommentAccessError('project_grant_required');
    const existing = this.comments.find(({ sourceRef }) => sourceRef === `comment:${input.idempotencyKey}`);
    if (existing) return existing;
    if (!input.body.trim()) throw new Error('body_required');
    if (input.parentCommentId && !this.comments.some((comment) => comment.externalId === input.parentCommentId && comment.taskId === input.taskId)) throw new CommentAccessError('invalid_parent');
    const comment = { externalId: randomUUID(), taskId: task.id, authorRef: input.actorRef, body: input.body.trim(), sourceRef: `comment:${input.idempotencyKey}`, ...(input.parentCommentId ? { parentCommentId: input.parentCommentId } : {}) };
    this.comments.push(comment);
    this.events.push({ type: 'COMMENT', taskId: task.id, actorRef: input.actorRef, sourceRef: `${comment.sourceRef}:created` });
    return comment;
  }
}

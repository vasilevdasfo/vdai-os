import { describe, expect, it } from 'vitest';
import { CommentAccessError, InMemoryTaskCommentService } from './task-comment-service';

describe('project-scoped task comments', () => {
  const service = () => new InMemoryTaskCommentService(
    [{ id: 'task-a', projectId: 'project-a' }, { id: 'task-b', projectId: 'project-b' }],
    [{ actorRef: 'sasha:l7', projectId: 'project-a', active: true }],
  );

  it('derives author, writes an audit event and deduplicates a repeated submit', () => {
    const comments = service();
    const first = comments.create({ actorRef: 'sasha:l7', claimedAuthorRef: 'dmitrii:l8', taskId: 'task-a', body: '  Проверил архитектуру  ', idempotencyKey: 'tg:356:1' });
    const repeated = comments.create({ actorRef: 'sasha:l7', taskId: 'task-a', body: 'ignored duplicate', idempotencyKey: 'tg:356:1' });
    expect(first.authorRef).toBe('sasha:l7');
    expect(repeated.externalId).toBe(first.externalId);
    expect(comments.comments).toHaveLength(1);
    expect(comments.events).toEqual([{ type: 'COMMENT', taskId: 'task-a', actorRef: 'sasha:l7', sourceRef: 'comment:tg:356:1:created' }]);
  });

  it('denies commenting outside the active project grant', () => {
    const comments = service();
    expect(() => comments.create({ actorRef: 'sasha:l7', taskId: 'task-b', body: 'Нет доступа', idempotencyKey: 'x' })).toThrow(CommentAccessError);
  });
});

import { describe, it, expect } from 'vitest';
import { taskSchema } from '@/schemas/task';

describe('taskSchema', () => {
  it('validates a correct task', () => {
    const result = taskSchema.safeParse({ title: 'Test task' });
    expect(result.success).toBe(true);
  });

  it('rejects empty title', () => {
    const result = taskSchema.safeParse({ title: '' });
    expect(result.success).toBe(false);
  });

  it('allows optional fields', () => {
    const result = taskSchema.safeParse({ title: 'Test', description: 'Desc', tags: [1, 2], deadline: '2024-07-15' });
    expect(result.success).toBe(true);
  });
});
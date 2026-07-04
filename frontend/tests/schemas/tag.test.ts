import { describe, it, expect } from 'vitest';
import { tagSchema } from '@/schemas/tag';

describe('tagSchema', () => {
  it('validates a correct tag', () => {
    const result = tagSchema.safeParse({ name: 'Salud' });
    expect(result.success).toBe(true);
  });

  it('rejects empty name', () => {
    const result = tagSchema.safeParse({ name: '' });
    expect(result.success).toBe(false);
  });

  it('rejects name longer than 50 characters', () => {
    const result = tagSchema.safeParse({ name: 'a'.repeat(51) });
    expect(result.success).toBe(false);
  });

  it('rejects invalid hex color', () => {
    const result = tagSchema.safeParse({ name: 'Test', color: 'not-a-color' });
    expect(result.success).toBe(false);
  });

  it('accepts valid hex color', () => {
    const result = tagSchema.safeParse({ name: 'Test', color: '#FF0000' });
    expect(result.success).toBe(true);
  });
});
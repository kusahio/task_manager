import { describe, it, expect } from 'vitest';
import { matchTagsFromAI } from '@/utils/task-parser';
import { Tag } from '@/types/tag';

const mockTags: Tag[] = [
  { id: 1, name: 'Salud', color: '#10b981' },
  { id: 2, name: 'Trabajo', color: '#3b82f6' },
  { id: 3, name: 'Urgente', color: '#ef4444' },
];

describe('matchTagsFromAI', () => {
  it('matches case-insensitive tag names', () => {
    expect(matchTagsFromAI(['salud', 'URGENTE'], mockTags)).toEqual([1, 3]);
  });

  it('returns empty array when no tags match', () => {
    expect(matchTagsFromAI(['inexistente'], mockTags)).toEqual([]);
  });

  it('returns empty array for empty input', () => {
    expect(matchTagsFromAI([], mockTags)).toEqual([]);
  });

  it('only returns IDs of matched tags', () => {
    expect(matchTagsFromAI(['trabajo'], mockTags)).toEqual([2]);
  });
});
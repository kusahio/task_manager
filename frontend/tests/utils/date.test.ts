import { describe, it, expect } from 'vitest';
import { formatDateToDisplay, formatDateForInput, formatDateToISO } from '@/utils/date';

describe('formatDateToDisplay', () => {
  it('returns null for undefined', () => {
    expect(formatDateToDisplay(undefined)).toBeNull();
  });

  it('returns null for null', () => {
    expect(formatDateToDisplay(null)).toBeNull();
  });

  it('formats date to Spanish locale', () => {
    const result = formatDateToDisplay('2024-07-15T10:00:00Z');
    expect(result).toMatch(/jul/);
    expect(result).toMatch(/15/);
  });
});

describe('formatDateForInput', () => {
  it('returns empty string for undefined', () => {
    expect(formatDateForInput(undefined)).toBe('');
  });

  it('returns empty string for null', () => {
    expect(formatDateForInput(null)).toBe('');
  });

  it('converts to yyyy-mm-dd', () => {
    expect(formatDateForInput('2024-07-15T10:00:00Z')).toBe('2024-07-15');
  });
});

describe('formatDateToISO', () => {
  it('converts date string to ISO', () => {
    const result = formatDateToISO('2024-07-15');
    expect(result).toContain('2024-07-15');
    expect(result).toContain('T');
    expect(result).toContain('Z');
  });
});
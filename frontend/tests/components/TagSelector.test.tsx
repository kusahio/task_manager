import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import TagSelector from '@/app/(protected)/tasks/_components/TagSelector';
import { Tag } from '@/types/tag';

const mockTags: Tag[] = [
  { id: 1, name: 'Salud', color: '#10b981' },
  { id: 2, name: 'Trabajo', color: '#3b82f6' },
];

describe('TagSelector', () => {
  it('renders all tags', () => {
    render(<TagSelector availableTags={mockTags} selectedTagIds={[]} onChange={vi.fn()} />);
    expect(screen.getByText('Salud')).toBeInTheDocument();
    expect(screen.getByText('Trabajo')).toBeInTheDocument();
  });

  it('calls onChange with added tag id when unselected tag is clicked', () => {
    const onChange = vi.fn();
    render(<TagSelector availableTags={mockTags} selectedTagIds={[]} onChange={onChange} />);
    fireEvent.click(screen.getByText('Salud'));
    expect(onChange).toHaveBeenCalledWith([1]);
  });

  it('calls onChange without removed tag id when selected tag is clicked', () => {
    const onChange = vi.fn();
    render(<TagSelector availableTags={mockTags} selectedTagIds={[1]} onChange={onChange} />);
    fireEvent.click(screen.getByRole('button', { name: /salud/i }));
    expect(onChange).toHaveBeenCalledWith([]);
  });
});
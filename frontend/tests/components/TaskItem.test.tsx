import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import TaskItem from '@/app/(protected)/tasks/_components/TaskItem';
import { Task } from '@/types/task';

const mockTask: Task = {
  id: 1,
  title: 'Test task',
  description: 'A description',
  completed: false,
  deadline: '2024-07-15T10:00:00Z',
  tags: [{ id: 1, name: 'Salud', color: '#10b981' }],
};

describe('TaskItem', () => {
  it('renders task title and description', () => {
    render(<TaskItem task={mockTask} onToggle={vi.fn()} onDelete={vi.fn()} onEdit={vi.fn()} />);
    expect(screen.getByText('Test task')).toBeInTheDocument();
    expect(screen.getByText('A description')).toBeInTheDocument();
  });

  it('renders tags', () => {
    render(<TaskItem task={mockTask} onToggle={vi.fn()} onDelete={vi.fn()} onEdit={vi.fn()} />);
    expect(screen.getByText('Salud')).toBeInTheDocument();
  });

  it('calls onToggle when checkbox is clicked', () => {
    const onToggle = vi.fn();
    render(<TaskItem task={mockTask} onToggle={onToggle} onDelete={vi.fn()} onEdit={vi.fn()} />);
    const checkButton = screen.getByRole('button', { name: /✓/i });
    fireEvent.click(checkButton);
    expect(onToggle).toHaveBeenCalledWith(mockTask);
  });

  it('calls onDelete when delete button is clicked', () => {
    const onDelete = vi.fn();
    render(<TaskItem task={mockTask} onToggle={vi.fn()} onDelete={onDelete} onEdit={vi.fn()} />);
    const deleteButton = screen.getByText('Eliminar');
    fireEvent.click(deleteButton);
    expect(onDelete).toHaveBeenCalledWith(mockTask.id);
  });

  it('shows completed style when task is completed', () => {
    const completedTask = { ...mockTask, completed: true };
    const { container } = render(<TaskItem task={completedTask} onToggle={vi.fn()} onDelete={vi.fn()} onEdit={vi.fn()} />);
    const title = screen.getByText('Test task');
    expect(title.className).toContain('line-through');
  });
});
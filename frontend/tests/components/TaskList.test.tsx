import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import TaskList from '@/app/(protected)/tasks/_components/TaskList';
import { Task } from '@/types/task';

const mockTasks: Task[] = [
  { id: 1, title: 'Task 1', completed: false, tags: [] },
  { id: 2, title: 'Task 2', completed: true, tags: [] },
];

describe('TaskList', () => {
  it('renders empty state when no tasks', () => {
    render(<TaskList tasks={[]} onToggle={vi.fn()} onDeleteRequest={vi.fn()} onEditTask={vi.fn()} />);
    expect(screen.getByText('No hay tareas pendientes')).toBeInTheDocument();
  });

  it('renders all tasks', () => {
    render(<TaskList tasks={mockTasks} onToggle={vi.fn()} onDeleteRequest={vi.fn()} onEditTask={vi.fn()} />);
    expect(screen.getByText('Task 1')).toBeInTheDocument();
    expect(screen.getByText('Task 2')).toBeInTheDocument();
  });
});
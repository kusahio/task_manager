import { Tag } from './tag';

export interface Task {
  id: number;
  title: string;
  description?: string;
  completed: boolean;
  deadline?: string | null;
  tags: Tag[];
}

export interface TaskCreate {
  title: string;
  description?: string;
  deadline?: string | null;
  tags?: number[];
}

export interface TaskUpdate {
  title?: string;
  description?: string;
  completed?: boolean;
  deadline?: string | null;
  tags?: number[];
}

export interface TaskSummary {
  total: number;
  completed: number;
  pending: number;
  overdue: number;
  by_tag: Record<string, number>;
}
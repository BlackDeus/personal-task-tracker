import type { Category, Priority } from './task';

export interface ApiTask {
  id: number;
  userId: number;
  title: string;
  description: string;
  priority: Priority;
  status: 'active' | 'completed';
  deadline: string | null;
  category: Category;
  createdAt: string;
  updatedAt: string;
}

export interface CreateTaskPayload {
  title: string;
  description: string;
  priority: Priority;
  category: Category;
  deadline: string | null;
  status?: 'active' | 'completed';
}

export interface UpdateTaskPayload {
  title?: string;
  description?: string;
  priority?: Priority;
  category?: Category;
  deadline?: string | null;
  status?: 'active' | 'completed';
}

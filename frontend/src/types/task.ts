export type Priority = 'low' | 'medium' | 'high';

export type Category =
  | 'work'
  | 'personal'
  | 'shopping'
  | 'health'
  | 'education'
  | 'other';

export type TaskStatus = 'all' | 'active' | 'completed';

export type AppTab = 'tasks' | 'dashboard';

export interface Task {
  id: string;
  title: string;
  description: string;
  completed: boolean;
  priority: Priority;
  category: Category;
  /** ISO date string YYYY-MM-DD in local calendar */
  deadline: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface TaskFormData {
  title: string;
  description: string;
  priority: Priority;
  category: Category;
  deadline: string;
}

export interface TaskFilters {
  status: TaskStatus;
  priority: Priority | 'all';
  category: Category | 'all';
  search: string;
}

export interface TaskStats {
  total: number;
  completed: number;
  active: number;
  overdue: number;
  dueToday: number;
  dueThisWeek: number;
  byPriority: Record<Priority, number>;
  byCategory: Record<Category, number>;
  completionRate: number;
}

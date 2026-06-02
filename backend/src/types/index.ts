export type Priority = 'low' | 'medium' | 'high';

export type Category =
  | 'work'
  | 'personal'
  | 'shopping'
  | 'health'
  | 'education'
  | 'other';

export type TaskStatus = 'active' | 'completed';

export interface UserRow {
  id: number;
  username: string;
  email: string;
  password_hash: string;
  created_at: string;
}

export interface TaskRow {
  id: number;
  user_id: number;
  title: string;
  description: string | null;
  priority: Priority;
  status: TaskStatus;
  deadline: string | null;
  category: Category;
  created_at: string;
  updated_at: string;
}

export interface JwtPayload {
  userId: number;
  email: string;
}

declare global {
  namespace Express {
    interface Request {
      user?: JwtPayload;
    }
  }
}

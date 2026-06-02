import type { Request, Response } from 'express';
import type { ResultSetHeader, RowDataPacket } from 'mysql2';
import { pool } from '../db/pool.js';
import type { Category, Priority, TaskRow, TaskStatus } from '../types/index.js';

const PRIORITIES: Priority[] = ['low', 'medium', 'high'];
const CATEGORIES: Category[] = ['work', 'personal', 'shopping', 'health', 'education', 'other'];
const STATUSES: TaskStatus[] = ['active', 'completed'];

function mapTask(row: TaskRow & RowDataPacket) {
  return {
    id: row.id,
    userId: row.user_id,
    title: row.title,
    description: row.description ?? '',
    priority: row.priority,
    status: row.status,
    deadline: row.deadline,
    category: row.category,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

function parsePriority(value: unknown): Priority | null {
  return typeof value === 'string' && PRIORITIES.includes(value as Priority)
    ? (value as Priority)
    : null;
}

function parseCategory(value: unknown): Category | null {
  return typeof value === 'string' && CATEGORIES.includes(value as Category)
    ? (value as Category)
    : null;
}

function parseStatus(value: unknown): TaskStatus | null {
  return typeof value === 'string' && STATUSES.includes(value as TaskStatus)
    ? (value as TaskStatus)
    : null;
}

function parseDeadline(value: unknown): string | null {
  if (value === null || value === undefined || value === '') return null;
  if (typeof value !== 'string') return null;
  return /^\d{4}-\d{2}-\d{2}$/.test(value) ? value : null;
}

export async function getTasks(req: Request, res: Response): Promise<void> {
  const userId = req.user!.userId;

  const [rows] = await pool.execute<(TaskRow & RowDataPacket)[]>(
    `SELECT id, user_id, title, description, priority, status, deadline, category, created_at, updated_at
     FROM tasks WHERE user_id = ? ORDER BY created_at DESC`,
    [userId],
  );

  res.json({ tasks: rows.map(mapTask) });
}

export async function createTask(req: Request, res: Response): Promise<void> {
  const userId = req.user!.userId;
  const { title, description, priority, status, deadline, category } = req.body as Record<
    string,
    unknown
  >;

  if (!title || typeof title !== 'string' || !title.trim()) {
    res.status(400).json({ error: 'Назва задачі обов\'язкова' });
    return;
  }

  const parsedPriority = parsePriority(priority) ?? 'medium';
  const parsedCategory = parseCategory(category) ?? 'other';
  const parsedStatus = parseStatus(status) ?? 'active';
  const parsedDeadline = parseDeadline(deadline);

  const [result] = await pool.execute<ResultSetHeader>(
    `INSERT INTO tasks (user_id, title, description, priority, status, deadline, category)
     VALUES (?, ?, ?, ?, ?, ?, ?)`,
    [
      userId,
      title.trim().slice(0, 200),
      typeof description === 'string' ? description.trim().slice(0, 1000) : '',
      parsedPriority,
      parsedStatus,
      parsedDeadline,
      parsedCategory,
    ],
  );

  const [rows] = await pool.execute<(TaskRow & RowDataPacket)[]>(
    `SELECT id, user_id, title, description, priority, status, deadline, category, created_at, updated_at
     FROM tasks WHERE id = ? AND user_id = ?`,
    [result.insertId, userId],
  );

  res.status(201).json({ task: mapTask(rows[0]) });
}

export async function updateTask(req: Request, res: Response): Promise<void> {
  const userId = req.user!.userId;
  const taskId = Number(req.params.id);

  if (!Number.isInteger(taskId) || taskId <= 0) {
    res.status(400).json({ error: 'Невалідний ID задачі' });
    return;
  }

  const [existing] = await pool.execute<(TaskRow & RowDataPacket)[]>(
    'SELECT id FROM tasks WHERE id = ? AND user_id = ? LIMIT 1',
    [taskId, userId],
  );

  if (existing.length === 0) {
    res.status(404).json({ error: 'Задачу не знайдено' });
    return;
  }

  const { title, description, priority, status, deadline, category } = req.body as Record<
    string,
    unknown
  >;

  const updates: string[] = [];
  const values: (string | number | null)[] = [];

  if (title !== undefined) {
    if (typeof title !== 'string' || !title.trim()) {
      res.status(400).json({ error: 'Назва не може бути порожньою' });
      return;
    }
    updates.push('title = ?');
    values.push(title.trim().slice(0, 200));
  }

  if (description !== undefined) {
    updates.push('description = ?');
    values.push(typeof description === 'string' ? description.trim().slice(0, 1000) : '');
  }

  if (priority !== undefined) {
    const parsed = parsePriority(priority);
    if (!parsed) {
      res.status(400).json({ error: 'Невалідний пріоритет' });
      return;
    }
    updates.push('priority = ?');
    values.push(parsed);
  }

  if (status !== undefined) {
    const parsed = parseStatus(status);
    if (!parsed) {
      res.status(400).json({ error: 'Невалідний статус' });
      return;
    }
    updates.push('status = ?');
    values.push(parsed);
  }

  if (deadline !== undefined) {
    const parsed = parseDeadline(deadline);
    if (deadline !== null && deadline !== '' && parsed === null) {
      res.status(400).json({ error: 'Невалідний формат дедлайну' });
      return;
    }
    updates.push('deadline = ?');
    values.push(parsed);
  }

  if (category !== undefined) {
    const parsed = parseCategory(category);
    if (!parsed) {
      res.status(400).json({ error: 'Невалідна категорія' });
      return;
    }
    updates.push('category = ?');
    values.push(parsed);
  }

  if (updates.length === 0) {
    res.status(400).json({ error: 'Немає полів для оновлення' });
    return;
  }

  values.push(taskId, userId);

  await pool.execute(
    `UPDATE tasks SET ${updates.join(', ')} WHERE id = ? AND user_id = ?`,
    values,
  );

  const [rows] = await pool.execute<(TaskRow & RowDataPacket)[]>(
    `SELECT id, user_id, title, description, priority, status, deadline, category, created_at, updated_at
     FROM tasks WHERE id = ? AND user_id = ?`,
    [taskId, userId],
  );

  res.json({ task: mapTask(rows[0]) });
}

export async function deleteTask(req: Request, res: Response): Promise<void> {
  const userId = req.user!.userId;
  const taskId = Number(req.params.id);

  if (!Number.isInteger(taskId) || taskId <= 0) {
    res.status(400).json({ error: 'Невалідний ID задачі' });
    return;
  }

  const [result] = await pool.execute<ResultSetHeader>(
    'DELETE FROM tasks WHERE id = ? AND user_id = ?',
    [taskId, userId],
  );

  if (result.affectedRows === 0) {
    res.status(404).json({ error: 'Задачу не знайдено' });
    return;
  }

  res.json({ message: 'Задачу видалено' });
}

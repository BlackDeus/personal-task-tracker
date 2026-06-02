import { CATEGORIES, PRIORITIES, TASK_LIMITS } from '../constants/taskMeta';
import type { Category, Priority, Task, TaskFilters, TaskStatus } from '../types/task';

const DATE_ONLY = /^\d{4}-\d{2}-\d{2}$/;

export function isPriority(value: unknown): value is Priority {
  return typeof value === 'string' && (PRIORITIES as readonly string[]).includes(value);
}

export function isCategory(value: unknown): value is Category {
  return typeof value === 'string' && (CATEGORIES as readonly string[]).includes(value);
}

export function isTaskStatus(value: unknown): value is TaskStatus {
  return value === 'all' || value === 'active' || value === 'completed';
}

export function parsePriority(value: unknown, fallback: Priority = 'medium'): Priority {
  return isPriority(value) ? value : fallback;
}

export function parseCategory(value: unknown, fallback: Category = 'other'): Category {
  return isCategory(value) ? value : fallback;
}

export function parseDeadline(value: unknown): string | null {
  if (typeof value !== 'string' || !DATE_ONLY.test(value)) return null;
  const [year, month, day] = value.split('-').map(Number);
  const date = new Date(year, month - 1, day);
  if (
    date.getFullYear() !== year ||
    date.getMonth() !== month - 1 ||
    date.getDate() !== day
  ) {
    return null;
  }
  return value;
}

export function parseTask(raw: unknown): Task | null {
  if (!raw || typeof raw !== 'object') return null;

  const record = raw as Record<string, unknown>;
  if (typeof record.id !== 'string' || !record.id.trim()) return null;
  if (typeof record.title !== 'string') return null;

  const now = new Date().toISOString();

  return {
    id: record.id,
    title: record.title.trim().slice(0, TASK_LIMITS.titleMax),
    description:
      typeof record.description === 'string'
        ? record.description.trim().slice(0, TASK_LIMITS.descriptionMax)
        : '',
    completed: Boolean(record.completed),
    priority: parsePriority(record.priority),
    category: parseCategory(record.category),
    deadline: parseDeadline(record.deadline),
    createdAt: typeof record.createdAt === 'string' ? record.createdAt : now,
    updatedAt: typeof record.updatedAt === 'string' ? record.updatedAt : now,
  };
}

export function parseTasks(raw: unknown): Task[] {
  if (!Array.isArray(raw)) return [];
  return raw.map(parseTask).filter((task): task is Task => task !== null);
}

export function parseTaskFilters(raw: unknown): TaskFilters | null {
  if (!raw || typeof raw !== 'object') return null;

  const record = raw as Record<string, unknown>;
  const status = isTaskStatus(record.status) ? record.status : 'all';
  const priority =
    record.priority === 'all' || isPriority(record.priority) ? record.priority : 'all';
  const category =
    record.category === 'all' || isCategory(record.category) ? record.category : 'all';
  const search = typeof record.search === 'string' ? record.search.slice(0, 100) : '';

  return { status, priority, category, search };
}

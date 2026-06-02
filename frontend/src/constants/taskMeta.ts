import type { Category, Priority } from '../types/task';

export const PRIORITIES = ['low', 'medium', 'high'] as const satisfies readonly Priority[];

export const CATEGORIES = [
  'work',
  'personal',
  'shopping',
  'health',
  'education',
  'other',
] as const satisfies readonly Category[];

export const PRIORITY_LABELS: Record<Priority, string> = {
  low: 'Низький',
  medium: 'Середній',
  high: 'Високий',
};

export const CATEGORY_LABELS: Record<Category, string> = {
  work: 'Робота',
  personal: 'Особисте',
  shopping: 'Покупки',
  health: "Здоров'я",
  education: 'Навчання',
  other: 'Інше',
};

export const PRIORITY_COLORS: Record<Priority, string> = {
  low: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300',
  medium: 'bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300',
  high: 'bg-rose-100 text-rose-700 dark:bg-rose-900/40 dark:text-rose-300',
};

export const CATEGORY_COLORS: Record<Category, string> = {
  work: 'bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300',
  personal: 'bg-purple-100 text-purple-700 dark:bg-purple-900/40 dark:text-purple-300',
  shopping: 'bg-orange-100 text-orange-700 dark:bg-orange-900/40 dark:text-orange-300',
  health: 'bg-teal-100 text-teal-700 dark:bg-teal-900/40 dark:text-teal-300',
  education: 'bg-indigo-100 text-indigo-700 dark:bg-indigo-900/40 dark:text-indigo-300',
  other: 'bg-slate-100 text-slate-700 dark:bg-slate-700/40 dark:text-slate-300',
};

export const TASK_LIMITS = {
  titleMax: 200,
  descriptionMax: 1000,
} as const;

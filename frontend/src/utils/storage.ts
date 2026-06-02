import type { TaskFilters } from '../types/task';
import type { Theme } from '../types/theme';
import { parseTaskFilters } from './validation';

export const STORAGE_KEYS = {
  theme: 'task-tracker-theme',
  filters: 'task-tracker-filters',
} as const;

function readRaw(key: string): string | null {
  try {
    return localStorage.getItem(key);
  } catch {
    return null;
  }
}

function writeRaw(key: string, value: string): boolean {
  try {
    localStorage.setItem(key, value);
    return true;
  } catch (error) {
    console.error(`[storage] Failed to write "${key}":`, error);
    return false;
  }
}

export function loadTheme(): Theme | null {
  const theme = readRaw(STORAGE_KEYS.theme);
  if (theme === 'light' || theme === 'dark') return theme;
  return null;
}

export function saveTheme(theme: Theme): boolean {
  return writeRaw(STORAGE_KEYS.theme, theme);
}

const DEFAULT_FILTERS: TaskFilters = {
  status: 'all',
  priority: 'all',
  category: 'all',
  search: '',
};

export function loadFilters(): TaskFilters {
  const raw = readRaw(STORAGE_KEYS.filters);
  if (!raw) return DEFAULT_FILTERS;

  try {
    return parseTaskFilters(JSON.parse(raw)) ?? DEFAULT_FILTERS;
  } catch {
    return DEFAULT_FILTERS;
  }
}

export function saveFilters(filters: TaskFilters): boolean {
  return writeRaw(STORAGE_KEYS.filters, JSON.stringify(filters));
}

import type { Theme } from '../types/theme';
import { STORAGE_KEYS } from './storage';

export function getSystemTheme(): Theme {
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
}

export function applyTheme(theme: Theme): void {
  document.documentElement.classList.toggle('dark', theme === 'dark');
}

/** Used by index.html inline script — keep logic in sync */
export function resolveInitialTheme(): Theme {
  try {
    const stored = localStorage.getItem(STORAGE_KEYS.theme);
    if (stored === 'light' || stored === 'dark') return stored;
  } catch {
    /* ignore */
  }
  return getSystemTheme();
}

export function bootstrapTheme(): void {
  applyTheme(resolveInitialTheme());
}

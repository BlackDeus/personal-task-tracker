import { useCallback, useEffect, useState } from 'react';
import type { Theme } from '../types/theme';
import { applyTheme, getSystemTheme } from '../utils/theme';
import { loadTheme, saveTheme } from '../utils/storage';

export function useTheme() {
  const [theme, setThemeState] = useState<Theme>(() => loadTheme() ?? getSystemTheme());

  useEffect(() => {
    applyTheme(theme);
    saveTheme(theme);
  }, [theme]);

  const toggleTheme = useCallback(() => {
    setThemeState((prev) => (prev === 'light' ? 'dark' : 'light'));
  }, []);

  return { theme, toggleTheme };
}

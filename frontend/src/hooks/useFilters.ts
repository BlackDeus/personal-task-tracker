import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import type { TaskFilters } from '../types/task';
import { loadFilters, saveFilters } from '../utils/storage';

const DEFAULT_FILTERS: TaskFilters = {
  status: 'all',
  priority: 'all',
  category: 'all',
  search: '',
};

export function useFilters() {
  const [filters, setFilters] = useState<TaskFilters>(() => loadFilters());
  const isHydrated = useRef(false);

  useEffect(() => {
    if (!isHydrated.current) {
      isHydrated.current = true;
      return;
    }
    saveFilters(filters);
  }, [filters]);

  const updateFilter = useCallback(
    <K extends keyof TaskFilters>(key: K, value: TaskFilters[K]) => {
      setFilters((prev) => ({ ...prev, [key]: value }));
    },
    [],
  );

  const resetFilters = useCallback(() => setFilters(DEFAULT_FILTERS), []);

  const hasActiveFilters = useMemo(
    () =>
      filters.status !== 'all' ||
      filters.priority !== 'all' ||
      filters.category !== 'all' ||
      filters.search.trim() !== '',
    [filters],
  );

  return { filters, updateFilter, resetFilters, hasActiveFilters };
}

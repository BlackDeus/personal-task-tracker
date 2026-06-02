import { useCallback } from 'react';
import { CATEGORIES, CATEGORY_LABELS, PRIORITIES, PRIORITY_LABELS } from '../../constants/taskMeta';
import type { TaskFilters, TaskStatus } from '../../types/task';
import { parseCategory, parsePriority } from '../../utils/validation';

interface TaskFiltersBarProps {
  filters: TaskFilters;
  onUpdate: <K extends keyof TaskFilters>(key: K, value: TaskFilters[K]) => void;
  onReset: () => void;
  hasActiveFilters: boolean;
}

const STATUS_OPTIONS: { value: TaskStatus; label: string }[] = [
  { value: 'all', label: 'Усі' },
  { value: 'active', label: 'Активні' },
  { value: 'completed', label: 'Виконані' },
];

export function TaskFiltersBar({ filters, onUpdate, onReset, hasActiveFilters }: TaskFiltersBarProps) {
  const selectClass =
    'rounded-xl border border-border-light dark:border-border-dark bg-card-light dark:bg-card-dark px-3 py-2 text-sm focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/20';

  const handlePriorityChange = useCallback(
    (value: string) => {
      onUpdate('priority', value === 'all' ? 'all' : parsePriority(value));
    },
    [onUpdate],
  );

  const handleCategoryChange = useCallback(
    (value: string) => {
      onUpdate('category', value === 'all' ? 'all' : parseCategory(value));
    },
    [onUpdate],
  );

  return (
    <div className="space-y-3">
      <div className="flex flex-wrap gap-2" role="group" aria-label="Статус задач">
        {STATUS_OPTIONS.map((opt) => (
          <button
            key={opt.value}
            type="button"
            onClick={() => onUpdate('status', opt.value)}
            aria-pressed={filters.status === opt.value}
            className={`rounded-full px-3.5 py-1.5 text-sm font-medium transition-colors ${
              filters.status === opt.value
                ? 'bg-primary-600 text-white'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200 dark:bg-slate-700 dark:text-slate-300 dark:hover:bg-slate-600'
            }`}
          >
            {opt.label}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
        <select
          value={filters.priority}
          onChange={(e) => handlePriorityChange(e.target.value)}
          className={selectClass}
          aria-label="Фільтр за пріоритетом"
        >
          <option value="all">Усі пріоритети</option>
          {PRIORITIES.map((p) => (
            <option key={p} value={p}>
              {PRIORITY_LABELS[p]}
            </option>
          ))}
        </select>

        <select
          value={filters.category}
          onChange={(e) => handleCategoryChange(e.target.value)}
          className={selectClass}
          aria-label="Фільтр за категорією"
        >
          <option value="all">Усі категорії</option>
          {CATEGORIES.map((c) => (
            <option key={c} value={c}>
              {CATEGORY_LABELS[c]}
            </option>
          ))}
        </select>
      </div>

      {hasActiveFilters && (
        <button
          type="button"
          onClick={onReset}
          className="text-sm font-medium text-primary-600 hover:text-primary-700 dark:text-primary-400 dark:hover:text-primary-300"
        >
          Скинути фільтри
        </button>
      )}
    </div>
  );
}

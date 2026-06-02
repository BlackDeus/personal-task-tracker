import { memo, useCallback } from 'react';
import {
  CATEGORY_COLORS,
  CATEGORY_LABELS,
  PRIORITY_COLORS,
  PRIORITY_LABELS,
} from '../../constants/taskMeta';
import type { Task } from '../../types/task';
import { formatDate, isDueToday, isOverdue } from '../../utils/date';
import { Badge } from '../ui/Badge';

interface TaskItemProps {
  task: Task;
  onToggle: (id: string) => void;
  onEdit: (task: Task) => void;
  onDelete: (id: string) => void;
}

export const TaskItem = memo(function TaskItem({
  task,
  onToggle,
  onEdit,
  onDelete,
}: TaskItemProps) {
  const overdue = isOverdue(task.deadline, task.completed);
  const dueToday = isDueToday(task.deadline);

  const handleToggle = useCallback(() => onToggle(task.id), [onToggle, task.id]);
  const handleEdit = useCallback(() => onEdit(task), [onEdit, task]);
  const handleDelete = useCallback(() => onDelete(task.id), [onDelete, task.id]);

  return (
    <article
      className={`rounded-2xl border bg-card-light dark:bg-card-dark p-4 shadow-sm transition-shadow hover:shadow-md ${
        task.completed
          ? 'border-border-light dark:border-border-dark opacity-75'
          : overdue
            ? 'border-rose-300 dark:border-rose-700'
            : 'border-border-light dark:border-border-dark'
      }`}
    >
      <div className="flex gap-3">
        <button
          type="button"
          onClick={handleToggle}
          className={`mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full border-2 transition-colors ${
            task.completed
              ? 'border-primary-500 bg-primary-500 text-white'
              : 'border-slate-300 hover:border-primary-500 dark:border-slate-600'
          }`}
          aria-label={task.completed ? 'Позначити як активну' : 'Позначити як виконану'}
        >
          {task.completed && (
            <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
            </svg>
          )}
        </button>

        <div className="min-w-0 flex-1">
          <h3
            className={`font-medium leading-snug break-words ${
              task.completed ? 'text-slate-400 line-through' : 'text-slate-900 dark:text-slate-100'
            }`}
          >
            {task.title}
          </h3>

          {task.description && (
            <p
              className={`mt-1 text-sm break-words ${
                task.completed ? 'text-slate-400 line-through' : 'text-slate-500 dark:text-slate-400'
              }`}
            >
              {task.description}
            </p>
          )}

          <div className="mt-2.5 flex flex-wrap items-center gap-1.5">
            <Badge label={PRIORITY_LABELS[task.priority]} className={PRIORITY_COLORS[task.priority]} />
            <Badge label={CATEGORY_LABELS[task.category]} className={CATEGORY_COLORS[task.category]} />
            {task.deadline && (
              <span
                className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-medium ${
                  overdue
                    ? 'bg-rose-100 text-rose-700 dark:bg-rose-900/40 dark:text-rose-300'
                    : dueToday
                      ? 'bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300'
                      : 'bg-slate-100 text-slate-600 dark:bg-slate-700/40 dark:text-slate-300'
                }`}
              >
                <svg className="h-3 w-3 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                  />
                </svg>
                {formatDate(task.deadline)}
                {overdue && ' · прострочено'}
                {dueToday && !overdue && ' · сьогодні'}
              </span>
            )}
          </div>
        </div>

        <div className="flex shrink-0 gap-0.5">
          <button
            type="button"
            onClick={handleEdit}
            className="rounded-lg p-2 text-slate-400 hover:bg-slate-100 hover:text-primary-600 dark:hover:bg-slate-700 dark:hover:text-primary-400 transition-colors"
            aria-label="Редагувати"
          >
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
              />
            </svg>
          </button>
          <button
            type="button"
            onClick={handleDelete}
            className="rounded-lg p-2 text-slate-400 hover:bg-rose-50 hover:text-rose-600 dark:hover:bg-rose-900/30 dark:hover:text-rose-400 transition-colors"
            aria-label="Видалити"
          >
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
              />
            </svg>
          </button>
        </div>
      </div>
    </article>
  );
});

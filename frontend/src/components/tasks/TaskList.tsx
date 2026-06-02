import { memo } from 'react';
import type { Task } from '../../types/task';
import { TaskItem } from './TaskItem';

export type TaskListEmptyVariant = 'no-tasks' | 'no-results';

interface TaskListProps {
  tasks: Task[];
  emptyVariant: TaskListEmptyVariant;
  onClearFilters?: () => void;
  onCreateTask?: () => void;
  onToggle: (id: string) => void;
  onEdit: (task: Task) => void;
  onDelete: (id: string) => void;
}

export const TaskList = memo(function TaskList({
  tasks,
  emptyVariant,
  onClearFilters,
  onCreateTask,
  onToggle,
  onEdit,
  onDelete,
}: TaskListProps) {
  if (tasks.length === 0) {
    const isFiltered = emptyVariant === 'no-results';

    return (
      <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-border-light dark:border-border-dark py-16 px-6 text-center">
        <div className="mb-4 rounded-full bg-slate-100 p-4 dark:bg-slate-800">
          <svg className="h-8 w-8 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5} aria-hidden="true">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
            />
          </svg>
        </div>
        <h3 className="text-lg font-medium text-slate-700 dark:text-slate-300">
          {isFiltered ? 'Нічого не знайдено' : 'Поки немає задач'}
        </h3>
        <p className="mt-1 max-w-xs text-sm text-slate-500 dark:text-slate-400">
          {isFiltered
            ? 'Спробуйте змінити фільтри або пошуковий запит'
            : 'Створіть першу задачу, щоб почати відстеження'}
        </p>
        <div className="mt-4 flex flex-wrap justify-center gap-2">
          {isFiltered && onClearFilters && (
            <button
              type="button"
              onClick={onClearFilters}
              className="rounded-xl border border-border-light dark:border-border-dark px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-50 dark:text-slate-300 dark:hover:bg-slate-700 transition-colors"
            >
              Скинути фільтри
            </button>
          )}
          {!isFiltered && onCreateTask && (
            <button
              type="button"
              onClick={onCreateTask}
              className="rounded-xl bg-primary-600 px-4 py-2 text-sm font-medium text-white hover:bg-primary-700 transition-colors"
            >
              Створити задачу
            </button>
          )}
        </div>
      </div>
    );
  }

  return (
    <ul className="space-y-3" role="list">
      {tasks.map((task) => (
        <li key={task.id}>
          <TaskItem task={task} onToggle={onToggle} onEdit={onEdit} onDelete={onDelete} />
        </li>
      ))}
    </ul>
  );
});

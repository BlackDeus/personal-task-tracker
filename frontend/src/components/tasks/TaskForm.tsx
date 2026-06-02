import { useEffect, useState, type FormEvent } from 'react';
import {
  CATEGORIES,
  CATEGORY_LABELS,
  PRIORITIES,
  PRIORITY_LABELS,
  TASK_LIMITS,
} from '../../constants/taskMeta';
import type { Task, TaskFormData } from '../../types/task';
import { parseCategory, parsePriority } from '../../utils/validation';

const EMPTY_FORM: TaskFormData = {
  title: '',
  description: '',
  priority: 'medium',
  category: 'personal',
  deadline: '',
};

interface TaskFormProps {
  task?: Task;
  onSubmit: (data: TaskFormData) => void;
  onCancel: () => void;
  isSubmitting?: boolean;
}

export function TaskForm({ task, onSubmit, onCancel, isSubmitting = false }: TaskFormProps) {
  const [form, setForm] = useState<TaskFormData>(() =>
    task
      ? {
          title: task.title,
          description: task.description,
          priority: task.priority,
          category: task.category,
          deadline: task.deadline ?? '',
        }
      : EMPTY_FORM,
  );

  useEffect(() => {
    if (task) {
      setForm({
        title: task.title,
        description: task.description,
        priority: task.priority,
        category: task.category,
        deadline: task.deadline ?? '',
      });
    } else {
      setForm(EMPTY_FORM);
    }
  }, [task]);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!form.title.trim()) return;
    onSubmit(form);
  };

  const inputClass =
    'w-full rounded-xl border border-border-light dark:border-border-dark bg-surface-light dark:bg-surface-dark px-3 py-2.5 text-sm focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/20 transition-colors';

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="title" className="mb-1.5 block text-sm font-medium text-slate-700 dark:text-slate-300">
          Назва *
        </label>
        <input
          id="title"
          type="text"
          value={form.title}
          onChange={(e) => setForm({ ...form, title: e.target.value })}
          placeholder="Що потрібно зробити?"
          className={inputClass}
          required
          maxLength={TASK_LIMITS.titleMax}
          autoFocus
        />
      </div>

      <div>
        <label htmlFor="description" className="mb-1.5 block text-sm font-medium text-slate-700 dark:text-slate-300">
          Опис
        </label>
        <textarea
          id="description"
          value={form.description}
          onChange={(e) => setForm({ ...form, description: e.target.value })}
          placeholder="Додаткові деталі..."
          rows={3}
          maxLength={TASK_LIMITS.descriptionMax}
          className={`${inputClass} resize-none`}
        />
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div>
          <label htmlFor="priority" className="mb-1.5 block text-sm font-medium text-slate-700 dark:text-slate-300">
            Пріоритет
          </label>
          <select
            id="priority"
            value={form.priority}
            onChange={(e) => setForm({ ...form, priority: parsePriority(e.target.value) })}
            className={inputClass}
          >
            {PRIORITIES.map((p) => (
              <option key={p} value={p}>
                {PRIORITY_LABELS[p]}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label htmlFor="category" className="mb-1.5 block text-sm font-medium text-slate-700 dark:text-slate-300">
            Категорія
          </label>
          <select
            id="category"
            value={form.category}
            onChange={(e) => setForm({ ...form, category: parseCategory(e.target.value) })}
            className={inputClass}
          >
            {CATEGORIES.map((c) => (
              <option key={c} value={c}>
                {CATEGORY_LABELS[c]}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div>
        <label htmlFor="deadline" className="mb-1.5 block text-sm font-medium text-slate-700 dark:text-slate-300">
          Дедлайн
        </label>
        <input
          id="deadline"
          type="date"
          value={form.deadline}
          onChange={(e) => setForm({ ...form, deadline: e.target.value })}
          className={inputClass}
        />
      </div>

      <div className="flex flex-col-reverse gap-2 pt-2 sm:flex-row sm:justify-end">
        <button
          type="button"
          onClick={onCancel}
          className="rounded-xl border border-border-light dark:border-border-dark px-4 py-2.5 text-sm font-medium text-slate-600 hover:bg-slate-50 dark:text-slate-300 dark:hover:bg-slate-700 transition-colors"
        >
          Скасувати
        </button>
        <button
          type="submit"
          disabled={isSubmitting}
          className="rounded-xl bg-primary-600 px-4 py-2.5 text-sm font-medium text-white hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 dark:focus:ring-offset-slate-800 transition-colors disabled:opacity-60"
        >
          {isSubmitting ? 'Збереження...' : task ? 'Зберегти' : 'Створити задачу'}
        </button>
      </div>
    </form>
  );
}

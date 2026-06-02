import { useCallback, useMemo, useState } from 'react';
import { ApiError } from '../../api/client';
import { IconPlus } from '../../components/icons/IconPlus';
import { TaskFiltersBar } from '../../components/tasks/TaskFiltersBar';
import { TaskForm } from '../../components/tasks/TaskForm';
import { TaskList } from '../../components/tasks/TaskList';
import { ConfirmDialog } from '../../components/ui/ConfirmDialog';
import { Modal } from '../../components/ui/Modal';
import { SearchBar } from '../../components/ui/SearchBar';
import { useDebouncedValue } from '../../hooks/useDebouncedValue';
import { useFilters } from '../../hooks/useFilters';
import { useToast } from '../../hooks/useToast';
import type { Task, TaskFilters, TaskFormData } from '../../types/task';
import { filterTasks, sortTasks } from '../../utils/filters';
import { formatTaskCount } from '../../utils/pluralize';

interface TasksViewProps {
  tasks: Task[];
  onAddTask: (data: TaskFormData) => Promise<Task>;
  onUpdateTask: (id: string, data: TaskFormData) => Promise<Task>;
  onDeleteTask: (id: string) => Promise<void>;
  onRestoreTask: (task: Task) => Promise<Task>;
  onToggleComplete: (id: string) => Promise<void>;
}

export function TasksView({
  tasks,
  onAddTask,
  onUpdateTask,
  onDeleteTask,
  onRestoreTask,
  onToggleComplete,
}: TasksViewProps) {
  const { filters, updateFilter, resetFilters, hasActiveFilters } = useFilters();
  const { showToast } = useToast();
  const debouncedSearch = useDebouncedValue(filters.search, 250);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | undefined>();
  const [deleteTarget, setDeleteTarget] = useState<Task | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const effectiveFilters = useMemo<TaskFilters>(
    () => ({ ...filters, search: debouncedSearch }),
    [filters, debouncedSearch],
  );

  const filteredTasks = useMemo(
    () => sortTasks(filterTasks(tasks, effectiveFilters)),
    [tasks, effectiveFilters],
  );

  const emptyVariant = tasks.length === 0 ? 'no-tasks' : 'no-results';

  const openCreateModal = useCallback(() => {
    setEditingTask(undefined);
    setIsModalOpen(true);
  }, []);

  const openEditModal = useCallback((task: Task) => {
    setEditingTask(task);
    setIsModalOpen(true);
  }, []);

  const closeModal = useCallback(() => {
    setIsModalOpen(false);
    setEditingTask(undefined);
  }, []);

  const handleSubmit = useCallback(
    async (data: TaskFormData) => {
      setIsSubmitting(true);
      try {
        if (editingTask) {
          await onUpdateTask(editingTask.id, data);
          showToast('Задачу оновлено');
        } else {
          await onAddTask(data);
          showToast('Задачу створено');
        }
        closeModal();
      } catch (err) {
        showToast(err instanceof ApiError ? err.message : 'Помилка збереження');
      } finally {
        setIsSubmitting(false);
      }
    },
    [editingTask, onAddTask, onUpdateTask, closeModal, showToast],
  );

  const handleSearchChange = useCallback(
    (value: string) => updateFilter('search', value),
    [updateFilter],
  );

  const requestDelete = useCallback(
    (id: string) => {
      const task = tasks.find((t) => t.id === id);
      if (task) setDeleteTarget(task);
    },
    [tasks],
  );

  const confirmDelete = useCallback(async () => {
    if (!deleteTarget) return;
    const snapshot = deleteTarget;
    setDeleteTarget(null);

    try {
      await onDeleteTask(snapshot.id);
      showToast('Задачу видалено', {
        label: 'Скасувати',
        onClick: () => {
          onRestoreTask(snapshot).catch(() => showToast('Не вдалося відновити задачу'));
        },
      });
    } catch (err) {
      showToast(err instanceof ApiError ? err.message : 'Помилка видалення');
    }
  }, [deleteTarget, onDeleteTask, onRestoreTask, showToast]);

  const handleToggle = useCallback(
    async (id: string) => {
      try {
        await onToggleComplete(id);
      } catch (err) {
        showToast(err instanceof ApiError ? err.message : 'Помилка оновлення');
      }
    },
    [onToggleComplete, showToast],
  );

  return (
    <div id="panel-tasks" role="tabpanel" aria-labelledby="tab-tasks" className="space-y-5">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <SearchBar value={filters.search} onChange={handleSearchChange} />
        <button
          type="button"
          onClick={openCreateModal}
          className="hidden sm:inline-flex shrink-0 items-center justify-center gap-2 rounded-xl bg-primary-600 px-4 py-2.5 text-sm font-medium text-white hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 dark:focus:ring-offset-slate-800 transition-colors"
        >
          <IconPlus />
          Нова задача
        </button>
      </div>

      <TaskFiltersBar
        filters={filters}
        onUpdate={updateFilter}
        onReset={resetFilters}
        hasActiveFilters={hasActiveFilters}
      />

      <p className="text-sm text-slate-500 dark:text-slate-400">{formatTaskCount(filteredTasks.length)}</p>

      <TaskList
        tasks={filteredTasks}
        emptyVariant={emptyVariant}
        onClearFilters={resetFilters}
        onCreateTask={openCreateModal}
        onToggle={handleToggle}
        onEdit={openEditModal}
        onDelete={requestDelete}
      />

      <button
        type="button"
        onClick={openCreateModal}
        className="fab-safe fixed z-30 flex h-14 w-14 items-center justify-center rounded-full bg-primary-600 text-white shadow-lg hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 dark:focus:ring-offset-slate-800 transition-all hover:scale-105 active:scale-95 sm:hidden"
        aria-label="Створити задачу"
      >
        <IconPlus className="h-6 w-6" />
      </button>

      <Modal
        isOpen={isModalOpen}
        onClose={closeModal}
        title={editingTask ? 'Редагування задачі' : 'Нова задача'}
      >
        <TaskForm
          task={editingTask}
          onSubmit={handleSubmit}
          onCancel={closeModal}
          isSubmitting={isSubmitting}
        />
      </Modal>

      <ConfirmDialog
        isOpen={deleteTarget !== null}
        title="Видалити задачу?"
        message={deleteTarget ? `«${deleteTarget.title}» буде видалено безповоротно.` : ''}
        confirmLabel="Видалити"
        variant="danger"
        onConfirm={confirmDelete}
        onCancel={() => setDeleteTarget(null)}
      />
    </div>
  );
}

import { useCallback, useEffect, useState } from 'react';
import { tasksApi } from '../api/tasks';
import { ApiError } from '../api/client';
import type { Task, TaskFormData } from '../types/task';
import { mapApiTaskToTask, mapTaskToCreatePayload } from '../utils/mappers';

export function useTasks() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchTasks = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const { tasks: apiTasks } = await tasksApi.getAll();
      setTasks(apiTasks.map(mapApiTaskToTask));
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'Не вдалося завантажити задачі');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchTasks();
  }, [fetchTasks]);

  const addTask = useCallback(async (data: TaskFormData) => {
    const { task } = await tasksApi.create({
      title: data.title.trim(),
      description: data.description.trim(),
      priority: data.priority,
      category: data.category,
      deadline: data.deadline || null,
      status: 'active',
    });
    const mapped = mapApiTaskToTask(task);
    setTasks((prev) => [mapped, ...prev]);
    return mapped;
  }, []);

  const updateTask = useCallback(async (id: string, data: TaskFormData) => {
    const { task } = await tasksApi.update(id, {
      title: data.title.trim(),
      description: data.description.trim(),
      priority: data.priority,
      category: data.category,
      deadline: data.deadline || null,
    });
    const mapped = mapApiTaskToTask(task);
    setTasks((prev) => prev.map((t) => (t.id === id ? mapped : t)));
    return mapped;
  }, []);

  const deleteTask = useCallback(async (id: string) => {
    await tasksApi.delete(id);
    setTasks((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const restoreTask = useCallback(async (task: Task) => {
    const { task: created } = await tasksApi.create(mapTaskToCreatePayload(task));
    const mapped = mapApiTaskToTask(created);
    setTasks((prev) => [mapped, ...prev]);
    return mapped;
  }, []);

  const toggleComplete = useCallback(async (id: string) => {
    const task = tasks.find((t) => t.id === id);
    if (!task) return;

    const newStatus = task.completed ? 'active' : 'completed';
    const { task: updated } = await tasksApi.update(id, { status: newStatus });
    const mapped = mapApiTaskToTask(updated);
    setTasks((prev) => prev.map((t) => (t.id === id ? mapped : t)));
  }, [tasks]);

  return {
    tasks,
    loading,
    error,
    refetch: fetchTasks,
    addTask,
    updateTask,
    deleteTask,
    restoreTask,
    toggleComplete,
  };
}

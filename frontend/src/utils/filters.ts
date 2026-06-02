import type { Task, TaskFilters } from '../types/task';

export function filterTasks(tasks: Task[], filters: TaskFilters): Task[] {
  return tasks.filter((task) => {
    if (filters.status === 'active' && task.completed) return false;
    if (filters.status === 'completed' && !task.completed) return false;
    if (filters.priority !== 'all' && task.priority !== filters.priority) return false;
    if (filters.category !== 'all' && task.category !== filters.category) return false;

    if (filters.search.trim()) {
      const query = filters.search.toLowerCase().trim();
      const inTitle = task.title.toLowerCase().includes(query);
      const inDescription = task.description.toLowerCase().includes(query);
      if (!inTitle && !inDescription) return false;
    }

    return true;
  });
}

export function sortTasks(tasks: Task[]): Task[] {
  return [...tasks].sort((a, b) => {
    if (a.completed !== b.completed) return a.completed ? 1 : -1;

    const priorityOrder = { high: 0, medium: 1, low: 2 };
    const priorityDiff = priorityOrder[a.priority] - priorityOrder[b.priority];
    if (priorityDiff !== 0) return priorityDiff;

    if (a.deadline && b.deadline) {
      return new Date(a.deadline).getTime() - new Date(b.deadline).getTime();
    }
    if (a.deadline) return -1;
    if (b.deadline) return 1;

    return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
  });
}

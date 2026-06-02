import { CATEGORIES, PRIORITIES } from '../constants/taskMeta';
import type { Task, TaskStats } from '../types/task';
import { isDueToday, isOverdue, parseLocalDate, startOfDay, endOfWeek } from './date';

export function calculateStats(tasks: Task[]): TaskStats {
  const todayStart = startOfDay();
  const todayEnd = new Date(todayStart);
  todayEnd.setHours(23, 59, 59, 999);
  const weekEnd = endOfWeek();

  const activeTasks = tasks.filter((t) => !t.completed);

  const byPriority = PRIORITIES.reduce(
    (acc, p) => {
      acc[p] = activeTasks.filter((t) => t.priority === p).length;
      return acc;
    },
    {} as TaskStats['byPriority'],
  );

  const byCategory = CATEGORIES.reduce(
    (acc, c) => {
      acc[c] = activeTasks.filter((t) => t.category === c).length;
      return acc;
    },
    {} as TaskStats['byCategory'],
  );

  const overdue = activeTasks.filter((t) => isOverdue(t.deadline, t.completed)).length;

  const dueToday = activeTasks.filter((t) => isDueToday(t.deadline)).length;

  const dueThisWeek = activeTasks.filter((t) => {
    if (!t.deadline) return false;
    const d = parseLocalDate(t.deadline);
    return d >= todayStart && d <= weekEnd;
  }).length;

  const completed = tasks.filter((t) => t.completed).length;

  return {
    total: tasks.length,
    completed,
    active: activeTasks.length,
    overdue,
    dueToday,
    dueThisWeek,
    byPriority,
    byCategory,
    completionRate: tasks.length > 0 ? Math.round((completed / tasks.length) * 100) : 0,
  };
}

import { CATEGORIES, CATEGORY_LABELS, PRIORITIES, PRIORITY_LABELS } from '../../constants/taskMeta';
import type { TaskStats } from '../../types/task';
import { StatCard } from './StatCard';

interface DashboardProps {
  stats: TaskStats;
}

export function Dashboard({ stats }: DashboardProps) {
  return (
    <section className="space-y-4" aria-label="Статистика">
      <div className="grid grid-cols-2 gap-3 min-[480px]:grid-cols-3 lg:grid-cols-4">
        <StatCard
          label="Всього"
          value={stats.total}
          accent="default"
          icon={
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
            </svg>
          }
        />
        <StatCard
          label="Активні"
          value={stats.active}
          accent="warning"
          icon={
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          }
        />
        <StatCard
          label="Виконані"
          value={stats.completed}
          accent="success"
          icon={
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          }
        />
        <StatCard
          label="Прострочені"
          value={stats.overdue}
          accent="danger"
          icon={
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          }
        />
        <StatCard
          label="Сьогодні"
          value={stats.dueToday}
          accent="warning"
          icon={
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          }
        />
        <StatCard
          label="Цього тижня"
          value={stats.dueThisWeek}
          accent="default"
          icon={
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          }
        />
      </div>

      <div className="rounded-2xl border border-border-light dark:border-border-dark bg-card-light dark:bg-card-dark p-4 shadow-sm">
        <div className="mb-3 flex items-center justify-between">
          <h3 className="font-semibold text-slate-900 dark:text-slate-100">Прогрес виконання</h3>
          <span className="text-2xl font-bold text-primary-600 dark:text-primary-400">
            {stats.completionRate}%
          </span>
        </div>
        <div
          className="h-2.5 w-full overflow-hidden rounded-full bg-slate-100 dark:bg-slate-700"
          role="progressbar"
          aria-valuenow={stats.completionRate}
          aria-valuemin={0}
          aria-valuemax={100}
          aria-label="Прогрес виконання"
        >
          <div
            className="h-full rounded-full bg-primary-500 transition-all duration-500"
            style={{ width: `${stats.completionRate}%` }}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div className="rounded-2xl border border-border-light dark:border-border-dark bg-card-light dark:bg-card-dark p-4 shadow-sm">
          <h3 className="mb-1 font-semibold text-slate-900 dark:text-slate-100">За пріоритетом</h3>
          <p className="mb-3 text-xs text-slate-500 dark:text-slate-400">Лише активні задачі</p>
          <ul className="space-y-2">
            {PRIORITIES.map((p) => (
              <li key={p} className="flex items-center justify-between text-sm">
                <span className="text-slate-600 dark:text-slate-400">{PRIORITY_LABELS[p]}</span>
                <span className="font-semibold text-slate-900 dark:text-slate-100">{stats.byPriority[p]}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="rounded-2xl border border-border-light dark:border-border-dark bg-card-light dark:bg-card-dark p-4 shadow-sm">
          <h3 className="mb-1 font-semibold text-slate-900 dark:text-slate-100">За категоріями</h3>
          <p className="mb-3 text-xs text-slate-500 dark:text-slate-400">Лише активні задачі</p>
          <ul className="space-y-2">
            {CATEGORIES.map((c) => (
              <li key={c} className="flex items-center justify-between text-sm">
                <span className="text-slate-600 dark:text-slate-400">{CATEGORY_LABELS[c]}</span>
                <span className="font-semibold text-slate-900 dark:text-slate-100">{stats.byCategory[c]}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}

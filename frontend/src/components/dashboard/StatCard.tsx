import type { ReactNode } from 'react';

interface StatCardProps {
  label: string;
  value: number | string;
  icon: ReactNode;
  accent?: 'default' | 'success' | 'warning' | 'danger';
}

const accentStyles = {
  default: 'bg-primary-50 text-primary-600 dark:bg-primary-900/30 dark:text-primary-400',
  success: 'bg-emerald-50 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-400',
  warning: 'bg-amber-50 text-amber-600 dark:bg-amber-900/30 dark:text-amber-400',
  danger: 'bg-rose-50 text-rose-600 dark:bg-rose-900/30 dark:text-rose-400',
};

export function StatCard({ label, value, icon, accent = 'default' }: StatCardProps) {
  return (
    <div className="rounded-2xl border border-border-light dark:border-border-dark bg-card-light dark:bg-card-dark p-4 shadow-sm">
      <div className="flex items-start justify-between gap-2">
        <div>
          <p className="text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wide">
            {label}
          </p>
          <p className="mt-1 text-2xl font-bold text-slate-900 dark:text-slate-100">{value}</p>
        </div>
        <div className={`rounded-xl p-2.5 ${accentStyles[accent]}`}>{icon}</div>
      </div>
    </div>
  );
}

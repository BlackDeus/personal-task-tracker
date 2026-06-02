import type { ReactNode } from 'react';
import { Link } from 'react-router-dom';
import { ThemeToggle } from '../ui/ThemeToggle';
import type { Theme } from '../../types/theme';

interface AuthLayoutProps {
  title: string;
  subtitle: string;
  theme: Theme;
  onToggleTheme: () => void;
  children: ReactNode;
}

export function AuthLayout({ title, subtitle, theme, onToggleTheme, children }: AuthLayoutProps) {
  return (
    <div className="flex min-h-screen flex-col bg-surface-light dark:bg-surface-dark">
      <div className="flex justify-end p-4">
        <ThemeToggle theme={theme} onToggle={onToggleTheme} />
      </div>

      <div className="flex flex-1 items-center justify-center px-4 pb-12">
        <div className="w-full max-w-md">
          <div className="mb-8 text-center">
            <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-primary-600 text-white">
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
              </svg>
            </div>
            <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100">{title}</h1>
            <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">{subtitle}</p>
          </div>

          <div className="rounded-2xl border border-border-light dark:border-border-dark bg-card-light dark:bg-card-dark p-6 shadow-sm">
            {children}
          </div>

          <p className="mt-6 text-center text-sm text-slate-500 dark:text-slate-400">
            <Link to="/" className="hover:text-primary-600 dark:hover:text-primary-400">
              ← На головну
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

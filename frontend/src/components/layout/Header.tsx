import type { Theme } from '../../types/theme';
import type { AppTab } from '../../types/task';
import { ThemeToggle } from '../ui/ThemeToggle';

interface HeaderProps {
  theme: Theme;
  onToggleTheme: () => void;
  activeTab: AppTab;
  onTabChange: (tab: AppTab) => void;
  username?: string;
  onLogout: () => void;
}

export function Header({
  theme,
  onToggleTheme,
  activeTab,
  onTabChange,
  username,
  onLogout,
}: HeaderProps) {
  return (
    <header className="sticky top-0 z-40 border-b border-border-light dark:border-border-dark bg-surface-light/80 dark:bg-surface-dark/80 backdrop-blur-lg supports-[backdrop-filter]:bg-surface-light/70">
      <div className="mx-auto max-w-4xl px-4 py-3 sm:px-6">
        <div className="flex items-center justify-between gap-2 sm:gap-4">
          <div className="flex min-w-0 items-center gap-2 sm:gap-2.5">
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-primary-600 text-white sm:h-9 sm:w-9">
              <svg className="h-4 w-4 sm:h-5 sm:w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
              </svg>
            </div>
            <div className="min-w-0">
              <h1 className="truncate text-base font-bold text-slate-900 dark:text-slate-100 sm:text-lg">
                Task Tracker
              </h1>
              {username && (
                <p className="truncate text-xs text-slate-500 dark:text-slate-400">
                  {username}
                </p>
              )}
            </div>
          </div>

          <div className="flex shrink-0 items-center gap-0.5 sm:gap-1">
            <nav className="flex rounded-xl bg-slate-100 p-0.5 dark:bg-slate-800 sm:p-1" aria-label="Навігація">
              <button
                type="button"
                role="tab"
                id="tab-tasks"
                aria-selected={activeTab === 'tasks'}
                aria-controls="panel-tasks"
                onClick={() => onTabChange('tasks')}
                className={`rounded-lg px-2.5 py-1.5 text-xs font-medium transition-colors sm:px-3 sm:text-sm ${
                  activeTab === 'tasks'
                    ? 'bg-white text-slate-900 shadow-sm dark:bg-slate-700 dark:text-slate-100'
                    : 'text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200'
                }`}
              >
                Задачі
              </button>
              <button
                type="button"
                role="tab"
                id="tab-dashboard"
                aria-selected={activeTab === 'dashboard'}
                aria-controls="panel-dashboard"
                onClick={() => onTabChange('dashboard')}
                className={`rounded-lg px-2.5 py-1.5 text-xs font-medium transition-colors sm:px-3 sm:text-sm ${
                  activeTab === 'dashboard'
                    ? 'bg-white text-slate-900 shadow-sm dark:bg-slate-700 dark:text-slate-100'
                    : 'text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200'
                }`}
              >
                Статистика
              </button>
            </nav>
            <button
              type="button"
              onClick={onLogout}
              className="rounded-xl px-2 py-1.5 text-xs font-medium text-slate-500 hover:bg-slate-100 hover:text-slate-700 dark:text-slate-400 dark:hover:bg-slate-700 dark:hover:text-slate-200 sm:px-3 sm:text-sm"
              aria-label="Вийти"
            >
              Вийти
            </button>
            <ThemeToggle theme={theme} onToggle={onToggleTheme} />
          </div>
        </div>
      </div>
    </header>
  );
}

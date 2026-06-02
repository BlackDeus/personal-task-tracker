import { useMemo, useState } from 'react';
import { Dashboard } from '../components/dashboard/Dashboard';
import { Header } from '../components/layout/Header';
import { TasksView } from '../features/tasks/TasksView';
import { useAuth } from '../contexts/AuthContext';
import { useTasks } from '../hooks/useTasks';
import { useTheme } from '../hooks/useTheme';
import type { AppTab } from '../types/task';
import { calculateStats } from '../utils/stats';

export function HomePage() {
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const {
    tasks,
    loading,
    error,
    refetch,
    addTask,
    updateTask,
    deleteTask,
    restoreTask,
    toggleComplete,
  } = useTasks();
  const [activeTab, setActiveTab] = useState<AppTab>('tasks');

  const stats = useMemo(() => calculateStats(tasks), [tasks]);

  return (
    <div className="flex min-h-screen flex-col">
      <Header
        theme={theme}
        onToggleTheme={toggleTheme}
        activeTab={activeTab}
        onTabChange={setActiveTab}
        username={user?.username}
        onLogout={logout}
      />

      <main className="mx-auto w-full max-w-4xl flex-1 px-4 py-6 pb-24 sm:px-6 sm:py-8 sm:pb-8">
        {loading && tasks.length === 0 ? (
          <div className="flex justify-center py-20">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary-200 border-t-primary-600" />
          </div>
        ) : error && tasks.length === 0 ? (
          <div className="rounded-2xl border border-rose-200 bg-rose-50 p-6 text-center dark:border-rose-800 dark:bg-rose-900/20">
            <p className="text-rose-700 dark:text-rose-300">{error}</p>
            <button
              type="button"
              onClick={refetch}
              className="mt-4 rounded-xl bg-primary-600 px-4 py-2 text-sm font-medium text-white hover:bg-primary-700"
            >
              Спробувати знову
            </button>
          </div>
        ) : activeTab === 'dashboard' ? (
          <div id="panel-dashboard" role="tabpanel" aria-labelledby="tab-dashboard">
            <Dashboard stats={stats} />
          </div>
        ) : (
          <TasksView
            tasks={tasks}
            onAddTask={addTask}
            onUpdateTask={updateTask}
            onDeleteTask={deleteTask}
            onRestoreTask={restoreTask}
            onToggleComplete={toggleComplete}
          />
        )}
      </main>
    </div>
  );
}

import { Component, type ErrorInfo, type ReactNode } from 'react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
}

export class ErrorBoundary extends Component<Props, State> {
  state: State = { hasError: false };

  static getDerivedStateFromError(): State {
    return { hasError: true };
  }

  componentDidCatch(error: Error, info: ErrorInfo): void {
    console.error('[ErrorBoundary]', error, info.componentStack);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="flex min-h-screen items-center justify-center p-6">
          <div className="max-w-md rounded-2xl border border-border-light dark:border-border-dark bg-card-light dark:bg-card-dark p-8 text-center shadow-lg">
            <h1 className="text-xl font-bold text-slate-900 dark:text-slate-100">
              Щось пішло не так
            </h1>
            <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">
              Спробуйте оновити сторінку. Ваші дані збережені локально.
            </p>
            <button
              type="button"
              onClick={() => window.location.reload()}
              className="mt-6 rounded-xl bg-primary-600 px-4 py-2.5 text-sm font-medium text-white hover:bg-primary-700 transition-colors"
            >
              Оновити сторінку
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

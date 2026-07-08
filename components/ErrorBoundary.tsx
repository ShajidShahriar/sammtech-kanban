'use client';

import React from 'react';

interface ErrorBoundaryProps {
  children: React.ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('ErrorBoundary caught:', error, errorInfo);
  }

  handleReload = () => {
    window.location.reload();
  };

  handleClearAndReload = () => {
    try {
      localStorage.removeItem('sammtech_kanban_board_data');
    } catch {}
    window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="flex-1 flex flex-col items-center justify-center gap-6 p-8 bg-white dark:bg-black text-gray-900 dark:text-gray-100 min-h-screen">
          <div className="flex flex-col items-center gap-3 text-center max-w-md">
            <div className="w-12 h-12 flex items-center justify-center rounded-full bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 text-2xl font-bold">
              !
            </div>
            <h1 className="text-xl font-bold">Something went wrong</h1>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              An unexpected error occurred. You can try reloading, or clear saved data if the issue persists.
            </p>
            {this.state.error && (
              <pre className="mt-2 text-xs text-red-500 bg-red-50 dark:bg-red-900/10 p-3 rounded-lg max-w-full overflow-x-auto border border-red-200 dark:border-red-800">
                {this.state.error.message}
              </pre>
            )}
          </div>
          <div className="flex gap-3">
            <button
              onClick={this.handleReload}
              className="px-4 py-2 text-sm font-medium rounded-lg bg-gray-900 dark:bg-white text-white dark:text-black hover:bg-gray-800 dark:hover:bg-gray-100 transition-colors"
            >
              Reload Page
            </button>
            <button
              onClick={this.handleClearAndReload}
              className="px-4 py-2 text-sm font-medium rounded-lg border border-red-300 dark:border-red-700 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
            >
              Clear Data & Reload
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

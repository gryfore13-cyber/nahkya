import { Component, type ReactNode } from 'react';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('[ErrorBoundary] Caught an error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div className="min-h-screen bg-nahkya-bg flex flex-col items-center justify-center px-6 text-center">
          <p className="font-display text-display-lg text-nahkya-text mb-3">
            Something went wrong.
          </p>
          <p className="font-body text-body-md text-nahkya-text-secondary mb-8 max-w-md">
            We encountered an unexpected issue. Please refresh the page or try again later.
          </p>
          <button
            onClick={() => window.location.reload()}
            className="px-6 py-3 bg-nahkya-highlight text-nahkya-text text-body-sm font-body font-medium uppercase tracking-wide hover:bg-nahkya-border transition-colors"
          >
            Refresh Page
          </button>
          {import.meta.env.DEV && this.state.error && (
            <pre className="mt-8 text-left text-xs font-mono text-nahkya-text-secondary bg-nahkya-surface p-4 rounded-nahkya max-w-2xl overflow-auto">
              {this.state.error.stack}
            </pre>
          )}
        </div>
      );
    }

    return this.props.children;
  }
}

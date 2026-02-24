import { Component, type ErrorInfo, type ReactNode } from 'react';

/**
 * Props for the {@link ErrorBoundary} component.
 */
interface ErrorBoundaryProps {
  /** Child components to render when there is no error. */
  children: ReactNode;
  /** Optional custom fallback UI to display when an error is caught. */
  fallback?: ReactNode;
  /**
   * Optional callback invoked when an error is caught.
   * Useful for logging to an external error reporting service.
   */
  onError?: (error: Error, errorInfo: ErrorInfo) => void;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

/**
 * React error boundary that catches JavaScript errors in its child component tree.
 * Displays a fallback UI instead of crashing the entire application.
 *
 * Wrap route-level components or critical features (e.g., recipe generation,
 * ratings) to provide graceful error recovery.
 *
 * @example
 * ```tsx
 * <ErrorBoundary fallback={<p>Something went wrong.</p>}>
 *   <RecipeDetailPage />
 * </ErrorBoundary>
 * ```
 */
export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    if (this.props.onError) {
      this.props.onError(error, errorInfo);
    }
    console.error('[ErrorBoundary] Caught error:', error, errorInfo);
  }

  private handleReset = () => {
    this.setState({ hasError: false, error: null });
  };

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div
          role="alert"
          className="min-h-[400px] flex items-center justify-center p-8"
        >
          <div className="text-center max-w-md">
            <div className="text-6xl mb-4" aria-hidden="true">
              &#x26A0;&#xFE0F;
            </div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
              Something went wrong
            </h2>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              An unexpected error occurred. Please try again.
            </p>
            {this.state.error && (
              <p className="text-sm text-red-600 dark:text-red-400 mb-6 font-mono bg-red-50 dark:bg-red-900/20 p-3 rounded-lg">
                {this.state.error.message}
              </p>
            )}
            <button
              onClick={this.handleReset}
              className="px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors font-medium"
            >
              Try Again
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

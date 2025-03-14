import React, { Component, ErrorInfo } from 'react';
import { ExclamationIcon } from '@heroicons/react/outline';

interface Props {
  children: React.ReactNode;
  fallback?: React.ReactNode;
  onError?: (error: Error, errorInfo: ErrorInfo) => void;
  resetKeys?: any[];
}

interface State {
  hasError: boolean;
  error: Error | null;
}

class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
    };
  }

  static getDerivedStateFromError(error: Error): State {
    return {
      hasError: true,
      error,
    };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    this.props.onError?.(error, errorInfo);
  }

  componentDidUpdate(prevProps: Props) {
    if (this.state.hasError && this.props.resetKeys) {
      if (
        prevProps.resetKeys &&
        this.props.resetKeys.some(
          (key, index) => key !== prevProps.resetKeys[index]
        )
      ) {
        this.reset();
      }
    }
  }

  reset = () => {
    this.setState({
      hasError: false,
      error: null,
    });
  };

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div className="flex flex-col items-center justify-center p-6 text-center">
          <div className="mb-4 p-3 rounded-full bg-danger-100 dark:bg-danger-900/20">
            <ExclamationIcon className="h-8 w-8 text-danger-600 dark:text-danger-400" />
          </div>
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
            Something went wrong
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mb-4">
            {this.state.error?.message || 'An unexpected error occurred'}
          </p>
          <button
            onClick={this.reset}
            className={`
              px-4 py-2 rounded-md
              text-sm font-medium text-white
              bg-danger-600 hover:bg-danger-700
              focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-danger-500
            `}
          >
            Try again
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}

interface ErrorBoundaryGroupProps {
  children: React.ReactNode;
  onError?: Props['onError'];
  fallback?: Props['fallback'];
}

export const ErrorBoundaryGroup: React.FC<ErrorBoundaryGroupProps> = ({
  children,
  onError,
  fallback,
}) => {
  return (
    <>
      {React.Children.map(children, (child, index) => (
        <ErrorBoundary key={index} onError={onError} fallback={fallback}>
          {child}
        </ErrorBoundary>
      ))}
    </>
  );
};

interface WithErrorBoundaryProps {
  onError?: Props['onError'];
  fallback?: Props['fallback'];
  resetKeys?: Props['resetKeys'];
}

export function withErrorBoundary<P extends object>(
  Component: React.ComponentType<P>,
  { onError, fallback, resetKeys }: WithErrorBoundaryProps = {}
) {
  return function WithErrorBoundary(props: P) {
    return (
      <ErrorBoundary onError={onError} fallback={fallback} resetKeys={resetKeys}>
        <Component {...props} />
      </ErrorBoundary>
    );
  };
}

export default ErrorBoundary;

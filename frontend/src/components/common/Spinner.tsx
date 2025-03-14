import React from 'react';

interface SpinnerProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  variant?: 'primary' | 'secondary' | 'white';
  className?: string;
}

const Spinner: React.FC<SpinnerProps> = ({
  size = 'md',
  variant = 'primary',
  className = '',
}) => {
  const sizeStyles = {
    sm: 'h-4 w-4',
    md: 'h-6 w-6',
    lg: 'h-8 w-8',
    xl: 'h-12 w-12',
  };

  const variantStyles = {
    primary: 'text-primary-600 dark:text-primary-500',
    secondary: 'text-gray-600 dark:text-gray-500',
    white: 'text-white',
  };

  const spinnerStyles = [
    'animate-spin',
    sizeStyles[size],
    variantStyles[variant],
    className,
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <svg
      className={spinnerStyles}
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      data-testid="spinner"
    >
      <circle
        className="opacity-25"
        cx="12"
        cy="12"
        r="10"
        stroke="currentColor"
        strokeWidth="4"
      />
      <path
        className="opacity-75"
        fill="currentColor"
        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
      />
    </svg>
  );
};

interface LoadingProps {
  text?: string;
  size?: SpinnerProps['size'];
  variant?: SpinnerProps['variant'];
  fullScreen?: boolean;
  className?: string;
}

export const Loading: React.FC<LoadingProps> = ({
  text,
  size = 'lg',
  variant = 'primary',
  fullScreen = false,
  className = '',
}) => {
  const containerStyles = [
    'flex flex-col items-center justify-center',
    fullScreen && 'fixed inset-0 bg-white/80 dark:bg-gray-900/80 z-50',
    !fullScreen && 'p-4',
    className,
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <div className={containerStyles} role="status">
      <Spinner size={size} variant={variant} />
      {text && (
        <p className="mt-4 text-sm font-medium text-gray-700 dark:text-gray-300">
          {text}
        </p>
      )}
    </div>
  );
};

interface LoadingOverlayProps {
  show: boolean;
  text?: string;
  blur?: boolean;
  className?: string;
}

export const LoadingOverlay: React.FC<LoadingOverlayProps> = ({
  show,
  text,
  blur = true,
  className = '',
}) => {
  if (!show) return null;

  const overlayStyles = [
    'absolute inset-0 flex items-center justify-center',
    blur && 'backdrop-blur-sm',
    'bg-white/50 dark:bg-gray-900/50',
    'z-50',
    className,
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <div className={overlayStyles}>
      <Loading text={text} />
    </div>
  );
};

export default Spinner;

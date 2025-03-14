import React, { forwardRef } from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  fullWidth?: boolean;
  variant?: 'outlined' | 'filled';
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  (
    {
      label,
      error,
      helperText,
      leftIcon,
      rightIcon,
      fullWidth = false,
      variant = 'outlined',
      className = '',
      disabled = false,
      ...props
    },
    ref
  ) => {
    const baseInputStyles = 'block w-full rounded-md shadow-sm focus:outline-none focus:ring-2 transition-colors duration-200';
    
    const variantStyles = {
      outlined: `
        border-gray-300 focus:border-primary-500 focus:ring-primary-500
        dark:border-gray-600 dark:bg-gray-700 dark:text-white
        dark:focus:border-primary-500 dark:focus:ring-primary-500
      `,
      filled: `
        border-transparent bg-gray-100 focus:bg-white focus:border-primary-500 focus:ring-primary-500
        dark:bg-gray-800 dark:focus:bg-gray-700 dark:text-white
        dark:focus:border-primary-500 dark:focus:ring-primary-500
      `,
    };

    const sizeStyles = leftIcon ? 'pl-10' : 'pl-4';
    const rightIconStyles = rightIcon ? 'pr-10' : 'pr-4';
    const errorStyles = error
      ? 'border-danger-500 focus:border-danger-500 focus:ring-danger-500'
      : '';
    const disabledStyles = disabled
      ? 'opacity-50 cursor-not-allowed bg-gray-100 dark:bg-gray-800'
      : '';
    const fullWidthStyles = fullWidth ? 'w-full' : 'w-auto';

    const inputStyles = [
      baseInputStyles,
      variantStyles[variant],
      sizeStyles,
      rightIconStyles,
      errorStyles,
      disabledStyles,
      fullWidthStyles,
      className,
    ]
      .filter(Boolean)
      .join(' ');

    return (
      <div className={`${fullWidth ? 'w-full' : 'w-auto'}`}>
        {label && (
          <label
            htmlFor={props.id}
            className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
          >
            {label}
          </label>
        )}
        <div className="relative">
          {leftIcon && (
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <span className="text-gray-500 dark:text-gray-400 sm:text-sm">
                {leftIcon}
              </span>
            </div>
          )}
          <input
            ref={ref}
            disabled={disabled}
            className={inputStyles}
            {...props}
          />
          {rightIcon && (
            <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
              <span className="text-gray-500 dark:text-gray-400 sm:text-sm">
                {rightIcon}
              </span>
            </div>
          )}
        </div>
        {(error || helperText) && (
          <p
            className={`mt-1 text-sm ${
              error
                ? 'text-danger-600 dark:text-danger-400'
                : 'text-gray-500 dark:text-gray-400'
            }`}
          >
            {error || helperText}
          </p>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';

export default Input;

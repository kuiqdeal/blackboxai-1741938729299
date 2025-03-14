import React from 'react';

interface RadioOption {
  value: string;
  label: string;
  description?: string;
  disabled?: boolean;
}

interface RadioProps {
  value: string;
  onChange: (value: string) => void;
  options: RadioOption[];
  name: string;
  label?: string;
  error?: string;
  size?: 'sm' | 'md' | 'lg';
  variant?: 'default' | 'card';
  className?: string;
}

const Radio: React.FC<RadioProps> = ({
  value,
  onChange,
  options,
  name,
  label,
  error,
  size = 'md',
  variant = 'default',
  className = '',
}) => {
  const sizeStyles = {
    sm: {
      radio: 'h-4 w-4',
      text: 'text-sm',
      description: 'text-xs',
      spacing: 'space-y-2',
    },
    md: {
      radio: 'h-5 w-5',
      text: 'text-base',
      description: 'text-sm',
      spacing: 'space-y-3',
    },
    lg: {
      radio: 'h-6 w-6',
      text: 'text-lg',
      description: 'text-base',
      spacing: 'space-y-4',
    },
  };

  return (
    <div className={className}>
      {label && (
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          {label}
        </label>
      )}
      <div className={sizeStyles[size].spacing}>
        {options.map((option) => (
          <label
            key={option.value}
            className={`
              relative flex
              ${
                variant === 'card'
                  ? `
                    p-4 rounded-lg border
                    ${
                      value === option.value
                        ? 'border-primary-500 ring-2 ring-primary-500'
                        : 'border-gray-200 dark:border-gray-700'
                    }
                    ${
                      option.disabled
                        ? 'opacity-50 cursor-not-allowed'
                        : 'cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800'
                    }
                  `
                  : `
                    ${option.disabled ? 'cursor-not-allowed' : 'cursor-pointer'}
                  `
              }
            `}
          >
            <div className="flex items-center">
              <input
                type="radio"
                name={name}
                value={option.value}
                checked={value === option.value}
                onChange={(e) => onChange(e.target.value)}
                disabled={option.disabled}
                className={`
                  form-radio
                  border-gray-300 dark:border-gray-600
                  text-primary-600
                  focus:ring-primary-500
                  ${sizeStyles[size].radio}
                  ${error ? 'border-danger-500' : ''}
                  ${option.disabled ? 'opacity-50 cursor-not-allowed' : ''}
                `}
              />
              <div className="ml-3">
                <span
                  className={`
                    font-medium
                    text-gray-900 dark:text-white
                    ${sizeStyles[size].text}
                    ${option.disabled ? 'opacity-50' : ''}
                  `}
                >
                  {option.label}
                </span>
                {option.description && (
                  <p
                    className={`
                      text-gray-500 dark:text-gray-400
                      ${sizeStyles[size].description}
                      ${option.disabled ? 'opacity-50' : ''}
                    `}
                  >
                    {option.description}
                  </p>
                )}
              </div>
            </div>
          </label>
        ))}
      </div>
      {error && (
        <p className="mt-1 text-sm text-danger-600 dark:text-danger-400">
          {error}
        </p>
      )}
    </div>
  );
};

interface RadioGroupProps {
  value: string;
  onChange: (value: string) => void;
  options: Array<{
    value: string;
    label: string;
    description?: string;
    disabled?: boolean;
  }>;
  name: string;
  orientation?: 'horizontal' | 'vertical';
  size?: RadioProps['size'];
  variant?: RadioProps['variant'];
  className?: string;
}

export const RadioGroup: React.FC<RadioGroupProps> = ({
  value,
  onChange,
  options,
  name,
  orientation = 'vertical',
  size = 'md',
  variant = 'default',
  className = '',
}) => {
  return (
    <div
      className={`
        ${orientation === 'horizontal' ? 'flex space-x-6' : 'space-y-2'}
        ${className}
      `}
    >
      {options.map((option) => (
        <label
          key={option.value}
          className={`
            relative flex
            ${
              variant === 'card'
                ? `
                  p-4 rounded-lg border
                  ${
                    value === option.value
                      ? 'border-primary-500 ring-2 ring-primary-500'
                      : 'border-gray-200 dark:border-gray-700'
                  }
                  ${
                    option.disabled
                      ? 'opacity-50 cursor-not-allowed'
                      : 'cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800'
                  }
                `
                : `
                  ${option.disabled ? 'cursor-not-allowed' : 'cursor-pointer'}
                `
            }
          `}
        >
          <input
            type="radio"
            name={name}
            value={option.value}
            checked={value === option.value}
            onChange={(e) => onChange(e.target.value)}
            disabled={option.disabled}
            className="sr-only"
          />
          <div className="flex items-center">
            <div
              className={`
                ${
                  value === option.value
                    ? 'bg-primary-600 border-transparent'
                    : 'bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600'
                }
                border-2 rounded-full
                ${option.disabled ? 'opacity-50' : ''}
                ${size === 'sm' ? 'h-4 w-4' : size === 'md' ? 'h-5 w-5' : 'h-6 w-6'}
              `}
            >
              <span
                className={`
                  block rounded-full
                  ${value === option.value ? 'bg-white dark:bg-gray-900' : ''}
                  ${
                    size === 'sm'
                      ? 'h-2 w-2 m-0.5'
                      : size === 'md'
                      ? 'h-2.5 w-2.5 m-0.75'
                      : 'h-3 w-3 m-1'
                  }
                `}
              />
            </div>
            <div className="ml-3">
              <span
                className={`
                  font-medium
                  text-gray-900 dark:text-white
                  ${size === 'sm' ? 'text-sm' : size === 'md' ? 'text-base' : 'text-lg'}
                  ${option.disabled ? 'opacity-50' : ''}
                `}
              >
                {option.label}
              </span>
              {option.description && (
                <p
                  className={`
                    text-gray-500 dark:text-gray-400
                    ${
                      size === 'sm'
                        ? 'text-xs'
                        : size === 'md'
                        ? 'text-sm'
                        : 'text-base'
                    }
                    ${option.disabled ? 'opacity-50' : ''}
                  `}
                >
                  {option.description}
                </p>
              )}
            </div>
          </div>
        </label>
      ))}
    </div>
  );
};

export default Radio;

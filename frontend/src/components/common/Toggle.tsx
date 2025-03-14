import React from 'react';

interface ToggleProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  label?: string;
  description?: string;
  disabled?: boolean;
  size?: 'sm' | 'md' | 'lg';
  color?: 'primary' | 'success' | 'warning' | 'danger';
  className?: string;
  error?: string;
}

const Toggle: React.FC<ToggleProps> = ({
  checked,
  onChange,
  label,
  description,
  disabled = false,
  size = 'md',
  color = 'primary',
  className = '',
  error,
}) => {
  const sizeStyles = {
    sm: {
      toggle: 'w-8 h-4',
      dot: 'h-3 w-3',
      translate: 'translate-x-4',
      text: 'text-sm',
      description: 'text-xs',
    },
    md: {
      toggle: 'w-11 h-6',
      dot: 'h-5 w-5',
      translate: 'translate-x-5',
      text: 'text-base',
      description: 'text-sm',
    },
    lg: {
      toggle: 'w-14 h-8',
      dot: 'h-7 w-7',
      translate: 'translate-x-6',
      text: 'text-lg',
      description: 'text-base',
    },
  };

  const colorStyles = {
    primary: {
      enabled: 'bg-primary-600',
      disabled: 'bg-primary-300 dark:bg-primary-700',
    },
    success: {
      enabled: 'bg-success-600',
      disabled: 'bg-success-300 dark:bg-success-700',
    },
    warning: {
      enabled: 'bg-warning-600',
      disabled: 'bg-warning-300 dark:bg-warning-700',
    },
    danger: {
      enabled: 'bg-danger-600',
      disabled: 'bg-danger-300 dark:bg-danger-700',
    },
  };

  return (
    <div className={className}>
      <button
        type="button"
        onClick={() => !disabled && onChange(!checked)}
        disabled={disabled}
        className={`
          group relative inline-flex
          ${sizeStyles[size].toggle}
          flex-shrink-0
          rounded-full
          border-2 border-transparent
          transition-colors ease-in-out duration-200
          focus:outline-none focus:ring-2 focus:ring-offset-2
          ${
            checked
              ? colorStyles[color][disabled ? 'disabled' : 'enabled']
              : 'bg-gray-200 dark:bg-gray-700'
          }
          ${disabled ? 'cursor-not-allowed' : 'cursor-pointer'}
          ${error ? 'focus:ring-danger-500' : `focus:ring-${color}-500`}
        `}
        role="switch"
        aria-checked={checked}
      >
        <span
          className={`
            pointer-events-none
            inline-block
            ${sizeStyles[size].dot}
            rounded-full
            bg-white dark:bg-gray-100
            shadow
            transform ring-0
            transition ease-in-out duration-200
            ${checked ? sizeStyles[size].translate : 'translate-x-0'}
          `}
        />
      </button>
      {(label || description) && (
        <div className="ml-3">
          {label && (
            <span
              className={`
                font-medium
                text-gray-900 dark:text-white
                ${disabled ? 'opacity-50' : ''}
                ${sizeStyles[size].text}
              `}
            >
              {label}
            </span>
          )}
          {description && (
            <p
              className={`
                text-gray-500 dark:text-gray-400
                ${disabled ? 'opacity-50' : ''}
                ${sizeStyles[size].description}
              `}
            >
              {description}
            </p>
          )}
        </div>
      )}
      {error && (
        <p className="mt-1 text-sm text-danger-600 dark:text-danger-400">
          {error}
        </p>
      )}
    </div>
  );
};

interface ToggleGroupProps {
  value: string[];
  onChange: (value: string[]) => void;
  options: Array<{
    value: string;
    label: string;
    description?: string;
    disabled?: boolean;
  }>;
  label?: string;
  size?: ToggleProps['size'];
  color?: ToggleProps['color'];
  className?: string;
  error?: string;
}

export const ToggleGroup: React.FC<ToggleGroupProps> = ({
  value,
  onChange,
  options,
  label,
  size,
  color,
  className = '',
  error,
}) => {
  const handleChange = (optionValue: string, checked: boolean) => {
    if (checked) {
      onChange([...value, optionValue]);
    } else {
      onChange(value.filter((v) => v !== optionValue));
    }
  };

  return (
    <div className={className}>
      {label && (
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          {label}
        </label>
      )}
      <div className="space-y-4">
        {options.map((option) => (
          <Toggle
            key={option.value}
            checked={value.includes(option.value)}
            onChange={(checked) => handleChange(option.value, checked)}
            label={option.label}
            description={option.description}
            disabled={option.disabled}
            size={size}
            color={color}
          />
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

export default Toggle;

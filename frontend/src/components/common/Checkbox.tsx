import React from 'react';
import { CheckIcon } from '@heroicons/react/solid';

interface CheckboxProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  label?: string;
  description?: string;
  disabled?: boolean;
  error?: string;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  indeterminate?: boolean;
}

const Checkbox: React.FC<CheckboxProps> = ({
  checked,
  onChange,
  label,
  description,
  disabled = false,
  error,
  size = 'md',
  className = '',
  indeterminate = false,
}) => {
  const checkboxRef = React.useRef<HTMLInputElement>(null);

  React.useEffect(() => {
    if (checkboxRef.current) {
      checkboxRef.current.indeterminate = indeterminate;
    }
  }, [indeterminate]);

  const sizeStyles = {
    sm: {
      checkbox: 'h-4 w-4',
      icon: 'h-3 w-3',
      label: 'text-sm',
      description: 'text-xs',
    },
    md: {
      checkbox: 'h-5 w-5',
      icon: 'h-4 w-4',
      label: 'text-base',
      description: 'text-sm',
    },
    lg: {
      checkbox: 'h-6 w-6',
      icon: 'h-5 w-5',
      label: 'text-lg',
      description: 'text-base',
    },
  };

  return (
    <div className={className}>
      <label className="inline-flex items-start relative">
        <div className="flex items-center h-5">
          <input
            ref={checkboxRef}
            type="checkbox"
            checked={checked}
            onChange={(e) => onChange(e.target.checked)}
            disabled={disabled}
            className={`
              form-checkbox
              rounded
              border-gray-300 dark:border-gray-600
              text-primary-600
              focus:ring-primary-500
              disabled:opacity-50
              disabled:cursor-not-allowed
              ${error ? 'border-danger-500' : ''}
              ${sizeStyles[size].checkbox}
            `}
          />
          {(checked || indeterminate) && !disabled && (
            <div
              className={`
                absolute
                pointer-events-none
                text-white dark:text-gray-900
                ${sizeStyles[size].icon}
              `}
              style={{
                left: '50%',
                top: '50%',
                transform: 'translate(-50%, -50%)',
              }}
            >
              {indeterminate ? (
                <div className="h-0.5 w-2/3 bg-current mx-auto" />
              ) : (
                <CheckIcon />
              )}
            </div>
          )}
        </div>
        {(label || description) && (
          <div className="ml-3">
            {label && (
              <span
                className={`
                  font-medium
                  text-gray-900 dark:text-gray-100
                  ${disabled ? 'opacity-50' : ''}
                  ${sizeStyles[size].label}
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
      </label>
      {error && (
        <p className="mt-1 text-sm text-danger-600 dark:text-danger-400">
          {error}
        </p>
      )}
    </div>
  );
};

interface CheckboxGroupProps {
  value: string[];
  onChange: (value: string[]) => void;
  options: Array<{
    value: string;
    label: string;
    description?: string;
    disabled?: boolean;
  }>;
  label?: string;
  error?: string;
  size?: CheckboxProps['size'];
  className?: string;
}

export const CheckboxGroup: React.FC<CheckboxGroupProps> = ({
  value,
  onChange,
  options,
  label,
  error,
  size = 'md',
  className = '',
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
      <div className="space-y-2">
        {options.map((option) => (
          <Checkbox
            key={option.value}
            checked={value.includes(option.value)}
            onChange={(checked) => handleChange(option.value, checked)}
            label={option.label}
            description={option.description}
            disabled={option.disabled}
            size={size}
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

export default Checkbox;

import React from 'react';
import { ChevronDownIcon } from '@heroicons/react/solid';

interface SelectOption {
  value: string;
  label: string;
  disabled?: boolean;
}

interface SelectProps {
  value: string;
  onChange: (value: string) => void;
  options: SelectOption[];
  label?: string;
  placeholder?: string;
  error?: string;
  disabled?: boolean;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  required?: boolean;
}

const Select: React.FC<SelectProps> = ({
  value,
  onChange,
  options,
  label,
  placeholder = 'Select an option',
  error,
  disabled = false,
  size = 'md',
  className = '',
  required = false,
}) => {
  const sizeStyles = {
    sm: {
      select: 'px-2.5 py-1.5 text-sm',
      icon: 'h-4 w-4',
    },
    md: {
      select: 'px-3 py-2 text-base',
      icon: 'h-5 w-5',
    },
    lg: {
      select: 'px-4 py-2.5 text-lg',
      icon: 'h-6 w-6',
    },
  };

  return (
    <div className={className}>
      {label && (
        <label
          htmlFor="select"
          className={`
            block mb-1
            text-sm font-medium
            text-gray-700 dark:text-gray-300
          `}
        >
          {label}
          {required && (
            <span className="ml-1 text-danger-500" aria-hidden="true">
              *
            </span>
          )}
        </label>
      )}
      <div className="relative">
        <select
          id="select"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          disabled={disabled}
          required={required}
          className={`
            block w-full
            rounded-md
            bg-white dark:bg-gray-800
            border
            ${
              error
                ? 'border-danger-500 focus:ring-danger-500 focus:border-danger-500'
                : 'border-gray-300 dark:border-gray-600 focus:ring-primary-500 focus:border-primary-500'
            }
            ${disabled ? 'opacity-50 cursor-not-allowed' : ''}
            ${sizeStyles[size].select}
            appearance-none
          `}
        >
          {placeholder && (
            <option value="" disabled>
              {placeholder}
            </option>
          )}
          {options.map((option) => (
            <option
              key={option.value}
              value={option.value}
              disabled={option.disabled}
            >
              {option.label}
            </option>
          ))}
        </select>
        <div
          className={`
            absolute inset-y-0 right-0
            flex items-center
            pr-2 pointer-events-none
            ${error ? 'text-danger-500' : 'text-gray-400'}
          `}
        >
          <ChevronDownIcon className={sizeStyles[size].icon} />
        </div>
      </div>
      {error && (
        <p className="mt-1 text-sm text-danger-600 dark:text-danger-400">
          {error}
        </p>
      )}
    </div>
  );
};

interface SelectGroupProps {
  value: string[];
  onChange: (value: string[]) => void;
  options: SelectOption[];
  label?: string;
  error?: string;
  size?: SelectProps['size'];
  className?: string;
}

export const SelectGroup: React.FC<SelectGroupProps> = ({
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
          <label
            key={option.value}
            className={`
              relative flex items-center
              ${option.disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
            `}
          >
            <input
              type="checkbox"
              checked={value.includes(option.value)}
              onChange={(e) => handleChange(option.value, e.target.checked)}
              disabled={option.disabled}
              className={`
                form-checkbox
                rounded
                border-gray-300 dark:border-gray-600
                text-primary-600
                focus:ring-primary-500
                ${error ? 'border-danger-500' : ''}
                ${
                  size === 'sm'
                    ? 'h-4 w-4'
                    : size === 'md'
                    ? 'h-5 w-5'
                    : 'h-6 w-6'
                }
              `}
            />
            <span
              className={`
                ml-2
                text-gray-900 dark:text-white
                ${
                  size === 'sm'
                    ? 'text-sm'
                    : size === 'md'
                    ? 'text-base'
                    : 'text-lg'
                }
              `}
            >
              {option.label}
            </span>
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

export default Select;

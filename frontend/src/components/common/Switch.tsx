import React from 'react';
import { Switch as HeadlessSwitch } from '@headlessui/react';

interface SwitchProps {
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

const Switch: React.FC<SwitchProps> = ({
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
      switch: 'h-5 w-9',
      thumb: 'h-3.5 w-3.5',
      translate: 'translate-x-4',
      text: 'text-sm',
      description: 'text-xs',
    },
    md: {
      switch: 'h-6 w-11',
      thumb: 'h-4 w-4',
      translate: 'translate-x-5',
      text: 'text-base',
      description: 'text-sm',
    },
    lg: {
      switch: 'h-7 w-14',
      thumb: 'h-5 w-5',
      translate: 'translate-x-7',
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
      <HeadlessSwitch.Group>
        <div className="flex items-start">
          <HeadlessSwitch
            checked={checked}
            onChange={onChange}
            disabled={disabled}
            className={`
              relative inline-flex
              flex-shrink-0
              rounded-full
              transition-colors duration-200 ease-in-out
              focus:outline-none focus:ring-2 focus:ring-offset-2
              ${
                checked
                  ? colorStyles[color][disabled ? 'disabled' : 'enabled']
                  : 'bg-gray-200 dark:bg-gray-700'
              }
              ${disabled ? 'cursor-not-allowed' : 'cursor-pointer'}
              ${sizeStyles[size].switch}
              ${error ? 'focus:ring-danger-500' : `focus:ring-${color}-500`}
            `}
          >
            <span
              className={`
                inline-block
                rounded-full
                bg-white
                shadow transform
                transition duration-200 ease-in-out
                ${checked ? sizeStyles[size].translate : 'translate-x-1'}
                ${sizeStyles[size].thumb}
              `}
            />
          </HeadlessSwitch>
          {(label || description) && (
            <div className="ml-3">
              {label && (
                <HeadlessSwitch.Label
                  className={`
                    font-medium
                    text-gray-900 dark:text-gray-100
                    ${disabled ? 'opacity-50' : ''}
                    ${sizeStyles[size].text}
                  `}
                >
                  {label}
                </HeadlessSwitch.Label>
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
        </div>
      </HeadlessSwitch.Group>
      {error && (
        <p className="mt-1 text-sm text-danger-600 dark:text-danger-400">
          {error}
        </p>
      )}
    </div>
  );
};

interface SwitchGroupProps {
  value: string[];
  onChange: (value: string[]) => void;
  options: Array<{
    value: string;
    label: string;
    description?: string;
    disabled?: boolean;
  }>;
  label?: string;
  size?: SwitchProps['size'];
  color?: SwitchProps['color'];
  className?: string;
  error?: string;
}

export const SwitchGroup: React.FC<SwitchGroupProps> = ({
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
          <Switch
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

export default Switch;

import React, { useState } from 'react';
import { Combobox as HeadlessCombobox } from '@headlessui/react';
import { CheckIcon, SelectorIcon } from '@heroicons/react/solid';

interface Option {
  value: string | number;
  label: string;
  description?: string;
  disabled?: boolean;
}

interface ComboboxProps {
  value: Option | null;
  onChange: (option: Option) => void;
  options: Option[];
  label?: string;
  placeholder?: string;
  error?: string;
  disabled?: boolean;
  className?: string;
  size?: 'sm' | 'md' | 'lg';
  clearable?: boolean;
  loading?: boolean;
}

const Combobox: React.FC<ComboboxProps> = ({
  value,
  onChange,
  options,
  label,
  placeholder = 'Select an option',
  error,
  disabled = false,
  className = '',
  size = 'md',
  clearable = false,
  loading = false,
}) => {
  const [query, setQuery] = useState('');

  const filteredOptions =
    query === ''
      ? options
      : options.filter((option) =>
          option.label
            .toLowerCase()
            .replace(/\s+/g, '')
            .includes(query.toLowerCase().replace(/\s+/g, ''))
        );

  const sizeStyles = {
    sm: {
      input: 'py-1.5 text-sm',
      options: 'text-sm',
    },
    md: {
      input: 'py-2 text-base',
      options: 'text-base',
    },
    lg: {
      input: 'py-2.5 text-lg',
      options: 'text-lg',
    },
  };

  return (
    <div className={className}>
      <HeadlessCombobox
        value={value}
        onChange={onChange}
        disabled={disabled}
        nullable={clearable}
      >
        {({ open }) => (
          <div className="relative">
            {label && (
              <HeadlessCombobox.Label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                {label}
              </HeadlessCombobox.Label>
            )}
            <div className="relative">
              <HeadlessCombobox.Input
                className={`
                  w-full rounded-md border
                  ${
                    error
                      ? 'border-danger-500 focus:border-danger-500 focus:ring-danger-500'
                      : 'border-gray-300 dark:border-gray-600 focus:border-primary-500 focus:ring-primary-500'
                  }
                  bg-white dark:bg-gray-800
                  text-gray-900 dark:text-white
                  disabled:bg-gray-50 dark:disabled:bg-gray-900
                  disabled:text-gray-500 dark:disabled:text-gray-400
                  disabled:cursor-not-allowed
                  pl-3 pr-10
                  focus:outline-none focus:ring-2
                  ${sizeStyles[size].input}
                `}
                onChange={(event) => setQuery(event.target.value)}
                displayValue={(option: Option) => option?.label ?? ''}
                placeholder={placeholder}
              />
              <HeadlessCombobox.Button className="absolute inset-y-0 right-0 flex items-center px-2">
                {loading ? (
                  <div className="animate-spin h-5 w-5 text-gray-400">
                    <svg
                      className="h-5 w-5"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
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
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                      />
                    </svg>
                  </div>
                ) : (
                  <SelectorIcon className="h-5 w-5 text-gray-400" aria-hidden="true" />
                )}
              </HeadlessCombobox.Button>
            </div>

            <HeadlessCombobox.Options
              className={`
                absolute z-10 mt-1 w-full
                bg-white dark:bg-gray-800
                rounded-md shadow-lg
                max-h-60 overflow-auto
                focus:outline-none
                border border-gray-200 dark:border-gray-700
                ${sizeStyles[size].options}
              `}
            >
              {filteredOptions.length === 0 && query !== '' ? (
                <div className="px-4 py-2 text-sm text-gray-500 dark:text-gray-400">
                  No options found
                </div>
              ) : (
                filteredOptions.map((option) => (
                  <HeadlessCombobox.Option
                    key={option.value}
                    value={option}
                    disabled={option.disabled}
                    className={({ active, disabled }) => `
                      relative cursor-pointer select-none py-2 pl-3 pr-9
                      ${
                        active
                          ? 'bg-primary-100 dark:bg-primary-900/20 text-primary-900 dark:text-primary-100'
                          : 'text-gray-900 dark:text-gray-100'
                      }
                      ${
                        disabled
                          ? 'opacity-50 cursor-not-allowed'
                          : 'hover:bg-primary-50 dark:hover:bg-primary-900/10'
                      }
                    `}
                  >
                    {({ selected }) => (
                      <>
                        <div>
                          <span className={`block truncate ${selected ? 'font-semibold' : 'font-normal'}`}>
                            {option.label}
                          </span>
                          {option.description && (
                            <span className="block truncate text-sm text-gray-500 dark:text-gray-400">
                              {option.description}
                            </span>
                          )}
                        </div>
                        {selected && (
                          <span className="absolute inset-y-0 right-0 flex items-center pr-3 text-primary-600 dark:text-primary-400">
                            <CheckIcon className="h-5 w-5" aria-hidden="true" />
                          </span>
                        )}
                      </>
                    )}
                  </HeadlessCombobox.Option>
                ))
              )}
            </HeadlessCombobox.Options>
          </div>
        )}
      </HeadlessCombobox>
      {error && (
        <p className="mt-2 text-sm text-danger-600 dark:text-danger-400">
          {error}
        </p>
      )}
    </div>
  );
};

export default Combobox;

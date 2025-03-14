import React, { Fragment } from 'react';
import { Menu, Transition } from '@headlessui/react';
import { ChevronDownIcon } from '@heroicons/react/solid';

interface DropdownProps {
  trigger?: React.ReactNode;
  items: Array<{
    label: string;
    onClick?: () => void;
    icon?: React.ReactNode;
    disabled?: boolean;
    danger?: boolean;
    divider?: boolean;
  }>;
  align?: 'left' | 'right';
  width?: 'auto' | 'w-48' | 'w-56' | 'w-64';
  className?: string;
}

const Dropdown: React.FC<DropdownProps> = ({
  trigger,
  items,
  align = 'right',
  width = 'w-48',
  className = '',
}) => {
  const alignmentStyles = {
    left: 'left-0 origin-top-left',
    right: 'right-0 origin-top-right',
  };

  return (
    <Menu as="div" className={`relative inline-block text-left ${className}`}>
      {({ open }) => (
        <>
          <Menu.Button
            className={`
              inline-flex items-center justify-center px-4 py-2
              text-sm font-medium text-gray-700 dark:text-gray-200
              bg-white dark:bg-gray-800 rounded-md
              border border-gray-300 dark:border-gray-700
              hover:bg-gray-50 dark:hover:bg-gray-700
              focus:outline-none focus:ring-2 focus:ring-offset-2
              focus:ring-primary-500 dark:focus:ring-offset-gray-800
            `}
          >
            {trigger || (
              <>
                Options
                <ChevronDownIcon className="w-5 h-5 ml-2 -mr-1" aria-hidden="true" />
              </>
            )}
          </Menu.Button>

          <Transition
            show={open}
            as={Fragment}
            enter="transition ease-out duration-100"
            enterFrom="transform opacity-0 scale-95"
            enterTo="transform opacity-100 scale-100"
            leave="transition ease-in duration-75"
            leaveFrom="transform opacity-100 scale-100"
            leaveTo="transform opacity-0 scale-95"
          >
            <Menu.Items
              className={`
                absolute z-10 mt-2 ${width} ${alignmentStyles[align]}
                rounded-md shadow-lg
                bg-white dark:bg-gray-800
                ring-1 ring-black ring-opacity-5
                divide-y divide-gray-100 dark:divide-gray-700
                focus:outline-none
              `}
            >
              {items.map((item, index) => (
                <Fragment key={index}>
                  {item.divider ? (
                    <div className="h-px bg-gray-200 dark:bg-gray-700 my-1" />
                  ) : (
                    <Menu.Item disabled={item.disabled}>
                      {({ active }) => (
                        <button
                          type="button"
                          className={`
                            ${
                              active
                                ? 'bg-gray-100 dark:bg-gray-700'
                                : 'text-gray-900 dark:text-gray-200'
                            }
                            ${item.danger ? 'text-danger-600 dark:text-danger-400' : ''}
                            ${item.disabled ? 'opacity-50 cursor-not-allowed' : ''}
                            group flex items-center w-full px-4 py-2 text-sm
                          `}
                          onClick={item.onClick}
                          disabled={item.disabled}
                        >
                          {item.icon && (
                            <span className="mr-3 h-5 w-5" aria-hidden="true">
                              {item.icon}
                            </span>
                          )}
                          {item.label}
                        </button>
                      )}
                    </Menu.Item>
                  )}
                </Fragment>
              ))}
            </Menu.Items>
          </Transition>
        </>
      )}
    </Menu>
  );
};

interface DropdownButtonProps extends DropdownProps {
  variant?: 'primary' | 'secondary' | 'danger' | 'outline';
  size?: 'sm' | 'md' | 'lg';
  fullWidth?: boolean;
  loading?: boolean;
}

export const DropdownButton: React.FC<DropdownButtonProps> = ({
  variant = 'primary',
  size = 'md',
  fullWidth = false,
  loading = false,
  ...props
}) => {
  const variantStyles = {
    primary: 'bg-primary-600 text-white hover:bg-primary-700',
    secondary: 'bg-gray-600 text-white hover:bg-gray-700',
    danger: 'bg-danger-600 text-white hover:bg-danger-700',
    outline: 'bg-transparent border border-gray-300 text-gray-700 hover:bg-gray-50',
  };

  const sizeStyles = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2 text-base',
    lg: 'px-6 py-3 text-lg',
  };

  const buttonStyles = [
    'inline-flex items-center justify-center font-medium rounded-md',
    'focus:outline-none focus:ring-2 focus:ring-offset-2',
    variantStyles[variant],
    sizeStyles[size],
    fullWidth && 'w-full',
    loading && 'opacity-75 cursor-not-allowed',
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <Dropdown
      {...props}
      trigger={
        <button type="button" className={buttonStyles} disabled={loading}>
          {loading && (
            <svg
              className="animate-spin -ml-1 mr-2 h-4 w-4"
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
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              />
            </svg>
          )}
          {props.trigger || 'Options'}
          <ChevronDownIcon className="w-5 h-5 ml-2 -mr-1" aria-hidden="true" />
        </button>
      }
    />
  );
};

export default Dropdown;

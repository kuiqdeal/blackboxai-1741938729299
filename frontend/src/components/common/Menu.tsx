import React from 'react';
import { Menu as HeadlessMenu, Transition } from '@headlessui/react';
import { ChevronDownIcon } from '@heroicons/react/solid';

interface MenuItem {
  label: string;
  icon?: React.ReactNode;
  onClick?: () => void;
  disabled?: boolean;
  divider?: boolean;
  danger?: boolean;
}

interface MenuProps {
  trigger: React.ReactNode;
  items: MenuItem[];
  position?: 'left' | 'right';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  width?: string;
}

const Menu: React.FC<MenuProps> = ({
  trigger,
  items,
  position = 'right',
  size = 'md',
  className = '',
  width = 'w-48',
}) => {
  const sizeStyles = {
    sm: {
      button: 'text-sm',
      items: 'py-1',
      item: 'px-3 py-1 text-sm',
    },
    md: {
      button: 'text-base',
      items: 'py-1',
      item: 'px-4 py-2 text-sm',
    },
    lg: {
      button: 'text-lg',
      items: 'py-2',
      item: 'px-4 py-2 text-base',
    },
  };

  return (
    <HeadlessMenu as="div" className={`relative inline-block text-left ${className}`}>
      {({ open }) => (
        <>
          <HeadlessMenu.Button className={sizeStyles[size].button}>
            {trigger}
          </HeadlessMenu.Button>

          <Transition
            show={open}
            as={React.Fragment}
            enter="transition ease-out duration-100"
            enterFrom="transform opacity-0 scale-95"
            enterTo="transform opacity-100 scale-100"
            leave="transition ease-in duration-75"
            leaveFrom="transform opacity-100 scale-100"
            leaveTo="transform opacity-0 scale-95"
          >
            <HeadlessMenu.Items
              className={`
                absolute z-10 mt-2
                ${position === 'right' ? 'right-0' : 'left-0'}
                ${width}
                bg-white dark:bg-gray-800
                rounded-md shadow-lg
                ring-1 ring-black ring-opacity-5
                focus:outline-none
                ${sizeStyles[size].items}
              `}
            >
              <div className="divide-y divide-gray-100 dark:divide-gray-700">
                {items.map((item, index) => (
                  <React.Fragment key={index}>
                    {item.divider && index !== 0 && (
                      <div className="h-px my-1 bg-gray-200 dark:bg-gray-700" />
                    )}
                    <HeadlessMenu.Item disabled={item.disabled}>
                      {({ active }) => (
                        <button
                          type="button"
                          className={`
                            group flex items-center w-full
                            ${sizeStyles[size].item}
                            ${
                              item.disabled
                                ? 'cursor-not-allowed opacity-50'
                                : active
                                ? item.danger
                                  ? 'bg-danger-50 text-danger-900 dark:bg-danger-900/20 dark:text-danger-100'
                                  : 'bg-gray-100 text-gray-900 dark:bg-gray-700 dark:text-white'
                                : item.danger
                                ? 'text-danger-700 dark:text-danger-400'
                                : 'text-gray-700 dark:text-gray-300'
                            }
                          `}
                          onClick={item.disabled ? undefined : item.onClick}
                        >
                          {item.icon && (
                            <span
                              className={`
                                mr-3 h-5 w-5
                                ${
                                  item.danger
                                    ? 'text-danger-500 dark:text-danger-400'
                                    : 'text-gray-400 dark:text-gray-500'
                                }
                                ${active ? 'text-gray-500 dark:text-gray-400' : ''}
                              `}
                            >
                              {item.icon}
                            </span>
                          )}
                          {item.label}
                        </button>
                      )}
                    </HeadlessMenu.Item>
                  </React.Fragment>
                ))}
              </div>
            </HeadlessMenu.Items>
          </Transition>
        </>
      )}
    </HeadlessMenu>
  );
};

interface MenuButtonProps {
  label: string;
  icon?: React.ReactNode;
  items: MenuItem[];
  variant?: 'primary' | 'secondary' | 'outline';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export const MenuButton: React.FC<MenuButtonProps> = ({
  label,
  icon,
  items,
  variant = 'primary',
  size = 'md',
  className = '',
}) => {
  const variantStyles = {
    primary: 'bg-primary-600 text-white hover:bg-primary-700 focus:ring-primary-500',
    secondary: 'bg-white text-gray-700 hover:bg-gray-50 focus:ring-primary-500',
    outline: 'border border-gray-300 bg-white text-gray-700 hover:bg-gray-50 focus:ring-primary-500',
  };

  const sizeStyles = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2 text-base',
    lg: 'px-5 py-2.5 text-lg',
  };

  return (
    <Menu
      trigger={
        <div
          className={`
            inline-flex items-center justify-center
            font-medium rounded-md
            focus:outline-none focus:ring-2 focus:ring-offset-2
            ${variantStyles[variant]}
            ${sizeStyles[size]}
            ${className}
          `}
        >
          {icon && <span className="mr-2">{icon}</span>}
          {label}
          <ChevronDownIcon className="ml-2 -mr-1 h-5 w-5" aria-hidden="true" />
        </div>
      }
      items={items}
      size={size}
    />
  );
};

export default Menu;

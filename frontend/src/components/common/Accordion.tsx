import React from 'react';
import { Disclosure, Transition } from '@headlessui/react';
import { ChevronDownIcon } from '@heroicons/react/solid';

interface AccordionItemProps {
  title: React.ReactNode;
  children: React.ReactNode;
  defaultOpen?: boolean;
  disabled?: boolean;
  icon?: React.ReactNode;
  className?: string;
}

interface AccordionProps {
  items: AccordionItemProps[];
  variant?: 'default' | 'bordered' | 'separated';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

const AccordionItem: React.FC<AccordionItemProps> = ({
  title,
  children,
  defaultOpen = false,
  disabled = false,
  icon,
  className = '',
}) => {
  return (
    <Disclosure defaultOpen={defaultOpen}>
      {({ open }) => (
        <div className={className}>
          <Disclosure.Button
            disabled={disabled}
            className={`
              flex justify-between items-center w-full
              px-4 py-3
              text-left
              rounded-lg
              focus:outline-none focus:ring-2 focus:ring-primary-500
              ${
                disabled
                  ? 'cursor-not-allowed opacity-50'
                  : 'hover:bg-gray-50 dark:hover:bg-gray-800'
              }
            `}
          >
            <div className="flex items-center">
              {icon && <span className="mr-3 text-gray-400">{icon}</span>}
              <span className="font-medium text-gray-900 dark:text-white">
                {title}
              </span>
            </div>
            <ChevronDownIcon
              className={`
                w-5 h-5
                text-gray-400
                transition-transform duration-200
                ${open ? 'transform rotate-180' : ''}
              `}
            />
          </Disclosure.Button>
          <Transition
            enter="transition duration-100 ease-out"
            enterFrom="transform scale-95 opacity-0"
            enterTo="transform scale-100 opacity-100"
            leave="transition duration-75 ease-out"
            leaveFrom="transform scale-100 opacity-100"
            leaveTo="transform scale-95 opacity-0"
          >
            <Disclosure.Panel className="px-4 py-3">
              <div className="text-gray-600 dark:text-gray-300">{children}</div>
            </Disclosure.Panel>
          </Transition>
        </div>
      )}
    </Disclosure>
  );
};

const Accordion: React.FC<AccordionProps> = ({
  items,
  variant = 'default',
  size = 'md',
  className = '',
}) => {
  const variantStyles = {
    default: 'divide-y divide-gray-200 dark:divide-gray-700',
    bordered:
      'border border-gray-200 dark:border-gray-700 rounded-lg divide-y divide-gray-200 dark:divide-gray-700',
    separated: 'space-y-2',
  };

  const sizeStyles = {
    sm: {
      padding: 'px-3 py-2',
      text: 'text-sm',
    },
    md: {
      padding: 'px-4 py-3',
      text: 'text-base',
    },
    lg: {
      padding: 'px-5 py-4',
      text: 'text-lg',
    },
  };

  return (
    <div
      className={`
        ${variantStyles[variant]}
        ${className}
      `}
    >
      {items.map((item, index) => (
        <AccordionItem
          key={index}
          {...item}
          className={`
            ${sizeStyles[size].text}
            ${variant === 'separated' ? 'border border-gray-200 dark:border-gray-700 rounded-lg' : ''}
          `}
        />
      ))}
    </div>
  );
};

interface AccordionGroupProps {
  children: React.ReactNode;
  variant?: AccordionProps['variant'];
  size?: AccordionProps['size'];
  className?: string;
}

export const AccordionGroup: React.FC<AccordionGroupProps> = ({
  children,
  variant = 'default',
  size = 'md',
  className = '',
}) => {
  return (
    <div
      className={`
        ${variant === 'bordered' ? 'border border-gray-200 dark:border-gray-700 rounded-lg' : ''}
        ${variant === 'default' ? 'divide-y divide-gray-200 dark:divide-gray-700' : ''}
        ${variant === 'separated' ? 'space-y-2' : ''}
        ${className}
      `}
    >
      {React.Children.map(children, (child) => {
        if (React.isValidElement(child) && child.type === AccordionItem) {
          return React.cloneElement(child, {
            className: `
              ${size === 'sm' ? 'text-sm' : size === 'md' ? 'text-base' : 'text-lg'}
              ${
                variant === 'separated'
                  ? 'border border-gray-200 dark:border-gray-700 rounded-lg'
                  : ''
              }
            `,
          });
        }
        return child;
      })}
    </div>
  );
};

export { AccordionItem };
export default Accordion;

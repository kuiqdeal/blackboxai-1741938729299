import React from 'react';
import { Popover as HeadlessPopover, Transition } from '@headlessui/react';

interface PopoverProps {
  trigger: React.ReactNode;
  children: React.ReactNode;
  position?: 'top' | 'right' | 'bottom' | 'left';
  className?: string;
  offset?: number;
  arrow?: boolean;
}

const Popover: React.FC<PopoverProps> = ({
  trigger,
  children,
  position = 'bottom',
  className = '',
  offset = 8,
  arrow = true,
}) => {
  const positionStyles = {
    top: {
      panel: '-translate-x-1/2 -translate-y-full',
      arrow: 'bottom-0 translate-y-full left-1/2 -translate-x-1/2 border-t-gray-200 dark:border-t-gray-700',
      borders: 'border-t border-x',
    },
    right: {
      panel: 'translate-x-2 -translate-y-1/2',
      arrow: 'left-0 -translate-x-full top-1/2 -translate-y-1/2 border-r-gray-200 dark:border-r-gray-700',
      borders: 'border-r border-y',
    },
    bottom: {
      panel: '-translate-x-1/2 translate-y-2',
      arrow: 'top-0 -translate-y-full left-1/2 -translate-x-1/2 border-b-gray-200 dark:border-b-gray-700',
      borders: 'border-b border-x',
    },
    left: {
      panel: '-translate-x-full -translate-y-1/2',
      arrow: 'right-0 translate-x-full top-1/2 -translate-y-1/2 border-l-gray-200 dark:border-l-gray-700',
      borders: 'border-l border-y',
    },
  };

  return (
    <HeadlessPopover className="relative">
      {({ open }) => (
        <>
          <HeadlessPopover.Button as={React.Fragment}>
            {trigger}
          </HeadlessPopover.Button>

          <Transition
            show={open}
            as={React.Fragment}
            enter="transition ease-out duration-200"
            enterFrom="opacity-0 translate-y-1"
            enterTo="opacity-100 translate-y-0"
            leave="transition ease-in duration-150"
            leaveFrom="opacity-100 translate-y-0"
            leaveTo="opacity-0 translate-y-1"
          >
            <HeadlessPopover.Panel
              className={`
                absolute z-10
                ${positionStyles[position].panel}
                ${className}
              `}
              style={{
                [position]: `${offset}px`,
              }}
            >
              <div
                className={`
                  relative
                  bg-white dark:bg-gray-800
                  rounded-lg shadow-lg
                  border border-gray-200 dark:border-gray-700
                  overflow-hidden
                `}
              >
                {arrow && (
                  <div
                    className={`
                      absolute w-3 h-3
                      transform rotate-45
                      bg-white dark:bg-gray-800
                      border
                      ${positionStyles[position].borders}
                      ${positionStyles[position].arrow}
                    `}
                  />
                )}
                <div className="relative">{children}</div>
              </div>
            </HeadlessPopover.Panel>
          </Transition>
        </>
      )}
    </HeadlessPopover>
  );
};

interface PopoverContentProps {
  children: React.ReactNode;
  title?: React.ReactNode;
  description?: React.ReactNode;
  footer?: React.ReactNode;
  className?: string;
}

export const PopoverContent: React.FC<PopoverContentProps> = ({
  children,
  title,
  description,
  footer,
  className = '',
}) => {
  return (
    <div className={`p-4 ${className}`}>
      {title && (
        <div className="text-sm font-medium text-gray-900 dark:text-white">
          {title}
        </div>
      )}
      {description && (
        <div className="mt-1 text-sm text-gray-500 dark:text-gray-400">
          {description}
        </div>
      )}
      <div className={`${title || description ? 'mt-4' : ''}`}>{children}</div>
      {footer && (
        <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
          {footer}
        </div>
      )}
    </div>
  );
};

interface PopoverDisclosureProps {
  children: React.ReactNode;
  title: string;
  open?: boolean;
  defaultOpen?: boolean;
  onChange?: (open: boolean) => void;
  className?: string;
}

export const PopoverDisclosure: React.FC<PopoverDisclosureProps> = ({
  children,
  title,
  open,
  defaultOpen,
  onChange,
  className = '',
}) => {
  return (
    <div className={`space-y-2 ${className}`}>
      <HeadlessPopover.Disclosure>
        {({ open: isOpen }) => {
          if (onChange) {
            onChange(isOpen);
          }
          return (
            <button
              type="button"
              className={`
                flex items-center justify-between w-full
                px-3 py-2 text-sm font-medium
                rounded-md
                ${
                  isOpen
                    ? 'bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white'
                    : 'text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800'
                }
              `}
            >
              <span>{title}</span>
              <svg
                className={`${
                  isOpen ? 'transform rotate-180' : ''
                } w-5 h-5 transition-transform`}
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 9l-7 7-7-7"
                />
              </svg>
            </button>
          );
        }}
      </HeadlessPopover.Disclosure>
      <HeadlessPopover.Panel>
        <div className="pl-3">{children}</div>
      </HeadlessPopover.Panel>
    </div>
  );
};

export default Popover;

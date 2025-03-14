import React from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { XIcon } from '@heroicons/react/outline';

interface DrawerProps {
  open: boolean;
  onClose: () => void;
  title?: React.ReactNode;
  description?: React.ReactNode;
  children: React.ReactNode;
  position?: 'left' | 'right';
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'full';
  showClose?: boolean;
  className?: string;
  footer?: React.ReactNode;
}

const Drawer: React.FC<DrawerProps> = ({
  open,
  onClose,
  title,
  description,
  children,
  position = 'right',
  size = 'md',
  showClose = true,
  className = '',
  footer,
}) => {
  const sizeStyles = {
    sm: 'max-w-sm',
    md: 'max-w-md',
    lg: 'max-w-lg',
    xl: 'max-w-xl',
    full: 'max-w-full',
  };

  const positionStyles = {
    left: {
      enter: 'transform transition ease-in-out duration-300',
      enterFrom: '-translate-x-full',
      enterTo: 'translate-x-0',
      leave: 'transform transition ease-in-out duration-300',
      leaveFrom: 'translate-x-0',
      leaveTo: '-translate-x-full',
    },
    right: {
      enter: 'transform transition ease-in-out duration-300',
      enterFrom: 'translate-x-full',
      enterTo: 'translate-x-0',
      leave: 'transform transition ease-in-out duration-300',
      leaveFrom: 'translate-x-0',
      leaveTo: 'translate-x-full',
    },
  };

  return (
    <Transition.Root show={open} as={React.Fragment}>
      <Dialog
        as="div"
        className="fixed inset-0 overflow-hidden z-50"
        onClose={onClose}
      >
        <div className="absolute inset-0 overflow-hidden">
          <Transition.Child
            as={React.Fragment}
            enter="ease-in-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in-out duration-300"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <Dialog.Overlay className="absolute inset-0 bg-black bg-opacity-50 transition-opacity" />
          </Transition.Child>

          <div
            className={`fixed inset-y-0 ${
              position === 'left' ? 'left-0' : 'right-0'
            } flex max-w-full`}
          >
            <Transition.Child
              as={React.Fragment}
              {...positionStyles[position]}
            >
              <div
                className={`
                  relative w-screen
                  ${sizeStyles[size]}
                  ${className}
                `}
              >
                <div className="h-full flex flex-col bg-white dark:bg-gray-900 shadow-xl">
                  {(title || showClose) && (
                    <div className="px-4 sm:px-6 py-6 border-b border-gray-200 dark:border-gray-700">
                      <div className="flex items-start justify-between">
                        <Dialog.Title className="text-lg font-medium text-gray-900 dark:text-white">
                          {title}
                        </Dialog.Title>
                        {showClose && (
                          <div className="ml-3 flex h-7 items-center">
                            <button
                              type="button"
                              className="rounded-md text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-primary-500"
                              onClick={onClose}
                            >
                              <span className="sr-only">Close panel</span>
                              <XIcon className="h-6 w-6" aria-hidden="true" />
                            </button>
                          </div>
                        )}
                      </div>
                      {description && (
                        <Dialog.Description className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                          {description}
                        </Dialog.Description>
                      )}
                    </div>
                  )}

                  <div className="relative flex-1 px-4 sm:px-6 overflow-auto">
                    <div className="absolute inset-0 px-4 sm:px-6 py-6">
                      {children}
                    </div>
                  </div>

                  {footer && (
                    <div className="flex-shrink-0 px-4 sm:px-6 py-4 border-t border-gray-200 dark:border-gray-700">
                      {footer}
                    </div>
                  )}
                </div>
              </div>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition.Root>
  );
};

export default Drawer;

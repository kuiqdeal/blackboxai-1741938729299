import React, { Fragment } from 'react';
import { Transition } from '@headlessui/react';
import {
  CheckCircleIcon,
  ExclamationCircleIcon,
  InformationCircleIcon,
  XCircleIcon,
  XIcon,
} from '@heroicons/react/outline';

export type NotificationType = 'success' | 'error' | 'warning' | 'info';

interface NotificationProps {
  show: boolean;
  type?: NotificationType;
  title: string;
  message?: string;
  onClose: () => void;
  duration?: number;
  position?: 'top-right' | 'top-left' | 'bottom-right' | 'bottom-left';
  className?: string;
}

const Notification: React.FC<NotificationProps> = ({
  show,
  type = 'info',
  title,
  message,
  onClose,
  duration = 5000,
  position = 'top-right',
  className = '',
}) => {
  React.useEffect(() => {
    if (show && duration > 0) {
      const timer = setTimeout(() => {
        onClose();
      }, duration);

      return () => {
        clearTimeout(timer);
      };
    }
  }, [show, duration, onClose]);

  const icons = {
    success: CheckCircleIcon,
    error: XCircleIcon,
    warning: ExclamationCircleIcon,
    info: InformationCircleIcon,
  };

  const styles = {
    success: {
      bg: 'bg-success-50 dark:bg-success-900/20',
      border: 'border-success-400 dark:border-success-500',
      icon: 'text-success-400 dark:text-success-300',
      title: 'text-success-800 dark:text-success-200',
      message: 'text-success-700 dark:text-success-300',
    },
    error: {
      bg: 'bg-danger-50 dark:bg-danger-900/20',
      border: 'border-danger-400 dark:border-danger-500',
      icon: 'text-danger-400 dark:text-danger-300',
      title: 'text-danger-800 dark:text-danger-200',
      message: 'text-danger-700 dark:text-danger-300',
    },
    warning: {
      bg: 'bg-warning-50 dark:bg-warning-900/20',
      border: 'border-warning-400 dark:border-warning-500',
      icon: 'text-warning-400 dark:text-warning-300',
      title: 'text-warning-800 dark:text-warning-200',
      message: 'text-warning-700 dark:text-warning-300',
    },
    info: {
      bg: 'bg-primary-50 dark:bg-primary-900/20',
      border: 'border-primary-400 dark:border-primary-500',
      icon: 'text-primary-400 dark:text-primary-300',
      title: 'text-primary-800 dark:text-primary-200',
      message: 'text-primary-700 dark:text-primary-300',
    },
  };

  const positions = {
    'top-right': 'top-0 right-0',
    'top-left': 'top-0 left-0',
    'bottom-right': 'bottom-0 right-0',
    'bottom-left': 'bottom-0 left-0',
  };

  const Icon = icons[type];

  return (
    <div
      aria-live="assertive"
      className={`
        fixed z-50 flex items-start px-4 py-6 pointer-events-none
        ${positions[position]}
        ${className}
      `}
    >
      <Transition
        show={show}
        as={Fragment}
        enter="transform ease-out duration-300 transition"
        enterFrom={`translate-y-2 opacity-0 ${
          position.includes('right') ? 'translate-x-2' : '-translate-x-2'
        }`}
        enterTo="translate-y-0 opacity-100 translate-x-0"
        leave="transition ease-in duration-100"
        leaveFrom="opacity-100"
        leaveTo="opacity-0"
      >
        <div
          className={`
            max-w-sm w-full rounded-lg shadow-lg border
            pointer-events-auto overflow-hidden
            ${styles[type].bg}
            ${styles[type].border}
          `}
        >
          <div className="p-4">
            <div className="flex items-start">
              <div className="flex-shrink-0">
                <Icon className={`h-6 w-6 ${styles[type].icon}`} />
              </div>
              <div className="ml-3 w-0 flex-1">
                <p className={`text-sm font-medium ${styles[type].title}`}>
                  {title}
                </p>
                {message && (
                  <p className={`mt-1 text-sm ${styles[type].message}`}>
                    {message}
                  </p>
                )}
              </div>
              <div className="ml-4 flex-shrink-0 flex">
                <button
                  type="button"
                  className={`
                    rounded-md inline-flex text-gray-400
                    hover:text-gray-500 focus:outline-none
                    focus:ring-2 focus:ring-offset-2
                    focus:ring-${type === 'info' ? 'primary' : type}-500
                  `}
                  onClick={onClose}
                >
                  <span className="sr-only">Close</span>
                  <XIcon className="h-5 w-5" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </Transition>
    </div>
  );
};

interface NotificationGroupProps {
  children: React.ReactNode;
  position?: NotificationProps['position'];
  className?: string;
}

export const NotificationGroup: React.FC<NotificationGroupProps> = ({
  children,
  position = 'top-right',
  className = '',
}) => {
  return (
    <div
      className={`
        fixed z-50
        ${position.includes('top') ? 'top-0' : 'bottom-0'}
        ${position.includes('right') ? 'right-0' : 'left-0'}
        ${className}
      `}
    >
      {children}
    </div>
  );
};

export default Notification;

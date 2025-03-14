import React from 'react';
import {
  CheckCircleIcon,
  ExclamationIcon,
  InformationCircleIcon,
  XCircleIcon,
} from '@heroicons/react/solid';
import { XIcon } from '@heroicons/react/outline';

interface AlertProps {
  type?: 'success' | 'error' | 'warning' | 'info';
  title?: string;
  message: string;
  onClose?: () => void;
  showIcon?: boolean;
  className?: string;
}

const Alert: React.FC<AlertProps> = ({
  type = 'info',
  title,
  message,
  onClose,
  showIcon = true,
  className = '',
}) => {
  const variants = {
    success: {
      wrapper: 'bg-success-50 dark:bg-success-900/30',
      icon: 'text-success-400 dark:text-success-300',
      title: 'text-success-800 dark:text-success-200',
      message: 'text-success-700 dark:text-success-300',
      closeButton: 'text-success-400 dark:text-success-300 hover:text-success-500 dark:hover:text-success-200',
    },
    error: {
      wrapper: 'bg-danger-50 dark:bg-danger-900/30',
      icon: 'text-danger-400 dark:text-danger-300',
      title: 'text-danger-800 dark:text-danger-200',
      message: 'text-danger-700 dark:text-danger-300',
      closeButton: 'text-danger-400 dark:text-danger-300 hover:text-danger-500 dark:hover:text-danger-200',
    },
    warning: {
      wrapper: 'bg-warning-50 dark:bg-warning-900/30',
      icon: 'text-warning-400 dark:text-warning-300',
      title: 'text-warning-800 dark:text-warning-200',
      message: 'text-warning-700 dark:text-warning-300',
      closeButton: 'text-warning-400 dark:text-warning-300 hover:text-warning-500 dark:hover:text-warning-200',
    },
    info: {
      wrapper: 'bg-primary-50 dark:bg-primary-900/30',
      icon: 'text-primary-400 dark:text-primary-300',
      title: 'text-primary-800 dark:text-primary-200',
      message: 'text-primary-700 dark:text-primary-300',
      closeButton: 'text-primary-400 dark:text-primary-300 hover:text-primary-500 dark:hover:text-primary-200',
    },
  };

  const icons = {
    success: CheckCircleIcon,
    error: XCircleIcon,
    warning: ExclamationIcon,
    info: InformationCircleIcon,
  };

  const Icon = icons[type];

  return (
    <div
      className={`rounded-md p-4 ${variants[type].wrapper} ${className}`}
      role="alert"
    >
      <div className="flex">
        {showIcon && (
          <div className="flex-shrink-0">
            <Icon className={`h-5 w-5 ${variants[type].icon}`} aria-hidden="true" />
          </div>
        )}
        <div className={`flex-1 ${showIcon ? 'ml-3' : ''}`}>
          {title && (
            <h3 className={`text-sm font-medium ${variants[type].title}`}>
              {title}
            </h3>
          )}
          <div
            className={`text-sm ${variants[type].message} ${
              title ? 'mt-2' : ''
            }`}
          >
            {message}
          </div>
        </div>
        {onClose && (
          <div className="ml-auto pl-3">
            <div className="-mx-1.5 -my-1.5">
              <button
                type="button"
                className={`inline-flex rounded-md p-1.5 focus:outline-none focus:ring-2 focus:ring-offset-2 ${variants[type].closeButton}`}
                onClick={onClose}
              >
                <span className="sr-only">Dismiss</span>
                <XIcon className="h-5 w-5" aria-hidden="true" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Alert;

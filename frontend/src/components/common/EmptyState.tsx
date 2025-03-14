import React from 'react';
import { FolderIcon, SearchIcon, ExclamationIcon } from '@heroicons/react/outline';

interface EmptyStateProps {
  title: string;
  description?: string;
  icon?: React.ReactNode;
  action?: React.ReactNode;
  variant?: 'default' | 'search' | 'error';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

const EmptyState: React.FC<EmptyStateProps> = ({
  title,
  description,
  icon,
  action,
  variant = 'default',
  size = 'md',
  className = '',
}) => {
  const defaultIcons = {
    default: <FolderIcon className="h-12 w-12" />,
    search: <SearchIcon className="h-12 w-12" />,
    error: <ExclamationIcon className="h-12 w-12" />,
  };

  const sizeStyles = {
    sm: {
      wrapper: 'p-4',
      icon: 'h-8 w-8',
      title: 'text-sm',
      description: 'text-xs',
    },
    md: {
      wrapper: 'p-6',
      icon: 'h-12 w-12',
      title: 'text-base',
      description: 'text-sm',
    },
    lg: {
      wrapper: 'p-8',
      icon: 'h-16 w-16',
      title: 'text-lg',
      description: 'text-base',
    },
  };

  const variantStyles = {
    default: {
      icon: 'text-gray-400 dark:text-gray-500',
      iconBg: 'bg-gray-100 dark:bg-gray-800',
    },
    search: {
      icon: 'text-primary-500 dark:text-primary-400',
      iconBg: 'bg-primary-50 dark:bg-primary-900/20',
    },
    error: {
      icon: 'text-danger-500 dark:text-danger-400',
      iconBg: 'bg-danger-50 dark:bg-danger-900/20',
    },
  };

  return (
    <div
      className={`
        flex flex-col items-center justify-center
        text-center
        ${sizeStyles[size].wrapper}
        ${className}
      `}
    >
      <div
        className={`
          rounded-full
          p-3 mb-4
          ${variantStyles[variant].iconBg}
        `}
      >
        {icon || (
          <div className={variantStyles[variant].icon}>
            {defaultIcons[variant]}
          </div>
        )}
      </div>
      <h3
        className={`
          font-semibold
          text-gray-900 dark:text-white
          ${sizeStyles[size].title}
          mb-1
        `}
      >
        {title}
      </h3>
      {description && (
        <p
          className={`
            text-gray-500 dark:text-gray-400
            ${sizeStyles[size].description}
            mb-4
          `}
        >
          {description}
        </p>
      )}
      {action && <div className="mt-2">{action}</div>}
    </div>
  );
};

interface EmptyStateButtonProps {
  label: string;
  onClick: () => void;
  icon?: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'outline';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export const EmptyStateButton: React.FC<EmptyStateButtonProps> = ({
  label,
  onClick,
  icon,
  variant = 'primary',
  size = 'md',
  className = '',
}) => {
  const variantStyles = {
    primary: 'bg-primary-600 text-white hover:bg-primary-700',
    secondary: 'bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700',
    outline: 'border border-gray-300 text-gray-700 hover:bg-gray-50 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-800',
  };

  const sizeStyles = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2 text-base',
    lg: 'px-6 py-3 text-lg',
  };

  return (
    <button
      onClick={onClick}
      className={`
        inline-flex items-center justify-center
        font-medium rounded-md
        focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500
        ${variantStyles[variant]}
        ${sizeStyles[size]}
        ${className}
      `}
    >
      {icon && <span className="mr-2">{icon}</span>}
      {label}
    </button>
  );
};

interface EmptyStateImageProps extends Omit<EmptyStateProps, 'icon'> {
  image: string;
  imageAlt?: string;
  imageWidth?: number;
  imageHeight?: number;
}

export const EmptyStateImage: React.FC<EmptyStateImageProps> = ({
  image,
  imageAlt = 'Empty state illustration',
  imageWidth = 200,
  imageHeight = 200,
  ...props
}) => {
  return (
    <EmptyState
      {...props}
      icon={
        <img
          src={image}
          alt={imageAlt}
          width={imageWidth}
          height={imageHeight}
          className="max-w-full h-auto"
        />
      }
    />
  );
};

export default EmptyState;

import React from 'react';
import { XIcon } from '@heroicons/react/solid';

interface BadgeProps {
  children: React.ReactNode;
  variant?: 'primary' | 'success' | 'warning' | 'danger' | 'info' | 'default';
  size?: 'sm' | 'md' | 'lg';
  rounded?: 'full' | 'lg' | 'md';
  removable?: boolean;
  onRemove?: () => void;
  icon?: React.ReactNode;
  className?: string;
}

const Badge: React.FC<BadgeProps> = ({
  children,
  variant = 'default',
  size = 'md',
  rounded = 'full',
  removable = false,
  onRemove,
  icon,
  className = '',
}) => {
  const variantStyles = {
    primary: {
      solid: 'bg-primary-100 text-primary-800 dark:bg-primary-900/20 dark:text-primary-300',
      outline: 'border border-primary-500 text-primary-700 dark:text-primary-400',
    },
    success: {
      solid: 'bg-success-100 text-success-800 dark:bg-success-900/20 dark:text-success-300',
      outline: 'border border-success-500 text-success-700 dark:text-success-400',
    },
    warning: {
      solid: 'bg-warning-100 text-warning-800 dark:bg-warning-900/20 dark:text-warning-300',
      outline: 'border border-warning-500 text-warning-700 dark:text-warning-400',
    },
    danger: {
      solid: 'bg-danger-100 text-danger-800 dark:bg-danger-900/20 dark:text-danger-300',
      outline: 'border border-danger-500 text-danger-700 dark:text-danger-400',
    },
    info: {
      solid: 'bg-info-100 text-info-800 dark:bg-info-900/20 dark:text-info-300',
      outline: 'border border-info-500 text-info-700 dark:text-info-400',
    },
    default: {
      solid: 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300',
      outline: 'border border-gray-500 text-gray-700 dark:text-gray-400',
    },
  };

  const sizeStyles = {
    sm: {
      base: 'px-2 py-0.5 text-xs',
      icon: 'h-3 w-3',
      removeIcon: 'h-3 w-3 ml-1',
    },
    md: {
      base: 'px-2.5 py-0.5 text-sm',
      icon: 'h-4 w-4',
      removeIcon: 'h-4 w-4 ml-1.5',
    },
    lg: {
      base: 'px-3 py-1 text-base',
      icon: 'h-5 w-5',
      removeIcon: 'h-5 w-5 ml-2',
    },
  };

  const roundedStyles = {
    full: 'rounded-full',
    lg: 'rounded-lg',
    md: 'rounded-md',
  };

  return (
    <span
      className={`
        inline-flex items-center
        font-medium
        ${variantStyles[variant].solid}
        ${sizeStyles[size].base}
        ${roundedStyles[rounded]}
        ${className}
      `}
    >
      {icon && (
        <span className={`mr-1.5 ${sizeStyles[size].icon}`}>
          {icon}
        </span>
      )}
      {children}
      {removable && (
        <button
          type="button"
          onClick={onRemove}
          className={`
            inline-flex
            hover:bg-black/10 dark:hover:bg-white/10
            rounded-full
            -mr-1
            focus:outline-none
          `}
        >
          <XIcon className={sizeStyles[size].removeIcon} />
          <span className="sr-only">Remove</span>
        </button>
      )}
    </span>
  );
};

interface BadgeGroupProps {
  children: React.ReactNode;
  variant?: BadgeProps['variant'];
  size?: BadgeProps['size'];
  rounded?: BadgeProps['rounded'];
  className?: string;
}

export const BadgeGroup: React.FC<BadgeGroupProps> = ({
  children,
  variant,
  size,
  rounded,
  className = '',
}) => {
  return (
    <div className={`inline-flex flex-wrap gap-2 ${className}`}>
      {React.Children.map(children, (child) => {
        if (React.isValidElement(child) && child.type === Badge) {
          return React.cloneElement(child, {
            variant: variant || child.props.variant,
            size: size || child.props.size,
            rounded: rounded || child.props.rounded,
          });
        }
        return child;
      })}
    </div>
  );
};

interface BadgeListProps {
  items: Array<{
    id: string | number;
    label: string;
    variant?: BadgeProps['variant'];
    icon?: React.ReactNode;
  }>;
  onRemove?: (id: string | number) => void;
  size?: BadgeProps['size'];
  rounded?: BadgeProps['rounded'];
  className?: string;
}

export const BadgeList: React.FC<BadgeListProps> = ({
  items,
  onRemove,
  size,
  rounded,
  className = '',
}) => {
  return (
    <div className={`inline-flex flex-wrap gap-2 ${className}`}>
      {items.map((item) => (
        <Badge
          key={item.id}
          variant={item.variant}
          size={size}
          rounded={rounded}
          removable={!!onRemove}
          onRemove={() => onRemove?.(item.id)}
          icon={item.icon}
        >
          {item.label}
        </Badge>
      ))}
    </div>
  );
};

export default Badge;

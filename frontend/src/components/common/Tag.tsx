import React from 'react';
import { XIcon } from '@heroicons/react/solid';

interface TagProps {
  children: React.ReactNode;
  variant?: 'solid' | 'outline' | 'light';
  color?: 'primary' | 'success' | 'warning' | 'danger' | 'info' | 'default';
  size?: 'sm' | 'md' | 'lg';
  removable?: boolean;
  onRemove?: () => void;
  icon?: React.ReactNode;
  className?: string;
  disabled?: boolean;
}

const Tag: React.FC<TagProps> = ({
  children,
  variant = 'solid',
  color = 'default',
  size = 'md',
  removable = false,
  onRemove,
  icon,
  className = '',
  disabled = false,
}) => {
  const colorStyles = {
    primary: {
      solid: 'bg-primary-600 text-white',
      outline: 'border-primary-500 text-primary-700 dark:text-primary-400',
      light: 'bg-primary-50 text-primary-700 dark:bg-primary-900/20 dark:text-primary-400',
    },
    success: {
      solid: 'bg-success-600 text-white',
      outline: 'border-success-500 text-success-700 dark:text-success-400',
      light: 'bg-success-50 text-success-700 dark:bg-success-900/20 dark:text-success-400',
    },
    warning: {
      solid: 'bg-warning-600 text-white',
      outline: 'border-warning-500 text-warning-700 dark:text-warning-400',
      light: 'bg-warning-50 text-warning-700 dark:bg-warning-900/20 dark:text-warning-400',
    },
    danger: {
      solid: 'bg-danger-600 text-white',
      outline: 'border-danger-500 text-danger-700 dark:text-danger-400',
      light: 'bg-danger-50 text-danger-700 dark:bg-danger-900/20 dark:text-danger-400',
    },
    info: {
      solid: 'bg-info-600 text-white',
      outline: 'border-info-500 text-info-700 dark:text-info-400',
      light: 'bg-info-50 text-info-700 dark:bg-info-900/20 dark:text-info-400',
    },
    default: {
      solid: 'bg-gray-600 text-white',
      outline: 'border-gray-500 text-gray-700 dark:text-gray-400',
      light: 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300',
    },
  };

  const sizeStyles = {
    sm: {
      base: 'px-2 py-0.5 text-xs',
      icon: 'h-3 w-3',
      removeIcon: '-mr-0.5 ml-1.5 h-3 w-3',
    },
    md: {
      base: 'px-2.5 py-0.5 text-sm',
      icon: 'h-4 w-4',
      removeIcon: '-mr-1 ml-2 h-4 w-4',
    },
    lg: {
      base: 'px-3 py-1 text-base',
      icon: 'h-5 w-5',
      removeIcon: '-mr-1.5 ml-2.5 h-5 w-5',
    },
  };

  return (
    <span
      className={`
        inline-flex items-center
        font-medium
        rounded-full
        ${variant === 'outline' ? 'border' : ''}
        ${colorStyles[color][variant]}
        ${sizeStyles[size].base}
        ${disabled ? 'opacity-50 cursor-not-allowed' : ''}
        ${className}
      `}
    >
      {icon && (
        <span className={`-ml-0.5 mr-1.5 ${sizeStyles[size].icon}`}>
          {icon}
        </span>
      )}
      {children}
      {removable && !disabled && (
        <button
          type="button"
          onClick={onRemove}
          className={`
            inline-flex
            hover:bg-black/10 dark:hover:bg-white/10
            rounded-full
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

interface TagGroupProps {
  children: React.ReactNode;
  variant?: TagProps['variant'];
  color?: TagProps['color'];
  size?: TagProps['size'];
  className?: string;
}

export const TagGroup: React.FC<TagGroupProps> = ({
  children,
  variant,
  color,
  size,
  className = '',
}) => {
  return (
    <div className={`inline-flex flex-wrap gap-2 ${className}`}>
      {React.Children.map(children, (child) => {
        if (React.isValidElement(child) && child.type === Tag) {
          return React.cloneElement(child, {
            variant: variant || child.props.variant,
            color: color || child.props.color,
            size: size || child.props.size,
          });
        }
        return child;
      })}
    </div>
  );
};

interface TagListProps {
  items: Array<{
    id: string | number;
    label: string;
    color?: TagProps['color'];
    icon?: React.ReactNode;
  }>;
  onRemove?: (id: string | number) => void;
  variant?: TagProps['variant'];
  size?: TagProps['size'];
  className?: string;
}

export const TagList: React.FC<TagListProps> = ({
  items,
  onRemove,
  variant,
  size,
  className = '',
}) => {
  return (
    <div className={`inline-flex flex-wrap gap-2 ${className}`}>
      {items.map((item) => (
        <Tag
          key={item.id}
          color={item.color}
          variant={variant}
          size={size}
          removable={!!onRemove}
          onRemove={() => onRemove?.(item.id)}
          icon={item.icon}
        >
          {item.label}
        </Tag>
      ))}
    </div>
  );
};

export default Tag;

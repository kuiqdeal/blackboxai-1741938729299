import React from 'react';
import { CheckIcon, ChevronRightIcon } from '@heroicons/react/solid';

interface ListItemProps {
  children: React.ReactNode;
  icon?: React.ReactNode;
  selected?: boolean;
  disabled?: boolean;
  onClick?: () => void;
  className?: string;
}

interface ListProps {
  items: Array<ListItemProps | React.ReactNode>;
  variant?: 'default' | 'bordered' | 'divided';
  size?: 'sm' | 'md' | 'lg';
  selectable?: boolean;
  hoverable?: boolean;
  className?: string;
}

const ListItem: React.FC<ListItemProps> = ({
  children,
  icon,
  selected = false,
  disabled = false,
  onClick,
  className = '',
}) => {
  return (
    <li
      className={`
        relative
        ${onClick ? 'cursor-pointer' : ''}
        ${
          disabled
            ? 'opacity-50 cursor-not-allowed'
            : onClick
            ? 'hover:bg-gray-50 dark:hover:bg-gray-800'
            : ''
        }
        ${
          selected
            ? 'bg-primary-50 dark:bg-primary-900/20 text-primary-700 dark:text-primary-200'
            : 'text-gray-700 dark:text-gray-300'
        }
        ${className}
      `}
      onClick={disabled ? undefined : onClick}
    >
      <div className="flex items-center px-4 py-2">
        {icon && <span className="mr-3 flex-shrink-0">{icon}</span>}
        <div className="flex-grow min-w-0">{children}</div>
        {selected && (
          <CheckIcon className="h-5 w-5 text-primary-600 dark:text-primary-400" />
        )}
        {onClick && !selected && (
          <ChevronRightIcon className="h-5 w-5 text-gray-400" />
        )}
      </div>
    </li>
  );
};

const List: React.FC<ListProps> = ({
  items,
  variant = 'default',
  size = 'md',
  selectable = false,
  hoverable = true,
  className = '',
}) => {
  const variantStyles = {
    default: '',
    bordered: 'border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden',
    divided: 'divide-y divide-gray-200 dark:divide-gray-700',
  };

  const sizeStyles = {
    sm: 'text-sm',
    md: 'text-base',
    lg: 'text-lg',
  };

  return (
    <ul
      className={`
        ${variantStyles[variant]}
        ${sizeStyles[size]}
        ${className}
      `}
    >
      {items.map((item, index) => {
        if (React.isValidElement(item)) {
          return item;
        }

        const listItem = item as ListItemProps;
        return (
          <ListItem
            key={index}
            {...listItem}
            className={`
              ${hoverable && !listItem.disabled ? 'hover:bg-gray-50 dark:hover:bg-gray-800' : ''}
              ${selectable ? 'cursor-pointer' : ''}
            `}
          />
        );
      })}
    </ul>
  );
};

interface ListGroupProps {
  title?: string;
  description?: string;
  children: React.ReactNode;
  variant?: ListProps['variant'];
  size?: ListProps['size'];
  className?: string;
}

export const ListGroup: React.FC<ListGroupProps> = ({
  title,
  description,
  children,
  variant = 'default',
  size = 'md',
  className = '',
}) => {
  return (
    <div className={className}>
      {(title || description) && (
        <div className="mb-4">
          {title && (
            <h3 className="text-lg font-medium text-gray-900 dark:text-white">
              {title}
            </h3>
          )}
          {description && (
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
              {description}
            </p>
          )}
        </div>
      )}
      <List
        items={React.Children.toArray(children)}
        variant={variant}
        size={size}
      />
    </div>
  );
};

interface ListActionProps extends Omit<ListItemProps, 'children'> {
  label: string;
  description?: string;
  rightElement?: React.ReactNode;
}

export const ListAction: React.FC<ListActionProps> = ({
  label,
  description,
  rightElement,
  ...props
}) => {
  return (
    <ListItem {...props}>
      <div className="flex justify-between items-center">
        <div>
          <div className="font-medium">{label}</div>
          {description && (
            <div className="text-sm text-gray-500 dark:text-gray-400">
              {description}
            </div>
          )}
        </div>
        {rightElement && (
          <div className="ml-4 flex-shrink-0">{rightElement}</div>
        )}
      </div>
    </ListItem>
  );
};

export { ListItem };
export default List;

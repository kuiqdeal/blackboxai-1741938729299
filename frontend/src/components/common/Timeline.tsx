import React from 'react';

interface TimelineItem {
  id: string | number;
  title: string;
  description?: string;
  date?: string;
  icon?: React.ReactNode;
  status?: 'default' | 'success' | 'warning' | 'danger';
}

interface TimelineProps {
  items: TimelineItem[];
  align?: 'left' | 'right' | 'alternate';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

const Timeline: React.FC<TimelineProps> = ({
  items,
  align = 'left',
  size = 'md',
  className = '',
}) => {
  const sizeStyles = {
    sm: {
      dot: 'h-2 w-2',
      icon: 'h-4 w-4',
      wrapper: 'pl-4',
      connector: 'left-1 w-px',
      title: 'text-sm',
      description: 'text-xs',
    },
    md: {
      dot: 'h-3 w-3',
      icon: 'h-5 w-5',
      wrapper: 'pl-6',
      connector: 'left-1.5 w-px',
      title: 'text-base',
      description: 'text-sm',
    },
    lg: {
      dot: 'h-4 w-4',
      icon: 'h-6 w-6',
      wrapper: 'pl-8',
      connector: 'left-2 w-px',
      title: 'text-lg',
      description: 'text-base',
    },
  };

  const statusStyles = {
    default: 'bg-gray-400 dark:bg-gray-500',
    success: 'bg-success-500',
    warning: 'bg-warning-500',
    danger: 'bg-danger-500',
  };

  const renderTimelineItem = (item: TimelineItem, index: number) => {
    const isLast = index === items.length - 1;
    const isEven = index % 2 === 0;
    const side = align === 'alternate' ? (isEven ? 'left' : 'right') : align;

    return (
      <div
        key={item.id}
        className={`
          relative
          ${!isLast ? 'pb-8' : ''}
          ${align === 'alternate' ? 'w-1/2' : 'w-full'}
          ${side === 'right' ? 'ml-auto' : ''}
        `}
      >
        <div className="relative flex items-start">
          <div
            className={`
              relative z-10 flex items-center justify-center
              rounded-full
              ${item.icon ? sizeStyles[size].icon : sizeStyles[size].dot}
              ${statusStyles[item.status || 'default']}
            `}
          >
            {item.icon}
          </div>
          {!isLast && (
            <div
              className={`
                absolute top-5 bottom-0
                ${sizeStyles[size].connector}
                bg-gray-200 dark:bg-gray-700
              `}
            />
          )}
          <div
            className={`
              flex-grow
              ${sizeStyles[size].wrapper}
              ${side === 'right' ? 'text-right' : ''}
            `}
          >
            <div className="flex flex-col">
              <div
                className={`
                  font-medium text-gray-900 dark:text-white
                  ${sizeStyles[size].title}
                `}
              >
                {item.title}
              </div>
              {item.date && (
                <div className="text-sm text-gray-500 dark:text-gray-400">
                  {item.date}
                </div>
              )}
              {item.description && (
                <div
                  className={`
                    mt-1 text-gray-600 dark:text-gray-300
                    ${sizeStyles[size].description}
                  `}
                >
                  {item.description}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div
      className={`
        relative
        ${align === 'alternate' ? 'flex flex-col items-center' : ''}
        ${className}
      `}
    >
      {items.map((item, index) => renderTimelineItem(item, index))}
    </div>
  );
};

interface TimelineGroupProps {
  title?: string;
  description?: string;
  children: React.ReactNode;
  className?: string;
}

export const TimelineGroup: React.FC<TimelineGroupProps> = ({
  title,
  description,
  children,
  className = '',
}) => {
  return (
    <div className={className}>
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
      <div className="mt-6">{children}</div>
    </div>
  );
};

export default Timeline;

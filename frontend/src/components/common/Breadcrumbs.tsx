import React from 'react';
import { ChevronRightIcon, HomeIcon } from '@heroicons/react/solid';

interface BreadcrumbItem {
  label: string;
  href?: string;
  icon?: React.ReactNode;
}

interface BreadcrumbsProps {
  items: BreadcrumbItem[];
  homeHref?: string;
  showHome?: boolean;
  separator?: React.ReactNode;
  className?: string;
  maxItems?: number;
}

const Breadcrumbs: React.FC<BreadcrumbsProps> = ({
  items,
  homeHref = '/',
  showHome = true,
  separator = <ChevronRightIcon className="h-5 w-5 text-gray-400" />,
  className = '',
  maxItems = 0,
}) => {
  const renderItems = () => {
    let displayItems = [...items];

    if (maxItems > 0 && items.length > maxItems) {
      const start = Math.ceil(maxItems / 2);
      const end = items.length - Math.floor(maxItems / 2);

      displayItems = [
        ...items.slice(0, start),
        { label: '...', href: undefined },
        ...items.slice(end),
      ];
    }

    return displayItems.map((item, index) => {
      const isLast = index === displayItems.length - 1;

      return (
        <React.Fragment key={item.label}>
          <div className="flex items-center">
            {item.href && !isLast ? (
              <a
                href={item.href}
                className={`
                  text-sm font-medium
                  text-gray-500 hover:text-gray-700
                  dark:text-gray-400 dark:hover:text-gray-200
                `}
              >
                {item.icon && (
                  <span className="mr-1.5">{item.icon}</span>
                )}
                {item.label}
              </a>
            ) : (
              <span
                className={`
                  text-sm font-medium
                  ${
                    isLast
                      ? 'text-gray-900 dark:text-white'
                      : 'text-gray-500 dark:text-gray-400'
                  }
                `}
              >
                {item.icon && (
                  <span className="mr-1.5">{item.icon}</span>
                )}
                {item.label}
              </span>
            )}
          </div>
          {!isLast && (
            <div className="flex items-center mx-2">
              {separator}
            </div>
          )}
        </React.Fragment>
      );
    });
  };

  return (
    <nav className={`flex ${className}`} aria-label="Breadcrumb">
      <ol className="flex items-center space-x-2">
        {showHome && (
          <>
            <li>
              <div className="flex items-center">
                <a
                  href={homeHref}
                  className={`
                    text-gray-500 hover:text-gray-700
                    dark:text-gray-400 dark:hover:text-gray-200
                  `}
                >
                  <HomeIcon className="h-5 w-5" />
                  <span className="sr-only">Home</span>
                </a>
              </div>
            </li>
            {items.length > 0 && (
              <li>
                <div className="flex items-center">
                  {separator}
                </div>
              </li>
            )}
          </>
        )}
        {renderItems()}
      </ol>
    </nav>
  );
};

interface BreadcrumbButtonProps {
  label: string;
  onClick: () => void;
  icon?: React.ReactNode;
  className?: string;
}

export const BreadcrumbButton: React.FC<BreadcrumbButtonProps> = ({
  label,
  onClick,
  icon,
  className = '',
}) => {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`
        inline-flex items-center
        px-3 py-1.5 rounded-md
        text-sm font-medium
        text-gray-600 hover:text-gray-900
        dark:text-gray-400 dark:hover:text-white
        bg-gray-100 hover:bg-gray-200
        dark:bg-gray-800 dark:hover:bg-gray-700
        focus:outline-none focus:ring-2 focus:ring-primary-500
        ${className}
      `}
    >
      {icon && <span className="mr-1.5">{icon}</span>}
      {label}
    </button>
  );
};

export default Breadcrumbs;

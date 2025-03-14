import React from 'react';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  padding?: 'none' | 'sm' | 'md' | 'lg';
  border?: boolean;
  shadow?: 'none' | 'sm' | 'md' | 'lg';
  hover?: boolean;
  onClick?: () => void;
}

const Card: React.FC<CardProps> = ({
  children,
  className = '',
  padding = 'md',
  border = true,
  shadow = 'md',
  hover = false,
  onClick,
}) => {
  const baseStyles = 'rounded-lg bg-white dark:bg-gray-800 transition-all duration-200';
  
  const paddingStyles = {
    none: '',
    sm: 'p-3',
    md: 'p-4',
    lg: 'p-6',
  };

  const shadowStyles = {
    none: '',
    sm: 'shadow-sm',
    md: 'shadow',
    lg: 'shadow-lg',
  };

  const borderStyles = border ? 'border border-gray-200 dark:border-gray-700' : '';
  const hoverStyles = hover
    ? 'hover:shadow-lg hover:border-gray-300 dark:hover:border-gray-600 cursor-pointer'
    : '';
  const clickableStyles = onClick ? 'cursor-pointer' : '';

  const cardStyles = [
    baseStyles,
    paddingStyles[padding],
    shadowStyles[shadow],
    borderStyles,
    hoverStyles,
    clickableStyles,
    className,
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <div className={cardStyles} onClick={onClick}>
      {children}
    </div>
  );
};

interface CardHeaderProps {
  children: React.ReactNode;
  className?: string;
  border?: boolean;
}

export const CardHeader: React.FC<CardHeaderProps> = ({
  children,
  className = '',
  border = true,
}) => {
  const styles = [
    'px-6 py-4',
    border && 'border-b border-gray-200 dark:border-gray-700',
    className,
  ]
    .filter(Boolean)
    .join(' ');

  return <div className={styles}>{children}</div>;
};

interface CardBodyProps {
  children: React.ReactNode;
  className?: string;
}

export const CardBody: React.FC<CardBodyProps> = ({
  children,
  className = '',
}) => {
  return <div className={`p-6 ${className}`}>{children}</div>;
};

interface CardFooterProps {
  children: React.ReactNode;
  className?: string;
  border?: boolean;
}

export const CardFooter: React.FC<CardFooterProps> = ({
  children,
  className = '',
  border = true,
}) => {
  const styles = [
    'px-6 py-4',
    border && 'border-t border-gray-200 dark:border-gray-700',
    className,
  ]
    .filter(Boolean)
    .join(' ');

  return <div className={styles}>{children}</div>;
};

export default Card;

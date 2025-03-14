import React from 'react';
import { getInitials } from '../../utils/helpers';

interface AvatarProps {
  src?: string;
  alt?: string;
  name?: string;
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  shape?: 'circle' | 'square';
  status?: 'online' | 'offline' | 'away' | 'busy';
  className?: string;
  onClick?: () => void;
}

const Avatar: React.FC<AvatarProps> = ({
  src,
  alt,
  name,
  size = 'md',
  shape = 'circle',
  status,
  className = '',
  onClick,
}) => {
  const sizeStyles = {
    xs: 'h-6 w-6 text-xs',
    sm: 'h-8 w-8 text-sm',
    md: 'h-10 w-10 text-base',
    lg: 'h-12 w-12 text-lg',
    xl: 'h-16 w-16 text-xl',
  };

  const shapeStyles = {
    circle: 'rounded-full',
    square: 'rounded-lg',
  };

  const statusColors = {
    online: 'bg-success-400',
    offline: 'bg-gray-400',
    away: 'bg-warning-400',
    busy: 'bg-danger-400',
  };

  const statusSizes = {
    xs: 'h-1.5 w-1.5',
    sm: 'h-2 w-2',
    md: 'h-2.5 w-2.5',
    lg: 'h-3 w-3',
    xl: 'h-4 w-4',
  };

  const containerStyles = [
    'relative inline-flex items-center justify-center',
    'bg-gray-200 dark:bg-gray-700',
    sizeStyles[size],
    shapeStyles[shape],
    onClick && 'cursor-pointer',
    className,
  ]
    .filter(Boolean)
    .join(' ');

  const imgStyles = [
    'object-cover',
    sizeStyles[size],
    shapeStyles[shape],
  ]
    .filter(Boolean)
    .join(' ');

  const initialsStyles = [
    'font-medium text-gray-600 dark:text-gray-300',
    sizeStyles[size],
    'flex items-center justify-center',
  ]
    .filter(Boolean)
    .join(' ');

  const renderContent = () => {
    if (src) {
      return (
        <img
          src={src}
          alt={alt || name || 'avatar'}
          className={imgStyles}
          onError={(e) => {
            // If image fails to load, remove src to show fallback
            const target = e.target as HTMLImageElement;
            target.src = '';
          }}
        />
      );
    }

    if (name) {
      return <span className={initialsStyles}>{getInitials(name)}</span>;
    }

    // Fallback icon
    return (
      <svg
        className="text-gray-400 dark:text-gray-500"
        fill="currentColor"
        viewBox="0 0 24 24"
      >
        <path d="M24 20.993V24H0v-2.996A14.977 14.977 0 0112.004 15c4.904 0 9.26 2.354 11.996 5.993zM16.002 8.999a4 4 0 11-8 0 4 4 0 018 0z" />
      </svg>
    );
  };

  return (
    <div className={containerStyles} onClick={onClick}>
      {renderContent()}
      {status && (
        <span
          className={`absolute bottom-0 right-0 block ${
            statusSizes[size]
          } ${shapeStyles.circle} ${
            statusColors[status]
          } ring-2 ring-white dark:ring-gray-900`}
        />
      )}
    </div>
  );
};

interface AvatarGroupProps {
  avatars: Array<{
    src?: string;
    name?: string;
    alt?: string;
  }>;
  max?: number;
  size?: AvatarProps['size'];
  className?: string;
}

export const AvatarGroup: React.FC<AvatarGroupProps> = ({
  avatars,
  max = 3,
  size = 'md',
  className = '',
}) => {
  const displayAvatars = avatars.slice(0, max);
  const remainingCount = avatars.length - max;

  const groupStyles = [
    'flex -space-x-2',
    className,
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <div className={groupStyles}>
      {displayAvatars.map((avatar, index) => (
        <Avatar
          key={index}
          src={avatar.src}
          name={avatar.name}
          alt={avatar.alt}
          size={size}
          className="ring-2 ring-white dark:ring-gray-900"
        />
      ))}
      {remainingCount > 0 && (
        <div
          className={`
            relative inline-flex items-center justify-center
            bg-gray-300 dark:bg-gray-600
            text-gray-600 dark:text-gray-300
            ring-2 ring-white dark:ring-gray-900
            ${sizeStyles[size]} rounded-full
          `}
        >
          <span className="font-medium">+{remainingCount}</span>
        </div>
      )}
    </div>
  );
};

export default Avatar;

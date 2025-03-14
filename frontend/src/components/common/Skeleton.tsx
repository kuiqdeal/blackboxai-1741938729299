import React from 'react';

interface SkeletonProps {
  variant?: 'text' | 'circular' | 'rectangular';
  width?: string | number;
  height?: string | number;
  className?: string;
  animation?: 'pulse' | 'wave' | 'none';
  repeat?: number;
}

const Skeleton: React.FC<SkeletonProps> = ({
  variant = 'text',
  width,
  height,
  className = '',
  animation = 'pulse',
  repeat = 1,
}) => {
  const baseStyles = {
    text: 'h-4 rounded',
    circular: 'rounded-full',
    rectangular: 'rounded-md',
  };

  const animationStyles = {
    pulse: 'animate-pulse',
    wave: 'animate-shimmer',
    none: '',
  };

  const getStyle = () => {
    const style: React.CSSProperties = {};
    
    if (width) {
      style.width = typeof width === 'number' ? `${width}px` : width;
    }
    if (height) {
      style.height = typeof height === 'number' ? `${height}px` : height;
    }
    
    return style;
  };

  const renderSkeleton = () => (
    <div
      style={getStyle()}
      className={`
        bg-gray-200 dark:bg-gray-700
        ${baseStyles[variant]}
        ${animationStyles[animation]}
        ${className}
      `}
    />
  );

  if (repeat === 1) {
    return renderSkeleton();
  }

  return (
    <div className="space-y-2">
      {Array.from({ length: repeat }).map((_, index) => (
        <div key={index}>{renderSkeleton()}</div>
      ))}
    </div>
  );
};

interface SkeletonTextProps extends Omit<SkeletonProps, 'variant'> {
  lines?: number;
  lastLineWidth?: string | number;
  spacing?: string | number;
}

export const SkeletonText: React.FC<SkeletonTextProps> = ({
  lines = 3,
  lastLineWidth = '60%',
  spacing = '0.5rem',
  ...props
}) => {
  return (
    <div style={{ gap: spacing }} className="flex flex-col">
      {Array.from({ length: lines }).map((_, index) => (
        <Skeleton
          key={index}
          variant="text"
          width={index === lines - 1 ? lastLineWidth : '100%'}
          {...props}
        />
      ))}
    </div>
  );
};

interface SkeletonAvatarProps extends Omit<SkeletonProps, 'variant'> {
  size?: 'sm' | 'md' | 'lg' | 'xl';
}

export const SkeletonAvatar: React.FC<SkeletonAvatarProps> = ({
  size = 'md',
  ...props
}) => {
  const sizes = {
    sm: 32,
    md: 40,
    lg: 48,
    xl: 56,
  };

  return (
    <Skeleton
      variant="circular"
      width={sizes[size]}
      height={sizes[size]}
      {...props}
    />
  );
};

interface SkeletonCardProps extends Omit<SkeletonProps, 'variant'> {
  header?: boolean;
  footer?: boolean;
}

export const SkeletonCard: React.FC<SkeletonCardProps> = ({
  header = true,
  footer = false,
  height = 200,
  className = '',
  ...props
}) => {
  return (
    <div
      className={`
        border border-gray-200 dark:border-gray-700
        rounded-lg overflow-hidden
        ${className}
      `}
    >
      {header && (
        <div className="p-4 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center space-x-4">
            <SkeletonAvatar size="sm" />
            <div className="flex-1">
              <Skeleton width="60%" className="mb-2" {...props} />
              <Skeleton width="40%" {...props} />
            </div>
          </div>
        </div>
      )}
      <Skeleton
        variant="rectangular"
        height={height}
        className="w-full"
        {...props}
      />
      {footer && (
        <div className="p-4 border-t border-gray-200 dark:border-gray-700">
          <div className="flex justify-between">
            <Skeleton width={100} {...props} />
            <Skeleton width={100} {...props} />
          </div>
        </div>
      )}
    </div>
  );
};

export default Skeleton;

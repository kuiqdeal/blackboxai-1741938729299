import React from 'react';

interface DividerProps {
  orientation?: 'horizontal' | 'vertical';
  variant?: 'solid' | 'dashed' | 'dotted';
  size?: 'xs' | 'sm' | 'md' | 'lg';
  label?: React.ReactNode;
  labelPosition?: 'left' | 'center' | 'right';
  className?: string;
}

const Divider: React.FC<DividerProps> = ({
  orientation = 'horizontal',
  variant = 'solid',
  size = 'md',
  label,
  labelPosition = 'center',
  className = '',
}) => {
  const variantStyles = {
    solid: 'border-solid',
    dashed: 'border-dashed',
    dotted: 'border-dotted',
  };

  const sizeStyles = {
    xs: {
      border: 'border',
      spacing: 'my-1',
      text: 'text-xs',
    },
    sm: {
      border: 'border-2',
      spacing: 'my-2',
      text: 'text-sm',
    },
    md: {
      border: 'border-2',
      spacing: 'my-4',
      text: 'text-base',
    },
    lg: {
      border: 'border-4',
      spacing: 'my-6',
      text: 'text-lg',
    },
  };

  const labelPositionStyles = {
    left: 'justify-start',
    center: 'justify-center',
    right: 'justify-end',
  };

  if (orientation === 'vertical') {
    return (
      <div
        className={`
          inline-block h-full
          ${sizeStyles[size].border}
          ${variantStyles[variant]}
          border-gray-200 dark:border-gray-700
          mx-2
          ${className}
        `}
      />
    );
  }

  if (label) {
    return (
      <div
        className={`
          flex items-center
          ${sizeStyles[size].spacing}
          ${className}
        `}
      >
        <div
          className={`
            flex-grow
            ${sizeStyles[size].border}
            ${variantStyles[variant]}
            border-gray-200 dark:border-gray-700
          `}
        />
        <div
          className={`
            flex
            ${labelPositionStyles[labelPosition]}
            px-3
            ${sizeStyles[size].text}
            text-gray-500 dark:text-gray-400
            whitespace-nowrap
          `}
        >
          {label}
        </div>
        <div
          className={`
            flex-grow
            ${sizeStyles[size].border}
            ${variantStyles[variant]}
            border-gray-200 dark:border-gray-700
          `}
        />
      </div>
    );
  }

  return (
    <hr
      className={`
        ${sizeStyles[size].border}
        ${variantStyles[variant]}
        ${sizeStyles[size].spacing}
        border-gray-200 dark:border-gray-700
        ${className}
      `}
    />
  );
};

interface DividerGroupProps {
  children: React.ReactNode;
  spacing?: 'xs' | 'sm' | 'md' | 'lg';
  variant?: DividerProps['variant'];
  size?: DividerProps['size'];
  className?: string;
}

export const DividerGroup: React.FC<DividerGroupProps> = ({
  children,
  spacing = 'md',
  variant,
  size,
  className = '',
}) => {
  const spacingStyles = {
    xs: 'space-y-2',
    sm: 'space-y-4',
    md: 'space-y-6',
    lg: 'space-y-8',
  };

  return (
    <div className={`${spacingStyles[spacing]} ${className}`}>
      {React.Children.map(children, (child, index) => {
        if (index === React.Children.count(children) - 1) {
          return child;
        }

        return (
          <>
            {child}
            <Divider variant={variant} size={size} />
          </>
        );
      })}
    </div>
  );
};

interface DividerContentProps {
  children: React.ReactNode;
  label?: React.ReactNode;
  variant?: DividerProps['variant'];
  size?: DividerProps['size'];
  className?: string;
}

export const DividerContent: React.FC<DividerContentProps> = ({
  children,
  label,
  variant,
  size,
  className = '',
}) => {
  return (
    <div className={className}>
      <Divider label={label} variant={variant} size={size} />
      <div className="mt-4">{children}</div>
    </div>
  );
};

export default Divider;

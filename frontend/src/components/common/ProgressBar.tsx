import React from 'react';

interface ProgressBarProps {
  value: number;
  max?: number;
  color?: 'primary' | 'success' | 'warning' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  label?: string;
  showValue?: boolean;
  valueFormat?: (value: number, max: number) => string;
  animated?: boolean;
  striped?: boolean;
  className?: string;
}

const ProgressBar: React.FC<ProgressBarProps> = ({
  value,
  max = 100,
  color = 'primary',
  size = 'md',
  label,
  showValue = false,
  valueFormat,
  animated = true,
  striped = false,
  className = '',
}) => {
  const percentage = Math.min(Math.max((value / max) * 100, 0), 100);

  const colorStyles = {
    primary: {
      bar: 'bg-primary-600',
      text: 'text-primary-700 dark:text-primary-200',
    },
    success: {
      bar: 'bg-success-600',
      text: 'text-success-700 dark:text-success-200',
    },
    warning: {
      bar: 'bg-warning-600',
      text: 'text-warning-700 dark:text-warning-200',
    },
    danger: {
      bar: 'bg-danger-600',
      text: 'text-danger-700 dark:text-danger-200',
    },
  };

  const sizeStyles = {
    sm: {
      bar: 'h-1',
      text: 'text-xs',
    },
    md: {
      bar: 'h-2',
      text: 'text-sm',
    },
    lg: {
      bar: 'h-3',
      text: 'text-base',
    },
  };

  const formatValue = () => {
    if (valueFormat) {
      return valueFormat(value, max);
    }
    return `${Math.round(percentage)}%`;
  };

  return (
    <div className={className}>
      {(label || showValue) && (
        <div className="flex justify-between items-center mb-1">
          {label && (
            <span
              className={`
                font-medium text-gray-700 dark:text-gray-300
                ${sizeStyles[size].text}
              `}
            >
              {label}
            </span>
          )}
          {showValue && (
            <span
              className={`
                font-medium
                ${colorStyles[color].text}
                ${sizeStyles[size].text}
              `}
            >
              {formatValue()}
            </span>
          )}
        </div>
      )}
      <div
        className={`
          overflow-hidden
          bg-gray-200 dark:bg-gray-700
          rounded-full
          ${sizeStyles[size].bar}
        `}
      >
        <div
          className={`
            rounded-full
            transition-all duration-300 ease-out
            ${colorStyles[color].bar}
            ${animated ? 'animate-progress' : ''}
            ${
              striped
                ? 'bg-stripes bg-stripes-white/20 bg-stripes-size-lg'
                : ''
            }
          `}
          style={{ width: `${percentage}%` }}
          role="progressbar"
          aria-valuenow={value}
          aria-valuemin={0}
          aria-valuemax={max}
        />
      </div>
    </div>
  );
};

interface ProgressBarStackProps {
  segments: Array<{
    value: number;
    color?: ProgressBarProps['color'];
    label?: string;
  }>;
  max?: number;
  size?: ProgressBarProps['size'];
  showValues?: boolean;
  className?: string;
}

export const ProgressBarStack: React.FC<ProgressBarStackProps> = ({
  segments,
  max = 100,
  size = 'md',
  showValues = false,
  className = '',
}) => {
  const total = segments.reduce((sum, segment) => sum + segment.value, 0);
  const percentages = segments.map(
    (segment) => (segment.value / Math.max(total, max)) * 100
  );

  return (
    <div className={className}>
      <div
        className={`
          flex overflow-hidden
          bg-gray-200 dark:bg-gray-700
          rounded-full
          ${size === 'sm' ? 'h-1' : size === 'md' ? 'h-2' : 'h-3'}
        `}
      >
        {segments.map((segment, index) => (
          <div
            key={index}
            className={`
              ${segment.color ? colorStyles[segment.color].bar : colorStyles.primary.bar}
              transition-all duration-300 ease-out
              ${index > 0 ? 'border-l border-white/10' : ''}
            `}
            style={{ width: `${percentages[index]}%` }}
          />
        ))}
      </div>
      {showValues && (
        <div className="flex justify-between mt-1">
          {segments.map((segment, index) => (
            <div
              key={index}
              className={`
                text-xs font-medium
                ${
                  segment.color
                    ? colorStyles[segment.color].text
                    : colorStyles.primary.text
                }
              `}
            >
              {segment.label || `${Math.round(percentages[index])}%`}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ProgressBar;

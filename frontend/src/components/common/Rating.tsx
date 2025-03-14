import React from 'react';
import { StarIcon as StarOutline } from '@heroicons/react/outline';
import { StarIcon as StarSolid } from '@heroicons/react/solid';

interface RatingProps {
  value: number;
  max?: number;
  onChange?: (value: number) => void;
  size?: 'sm' | 'md' | 'lg';
  color?: string;
  readOnly?: boolean;
  showValue?: boolean;
  precision?: 0.5 | 1;
  className?: string;
  label?: string;
  error?: string;
}

const Rating: React.FC<RatingProps> = ({
  value,
  max = 5,
  onChange,
  size = 'md',
  color = 'warning',
  readOnly = false,
  showValue = false,
  precision = 1,
  className = '',
  label,
  error,
}) => {
  const [hoverValue, setHoverValue] = React.useState<number | null>(null);

  const sizeStyles = {
    sm: 'h-4 w-4',
    md: 'h-5 w-5',
    lg: 'h-6 w-6',
  };

  const colorStyles = {
    primary: 'text-primary-400 hover:text-primary-300',
    success: 'text-success-400 hover:text-success-300',
    warning: 'text-warning-400 hover:text-warning-300',
    danger: 'text-danger-400 hover:text-danger-300',
  };

  const roundToNearest = (num: number, precision: number) => {
    return Math.round(num / precision) * precision;
  };

  const handleMouseMove = (event: React.MouseEvent, index: number) => {
    if (readOnly) return;

    const rect = event.currentTarget.getBoundingClientRect();
    const width = rect.width;
    const x = event.clientX - rect.left;
    const percent = x / width;

    if (precision === 0.5) {
      setHoverValue(index + (percent > 0.5 ? 1 : 0.5));
    } else {
      setHoverValue(index + 1);
    }
  };

  const handleClick = (value: number) => {
    if (readOnly) return;
    onChange?.(roundToNearest(value, precision));
  };

  const renderStar = (index: number) => {
    const filled = (hoverValue ?? value) > index;
    const halfFilled =
      precision === 0.5 && (hoverValue ?? value) === index + 0.5;
    const StarComponent = filled || halfFilled ? StarSolid : StarOutline;

    return (
      <div
        key={index}
        className={`
          relative cursor-pointer
          ${readOnly ? 'cursor-default' : ''}
        `}
        onMouseMove={(e) => handleMouseMove(e, index)}
        onClick={() => handleClick(index + 1)}
      >
        <StarComponent
          className={`
            ${sizeStyles[size]}
            ${colorStyles[color]}
            ${
              readOnly
                ? 'cursor-default'
                : 'transition-colors duration-150 cursor-pointer'
            }
          `}
        />
        {halfFilled && (
          <div
            className="absolute inset-0 overflow-hidden"
            style={{ width: '50%' }}
          >
            <StarSolid
              className={`
                ${sizeStyles[size]}
                ${colorStyles[color]}
              `}
            />
          </div>
        )}
      </div>
    );
  };

  return (
    <div className={className}>
      {label && (
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          {label}
        </label>
      )}
      <div
        className="inline-flex items-center"
        onMouseLeave={() => setHoverValue(null)}
      >
        <div className="flex space-x-1">
          {Array.from({ length: max }, (_, i) => renderStar(i))}
        </div>
        {showValue && (
          <span className="ml-2 text-sm text-gray-600 dark:text-gray-400">
            {hoverValue ?? value} out of {max}
          </span>
        )}
      </div>
      {error && (
        <p className="mt-1 text-sm text-danger-600 dark:text-danger-400">
          {error}
        </p>
      )}
    </div>
  );
};

interface RatingGroupProps {
  items: Array<{
    label: string;
    value: number;
    onChange?: (value: number) => void;
  }>;
  max?: number;
  size?: RatingProps['size'];
  color?: RatingProps['color'];
  readOnly?: boolean;
  showValue?: boolean;
  precision?: RatingProps['precision'];
  className?: string;
}

export const RatingGroup: React.FC<RatingGroupProps> = ({
  items,
  max,
  size,
  color,
  readOnly,
  showValue,
  precision,
  className = '',
}) => {
  return (
    <div className={`space-y-3 ${className}`}>
      {items.map((item, index) => (
        <div key={index} className="flex items-center justify-between">
          <span className="text-sm text-gray-700 dark:text-gray-300">
            {item.label}
          </span>
          <Rating
            value={item.value}
            onChange={item.onChange}
            max={max}
            size={size}
            color={color}
            readOnly={readOnly}
            showValue={showValue}
            precision={precision}
          />
        </div>
      ))}
    </div>
  );
};

export default Rating;

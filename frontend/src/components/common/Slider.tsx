import React, { useRef, useState, useEffect } from 'react';

interface SliderProps {
  value: number;
  onChange: (value: number) => void;
  min?: number;
  max?: number;
  step?: number;
  label?: string;
  showValue?: boolean;
  disabled?: boolean;
  size?: 'sm' | 'md' | 'lg';
  color?: 'primary' | 'success' | 'warning' | 'danger';
  className?: string;
  error?: string;
  marks?: Array<{
    value: number;
    label: string;
  }>;
}

const Slider: React.FC<SliderProps> = ({
  value,
  onChange,
  min = 0,
  max = 100,
  step = 1,
  label,
  showValue = false,
  disabled = false,
  size = 'md',
  color = 'primary',
  className = '',
  error,
  marks,
}) => {
  const [isDragging, setIsDragging] = useState(false);
  const sliderRef = useRef<HTMLDivElement>(null);

  const sizeStyles = {
    sm: {
      track: 'h-1',
      thumb: 'h-3 w-3',
      label: 'text-sm',
    },
    md: {
      track: 'h-2',
      thumb: 'h-4 w-4',
      label: 'text-base',
    },
    lg: {
      track: 'h-3',
      thumb: 'h-5 w-5',
      label: 'text-lg',
    },
  };

  const colorStyles = {
    primary: {
      track: 'bg-primary-600',
      thumb: 'bg-primary-600 ring-primary-200',
      hover: 'hover:bg-primary-700',
    },
    success: {
      track: 'bg-success-600',
      thumb: 'bg-success-600 ring-success-200',
      hover: 'hover:bg-success-700',
    },
    warning: {
      track: 'bg-warning-600',
      thumb: 'bg-warning-600 ring-warning-200',
      hover: 'hover:bg-warning-700',
    },
    danger: {
      track: 'bg-danger-600',
      thumb: 'bg-danger-600 ring-danger-200',
      hover: 'hover:bg-danger-700',
    },
  };

  const percentage = ((value - min) / (max - min)) * 100;

  const handleMouseDown = (event: React.MouseEvent) => {
    if (disabled) return;
    setIsDragging(true);
    updateValue(event);
  };

  const handleMouseMove = (event: MouseEvent) => {
    if (!isDragging) return;
    updateValue(event);
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const updateValue = (event: MouseEvent | React.MouseEvent) => {
    const slider = sliderRef.current;
    if (!slider) return;

    const rect = slider.getBoundingClientRect();
    const percentage = Math.max(0, Math.min(1, (event.clientX - rect.left) / rect.width));
    const newValue = Math.round((percentage * (max - min) + min) / step) * step;
    onChange(Math.max(min, Math.min(max, newValue)));
  };

  useEffect(() => {
    if (isDragging) {
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);
      return () => {
        window.removeEventListener('mousemove', handleMouseMove);
        window.removeEventListener('mouseup', handleMouseUp);
      };
    }
  }, [isDragging]);

  return (
    <div className={className}>
      <div className="flex justify-between items-center mb-2">
        {label && (
          <label className={`font-medium text-gray-700 dark:text-gray-300 ${sizeStyles[size].label}`}>
            {label}
          </label>
        )}
        {showValue && (
          <span className="text-sm text-gray-500 dark:text-gray-400">
            {value}
          </span>
        )}
      </div>

      <div
        ref={sliderRef}
        className={`
          relative
          ${sizeStyles[size].track}
          rounded-full
          bg-gray-200 dark:bg-gray-700
          ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
        `}
        onMouseDown={handleMouseDown}
      >
        <div
          className={`
            absolute h-full rounded-full
            ${colorStyles[color].track}
            ${disabled ? 'opacity-50' : ''}
          `}
          style={{ width: `${percentage}%` }}
        />
        <div
          className={`
            absolute top-1/2 -translate-y-1/2
            ${sizeStyles[size].thumb}
            rounded-full
            shadow-sm
            ring-2
            ${colorStyles[color].thumb}
            ${disabled ? 'cursor-not-allowed' : `cursor-grab ${colorStyles[color].hover}`}
            ${isDragging ? 'cursor-grabbing ring-4' : ''}
            transition-shadow
          `}
          style={{ left: `${percentage}%`, transform: 'translate(-50%, -50%)' }}
        />
      </div>

      {marks && (
        <div className="relative mt-2 px-[10px]">
          <div className="flex justify-between -mx-[10px]">
            {marks.map((mark) => {
              const markPercentage = ((mark.value - min) / (max - min)) * 100;
              return (
                <div
                  key={mark.value}
                  className="absolute text-center"
                  style={{ left: `${markPercentage}%`, transform: 'translateX(-50%)' }}
                >
                  <div className="w-[2px] h-[5px] mb-1 bg-gray-300 dark:bg-gray-600 mx-auto" />
                  <span className="text-xs text-gray-500 dark:text-gray-400 whitespace-nowrap">
                    {mark.label}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {error && (
        <p className="mt-1 text-sm text-danger-600 dark:text-danger-400">
          {error}
        </p>
      )}
    </div>
  );
};

export default Slider;

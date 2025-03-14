import React, { useState, useRef, useEffect } from 'react';
import { CalendarIcon } from '@heroicons/react/outline';
import Calendar from './Calendar';

interface DatePickerProps {
  value: Date;
  onChange: (date: Date) => void;
  min?: Date;
  max?: Date;
  label?: string;
  placeholder?: string;
  error?: string;
  disabled?: boolean;
  className?: string;
  format?: string;
}

const DatePicker: React.FC<DatePickerProps> = ({
  value,
  onChange,
  min,
  max,
  label,
  placeholder = 'Select date',
  error,
  disabled = false,
  className = '',
  format = 'MM/dd/yyyy',
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const formatDate = (date: Date): string => {
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const year = date.getFullYear();

    switch (format) {
      case 'dd/MM/yyyy':
        return `${day}/${month}/${year}`;
      case 'yyyy-MM-dd':
        return `${year}-${month}-${day}`;
      case 'MM.dd.yyyy':
        return `${month}.${day}.${year}`;
      default:
        return `${month}/${day}/${year}`;
    }
  };

  const handleDateChange = (date: Date) => {
    onChange(date);
    setIsOpen(false);
  };

  return (
    <div className={className} ref={containerRef}>
      {label && (
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          {label}
        </label>
      )}
      <div className="relative">
        <button
          type="button"
          onClick={() => !disabled && setIsOpen(!isOpen)}
          className={`
            w-full flex items-center justify-between
            px-3 py-2 rounded-md
            border border-gray-300 dark:border-gray-600
            bg-white dark:bg-gray-800
            text-left
            ${
              disabled
                ? 'opacity-50 cursor-not-allowed'
                : 'hover:border-gray-400 dark:hover:border-gray-500'
            }
            focus:outline-none focus:ring-2 focus:ring-primary-500
          `}
        >
          <span className={`
            text-sm
            ${value ? 'text-gray-900 dark:text-gray-100' : 'text-gray-500 dark:text-gray-400'}
          `}>
            {value ? formatDate(value) : placeholder}
          </span>
          <CalendarIcon className="h-5 w-5 text-gray-400" />
        </button>

        {isOpen && (
          <div className="absolute z-10 mt-1">
            <Calendar
              value={value}
              onChange={handleDateChange}
              min={min}
              max={max}
              disabled={disabled}
            />
          </div>
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

interface DateRangePickerProps extends Omit<DatePickerProps, 'value' | 'onChange'> {
  startDate: Date;
  endDate: Date;
  onStartDateChange: (date: Date) => void;
  onEndDateChange: (date: Date) => void;
  startLabel?: string;
  endLabel?: string;
}

export const DateRangePicker: React.FC<DateRangePickerProps> = ({
  startDate,
  endDate,
  onStartDateChange,
  onEndDateChange,
  min,
  max,
  startLabel = 'Start date',
  endLabel = 'End date',
  error,
  disabled = false,
  className = '',
  format,
}) => {
  return (
    <div className={`space-y-4 ${className}`}>
      <DatePicker
        value={startDate}
        onChange={onStartDateChange}
        min={min}
        max={endDate}
        label={startLabel}
        disabled={disabled}
        format={format}
      />
      <DatePicker
        value={endDate}
        onChange={onEndDateChange}
        min={startDate}
        max={max}
        label={endLabel}
        disabled={disabled}
        format={format}
      />
      {error && (
        <p className="text-sm text-danger-600 dark:text-danger-400">
          {error}
        </p>
      )}
    </div>
  );
};

export default DatePicker;

import React, { useState } from 'react';
import {
  ChevronLeftIcon,
  ChevronRightIcon,
} from '@heroicons/react/outline';

interface CalendarProps {
  value?: Date;
  onChange?: (date: Date) => void;
  min?: Date;
  max?: Date;
  className?: string;
  disabled?: boolean;
}

const Calendar: React.FC<CalendarProps> = ({
  value = new Date(),
  onChange,
  min,
  max,
  className = '',
  disabled = false,
}) => {
  const [currentDate, setCurrentDate] = useState(value);
  const [viewDate, setViewDate] = useState(value);

  const daysInMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
  };

  const startOfMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth(), 1).getDay();
  };

  const isToday = (date: Date) => {
    const today = new Date();
    return (
      date.getDate() === today.getDate() &&
      date.getMonth() === today.getMonth() &&
      date.getFullYear() === today.getFullYear()
    );
  };

  const isSelected = (date: Date) => {
    return (
      date.getDate() === currentDate.getDate() &&
      date.getMonth() === currentDate.getMonth() &&
      date.getFullYear() === currentDate.getFullYear()
    );
  };

  const isDisabled = (date: Date) => {
    if (disabled) return true;
    if (min && date < min) return true;
    if (max && date > max) return true;
    return false;
  };

  const handleDateClick = (day: number) => {
    const newDate = new Date(viewDate.getFullYear(), viewDate.getMonth(), day);
    if (isDisabled(newDate)) return;
    setCurrentDate(newDate);
    onChange?.(newDate);
  };

  const handleMonthChange = (increment: number) => {
    setViewDate(new Date(viewDate.getFullYear(), viewDate.getMonth() + increment, 1));
  };

  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  const renderCalendarDays = () => {
    const days = [];
    const totalDays = daysInMonth(viewDate);
    const startDay = startOfMonth(viewDate);

    // Add empty cells for days before the start of the month
    for (let i = 0; i < startDay; i++) {
      days.push(
        <div key={`empty-${i}`} className="h-10" />
      );
    }

    // Add cells for each day of the month
    for (let day = 1; day <= totalDays; day++) {
      const date = new Date(viewDate.getFullYear(), viewDate.getMonth(), day);
      const isCurrentDay = isToday(date);
      const isSelectedDay = isSelected(date);
      const isDisabledDay = isDisabled(date);

      days.push(
        <button
          key={day}
          onClick={() => handleDateClick(day)}
          disabled={isDisabledDay}
          className={`
            h-10 w-10 rounded-full
            flex items-center justify-center
            text-sm font-medium
            transition-colors duration-200
            ${
              isSelectedDay
                ? 'bg-primary-600 text-white'
                : isCurrentDay
                ? 'bg-primary-100 dark:bg-primary-900/20 text-primary-600 dark:text-primary-400'
                : 'text-gray-900 dark:text-gray-100 hover:bg-gray-100 dark:hover:bg-gray-800'
            }
            ${
              isDisabledDay
                ? 'opacity-50 cursor-not-allowed'
                : 'cursor-pointer'
            }
          `}
        >
          {day}
        </button>
      );
    }

    return days;
  };

  return (
    <div className={`
      bg-white dark:bg-gray-900
      border border-gray-200 dark:border-gray-700
      rounded-lg shadow-sm
      ${className}
    `}>
      <div className="px-4 py-3 border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center justify-between">
          <button
            onClick={() => handleMonthChange(-1)}
            className={`
              p-1 rounded-full
              text-gray-400 hover:text-gray-500 dark:text-gray-500 dark:hover:text-gray-400
              focus:outline-none focus:ring-2 focus:ring-primary-500
            `}
          >
            <ChevronLeftIcon className="h-5 w-5" />
          </button>
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
            {monthNames[viewDate.getMonth()]} {viewDate.getFullYear()}
          </h2>
          <button
            onClick={() => handleMonthChange(1)}
            className={`
              p-1 rounded-full
              text-gray-400 hover:text-gray-500 dark:text-gray-500 dark:hover:text-gray-400
              focus:outline-none focus:ring-2 focus:ring-primary-500
            `}
          >
            <ChevronRightIcon className="h-5 w-5" />
          </button>
        </div>
      </div>
      <div className="p-4">
        <div className="grid grid-cols-7 gap-1 mb-2">
          {dayNames.map((day) => (
            <div
              key={day}
              className="h-8 flex items-center justify-center text-xs font-medium text-gray-500 dark:text-gray-400"
            >
              {day}
            </div>
          ))}
        </div>
        <div className="grid grid-cols-7 gap-1">
          {renderCalendarDays()}
        </div>
      </div>
    </div>
  );
};

export default Calendar;

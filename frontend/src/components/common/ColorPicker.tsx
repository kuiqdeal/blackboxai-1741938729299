import React, { useState, useRef, useEffect } from 'react';

interface ColorPickerProps {
  value: string;
  onChange: (color: string) => void;
  label?: string;
  error?: string;
  disabled?: boolean;
  className?: string;
  presetColors?: string[];
}

const ColorPicker: React.FC<ColorPickerProps> = ({
  value,
  onChange,
  label,
  error,
  disabled = false,
  className = '',
  presetColors = [
    '#000000', '#FFFFFF', '#FF0000', '#00FF00', '#0000FF',
    '#FFFF00', '#FF00FF', '#00FFFF', '#808080', '#800000',
    '#008000', '#000080', '#808000', '#800080', '#008080',
  ],
}) => {
  const [showPicker, setShowPicker] = useState(false);
  const pickerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (pickerRef.current && !pickerRef.current.contains(event.target as Node)) {
        setShowPicker(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleColorChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange(e.target.value);
  };

  const handlePresetClick = (color: string) => {
    onChange(color);
    setShowPicker(false);
  };

  const isLight = (color: string) => {
    const hex = color.replace('#', '');
    const r = parseInt(hex.substr(0, 2), 16);
    const g = parseInt(hex.substr(2, 2), 16);
    const b = parseInt(hex.substr(4, 2), 16);
    const brightness = (r * 299 + g * 587 + b * 114) / 1000;
    return brightness > 128;
  };

  return (
    <div className={className}>
      {label && (
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          {label}
        </label>
      )}
      <div className="relative" ref={pickerRef}>
        <button
          type="button"
          onClick={() => !disabled && setShowPicker(!showPicker)}
          className={`
            w-full flex items-center
            px-3 py-2 rounded-md
            border border-gray-300 dark:border-gray-600
            ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer hover:border-gray-400 dark:hover:border-gray-500'}
            focus:outline-none focus:ring-2 focus:ring-primary-500
          `}
        >
          <div
            className={`
              h-6 w-6 rounded
              border border-gray-200 dark:border-gray-700
              ${isLight(value) ? 'shadow-sm' : ''}
            `}
            style={{ backgroundColor: value }}
          />
          <span className="ml-2 text-sm text-gray-900 dark:text-gray-100">
            {value.toUpperCase()}
          </span>
        </button>

        {showPicker && (
          <div
            className={`
              absolute z-10 mt-2
              bg-white dark:bg-gray-800
              rounded-lg shadow-lg
              border border-gray-200 dark:border-gray-700
              p-4
            `}
          >
            <div className="mb-4">
              <input
                type="color"
                value={value}
                onChange={handleColorChange}
                className="w-full h-10 rounded cursor-pointer"
              />
            </div>
            <div className="grid grid-cols-5 gap-2">
              {presetColors.map((color) => (
                <button
                  key={color}
                  onClick={() => handlePresetClick(color)}
                  className={`
                    h-8 w-8 rounded
                    border border-gray-200 dark:border-gray-700
                    ${isLight(color) ? 'shadow-sm' : ''}
                    hover:scale-110
                    transition-transform duration-100
                    focus:outline-none focus:ring-2 focus:ring-primary-500
                  `}
                  style={{ backgroundColor: color }}
                >
                  <span className="sr-only">Select color {color}</span>
                </button>
              ))}
            </div>
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

interface ColorSwatchProps {
  color: string;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export const ColorSwatch: React.FC<ColorSwatchProps> = ({
  color,
  size = 'md',
  className = '',
}) => {
  const sizeStyles = {
    sm: 'h-4 w-4',
    md: 'h-6 w-6',
    lg: 'h-8 w-8',
  };

  const isLight = (color: string) => {
    const hex = color.replace('#', '');
    const r = parseInt(hex.substr(0, 2), 16);
    const g = parseInt(hex.substr(2, 2), 16);
    const b = parseInt(hex.substr(4, 2), 16);
    const brightness = (r * 299 + g * 587 + b * 114) / 1000;
    return brightness > 128;
  };

  return (
    <div
      className={`
        rounded
        border border-gray-200 dark:border-gray-700
        ${isLight(color) ? 'shadow-sm' : ''}
        ${sizeStyles[size]}
        ${className}
      `}
      style={{ backgroundColor: color }}
    />
  );
};

export default ColorPicker;

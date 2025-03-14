import React from 'react';

interface TextAreaProps {
  value: string;
  onChange: (value: string) => void;
  label?: string;
  placeholder?: string;
  error?: string;
  disabled?: boolean;
  rows?: number;
  maxLength?: number;
  showCount?: boolean;
  autoResize?: boolean;
  className?: string;
  required?: boolean;
}

const TextArea: React.FC<TextAreaProps> = ({
  value,
  onChange,
  label,
  placeholder,
  error,
  disabled = false,
  rows = 4,
  maxLength,
  showCount = false,
  autoResize = false,
  className = '',
  required = false,
}) => {
  const textAreaRef = React.useRef<HTMLTextAreaElement>(null);

  React.useEffect(() => {
    if (autoResize && textAreaRef.current) {
      textAreaRef.current.style.height = 'auto';
      textAreaRef.current.style.height = `${textAreaRef.current.scrollHeight}px`;
    }
  }, [value, autoResize]);

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newValue = e.target.value;
    if (maxLength && newValue.length > maxLength) return;
    onChange(newValue);
  };

  return (
    <div className={className}>
      {label && (
        <label
          htmlFor="textarea"
          className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
        >
          {label}
          {required && (
            <span className="ml-1 text-danger-500" aria-hidden="true">
              *
            </span>
          )}
        </label>
      )}
      <div className="relative">
        <textarea
          ref={textAreaRef}
          id="textarea"
          value={value}
          onChange={handleChange}
          placeholder={placeholder}
          disabled={disabled}
          rows={rows}
          maxLength={maxLength}
          required={required}
          className={`
            block w-full
            rounded-md
            bg-white dark:bg-gray-800
            border
            ${
              error
                ? 'border-danger-500 focus:ring-danger-500 focus:border-danger-500'
                : 'border-gray-300 dark:border-gray-600 focus:ring-primary-500 focus:border-primary-500'
            }
            ${disabled ? 'opacity-50 cursor-not-allowed' : ''}
            px-3 py-2
            text-base text-gray-900 dark:text-white
            placeholder-gray-400 dark:placeholder-gray-500
            focus:outline-none
            ${autoResize ? 'overflow-hidden' : 'resize-y'}
          `}
        />
        {showCount && maxLength && (
          <div className="absolute bottom-2 right-2">
            <span
              className={`
                text-sm
                ${
                  value.length >= maxLength
                    ? 'text-danger-500'
                    : 'text-gray-400 dark:text-gray-500'
                }
              `}
            >
              {value.length}/{maxLength}
            </span>
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

interface TextAreaGroupProps {
  items: Array<{
    value: string;
    onChange: (value: string) => void;
    label?: string;
    placeholder?: string;
    error?: string;
    disabled?: boolean;
    rows?: number;
    maxLength?: number;
  }>;
  orientation?: 'horizontal' | 'vertical';
  className?: string;
}

export const TextAreaGroup: React.FC<TextAreaGroupProps> = ({
  items,
  orientation = 'vertical',
  className = '',
}) => {
  return (
    <div
      className={`
        ${orientation === 'horizontal' ? 'flex space-x-4' : 'space-y-4'}
        ${className}
      `}
    >
      {items.map((item, index) => (
        <TextArea
          key={index}
          value={item.value}
          onChange={item.onChange}
          label={item.label}
          placeholder={item.placeholder}
          error={item.error}
          disabled={item.disabled}
          rows={item.rows}
          maxLength={item.maxLength}
          className="flex-1"
        />
      ))}
    </div>
  );
};

export default TextArea;

import React, { useRef, useState } from 'react';
import { DocumentIcon, PhotographIcon, XIcon } from '@heroicons/react/outline';

interface FileUploadProps {
  onChange: (files: File[]) => void;
  value?: File[];
  accept?: string;
  multiple?: boolean;
  maxSize?: number;
  maxFiles?: number;
  label?: string;
  description?: string;
  error?: string;
  disabled?: boolean;
  className?: string;
  preview?: boolean;
  onError?: (error: string) => void;
}

const FileUpload: React.FC<FileUploadProps> = ({
  onChange,
  value = [],
  accept,
  multiple = false,
  maxSize,
  maxFiles = 1,
  label,
  description,
  error,
  disabled = false,
  className = '',
  preview = true,
  onError,
}) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const [dragActive, setDragActive] = useState(false);

  const handleFiles = (files: FileList | null) => {
    if (!files) return;

    const fileArray = Array.from(files);
    const errors: string[] = [];

    // Validate number of files
    if (fileArray.length + value.length > maxFiles) {
      errors.push(`Maximum ${maxFiles} file${maxFiles > 1 ? 's' : ''} allowed`);
    }

    // Validate file size
    if (maxSize) {
      fileArray.forEach((file) => {
        if (file.size > maxSize) {
          errors.push(`${file.name} exceeds maximum size of ${formatBytes(maxSize)}`);
        }
      });
    }

    if (errors.length > 0) {
      onError?.(errors.join(', '));
      return;
    }

    onChange([...value, ...fileArray].slice(0, maxFiles));
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    handleFiles(e.dataTransfer.files);
  };

  const handleRemove = (index: number) => {
    onChange(value.filter((_, i) => i !== index));
  };

  const formatBytes = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const renderPreview = (file: File, index: number) => {
    const isImage = file.type.startsWith('image/');

    return (
      <div
        key={`${file.name}-${index}`}
        className="relative group rounded-lg border border-gray-200 dark:border-gray-700 p-2"
      >
        <div className="flex items-center space-x-3">
          {preview && isImage ? (
            <img
              src={URL.createObjectURL(file)}
              alt={file.name}
              className="h-10 w-10 object-cover rounded"
            />
          ) : (
            <div className="h-10 w-10 flex items-center justify-center rounded bg-gray-100 dark:bg-gray-800">
              {isImage ? (
                <PhotographIcon className="h-6 w-6 text-gray-400" />
              ) : (
                <DocumentIcon className="h-6 w-6 text-gray-400" />
              )}
            </div>
          )}
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
              {file.name}
            </p>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              {formatBytes(file.size)}
            </p>
          </div>
          <button
            type="button"
            onClick={() => handleRemove(index)}
            className="p-1 rounded-full text-gray-400 hover:text-gray-500 focus:outline-none"
          >
            <XIcon className="h-5 w-5" />
          </button>
        </div>
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
        className={`
          relative rounded-lg border-2 border-dashed
          ${
            dragActive
              ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20'
              : error
              ? 'border-danger-500 bg-danger-50 dark:bg-danger-900/20'
              : 'border-gray-300 dark:border-gray-600'
          }
          ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
        `}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
      >
        <input
          ref={inputRef}
          type="file"
          className="sr-only"
          onChange={(e) => handleFiles(e.target.files)}
          accept={accept}
          multiple={multiple}
          disabled={disabled}
        />
        <div className="p-6 text-center">
          <div className="mx-auto h-12 w-12 text-gray-400">
            <PhotographIcon />
          </div>
          <div className="mt-4">
            <button
              type="button"
              onClick={() => inputRef.current?.click()}
              disabled={disabled}
              className={`
                inline-flex text-sm font-medium text-primary-600 dark:text-primary-400
                hover:text-primary-500 focus:outline-none
                ${disabled ? 'cursor-not-allowed' : ''}
              `}
            >
              Upload files
            </button>
            <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
              {description ||
                `Drag & drop files or click to browse. ${
                  maxSize ? `Maximum file size: ${formatBytes(maxSize)}.` : ''
                }`}
            </p>
          </div>
        </div>
      </div>

      {value.length > 0 && (
        <div className="mt-4 space-y-2">
          {value.map((file, index) => renderPreview(file, index))}
        </div>
      )}

      {error && (
        <p className="mt-2 text-sm text-danger-600 dark:text-danger-400">
          {error}
        </p>
      )}
    </div>
  );
};

export default FileUpload;

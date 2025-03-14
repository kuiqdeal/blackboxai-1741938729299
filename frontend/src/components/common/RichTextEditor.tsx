import React, { useState, useRef, useEffect } from 'react';
import {
  BoldIcon,
  ItalicIcon,
  UnderlineIcon,
  ListBulletIcon,
  ListNumberedIcon,
  LinkIcon,
  CodeIcon,
  QuoteIcon,
} from '@heroicons/react/outline';

interface RichTextEditorProps {
  value: string;
  onChange: (value: string) => void;
  label?: string;
  placeholder?: string;
  error?: string;
  disabled?: boolean;
  className?: string;
  minHeight?: string;
  maxHeight?: string;
}

const RichTextEditor: React.FC<RichTextEditorProps> = ({
  value,
  onChange,
  label,
  placeholder = 'Start typing...',
  error,
  disabled = false,
  className = '',
  minHeight = '200px',
  maxHeight = '500px',
}) => {
  const editorRef = useRef<HTMLDivElement>(null);
  const [isLinkModalOpen, setIsLinkModalOpen] = useState(false);
  const [linkUrl, setLinkUrl] = useState('');
  const [linkText, setLinkText] = useState('');

  useEffect(() => {
    if (editorRef.current) {
      editorRef.current.innerHTML = value;
    }
  }, [value]);

  const handleChange = () => {
    if (editorRef.current) {
      onChange(editorRef.current.innerHTML);
    }
  };

  const execCommand = (command: string, value: string | null = null) => {
    if (disabled) return;
    document.execCommand(command, false, value);
    handleChange();
    editorRef.current?.focus();
  };

  const handleLinkSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (linkUrl) {
      const text = linkText || linkUrl;
      execCommand('insertHTML', `<a href="${linkUrl}" target="_blank" rel="noopener noreferrer">${text}</a>`);
      setIsLinkModalOpen(false);
      setLinkUrl('');
      setLinkText('');
    }
  };

  const ToolbarButton: React.FC<{
    icon: React.ElementType;
    command: string;
    active?: boolean;
    onClick?: () => void;
  }> = ({ icon: Icon, command, active, onClick }) => (
    <button
      type="button"
      onClick={() => onClick ? onClick() : execCommand(command)}
      disabled={disabled}
      className={`
        p-1 rounded-md
        ${
          active
            ? 'bg-gray-200 dark:bg-gray-700'
            : 'hover:bg-gray-100 dark:hover:bg-gray-800'
        }
        ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
        focus:outline-none focus:ring-2 focus:ring-primary-500
      `}
    >
      <Icon className="h-5 w-5 text-gray-600 dark:text-gray-300" />
    </button>
  );

  return (
    <div className={className}>
      {label && (
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          {label}
        </label>
      )}
      <div
        className={`
          border rounded-lg overflow-hidden
          ${error ? 'border-danger-500' : 'border-gray-300 dark:border-gray-600'}
          ${disabled ? 'opacity-50' : ''}
        `}
      >
        <div className="flex flex-wrap gap-1 p-2 border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800">
          <ToolbarButton icon={BoldIcon} command="bold" />
          <ToolbarButton icon={ItalicIcon} command="italic" />
          <ToolbarButton icon={UnderlineIcon} command="underline" />
          <div className="w-px h-6 mx-1 bg-gray-300 dark:bg-gray-600" />
          <ToolbarButton icon={ListBulletIcon} command="insertUnorderedList" />
          <ToolbarButton icon={ListNumberedIcon} command="insertOrderedList" />
          <div className="w-px h-6 mx-1 bg-gray-300 dark:bg-gray-600" />
          <ToolbarButton
            icon={LinkIcon}
            command="createLink"
            onClick={() => setIsLinkModalOpen(true)}
          />
          <ToolbarButton icon={CodeIcon} command="formatBlock" />
          <ToolbarButton icon={QuoteIcon} command="formatBlock" />
        </div>

        <div
          ref={editorRef}
          contentEditable={!disabled}
          onInput={handleChange}
          className={`
            p-4 outline-none
            bg-white dark:bg-gray-900
            text-gray-900 dark:text-gray-100
            ${disabled ? 'cursor-not-allowed' : ''}
          `}
          style={{
            minHeight,
            maxHeight,
            overflowY: 'auto',
          }}
          placeholder={placeholder}
        />

        {isLinkModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
            <div className="bg-white dark:bg-gray-800 rounded-lg p-6 w-96">
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
                Insert Link
              </h3>
              <form onSubmit={handleLinkSubmit}>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      URL
                    </label>
                    <input
                      type="url"
                      value={linkUrl}
                      onChange={(e) => setLinkUrl(e.target.value)}
                      className="w-full px-3 py-2 rounded-md border border-gray-300 dark:border-gray-600"
                      placeholder="https://example.com"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Text (optional)
                    </label>
                    <input
                      type="text"
                      value={linkText}
                      onChange={(e) => setLinkText(e.target.value)}
                      className="w-full px-3 py-2 rounded-md border border-gray-300 dark:border-gray-600"
                      placeholder="Link text"
                    />
                  </div>
                  <div className="flex justify-end space-x-2">
                    <button
                      type="button"
                      onClick={() => setIsLinkModalOpen(false)}
                      className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-4 py-2 text-sm font-medium text-white bg-primary-600 rounded-md"
                    >
                      Insert
                    </button>
                  </div>
                </div>
              </form>
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

export default RichTextEditor;

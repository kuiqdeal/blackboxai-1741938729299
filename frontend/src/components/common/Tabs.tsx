import React, { useState } from 'react';

interface Tab {
  id: string;
  label: string;
  icon?: React.ReactNode;
  content: React.ReactNode;
  disabled?: boolean;
}

interface TabsProps {
  tabs: Tab[];
  defaultTab?: string;
  onChange?: (tabId: string) => void;
  variant?: 'default' | 'pills' | 'underline';
  fullWidth?: boolean;
  className?: string;
}

const Tabs: React.FC<TabsProps> = ({
  tabs,
  defaultTab,
  onChange,
  variant = 'default',
  fullWidth = false,
  className = '',
}) => {
  const [activeTab, setActiveTab] = useState(defaultTab || tabs[0]?.id);

  const handleTabClick = (tabId: string) => {
    setActiveTab(tabId);
    onChange?.(tabId);
  };

  const variantStyles = {
    default: {
      container: 'border-b border-gray-200 dark:border-gray-700',
      tab: {
        base: 'inline-flex items-center px-4 py-2 -mb-px text-sm font-medium border-b-2',
        active:
          'text-primary-600 border-primary-500 dark:text-primary-500 dark:border-primary-500',
        inactive:
          'text-gray-500 border-transparent hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300',
        disabled: 'text-gray-400 cursor-not-allowed dark:text-gray-600',
      },
    },
    pills: {
      container: 'space-x-2',
      tab: {
        base: 'inline-flex items-center px-3 py-1.5 text-sm font-medium rounded-full',
        active:
          'text-white bg-primary-600 dark:bg-primary-500',
        inactive:
          'text-gray-500 bg-gray-100 hover:text-gray-700 hover:bg-gray-200 dark:text-gray-400 dark:bg-gray-800 dark:hover:bg-gray-700',
        disabled: 'text-gray-400 bg-gray-100 cursor-not-allowed dark:text-gray-600 dark:bg-gray-800',
      },
    },
    underline: {
      container: '',
      tab: {
        base: 'inline-flex items-center px-1 py-2 text-sm font-medium border-b-2',
        active:
          'text-primary-600 border-primary-500 dark:text-primary-500 dark:border-primary-500',
        inactive:
          'text-gray-500 border-transparent hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300',
        disabled: 'text-gray-400 cursor-not-allowed dark:text-gray-600',
      },
    },
  };

  const containerStyles = [
    'flex',
    fullWidth ? 'w-full' : '',
    variantStyles[variant].container,
    className,
  ]
    .filter(Boolean)
    .join(' ');

  const getTabStyles = (tab: Tab) => {
    const styles = [
      variantStyles[variant].tab.base,
      tab.disabled
        ? variantStyles[variant].tab.disabled
        : activeTab === tab.id
        ? variantStyles[variant].tab.active
        : variantStyles[variant].tab.inactive,
      fullWidth ? 'flex-1 justify-center' : '',
    ]
      .filter(Boolean)
      .join(' ');

    return styles;
  };

  return (
    <div className="w-full">
      <div className={containerStyles} role="tablist">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            role="tab"
            aria-selected={activeTab === tab.id}
            aria-controls={`panel-${tab.id}`}
            className={getTabStyles(tab)}
            onClick={() => !tab.disabled && handleTabClick(tab.id)}
            disabled={tab.disabled}
          >
            {tab.icon && <span className="mr-2">{tab.icon}</span>}
            {tab.label}
          </button>
        ))}
      </div>
      <div className="mt-4">
        {tabs.map((tab) => (
          <div
            key={tab.id}
            role="tabpanel"
            id={`panel-${tab.id}`}
            aria-labelledby={tab.id}
            hidden={activeTab !== tab.id}
          >
            {tab.content}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Tabs;

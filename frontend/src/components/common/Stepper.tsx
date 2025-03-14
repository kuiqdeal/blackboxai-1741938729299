import React from 'react';
import { CheckIcon } from '@heroicons/react/solid';

interface Step {
  id: string | number;
  label: string;
  description?: string;
  icon?: React.ReactNode;
  optional?: boolean;
}

interface StepperProps {
  steps: Step[];
  currentStep: number;
  orientation?: 'horizontal' | 'vertical';
  size?: 'sm' | 'md' | 'lg';
  variant?: 'default' | 'numbered' | 'icons';
  className?: string;
}

const Stepper: React.FC<StepperProps> = ({
  steps,
  currentStep,
  orientation = 'horizontal',
  size = 'md',
  variant = 'default',
  className = '',
}) => {
  const sizeStyles = {
    sm: {
      icon: 'h-6 w-6',
      text: 'text-sm',
      connector: 'h-0.5',
    },
    md: {
      icon: 'h-8 w-8',
      text: 'text-base',
      connector: 'h-0.5',
    },
    lg: {
      icon: 'h-10 w-10',
      text: 'text-lg',
      connector: 'h-1',
    },
  };

  const renderStepIcon = (step: Step, index: number, completed: boolean) => {
    if (variant === 'icons' && step.icon) {
      return (
        <div
          className={`
            flex items-center justify-center rounded-full
            ${sizeStyles[size].icon}
            ${
              completed
                ? 'bg-primary-600 text-white'
                : index === currentStep
                ? 'border-2 border-primary-600 text-primary-600'
                : 'border-2 border-gray-300 text-gray-400'
            }
          `}
        >
          {completed ? <CheckIcon className="h-5 w-5" /> : step.icon}
        </div>
      );
    }

    return (
      <div
        className={`
          flex items-center justify-center rounded-full
          ${sizeStyles[size].icon}
          ${
            completed
              ? 'bg-primary-600 text-white'
              : index === currentStep
              ? 'border-2 border-primary-600 text-primary-600'
              : 'border-2 border-gray-300 text-gray-400'
          }
        `}
      >
        {completed ? (
          <CheckIcon className="h-5 w-5" />
        ) : (
          <span>{variant === 'numbered' ? index + 1 : ''}</span>
        )}
      </div>
    );
  };

  const renderConnector = (index: number) => {
    if (index === steps.length - 1) return null;

    return (
      <div
        className={`
          flex-1
          ${orientation === 'vertical' ? 'w-px h-full' : sizeStyles[size].connector}
          ${
            index < currentStep
              ? 'bg-primary-600'
              : 'bg-gray-300 dark:bg-gray-700'
          }
        `}
      />
    );
  };

  if (orientation === 'vertical') {
    return (
      <div className={`flex flex-col space-y-4 ${className}`}>
        {steps.map((step, index) => (
          <div key={step.id} className="flex">
            <div className="flex flex-col items-center">
              {renderStepIcon(step, index, index < currentStep)}
              {renderConnector(index)}
            </div>
            <div className="ml-4 flex-1">
              <div className={`font-medium ${sizeStyles[size].text}`}>
                {step.label}
                {step.optional && (
                  <span className="text-sm text-gray-500 dark:text-gray-400">
                    {' '}
                    (Optional)
                  </span>
                )}
              </div>
              {step.description && (
                <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                  {step.description}
                </p>
              )}
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className={`flex items-center ${className}`}>
      {steps.map((step, index) => (
        <div
          key={step.id}
          className={`
            flex items-center
            ${index === 0 ? '' : 'flex-1'}
          `}
        >
          <div className="flex flex-col items-center">
            {renderStepIcon(step, index, index < currentStep)}
            <div className="mt-2">
              <div
                className={`
                  font-medium text-center
                  ${sizeStyles[size].text}
                  ${
                    index <= currentStep
                      ? 'text-gray-900 dark:text-white'
                      : 'text-gray-500 dark:text-gray-400'
                  }
                `}
              >
                {step.label}
                {step.optional && (
                  <span className="block text-sm text-gray-500 dark:text-gray-400">
                    Optional
                  </span>
                )}
              </div>
              {step.description && (
                <p className="mt-1 text-sm text-center text-gray-500 dark:text-gray-400">
                  {step.description}
                </p>
              )}
            </div>
          </div>
          {renderConnector(index)}
        </div>
      ))}
    </div>
  );
};

export default Stepper;

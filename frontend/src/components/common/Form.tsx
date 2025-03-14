import React from 'react';
import { Formik, Form as FormikForm, FormikProps, FormikHelpers } from 'formik';
import * as Yup from 'yup';

interface FormProps<T> {
  initialValues: T;
  validationSchema: Yup.Schema<T>;
  onSubmit: (values: T, helpers: FormikHelpers<T>) => void | Promise<void>;
  children: (formik: FormikProps<T>) => React.ReactNode;
  className?: string;
}

function Form<T>({
  initialValues,
  validationSchema,
  onSubmit,
  children,
  className = '',
}: FormProps<T>) {
  return (
    <Formik
      initialValues={initialValues}
      validationSchema={validationSchema}
      onSubmit={onSubmit}
    >
      {(formik) => (
        <FormikForm className={className} noValidate>
          {children(formik)}
        </FormikForm>
      )}
    </Formik>
  );
}

interface FormFieldProps {
  name: string;
  label?: string;
  error?: string;
  touched?: boolean;
  className?: string;
  children: React.ReactNode;
}

export const FormField: React.FC<FormFieldProps> = ({
  name,
  label,
  error,
  touched,
  className = '',
  children,
}) => {
  const showError = error && touched;

  return (
    <div className={className}>
      {label && (
        <label
          htmlFor={name}
          className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
        >
          {label}
        </label>
      )}
      {children}
      {showError && (
        <p className="mt-1 text-sm text-danger-600 dark:text-danger-400">
          {error}
        </p>
      )}
    </div>
  );
};

interface FormSectionProps {
  title?: string;
  description?: string;
  children: React.ReactNode;
  className?: string;
}

export const FormSection: React.FC<FormSectionProps> = ({
  title,
  description,
  children,
  className = '',
}) => {
  return (
    <div className={`space-y-6 ${className}`}>
      {(title || description) && (
        <div>
          {title && (
            <h3 className="text-lg font-medium leading-6 text-gray-900 dark:text-white">
              {title}
            </h3>
          )}
          {description && (
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
              {description}
            </p>
          )}
        </div>
      )}
      <div className="space-y-4">{children}</div>
    </div>
  );
};

interface FormActionsProps {
  children: React.ReactNode;
  align?: 'left' | 'center' | 'right';
  className?: string;
}

export const FormActions: React.FC<FormActionsProps> = ({
  children,
  align = 'right',
  className = '',
}) => {
  const alignmentStyles = {
    left: 'justify-start',
    center: 'justify-center',
    right: 'justify-end',
  };

  return (
    <div
      className={`flex items-center ${alignmentStyles[align]} space-x-3 ${className}`}
    >
      {children}
    </div>
  );
};

interface FormDividerProps {
  className?: string;
}

export const FormDivider: React.FC<FormDividerProps> = ({ className = '' }) => {
  return (
    <div className={`py-4 ${className}`}>
      <div className="border-t border-gray-200 dark:border-gray-700" />
    </div>
  );
};

interface FormErrorProps {
  error?: string;
  className?: string;
}

export const FormError: React.FC<FormErrorProps> = ({
  error,
  className = '',
}) => {
  if (!error) return null;

  return (
    <div
      className={`p-4 rounded-md bg-danger-50 dark:bg-danger-900/30 ${className}`}
    >
      <div className="flex">
        <div className="flex-shrink-0">
          <svg
            className="h-5 w-5 text-danger-400"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fillRule="evenodd"
              d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
              clipRule="evenodd"
            />
          </svg>
        </div>
        <div className="ml-3">
          <p className="text-sm text-danger-700 dark:text-danger-200">{error}</p>
        </div>
      </div>
    </div>
  );
};

export default Form;

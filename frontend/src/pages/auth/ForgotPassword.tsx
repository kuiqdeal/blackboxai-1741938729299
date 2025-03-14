import React from 'react';
import { Link } from 'react-router-dom';
import { Formik, Form, Field } from 'formik';
import * as Yup from 'yup';
import axios from 'axios';
import { toast } from 'react-toastify';

const validationSchema = Yup.object().shape({
  email: Yup.string()
    .email('Invalid email address')
    .required('Email is required'),
});

const ForgotPassword: React.FC = () => {
  const [loading, setLoading] = React.useState(false);
  const [emailSent, setEmailSent] = React.useState(false);

  const handleSubmit = async (values: { email: string }) => {
    try {
      setLoading(true);
      await axios.post('/api/auth/forgot-password', values);
      setEmailSent(true);
      toast.success('Password reset instructions have been sent to your email');
    } catch (error: any) {
      toast.error(error.response?.data?.error || 'Failed to send reset instructions');
    } finally {
      setLoading(false);
    }
  };

  if (emailSent) {
    return (
      <div className="text-center">
        <div className="rounded-full bg-success-100 p-3 mx-auto w-12 h-12 flex items-center justify-center">
          <svg
            className="w-6 h-6 text-success-600"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M5 13l4 4L19 7"
            />
          </svg>
        </div>
        <h3 className="mt-4 text-lg font-medium text-gray-900 dark:text-white">
          Check your email
        </h3>
        <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
          We've sent password reset instructions to your email address.
        </p>
        <div className="mt-6">
          <Link
            to="/auth/login"
            className="text-sm font-medium text-primary-600 hover:text-primary-500"
          >
            Return to sign in
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div>
      <h2 className="text-center text-2xl font-bold text-gray-900 dark:text-white mb-8">
        Reset your password
      </h2>
      <p className="text-sm text-gray-600 dark:text-gray-400 text-center mb-8">
        Enter your email address and we'll send you instructions to reset your password.
      </p>

      <Formik
        initialValues={{ email: '' }}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
      >
        {({ errors, touched }) => (
          <Form className="space-y-6">
            <div>
              <label htmlFor="email" className="form-label">
                Email address
              </label>
              <div className="mt-1">
                <Field
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  className={`form-input ${
                    errors.email && touched.email ? 'border-danger-500' : ''
                  }`}
                />
                {errors.email && touched.email && (
                  <div className="form-error">{errors.email}</div>
                )}
              </div>
            </div>

            <div>
              <button
                type="submit"
                disabled={loading}
                className="btn-primary w-full flex justify-center"
              >
                {loading ? (
                  <div className="spinner spinner-sm" />
                ) : (
                  'Send Reset Instructions'
                )}
              </button>
            </div>

            <div className="text-center">
              <Link
                to="/auth/login"
                className="text-sm font-medium text-primary-600 hover:text-primary-500"
              >
                Return to sign in
              </Link>
            </div>
          </Form>
        )}
      </Formik>
    </div>
  );
};

export default ForgotPassword;

import React from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { Formik, Form, Field } from 'formik';
import * as Yup from 'yup';
import axios from 'axios';
import { toast } from 'react-toastify';

const validationSchema = Yup.object().shape({
  password: Yup.string()
    .min(8, 'Password must be at least 8 characters')
    .matches(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/,
      'Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character'
    )
    .required('Password is required'),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref('password')], 'Passwords must match')
    .required('Confirm password is required'),
});

const ResetPassword: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token');
  const [loading, setLoading] = React.useState(false);

  React.useEffect(() => {
    if (!token) {
      toast.error('Invalid or missing reset token');
      navigate('/auth/login');
    }
  }, [token, navigate]);

  const handleSubmit = async (values: { password: string; confirmPassword: string }) => {
    try {
      setLoading(true);
      await axios.put('/api/auth/reset-password', {
        token,
        password: values.password,
      });
      toast.success('Password has been reset successfully');
      navigate('/auth/login');
    } catch (error: any) {
      toast.error(error.response?.data?.error || 'Failed to reset password');
    } finally {
      setLoading(false);
    }
  };

  if (!token) {
    return null;
  }

  return (
    <div>
      <h2 className="text-center text-2xl font-bold text-gray-900 dark:text-white mb-8">
        Reset your password
      </h2>
      <p className="text-sm text-gray-600 dark:text-gray-400 text-center mb-8">
        Please enter your new password below.
      </p>

      <Formik
        initialValues={{ password: '', confirmPassword: '' }}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
      >
        {({ errors, touched }) => (
          <Form className="space-y-6">
            <div>
              <label htmlFor="password" className="form-label">
                New Password
              </label>
              <div className="mt-1">
                <Field
                  id="password"
                  name="password"
                  type="password"
                  className={`form-input ${
                    errors.password && touched.password ? 'border-danger-500' : ''
                  }`}
                />
                {errors.password && touched.password && (
                  <div className="form-error">{errors.password}</div>
                )}
              </div>
            </div>

            <div>
              <label htmlFor="confirmPassword" className="form-label">
                Confirm New Password
              </label>
              <div className="mt-1">
                <Field
                  id="confirmPassword"
                  name="confirmPassword"
                  type="password"
                  className={`form-input ${
                    errors.confirmPassword && touched.confirmPassword ? 'border-danger-500' : ''
                  }`}
                />
                {errors.confirmPassword && touched.confirmPassword && (
                  <div className="form-error">{errors.confirmPassword}</div>
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
                  'Reset Password'
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

      <div className="mt-8 text-center">
        <p className="text-sm text-gray-600 dark:text-gray-400">
          Having trouble?{' '}
          <Link
            to="/auth/forgot-password"
            className="font-medium text-primary-600 hover:text-primary-500"
          >
            Request a new reset link
          </Link>
        </p>
      </div>
    </div>
  );
};

export default ResetPassword;

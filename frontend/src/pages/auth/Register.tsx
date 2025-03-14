import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { Formik, Form, Field } from 'formik';
import * as Yup from 'yup';
import { register } from '../../store/slices/authSlice';
import { RootState, AppDispatch } from '../../store';

const validationSchema = Yup.object().shape({
  name: Yup.string()
    .min(2, 'Name must be at least 2 characters')
    .required('Name is required'),
  email: Yup.string()
    .email('Invalid email address')
    .required('Email is required'),
  company: Yup.string()
    .required('Company name is required'),
  tenantId: Yup.string()
    .matches(/^[a-zA-Z0-9-]+$/, 'Only letters, numbers, and hyphens are allowed')
    .required('Workspace ID is required'),
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

interface RegisterFormValues {
  name: string;
  email: string;
  company: string;
  tenantId: string;
  password: string;
  confirmPassword: string;
}

const Register: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  const { loading, error } = useSelector((state: RootState) => state.auth);

  const handleSubmit = async (values: RegisterFormValues) => {
    const { confirmPassword, ...registerData } = values;
    const result = await dispatch(register(registerData));
    if (register.fulfilled.match(result)) {
      navigate('/');
    }
  };

  return (
    <div>
      <Formik
        initialValues={{
          name: '',
          email: '',
          company: '',
          tenantId: '',
          password: '',
          confirmPassword: '',
        }}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
      >
        {({ errors, touched, values, setFieldValue }) => (
          <Form className="space-y-6">
            <div>
              <label htmlFor="name" className="form-label">
                Full Name
              </label>
              <div className="mt-1">
                <Field
                  id="name"
                  name="name"
                  type="text"
                  autoComplete="name"
                  className={`form-input ${
                    errors.name && touched.name ? 'border-danger-500' : ''
                  }`}
                />
                {errors.name && touched.name && (
                  <div className="form-error">{errors.name}</div>
                )}
              </div>
            </div>

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
              <label htmlFor="company" className="form-label">
                Company Name
              </label>
              <div className="mt-1">
                <Field
                  id="company"
                  name="company"
                  type="text"
                  className={`form-input ${
                    errors.company && touched.company ? 'border-danger-500' : ''
                  }`}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                    const value = e.target.value;
                    setFieldValue('company', value);
                    // Auto-generate tenant ID from company name
                    setFieldValue(
                      'tenantId',
                      value
                        .toLowerCase()
                        .replace(/[^a-zA-Z0-9]/g, '-')
                        .replace(/-+/g, '-')
                        .replace(/^-|-$/g, '')
                    );
                  }}
                />
                {errors.company && touched.company && (
                  <div className="form-error">{errors.company}</div>
                )}
              </div>
            </div>

            <div>
              <label htmlFor="tenantId" className="form-label">
                Workspace ID
              </label>
              <div className="mt-1">
                <Field
                  id="tenantId"
                  name="tenantId"
                  type="text"
                  className={`form-input ${
                    errors.tenantId && touched.tenantId ? 'border-danger-500' : ''
                  }`}
                />
                {errors.tenantId && touched.tenantId && (
                  <div className="form-error">{errors.tenantId}</div>
                )}
                <p className="form-helper">
                  This will be your unique workspace URL: {values.tenantId}.saas-platform.com
                </p>
              </div>
            </div>

            <div>
              <label htmlFor="password" className="form-label">
                Password
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
                Confirm Password
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

            {error && (
              <div className="rounded-md bg-danger-50 p-4">
                <div className="text-sm text-danger-700">{error}</div>
              </div>
            )}

            <div>
              <button
                type="submit"
                disabled={loading}
                className="btn-primary w-full flex justify-center"
              >
                {loading ? (
                  <div className="spinner spinner-sm" />
                ) : (
                  'Create Account'
                )}
              </button>
            </div>

            <div className="text-center">
              <span className="text-sm text-gray-600 dark:text-gray-400">
                Already have an account?{' '}
                <Link
                  to="/auth/login"
                  className="font-medium text-primary-600 hover:text-primary-500"
                >
                  Sign in
                </Link>
              </span>
            </div>
          </Form>
        )}
      </Formik>
    </div>
  );
};

export default Register;

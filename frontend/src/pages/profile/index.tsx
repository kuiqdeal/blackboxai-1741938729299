import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Formik, Form, Field } from 'formik';
import * as Yup from 'yup';
import { toast } from 'react-toastify';
import { RootState, AppDispatch } from '../../store';
import { updateProfile } from '../../store/slices/authSlice';

const validationSchema = Yup.object().shape({
  name: Yup.string().required('Name is required'),
  email: Yup.string().email('Invalid email').required('Email is required'),
  currentPassword: Yup.string().min(8, 'Password must be at least 8 characters'),
  newPassword: Yup.string().min(8, 'Password must be at least 8 characters'),
  confirmNewPassword: Yup.string().oneOf(
    [Yup.ref('newPassword')],
    'Passwords must match'
  ),
});

const Profile: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { user, loading } = useSelector((state: RootState) => state.auth);
  const { theme } = useSelector((state: RootState) => state.settings);
  const [activeTab, setActiveTab] = useState('profile');

  const handleSubmit = async (values: any) => {
    try {
      await dispatch(updateProfile(values)).unwrap();
      toast.success('Profile updated successfully');
    } catch (error: any) {
      toast.error(error.message || 'Failed to update profile');
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-white dark:bg-gray-800 shadow overflow-hidden sm:rounded-lg">
        {/* Profile Header */}
        <div className="px-4 py-5 sm:px-6 border-b border-gray-200 dark:border-gray-700">
          <h3 className="text-lg leading-6 font-medium text-gray-900 dark:text-white">
            Profile Settings
          </h3>
          <p className="mt-1 max-w-2xl text-sm text-gray-500 dark:text-gray-400">
            Manage your account settings and preferences.
          </p>
        </div>

        {/* Tabs */}
        <div className="border-b border-gray-200 dark:border-gray-700">
          <nav className="-mb-px flex space-x-8 px-6" aria-label="Tabs">
            {['profile', 'security', 'preferences'].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`${
                  activeTab === tab
                    ? 'border-primary-500 text-primary-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300'
                } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm capitalize`}
              >
                {tab}
              </button>
            ))}
          </nav>
        </div>

        {/* Profile Form */}
        {activeTab === 'profile' && (
          <div className="px-4 py-5 sm:p-6">
            <Formik
              initialValues={{
                name: user?.name || '',
                email: user?.email || '',
                bio: user?.bio || '',
                company: user?.company || '',
              }}
              validationSchema={validationSchema}
              onSubmit={handleSubmit}
            >
              {({ errors, touched }) => (
                <Form className="space-y-6">
                  <div>
                    <label htmlFor="name" className="form-label">
                      Name
                    </label>
                    <Field
                      type="text"
                      name="name"
                      id="name"
                      className={`form-input ${
                        errors.name && touched.name ? 'border-danger-500' : ''
                      }`}
                    />
                    {errors.name && touched.name && (
                      <div className="form-error">{errors.name}</div>
                    )}
                  </div>

                  <div>
                    <label htmlFor="email" className="form-label">
                      Email
                    </label>
                    <Field
                      type="email"
                      name="email"
                      id="email"
                      className={`form-input ${
                        errors.email && touched.email ? 'border-danger-500' : ''
                      }`}
                    />
                    {errors.email && touched.email && (
                      <div className="form-error">{errors.email}</div>
                    )}
                  </div>

                  <div>
                    <label htmlFor="bio" className="form-label">
                      Bio
                    </label>
                    <Field
                      as="textarea"
                      name="bio"
                      id="bio"
                      rows={4}
                      className="form-input"
                      placeholder="Tell us about yourself"
                    />
                  </div>

                  <div>
                    <label htmlFor="company" className="form-label">
                      Company
                    </label>
                    <Field
                      type="text"
                      name="company"
                      id="company"
                      className="form-input"
                    />
                  </div>

                  <div className="flex justify-end">
                    <button
                      type="submit"
                      disabled={loading}
                      className="btn-primary"
                    >
                      {loading ? (
                        <div className="spinner spinner-sm" />
                      ) : (
                        'Save Changes'
                      )}
                    </button>
                  </div>
                </Form>
              )}
            </Formik>
          </div>
        )}

        {/* Security Form */}
        {activeTab === 'security' && (
          <div className="px-4 py-5 sm:p-6">
            <Formik
              initialValues={{
                currentPassword: '',
                newPassword: '',
                confirmNewPassword: '',
              }}
              validationSchema={validationSchema}
              onSubmit={handleSubmit}
            >
              {({ errors, touched }) => (
                <Form className="space-y-6">
                  <div>
                    <label htmlFor="currentPassword" className="form-label">
                      Current Password
                    </label>
                    <Field
                      type="password"
                      name="currentPassword"
                      id="currentPassword"
                      className={`form-input ${
                        errors.currentPassword && touched.currentPassword
                          ? 'border-danger-500'
                          : ''
                      }`}
                    />
                    {errors.currentPassword && touched.currentPassword && (
                      <div className="form-error">{errors.currentPassword}</div>
                    )}
                  </div>

                  <div>
                    <label htmlFor="newPassword" className="form-label">
                      New Password
                    </label>
                    <Field
                      type="password"
                      name="newPassword"
                      id="newPassword"
                      className={`form-input ${
                        errors.newPassword && touched.newPassword
                          ? 'border-danger-500'
                          : ''
                      }`}
                    />
                    {errors.newPassword && touched.newPassword && (
                      <div className="form-error">{errors.newPassword}</div>
                    )}
                  </div>

                  <div>
                    <label htmlFor="confirmNewPassword" className="form-label">
                      Confirm New Password
                    </label>
                    <Field
                      type="password"
                      name="confirmNewPassword"
                      id="confirmNewPassword"
                      className={`form-input ${
                        errors.confirmNewPassword && touched.confirmNewPassword
                          ? 'border-danger-500'
                          : ''
                      }`}
                    />
                    {errors.confirmNewPassword && touched.confirmNewPassword && (
                      <div className="form-error">{errors.confirmNewPassword}</div>
                    )}
                  </div>

                  <div className="flex justify-end">
                    <button
                      type="submit"
                      disabled={loading}
                      className="btn-primary"
                    >
                      {loading ? (
                        <div className="spinner spinner-sm" />
                      ) : (
                        'Update Password'
                      )}
                    </button>
                  </div>
                </Form>
              )}
            </Formik>
          </div>
        )}

        {/* Preferences Form */}
        {activeTab === 'preferences' && (
          <div className="px-4 py-5 sm:p-6">
            <div className="space-y-6">
              <div>
                <h4 className="text-sm font-medium text-gray-900 dark:text-white">
                  Theme Preference
                </h4>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Choose your preferred theme for the application.
                </p>
                <div className="mt-4 space-y-4">
                  <div className="flex items-center">
                    <input
                      id="theme-light"
                      name="theme"
                      type="radio"
                      checked={theme === 'light'}
                      className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300"
                    />
                    <label
                      htmlFor="theme-light"
                      className="ml-3 block text-sm font-medium text-gray-700 dark:text-gray-300"
                    >
                      Light
                    </label>
                  </div>
                  <div className="flex items-center">
                    <input
                      id="theme-dark"
                      name="theme"
                      type="radio"
                      checked={theme === 'dark'}
                      className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300"
                    />
                    <label
                      htmlFor="theme-dark"
                      className="ml-3 block text-sm font-medium text-gray-700 dark:text-gray-300"
                    >
                      Dark
                    </label>
                  </div>
                </div>
              </div>

              <div>
                <h4 className="text-sm font-medium text-gray-900 dark:text-white">
                  Email Notifications
                </h4>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Manage your email notification preferences.
                </p>
                <div className="mt-4 space-y-4">
                  <div className="flex items-start">
                    <div className="flex items-center h-5">
                      <input
                        id="notifications"
                        name="notifications"
                        type="checkbox"
                        className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                      />
                    </div>
                    <div className="ml-3 text-sm">
                      <label
                        htmlFor="notifications"
                        className="font-medium text-gray-700 dark:text-gray-300"
                      >
                        Email notifications
                      </label>
                      <p className="text-gray-500 dark:text-gray-400">
                        Receive email notifications about your account activity.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Profile;

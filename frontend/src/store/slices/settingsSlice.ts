import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { SettingsState } from '../../types';

const getInitialTheme = (): 'light' | 'dark' => {
  // Check local storage
  const savedTheme = localStorage.getItem('theme');
  if (savedTheme === 'light' || savedTheme === 'dark') {
    return savedTheme;
  }

  // Check system preference
  if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
    return 'dark';
  }

  return 'light';
};

const initialState: SettingsState = {
  theme: getInitialTheme(),
  language: localStorage.getItem('language') || 'en',
  sidebarCollapsed: localStorage.getItem('sidebarCollapsed') === 'true',
  notifications: {
    email: true,
    push: true,
    desktop: true,
  },
};

const settingsSlice = createSlice({
  name: 'settings',
  initialState,
  reducers: {
    toggleTheme: (state) => {
      state.theme = state.theme === 'light' ? 'dark' : 'light';
      localStorage.setItem('theme', state.theme);
    },
    setLanguage: (state, action: PayloadAction<string>) => {
      state.language = action.payload;
      localStorage.setItem('language', action.payload);
    },
    toggleSidebar: (state) => {
      state.sidebarCollapsed = !state.sidebarCollapsed;
      localStorage.setItem('sidebarCollapsed', String(state.sidebarCollapsed));
    },
    updateNotificationSettings: (
      state,
      action: PayloadAction<{
        email?: boolean;
        push?: boolean;
        desktop?: boolean;
      }>
    ) => {
      state.notifications = {
        ...state.notifications,
        ...action.payload,
      };
    },
    resetSettings: (state) => {
      state.theme = getInitialTheme();
      state.language = 'en';
      state.sidebarCollapsed = false;
      state.notifications = {
        email: true,
        push: true,
        desktop: true,
      };
      localStorage.removeItem('theme');
      localStorage.removeItem('language');
      localStorage.removeItem('sidebarCollapsed');
    },
  },
});

export const {
  toggleTheme,
  setLanguage,
  toggleSidebar,
  updateNotificationSettings,
  resetSettings,
} = settingsSlice.actions;

export default settingsSlice.reducer;

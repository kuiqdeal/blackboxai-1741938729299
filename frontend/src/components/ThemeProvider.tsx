import React, { createContext, useContext, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../store';

interface ThemeContextType {
  theme: 'light' | 'dark';
  isDark: boolean;
}

const ThemeContext = createContext<ThemeContextType>({
  theme: 'light',
  isDark: false,
});

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};

interface ThemeProviderProps {
  children: React.ReactNode;
}

export const ThemeProvider: React.FC<ThemeProviderProps> = ({ children }) => {
  const { theme } = useSelector((state: RootState) => state.settings);
  const isDark = theme === 'dark';

  useEffect(() => {
    // Update the class on the html element
    const root = window.document.documentElement;
    if (isDark) {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }

    // Update the color scheme meta tag
    const meta = document.querySelector('meta[name="color-scheme"]');
    if (meta) {
      meta.setAttribute('content', theme);
    }

    // Update the theme color meta tag for mobile browsers
    const themeColor = document.querySelector('meta[name="theme-color"]');
    if (themeColor) {
      themeColor.setAttribute(
        'content',
        isDark ? '#1a1b1e' : '#ffffff'
      );
    }
  }, [theme, isDark]);

  const value = {
    theme,
    isDark,
  };

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
};

export default ThemeProvider;

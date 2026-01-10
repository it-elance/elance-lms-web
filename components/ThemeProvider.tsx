'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';

type Theme = 'light' | 'dark' | 'system';

interface ThemeContextType {
  theme: Theme;
  setTheme: (theme: Theme) => void;
  resolvedTheme: 'light' | 'dark';
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

const ThemeProvider = ({ children }: { children: React.ReactNode }) => {
  const [theme, setThemeState] = useState<Theme>('system');
  const [resolvedTheme, setResolvedTheme] = useState<'light' | 'dark'>('light');
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const storedTheme = localStorage.getItem('theme');
    if (storedTheme === 'dark' || storedTheme === 'light') {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setThemeState(storedTheme);
    } else {
      setThemeState('system');
    }
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;

    const root = document.documentElement;

    const applyTheme = () => {
      const isDark =
        theme === 'dark' ||
        (theme === 'system' &&
          window.matchMedia('(prefers-color-scheme: dark)').matches);

      if (isDark) {
        root.setAttribute('data-theme', 'dark');
        setResolvedTheme('dark');
      } else {
        root.setAttribute('data-theme', 'light');
        setResolvedTheme('light');
      }
    };

    applyTheme();

    if (theme === 'system') {
      localStorage.removeItem('theme');
      const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');

      const handleSystemChange = () => {
        applyTheme();
      };

      mediaQuery.addEventListener('change', handleSystemChange);
      return () => mediaQuery.removeEventListener('change', handleSystemChange);
    } else {
      localStorage.setItem('theme', theme);
    }
  }, [theme, mounted]);

  return (
    <ThemeContext.Provider
      value={{ theme, setTheme: setThemeState, resolvedTheme }}
    >
      {children}
    </ThemeContext.Provider>
  );
};

export default ThemeProvider;

export const useTheme = () => {
  const context = useContext(ThemeContext);

  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};

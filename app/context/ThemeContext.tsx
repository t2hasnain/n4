'use client';

import { createContext, useContext, useEffect, useState } from 'react';

type Theme = 'light' | 'dark';

type ThemeContextType = {
  theme: Theme;
  toggleTheme: () => void;
  setTheme: (theme: Theme) => void;
};

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  // Always start with light theme on server to match initial HTML
  const [theme, setTheme] = useState<Theme>('light');
  const [mounted, setMounted] = useState(false);

  // Only run on client side after hydration is complete
  useEffect(() => {
    setMounted(true);
    
    try {
      const savedTheme = localStorage.getItem('theme') as Theme;
      if (savedTheme) {
        setTheme(savedTheme);
      } else {
        // Check for user's system preference
        const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        if (prefersDark) {
          setTheme('dark');
          localStorage.setItem('theme', 'dark');
        }
      }
    } catch (error) {
      console.error('Error accessing localStorage:', error);
    }
  }, []);

  // Update the class on the html element whenever theme changes
  useEffect(() => {
    if (!mounted) return;
    
    document.documentElement.classList.toggle('dark', theme === 'dark');
  }, [theme, mounted]);

  const toggleTheme = () => {
    if (!mounted) return;
    
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
    
    try {
      localStorage.setItem('theme', newTheme);
    } catch (error) {
      console.error('Error setting theme in localStorage:', error);
    }
  };

  const changeTheme = (newTheme: Theme) => {
    if (!mounted) return;
    
    setTheme(newTheme);
    
    try {
      localStorage.setItem('theme', newTheme);
    } catch (error) {
      console.error('Error setting theme in localStorage:', error);
    }
  };

  // Avoid theme-based rendering until client-side hydration is complete
  const contextValue = {
    theme: mounted ? theme : 'light', // Always use light during server-side rendering
    toggleTheme,
    setTheme: changeTheme
  };

  return (
    <ThemeContext.Provider value={contextValue}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
} 
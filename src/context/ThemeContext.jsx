import React, { createContext, useContext, useState, useEffect } from 'react';

const ThemeContext = createContext();

export const useTheme = () => useContext(ThemeContext);

export const ThemeProvider = ({ children }) => {
  const [theme, setTheme] = useState(localStorage.getItem('lms_theme') || 'light');
  const [primaryColor, setPrimaryColor] = useState(localStorage.getItem('lms_primary_color') || '#4F46E5');

  useEffect(() => {
    // Apply theme
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('lms_theme', theme);
    
    // Apply primary color
    document.documentElement.style.setProperty('--primary', primaryColor);
    
    // Calculate hover color based on primary color (slightly darker)
    // For simplicity, we just use opacity for hover here, normally we'd adjust HSL
    document.documentElement.style.setProperty('--primary-hover', primaryColor);
    
    localStorage.setItem('lms_primary_color', primaryColor);
  }, [theme, primaryColor]);

  const toggleTheme = () => {
    setTheme(prev => prev === 'light' ? 'dark' : 'light');
  };

  const changePrimaryColor = (color) => {
    setPrimaryColor(color);
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme, primaryColor, changePrimaryColor }}>
      {children}
    </ThemeContext.Provider>
  );
};

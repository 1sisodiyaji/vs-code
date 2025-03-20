import React, { createContext, useContext, useState } from 'react';

const ThemeContext = createContext();

export const themes = {
  dark: {
    bg: '#1e1e1e',
    sidebar: '#252526',
    text: '#cccccc',
    accent: '#519aba',
    folderIcon: '#e7c17a',
    hover: '#2a2d2e',
    border: '#1e1e1e'
  },
  light: {
    bg: '#ffffff',
    sidebar: '#f3f3f3',
    text: '#000000',
    accent: '#0098ff',
    folderIcon: '#dcb67a',
    hover: '#e8e8e8',
    border: '#e0e0e0'
  },
  dracula: {
    bg: '#282a36',
    sidebar: '#21222c',
    text: '#f8f8f2',
    accent: '#bd93f9',
    folderIcon: '#ffb86c',
    hover: '#44475a',
    border: '#191a21'
  }
};

export const ThemeProvider = ({ children }) => {
  const [theme, setTheme] = useState('dark');

  const toggleTheme = () => {
    setTheme(current => {
      const themeKeys = Object.keys(themes);
      const currentIndex = themeKeys.indexOf(current);
      const nextIndex = (currentIndex + 1) % themeKeys.length;
      return themeKeys[nextIndex];
    });
  };

  const themeColors = themes[theme];

  return (
    <ThemeContext.Provider value={{ theme, themeColors, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => useContext(ThemeContext);

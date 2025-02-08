import React, { useContext } from 'react';
import { Button } from 'react-bootstrap';
import ThemeContext from '../../context/ThemeContext';

const ThemeSwitcher = () => {
  const { theme, setTheme } = useContext(ThemeContext);

  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
    localStorage.setItem('theme', newTheme); 
  };

  return (
    <Button
      variant={theme === 'light' ? 'dark' : 'light'}
      onClick={toggleTheme}
    >
      {theme === 'light' ? 'Dark Mode' : 'Light Mode'}
    </Button>
  );
};

export default ThemeSwitcher;

import { useState, useEffect } from 'react';
import ThemeContext from './ThemeContext';
import PropTypes from 'prop-types';

const ThemeProvider = ({ children }) => {
  const storedTheme = localStorage.getItem('theme');
  const [theme, setTheme] = useState(storedTheme ? storedTheme : 'light');

  useEffect(() => {
    localStorage.setItem('theme', theme);
  }, [theme]);

  return (
    <ThemeContext.Provider value={{ theme, setTheme }}>
      <div
        className={`bg-${theme} text-${theme === 'light' ? 'dark' : 'light'}`}
        style={{ minHeight: '100vh' }}
      >
        {children}
      </div>
    </ThemeContext.Provider>
  );
};

ThemeProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

export default ThemeProvider;

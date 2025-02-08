import { useContext } from 'react';
import { Button } from 'react-bootstrap';
import ThemeContext from '../../context/ThemeContext';
import { useTranslation } from 'react-i18next';

const ThemeSwitcher = () => {
  const { theme, setTheme } = useContext(ThemeContext);
  const { t } = useTranslation();

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
      {theme === 'light' ? (
        <i className="bi bi-brightness-high"></i>
      ) : (
        <i className="bi bi-moon-stars-fill"></i>
      )}
    </Button>
  );
};

export default ThemeSwitcher;

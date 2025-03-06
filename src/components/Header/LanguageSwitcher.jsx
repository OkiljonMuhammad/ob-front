import { useTranslation } from 'react-i18next';
import { DropdownButton, Dropdown } from 'react-bootstrap';
import ThemeContext from '../../context/ThemeContext';
import { useContext } from 'react';
const LanguageSwitcher = () => {
  const { t, i18n } = useTranslation();
  const { theme } = useContext(ThemeContext);
  const changeLanguage = (lng) => {
    i18n.changeLanguage(lng);
    localStorage.setItem('language', lng);
  };

  const getTextColorClass = () => (theme === 'light' ? 'text-dark' : 'text-white');

  return (
    <DropdownButton
      id="language-dropdown"
      title={t('language')}
      variant="secondary"
      className={`me-2 bg-${theme} ${getTextColorClass()}`}
    > 
      <Dropdown.Item onClick={() => changeLanguage('en')} className={`bg-${theme} ${getTextColorClass()}`}>
        {t('english')}
      </Dropdown.Item>
      <Dropdown.Item onClick={() => changeLanguage('uz')} className={`bg-${theme} ${getTextColorClass()}`}>
        {t('uzbek')}
      </Dropdown.Item>
    </DropdownButton>
  );
};

export default LanguageSwitcher;

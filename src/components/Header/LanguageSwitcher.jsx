import { useTranslation } from 'react-i18next';
import { DropdownButton, Dropdown } from 'react-bootstrap';

const LanguageSwitcher = () => {
  const { t, i18n } = useTranslation();

  const changeLanguage = (lng) => {
    i18n.changeLanguage(lng);
    localStorage.setItem('language', lng);
  };

  return (
    <DropdownButton
      id="language-dropdown"
      title={t('language')}
      variant="secondary"
      className="me-2"
    >
      <Dropdown.Item onClick={() => changeLanguage('en')}>
        {t('english')}
      </Dropdown.Item>
      <Dropdown.Item onClick={() => changeLanguage('uz')}>
        {t('uzbek')}
      </Dropdown.Item>
    </DropdownButton>
  );
};

export default LanguageSwitcher;

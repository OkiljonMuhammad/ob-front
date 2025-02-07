import React from 'react';
import { useTranslation } from 'react-i18next';
import { DropdownButton, Dropdown } from 'react-bootstrap';

const LanguageSwitcher = () => {
  const { i18n } = useTranslation();

  const changeLanguage = (lng) => {
    i18n.changeLanguage(lng);
  };

  return (
    <DropdownButton
      id="language-dropdown"
      title="Language"
      variant="secondary"
      className="me-2"
    >
      <Dropdown.Item onClick={() => changeLanguage('en')}>
        English
      </Dropdown.Item>
      <Dropdown.Item onClick={() => changeLanguage('uz')}>Uzbek</Dropdown.Item>
    </DropdownButton>
  );
};

export default LanguageSwitcher;

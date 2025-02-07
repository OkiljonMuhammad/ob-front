import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

const resources = {
  en: {
    translation: {
      welcome: 'Welcome',
      description:
        'This is a simple app with internationalization and theming.',
      changeLanguage: 'Change Language',
    },
  },
  uz: {
    translation: {
      welcome: 'Xush kelibsiz',
      description: 'Bu oddiy ilova, xalqaro va mavzu imkoniyatlari bilan.',
      changeLanguage: "Tilni o'zgartirish",
    },
  },
};

i18n.use(initReactI18next).init({
  resources,
  lng: 'en',
  fallbackLng: 'en',
  interpolation: {
    escapeValue: false,
  },
});

export default i18n;

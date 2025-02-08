import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import en from './locales/en.js';
import uz from './locales/uz.js';

const resources = { en, uz };
const savedLanguage = localStorage.getItem('language') || 'en';

i18n.use(initReactI18next).init({
  resources,
  lng: savedLanguage,
  fallbackLng: 'en',
  interpolation: { escapeValue: false },
});

export default i18n;

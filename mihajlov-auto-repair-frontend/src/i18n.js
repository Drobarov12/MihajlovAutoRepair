// src/i18n.js
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

// Import your translation files
import translationEN from './locales/en/translation.json';
import translationMK from './locales/mk/translation.json';

const resources = {
  en: {
    translation: translationEN,
  },
  mk: {
    translation: translationMK,
  },
};

i18n
  .use(initReactI18next) // Connects i18next to React
  .init({
    resources,
    lng: 'mk', // Default language
    fallbackLng: 'mk', // Fallback language if translation is missing
    interpolation: {
      escapeValue: false, // React already escapes by default
    },
  });

export default i18n;

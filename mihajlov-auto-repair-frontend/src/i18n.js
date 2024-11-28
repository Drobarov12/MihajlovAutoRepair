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
  .use(initReactI18next)
  .init({
    resources,
    lng: 'mk', 
    fallbackLng: 'mk', 
    interpolation: {
      escapeValue: false, 
    },
  });

export default i18n;

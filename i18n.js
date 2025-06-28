import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

// Dil dosyalarını import ediyoruz
import en from './language/en.json';
import tr from './language/tr.json';
import fr from './language/fr.json';
import de from './language/de.json';

const resources = {
  en: {
    translation: en,
  },
  tr: {
    translation: tr,
  },
  fr: {
    translation: fr,
  },
  de: {
    translation: de,
  },
};

i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: 'tr', // Varsayılan dil
    fallbackLng: 'en', // Fallback dil
    interpolation: {
      escapeValue: false, // React zaten XSS koruması sağlıyor
    },
    compatibilityJSON: 'v3', // React Native için gerekli
  });

export default i18n; 
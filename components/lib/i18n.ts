import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

i18n.use(initReactI18next).init({
  lng: 'es', // Idioma por defecto
  fallbackLng: 'es',
  resources: {
    es: { translation: require('../public/locales/es/translation.json') },
    eu: { translation: require('../public/locales/eu/translation.json') },
    // ... otros idiomas
  },
});
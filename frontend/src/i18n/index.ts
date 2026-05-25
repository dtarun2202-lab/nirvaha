import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import en from './locales/en.json';
import hi from './locales/hi.json';
import te from './locales/te.json';
import kn from './locales/kn.json';
import type { AppLanguage } from '../types/settings';

const resources = {
  en: { translation: en },
  hi: { translation: hi },
  te: { translation: te },
  kn: { translation: kn },
};

const savedLang = (localStorage.getItem('nirvaha_language') as AppLanguage) || 'en';

i18n.use(initReactI18next).init({
  resources,
  lng: savedLang,
  fallbackLng: 'en',
  interpolation: { escapeValue: false },
});

export function applyLanguage(lang: AppLanguage): void {
  i18n.changeLanguage(lang);
  localStorage.setItem('nirvaha_language', lang);
  document.documentElement.lang = lang;
}

export default i18n;

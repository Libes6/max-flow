import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import { getLocales } from 'react-native-localize';

// Используем require для JSON файлов
const en = require('./translations/en.json');
const ru = require('./translations/ru.json');
const uk = require('./translations/uk.json');
const kk = require('./translations/kk.json');

const resources = {
  en: { translation: en },
  ru: { translation: ru },
  uk: { translation: uk },
  kk: { translation: kk },
};

// Функция для определения языка по умолчанию
const getDefaultLanguage = (): string => {
  // Если сохраненного языка нет, определяем по локали устройства
  const deviceLocales = getLocales();
  
  for (const locale of deviceLocales) {
    const languageCode = locale.languageCode;
    if (Object.keys(resources).includes(languageCode)) {
      return languageCode;
    }
  }
  
  // По умолчанию русский
  return 'ru';
};

i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: 'ru', // Будет переопределен в store
    fallbackLng: 'ru',
    interpolation: {
      escapeValue: false,
    },
  });

export { getDefaultLanguage };
export default i18n;

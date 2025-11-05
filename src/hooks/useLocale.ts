import { useTranslation } from 'react-i18next';
import { sv, enGB, nb } from 'date-fns/locale';
import type { Locale } from 'date-fns';

export const useLocale = (): Locale => {
  const { i18n } = useTranslation();
  
  const locales: Record<string, Locale> = {
    sv: sv,
    en: enGB,
    no: nb,
  };
  
  return locales[i18n.language] || sv;
};

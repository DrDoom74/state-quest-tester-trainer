
import { formatDistanceToNow } from 'date-fns';
import { ru, enUS } from 'date-fns/locale';
import { Language } from '@/hooks/useLanguage';

export const STATUS_LABELS: Record<Language, Record<string, string>> = {
  ru: {
    draft: 'Черновик',
    moderation: 'На модерации',
    rejected: 'Отклонена',
    published: 'Опубликована',
    unpublished: 'Снята с публикации',
    archived: 'Архив'
  },
  en: {
    draft: 'Draft',
    moderation: 'Under Moderation',
    rejected: 'Rejected',
    published: 'Published',
    unpublished: 'Unpublished',
    archived: 'Archived'
  }
};

export const formatDateWithLocale = (date: Date, language: Language): string => {
  return formatDistanceToNow(date, { 
    addSuffix: true,
    locale: language === 'ru' ? ru : enUS
  });
};

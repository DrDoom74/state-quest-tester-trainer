
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

// Define available languages
export type Language = 'ru' | 'en';

// Create context type
interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

// Create the context with default values
const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

// Language strings for both languages
const translations: Record<Language, Record<string, string>> = {
  ru: {
    // Header
    'app.title': 'QA State Transition Тренажер',
    'bugs.count': '/4',
    'button.resetProgress': 'Сбросить прогресс',
    'button.clearBlog': 'Очистить блог',
    'button.answers': 'Ответы',
    'button.language': 'EN',

    // Instruction panel
    'instructions.title': 'Описание задания',
    'instructions.purpose': 'Цель тренажера: протестировать функционал блога и найти баги, анализируя переходы состояний статьи в системе публикации.',
    'instructions.visibilityTitle': '1. Видимость статьи по статусам и ролям',
    'instructions.actionsTitle': '2. Доступные действия и переходы по статусам',
    'instructions.requirementsTitle': '3. Описание требований к статье',
    'instructions.tabsTitle': '4. Вкладки (роли) и их назначение',
    'state.draft': 'Черновик',
    'state.moderation': 'На модерации',
    'state.rejected': 'Отклонена',
    'state.published': 'Опубликована',
    'state.unpublished': 'Снята с публикации',
    'state.archived': 'Архив',
    'role.user': 'Пользователь 1',
    'role.moderator': 'Модератор',
    'role.guest': 'Гость',
    'action.edit': 'Редактировать',
    'action.delete': 'Удалить',
    'action.sendToModeration': 'Отправить на модерацию',
    'action.approve': 'Одобрить',
    'action.reject': 'Отклонить',
    'action.unpublish': 'Снять с публикации',
    'action.archive': 'В архив',
    'requirements.title': 'Минимальное количество символов в заголовке: 5',
    'requirements.titleMax': 'Максимальное количество символов в заголовке: 100',
    'requirements.content': 'Минимальное количество символов в содержании: 20',
    'requirements.contentMax': 'Максимальное количество символов в содержании: 1000',
    'requirements.maxArticles': 'Максимально возможное количество статей: 10',
    'requirements.categories': 'Доступные категории статей:',

    // Tabs and Roles
    'tabs.articles': 'Статьи',
    'tabs.bugs': 'Найденные баги',
    'articles.empty': 'Нет статей для отображения',
    'articles.createNew': 'Создайте новую статью, чтобы начать тестирование',
    'articles.noModeration': 'Нет статей на модерации или опубликованных',
    'articles.noPublished': 'Нет опубликованных статей',
    'articles.count': 'Статьи',
    'articles.create': 'Создать статью',
    'articles.limit': 'Достигнут лимит статей',

    // Bug tracker
    'bugs.found': 'Найденные баги',
    'bugs.none': 'Вы пока не нашли ни одного бага.',
    'bugs.tryActions': 'Попробуйте выполнить разные действия с статьями в разных состояниях.',
    'bugs.reproduction': 'Воспроизведение:',
    'bugs.foundTime': 'Найден',

    // Toast messages
    'toast.bugFound': 'Поздравляем! Баг найден!',
    'toast.progressReset': 'Прогресс сброшен',
    'toast.resetDescription': 'Счетчик багов и список найденных багов очищены',
    'toast.articleUpdated': 'Статья обновлена',
    'toast.articleUpdatedDesc': 'Изменения сохранены успешно',
    'toast.articleCreated': 'Статья создана',
    'toast.articleCreatedDesc': 'Новая статья добавлена в черновики',
    'toast.articleDeleted': 'Статья удалена',
    'toast.articleDeletedDesc': 'Статья была удалена',
    'toast.sentToModeration': 'Отправлено на модерацию',
    'toast.sentToModerationDesc': 'Статья отправлена на модерацию',
    'toast.published': 'Статья опубликована',
    'toast.publishedDesc': 'Статья успешно опубликована',
    'toast.unpublished': 'Статья снята с публикации',
    'toast.unpublishedDesc': 'Статья снята с публикации',
    'toast.republished': 'Статья опубликована',
    'toast.republishedDesc': 'Статья повторно опубликована',
    'toast.rejected': 'Статья отклонена',
    'toast.rejectedDesc': 'Статья была отклонена модератором',
    'toast.archived': 'Статья в архиве',
    'toast.archivedDesc': 'Статья перемещена в архив',

    // Article view
    'article.view': 'Просмотр статьи',
    'article.title': 'Заголовок',
    'article.category': 'Категория',
    'article.status': 'Статус',
    'article.content': 'Текст статьи',
    'article.created': 'Создано:',
    'article.updated': 'Обновлено:',
    'article.close': 'Закрыть',

    // Role description
    'roleDesc.user': 'Пользователь 1 (Автор)',
    'roleDesc.userDetail': 'Создаёт, редактирует, удаляет черновик. Инициирует отправку черновика на модерацию. Может отправить статью в архив. Видит все свои статьи во всех статусах.',
    'roleDesc.moderator': 'Модератор',
    'roleDesc.moderatorDetail': 'Проверяет черновики статей в статусе "На модерации": может одобрить или отклонить. Может снять с публикации статью или отправить в архив. Видит статьи в статусах "На модерации", "Отклонена", "Опубликована", "Снята с публикации".',
    'roleDesc.guest': 'Гость (Читатель)',
    'roleDesc.guestDetail': 'Имеет только права просмотра. Видит только статьи в статусе "Опубликована". Не может выполнять никаких действий.',

    // Bug descriptions 
    'bug.deleteUnpublished': 'Обнаружен баг! Пользователь может удалить снятую с публикации статью',
    'bug.deleteUnpublishedAction': 'Удаление снятой с публикации статьи пользователем',
    'bug.shortTitle': 'Обнаружен баг! Заголовок статьи меньше 5 символов.',
    'bug.shortTitleAction': 'Создание статьи с коротким заголовком',
    'bug.archivedView': 'Баг обнаружен. Статья в статусе Архив доступна для просмотра другим пользователям.',
    'bug.archivedViewAction': 'Просмотр статьи в статусе Архив',
    'bug.saveUnchanged': 'Обнаружен баг! Кнопка сохранить изменения доступна без внесения изменений в статью',
    'bug.saveUnchangedAction': 'Сохранение статьи без внесения изменений',

    // Article form
    'form.createArticle': 'Создать статью',
    'form.editArticle': 'Редактировать статью',
    'form.titleLabel': 'Заголовок статьи',
    'form.titlePlaceholder': 'Введите заголовок статьи',
    'form.categoryLabel': 'Категория',
    'form.categoryPlaceholder': 'Выберите категорию',
    'form.contentLabel': 'Текст статьи',
    'form.contentPlaceholder': 'Введите текст статьи',
    'form.save': 'Сохранить',
    'form.cancel': 'Отмена',
  },
  en: {
    // Header
    'app.title': 'QA State Transition Trainer',
    'bugs.count': '/4',
    'button.resetProgress': 'Reset Progress',
    'button.clearBlog': 'Clear Blog',
    'button.answers': 'Answers',
    'button.language': 'РУ',

    // Instruction panel
    'instructions.title': 'Task Description',
    'instructions.purpose': 'Purpose of the trainer: test blog functionality and find bugs by analyzing article state transitions in the publication system.',
    'instructions.visibilityTitle': '1. Article visibility by status and roles',
    'instructions.actionsTitle': '2. Available actions and transitions by status',
    'instructions.requirementsTitle': '3. Article requirements',
    'instructions.tabsTitle': '4. Tabs (roles) and their purpose',
    'state.draft': 'Draft',
    'state.moderation': 'Under Moderation',
    'state.rejected': 'Rejected',
    'state.published': 'Published',
    'state.unpublished': 'Unpublished',
    'state.archived': 'Archived',
    'role.user': 'User 1',
    'role.moderator': 'Moderator',
    'role.guest': 'Guest',
    'action.edit': 'Edit',
    'action.delete': 'Delete',
    'action.sendToModeration': 'Send to moderation',
    'action.approve': 'Approve',
    'action.reject': 'Reject',
    'action.unpublish': 'Unpublish',
    'action.archive': 'Archive',
    'requirements.title': 'Minimum number of characters in the title: 5',
    'requirements.titleMax': 'Maximum number of characters in the title: 100',
    'requirements.content': 'Minimum number of characters in the content: 20',
    'requirements.contentMax': 'Maximum number of characters in the content: 1000',
    'requirements.maxArticles': 'Maximum possible number of articles: 10',
    'requirements.categories': 'Available article categories:',

    // Tabs and Roles
    'tabs.articles': 'Articles',
    'tabs.bugs': 'Found Bugs',
    'articles.empty': 'No articles to display',
    'articles.createNew': 'Create a new article to start testing',
    'articles.noModeration': 'No articles for moderation or published',
    'articles.noPublished': 'No published articles',
    'articles.count': 'Articles',
    'articles.create': 'Create Article',
    'articles.limit': 'Articles limit reached',

    // Bug tracker
    'bugs.found': 'Found Bugs',
    'bugs.none': 'You haven\'t found any bugs yet.',
    'bugs.tryActions': 'Try performing different actions with articles in different states.',
    'bugs.reproduction': 'Reproduction:',
    'bugs.foundTime': 'Found',

    // Toast messages
    'toast.bugFound': 'Congratulations! Bug found!',
    'toast.progressReset': 'Progress reset',
    'toast.resetDescription': 'Bug counter and list of found bugs cleared',
    'toast.articleUpdated': 'Article updated',
    'toast.articleUpdatedDesc': 'Changes saved successfully',
    'toast.articleCreated': 'Article created',
    'toast.articleCreatedDesc': 'New article added to drafts',
    'toast.articleDeleted': 'Article deleted',
    'toast.articleDeletedDesc': 'Article has been deleted',
    'toast.sentToModeration': 'Sent to moderation',
    'toast.sentToModerationDesc': 'Article sent for moderation',
    'toast.published': 'Article published',
    'toast.publishedDesc': 'Article published successfully',
    'toast.unpublished': 'Article unpublished',
    'toast.unpublishedDesc': 'Article has been unpublished',
    'toast.republished': 'Article published',
    'toast.republishedDesc': 'Article republished',
    'toast.rejected': 'Article rejected',
    'toast.rejectedDesc': 'Article was rejected by the moderator',
    'toast.archived': 'Article archived',
    'toast.archivedDesc': 'Article moved to archive',

    // Article view
    'article.view': 'Article View',
    'article.title': 'Title',
    'article.category': 'Category',
    'article.status': 'Status',
    'article.content': 'Content',
    'article.created': 'Created:',
    'article.updated': 'Updated:',
    'article.close': 'Close',

    // Role description
    'roleDesc.user': 'User 1 (Author)',
    'roleDesc.userDetail': 'Creates, edits, deletes drafts. Initiates sending drafts for moderation. Can archive articles. Sees all their articles in all statuses.',
    'roleDesc.moderator': 'Moderator',
    'roleDesc.moderatorDetail': 'Reviews article drafts in "Under Moderation" status: can approve or reject. Can unpublish an article or archive it. Sees articles in "Under Moderation", "Rejected", "Published", "Unpublished" statuses.',
    'roleDesc.guest': 'Guest (Reader)',
    'roleDesc.guestDetail': 'Has view-only rights. Sees only articles in "Published" status. Cannot perform any actions.',

    // Bug descriptions
    'bug.deleteUnpublished': 'Bug found! User can delete an unpublished article',
    'bug.deleteUnpublishedAction': 'Deletion of an unpublished article by the user',
    'bug.shortTitle': 'Bug found! Article title is less than 5 characters.',
    'bug.shortTitleAction': 'Creating an article with a short title',
    'bug.archivedView': 'Bug found. Article in Archive status is available for viewing by other users.',
    'bug.archivedViewAction': 'Viewing an article in Archive status',
    'bug.saveUnchanged': 'Bug found! Save changes button is available without making changes to the article',
    'bug.saveUnchangedAction': 'Saving an article without making changes',

    // Article form
    'form.createArticle': 'Create Article',
    'form.editArticle': 'Edit Article',
    'form.titleLabel': 'Article Title',
    'form.titlePlaceholder': 'Enter article title',
    'form.categoryLabel': 'Category',
    'form.categoryPlaceholder': 'Select a category',
    'form.contentLabel': 'Article Content',
    'form.contentPlaceholder': 'Enter article content',
    'form.save': 'Save',
    'form.cancel': 'Cancel',
  }
};

// Provider component
interface LanguageProviderProps {
  children: ReactNode;
}

export const LanguageProvider: React.FC<LanguageProviderProps> = ({ children }) => {
  // Default to Russian
  const [language, setLanguage] = useState<Language>('ru');
  
  // Load language preference from localStorage if available
  useEffect(() => {
    const savedLanguage = localStorage.getItem('qa-trainer-language');
    if (savedLanguage && (savedLanguage === 'ru' || savedLanguage === 'en')) {
      setLanguage(savedLanguage as Language);
    }
  }, []);
  
  // Save language preference when it changes
  const handleSetLanguage = (lang: Language) => {
    setLanguage(lang);
    localStorage.setItem('qa-trainer-language', lang);
  };
  
  // Translation function
  const t = (key: string): string => {
    return translations[language][key] || key;
  };
  
  return (
    <LanguageContext.Provider value={{ language, setLanguage: handleSetLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

// Hook for using the language context
export const useLanguage = () => {
  const context = useContext(LanguageContext);
  
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  
  return context;
};

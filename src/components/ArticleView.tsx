
import React from 'react';
import { Article } from '@/types';
import { Button } from "@/components/ui/button";
import { XIcon } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { ru } from 'date-fns/locale';

interface ArticleViewProps {
  article: Article;
  onClose: () => void;
}

// Add status translations
const STATUS_LABELS: Record<string, string> = {
  draft: 'Черновик',
  moderation: 'На модерации',
  rejected: 'Отклонена',
  published: 'Опубликована',
  unpublished: 'Снята с публикации',
  archived: 'Архив'
};

const ArticleView: React.FC<ArticleViewProps> = ({ 
  article, 
  onClose 
}) => {
  const formattedDate = formatDistanceToNow(article.createdAt, { 
    addSuffix: true,
    locale: ru 
  });
  
  const updatedDate = formatDistanceToNow(article.updatedAt, { 
    addSuffix: true,
    locale: ru 
  });
  
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">
            Просмотр статьи
          </h2>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <XIcon className="h-5 w-5" />
          </Button>
        </div>
        
        <div className="space-y-4">
          <div className="space-y-2">
            <div className="text-sm font-medium text-gray-500">Заголовок</div>
            <div className="p-2 bg-gray-50 rounded border border-gray-200">
              {article.title}
            </div>
          </div>
          
          <div className="space-y-2">
            <div className="text-sm font-medium text-gray-500">Категория</div>
            <div className="p-2 bg-gray-50 rounded border border-gray-200">
              {article.category}
            </div>
          </div>
          
          <div className="space-y-2">
            <div className="text-sm font-medium text-gray-500">Статус</div>
            <div className="p-2 bg-gray-50 rounded border border-gray-200">
              {STATUS_LABELS[article.status]}
            </div>
          </div>
          
          <div className="space-y-2">
            <div className="text-sm font-medium text-gray-500">Текст статьи</div>
            <div className="p-2 bg-gray-50 rounded border border-gray-200 min-h-[150px] whitespace-pre-wrap">
              {article.content}
            </div>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            <div className="text-xs text-gray-500">
              Создано: {formattedDate}
            </div>
            <div className="text-xs text-gray-500 sm:text-right">
              Обновлено: {updatedDate}
            </div>
          </div>
          
          <div className="flex justify-end pt-4">
            <Button type="button" onClick={onClose}>
              Закрыть
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ArticleView;

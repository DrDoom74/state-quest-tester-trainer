
import React from 'react';
import { Article } from '@/types';
import { Button } from "@/components/ui/button";
import { XIcon } from 'lucide-react';
import { formatDateWithLocale, STATUS_LABELS } from '@/utils/formatDate';
import { useLanguage } from '@/hooks/useLanguage';

interface ArticleViewProps {
  article: Article;
  onClose: () => void;
}

const ArticleView: React.FC<ArticleViewProps> = ({ 
  article, 
  onClose 
}) => {
  const { language, t } = useLanguage();
  
  const formattedDate = formatDateWithLocale(article.createdAt, language);
  const updatedDate = formatDateWithLocale(article.updatedAt, language);
  
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-2 sm:p-4 z-50">
      <div className="bg-white rounded-lg shadow-lg p-3 sm:p-6 w-full max-w-[95vw] sm:max-w-2xl max-h-[95vh] sm:max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-start gap-2 mb-4">
          <h2 className="text-lg sm:text-xl font-semibold flex-shrink-0">
            {t('article.view')}
          </h2>
          <Button variant="ghost" size="icon" onClick={onClose} className="flex-shrink-0">
            <XIcon className="h-5 w-5" />
          </Button>
        </div>
        
        <div className="space-y-4">
          <div className="space-y-2">
            <div className="text-sm font-medium text-gray-500">{t('article.title')}</div>
            <div className="p-2 bg-gray-50 rounded border border-gray-200 break-words overflow-wrap-anywhere hyphens-auto max-h-32 overflow-y-auto">
              <span className="whitespace-pre-wrap break-words">{article.title}</span>
            </div>
          </div>
          
          <div className="space-y-2">
            <div className="text-sm font-medium text-gray-500">{t('article.category')}</div>
            <div className="p-2 bg-gray-50 rounded border border-gray-200 break-words">
              {article.category}
            </div>
          </div>
          
          <div className="space-y-2">
            <div className="text-sm font-medium text-gray-500">{t('article.status')}</div>
            <div className="p-2 bg-gray-50 rounded border border-gray-200 break-words">
              {STATUS_LABELS[language][article.status]}
            </div>
          </div>
          
          <div className="space-y-2">
            <div className="text-sm font-medium text-gray-500">{t('article.content')}</div>
            <div className="p-2 bg-gray-50 rounded border border-gray-200 min-h-[150px] whitespace-pre-wrap break-words overflow-wrap-anywhere">
              {article.content}
            </div>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            <div className="text-xs text-gray-500 break-words">
              {t('article.created')} {formattedDate}
            </div>
            <div className="text-xs text-gray-500 sm:text-right break-words">
              {t('article.updated')} {updatedDate}
            </div>
          </div>
          
          <div className="flex justify-end pt-4">
            <Button type="button" onClick={onClose}>
              {t('article.close')}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ArticleView;

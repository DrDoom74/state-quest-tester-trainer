
import React from 'react';
import { Article, UserRole } from '@/types';
import ArticleCard from './ArticleCard';
import { PlusIcon } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { useLanguage } from '@/hooks/useLanguage';

interface ArticleListProps {
  articles: Article[];
  userRole: UserRole;
  canCreateMore: boolean;
  onCreateArticle: () => void;
  onEditArticle: (id: string) => void;
  onDeleteArticle: (id: string) => void;
  onSubmitForModeration: (id: string) => void;
  onPublish: (id: string) => void;
  onUnpublish: (id: string) => void;
  onRepublish: (id: string) => void;
  onReject: (id: string) => void;
  onArchive: (id: string) => void;
  onView: (id: string) => void;
}

const ArticleList: React.FC<ArticleListProps> = ({
  articles,
  userRole,
  canCreateMore,
  onCreateArticle,
  onEditArticle,
  onDeleteArticle,
  onSubmitForModeration,
  onPublish,
  onUnpublish,
  onRepublish,
  onReject,
  onArchive,
  onView
}) => {
  const showCreateButton = userRole === 'user';
  const { t } = useLanguage();
  
  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">{t('articles.count')} ({articles.length}/10)</h2>
        {showCreateButton && (
          <Button 
            onClick={onCreateArticle} 
            disabled={!canCreateMore}
            className="bg-gradient-to-r from-indigo-600 to-violet-500 hover:from-indigo-700 hover:to-violet-600"
          >
            <PlusIcon className="h-4 w-4 mr-1" />
            {t('articles.create')}
            
            {!canCreateMore && (
              <div className="absolute -bottom-6 left-0 w-full text-xs text-red-500">
                {!canCreateMore && t('articles.limit')}
              </div>
            )}
          </Button>
        )}
      </div>
      
      {articles.length === 0 ? (
        <div className="text-center py-12 bg-gray-50 rounded-lg border border-dashed border-gray-300">
          <p className="text-gray-500">{t('articles.empty')}</p>
          <p className="text-sm text-gray-400 mt-1">
            {userRole === 'user' 
              ? t('articles.createNew') 
              : userRole === 'moderator'
                ? t('articles.noModeration')
                : t('articles.noPublished')}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {articles.map(article => (
            <div key={article.id} className="h-full">
              <ArticleCard
                article={article}
                userRole={userRole}
                onEdit={onEditArticle}
                onDelete={onDeleteArticle}
                onSubmitForModeration={onSubmitForModeration}
                onPublish={onPublish}
                onUnpublish={onUnpublish}
                onRepublish={onRepublish}
                onReject={onReject}
                onArchive={onArchive}
                onView={onView}
              />
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ArticleList;

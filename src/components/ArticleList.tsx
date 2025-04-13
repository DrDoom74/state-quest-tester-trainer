
import React from 'react';
import { Article } from '@/types';
import ArticleCard from './ArticleCard';
import { PlusIcon } from 'lucide-react';
import { Button } from "@/components/ui/button";

interface ArticleListProps {
  articles: Article[];
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
}

const ArticleList: React.FC<ArticleListProps> = ({
  articles,
  canCreateMore,
  onCreateArticle,
  onEditArticle,
  onDeleteArticle,
  onSubmitForModeration,
  onPublish,
  onUnpublish,
  onRepublish,
  onReject,
  onArchive
}) => {
  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">Статьи ({articles.length}/10)</h2>
        <Button 
          onClick={onCreateArticle} 
          disabled={!canCreateMore}
          className="relative"
        >
          <PlusIcon className="h-4 w-4 mr-1" />
          Создать статью
          
          {/* BUG #4: On mobile screens, buttons will be cut off or overlap */}
          <div className="absolute -bottom-6 left-0 w-full text-xs text-red-500 md:hidden">
            {!canCreateMore && "Достигнут лимит статей"}
          </div>
        </Button>
      </div>
      
      {articles.length === 0 ? (
        <div className="text-center py-12 bg-gray-50 rounded-lg border border-dashed border-gray-300">
          <p className="text-gray-500">Нет статей для отображения</p>
          <p className="text-sm text-gray-400 mt-1">
            Создайте новую статью, чтобы начать тестирование
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {articles.map(article => (
            <ArticleCard
              key={article.id}
              article={article}
              onEdit={onEditArticle}
              onDelete={onDeleteArticle}
              onSubmitForModeration={onSubmitForModeration}
              onPublish={onPublish}
              onUnpublish={onUnpublish}
              onRepublish={onRepublish}
              onReject={onReject}
              onArchive={onArchive}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default ArticleList;

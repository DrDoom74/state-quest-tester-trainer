
import React from 'react';
import { Article, ArticleStatus, UserRole } from '@/types';
import { Button } from "@/components/ui/button";
import { 
  EditIcon, 
  SendIcon, 
  ArchiveIcon, 
  CheckIcon, 
  XIcon, 
  EyeOffIcon,
  TrashIcon,
  BookOpenIcon
} from 'lucide-react';
import { useLanguage } from '@/hooks/useLanguage';
import { STATUS_LABELS, formatDateWithLocale } from '@/utils/formatDate';

interface ArticleCardProps {
  article: Article;
  userRole: UserRole;
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
  onSubmitForModeration: (id: string) => void;
  onPublish: (id: string) => void;
  onUnpublish: (id: string) => void;
  onRepublish: (id: string) => void;
  onReject: (id: string) => void;
  onArchive: (id: string) => void;
  onView: (id: string) => void;
}

const ArticleCard: React.FC<ArticleCardProps> = ({
  article,
  userRole,
  onEdit,
  onDelete,
  onSubmitForModeration,
  onPublish,
  onUnpublish,
  onRepublish,
  onReject,
  onArchive,
  onView
}) => {
  const { language, t } = useLanguage();
  
  const contentPreview = article.content.length > 100 
    ? `${article.content.substring(0, 100)}...` 
    : article.content;
    
  // Format date with current language
  const formattedDate = formatDateWithLocale(article.createdAt, language);
  
  return (
    <div className="article-card group relative hover:shadow-md transition-shadow cursor-pointer bg-white rounded-lg shadow-sm p-4 h-full flex flex-col" onClick={() => onView(article.id)}>
      {/* Edit indicator for previously edited published articles */}
      {(article.status === 'published' || article.status === 'unpublished') && article.wasEdited && (
        <div className="absolute top-2 right-2 text-blue-500" title={t('article.edited')}>
          <EditIcon className="h-4 w-4" />
        </div>
      )}
      
      {/* Tooltip with ID and creation date - shows on hover */}
      <div className="tooltip top-0 left-1/2 transform -translate-x-1/2 -translate-y-full mb-2">
        {t('article.id')}: {article.id.substring(0, 8)}... • {t('article.created')}: {formattedDate}
      </div>
      
      {/* Status badge */}
      <div className={`state-badge state-${article.status} mb-2`}>
        {STATUS_LABELS[language][article.status]}
      </div>
      
      {/* Article content */}
      <h3 className="article-card-title font-semibold">{article.title}</h3>
      <p className="article-card-content mt-1 text-gray-600 text-sm flex-grow">{contentPreview}</p>
      <div className="text-xs text-gray-500 mt-1">{t('article.category')}: {article.category}</div>
      
      {/* Action buttons based on user role and article status */}
      <div className="mt-3 flex flex-wrap items-center gap-2" onClick={(e) => e.stopPropagation()}>
        {/* User actions */}
        {userRole === 'user' && (
          <>
            {/* Draft actions */}
            {article.status === 'draft' && (
              <>
                <Button size="sm" variant="outline" onClick={() => onEdit(article.id)}>
                  <EditIcon className="h-3.5 w-3.5 mr-1" />
                  {t('action.edit')}
                </Button>
                <Button size="sm" variant="default" onClick={() => onSubmitForModeration(article.id)}>
                  <SendIcon className="h-3.5 w-3.5 mr-1" />
                  {t('action.sendToModeration')}
                </Button>
                <Button size="sm" variant="destructive" onClick={() => onDelete(article.id)}>
                  <TrashIcon className="h-3.5 w-3.5 mr-1" />
                  {t('action.delete')}
                </Button>
              </>
            )}
            
            {/* Rejected actions */}
            {article.status === 'rejected' && (
              <>
                <Button size="sm" variant="outline" onClick={() => onEdit(article.id)}>
                  <EditIcon className="h-3.5 w-3.5 mr-1" />
                  {t('action.edit')}
                </Button>
                <Button size="sm" variant="destructive" onClick={() => onDelete(article.id)}>
                  <TrashIcon className="h-3.5 w-3.5 mr-1" />
                  {t('action.delete')}
                </Button>
              </>
            )}
            
            {/* Published actions for user */}
            {article.status === 'published' && (
              <>
                <Button size="sm" variant="outline" onClick={() => onEdit(article.id)}>
                  <EditIcon className="h-3.5 w-3.5 mr-1" />
                  {t('action.edit')}
                </Button>
                <Button size="sm" variant="outline" className="bg-gray-100" onClick={() => onArchive(article.id)}>
                  <ArchiveIcon className="h-3.5 w-3.5 mr-1" />
                  {t('action.archive')}
                </Button>
              </>
            )}
            
            {/* Unpublished actions for user */}
            {article.status === 'unpublished' && (
              <>
                <Button size="sm" variant="outline" onClick={() => onEdit(article.id)}>
                  <EditIcon className="h-3.5 w-3.5 mr-1" />
                  {t('action.edit')}
                </Button>
                <Button size="sm" variant="outline" className="bg-gray-100" onClick={() => onArchive(article.id)}>
                  <ArchiveIcon className="h-3.5 w-3.5 mr-1" />
                  {t('action.archive')}
                </Button>
                <Button size="sm" variant="destructive" onClick={() => onDelete(article.id)}>
                  <TrashIcon className="h-3.5 w-3.5 mr-1" />
                  {t('action.delete')}
                </Button>
              </>
            )}
          </>
        )}
        
        {/* Moderator actions */}
        {userRole === 'moderator' && (
          <>
            {/* Moderation actions */}
            {article.status === 'moderation' && (
              <>
                <Button size="sm" variant="outline" className="bg-green-100" onClick={() => onPublish(article.id)}>
                  <CheckIcon className="h-3.5 w-3.5 mr-1" />
                  {t('action.approve')}
                </Button>
                <Button size="sm" variant="outline" className="bg-red-100" onClick={() => onReject(article.id)}>
                  <XIcon className="h-3.5 w-3.5 mr-1" />
                  {t('action.reject')}
                </Button>
              </>
            )}
            
            {/* Published actions for moderator */}
            {article.status === 'published' && (
              <Button size="sm" variant="outline" className="bg-gray-100" onClick={() => onUnpublish(article.id)}>
                <EyeOffIcon className="h-3.5 w-3.5 mr-1" />
                {t('action.unpublish')}
              </Button>
            )}
          </>
        )}
        
        {/* View button for all roles */}
        <Button size="sm" variant="ghost" onClick={(e) => {
          e.stopPropagation();
          onView(article.id);
        }}>
          <BookOpenIcon className="h-3.5 w-3.5 mr-1" />
          {t('article.view')}
        </Button>
      </div>
    </div>
  );
};

export default ArticleCard;

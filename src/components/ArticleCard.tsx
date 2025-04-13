
import React, { useState, useEffect } from 'react';
import { Article, ArticleStatus } from '@/types';
import { Button } from "@/components/ui/button";
import { formatDistanceToNow } from 'date-fns';
import { ru } from 'date-fns/locale';
import { 
  EditIcon, 
  SendIcon, 
  ArchiveIcon, 
  CheckIcon, 
  XIcon, 
  EyeOffIcon,
  EyeIcon,
  TrashIcon
} from 'lucide-react';

interface ArticleCardProps {
  article: Article;
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
  onSubmitForModeration: (id: string) => void;
  onPublish: (id: string) => void;
  onUnpublish: (id: string) => void;
  onRepublish: (id: string) => void;
  onReject: (id: string) => void;
  onArchive: (id: string) => void;
}

const STATUS_LABELS: Record<ArticleStatus, string> = {
  draft: 'Черновик',
  moderation: 'На модерации',
  rejected: 'Отклонена',
  published: 'Опубликована',
  unpublished: 'Снята с публикации',
  archived: 'Архив'
};

const ArticleCard: React.FC<ArticleCardProps> = ({
  article,
  onEdit,
  onDelete,
  onSubmitForModeration,
  onPublish,
  onUnpublish,
  onRepublish,
  onReject,
  onArchive
}) => {
  // For bug #5 simulation (status not updating properly)
  const [displayStatus, setDisplayStatus] = useState<ArticleStatus>(article.status);
  
  // Update display status when article changes
  useEffect(() => {
    // Simulate Bug #5: Status not updating after publishing from moderation
    if (article.status === 'published' && displayStatus === 'moderation') {
      // Don't update the display status to simulate the bug
      // This will make it look like the status hasn't changed
    } else {
      setDisplayStatus(article.status);
    }
  }, [article.status]);
  
  const contentPreview = article.content.length > 100 
    ? `${article.content.substring(0, 100)}...` 
    : article.content;
    
  // Extract date for tooltip
  const formattedDate = formatDistanceToNow(article.createdAt, { 
    addSuffix: true,
    locale: ru 
  });
  
  return (
    <div className="article-card group">
      {/* Tooltip with ID and creation date - shows on hover */}
      <div className="tooltip top-0 left-1/2 transform -translate-x-1/2 -translate-y-full mb-2">
        ID: {article.id.substring(0, 8)}... • Создано: {formattedDate}
      </div>
      
      {/* Status badge */}
      <div className={`state-badge state-${displayStatus} mb-2`}>
        {STATUS_LABELS[displayStatus]}
      </div>
      
      {/* Article content */}
      <h3 className="article-card-title">{article.title}</h3>
      <p className="article-card-content mt-1">{contentPreview}</p>
      <div className="text-xs text-gray-500 mt-1">Категория: {article.category}</div>
      
      {/* Action buttons */}
      <div className="mt-3 flex flex-wrap items-center gap-2">
        {/* Draft actions */}
        {article.status === 'draft' && (
          <>
            <Button size="sm" variant="outline" onClick={() => onEdit(article.id)}>
              <EditIcon className="h-3.5 w-3.5 mr-1" />
              Редактировать
            </Button>
            <Button size="sm" variant="default" onClick={() => onSubmitForModeration(article.id)}>
              <SendIcon className="h-3.5 w-3.5 mr-1" />
              На модерацию
            </Button>
            <Button size="sm" variant="destructive" onClick={() => onDelete(article.id)}>
              <TrashIcon className="h-3.5 w-3.5 mr-1" />
              Удалить
            </Button>
          </>
        )}
        
        {/* Moderation actions (moderator) */}
        {article.status === 'moderation' && (
          <>
            <Button size="sm" variant="outline" className="bg-green-100" onClick={() => onPublish(article.id)}>
              <CheckIcon className="h-3.5 w-3.5 mr-1" />
              Одобрить
            </Button>
            <Button size="sm" variant="outline" className="bg-red-100" onClick={() => onReject(article.id)}>
              <XIcon className="h-3.5 w-3.5 mr-1" />
              Отклонить
            </Button>
            <Button size="sm" variant="outline" className="bg-gray-100" onClick={() => onArchive(article.id)}>
              <ArchiveIcon className="h-3.5 w-3.5 mr-1" />
              В архив
            </Button>
          </>
        )}
        
        {/* Rejected actions */}
        {article.status === 'rejected' && (
          <>
            <Button size="sm" variant="outline" onClick={() => onEdit(article.id)}>
              <EditIcon className="h-3.5 w-3.5 mr-1" />
              Редактировать
            </Button>
            <Button size="sm" variant="default" onClick={() => onSubmitForModeration(article.id)}>
              <SendIcon className="h-3.5 w-3.5 mr-1" />
              На модерацию
            </Button>
            {/* BUG #1: Not supposed to be able to publish directly */}
            <Button size="sm" variant="outline" className="bg-green-100" onClick={() => onPublish(article.id)}>
              <CheckIcon className="h-3.5 w-3.5 mr-1" />
              Опубликовать
            </Button>
            <Button size="sm" variant="destructive" onClick={() => onDelete(article.id)}>
              <TrashIcon className="h-3.5 w-3.5 mr-1" />
              Удалить
            </Button>
          </>
        )}
        
        {/* Published actions */}
        {article.status === 'published' && (
          <>
            {/* BUG #2: Not supposed to be able to edit */}
            <Button size="sm" variant="outline" onClick={() => onEdit(article.id)}>
              <EditIcon className="h-3.5 w-3.5 mr-1" />
              Редактировать
            </Button>
            <Button size="sm" variant="outline" className="bg-gray-100" onClick={() => onUnpublish(article.id)}>
              <EyeOffIcon className="h-3.5 w-3.5 mr-1" />
              Снять с публикации
            </Button>
            <Button size="sm" variant="outline" className="bg-gray-100" onClick={() => onArchive(article.id)}>
              <ArchiveIcon className="h-3.5 w-3.5 mr-1" />
              В архив
            </Button>
          </>
        )}
        
        {/* Unpublished actions */}
        {article.status === 'unpublished' && (
          <>
            <Button size="sm" variant="outline" className="bg-green-100" onClick={() => onRepublish(article.id)}>
              <EyeIcon className="h-3.5 w-3.5 mr-1" />
              Опубликовать
            </Button>
            <Button size="sm" variant="outline" className="bg-gray-100" onClick={() => onArchive(article.id)}>
              <ArchiveIcon className="h-3.5 w-3.5 mr-1" />
              В архив
            </Button>
          </>
        )}
        
        {/* Archived actions */}
        {article.status === 'archived' && (
          <>
            {/* BUG #3: Not supposed to have actions in archived state */}
            <Button size="sm" variant="outline" onClick={() => onEdit(article.id)}>
              <EditIcon className="h-3.5 w-3.5 mr-1" />
              Редактировать
            </Button>
            <Button size="sm" variant="outline" className="bg-green-100" onClick={() => onPublish(article.id)}>
              <CheckIcon className="h-3.5 w-3.5 mr-1" />
              Опубликовать
            </Button>
          </>
        )}
      </div>
    </div>
  );
};

export default ArticleCard;

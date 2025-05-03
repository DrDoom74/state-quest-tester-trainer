
import React, { useState } from 'react';
import { Tabs } from "@/components/ui/tabs";
import RoleSelector from './RoleSelector';
import ArticleList from './ArticleList';
import ArticleForm from './ArticleForm';
import ArticleView from './ArticleView';
import { Article, ArticleCategory, UserRole } from '@/types';
import { toast } from "@/hooks/use-toast";

interface ArticleManagementProps {
  articles: Article[];
  visibleArticles: Article[];
  activeRole: UserRole;
  setActiveRole: (role: UserRole) => void;
  canCreateMore: boolean;
  createArticle: (title: string, content: string, category: ArticleCategory) => Article | null;
  updateArticle: (id: string, updates: Partial<Omit<Article, 'id' | 'createdAt' | 'status'>>) => boolean;
  performAction: (id: string, action: 'edit' | 'submitForModeration' | 'publish' | 'reject' | 'unpublish' | 'republish' | 'archive' | 'delete') => boolean;
  checkForBug: (bugId: string, description: string, actionDescription: string) => boolean;
}

const ArticleManagement: React.FC<ArticleManagementProps> = ({
  articles,
  visibleArticles,
  activeRole,
  setActiveRole,
  canCreateMore,
  createArticle,
  updateArticle,
  performAction,
  checkForBug
}) => {
  const [showForm, setShowForm] = useState(false);
  const [editArticle, setEditArticle] = useState<Article | undefined>(undefined);
  const [viewArticle, setViewArticle] = useState<Article | undefined>(undefined);

  // Form handling
  const handleCreateArticle = () => {
    setEditArticle(undefined);
    setShowForm(true);
  };
  
  const handleEditArticle = (id: string) => {
    const article = articles.find(a => a.id === id);
    if (article) {
      setEditArticle(article);
      setShowForm(true);
    }
  };
  
  const handleViewArticle = (id: string) => {
    const article = articles.find(a => a.id === id);
    if (article) {
      // Check for archived article bug
      if (article.status === 'archived' && activeRole !== 'user') {
        checkForBug(
          'archived-article-bug', 
          'Баг обнаружен. Статья в статусе Архив доступна для просмотра другим пользователям.', 
          'Просмотр статьи в статусе Архив'
        );
      }
      setViewArticle(article);
    }
  };
  
  const handleFormSubmit = (title: string, content: string, category: ArticleCategory) => {
    console.log(`Submitting form with title: "${title}" (length: ${title.length})`);
    
    // Check for bug with short title before doing anything else
    if (title.length < 5) {
      console.log("Detected short title bug!");
      // Force this to run after the current render cycle with a slightly longer timeout
      setTimeout(() => {
        console.log("Checking for short title bug");
        checkForBug(
          'short-title-bug', 
          'Обнаружен баг! Заголовок статьи меньше 5 символов.', 
          'Создание статьи с коротким заголовком'
        );
      }, 50);
    }

    if (editArticle) {
      const updated = updateArticle(editArticle.id, { title, content, category });
      if (updated) {
        performAction(editArticle.id, 'edit');
        toast({
          title: "Статья обновлена",
          description: "Изменения сохранены успешно",
        });
      }
    } else {
      const newArticle = createArticle(title, content, category);
      if (newArticle) {
        toast({
          title: "Статья создана",
          description: "Новая статья добавлена в черновики",
        });
      }
    }
    setShowForm(false);
  };
  
  const handleCancelForm = () => {
    setShowForm(false);
    setEditArticle(undefined);
  };

  // Article actions
  const handleDeleteArticle = (id: string) => {
    const success = performAction(id, 'delete');
    if (success) {
      toast({
        title: "Статья удалена",
        description: "Статья была удалена",
      });
    }
  };
  
  const handleSubmitForModeration = (id: string) => {
    const success = performAction(id, 'submitForModeration');
    if (success) {
      toast({
        title: "Отправлено на модерацию",
        description: "Статья отправлена на модерацию",
      });
    }
  };
  
  const handlePublish = (id: string) => {
    const success = performAction(id, 'publish');
    if (success) {
      toast({
        title: "Статья опубликована",
        description: "Статья успешно опубликована",
      });
    }
  };
  
  const handleUnpublish = (id: string) => {
    const success = performAction(id, 'unpublish');
    if (success) {
      toast({
        title: "Статья снята с публикации",
        description: "Статья снята с публикации",
      });
    }
  };
  
  const handleRepublish = (id: string) => {
    const success = performAction(id, 'republish');
    if (success) {
      toast({
        title: "Статья опубликована",
        description: "Статья повторно опубликована",
      });
    }
  };
  
  const handleReject = (id: string) => {
    const success = performAction(id, 'reject');
    if (success) {
      toast({
        title: "Статья отклонена",
        description: "Статья была отклонена модератором",
      });
    }
  };
  
  const handleArchive = (id: string) => {
    const success = performAction(id, 'archive');
    if (success) {
      toast({
        title: "Статья в архиве",
        description: "Статья перемещена в архив",
      });
    }
  };

  const handleRoleChange = (role: UserRole) => {
    setActiveRole(role);
  };

  return (
    <>
      <div className="mb-4">
        <Tabs defaultValue={activeRole} onValueChange={(value) => handleRoleChange(value as UserRole)}>
          <RoleSelector activeRole={activeRole} onRoleChange={handleRoleChange} />
        </Tabs>
      </div>
      
      <ArticleList 
        articles={visibleArticles}
        userRole={activeRole}
        canCreateMore={canCreateMore}
        onCreateArticle={handleCreateArticle}
        onEditArticle={handleEditArticle}
        onDeleteArticle={handleDeleteArticle}
        onSubmitForModeration={handleSubmitForModeration}
        onPublish={handlePublish}
        onUnpublish={handleUnpublish}
        onRepublish={handleRepublish}
        onReject={handleReject}
        onArchive={handleArchive}
        onView={handleViewArticle}
      />
      
      {showForm && (
        <ArticleForm 
          article={editArticle}
          onSubmit={handleFormSubmit}
          onCancel={handleCancelForm}
        />
      )}

      {viewArticle && (
        <ArticleView
          article={viewArticle}
          onClose={() => setViewArticle(undefined)}
        />
      )}
    </>
  );
};

export default ArticleManagement;

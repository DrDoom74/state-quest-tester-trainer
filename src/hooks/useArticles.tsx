import { useState, useCallback, useEffect } from 'react';
import { Article, ArticleStatus, ActionType, ArticleCategory, UserRole } from '@/types';
import { v4 as uuidv4 } from 'uuid';
import { useBugs } from './useBugs';
import { toast } from "@/hooks/use-toast";

const ARTICLES_STORAGE_KEY = 'qa-simulator-articles';
const MAX_ARTICLES = 10;

// Define state transition rules based on user role
const VALID_TRANSITIONS: Record<UserRole, Record<ArticleStatus, ActionType[]>> = {
  user: {
    draft: ['edit', 'submitForModeration', 'delete'],
    moderation: [], // No actions for users on moderation state
    rejected: ['edit', 'delete'],
    published: ['edit', 'archive'],
    unpublished: ['edit', 'archive', 'delete'], // Added delete option for unpublished articles
    archived: [], // No actions for archived
  },
  moderator: {
    draft: [],
    moderation: ['publish', 'reject'],
    rejected: [],
    published: ['unpublish'],
    unpublished: [], // Removed republish action
    archived: [],
  },
  guest: {
    draft: [],
    moderation: [],
    rejected: [],
    published: [],
    unpublished: [],
    archived: [],
  }
};

// Define the new states after actions
const ACTION_RESULTS: Record<ActionType, (status: ArticleStatus) => ArticleStatus> = {
  edit: () => 'draft', // Editing always returns to draft state
  submitForModeration: () => 'moderation',
  publish: () => 'published',
  reject: () => 'rejected',
  unpublish: () => 'unpublished',
  republish: () => 'published',
  archive: () => 'archived',
  delete: () => 'draft', // Just for type safety, deleted articles are removed
};

// Define visibility rules for articles based on user role
export const ARTICLE_VISIBILITY: Record<UserRole, ArticleStatus[]> = {
  user: ['draft', 'moderation', 'rejected', 'published', 'unpublished', 'archived'],
  moderator: ['moderation', 'rejected', 'published', 'unpublished'],
  guest: ['published', 'archived'], // Added archived to be visible for guest to trigger the bug
};

export function useArticles() {
  const [articles, setArticles] = useState<Article[]>([]);
  const [activeRole, setActiveRole] = useState<UserRole>('user');
  const { checkActionForBug } = useBugs();

  useEffect(() => {
    // Load articles from localStorage
    const savedArticles = localStorage.getItem(ARTICLES_STORAGE_KEY);
    if (savedArticles) {
      try {
        const parsedArticles = JSON.parse(savedArticles);
        // Convert dates back to Date objects
        parsedArticles.forEach((article: any) => {
          article.createdAt = new Date(article.createdAt);
          article.updatedAt = new Date(article.updatedAt);
        });
        setArticles(parsedArticles);
      } catch (error) {
        console.error('Failed to parse saved articles', error);
      }
    }
  }, []);

  useEffect(() => {
    // Save articles to localStorage whenever they change
    localStorage.setItem(ARTICLES_STORAGE_KEY, JSON.stringify(articles));
  }, [articles]);

  const createArticle = useCallback((
    title: string, 
    content: string, 
    category: ArticleCategory
  ): Article | null => {
    if (articles.length >= MAX_ARTICLES) {
      toast({
        title: "Достигнут лимит статей",
        description: "Вы не можете создать более 10 статей одновременно.",
        variant: "destructive"
      });
      return null;
    }

    const newArticle: Article = {
      id: uuidv4(),
      title,
      content,
      status: 'draft',
      category,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    setArticles(prev => [...prev, newArticle]);
    return newArticle;
  }, [articles]);

  const updateArticle = useCallback((
    id: string, 
    updates: Partial<Omit<Article, 'id' | 'createdAt' | 'status'>>
  ): boolean => {
    let updated = false;
    
    setArticles(prev => 
      prev.map(article => {
        if (article.id === id) {
          updated = true;
          return { 
            ...article, 
            ...updates, 
            updatedAt: new Date() 
          };
        }
        return article;
      })
    );
    
    return updated;
  }, []);

  const performAction = useCallback((id: string, action: ActionType): boolean => {
    let success = false;
    
    setArticles(prev => {
      const index = prev.findIndex(article => article.id === id);
      if (index === -1) return prev;
      
      const article = prev[index];
      const validActions = VALID_TRANSITIONS[activeRole][article.status] || [];
      
      if (!validActions.includes(action)) {
        toast({
          title: "Действие недоступно",
          description: `Нельзя выполнить "${action}" в текущем статусе "${article.status}" с ролью ${activeRole}`,
          variant: "destructive"
        });
        return prev;
      }
      
      // Specific check for the delete-unpublished bug scenario with detailed logging
      if (activeRole === 'user' && article.status === 'unpublished' && action === 'delete') {
        console.log('Specific check for delete-unpublished bug triggered');
        // Pass the exact status and action for precise bug detection
        checkActionForBug('unpublished', 'delete');
      }
      
      success = true;
      
      if (action === 'delete') {
        return prev.filter(a => a.id !== id);
      }
      
      // Create a new array with the updated article
      const newArticles = [...prev];
      const newStatus = ACTION_RESULTS[action](article.status);
      
      // Set wasEdited flag for when editing published/unpublished articles
      let wasEdited = article.wasEdited;
      if (action === 'edit' && (article.status === 'published' || article.status === 'unpublished')) {
        wasEdited = true;
      }
      
      newArticles[index] = {
        ...article,
        status: newStatus,
        wasEdited,
        updatedAt: new Date()
      };
      
      return newArticles;
    });
    
    return success;
  }, [activeRole, checkActionForBug]);

  const clearAllArticles = useCallback(() => {
    setArticles([]);
    toast({
      title: "Блог очищен",
      description: "Все статьи были удалены",
    });
  }, []);

  const getVisibleArticles = useCallback(() => {
    return articles.filter(article => 
      ARTICLE_VISIBILITY[activeRole].includes(article.status)
    );
  }, [articles, activeRole]);

  return {
    articles,
    visibleArticles: getVisibleArticles(),
    activeRole,
    setActiveRole,
    createArticle,
    updateArticle,
    performAction,
    clearAllArticles,
    canCreateMore: articles.length < MAX_ARTICLES,
  };
}

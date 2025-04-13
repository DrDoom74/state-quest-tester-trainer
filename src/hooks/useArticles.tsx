
import { useState, useCallback, useEffect } from 'react';
import { Article, ArticleStatus, ActionType, ArticleCategory } from '@/types';
import { v4 as uuidv4 } from 'uuid';
import { useBugs } from './useBugs';
import { toast } from "@/hooks/use-toast";

const ARTICLES_STORAGE_KEY = 'qa-simulator-articles';
const MAX_ARTICLES = 10;

// Define state transition rules
const VALID_TRANSITIONS: Record<ArticleStatus, ActionType[]> = {
  draft: ['edit', 'submitForModeration', 'delete'],
  moderation: [],  // No actions for users on moderation state
  rejected: ['edit', 'submitForModeration', 'delete'],
  published: ['unpublish'],
  unpublished: ['republish'],
  archived: [], // No actions for archived
};

// Define the new states after actions
const ACTION_RESULTS: Record<ActionType, (status: ArticleStatus) => ArticleStatus> = {
  edit: (status) => status, // editing doesn't change status
  submitForModeration: () => 'moderation',
  publish: () => 'published',
  reject: () => 'rejected',
  unpublish: () => 'unpublished',
  republish: () => 'published',
  archive: () => 'archived',
  delete: () => 'draft', // Just for type safety, deleted articles are removed
};

// Helper to simulate the moderator actions
const MODERATOR_ACTIONS = ['publish', 'reject', 'archive'];

export function useArticles() {
  const [articles, setArticles] = useState<Article[]>([]);
  const { checkForBug } = useBugs();

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
      const validActions = VALID_TRANSITIONS[article.status];
      
      // Check for bugs - implement bug detection logic
      const isBug = checkForBug(article.status, action);
      
      // If this is a bug, we allow the action to proceed to demonstrate it
      let allow = validActions.includes(action) || isBug;
      
      // Allow moderator actions even if not listed in valid transitions
      // (for simulation purposes)
      if (MODERATOR_ACTIONS.includes(action)) {
        allow = true;
      }
      
      if (!allow) {
        toast({
          title: "Действие недоступно",
          description: `Нельзя выполнить "${action}" в текущем статусе "${article.status}"`,
          variant: "destructive"
        });
        return prev;
      }
      
      success = true;
      
      if (action === 'delete') {
        return prev.filter(a => a.id !== id);
      }
      
      // Create a new array with the updated article
      const newArticles = [...prev];
      const newStatus = ACTION_RESULTS[action](article.status);
      
      newArticles[index] = {
        ...article,
        status: newStatus,
        updatedAt: new Date()
      };
      
      // Simulate Bug #5: Status not updating after publishing from moderation
      if (article.status === 'moderation' && action === 'publish' && isBug) {
        // Don't update the status to simulate the bug
        // This will be handled in the UI
      }
      
      return newArticles;
    });
    
    return success;
  }, [checkForBug]);

  const clearAllArticles = useCallback(() => {
    setArticles([]);
    toast({
      title: "Блог очищен",
      description: "Все статьи были удалены",
    });
  }, []);

  return {
    articles,
    createArticle,
    updateArticle,
    performAction,
    clearAllArticles,
    canCreateMore: articles.length < MAX_ARTICLES,
  };
}


import { useState, useCallback, useEffect } from 'react';
import { Bug } from '@/types';
import { toast } from "@/hooks/use-toast";

const BUGS_STORAGE_KEY = 'qa-simulator-bugs';
const BUGS_COUNT_KEY = 'qa-simulator-bugs-count';
const TOAST_TIMEOUT = 10000; // Auto-dismiss toast after 10 seconds

export const PREDEFINED_BUGS: { 
  id: string;
  description: string;
  actionDescription: string;
  conditionCheck: (fromStatus: string, action: string) => boolean;
}[] = [
  {
    id: 'short-title-bug',
    description: 'Обнаружен баг! Заголовок статьи меньше 5 символов.',
    actionDescription: 'Создание статьи с коротким заголовком',
    conditionCheck: () => true // This is manually checked in the form submission
  },
  {
    id: 'republish-unpublished-bug',
    description: 'Обнаружен баг! Модератор может опубликовывать снятую с публикации статью.',
    actionDescription: 'Попытка опубликовать снятую с публикации статью',
    conditionCheck: (fromStatus, action) => 
      fromStatus === 'unpublished' && action === 'republish'
  },
  {
    id: 'archived-article-bug',
    description: 'Баг обнаружен. Статья в статусе Архив доступна для просмотра другим пользователям.',
    actionDescription: 'Просмотр статьи в статусе Архив',
    conditionCheck: () => true // This is manually checked in the article view
  }
];

export function useBugs() {
  const [foundBugs, setFoundBugs] = useState<Bug[]>([]);
  const [bugsCount, setBugsCount] = useState(0);

  useEffect(() => {
    // Load bugs from localStorage
    const savedBugs = localStorage.getItem(BUGS_STORAGE_KEY);
    const savedCount = localStorage.getItem(BUGS_COUNT_KEY);
    
    if (savedBugs) {
      try {
        const parsedBugs = JSON.parse(savedBugs);
        // Convert dates back to Date objects
        parsedBugs.forEach((bug: any) => {
          bug.dateFound = new Date(bug.dateFound);
        });
        setFoundBugs(parsedBugs);
      } catch (error) {
        console.error('Failed to parse saved bugs', error);
      }
    }
    
    if (savedCount) {
      setBugsCount(parseInt(savedCount, 10));
    }
  }, []);

  useEffect(() => {
    // Save bugs to localStorage whenever they change
    localStorage.setItem(BUGS_STORAGE_KEY, JSON.stringify(foundBugs));
    localStorage.setItem(BUGS_COUNT_KEY, bugsCount.toString());
  }, [foundBugs, bugsCount]);

  const checkForBug = useCallback((bugId: string, description: string, actionDescription: string): boolean => {
    // Check if this bug has already been found
    if (!foundBugs.some(found => found.id === bugId)) {
      const newBug: Bug = {
        id: bugId,
        description,
        actionDescription,
        dateFound: new Date()
      };
      
      setFoundBugs(prev => [...prev, newBug]);
      setBugsCount(prev => prev + 1);
      
      // Always show toast notification when a bug is found
      toast({
        title: "Поздравляем! Баг найден!",
        description,
        variant: "destructive",
        duration: TOAST_TIMEOUT, // Auto-dismiss after 10 seconds
      });
      
      return true;
    }
    return false;
  }, [foundBugs]);

  const checkActionForBug = useCallback((fromStatus: string, action: string): boolean => {
    for (const bug of PREDEFINED_BUGS) {
      // Find the matching bug for this action/status combination
      if (bug.conditionCheck(fromStatus, action)) {
        // If bug hasn't been found yet, record it and show notification
        if (!foundBugs.some(found => found.id === bug.id)) {
          return checkForBug(bug.id, bug.description, bug.actionDescription);
        }
      }
    }
    return false;
  }, [foundBugs, checkForBug]);

  const resetBugs = useCallback(() => {
    setFoundBugs([]);
    setBugsCount(0);
    localStorage.removeItem(BUGS_STORAGE_KEY);
    localStorage.removeItem(BUGS_COUNT_KEY);
    toast({
      title: "Прогресс сброшен",
      description: "Счетчик багов и список найденных багов очищены",
    });
  }, []);

  return {
    foundBugs,
    bugsCount,
    checkForBug,
    checkActionForBug,
    resetBugs,
  };
}

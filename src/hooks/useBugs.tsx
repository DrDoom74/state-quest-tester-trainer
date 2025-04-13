
import { useState, useCallback, useEffect } from 'react';
import { Bug } from '@/types';
import { toast } from "@/hooks/use-toast";

const BUGS_STORAGE_KEY = 'qa-simulator-bugs';
const BUGS_COUNT_KEY = 'qa-simulator-bugs-count';

export const PREDEFINED_BUGS = [
  {
    id: 'bug-1',
    description: 'Статья в статусе "Отклонена" может быть опубликована напрямую',
    actionDescription: 'Опубликовать из статуса "Отклонена"',
    conditionCheck: (fromStatus: string, action: string) => 
      fromStatus === 'rejected' && action === 'publish'
  },
  {
    id: 'bug-2',
    description: 'Опубликованную статью можно редактировать',
    actionDescription: 'Редактировать из статуса "Опубликована"',
    conditionCheck: (fromStatus: string, action: string) => 
      fromStatus === 'published' && action === 'edit'
  },
  {
    id: 'bug-3',
    description: 'Архивированную статью можно опубликовать или редактировать',
    actionDescription: 'Любое действие из статуса "Архив"',
    conditionCheck: (fromStatus: string, action: string) => 
      fromStatus === 'archived' && ['edit', 'publish', 'submitForModeration', 'republish'].includes(action)
  },
  {
    id: 'bug-4',
    description: 'Проблема с отображением кнопок на мобильных устройствах',
    actionDescription: 'Обрезание кнопок на экранах < 480px',
    // This is detected in UI, not here
    conditionCheck: () => false
  },
  {
    id: 'bug-5',
    description: 'Статус не обновляется при публикации статьи с модерации',
    actionDescription: 'Публикация из статуса "На модерации"',
    // This is simulated in UI, not detected here
    conditionCheck: () => false
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

  const checkForBug = useCallback((fromStatus: string, action: string): boolean => {
    for (const bug of PREDEFINED_BUGS) {
      if (bug.conditionCheck(fromStatus, action) && !foundBugs.some(found => found.id === bug.id)) {
        const newBug: Bug = {
          id: bug.id,
          description: bug.description,
          actionDescription: bug.actionDescription,
          dateFound: new Date()
        };
        
        setFoundBugs(prev => [...prev, newBug]);
        setBugsCount(prev => prev + 1);
        
        toast({
          title: "Поздравляем! Баг найден!",
          description: bug.description,
          variant: "destructive"
        });
        
        return true;
      }
    }
    return false;
  }, [foundBugs]);

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
    resetBugs,
  };
}

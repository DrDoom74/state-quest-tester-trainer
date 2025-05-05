
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
  // Removed the republish-unpublished-bug
  {
    id: 'archived-article-bug',
    description: 'Баг обнаружен. Статья в статусе Архив доступна для просмотра другим пользователям.',
    actionDescription: 'Просмотр статьи в статусе Архив',
    conditionCheck: () => true // This is manually checked in the article view
  },
  {
    id: 'save-without-changes-bug',
    description: 'Обнаружен баг! Кнопка сохранить изменения доступна без внесенияя изменений в статью',
    actionDescription: 'Сохранение статьи без внесения изменений',
    conditionCheck: () => true // This is manually checked in the form submission
  }
];

export function useBugs() {
  const [foundBugs, setFoundBugs] = useState<Bug[]>([]);
  const [bugsCount, setBugsCount] = useState(0);

  // Load saved bugs on initial mount
  useEffect(() => {
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

  // Save bugs whenever they change
  useEffect(() => {
    localStorage.setItem(BUGS_STORAGE_KEY, JSON.stringify(foundBugs));
    localStorage.setItem(BUGS_COUNT_KEY, bugsCount.toString());
  }, [foundBugs, bugsCount]);

  // Core function to register a bug - ensuring it's properly synchronized
  const checkForBug = useCallback((bugId: string, description: string, actionDescription: string): boolean => {
    console.log(`Checking for bug: ${bugId}, already found bugs:`, foundBugs.map(b => b.id));
    
    // Check if this bug has already been found
    if (!foundBugs.some(found => found.id === bugId)) {
      console.log(`Bug ${bugId} not found yet, adding to found bugs`);
      
      // Create new bug object
      const newBug: Bug = {
        id: bugId,
        description,
        actionDescription,
        dateFound: new Date()
      };
      
      // Update state with new bug - force a state update by creating a new array
      setFoundBugs(prevBugs => {
        const updatedBugs = [...prevBugs, newBug];
        console.log("Updated bugs:", updatedBugs);
        return updatedBugs;
      });
      
      setBugsCount(prevCount => {
        const newCount = prevCount + 1;
        console.log("Updated bug count:", newCount);
        return newCount;
      });
      
      // Show toast notification
      toast({
        title: "Поздравляем! Баг найден!",
        description,
        variant: "destructive",
        duration: TOAST_TIMEOUT,
      });
      
      return true;
    } else {
      console.log(`Bug ${bugId} already found, not adding again`);
      return false;
    }
  }, [foundBugs]);

  // Function to check action-based bugs
  const checkActionForBug = useCallback((fromStatus: string, action: string): boolean => {
    console.log(`Checking action for bug: status=${fromStatus}, action=${action}`);
    
    // Find matching bug definition
    const matchingBug = PREDEFINED_BUGS.find(bug => {
      const matches = bug.conditionCheck(fromStatus, action);
      const alreadyFound = foundBugs.some(found => found.id === bug.id);
      return matches && !alreadyFound;
    });
    
    if (matchingBug) {
      console.log(`Found matching bug: ${matchingBug.id}`);
      return checkForBug(
        matchingBug.id, 
        matchingBug.description, 
        matchingBug.actionDescription
      );
    }
    
    console.log(`No matching bug found for status=${fromStatus}, action=${action}`);
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

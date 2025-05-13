
import { useState, useCallback, useEffect, createContext, useContext, ReactNode } from 'react';
import { Bug } from '@/types';
import { toast } from "@/hooks/use-toast";
import { useLanguage } from '@/hooks/useLanguage';

const BUGS_STORAGE_KEY = 'qa-simulator-bugs';
const BUGS_COUNT_KEY = 'qa-simulator-bugs-count';
const TOAST_TIMEOUT = 10000; // Auto-dismiss toast after 10 seconds

// Reorder and make condition checks more specific
export const PREDEFINED_BUGS: { 
  id: string;
  descriptionKey: string;
  actionDescriptionKey: string;
  conditionCheck: (fromStatus: string, action: string) => boolean;
}[] = [
  // Place the most specific bugs first in the array
  {
    id: 'delete-unpublished-bug',
    descriptionKey: 'bug.deleteUnpublished',
    actionDescriptionKey: 'bug.deleteUnpublishedAction',
    conditionCheck: (fromStatus, action) => fromStatus === 'unpublished' && action === 'delete'
  },
  {
    id: 'short-title-bug',
    descriptionKey: 'bug.shortTitle',
    actionDescriptionKey: 'bug.shortTitleAction',
    // Only trigger for form submission actions, not for article status changes
    conditionCheck: (fromStatus, action) => action === 'create' || action === 'edit'
  },
  {
    id: 'archived-article-bug',
    descriptionKey: 'bug.archivedView',
    actionDescriptionKey: 'bug.archivedViewAction',
    // Only trigger for archived viewing checks
    conditionCheck: (fromStatus, action) => action === 'view' && fromStatus === 'archived'
  },
  {
    id: 'save-without-changes-bug',
    descriptionKey: 'bug.saveUnchanged',
    actionDescriptionKey: 'bug.saveUnchangedAction',
    // Only trigger for save actions
    conditionCheck: (fromStatus, action) => action === 'save-unchanged'
  }
];

// Создаем контекст для багов
interface BugsContextType {
  foundBugs: Bug[];
  bugsCount: number;
  checkForBug: (bugId: string, description: string, actionDescription: string) => boolean;
  checkActionForBug: (fromStatus: string, action: string) => boolean;
  resetBugs: () => void;
}

const BugsContext = createContext<BugsContextType | null>(null);

// Создаем провайдер для контекста
export const BugsProvider = ({ children }: { children: ReactNode }) => {
  const bugsState = useBugsState();
  return (
    <BugsContext.Provider value={bugsState}>
      {children}
    </BugsContext.Provider>
  );
};

// Хук для использования контекста багов
export const useBugs = () => {
  const context = useContext(BugsContext);
  if (!context) {
    throw new Error('useBugs must be used within a BugsProvider');
  }
  return context;
};

// Основная логика работы с багами
function useBugsState() {
  const [foundBugs, setFoundBugs] = useState<Bug[]>([]);
  const [bugsCount, setBugsCount] = useState(0);
  const { t } = useLanguage();

  // Загружаем сохраненные баги при инициализации
  useEffect(() => {
    const loadSavedBugs = () => {
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
    };

    loadSavedBugs();
  }, []);

  // Основная функция для регистрации бага с правильной синхронизацией и отображением тоста
  const checkForBug = useCallback((bugId: string, description: string, actionDescription: string): boolean => {
    console.log(`Checking for bug: ${bugId}, already found bugs:`, foundBugs.map(b => b.id));
    
    // Проверяем, был ли баг уже найден
    if (!foundBugs.some(found => found.id === bugId)) {
      console.log(`Bug ${bugId} not found yet, adding to found bugs`);
      
      // Создаем новый объект бага
      const newBug: Bug = {
        id: bugId,
        description,
        actionDescription,
        dateFound: new Date()
      };
      
      // Обновляем состояние с новым багом, используя функциональное обновление
      setFoundBugs(prevBugs => {
        const updatedBugs = [...prevBugs, newBug];
        console.log("Updated bugs array:", updatedBugs);
        
        // Синхронно обновляем localStorage для немедленного сохранения
        localStorage.setItem(BUGS_STORAGE_KEY, JSON.stringify(updatedBugs));
        return updatedBugs;
      });
      
      // Обновляем счетчик багов с функциональным обновлением
      setBugsCount(prevCount => {
        const newCount = prevCount + 1;
        console.log("Updated bug count:", newCount);
        // Синхронно обновляем localStorage для немедленного сохранения
        localStorage.setItem(BUGS_COUNT_KEY, newCount.toString());
        return newCount;
      });
      
      // Показываем уведомление toast вне setState чтобы избежать проблем с рендерингом
      // Добавляем небольшую задержку для гарантии запуска после обновления состояния
      setTimeout(() => {
        toast({
          title: t('toast.bugFound'),
          description,
          variant: "destructive", 
          duration: TOAST_TIMEOUT,
        });
      }, 10);
      
      return true;
    } else {
      console.log(`Bug ${bugId} already found, not adding again`);
      return false;
    }
  }, [foundBugs, t]);

  // Функция для проверки багов на основе действий - improved with better logging
  const checkActionForBug = useCallback((fromStatus: string, action: string): boolean => {
    console.log(`Checking action for bug: status='${fromStatus}', action='${action}'`);
    
    // Loop through each bug to provide detailed logging
    for (const bug of PREDEFINED_BUGS) {
      const matches = bug.conditionCheck(fromStatus, action);
      const alreadyFound = foundBugs.some(found => found.id === bug.id);
      console.log(`Bug ${bug.id}: matches=${matches}, alreadyFound=${alreadyFound}`);
      
      // If we found a matching bug that hasn't been found yet, register it
      if (matches && !alreadyFound) {
        console.log(`Found matching bug: ${bug.id} with description: ${t(bug.descriptionKey)}`);
        return checkForBug(
          bug.id, 
          t(bug.descriptionKey), 
          t(bug.actionDescriptionKey)
        );
      }
    }
    
    console.log(`No matching bug found for status='${fromStatus}', action='${action}'`);
    return false;
  }, [foundBugs, checkForBug, t]);

  const resetBugs = useCallback(() => {
    setFoundBugs([]);
    setBugsCount(0);
    localStorage.removeItem(BUGS_STORAGE_KEY);
    localStorage.removeItem(BUGS_COUNT_KEY);
    toast({
      title: t('toast.progressReset'),
      description: t('toast.resetDescription'),
    });
  }, [t]);

  return {
    foundBugs,
    bugsCount,
    checkForBug,
    checkActionForBug,
    resetBugs,
  };
}

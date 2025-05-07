
import React from 'react';
import { BugIcon, BookOpenIcon, RefreshCwIcon, TrashIcon, ExternalLinkIcon } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { useIsMobile } from '@/hooks/use-mobile';

interface HeaderProps {
  bugsCount: number;
  onResetBugsClick: () => void;
  onClearBlogClick: () => void;
}

const Header: React.FC<HeaderProps> = ({ 
  bugsCount, 
  onResetBugsClick, 
  onClearBlogClick 
}) => {
  const isMobile = useIsMobile();
  
  return (
    <header className="bg-gradient-to-r from-indigo-600 to-violet-500 text-white py-3 px-4 shadow-md">
      <div className="container mx-auto">
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-2">
            <BookOpenIcon className="h-6 w-6" />
            <h1 className="text-xl font-bold">QA State Transition Тренажер</h1>
          </div>
          
          <div className={`flex ${isMobile ? "flex-col w-full" : "items-center"} gap-2 sm:gap-4`}>
            <div className="bg-red-600 text-white px-3 py-1 rounded-full flex items-center gap-1 self-center sm:self-auto">
              <BugIcon className="h-4 w-4" />
              <span className="font-semibold">{bugsCount}/5</span>
            </div>
            
            <div className={`flex ${isMobile ? "flex-col w-full" : "space-x-2"} gap-2`}>
              <Button 
                variant="secondary" 
                size="sm" 
                onClick={onResetBugsClick}
                className={`${isMobile ? "w-full" : ""} bg-white/10 text-white border border-white/30 hover:bg-white hover:text-violet-600`}
              >
                <RefreshCwIcon className="h-4 w-4 mr-1" />
                Сбросить прогресс
              </Button>
              
              <Button 
                variant="secondary" 
                size="sm" 
                onClick={onClearBlogClick}
                className={`${isMobile ? "w-full" : ""} bg-white/10 text-white border border-white/30 hover:bg-white hover:text-violet-600`}
              >
                <TrashIcon className="h-4 w-4 mr-1" />
                Очистить блог
              </Button>
              
              <Button 
                variant="secondary" 
                size="sm" 
                className={`${isMobile ? "w-full" : ""} bg-white/10 text-white border border-white/30 hover:bg-white hover:text-violet-600`}
                onClick={() => window.open('https://boosty.to/aklimenko', '_blank')}
              >
                <ExternalLinkIcon className="h-4 w-4 mr-1" />
                Ответы
              </Button>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;

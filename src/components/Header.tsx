
import React from 'react';
import { BugIcon, BookOpenIcon, RefreshCwIcon, TrashIcon } from 'lucide-react';
import { Button } from "@/components/ui/button";

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
  return (
    <header className="bg-primary text-white py-3 px-4 shadow-md">
      <div className="container mx-auto">
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-2">
            <BookOpenIcon className="h-6 w-6" />
            <h1 className="text-xl font-bold">QA State Transition Тренажер</h1>
          </div>
          
          <div className="flex items-center gap-2 sm:gap-4">
            <div className="bg-red-600 text-white px-3 py-1 rounded-full flex items-center gap-1">
              <BugIcon className="h-4 w-4" />
              <span className="font-semibold">{bugsCount}/5</span>
            </div>
            
            <div className="flex space-x-2">
              <Button 
                variant="secondary" 
                size="sm" 
                onClick={onResetBugsClick}
                className="bg-transparent text-white border border-white hover:bg-white hover:text-primary"
              >
                <RefreshCwIcon className="h-4 w-4 mr-1" />
                Сбросить прогресс
              </Button>
              
              <Button 
                variant="secondary" 
                size="sm" 
                onClick={onClearBlogClick}
                className="bg-transparent text-white border border-white hover:bg-white hover:text-primary"
              >
                <TrashIcon className="h-4 w-4 mr-1" />
                Очистить блог
              </Button>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;

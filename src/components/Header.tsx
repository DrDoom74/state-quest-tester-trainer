
import React, { useState } from 'react';
import { BugIcon, BookOpenIcon, RefreshCwIcon, TrashIcon, Menu, X } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

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
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  return (
    <header className="bg-primary text-white py-3 px-4 shadow-md relative">
      <div className="container mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex items-center justify-between w-full md:w-auto">
            <div className="flex items-center gap-2">
              <BookOpenIcon className="h-6 w-6" />
              <h1 className="text-xl font-bold">QA State Transition Тренажер</h1>
            </div>
            <button 
              onClick={toggleMenu}
              className="md:hidden"
              aria-label="Toggle menu"
            >
              {isMenuOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </button>
          </div>
          
          <div className={cn(
            "flex flex-col md:flex-row items-center gap-4 w-full md:w-auto",
            isMenuOpen ? "block" : "hidden md:flex"
          )}>
            <div className="bg-red-600 text-white px-3 py-1 rounded-full flex items-center gap-1">
              <BugIcon className="h-4 w-4" />
              <span className="font-semibold">{bugsCount}/5</span>
            </div>
            
            <div className="flex flex-col md:flex-row gap-2 w-full md:w-auto">
              <Button 
                variant="outline" 
                size="sm" 
                onClick={onResetBugsClick}
                className="text-white border-white hover:bg-white hover:text-primary w-full md:w-auto"
              >
                <RefreshCwIcon className="h-4 w-4 mr-1" />
                <span>Сбросить прогресс</span>
              </Button>
              
              <Button 
                variant="outline" 
                size="sm" 
                onClick={onClearBlogClick}
                className="text-white border-white hover:bg-white hover:text-primary w-full md:w-auto"
              >
                <TrashIcon className="h-4 w-4 mr-1" />
                <span>Очистить блог</span>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;

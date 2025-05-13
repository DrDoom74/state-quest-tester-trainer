
import React from 'react';
import { BugIcon, BookOpenIcon, RefreshCwIcon, TrashIcon, ExternalLinkIcon, GlobeIcon } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { useIsMobile } from '@/hooks/use-mobile';
import { useLanguage } from '@/hooks/useLanguage';

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
  const { language, setLanguage, t } = useLanguage();
  
  const toggleLanguage = () => {
    setLanguage(language === 'ru' ? 'en' : 'ru');
  };
  
  return (
    <header className="bg-gradient-to-r from-indigo-600 to-violet-500 text-white py-3 px-4 shadow-md">
      <div className="container mx-auto">
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-2">
            <BookOpenIcon className="h-6 w-6" />
            <h1 className="text-xl font-bold">{t('app.title')}</h1>
          </div>
          
          <div className={`flex ${isMobile ? "flex-col w-full" : "items-center"} gap-2 sm:gap-4`}>
            <div className="bg-red-600 text-white px-3 py-1 rounded-full flex items-center gap-1 self-center sm:self-auto">
              <BugIcon className="h-4 w-4" />
              <span className="font-semibold">{bugsCount}{t('bugs.count')}</span>
            </div>
            
            <div className={`flex ${isMobile ? "flex-col w-full" : "space-x-2"} gap-2`}>
              <Button 
                variant="secondary" 
                size="sm" 
                onClick={onResetBugsClick}
                className={`${isMobile ? "w-full" : ""} bg-white/10 text-white border border-white/30 hover:bg-white hover:text-violet-600`}
              >
                <RefreshCwIcon className="h-4 w-4 mr-1" />
                {t('button.resetProgress')}
              </Button>
              
              <Button 
                variant="secondary" 
                size="sm" 
                onClick={onClearBlogClick}
                className={`${isMobile ? "w-full" : ""} bg-white/10 text-white border border-white/30 hover:bg-white hover:text-violet-600`}
              >
                <TrashIcon className="h-4 w-4 mr-1" />
                {t('button.clearBlog')}
              </Button>
              
              <Button 
                variant="secondary" 
                size="sm" 
                className={`${isMobile ? "w-full" : ""} bg-white/10 text-white border border-white/30 hover:bg-white hover:text-violet-600`}
                onClick={() => window.open('https://boosty.to/aklimenko', '_blank')}
              >
                <ExternalLinkIcon className="h-4 w-4 mr-1" />
                {t('button.answers')}
              </Button>

              <Button 
                variant="secondary" 
                size="sm" 
                onClick={toggleLanguage}
                className={`${isMobile ? "w-full" : ""} bg-white/10 text-white border border-white/30 hover:bg-white hover:text-violet-600`}
              >
                <GlobeIcon className="h-4 w-4 mr-1" />
                {t('button.language')}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;

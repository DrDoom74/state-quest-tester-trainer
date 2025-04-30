
import React from 'react';
import { ExternalLinkIcon } from 'lucide-react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-gray-100 py-4 px-4 mt-auto border-t border-gray-200">
      <div className="container mx-auto">
        <div className="flex flex-col sm:flex-row justify-between items-center gap-2">
          <p className="text-gray-600 text-sm">
            Школа Алексея Клименко по тестированию ПО
          </p>
          <a 
            href="https://t.me/QA_AKlimenko" 
            target="_blank" 
            rel="noopener noreferrer"
            className="flex items-center gap-1 text-violet-600 hover:text-violet-800 text-sm font-medium"
          >
            <ExternalLinkIcon className="h-4 w-4" />
            <span>Телеграм канал</span>
          </a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

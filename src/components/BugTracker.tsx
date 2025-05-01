
import React, { useState } from 'react';
import { Bug } from '@/types';
import { AlertTriangleIcon, ChevronDownIcon, ChevronUpIcon } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { formatDistanceToNow } from 'date-fns';
import { ru } from 'date-fns/locale';

interface BugTrackerProps {
  bugs: Bug[];
}

const BugTracker: React.FC<BugTrackerProps> = ({ bugs }) => {
  const [isExpanded, setIsExpanded] = useState(true);
  
  return (
    <div className="bg-white rounded-lg shadow-md p-4">
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-2">
          <AlertTriangleIcon className="h-5 w-5 text-red-500" />
          <h2 className="text-lg font-semibold">Найденные баги ({bugs.length}/4)</h2>
        </div>
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={() => setIsExpanded(!isExpanded)}
          className="p-1 h-8 w-8"
        >
          {isExpanded ? <ChevronUpIcon /> : <ChevronDownIcon />}
        </Button>
      </div>
      
      {isExpanded && (
        <div className="mt-4">
          {bugs.length === 0 ? (
            <div className="text-center py-6 text-gray-500">
              <p>Вы пока не нашли ни одного бага.</p>
              <p className="text-sm">Попробуйте выполнить разные действия с статьями в разных состояниях.</p>
            </div>
          ) : (
            <ul className="space-y-3">
              {bugs.map(bug => (
                <li key={bug.id} className="border-l-4 border-red-500 pl-3 py-1">
                  <div className="font-medium text-red-700">{bug.description}</div>
                  <div className="text-sm text-gray-600">
                    <span className="font-medium">Воспроизведение:</span> {bug.actionDescription}
                  </div>
                  <div className="text-xs text-gray-500 mt-1">
                    Найден {formatDistanceToNow(bug.dateFound, { addSuffix: true, locale: ru })}
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  );
};

export default BugTracker;

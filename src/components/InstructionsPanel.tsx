
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { InfoIcon, ChevronDownIcon, ChevronUpIcon } from 'lucide-react';

const InstructionsPanel: React.FC = () => {
  const [isExpanded, setIsExpanded] = useState(false);
  
  return (
    <div className="bg-white rounded-lg shadow-md p-4 mb-6">
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-2">
          <InfoIcon className="h-5 w-5 text-primary" />
          <h2 className="text-lg font-semibold">Описание задания</h2>
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
        <div className="mt-4 text-sm space-y-4">
          <p>
            <strong>Цель тренажера:</strong> Научиться находить баги, анализируя переходы состояний статьи в системе публикации.
          </p>
          
          <div>
            <strong>Состояния статьи:</strong>
            <ul className="list-disc pl-5 mt-1">
              <li><span className="state-badge state-draft">Черновик</span> — создаётся автором. Видна только автору.</li>
              <li><span className="state-badge state-moderation">На модерации</span> — отправляется на проверку модератору.</li>
              <li><span className="state-badge state-rejected">Отклонена</span> — модератором. Видна только автору.</li>
              <li><span className="state-badge state-published">Опубликована</span> — доступна всем читателям на сайте.</li>
              <li><span className="state-badge state-unpublished">Снята с публикации</span> — только для модераторов, больше не отображается в публичной части.</li>
              <li><span className="state-badge state-archived">Архив</span> — финальное состояние. Статья сохраняется в истории, но недоступна для редактирования и публикации.</li>
            </ul>
          </div>
          
          <div>
            <strong>Разрешенные переходы:</strong>
            <table className="min-w-full border-collapse mt-1 text-xs">
              <thead>
                <tr className="bg-gray-100">
                  <th className="border px-2 py-1 text-left">Текущее состояние</th>
                  <th className="border px-2 py-1 text-left">Действие</th>
                  <th className="border px-2 py-1 text-left">Новое состояние</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="border px-2 py-1">Черновик</td>
                  <td className="border px-2 py-1">Отправить на модерацию</td>
                  <td className="border px-2 py-1">На модерации</td>
                </tr>
                <tr>
                  <td className="border px-2 py-1">На модерации</td>
                  <td className="border px-2 py-1">Одобрить</td>
                  <td className="border px-2 py-1">Опубликована</td>
                </tr>
                <tr>
                  <td className="border px-2 py-1">На модерации</td>
                  <td className="border px-2 py-1">Отклонить</td>
                  <td className="border px-2 py-1">Отклонена</td>
                </tr>
                <tr>
                  <td className="border px-2 py-1">Отклонена</td>
                  <td className="border px-2 py-1">Отредактировать + повторная отправка</td>
                  <td className="border px-2 py-1">На модерации</td>
                </tr>
                <tr>
                  <td className="border px-2 py-1">Опубликована</td>
                  <td className="border px-2 py-1">Снять с публикации</td>
                  <td className="border px-2 py-1">Снята с публикации</td>
                </tr>
                <tr>
                  <td className="border px-2 py-1">Снята с публикации</td>
                  <td className="border px-2 py-1">Опубликовать повторно</td>
                  <td className="border px-2 py-1">Опубликована</td>
                </tr>
                <tr>
                  <td className="border px-2 py-1">Любое состояние</td>
                  <td className="border px-2 py-1">Архивировать</td>
                  <td className="border px-2 py-1">Архив</td>
                </tr>
              </tbody>
            </table>
          </div>
          
          <div>
            <strong>Ограничения:</strong>
            <ul className="list-disc pl-5 mt-1">
              <li>Только <strong>автор</strong> может редактировать черновик или отклонённую статью.</li>
              <li><strong>Опубликованную статью нельзя редактировать</strong>.</li>
              <li>Архив — <strong>финальное состояние</strong>, из него <strong>переходов нет</strong>.</li>
              <li>При попытке совершить недопустимое действие, система должна отобразить сообщение об ошибке.</li>
              <li>Пользователь не может создать более <strong>10 статей одновременно</strong>.</li>
            </ul>
          </div>
          
          <div>
            <strong>Задача:</strong> Протестировать реализацию и найти все баги. В тренажере спрятано <strong>5 багов</strong>, которые противоречат бизнес-требованиям.
          </div>
        </div>
      )}
    </div>
  );
};

export default InstructionsPanel;

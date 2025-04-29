
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
            <strong>Цель тренажера:</strong> протестировать функционал блога и найти баги, анализируя переходы состояний статьи в системе публикации.
          </p>
          
          <div>
            <h3 className="font-bold mb-2">1. Видимость статьи по статусам и ролям</h3>
            <table className="min-w-full border-collapse mt-1 text-xs">
              <thead>
                <tr className="bg-gray-100">
                  <th className="border px-2 py-1 text-left">Состояние</th>
                  <th className="border px-2 py-1 text-center">Пользователь 1</th>
                  <th className="border px-2 py-1 text-center">Модератор</th>
                  <th className="border px-2 py-1 text-center">Гость</th>
                </tr>
              </thead>
              <tbody>
                {[
                  { state: 'Черновик', user: '✓', moderator: '—', guest: '—' },
                  { state: 'На модерации', user: '✓', moderator: '✓', guest: '—' },
                  { state: 'Отклонена', user: '✓', moderator: '✓', guest: '—' },
                  { state: 'Опубликована', user: '✓', moderator: '✓', guest: '✓' },
                  { state: 'Снята с публикации', user: '✓', moderator: '✓', guest: '—' },
                  { state: 'Архив', user: '✓', moderator: '—', guest: '—' }
                ].map((row, index) => (
                  <tr key={index}>
                    <td className="border px-2 py-1">{row.state}</td>
                    <td className="border px-2 py-1 text-center">{row.user}</td>
                    <td className="border px-2 py-1 text-center">{row.moderator}</td>
                    <td className="border px-2 py-1 text-center">{row.guest}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          
          <div>
            <h3 className="font-bold mb-2">2. Доступные действия и переходы по статусам</h3>
            <table className="min-w-full border-collapse mt-1 text-xs">
              <thead>
                <tr className="bg-gray-100">
                  <th className="border px-2 py-1 text-left">Состояние</th>
                  <th className="border px-2 py-1 text-left">Действие</th>
                  <th className="border px-2 py-1 text-left">Переход в статус</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="border px-2 py-1 font-semibold" colSpan={3}>Пользователь 1</td>
                </tr>
                <tr>
                  <td className="border px-2 py-1">Черновик</td>
                  <td className="border px-2 py-1">Редактировать<br />Удалить<br />Отправить на модерацию</td>
                  <td className="border px-2 py-1">На модерации</td>
                </tr>
                <tr>
                  <td className="border px-2 py-1">На модерации</td>
                  <td className="border px-2 py-1">—</td>
                  <td className="border px-2 py-1">—</td>
                </tr>
                <tr>
                  <td className="border px-2 py-1">Отклонена</td>
                  <td className="border px-2 py-1">Редактировать<br />Удалить</td>
                  <td className="border px-2 py-1">Черновик</td>
                </tr>
                <tr>
                  <td className="border px-2 py-1">Опубликована</td>
                  <td className="border px-2 py-1">Редактировать</td>
                  <td className="border px-2 py-1">Черновик</td>
                </tr>
                <tr>
                  <td className="border px-2 py-1">Опубликована</td>
                  <td className="border px-2 py-1">В архив</td>
                  <td className="border px-2 py-1">Архив</td>
                </tr>
                <tr>
                  <td className="border px-2 py-1">Снята с публикации</td>
                  <td className="border px-2 py-1">Редактировать</td>
                  <td className="border px-2 py-1">Черновик</td>
                </tr>
                <tr>
                  <td className="border px-2 py-1">Снята с публикации</td>
                  <td className="border px-2 py-1">В архив</td>
                  <td className="border px-2 py-1">Архив</td>
                </tr>
                <tr>
                  <td className="border px-2 py-1">Архив</td>
                  <td className="border px-2 py-1">—</td>
                  <td className="border px-2 py-1"></td>
                </tr>
                <tr>
                  <td className="border px-2 py-1 font-semibold" colSpan={3}>Модератор</td>
                </tr>
                <tr>
                  <td className="border px-2 py-1">Черновик</td>
                  <td className="border px-2 py-1">—</td>
                  <td className="border px-2 py-1"></td>
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
                  <td className="border px-2 py-1">—</td>
                  <td className="border px-2 py-1"></td>
                </tr>
                <tr>
                  <td className="border px-2 py-1">Опубликована</td>
                  <td className="border px-2 py-1">Снять с публикации</td>
                  <td className="border px-2 py-1">Снята с публикации</td>
                </tr>
                <tr>
                  <td className="border px-2 py-1">Снята с публикации</td>
                  <td className="border px-2 py-1">—</td>
                  <td className="border px-2 py-1"></td>
                </tr>
                <tr>
                  <td className="border px-2 py-1">Архив</td>
                  <td className="border px-2 py-1">—</td>
                  <td className="border px-2 py-1"></td>
                </tr>
                <tr>
                  <td className="border px-2 py-1 font-semibold" colSpan={3}>Гость</td>
                </tr>
                <tr>
                  <td className="border px-2 py-1">Черновик</td>
                  <td className="border px-2 py-1">—</td>
                  <td className="border px-2 py-1"></td>
                </tr>
                <tr>
                  <td className="border px-2 py-1">На модерации</td>
                  <td className="border px-2 py-1">—</td>
                  <td className="border px-2 py-1"></td>
                </tr>
                <tr>
                  <td className="border px-2 py-1">Отклонена</td>
                  <td className="border px-2 py-1">—</td>
                  <td className="border px-2 py-1"></td>
                </tr>
                <tr>
                  <td className="border px-2 py-1">Опубликована</td>
                  <td className="border px-2 py-1">—</td>
                  <td className="border px-2 py-1"></td>
                </tr>
                <tr>
                  <td className="border px-2 py-1">Снята с публикации</td>
                  <td className="border px-2 py-1">—</td>
                  <td className="border px-2 py-1"></td>
                </tr>
                <tr>
                  <td className="border px-2 py-1">Архив</td>
                  <td className="border px-2 py-1">—</td>
                  <td className="border px-2 py-1"></td>
                </tr>
              </tbody>
            </table>
          </div>
          
          <div>
            <h3 className="font-bold mb-2">3. Описание требований к статье</h3>
            <ul className="list-disc pl-5">
              <li>Минимальное количество символов: 100</li>
              <li>Максимальное количество символов: 1000</li>
              <li>Максимально возможное количество статей: 5</li>
            </ul>
          </div>
          
          <div>
            <h3 className="font-bold mb-2">4. Вкладки (роли) и их назначение</h3>
            {[
              {
                role: 'Пользователь 1 (Автор)',
                description: [
                  'Создаёт и редактирует статьи, инициирует переход "Черновик" → "На модерации".',
                  'Видит все свои статьи во всех статусах.',
                  'Выполняет тестовые сценарии и фиксирует баги.'
                ]
              },
              {
                role: 'Модератор',
                description: [
                  'Проверяет статьи в статусе "На модерации".',
                  'Может одобрить (→ "Опубликована"), отклонить (→ "Отклонена"), снять с публикации (→ "Снята с публикации") и отправить в архив (→ "Архив").',
                  'Видит статьи в статусах "На модерации", "Отклонена", "Опубликована", "Снята с публикации".'
                ]
              },
              {
                role: 'Гость (Читатель)',
                description: [
                  'Имеет только права просмотра.',
                  'Видит только статьи в статусе "Опубликована".',
                  'Не может выполнять никаких действий.'
                ]
              }
            ].map((roleInfo, index) => (
              <div key={index} className="mb-3">
                <h4 className="font-semibold">{roleInfo.role}</h4>
                <ul className="list-disc pl-5">
                  {roleInfo.description.map((desc, descIndex) => (
                    <li key={descIndex}>{desc}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default InstructionsPanel;


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
                  <th className="border px-2 py-1 text-left">Пользователь 1</th>
                  <th className="border px-2 py-1 text-left">Модератор</th>
                  <th className="border px-2 py-1 text-center">Гость</th>
                </tr>
              </thead>
              <tbody>
                {[
                  { 
                    state: '**Черновик**', 
                    user: 'Редактировать; Удалить; Отправить на модерацию → *На модерации*', 
                    moderator: '—', 
                    guest: '—' 
                  },
                  { 
                    state: '**На модерации**', 
                    user: '—', 
                    moderator: 'Одобрить → *Опубликована*; Отклонить → *Отклонена*', 
                    guest: '—' 
                  },
                  { 
                    state: '**Отклонена**', 
                    user: 'Редактировать → *Черновик*; Удалить', 
                    moderator: '—', 
                    guest: '—' 
                  },
                  { 
                    state: '**Опубликована**', 
                    user: 'Редактировать → *Черновик*; В архив → *Архив*', 
                    moderator: 'Снять с публикации → *Снята с публикации*', 
                    guest: '—' 
                  },
                  { 
                    state: '**Снята с публикации**', 
                    user: 'Редактировать → *Черновик*; В архив → *Архив*', 
                    moderator: '—', 
                    guest: '—' 
                  },
                  { 
                    state: '**Архив**', 
                    user: '—', 
                    moderator: '—', 
                    guest: '—' 
                  }
                ].map((row, index) => (
                  <tr key={index}>
                    <td className="border px-2 py-1" dangerouslySetInnerHTML={{__html: row.state}}></td>
                    <td className="border px-2 py-1">{row.user}</td>
                    <td className="border px-2 py-1">{row.moderator}</td>
                    <td className="border px-2 py-1 text-center">{row.guest}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          
          <div>
            <h3 className="font-bold mb-2">3. Описание статусов статьи</h3>
            {[
              {
                title: 'Черновик',
                description: 'Статья создаётся автором и пока не отправлена на проверку.',
                visibility: 'только Пользователю 1',
                actions: 'редактировать, удалить, отправить на модерацию'
              },
              {
                title: 'На модерации',
                description: 'Статья передана модератору на проверку.',
                visibility: 'Пользователю 1 и Модератору',
                actions: 'только для Модератора – одобрить или отклонить'
              },
              {
                title: 'Отклонена',
                description: 'Модератор посчитал статью несоответствующей требованиям.',
                visibility: 'Пользователю 1 и Модератору',
                actions: 'для Пользователя 1 – редактировать (возврат в "Черновик"), удалить'
              },
              {
                title: 'Опубликована',
                description: 'Статья успешно прошла модерацию и доступна всем читателям.',
                visibility: 'Пользователю 1, Модератору и Гостю',
                actions: 'Пользователь 1 – редактировать (→ "Черновик"), в архив (→ "Архив"); Модератор – снять с публикации (→ "Снята с публикации")'
              },
              {
                title: 'Снята с публикации',
                description: 'Модератор удалил статью из публичного доступа.',
                visibility: 'Пользователю 1 и Модератору',
                actions: 'Пользователь 1 – редактировать (→ "Черновик"), в архив (→ "Архив")'
              },
              {
                title: 'Архив',
                description: 'Финальное состояние: статья сохраняется в истории, но больше не редактируется и не публикуется.',
                visibility: 'только Пользователю 1',
                actions: 'отсутствуют'
              }
            ].map((status, index) => (
              <div key={index} className="mb-3">
                <h4 className="font-semibold">{status.title}</h4>
                <p><strong>Описание:</strong> {status.description}</p>
                <p><strong>Видна:</strong> {status.visibility}.</p>
                <p><strong>Действия:</strong> {status.actions}.</p>
              </div>
            ))}
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

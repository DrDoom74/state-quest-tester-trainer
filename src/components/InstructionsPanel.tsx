import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { InfoIcon, ChevronDownIcon, ChevronUpIcon } from 'lucide-react';
import { useIsMobile } from '@/hooks/use-mobile';
import { ScrollArea } from "@/components/ui/scroll-area";
import { useLanguage } from '@/hooks/useLanguage';

const InstructionsPanel: React.FC = () => {
  const [isExpanded, setIsExpanded] = useState(false);
  const isMobile = useIsMobile();
  const { t } = useLanguage();
  
  return (
    <div className="bg-white rounded-lg shadow-md p-4 mb-6">
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-2">
          <InfoIcon className="h-5 w-5 text-primary" />
          <h2 className="text-lg font-semibold">{t('instructions.title')}</h2>
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
            <strong>{t('instructions.purpose')}</strong>
          </p>
          
          <div>
            <h3 className="font-bold mb-2">{t('instructions.visibilityTitle')}</h3>
            {isMobile ? (
              <div className="overflow-x-auto pb-2">
                <div className="inline-block min-w-full">
                  <table className="min-w-full border-collapse mt-1 text-xs">
                    <thead>
                      <tr className="bg-gray-100">
                        <th className="border px-2 py-1 text-left">{t('article.status')}</th>
                        <th className="border px-2 py-1 text-center">{t('role.user')}</th>
                        <th className="border px-2 py-1 text-center">{t('role.moderator')}</th>
                        <th className="border px-2 py-1 text-center">{t('role.guest')}</th>
                      </tr>
                    </thead>
                    <tbody>
                      {[
                        { state: t('state.draft'), user: '✓', moderator: '—', guest: '—' },
                        { state: t('state.moderation'), user: '✓', moderator: '✓', guest: '—' },
                        { state: t('state.rejected'), user: '✓', moderator: '✓', guest: '—' },
                        { state: t('state.published'), user: '✓', moderator: '✓', guest: '✓' },
                        { state: t('state.unpublished'), user: '✓', moderator: '✓', guest: '—' },
                        { state: t('state.archived'), user: '✓', moderator: '—', guest: '—' }
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
              </div>
            ) : (
              <table className="min-w-full border-collapse mt-1 text-xs">
                <thead>
                  <tr className="bg-gray-100">
                    <th className="border px-2 py-1 text-left">{t('article.status')}</th>
                    <th className="border px-2 py-1 text-center">{t('role.user')}</th>
                    <th className="border px-2 py-1 text-center">{t('role.moderator')}</th>
                    <th className="border px-2 py-1 text-center">{t('role.guest')}</th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    { state: t('state.draft'), user: '✓', moderator: '—', guest: '—' },
                    { state: t('state.moderation'), user: '✓', moderator: '✓', guest: '—' },
                    { state: t('state.rejected'), user: '✓', moderator: '✓', guest: '—' },
                    { state: t('state.published'), user: '✓', moderator: '✓', guest: '✓' },
                    { state: t('state.unpublished'), user: '✓', moderator: '✓', guest: '—' },
                    { state: t('state.archived'), user: '✓', moderator: '—', guest: '—' }
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
            )}
          </div>
          
          <div>
            <h3 className="font-bold mb-2">{t('instructions.actionsTitle')}</h3>
            {isMobile ? (
              <div className="overflow-x-auto pb-2">
                <div className="inline-block min-w-full">
                  <table className="min-w-full border-collapse mt-1 text-xs">
                    <thead>
                      <tr className="bg-gray-100">
                        <th className="border px-2 py-1 text-left">{t('article.status')}</th>
                        <th className="border px-2 py-1 text-left">Action</th>
                        <th className="border px-2 py-1 text-left">Transition to Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr className="bg-gray-200 font-semibold">
                        <td className="border px-2 py-1" colSpan={3}>{t('role.user')}</td>
                      </tr>
                      <tr>
                        <td className="border px-2 py-1">{t('state.draft')}</td>
                        <td className="border px-2 py-1">{t('action.edit')}<br />{t('action.delete')}<br />{t('action.sendToModeration')}</td>
                        <td className="border px-2 py-1">{t('state.moderation')}</td>
                      </tr>
                      <tr>
                        <td className="border px-2 py-1">{t('state.moderation')}</td>
                        <td className="border px-2 py-1">—</td>
                        <td className="border px-2 py-1">—</td>
                      </tr>
                      <tr>
                        <td className="border px-2 py-1">{t('state.rejected')}</td>
                        <td className="border px-2 py-1">{t('action.edit')}<br />{t('action.delete')}</td>
                        <td className="border px-2 py-1">{t('state.draft')}</td>
                      </tr>
                      <tr>
                        <td className="border px-2 py-1">{t('state.published')}</td>
                        <td className="border px-2 py-1">{t('action.edit')}</td>
                        <td className="border px-2 py-1">{t('state.draft')}</td>
                      </tr>
                      <tr>
                        <td className="border px-2 py-1">{t('state.published')}</td>
                        <td className="border px-2 py-1">{t('action.archive')}</td>
                        <td className="border px-2 py-1">{t('state.archived')}</td>
                      </tr>
                      <tr>
                        <td className="border px-2 py-1">{t('state.unpublished')}</td>
                        <td className="border px-2 py-1">{t('action.edit')}</td>
                        <td className="border px-2 py-1">{t('state.draft')}</td>
                      </tr>
                      <tr>
                        <td className="border px-2 py-1">{t('state.unpublished')}</td>
                        <td className="border px-2 py-1">{t('action.archive')}</td>
                        <td className="border px-2 py-1">{t('state.archived')}</td>
                      </tr>
                      <tr>
                        <td className="border px-2 py-1">{t('state.archived')}</td>
                        <td className="border px-2 py-1">—</td>
                        <td className="border px-2 py-1"></td>
                      </tr>
                      <tr className="bg-gray-200 font-semibold">
                        <td className="border px-2 py-1" colSpan={3}>{t('role.moderator')}</td>
                      </tr>
                      <tr>
                        <td className="border px-2 py-1">{t('state.draft')}</td>
                        <td className="border px-2 py-1">—</td>
                        <td className="border px-2 py-1"></td>
                      </tr>
                      <tr>
                        <td className="border px-2 py-1">{t('state.moderation')}</td>
                        <td className="border px-2 py-1">{t('action.approve')}</td>
                        <td className="border px-2 py-1">{t('state.published')}</td>
                      </tr>
                      <tr>
                        <td className="border px-2 py-1">{t('state.moderation')}</td>
                        <td className="border px-2 py-1">{t('action.reject')}</td>
                        <td className="border px-2 py-1">{t('state.rejected')}</td>
                      </tr>
                      <tr>
                        <td className="border px-2 py-1">{t('state.rejected')}</td>
                        <td className="border px-2 py-1">—</td>
                        <td className="border px-2 py-1"></td>
                      </tr>
                      <tr>
                        <td className="border px-2 py-1">{t('state.published')}</td>
                        <td className="border px-2 py-1">{t('action.unpublish')}</td>
                        <td className="border px-2 py-1">{t('state.unpublished')}</td>
                      </tr>
                      <tr>
                        <td className="border px-2 py-1">{t('state.unpublished')}</td>
                        <td className="border px-2 py-1">—</td>
                        <td className="border px-2 py-1"></td>
                      </tr>
                      <tr>
                        <td className="border px-2 py-1">{t('state.archived')}</td>
                        <td className="border px-2 py-1">—</td>
                        <td className="border px-2 py-1"></td>
                      </tr>
                      <tr className="bg-gray-200 font-semibold">
                        <td className="border px-2 py-1" colSpan={3}>{t('role.guest')}</td>
                      </tr>
                      <tr>
                        <td className="border px-2 py-1">{t('state.draft')}</td>
                        <td className="border px-2 py-1">—</td>
                        <td className="border px-2 py-1"></td>
                      </tr>
                      <tr>
                        <td className="border px-2 py-1">{t('state.moderation')}</td>
                        <td className="border px-2 py-1">—</td>
                        <td className="border px-2 py-1"></td>
                      </tr>
                      <tr>
                        <td className="border px-2 py-1">{t('state.rejected')}</td>
                        <td className="border px-2 py-1">—</td>
                        <td className="border px-2 py-1"></td>
                      </tr>
                      <tr>
                        <td className="border px-2 py-1">{t('state.published')}</td>
                        <td className="border px-2 py-1">—</td>
                        <td className="border px-2 py-1"></td>
                      </tr>
                      <tr>
                        <td className="border px-2 py-1">{t('state.unpublished')}</td>
                        <td className="border px-2 py-1">—</td>
                        <td className="border px-2 py-1"></td>
                      </tr>
                      <tr>
                        <td className="border px-2 py-1">{t('state.archived')}</td>
                        <td className="border px-2 py-1">—</td>
                        <td className="border px-2 py-1"></td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            ) : (
              <table className="min-w-full border-collapse mt-1 text-xs">
                <thead>
                  <tr className="bg-gray-100">
                    <th className="border px-2 py-1 text-left">{t('article.status')}</th>
                    <th className="border px-2 py-1 text-left">Action</th>
                    <th className="border px-2 py-1 text-left">Transition to Status</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="bg-gray-200 font-semibold">
                    <td className="border px-2 py-1" colSpan={3}>{t('role.user')}</td>
                  </tr>
                  <tr>
                    <td className="border px-2 py-1">{t('state.draft')}</td>
                    <td className="border px-2 py-1">{t('action.edit')}<br />{t('action.delete')}<br />{t('action.sendToModeration')}</td>
                    <td className="border px-2 py-1">{t('state.moderation')}</td>
                  </tr>
                  <tr>
                    <td className="border px-2 py-1">{t('state.moderation')}</td>
                    <td className="border px-2 py-1">—</td>
                    <td className="border px-2 py-1">—</td>
                  </tr>
                  <tr>
                    <td className="border px-2 py-1">{t('state.rejected')}</td>
                    <td className="border px-2 py-1">{t('action.edit')}<br />{t('action.delete')}</td>
                    <td className="border px-2 py-1">{t('state.draft')}</td>
                  </tr>
                  <tr>
                    <td className="border px-2 py-1">{t('state.published')}</td>
                    <td className="border px-2 py-1">{t('action.edit')}</td>
                    <td className="border px-2 py-1">{t('state.draft')}</td>
                  </tr>
                  <tr>
                    <td className="border px-2 py-1">{t('state.published')}</td>
                    <td className="border px-2 py-1">{t('action.archive')}</td>
                    <td className="border px-2 py-1">{t('state.archived')}</td>
                  </tr>
                  <tr>
                    <td className="border px-2 py-1">{t('state.unpublished')}</td>
                    <td className="border px-2 py-1">{t('action.edit')}</td>
                    <td className="border px-2 py-1">{t('state.draft')}</td>
                  </tr>
                  <tr>
                    <td className="border px-2 py-1">{t('state.unpublished')}</td>
                    <td className="border px-2 py-1">{t('action.archive')}</td>
                    <td className="border px-2 py-1">{t('state.archived')}</td>
                  </tr>
                  <tr>
                    <td className="border px-2 py-1">{t('state.archived')}</td>
                    <td className="border px-2 py-1">—</td>
                    <td className="border px-2 py-1"></td>
                  </tr>
                  <tr className="bg-gray-200 font-semibold">
                    <td className="border px-2 py-1" colSpan={3}>{t('role.moderator')}</td>
                  </tr>
                  <tr>
                    <td className="border px-2 py-1">{t('state.draft')}</td>
                    <td className="border px-2 py-1">—</td>
                    <td className="border px-2 py-1"></td>
                  </tr>
                  <tr>
                    <td className="border px-2 py-1">{t('state.moderation')}</td>
                    <td className="border px-2 py-1">{t('action.approve')}</td>
                    <td className="border px-2 py-1">{t('state.published')}</td>
                  </tr>
                  <tr>
                    <td className="border px-2 py-1">{t('state.moderation')}</td>
                    <td className="border px-2 py-1">{t('action.reject')}</td>
                    <td className="border px-2 py-1">{t('state.rejected')}</td>
                  </tr>
                  <tr>
                    <td className="border px-2 py-1">{t('state.rejected')}</td>
                    <td className="border px-2 py-1">—</td>
                    <td className="border px-2 py-1"></td>
                  </tr>
                  <tr>
                    <td className="border px-2 py-1">{t('state.published')}</td>
                    <td className="border px-2 py-1">{t('action.unpublish')}</td>
                    <td className="border px-2 py-1">{t('state.unpublished')}</td>
                  </tr>
                  <tr>
                    <td className="border px-2 py-1">{t('state.unpublished')}</td>
                    <td className="border px-2 py-1">—</td>
                    <td className="border px-2 py-1"></td>
                  </tr>
                  <tr>
                    <td className="border px-2 py-1">{t('state.archived')}</td>
                    <td className="border px-2 py-1">—</td>
                    <td className="border px-2 py-1"></td>
                  </tr>
                  <tr className="bg-gray-200 font-semibold">
                    <td className="border px-2 py-1" colSpan={3}>{t('role.guest')}</td>
                  </tr>
                  <tr>
                    <td className="border px-2 py-1">{t('state.draft')}</td>
                    <td className="border px-2 py-1">—</td>
                    <td className="border px-2 py-1"></td>
                  </tr>
                  <tr>
                    <td className="border px-2 py-1">{t('state.moderation')}</td>
                    <td className="border px-2 py-1">—</td>
                    <td className="border px-2 py-1"></td>
                  </tr>
                  <tr>
                    <td className="border px-2 py-1">{t('state.rejected')}</td>
                    <td className="border px-2 py-1">—</td>
                    <td className="border px-2 py-1"></td>
                  </tr>
                  <tr>
                    <td className="border px-2 py-1">{t('state.published')}</td>
                    <td className="border px-2 py-1">—</td>
                    <td className="border px-2 py-1"></td>
                  </tr>
                  <tr>
                    <td className="border px-2 py-1">{t('state.unpublished')}</td>
                    <td className="border px-2 py-1">—</td>
                    <td className="border px-2 py-1"></td>
                  </tr>
                  <tr>
                    <td className="border px-2 py-1">{t('state.archived')}</td>
                    <td className="border px-2 py-1">—</td>
                    <td className="border px-2 py-1"></td>
                  </tr>
                </tbody>
              </table>
            )}
          </div>
          
          <div>
            <h3 className="font-bold mb-2">{t('instructions.requirementsTitle')}</h3>
            <ul className="list-disc pl-5">
              <li>{t('requirements.title')}</li>
              <li>{t('requirements.titleMax')}</li>
              <li>{t('requirements.content')}</li>
              <li>{t('requirements.contentMax')}</li>
              <li>{t('requirements.maxArticles')}</li>
            </ul>
            
            <h4 className="font-medium mt-3 mb-2">{t('requirements.categories')}</h4>
            <ul className="list-disc pl-5">
              <li><strong>Technology</strong></li>
              <li><strong>Science</strong></li>
              <li><strong>Health</strong></li>
              <li><strong>Business</strong></li>
              <li><strong>Entertainment</strong></li>
            </ul>
          </div>
          
          <div>
            <h3 className="font-bold mb-2">{t('instructions.tabsTitle')}</h3>
            <div className="space-y-4">
              <div>
                <h4 className="font-semibold bg-gray-200 p-1">{t('roleDesc.user')}</h4>
                <ul className="list-disc pl-5 mt-1">
                  <li>{t('roleDesc.userDetail')}</li>
                </ul>
              </div>
              
              <div>
                <h4 className="font-semibold bg-gray-200 p-1">{t('roleDesc.moderator')}</h4>
                <ul className="list-disc pl-5 mt-1">
                  <li>{t('roleDesc.moderatorDetail')}</li>
                </ul>
              </div>
              
              <div>
                <h4 className="font-semibold bg-gray-200 p-1">{t('roleDesc.guest')}</h4>
                <ul className="list-disc pl-5 mt-1">
                  <li>{t('roleDesc.guestDetail')}</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default InstructionsPanel;

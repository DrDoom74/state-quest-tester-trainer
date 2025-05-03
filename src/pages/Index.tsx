
import React from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import InstructionsPanel from '@/components/InstructionsPanel';
import ArticleManagement from '@/components/ArticleManagement';
import BugTracker from '@/components/BugTracker';
import { useArticles } from '@/hooks/useArticles';
import { useBugs } from '@/hooks/useBugs';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const Index = () => {
  const { 
    articles, 
    visibleArticles,
    activeRole,
    setActiveRole,
    createArticle, 
    updateArticle, 
    performAction, 
    clearAllArticles,
    canCreateMore 
  } = useArticles();
  
  const { foundBugs, bugsCount, resetBugs, checkForBug } = useBugs();
  
  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header 
        bugsCount={bugsCount} 
        onResetBugsClick={resetBugs}
        onClearBlogClick={clearAllArticles}
      />
      
      <main className="container mx-auto py-6 px-4 flex-1">
        <InstructionsPanel />
        
        <Tabs defaultValue="articles" className="mb-6">
          <TabsList>
            <TabsTrigger value="articles">Статьи</TabsTrigger>
            <TabsTrigger value="bugs">Найденные баги</TabsTrigger>
          </TabsList>
          <TabsContent value="articles">
            <ArticleManagement 
              articles={articles}
              visibleArticles={visibleArticles}
              activeRole={activeRole}
              setActiveRole={setActiveRole}
              canCreateMore={canCreateMore}
              createArticle={createArticle}
              updateArticle={updateArticle}
              performAction={performAction}
              checkForBug={checkForBug}
            />
          </TabsContent>
          <TabsContent value="bugs">
            <BugTracker bugs={foundBugs} />
          </TabsContent>
        </Tabs>
      </main>
      
      <Footer />
    </div>
  );
};

export default Index;

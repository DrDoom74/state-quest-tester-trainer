
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import { BugsProvider } from "@/hooks/useBugs";
import { LanguageProvider } from "@/hooks/useLanguage";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <LanguageProvider>
        <BugsProvider>
          <Toaster />
          <BrowserRouter basename="/simulators/state-transition-testing">
             <Routes>
               <Route path="/" element={<Index />} />
               <Route path="*" element={<NotFound />} />
             </Routes>
          </BrowserRouter>
        </BugsProvider>
      </LanguageProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;

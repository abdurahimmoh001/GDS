

import React, {
  useState,
  useCallback,
  useEffect
} from 'react';
import type {
  ResearchInputData,
  ResearchReport,
  UploadedFile,
  HistoryItem
} from './types';
import {
  generateResearchReport
} from './services/geminiService';
import InputPanel from './components/InputForm';
import ReportPanel from './components/OutputDisplay';
import {
  LogoIcon
} from './components/icons/LogoIcon';
import {
  SunIcon
} from './components/icons/SunIcon';
import {
  MoonIcon
} from './components/icons/MoonIcon';
import HistoryPanel from './components/HistoryPanel';
import LoadingScreen from './components/LoadingScreen';
import AuthScreen from './components/AuthScreen';
import { Chatbot } from './components/Chatbot';
import { ChatIcon } from './components/icons/ChatIcon';
import { PlusIcon } from './components/icons/PlusIcon';


const MAX_HISTORY_ITEMS = 15;
const GDS_HISTORY_STORAGE_KEY = 'goldenDataStreamHistory';
const AUTH_TOKEN_KEY = 'gdsAuthToken';


const App: React.FC = () => {
  const [researchData, setResearchData] = useState < ResearchInputData > ({
    startupName: 'EcoCharge',
    sector: 'Electric Vehicle Charging Infrastructure',
    objective: 'To analyze the market viability for a new network of solar-powered EV charging stations in North America, focusing on market size, key competitors, and consumer trends.',
  });
  const [uploadedFiles, setUploadedFiles] = useState < UploadedFile[] > ([]);
  const [includePerspectives, setIncludePerspectives] = useState < boolean > (true);
  
  const [view, setView] = useState < 'form' | 'report' | 'error' | 'loading' > ('form');
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [activeReport, setActiveReport] = useState<HistoryItem | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [error, setError] = useState < string | null > (null);
  const [theme, setTheme] = useState < 'light' | 'dark' > ('light');
  const [authState, setAuthState] = useState < 'unauthenticated' | 'authenticated' > ('unauthenticated');
  const [isChatbotOpen, setIsChatbotOpen] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem(AUTH_TOKEN_KEY);
    if (token) {
        setAuthState('authenticated');
    }
  }, []);

  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [theme]);

  useEffect(() => {
    if (authState === 'authenticated') {
        try {
          const savedHistory = localStorage.getItem(GDS_HISTORY_STORAGE_KEY);
          const parsedHistory = savedHistory ? JSON.parse(savedHistory) : [];
          setHistory(parsedHistory);
          if (parsedHistory.length > 0) {
              setActiveReport(parsedHistory[0]);
              setView('report');
          } else {
              setView('form');
          }
        } catch (error) {
          console.error("Failed to parse history from local storage:", error);
          localStorage.removeItem(GDS_HISTORY_STORAGE_KEY);
          setView('form');
        }
    } else {
        setHistory([]);
    }
  }, [authState]);

  const toggleTheme = () => {
    setTheme(prevTheme => (prevTheme === 'light' ? 'dark' : 'light'));
  };

  const handleGenerateReport = useCallback(async (data: ResearchInputData, files: UploadedFile[]) => {
    setIsSubmitting(true);
    setView('loading');
    setError(null);
    setActiveReport(null);

    try {
      const result = await generateResearchReport(data, files, includePerspectives);
      
      const newHistoryItem: HistoryItem = {
        id: new Date().toISOString(),
        startupName: data.startupName,
        date: new Date().toISOString(),
        report: result,
      };

      const updatedHistory = [newHistoryItem, ...history].slice(0, MAX_HISTORY_ITEMS);
      setHistory(updatedHistory);
      localStorage.setItem(GDS_HISTORY_STORAGE_KEY, JSON.stringify(updatedHistory));
      
      setActiveReport(newHistoryItem);
      setView('report');

    } catch (e) {
      if (e instanceof Error) {
        setError(`An error occurred: ${e.message}`);
      } else {
        setError('An unknown error occurred while generating the report.');
      }
      setView('error');
    } finally {
      setIsSubmitting(false);
    }
  }, [includePerspectives, history]);

  const handleSelectReport = (item: HistoryItem) => {
    setActiveReport(item);
    setView('report');
  };

  const handleStartNew = () => {
    setActiveReport(null);
    setError(null);
    setView('form');
  }

  const handleAuthAction = () => {
    localStorage.setItem(AUTH_TOKEN_KEY, 'mock-token');
    setAuthState('authenticated');
  };

  const handleSignOut = () => {
    localStorage.removeItem(AUTH_TOKEN_KEY);
    setAuthState('unauthenticated');
    setActiveReport(null);
    setError(null);
    setIsChatbotOpen(false);
  };
  
  const renderRightPanel = () => {
     switch (view) {
      case 'loading':
        return <LoadingScreen />;
      case 'error':
        return (
          <div className="flex flex-col items-center justify-center text-center h-full bg-red-50 p-6 rounded-lg border border-red-200 dark:bg-red-900/20 dark:border-red-500/30 min-h-[500px]">
            <p className="text-lg font-bold text-red-700 dark:text-red-300">Report Generation Failed</p>
            <p className="mt-2 text-red-600 dark:text-red-400">{error}</p>
             <button
              onClick={handleStartNew}
              className="mt-6 flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-blue-700 bg-blue-100 hover:bg-blue-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 dark:bg-blue-600/20 dark:text-blue-300 dark:hover:bg-blue-600/30 dark:focus:ring-offset-red-900/20 transition-colors"
            >
              <PlusIcon className="-ml-1 mr-2 h-5 w-5" />
              New Research
            </button>
          </div>
        );
      case 'report':
        if (activeReport) {
          return (
             <ReportPanel
              report={activeReport.report}
              onStartNew={handleStartNew}
              theme={theme}
              startupName={activeReport.startupName}
            />
          );
        }
        return null; // Should not happen
      case 'form':
        return (
          <InputPanel
            initialData={researchData}
            setResearchData={setResearchData}
            uploadedFiles={uploadedFiles}
            setUploadedFiles={setUploadedFiles}
            onGenerate={handleGenerateReport}
            isLoading={isSubmitting}
            includePerspectives={includePerspectives}
            setIncludePerspectives={setIncludePerspectives}
          />
        );
      default:
        return null;
    }
  }

  const renderMainContent = () => {
    if (authState !== 'authenticated') {
        return <AuthScreen onSignIn={handleAuthAction} onSignUp={handleAuthAction} />;
    }

    return (
      <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
        <aside className="md:col-span-4 lg:col-span-3">
          <HistoryPanel 
            history={history}
            onSelectReport={handleSelectReport}
            onStartNew={handleStartNew}
            activeReportId={activeReport?.id}
          />
        </aside>
        <div className="md:col-span-8 lg:col-span-9">
          {renderRightPanel()}
        </div>
      </div>
    );
  };


  return (
    <div className="min-h-screen font-sans text-slate-800 dark:text-slate-300">
        <header className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm border-b border-slate-200 dark:border-slate-800 sticky top-0 z-10">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="bg-blue-600 p-2 rounded-lg">
                <LogoIcon className="w-6 h-6 text-white" />
              </div>
              <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100">Golden Data Stream</h1>
            </div>
             <div className="flex items-center space-x-4">
               <p className="text-slate-500 hidden md:block dark:text-slate-400">Actionable Desk Research</p>
               <button
                  onClick={toggleTheme}
                  className="p-2 rounded-full text-slate-500 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 dark:focus:ring-offset-slate-900"
                  aria-label="Toggle theme"
                >
                  {theme === 'light' ? (
                    <MoonIcon className="w-6 h-6" />
                  ) : (
                    <SunIcon className="w-6 h-6 text-yellow-400" />
                  )}
                </button>
                {authState === 'authenticated' && (
                  <button
                    onClick={handleSignOut}
                    className="p-2 rounded-md text-sm font-medium text-slate-500 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800 focus:outline-none"
                  >
                    Sign Out
                  </button>
                )}
             </div>
          </div>
        </header>

        <main className="container mx-auto p-4 sm:p-6 lg:p-8">
          {renderMainContent()}
        </main>

        {authState === 'authenticated' && (
          <>
            <button
              onClick={() => setIsChatbotOpen(true)}
              className="fixed bottom-6 right-6 bg-blue-600 text-white p-4 rounded-full shadow-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 dark:focus:ring-offset-slate-900 transition-transform hover:scale-110"
              aria-label="Open GDS Assistant"
            >
              <ChatIcon className="w-6 h-6" />
            </button>
            {isChatbotOpen && <Chatbot onClose={() => setIsChatbotOpen(false)} />}
          </>
        )}
      </div>
  );
};

export default App;

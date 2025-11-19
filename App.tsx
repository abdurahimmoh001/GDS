
import React, {
  useState,
  useCallback,
  useEffect
} from 'react';
import type {
  ResearchInputData,
  ResearchReport,
  UploadedFile,
  HistoryItem,
  ChatMessage
} from './types';
import {
  generateResearchReport,
  startChat,
  sendChatMessage
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
import { PlusIcon } from './components/icons/PlusIcon';
import { HistoryIcon } from './components/icons/HistoryIcon';
import { Chatbot } from './components/Chatbot';


const MAX_HISTORY_ITEMS = 100; // Increased limit to accommodate multiple profiles
const GDS_HISTORY_STORAGE_KEY = 'goldenDataStreamHistory';
const GDS_PROFILES_STORAGE_KEY = 'goldenDataStreamProfiles';
const GDS_CURRENT_PROFILE_STORAGE_KEY = 'goldenDataStreamCurrentProfile';


const App: React.FC = () => {
  const [researchData, setResearchData] = useState < ResearchInputData > ({
    startupName: 'EcoCharge',
    sector: 'Electric Vehicle Charging Infrastructure',
    targetAudience: 'Urban apartment dwellers and fleet managers looking for sustainable charging options.',
    valueProposition: 'Solar-powered, grid-independent charging stations that can be deployed anywhere without trenching.',
    marketDynamics: 'Focus on market growth rate (CAGR), adoption trends in urban areas, and the shift towards decentralized energy grids.',
    competitiveLandscape: 'Investigate direct competitors in off-grid charging and traditional Level 2 charging providers.',
    consumerBehavior: 'Analyze willingness to pay for green energy and the primary pain points of current EV owners regarding charging accessibility.',
    regulatoryRisks: 'Identify federal/state incentives for EV infrastructure and any zoning laws related to sidewalk charging stations.',
  });
  const [uploadedFiles, setUploadedFiles] = useState < UploadedFile[] > ([]);
  const [includePerspectives, setIncludePerspectives] = useState < boolean > (true);
  
  const [view, setView] = useState < 'form' | 'report' | 'error' | 'loading' > ('loading');
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [activeReport, setActiveReport] = useState<HistoryItem | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [error, setError] = useState < string | null > (null);
  const [theme, setTheme] = useState < 'light' | 'dark' > ('light');
  
  // Default closed for hidden compartment feel
  const [isHistoryPanelOpen, setIsHistoryPanelOpen] = useState(false);

  // Profile State
  const [profiles, setProfiles] = useState<string[]>(['Default']);
  const [currentProfile, setCurrentProfile] = useState<string>('Default');

  // Chatbot State
  const [isChatbotOpen, setIsChatbotOpen] = useState(false);
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [isAiResponding, setIsAiResponding] = useState(false);

  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [theme]);

  // Load data from local storage
  useEffect(() => {
    try {
      // Load Profiles
      const savedProfiles = localStorage.getItem(GDS_PROFILES_STORAGE_KEY);
      const savedCurrentProfile = localStorage.getItem(GDS_CURRENT_PROFILE_STORAGE_KEY);
      
      if (savedProfiles) {
        setProfiles(JSON.parse(savedProfiles));
      }
      if (savedCurrentProfile) {
        setCurrentProfile(savedCurrentProfile);
      }

      // Load History
      const savedHistory = localStorage.getItem(GDS_HISTORY_STORAGE_KEY);
      const parsedHistory = savedHistory ? JSON.parse(savedHistory) : [];
      
      // Normalize history items to have a profile field (migration for existing users)
      const normalizedHistory = parsedHistory.map((item: any) => ({
        ...item,
        profile: item.profile || 'Default'
      }));

      setHistory(normalizedHistory);
      
      // Initial View Logic
      const filteredHistory = normalizedHistory.filter((h: HistoryItem) => h.profile === (savedCurrentProfile || 'Default'));
      
      if (filteredHistory.length > 0) {
          setActiveReport(filteredHistory[0]);
          setView('report');
      } else {
          setView('form');
      }
    } catch (error) {
      console.error("Failed to parse data from local storage:", error);
      // Reset on critical error to avoid crash loop
      setView('form');
    }
  }, []);

  const toggleTheme = () => {
    setTheme(prevTheme => (prevTheme === 'light' ? 'dark' : 'light'));
  };

  const toggleHistoryPanel = () => {
    setIsHistoryPanelOpen(prev => !prev);
  };
    
  const closeHistoryPanel = () => setIsHistoryPanelOpen(false);

  const handleCreateProfile = (newProfileName: string) => {
    if (!profiles.includes(newProfileName)) {
        const updatedProfiles = [...profiles, newProfileName];
        setProfiles(updatedProfiles);
        setCurrentProfile(newProfileName);
        
        localStorage.setItem(GDS_PROFILES_STORAGE_KEY, JSON.stringify(updatedProfiles));
        localStorage.setItem(GDS_CURRENT_PROFILE_STORAGE_KEY, newProfileName);
        
        // Switch to form view for new profile
        setView('form');
        setActiveReport(null);
    }
  };

  const handleSwitchProfile = (profileName: string) => {
      setCurrentProfile(profileName);
      localStorage.setItem(GDS_CURRENT_PROFILE_STORAGE_KEY, profileName);
      
      // Find most recent report for this profile
      const profileHistory = history.filter(h => h.profile === profileName);
      if (profileHistory.length > 0) {
          setActiveReport(profileHistory[0]);
          setView('report');
      } else {
          setView('form');
          setActiveReport(null);
      }
  };

  const handleGenerateReport = useCallback(async (data: ResearchInputData, files: UploadedFile[]) => {
    setIsSubmitting(true);
    setView('loading');
    setError(null);
    setActiveReport(null);
    setIsChatbotOpen(false); 
    setIsHistoryPanelOpen(false); // Close history panel if open

    try {
      const result = await generateResearchReport(data, files, includePerspectives);
      
      const newHistoryItem: HistoryItem = {
        id: new Date().toISOString(),
        startupName: data.startupName,
        date: new Date().toISOString(),
        report: result,
        profile: currentProfile, // Associate with current profile
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
  }, [includePerspectives, history, currentProfile]);

  const handleSelectReport = (item: HistoryItem) => {
    setActiveReport(item);
    setView('report');
    setIsChatbotOpen(false);
    setIsHistoryPanelOpen(false); // Auto close hidden compartment
  };
  
  const handleStartNew = () => {
    setActiveReport(null);
    setError(null);
    setView('form');
    setIsChatbotOpen(false);
    setIsHistoryPanelOpen(false); // Auto close hidden compartment
  }

  const handleOpenChatbot = () => {
    if (!activeReport) return;
    startChat(activeReport.report);
    setChatMessages([
      { id: 'initial-greeting', role: 'gemini', text: "Hello! How can I help you analyze or edit this report?" }
    ]);
    setIsChatbotOpen(true);
  };

  const handleSendChatMessage = async (messageText: string) => {
    if (!messageText.trim() || isAiResponding) return;

    const userMessage: ChatMessage = { id: new Date().toISOString(), role: 'user', text: messageText };
    setChatMessages(prev => [...prev, userMessage]);
    setIsAiResponding(true);

    try {
      const responseText = await sendChatMessage(messageText);
      let aiMessage: ChatMessage;

      try {
        const jsonStartIndex = responseText.indexOf('{');
        const jsonEndIndex = responseText.lastIndexOf('}');
        if (jsonStartIndex !== -1 && jsonEndIndex !== -1) {
            const jsonString = responseText.substring(jsonStartIndex, jsonEndIndex + 1);
            const parsedJson = JSON.parse(jsonString);

            if (parsedJson && parsedJson.executiveSummary && parsedJson.marketAnalysis) {
              aiMessage = {
                id: new Date().toISOString() + '-ai',
                role: 'gemini',
                text: "I've made the requested edits. You can apply the changes below.",
                updatedReport: parsedJson,
              };
            } else {
              throw new Error("Parsed JSON is not a valid report.");
            }
        } else {
             throw new Error("No JSON object found in response.");
        }
      } catch (e) {
        aiMessage = { id: new Date().toISOString() + '-ai', role: 'gemini', text: responseText };
      }

      setChatMessages(prev => [...prev, aiMessage]);

    } catch (e) {
      const errorMessage: ChatMessage = {
        id: new Date().toISOString() + '-error',
        role: 'gemini',
        text: "Sorry, I encountered an error. Please try again."
      };
      setChatMessages(prev => [...prev, errorMessage]);
      console.error("Error in chat:", e);
    } finally {
      setIsAiResponding(false);
    }
  };
  
  const handleApplyEdit = (updatedReport: ResearchReport) => {
      if (!activeReport) return;

      const updatedHistoryItem = { ...activeReport, report: updatedReport };
      
      // Update active report
      setActiveReport(updatedHistoryItem);

      // Update history and local storage
      const updatedHistory = history.map(item => item.id === activeReport.id ? updatedHistoryItem : item);
      setHistory(updatedHistory);
      localStorage.setItem(GDS_HISTORY_STORAGE_KEY, JSON.stringify(updatedHistory));
      
      const confirmationMessage: ChatMessage = {
        id: new Date().toISOString() + '-confirm',
        role: 'gemini',
        text: "✅ Report updated successfully!"
      };
      setChatMessages(prev => [...prev, confirmationMessage]);
  };
  
  const filteredHistory = history.filter(item => item.profile === currentProfile);

  const renderActiveView = () => {
     switch (view) {
      case 'loading':
        return <LoadingScreen />;
      case 'error':
        return (
          <div className="flex flex-col items-center justify-center text-center h-full bg-red-50 p-6 rounded-2xl border border-red-200 dark:bg-red-900/20 dark:border-red-500/30 min-h-[500px] animate-slide-in-up">
            <p className="text-lg font-bold text-red-700 dark:text-red-300 font-heading">Report Generation Failed</p>
            <p className="mt-2 text-red-600 dark:text-red-400">{error}</p>
             <button
              onClick={handleStartNew}
              className="mt-6 flex items-center px-5 py-2.5 border border-transparent text-sm font-medium rounded-xl text-amber-700 bg-amber-100 hover:bg-amber-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-amber-500 dark:bg-amber-600/20 dark:text-amber-300 dark:hover:bg-amber-600/30 dark:focus:ring-offset-red-900/20 transition-colors"
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
              onOpenChatbot={handleOpenChatbot}
            />
          );
        }
        return null;
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


  return (
    <div className="min-h-screen font-sans text-slate-800 dark:text-slate-300">
        <header className="bg-white/80 dark:bg-slate-950/80 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 sticky top-0 z-20 transition-colors duration-300">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-3.5 flex items-center justify-between">
            <div className="flex items-center space-x-3 group cursor-pointer" onClick={handleStartNew}>
              <div className="p-2 rounded-xl transition-transform duration-300 group-hover:scale-105">
                <LogoIcon className="w-8 h-8 text-amber-500" />
              </div>
              <h1 className="text-xl sm:text-2xl font-bold font-heading bg-gradient-to-r from-amber-500 to-orange-600 bg-clip-text text-transparent">
                Golden Data Stream
              </h1>
            </div>
             <div className="flex items-center space-x-2 md:space-x-4">
                <button
                  onClick={toggleHistoryPanel}
                  className={`p-2.5 rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-amber-500 dark:focus:ring-offset-slate-950 
                    ${isHistoryPanelOpen 
                        ? 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400' 
                        : 'text-slate-500 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800'}`}
                  aria-label="Toggle history panel"
                >
                  <HistoryIcon className="w-5 h-5" />
                </button>
               <button
                  onClick={toggleTheme}
                  className="p-2.5 rounded-full text-slate-500 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-amber-500 dark:focus:ring-offset-slate-950 transition-colors"
                  aria-label="Toggle theme"
                >
                  {theme === 'light' ? (
                    <MoonIcon className="w-5 h-5" />
                  ) : (
                    <SunIcon className="w-5 h-5 text-amber-400" />
                  )}
                </button>
             </div>
          </div>
        </header>

        <main className="container mx-auto p-4 sm:p-6 lg:p-8 relative">
            <div className="w-full max-w-5xl mx-auto animate-fade-in">
                {renderActiveView()}
            </div>
        </main>

        {/* Hidden Compartment (History Drawer) Overlay */}
        <div className={`fixed inset-0 z-40 transition-opacity duration-300 ${isHistoryPanelOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}>
             {/* Backdrop */}
             <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm transition-opacity duration-300" onClick={closeHistoryPanel} aria-hidden="true" />
             
             {/* Drawer Compartment */}
             <div className={`absolute top-0 left-0 h-full w-full sm:w-[400px] bg-white dark:bg-slate-950 shadow-2xl border-r border-slate-200 dark:border-slate-800 transform transition-transform duration-300 ease-in-out ${isHistoryPanelOpen ? 'translate-x-0' : '-translate-x-full'}`}>
                 <HistoryPanel 
                    history={filteredHistory}
                    onSelectReport={handleSelectReport}
                    onStartNew={handleStartNew}
                    activeReportId={activeReport?.id}
                    onClose={closeHistoryPanel}
                    profiles={profiles}
                    currentProfile={currentProfile}
                    onSwitchProfile={handleSwitchProfile}
                    onCreateProfile={handleCreateProfile}
                 />
             </div>
        </div>

        {isChatbotOpen && activeReport && (
            <Chatbot 
                onClose={() => setIsChatbotOpen(false)}
                messages={chatMessages}
                onSendMessage={handleSendChatMessage}
                onApplyEdit={handleApplyEdit}
                isResponding={isAiResponding}
                startupName={activeReport.startupName}
            />
        )}
      </div>
  );
};

export default App;

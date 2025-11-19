
export interface ResearchInputData {
  startupName: string;
  sector: string;
  targetAudience: string;
  valueProposition: string;
  // Replaced generic question with structured research pillars
  marketDynamics: string; 
  competitiveLandscape: string;
  consumerBehavior: string;
  regulatoryRisks: string;
}

export interface Competitor {
  name: string;
  strengths: string;
  weaknesses: string;
}

export interface MarketAnalysis {
  marketSize: string;
  keyTrends: string[];
  competitorLandscape: Competitor[];
}

export type VisualizationType = 'BAR_CHART' | 'PIE_CHART' | 'NUMBER_CARD' | 'GAUGE_CHART' | 'NONE';

export interface Insight {
  metric: string;
  value: string;
  numericalValue: number;
  commentary: string;
  visualizationType: VisualizationType;
}

export interface Source {
    uri: string;
    title: string;
}

export interface ResearchReport {
  executiveSummary: string;
  marketAnalysis: MarketAnalysis;
  dataInsights: Insight[];
  strategicPerspectives?: string;
  sources?: Source[];
}

export interface UploadedFile {
  name: string;
  content: string; // File content as base64 string
}

export interface HistoryItem {
  id: string;
  startupName: string;
  date: string;
  report: ResearchReport;
  profile: string;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'gemini';
  text: string;
  updatedReport?: ResearchReport; // Used when the AI suggests an edit
}

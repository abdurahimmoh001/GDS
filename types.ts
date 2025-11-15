export interface ResearchInputData {
  startupName: string;
  sector: string;
  objective: string;
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

export interface ResearchReport {
  executiveSummary: string;
  marketAnalysis: MarketAnalysis;
  dataInsights: Insight[];
  strategicPerspectives?: string;
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
}

export interface ChatMessage {
  role: 'user' | 'model';
  content: string;
  sources?: {
    uri: string;
    title: string;
  } [];
}
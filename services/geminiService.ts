

import type {
  ResearchInputData,
  ResearchReport,
  UploadedFile,
} from '../types';

// Gemini API related code has been removed. This service now provides mock data.

const mockReport: ResearchReport = {
  executiveSummary: "This is a mock executive summary for the requested startup. It highlights the potential of its target market. The market shows promising growth, but competition is fierce. *Key takeaway*: strategic partnerships will be crucial for market entry.",
  marketAnalysis: {
    marketSize: "The target market is projected to reach a significant valuation by 2027, with a strong CAGR. Government incentives and increasing consumer adoption are key drivers.",
    keyTrends: [
      "Integration of new technologies.",
      "Development of ultra-fast solutions.",
      "Smart integration with existing systems.",
      "Expansion into new customer segments."
    ],
    competitorLandscape: [
      { name: "Competitor A", strengths: "Vast network and established brand.", weaknesses: "Reliant on third-party partners." },
      { name: "Competitor B", strengths: "Focus on high-speed solutions and key partnerships.", weaknesses: "Smaller market footprint." },
      { name: "Competitor C", strengths: "Significant investment from a parent company and commitment to open standards.", weaknesses: "Network buildout is still in progress." }
    ]
  },
  dataInsights: [
    { metric: "Projected Market Size (2027)", value: "$25B", numericalValue: 25000000000, commentary: "Represents significant growth from the current market valuation.", visualizationType: "NUMBER_CARD" },
    { metric: "Projected CAGR (2023-2027)", value: "30%", numericalValue: 30, commentary: "Indicates a rapidly expanding market.", visualizationType: "GAUGE_CHART" },
    { metric: "Competitor A Market Share", value: "60%", numericalValue: 60, commentary: "Dominant player in the current market.", visualizationType: "PIE_CHART" },
    { metric: "Competitor B Network Size", value: "850+", numericalValue: 850, commentary: "Focus on high-performance infrastructure.", visualizationType: "BAR_CHART" },
    { metric: "Competitor C Network Size", value: "800+", numericalValue: 800, commentary: "Rapidly expanding infrastructure.", visualizationType: "BAR_CHART" },
    { metric: "Technology Integration Cost", value: "15-20%", numericalValue: 17.5, commentary: "New technology has a higher upfront cost but lower operational expenses.", visualizationType: "NONE" }
  ],
  strategicPerspectives: "This is a mock strategic perspective. The startup should focus on underserved niche markets to avoid direct competition with established players. *Key recommendation*: Pursue unique partnerships to create a distinct value proposition for customers."
};


export const generateResearchReport = async (
  formData: ResearchInputData,
  files: UploadedFile[],
  includeStrategicPerspectives: boolean
): Promise < ResearchReport > => {

  console.log("Generating mock report for:", formData.startupName);
  
  // Simulate network delay to show loading screen
  await new Promise(resolve => setTimeout(resolve, 4000));

  // The mock data is static, but we respect the 'includeStrategicPerspectives' flag.
  if (!includeStrategicPerspectives) {
    const { strategicPerspectives, ...reportWithoutPerspectives } = mockReport;
    return reportWithoutPerspectives;
  }
  
  return mockReport;
};

// getChatbotResponse function has been removed as it's a Gemini-powered feature.

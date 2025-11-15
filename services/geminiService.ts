

import {
  GoogleGenAI,
  Type
} from "@google/genai";
import type {
  ResearchInputData,
  ResearchReport,
  UploadedFile,
  ChatMessage
} from '../types';

if (!process.env.API_KEY) {
  throw new Error("API_KEY environment variable not set");
}

const ai = new GoogleGenAI({
  apiKey: process.env.API_KEY
});

const responseSchema = {
  type: Type.OBJECT,
  properties: {
    executiveSummary: {
      type: Type.STRING,
      description: 'A concise, high-level summary of the entire research report. Format this section with clear paragraphs. Use markdown-style bolding with asterisks (*text*) for emphasis on key terms.'
    },
    marketAnalysis: {
      type: Type.OBJECT,
      properties: {
        marketSize: {
          type: Type.STRING,
          description: 'An analysis of the target market size, including figures and growth projections.'
        },
        keyTrends: {
          type: Type.ARRAY,
          items: {
            type: Type.STRING
          },
          description: 'A list of 3-5 key trends driving the market.'
        },
        competitorLandscape: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              name: {
                type: Type.STRING
              },
              strengths: {
                type: Type.STRING
              },
              weaknesses: {
                type: Type.STRING
              },
            },
            required: ['name', 'strengths', 'weaknesses']
          },
          description: 'An analysis of 3-4 key competitors.'
        },
      },
      required: ['marketSize', 'keyTrends', 'competitorLandscape']
    },
    dataInsights: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          metric: {
            type: Type.STRING,
            description: 'The name of the data metric.'
          },
          value: {
            type: Type.STRING,
            description: 'The display-friendly value of the data metric (e.g., "$1.2B", "35%").'
          },
          numericalValue: {
            type: Type.NUMBER,
            description: 'The raw numerical value for charting purposes (e.g., 1200000000 for $1.2B, 35 for 35%). For percentages, use a 0-100 scale.'
          },
          commentary: {
            type: Type.STRING,
            description: 'Brief commentary on the significance of the metric.'
          },
          visualizationType: {
            type: Type.STRING,
            description: "The suggested visualization type. Use 'BAR_CHART' for comparisons, 'PIE_CHART' for parts of a whole, 'GAUGE_CHART' for progress metrics (0-100), and 'NUMBER_CARD' for a single important KPI. Crucially, use 'NONE' if the data point is simple and does not gain significant clarity from a visual chart. Must be one of: 'BAR_CHART', 'PIE_CHART', 'NUMBER_CARD', 'GAUGE_CHART', 'NONE'."
          },
        },
        required: ['metric', 'value', 'numericalValue', 'commentary', 'visualizationType']
      },
      description: 'A list of key data points, statistics, or numbers relevant to the research. Only include insights that have a clear numerical value.'
    },
    strategicPerspectives: {
      type: Type.STRING,
      description: 'The AI\'s own perspective on potential opportunities, risks, and strategic recommendations for the user\'s startup. Format this section with clear paragraphs. Use markdown-style bolding with asterisks (*text*) for emphasis on key recommendations.'
    }
  },
  required: ['executiveSummary', 'marketAnalysis', 'dataInsights']
};

export const generateResearchReport = async (
  formData: ResearchInputData,
  files: UploadedFile[],
  includeStrategicPerspectives: boolean
): Promise < ResearchReport > => {

  const fileContext = files.length > 0 ?
    `The user has uploaded the following documents for context. Analyze them as part of your research:\n` +
    files.map(file => `--- DOCUMENT: ${file.name} ---\n${file.content}\n--- END DOCUMENT ---`).join('\n\n') :
    'No files were uploaded.';

  const strategicPerspectivesTask = includeStrategicPerspectives ?
    `4.  **Strategic Perspectives:** Your own expert opinion on opportunities, risks, and strategic advice for the startup.` :
    '';

  const prompt = `
    SYSTEM INSTRUCTION: You are a world-class Senior Market Research Analyst. Your task is to generate a comprehensive and in-depth desk research report based on user-provided information and your own vast knowledge base. Your analysis must be insightful and highly detailed. Combine the user's data with your own simulated web research to provide a complete, detailed, and actionable report.

    RESEARCH DETAILS:
    - STARTUP NAME: ${formData.startupName}
    - TARGET SECTOR: ${formData.sector}
    - PRIMARY OBJECTIVE: ${formData.objective}

    USER-PROVIDED CONTEXT:
    ${fileContext}

    TASK:
    Generate a complete desk research report. The report must be structured, data-driven, and provide clear, deep analysis. It must include:
    1.  **Executive Summary:** A brief overview of the key findings.
    2.  **Market Analysis:** Detailed analysis of the market size, key trends, and a competitor landscape.
    3.  **Data Insights:** A collection of key numerical data points, metrics, and statistics. For each insight, provide a raw numerical value for charting. You must also suggest the best \`visualizationType\`. Only suggest a chart-based visualization ('BAR_CHART', 'PIE_CHART', 'GAUGE_CHART') if it provides significant clarity or comparative insight that is not obvious from the number alone. For standalone KPIs, use 'NUMBER_CARD'. If a numerical insight is straightforward and does not benefit from a visual representation (e.g., a simple statistic like 'Number of Employees'), use 'NONE'.
    ${strategicPerspectivesTask}

    Ensure all text-based sections (like summaries and perspectives) are well-written and formatted for a professional presentation with clear paragraphs.

    Return the output as a single JSON object adhering to the provided schema. Do not include any markdown formatting in the JSON output.
  `;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: responseSchema,
        temperature: 0.5,
      },
    });

    const jsonText = response.text.trim();
    const parsedData = JSON.parse(jsonText);

    return parsedData as ResearchReport;
  } catch (error) {
    console.error("Error calling Gemini API:", error);
    if (error instanceof Error && error.message.includes('JSON')) {
      throw new Error("The API returned an invalid JSON format. Please try again.");
    }
    throw new Error("Failed to generate report from the API.");
  }
};

export const getChatbotResponse = async (message: string): Promise<ChatMessage> => {
  const prompt = `
    You are GDS Assistant, a helpful AI specializing in desk research, market analysis, and competitive intelligence for Golden Data Stream. 
    Answer the user's question concisely and professionally. Use the available tools to find up-to-date information if needed.
    User question: "${message}"
  `;
  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
        tools: [{googleSearch: {}}],
        temperature: 0.3,
      },
    });
    
    const text = response.text;
    const groundingMetadata = response.candidates?.[0]?.groundingMetadata;
    
    let sources: { uri: string; title: string; }[] = [];
    if (groundingMetadata?.groundingChunks) {
       sources = groundingMetadata.groundingChunks
        .filter((chunk: any) => chunk.web && chunk.web.uri)
        .map((chunk: any) => ({
          uri: chunk.web.uri,
          title: chunk.web.title || chunk.web.uri,
        }))
        // Remove duplicate sources
        .filter((source, index, self) => 
            index === self.findIndex((s) => s.uri === source.uri)
        );
    }
    
    return {
      role: 'model',
      content: text,
      sources: sources.length > 0 ? sources : undefined,
    };
    
  } catch (error) {
    console.error("Error calling Gemini API for chatbot:", error);
    return {
        role: 'model',
        content: "I'm sorry, but I encountered an error while trying to get a response. Please try again."
    }
  }
};

import { GoogleGenAI, Chat } from "@google/genai";
import type {
  ResearchInputData,
  ResearchReport,
  UploadedFile,
  Source,
} from '../types';


const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
let chat: Chat | null = null;

const extractFirstJsonBlock = (text: string): string => {
  let depth = 0;
  let start = -1;
  let inString = false;
  let escape = false;

  for (let i = 0; i < text.length; i++) {
    const char = text[i];
    
    if (escape) {
      escape = false;
      continue;
    }
    
    if (char === '\\') {
      escape = true;
      continue;
    }
    
    if (char === '"') {
      inString = !inString;
      continue;
    }
    
    if (!inString) {
      if (char === '{') {
        if (depth === 0) start = i;
        depth++;
      } else if (char === '}') {
        depth--;
        if (depth === 0 && start !== -1) {
          return text.substring(start, i + 1);
        }
      }
    }
  }
  
  // Fallback: if precise extraction fails, try finding the first '{' and last '}'
  const simpleStart = text.indexOf('{');
  const simpleEnd = text.lastIndexOf('}');
  if (simpleStart !== -1 && simpleEnd !== -1) {
      return text.substring(simpleStart, simpleEnd + 1);
  }
  
  return text;
};

export const generateResearchReport = async (
  formData: ResearchInputData,
  files: UploadedFile[],
  includeStrategicPerspectives: boolean
): Promise < ResearchReport > => {

  const model = 'gemini-2.5-flash';
  
  const jsonSchema = `{
    "executiveSummary": "string (A concise summary of the key findings. Use markdown for bolding with asterisks, e.g., *Key takeaway*.)",
    "marketAnalysis": {
      "marketSize": "string (e.g., '$XX Billion by 20XX')",
      "keyTrends": ["string"],
      "competitorLandscape": [{ "name": "string", "strengths": "string", "weaknesses": "string" }]
    },
    "dataInsights": [{
      "metric": "string",
      "value": "string (e.g., '$25B', '30%')",
      "numericalValue": "number",
      "commentary": "string",
      "visualizationType": "string ('BAR_CHART' | 'PIE_CHART' | 'NUMBER_CARD' | 'GAUGE_CHART' | 'NONE')"
    }]
    ${includeStrategicPerspectives ? ',"strategicPerspectives": "string (Use markdown. CRITICAL: You MUST escape all internal double quotes, e.g., \\"text\\".)"' : ''}
  }`;

  const prompt = `
    You are a high-level Market Research Analyst specializing in academic and technical due diligence. 
    Analyze the provided information for the startup "${formData.startupName}" and generate a comprehensive market research report.

    **Startup Profile:**
    - **Name:** ${formData.startupName}
    - **Sector:** ${formData.sector}
    - **Target Audience:** ${formData.targetAudience}
    - **Unique Value Proposition:** ${formData.valueProposition}

    **Required Research Scope & Parameters (User Defined):**
    1. **Market Dynamics:** ${formData.marketDynamics}
    2. **Competitive Landscape:** ${formData.competitiveLandscape}
    3. **Consumer Behavior:** ${formData.consumerBehavior}
    4. **Regulatory & Risks:** ${formData.regulatoryRisks}

    ${files.length > 0 ? `
    **Provided Documents Content:**
    ${files.map(f => `--- Document: ${f.name} ---\n${f.content}`).join('\n\n')}
    ` : ''}

    **Research Methodology Instructions:**
    1.  **Google Scholar / Academic Source Prioritization**: You MUST prioritize data sources that are academic in nature. When using the search tool, formulate queries to find PDF reports, academic journals (e.g., from Google Scholar indexing), whitepapers, and technical studies. Avoid generic SEO-spam blogs.
    2.  **Multilingual Document Analysis**: If any of the provided documents are in a language other than English, translate their key content into English for the purpose of this analysis.
    3.  **Evidence-Based Analysis**: Conduct a thorough market analysis using up-to-date information from the web. Every claim about market size or growth must be backed by a search result.
    4.  **Competitor Deep Dive**: Identify key competitors based on the user's input and your own search.
    5.  **Data Extraction**: Extract key data points and metrics, providing commentary on each. For each data insight, suggest a suitable visualization type.
    6.  **Address the Specific Research Scope**: Ensure the analysis directly answers the 4 specific parameters defined above.
    ${includeStrategicPerspectives ? '7.  Provide AI-driven strategic perspectives, including opportunities and potential risks, specifically considering the unique value proposition and target audience provided.' : ''}
    8.  **CRITICAL JSON FORMATTING RULES**: 
        - Return **ONLY** a single, valid JSON object. 
        - Do not include markdown code fences (e.g., \`\`\`json) or any introductory text.
        - **ESCAPE QUOTES**: You MUST escape all double quotes that appear inside string values (e.g., "He said \\"Hello\\""). This is the most common error, be meticulous.
        - **NO LITERAL NEWLINES**: Do not use literal line breaks inside strings. Use \\n instead.

    **JSON Schema:**
    The JSON object must strictly adhere to the following structure:
    ${jsonSchema}
  `;

  let reportJsonText = '';
  try {
    const response = await ai.models.generateContent({
        model: model,
        contents: prompt,
        config: {
            tools: [{googleSearch: {}}],
            systemInstruction: "You are a meticulous academic researcher. You prioritize peer-reviewed journals, Google Scholar results, and reputable industry whitepapers over general news sites. Your tone is professional, objective, and data-driven. You always output valid, strictly formatted JSON."
        },
    });

    const text = response.text;
    if (!text) throw new Error("No response text received from AI.");
    const rawResponseText = text.trim();
    
    // Use robust extraction to handle multiple JSON blocks or Markdown fences
    reportJsonText = extractFirstJsonBlock(rawResponseText);
    
    const report: ResearchReport = JSON.parse(reportJsonText);

    const groundingChunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks;
    if (groundingChunks) {
        const sources: Source[] = groundingChunks
            .map((chunk: any) => ({
                uri: chunk.web?.uri,
                title: chunk.web?.title,
            }))
            .filter((source: Source) => source.uri && source.title);

        // Deduplicate sources based on URI
        const uniqueSources = Array.from(new Map(sources.map(item => [item.uri, item])).values());
        report.sources = uniqueSources;
    }
    
    return report;

  } catch (error) {
    console.error("Error generating report with Gemini:", error);
    if (error instanceof SyntaxError) {
        console.error("Invalid JSON received from Gemini:", reportJsonText);
        throw new Error("Failed to parse the report generated by the AI. The format was invalid (likely due to unescaped quotes). Please try again.");
    }
    throw new Error("An unexpected error occurred while communicating with the AI model.");
  }
};


export const startChat = (report: ResearchReport): void => {
  const systemInstruction = `You are an expert research analyst assistant. You are helping a user analyze and edit a market research report. The full report is provided below as a JSON object.

  Your tasks are:
  1. Answer any questions the user has about the report with conversational text.
  2. When the user asks you to make an edit (e.g., "rewrite", "add", "change", "update"), you MUST respond with ONLY the complete, updated, and valid JSON object of the entire report. 
  
  CRITICAL JSON RULES:
  - All property names (keys) in the JSON must be enclosed in double quotes.
  - **Escape all double quotes** inside string values (e.g. "Term: \\"Value\\"").
  - Do not include any other text, explanation, or markdown code fences. 
  - The JSON you provide will directly replace the existing report.

  Here is the current report:
  ${JSON.stringify(report, null, 2)}
  `;

  chat = ai.chats.create({
    model: 'gemini-2.5-flash',
    config: { systemInstruction },
  });
};

export const sendChatMessage = async (message: string): Promise<string> => {
  if (!chat) {
    throw new Error("Chat not initialized. Call startChat first.");
  }
  const response = await chat.sendMessage({ message });
  return response.text;
};

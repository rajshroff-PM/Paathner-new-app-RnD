import { GoogleGenAI, Chat, FunctionDeclaration, Type, Schema } from "@google/genai";
import { MALL_STORES } from '../constants';
import { ChatSource, Store } from '../types';

// Initialize Gemini AI
// Note: API Key must be in process.env.API_KEY
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const findStoreTool: FunctionDeclaration = {
  name: "findStore",
  description: "Find a store in the mall database by name, category, or for checking offers. Use this to get details for navigation or offers.",
  parameters: {
    type: Type.OBJECT,
    properties: {
      query: {
        type: Type.STRING,
        description: "The name of the store, category, or product to search for."
      }
    },
    required: ["query"]
  }
};

const SYSTEM_INSTRUCTION = `
You are a helpful shopping assistant for Amanora Mall.
You have access to a tool 'findStore' which searches the internal mall database.

ALWAYS use 'findStore' when the user asks for:
- A specific store (e.g. "Where is Nike?", "Navigate to Starbucks")
- A category (e.g. "Find me shoe shops", "Places to eat")
- Offers, sales, or deals (e.g. "Any offers today?", "Who has discounts?")
- Navigation or location instructions.

If the user asks for "offers", search for keywords like "offer", "sale", or generic categories to find stores with active offers.
If the tool returns store details, use them to answer. 
The UI will automatically show a "Navigate" button and store image if you successfully use the tool to find a store, so you can mention "I've pulled up the location for you".

If you use Google Search (Grounding) for reviews or external info, you can still use 'findStore' to locate the place in the mall.
Keep responses concise, friendly, and helpful.
`;

let chatSession: Chat | null = null;

export const getChatSession = (): Chat => {
  if (!chatSession) {
    chatSession = ai.chats.create({
      model: 'gemini-2.5-flash',
      config: {
        systemInstruction: SYSTEM_INSTRUCTION,
        tools: [
          { googleSearch: {} },
          { functionDeclarations: [findStoreTool] }
        ],
      },
    });
  }
  return chatSession;
};

interface GeminiResponse {
  text: string;
  sources: ChatSource[];
  relatedStore?: Store;
}

export const sendMessageToGemini = async (message: string): Promise<GeminiResponse> => {
  try {
    const session = getChatSession();
    
    // First message send
    let response = await session.sendMessage({ message });
    let relatedStore: Store | undefined;

    // Handle Tool Calls (Function Calling)
    while (response.functionCalls && response.functionCalls.length > 0) {
      const call = response.functionCalls[0]; // Handle first call
      
      if (call.name === 'findStore') {
        const query = (call.args as any).query?.toLowerCase() || '';
        
        // Local Search Logic
        const matches = MALL_STORES.filter(s => 
          s.name.toLowerCase().includes(query) || 
          s.category.toLowerCase().includes(query) ||
          (s.offer && (query.includes('offer') || query.includes('sale') || query.includes('deal')))
        );

        // Pick the best match to show in UI (usually the first one)
        if (matches.length > 0) {
           relatedStore = matches[0];
        }

        // Prepare response for the model
        const functionResponse = {
          name: 'findStore',
          id: call.id, // Important: Pass back the call ID
          response: { 
            result: matches.length > 0 
              ? matches.slice(0, 3).map(s => ({
                  name: s.name,
                  floor: s.floor,
                  hours: s.hours,
                  offer: s.offer || "No current offer",
                  category: s.category
                }))
              : "No stores found matching that query."
          }
        };

        // Send tool response back to model to get final text
        response = await session.sendMessage({
           message: [{ functionResponse: functionResponse }]
        });
      } else {
        break; // Unknown tool
      }
    }
    
    const text = response.text || "I'm sorry, I couldn't process that request.";
    
    // Extract Grounding Metadata (Sources)
    const sources: ChatSource[] = [];
    const chunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks;
    
    if (chunks) {
      chunks.forEach((chunk: any) => {
        if (chunk.web) {
          sources.push({
            title: chunk.web.title,
            uri: chunk.web.uri
          });
        }
      });
    }

    return { text, sources, relatedStore };
  } catch (error) {
    console.error("Gemini API Error:", error);
    return { 
      text: "I'm having trouble connecting to the mall network right now. Please try again later.", 
      sources: [] 
    };
  }
};

// --- New AI Features ---

/**
 * Analyzes an image to find relevant products or store categories.
 */
export const searchWithImage = async (base64Image: string): Promise<string> => {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: {
        parts: [
          { inlineData: { mimeType: 'image/jpeg', data: base64Image.split(',')[1] } },
          { text: "Analyze this image and identify the main product, item, or style (e.g., 'Red Sneakers', 'Denim Jacket', 'Pizza', 'Smart Watch'). Return ONLY the most relevant 2-3 keywords that I can use to search in a mall directory." }
        ]
      }
    });
    return response.text?.trim() || "Item";
  } catch (error) {
    console.error("Visual Search Error:", error);
    return "";
  }
};

/**
 * Generates a trip itinerary based on user intent.
 */
export const getAiItinerary = async (prompt: string): Promise<string[]> => {
  try {
    const simpleStoreList = MALL_STORES.map(s => ({ id: s.id, name: s.name, category: s.category, description: s.description }));
    
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: `You are a mall trip planner. 
      User Request: "${prompt}"
      Available Stores: ${JSON.stringify(simpleStoreList)}
      
      Select the best 3-5 stores from the list that match the user's request.
      Return a JSON object with a property "storeIds" which is an array of strings (the store IDs).
      Example: { "storeIds": ["1", "5"] }`,
      config: {
        responseMimeType: 'application/json'
      }
    });

    const jsonText = response.text || "{}";
    const data = JSON.parse(jsonText);
    return data.storeIds || [];
  } catch (error) {
    console.error("AI Planner Error:", error);
    return [];
  }
};

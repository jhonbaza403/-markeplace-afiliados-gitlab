import { GoogleGenerativeAI } from '@google/generative-ai';

// Asegúrate de que la variable de entorno GEMINI_API_KEY esté definida en tu .env.local
const apiKey = process.env.GEMINI_API_KEY || '';
const genAI = new GoogleGenerativeAI(apiKey);

export async function askGeminiAssistant(prompt: string, context?: string) {
  try {
    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
    
    // Si se provee contexto (ej. detalles de un producto), se añade al prompt
    const fullPrompt = context
      ? `Contexto del producto/usuario: ${context}\n\nConsulta: ${prompt}`
      : prompt;

    const result = await model.generateContent(fullPrompt);
    const response = await result.response;
    return response.text();
  } catch (error) {
    console.error('Error al consultar Gemini AI:', error);
    throw new Error('No se pudo procesar la consulta con la IA.');
  }
}
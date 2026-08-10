import { GoogleGenerativeAI } from '@google/generative-ai';

export async function askGeminiAssistant(prompt: string, context?: string): Promise<string> {
  const apiKey = process.env.GEMINI_API_KEY;

  if (!apiKey) {
    throw new Error('La variable de entorno GEMINI_API_KEY no está configurada.');
  }

  if (!prompt || typeof prompt !== 'string') {
    throw new Error('El prompt proporcionado no es válido.');
  }

  try {
    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

    const fullPrompt = context
      ? `Contexto del producto/usuario: ${context}\n\nConsulta: ${prompt}`
      : prompt;

    const result = await model.generateContent(fullPrompt);
    const response = await result.response;
    const text = response.text();

    if (!text) {
      throw new Error('La IA no devolvió ninguna respuesta.');
    }

    return text;
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Error desconocido';
    console.error('Error al consultar Gemini AI:', errorMessage);
    throw new Error(`No se pudo procesar la consulta con la IA: ${errorMessage}`);
  }
}
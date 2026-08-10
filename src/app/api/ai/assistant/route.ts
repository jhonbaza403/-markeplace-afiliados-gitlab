import { NextResponse } from 'next/server';
import { askGeminiAssistant } from '@/features/ai/gemini';

export const runtime = 'edge';

export async function POST(request: Request) {
  try {
    const body = await request.json().catch(() => ({}));
    const { prompt, context } = body;

    if (!prompt || typeof prompt !== 'string') {
      return NextResponse.json(
        { error: 'El prompt es obligatorio y debe ser un texto válido.' },
        { status: 400 }
      );
    }

    const reply = await askGeminiAssistant(prompt, context);
    
    return NextResponse.json({ reply }, { status: 200 });
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Error interno del servidor';
    
    return NextResponse.json(
      { error: errorMessage },
      { status: 500 }
    );
  }
}
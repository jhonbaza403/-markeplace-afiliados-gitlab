import { NextResponse } from 'next/server';
import { askGeminiAssistant } from '@/features/ai/gemini';

export async function POST(request: Request) {
  try {
    const { prompt, context } = await request.json();

    if (!prompt) {
      return NextResponse.json(
        { error: 'El prompt es obligatorio' },
        { status: 400 }
      );
    }

    const reply = await askGeminiAssistant(prompt, context);
    return NextResponse.json({ reply });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'Error interno del servidor' },
      { status: 500 }
    );
  }
}
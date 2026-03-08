import { openai, MESSAGE_LIMITS } from '@/lib/openai';
import { supabase } from '@/lib/supabase';
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const { message } = await request.json();

    // Verificar autenticación
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Obtener suscripción
    const { data: sub } = await supabase
      .from('subscriptions')
      .select('status')
      .eq('user_id', user.id)
      .single();

    const status = sub?.status || 'free';
    const dailyLimit = MESSAGE_LIMITS[status as keyof typeof MESSAGE_LIMITS] || 0;

    // Verificar límite diario
    const today = new Date().toISOString().split('T')[0];
    const { count } = await supabase
      .from('chat_messages')
      .select('*', { count: 'exact' })
      .eq('user_id', user.id)
      .eq('role', 'user')
      .gte('created_at', today);

    if ((count || 0) >= dailyLimit) {
      return NextResponse.json(
        { error: 'Daily limit reached', upgrade: status === 'trial' },
        { status: 429 }
      );
    }

    // Guardar mensaje del usuario
    await supabase.from('chat_messages').insert({
      user_id: user.id,
      role: 'user',
      content: message,
    });

    // Llamar a OpenAI
    const completion = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo', // Más barato que GPT-4
      messages: [
        {
          role: 'system',
          content: `Eres un asistente bíblico experto, compasivo y basado en la Reina Valera 1960. 
          Proporciona respuestas concisas (máximo 3 párrafos) con citas bíblicas relevantes.
          Tono: cálido, nunca condenatorio. Si no conoces algo, admítelo honestamente.`,
        },
        { role: 'user', content: message },
      ],
      max_tokens: 500,
      temperature: 0.7,
    });

    const reply = completion.choices[0].message.content!;

    // Guardar respuesta
    await supabase.from('chat_messages').insert({
      user_id: user.id,
      role: 'assistant',
      content: reply,
    });

    return NextResponse.json({ reply });
  } catch (error: any) {
    console.error('Chat error:', error);
    return NextResponse.json({ error: 'Failed to generate response' }, { status: 500 });
  }
}
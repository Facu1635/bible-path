import { openai, MESSAGE_LIMITS } from '@/lib/openai';
import { supabase } from '@/lib/supabase';
import { NextResponse } from 'next/server';

export async function POST(request) {
  try {
    const { message } = await request.json();

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { data: sub } = await supabase
      .from('subscriptions')
      .select('status')
      .eq('user_id', user.id)
      .single();

    const status = sub?.status || 'free';
    const dailyLimit = MESSAGE_LIMITS[status] || 0;

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

    await supabase.from('chat_messages').insert({
      user_id: user.id,
      role: 'user',
      content: message,
    });

    const completion = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [
        {
          role: 'system',
          content: 'Eres un asistente biblico experto, compasivo y basado en la Reina Valera 1960. Proporciona respuestas concisas con citas biblicas relevantes.',
        },
        { role: 'user', content: message },
      ],
      max_tokens: 500,
      temperature: 0.7,
    });

    const reply = completion.choices[0].message.content;

    await supabase.from('chat_messages').insert({
      user_id: user.id,
      role: 'assistant',
      content: reply,
    });

    return NextResponse.json({ reply });
  } catch (error) {
    console.error('Chat error:', error);
    return NextResponse.json({ error: 'Failed to generate response' }, { status: 500 });
  }
}
'use client';

import { useState, useEffect, useRef } from 'react';
import ProtectedRoute from '@/components/ProtectedRoute';
import { useSubscription } from '@/hooks/useSubscription';
import { supabase } from '@/lib/supabase';

interface Message {
  role: 'user' | 'assistant';
  content: string;
  id?: string;
}

export default function Chat() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [dailyCount, setDailyCount] = useState(0);
  const { status } = useSubscription();
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const limit = status === 'active' ? 50 : 5;

  useEffect(() => {
    loadMessages();
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const loadMessages = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const today = new Date().toISOString().split('T')[0];
    
    // Cargar historial
    const { data } = await supabase
      .from('chat_messages')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: true })
      .limit(50);

    if (data) {
      setMessages(data.map(m => ({ role: m.role, content: m.content })));
    }

    // Contar de hoy
    const { count } = await supabase
      .from('chat_messages')
      .select('*', { count: 'exact' })
      .eq('user_id', user.id)
      .eq('role', 'user')
      .gte('created_at', today);

    setDailyCount(count || 0);
  };

  const sendMessage = async () => {
    if (!input.trim() || loading) return;
    if (dailyCount >= limit) {
      alert('Has alcanzado tu límite diario. Suscríbete para mensajes ilimitados.');
      return;
    }

    const userMessage = input.trim();
    setInput('');
    setMessages(prev => [...prev, { role: 'user', content: userMessage }]);
    setLoading(true);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: userMessage }),
      });

      const data = await response.json();

      if (data.error) {
        alert(data.error);
      } else {
        setMessages(prev => [...prev, { role: 'assistant', content: data.reply }]);
        setDailyCount(prev => prev + 1);
      }
    } catch (error) {
      alert('Error al enviar mensaje');
    } finally {
      setLoading(false);
    }
  };

  const quickQuestions = [
    '¿Cómo manejar la ansiedad?',
    'Versículos sobre esperanza',
    'Estudio sobre el perdón',
    'Guía para orar',
  ];

  return (
    <ProtectedRoute>
      <div className="flex flex-col h-screen max-w-md mx-auto bg-gray-50 dark:bg-gray-900">
        {/* Header */}
        <div className="bg-white dark:bg-gray-800 p-4 border-b flex items-center justify-between">
          <div>
            <h1 className="font-bold">Asistente Bíblico</h1>
            <p className="text-xs text-gray-500">
              {dailyCount}/{limit} mensajes hoy • {status === 'trial' ? 'Trial' : 'Premium'}
            </p>
          </div>
          <div className="w-10 h-10 bg-purple-100 dark:bg-purple-900/30 rounded-full flex items-center justify-center">
            🤖
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              <p className="mb-4">¿Sobre qué tema te gustaría estudiar hoy?</p>
              <div className="flex flex-wrap gap-2 justify-center">
                {quickQuestions.map((q, i) => (
                  <button
                    key={i}
                    onClick={() => { setInput(q); }}
                    className="px-3 py-1 bg-white dark:bg-gray-800 rounded-full text-xs border hover:border-purple-500 transition-colors"
                  >
                    {q}
                  </button>
                ))}
              </div>
            </div>
          )}

          {messages.map((m, i) => (
            <div
              key={i}
              className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-[80%] p-3 rounded-2xl ${
                  m.role === 'user'
                    ? 'bg-purple-600 text-white rounded-br-none'
                    : 'bg-white dark:bg-gray-800 rounded-bl-none shadow-sm'
                }`}
              >
                <p className="text-sm leading-relaxed">{m.content}</p>
              </div>
            </div>
          ))}
          
          {loading && (
            <div className="flex justify-start">
              <div className="bg-white dark:bg-gray-800 p-3 rounded-2xl rounded-bl-none shadow-sm">
                <div className="flex gap-1">
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                </div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input */}
        <div className="p-4 bg-white dark:bg-gray-800 border-t">
          {dailyCount >= limit ? (
            <div className="text-center py-2">
              <p className="text-sm text-gray-500 mb-2">Límite alcanzado</p>
              <a href="/subscribe" className="text-purple-600 font-medium text-sm">
                Actualizar a Premium →
              </a>
            </div>
          ) : (
            <div className="flex gap-2">
              <input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
                placeholder="Escribe tu pregunta..."
                className="flex-1 p-3 bg-gray-100 dark:bg-gray-700 rounded-xl border-0 focus:ring-2 focus:ring-purple-500"
              />
              <button
                onClick={sendMessage}
                disabled={loading || !input.trim()}
                className="px-4 bg-purple-600 text-white rounded-xl disabled:opacity-50"
              >
                {loading ? '...' : '→'}
              </button>
            </div>
          )}
        </div>
      </div>
    </ProtectedRoute>
  );
}
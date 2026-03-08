'use client';

import { useState } from 'react';
import { supabase } from '@/lib/supabase';
import { useRouter } from 'next/navigation';

export default function Subscribe() {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubscribe = async () => {
    setLoading(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        router.push('/login');
        return;
      }

      const response = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: user.id }),
      });

      const data = await response.json();
      
      if (data.error) throw new Error(data.error);
      
      window.location.href = data.url;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error desconocido';
      alert('Error: ' + errorMessage);
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen p-6 flex items-center justify-center bg-gray-50 dark:bg-gray-900">
      <div className="bg-white dark:bg-gray-800 rounded-3xl p-8 shadow-2xl max-w-md w-full">
        <div className="text-center mb-8">
          <div className="w-20 h-20 mx-auto mb-4 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center text-3xl">
            👑
          </div>
          <h2 className="text-3xl font-bold mb-2">Bible Path Premium</h2>
          <p className="text-gray-600 dark:text-gray-400">Desbloquea todo el potencial</p>
        </div>

        <div className="text-center mb-8">
          <div className="flex items-baseline justify-center gap-1">
            <span className="text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-pink-600">
              $7.90
            </span>
            <span className="text-gray-500">/mes</span>
          </div>
          <p className="text-sm text-gray-500 mt-2">Menos de un café por semana</p>
        </div>

        <ul className="space-y-3 mb-8">
          {[
            '✨ IA ilimitada para estudios profundos',
            '📚 Todos los planes de lectura avanzados',
            '🎧 Audio Biblia offline',
            '🚫 Sin publicidad',
            '💬 Soporte prioritario',
          ].map((feature, i) => (
            <li key={i} className="flex items-center gap-2 text-sm">
              <span className="text-green-500">✓</span>
              <span>{feature.replace(/[✨📚🎧🚫💬]/g, '')}</span>
            </li>
          ))}
        </ul>

        <button
          onClick={handleSubscribe}
          disabled={loading}
          className="w-full py-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-2xl font-bold text-lg shadow-xl hover:shadow-2xl hover:scale-[1.02] transition-all flex items-center justify-center gap-2 disabled:opacity-50"
        >
          {loading ? (
            <>
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
              Cargando...
            </>
          ) : (
            <>
              <span>Suscribirse Ahora</span>
              <span>→</span>
            </>
          )}
        </button>

        <div className="flex items-center justify-center gap-4 mt-6 text-2xl text-gray-400">
          <span>💳</span>
          <span>🔒</span>
          <span>✓</span>
        </div>

        <p className="text-center text-xs text-gray-500 mt-4">
          Cancela cuando quieras • 7 días de garantía • Pago seguro con Stripe
        </p>
      </div>
    </div>
  );
}
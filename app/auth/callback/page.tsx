'use client';

import { useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { useRouter } from 'next/navigation';

export default function AuthCallback() {
  const router = useRouter();

  useEffect(() => {
    const handleAuth = async () => {
      try {
        // Obtener sesión actual
        const { data: { user }, error: userError } = await supabase.auth.getUser();
        
        if (userError || !user) {
          router.push('/login');
          return;
        }

        // Verificar si ya tiene suscripción
        const { data: existingSub } = await supabase
          .from('subscriptions')
          .select('*')
          .eq('user_id', user.id)
          .single();

        // Si no tiene, crear trial de 7 días
        if (!existingSub) {
          const trialEnds = new Date();
          trialEnds.setDate(trialEnds.getDate() + 7);

          await supabase.from('subscriptions').insert({
            user_id: user.id,
            status: 'trial',
            trial_ends_at: trialEnds.toISOString(),
          });
        }

        // Redirigir al home
        router.push('/');
        router.refresh();
      } catch (error) {
        console.error('Error en callback:', error);
        router.push('/login');
      }
    };

    handleAuth();
  }, [router]);

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"></div>
        <p className="text-gray-600">Preparando tu cuenta...</p>
      </div>
    </div>
  );
}
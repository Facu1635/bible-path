'use client';

import { useSubscription } from '@/hooks/useSubscription';
import Link from 'next/link';

export default function TrialBanner() {
  const { status, daysLeft } = useSubscription();

  if (status === 'loading') return null;

  if (status === 'trial') {
    return (
      <div className="bg-gradient-to-r from-green-500 to-emerald-600 text-white text-center py-3 px-4 text-sm font-medium">
        <div className="flex items-center justify-center gap-2">
          <span>🎁</span>
          <span>Trial gratuito: {daysLeft} {daysLeft === 1 ? 'día' : 'días'} restantes</span>
          <Link href="/subscribe" className="underline hover:text-green-100 ml-2">
            Suscribirse ahora
          </Link>
        </div>
      </div>
    );
  }

  if (status === 'expired' || status === 'free') {
    return (
      <div className="bg-gradient-to-r from-red-500 to-pink-600 text-white text-center py-3 px-4 text-sm font-medium">
        <div className="flex items-center justify-center gap-2">
          <span>⏰</span>
          <span>Trial finalizado</span>
          <Link href="/subscribe" className="underline hover:text-red-100 ml-2 font-bold">
            Activar Premium $7.90/mes →
          </Link>
        </div>
      </div>
    );
  }

  if (status === 'active') {
    return (
      <div className="bg-gradient-to-r from-purple-500 to-indigo-600 text-white text-center py-2 px-4 text-xs font-medium">
        <span>✅ Suscripción activa</span>
      </div>
    );
  }

  return null;
}
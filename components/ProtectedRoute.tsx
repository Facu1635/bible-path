'use client';

import { useSubscription } from '@/hooks/useSubscription';
import Link from 'next/link';

interface ProtectedRouteProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

export default function ProtectedRoute({ children, fallback }: ProtectedRouteProps) {
  const { status } = useSubscription();

  if (status === 'loading') {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
      </div>
    );
  }

  if (status === 'trial' || status === 'active') {
    return <>{children}</>;
  }

  // Usuario sin acceso
  if (fallback) return <>{fallback}</>;

  return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-gray-50 dark:bg-gray-900">
      <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-lg max-w-md w-full text-center">
        <div className="w-16 h-16 mx-auto mb-4 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center">
          <span className="text-2xl">🔒</span>
        </div>
        <h2 className="text-2xl font-bold mb-2">Acceso Premium</h2>
        <p className="text-gray-600 dark:text-gray-400 mb-6">
          Tu trial ha finalizado o necesitas una suscripción para acceder a esta función.
        </p>
        <Link
          href="/subscribe"
          className="block w-full py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl font-bold hover:shadow-lg transition-shadow"
        >
          Suscribirse $7.90/mes
        </Link>
        <p className="text-xs text-gray-500 mt-4">
          Cancela cuando quieras • 7 días de garantía
        </p>
      </div>
    </div>
  );
}
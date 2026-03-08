'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function Success() {
  const router = useRouter();

  useEffect(() => {
    // Redirigir al home después de 3 segundos
    const timer = setTimeout(() => {
      router.push('/');
    }, 3000);
    return () => clearTimeout(timer);
  }, [router]);

  return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-gray-50 dark:bg-gray-900">
      <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-lg max-w-md w-full text-center">
        <div className="w-20 h-20 mx-auto mb-6 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center text-4xl">
          🎉
        </div>
        
        <h1 className="text-2xl font-bold mb-2 text-green-600">¡Bienvenido a Premium!</h1>
        <p className="text-gray-600 dark:text-gray-400 mb-6">
          Tu suscripción ha sido activada exitosamente. Ahora tienes acceso ilimitado.
        </p>

        <div className="bg-green-50 dark:bg-green-900/20 rounded-xl p-4 mb-6">
          <p className="text-sm text-green-800 dark:text-green-300">
            ✓ IA ilimitada activada<br/>
            ✓ Todos los planes desbloqueados<br/>
            ✓ Audio offline disponible
          </p>
        </div>

        <Link
          href="/"
          className="block w-full py-3 bg-purple-600 text-white rounded-xl font-medium hover:bg-purple-700"
        >
          Comenzar a usar →
        </Link>

        <p className="text-xs text-gray-500 mt-4">
          Redirigiendo automáticamente...
        </p>
      </div>
    </div>
  );
}
'use client';

import Link from 'next/link';
import { useSubscription } from '@/hooks/useSubscription';
import { useAuth } from '@/hooks/useAuth';

export default function Home() {
  const { status, daysLeft } = useSubscription();
  const { user, signOut } = useAuth();

  return (
    <div className="min-h-screen p-6 max-w-md mx-auto">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-2xl font-bold">Bible Path</h1>
          <p className="text-sm text-gray-500">Tu camino espiritual</p>
        </div>
        {user && (
          <button 
            onClick={signOut}
            className="text-sm text-gray-500 hover:text-gray-700"
          >
            Salir
          </button>
        )}
      </div>

      {!user ? (
        // Usuario no logueado
        <div className="text-center py-12">
          <div className="w-20 h-20 mx-auto mb-6 bg-gradient-to-br from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center text-3xl">
            ✝️
          </div>
          <h2 className="text-xl font-bold mb-2">Bienvenido a Bible Path</h2>
          <p className="text-gray-600 mb-6">7 días de prueba gratuita. Sin tarjeta.</p>
          <Link
            href="/login"
            className="block w-full py-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-2xl font-bold text-lg hover:shadow-lg transition-shadow"
          >
            Comenzar Ahora
          </Link>
        </div>
      ) : (
        // Usuario logueado
        <div className="space-y-4">
          {/* Status Card */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg border-2 border-purple-500/20">
            <div className="flex items-center justify-between mb-4">
              <div>
                <p className="text-sm text-gray-500">Tu estado</p>
                <h3 className="text-xl font-bold capitalize">
                  {status === 'trial' && `Trial: ${daysLeft} días`}
                  {status === 'active' && 'Premium Activo'}
                  {status === 'expired' && 'Trial Finalizado'}
                  {status === 'free' && 'Cuenta Gratuita'}
                </h3>
              </div>
              <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900/30 rounded-full flex items-center justify-center text-2xl">
                {status === 'active' ? '✅' : status === 'trial' ? '🎁' : '🔒'}
              </div>
            </div>
            
            {(status === 'trial' || status === 'expired') && (
              <Link
                href="/subscribe"
                className="block w-full py-3 bg-purple-600 text-white rounded-xl text-center font-medium hover:bg-purple-700"
              >
                {status === 'trial' ? 'Activar Suscripción Anticipada' : 'Suscribirse Ahora'}
              </Link>
            )}
          </div>

          {/* Quick Actions */}
          <div className="grid grid-cols-2 gap-4">
            <Link
              href="/chat"
              className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg hover:shadow-xl transition-shadow text-center"
            >
              <div className="text-3xl mb-2">🤖</div>
              <h3 className="font-semibold">Asistente IA</h3>
              <p className="text-xs text-gray-500 mt-1">
                {status === 'active' ? 'Ilimitado' : status === 'trial' ? '5/día' : 'Bloqueado'}
              </p>
            </Link>

            <Link
              href="/bible"
              className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg hover:shadow-xl transition-shadow text-center"
            >
              <div className="text-3xl mb-2">📖</div>
              <h3 className="font-semibold">Leer Biblia</h3>
              <p className="text-xs text-gray-500 mt-1">Gratis</p>
            </Link>
          </div>

          {/* Recent Activity Placeholder */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg">
            <h3 className="font-semibold mb-4">Tu Progreso</h3>
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center">📚</div>
                <div className="flex-1">
                  <p className="font-medium text-sm">Génesis</p>
                  <div className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-full mt-1">
                    <div className="w-1/4 h-full bg-blue-500 rounded-full"></div>
                  </div>
                </div>
                <span className="text-xs text-gray-500">Cap 3</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
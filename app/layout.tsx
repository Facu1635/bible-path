import './globals.css';
import TrialBanner from '@/components/TrialBanner';

export const metadata = {
  title: 'Bible Path - Tu Camino Espiritual',
  description: 'App bíblica con IA personalizada',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es" className="dark">
      <body className="bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white">
        <TrialBanner />
        <main className="pt-0">
          {children}
        </main>
      </body>
    </html>
  );
}
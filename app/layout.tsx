import './globals.css';
import TrialBanner from '@/components/TrialBanner';

export const metadata = {
  title: 'Bible Path - Tu Camino Espiritual',
  description: 'App biblica con IA personalizada',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es" className="dark">
      <head>
        <link 
          href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap" 
          rel="stylesheet" 
        />
      </head>
      <body className="bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white font-sans antialiased">
        <TrialBanner />
        <main className="pt-0">
          {children}
        </main>
      </body>
    </html>
  );
}
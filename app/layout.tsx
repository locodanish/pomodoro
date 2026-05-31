import './globals.css';
import { Nunito } from 'next/font/google';

const nunito = Nunito({
  subsets: ['latin'],
  weight: ['400', '600', '700'],
});

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body
        className={`${nunito.className} bg-gradient-to-br from-pink-100 via-purple-100 to-blue-100 min-h-screen`}
      >
        <div className="flex flex-col min-h-screen p-6">
          
          {/* Cute Header */}
          <header className="text-center mb-6">
            <h1 className="text-3xl font-bold text-purple-600">
              🍅 Pomodoro For Sayang
            </h1>
            <p className="text-gray-500 text-sm">
              Fighting Sayang ✨
            </p>
          </header>

          {/* Main Content FULL WIDTH */}
          <main className="flex-1 w-full">
            {children}
          </main>

          {/* Footer */}
          <footer className="text-center mt-8 text-xs text-gray-400">
            Made with 💖
          </footer>
        </div>
      </body>
    </html>
  );
}
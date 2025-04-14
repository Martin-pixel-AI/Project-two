import type { Metadata } from 'next';
import { Poppins } from 'next/font/google';
import './globals.css';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { AuthProvider } from '@/providers/AuthProvider';
import { MotionProvider } from '@/providers/MotionProvider';

const poppins = Poppins({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700'],
  variable: '--font-poppins',
});

export const metadata: Metadata = {
  title: 'Truespace - Educational Video Platform',
  description: 'Modern educational platform for video courses with promo code access',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${poppins.variable} font-sans min-h-screen flex flex-col`}>
        <AuthProvider>
          <MotionProvider>
            <Navbar />
            <main className="flex-grow">
              {children}
            </main>
            <Footer />
          </MotionProvider>
        </AuthProvider>
      </body>
    </html>
  );
}

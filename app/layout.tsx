import type { Metadata } from "next";
import { Poppins, Playfair_Display } from "next/font/google";
import "./globals.css";
import Header from './components/layout/Header';
import Script from "next/script";
import ClientLayout from './components/layout/ClientLayout';
import BetaNotice from './components/ui/BetaNotice';
import { ThemeProvider } from 'next-themes';

// Optimize font loading with display: swap
const poppins = Poppins({
  weight: ['400', '500', '600', '700'],
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-poppins',
  preload: true,
});

const playfair = Playfair_Display({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-playfair',
  preload: true,
});

export const metadata: Metadata = {
  title: "T2Hasnain | Freelance Graphic Designer & Full Stack Developer",
  description: "Professional freelancer offering graphic design, data management, web & app development, social media management, and logo design services.",
  metadataBase: new URL('https://t2hasnain.com'),
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className="scroll-smooth" suppressHydrationWarning>
      <head>
        {/* Script to avoid FOUC (Flash of Unstyled Content) - runs client-side only */}
        <Script id="theme-script" strategy="beforeInteractive">
          {`
            (function() {
              try {
                const savedTheme = localStorage.getItem('theme');
                if (savedTheme === 'dark' || (!savedTheme && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
                  document.documentElement.classList.add('dark');
                } else {
                  document.documentElement.classList.remove('dark');
                }
              } catch (e) {
                console.error('Failed to access localStorage for theme', e);
              }
            })();
          `}
        </Script>
        {/* Preload important assets */}
        <link rel="preload" as="image" href="/images/MAN.png" />
      </head>
      <body className={`${poppins.variable} ${playfair.variable} font-sans antialiased bg-white dark:bg-gray-900`} suppressHydrationWarning>
        <ThemeProvider attribute="class" defaultTheme="system">
          <BetaNotice />
          <Header />
          <ClientLayout>
            {children}
          </ClientLayout>
        </ThemeProvider>
      </body>
    </html>
  );
}

import type { Metadata } from 'next';
import './globals.css';
import { AppProvider } from '@/context/AppContext';
import { ThemeProvider } from 'next-themes';
import Navbar from '@/components/Navbar';
import CartDrawer from '@/components/CartDrawer';
import Footer from '@/components/Footer';
import Toast from '@/components/Toast';
import ChatBot from '@/components/ChatBot';

export const metadata: Metadata = {
  title: { default: 'NovaShop', template: '%s | NovaShop' },
  description: 'Premium e-commerce store — Next.js 14 Full Stack Portfolio.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&family=Outfit:wght@300;400;500;600;700;800&display=swap" rel="stylesheet" />
      </head>
      <body>
        <ThemeProvider attribute="data-theme" defaultTheme="system" enableSystem>
          <AppProvider>
            <Navbar />
            <CartDrawer />
            <Toast />
            <main id="main-content">{children}</main>
            <Footer />
            <ChatBot />
          </AppProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}

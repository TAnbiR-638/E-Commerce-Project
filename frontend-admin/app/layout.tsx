import type { Metadata } from 'next';
import './globals.css';
import { AppProvider } from '@/context/AppContext';
import AdminShell from '@/components/AdminShell';
import Toast from '@/components/Toast';

export const metadata: Metadata = {
  title: { default: 'NovaShop Admin', template: '%s | NovaShop Admin' },
  description: 'NovaShop Administration Panel — Restricted Access.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&family=Outfit:wght@300;400;500;600;700;800&display=swap" rel="stylesheet" />
      </head>
      <body>
        <AppProvider>
          <AdminShell>{children}</AdminShell>
          <Toast />
        </AppProvider>
      </body>
    </html>
  );
}

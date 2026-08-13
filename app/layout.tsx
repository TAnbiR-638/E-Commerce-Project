import type { Metadata } from 'next';
import './globals.css';
import { AppProvider } from '@/context/AppContext';

export const metadata: Metadata = {
  title: {
    default: 'NovaShop — Premium E-Commerce Platform',
    template: '%s | NovaShop',
  },
  description:
    'Discover premium tech, fashion, and lifestyle products at NovaShop. Built with Next.js 14, Node.js, PostgreSQL, and MongoDB — a full-stack developer portfolio project.',
  keywords: ['e-commerce', 'online shopping', 'Next.js', 'full stack', 'TypeScript'],
  authors: [{ name: 'Full Stack Developer' }],
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://novashop.dev',
    title: 'NovaShop — Premium E-Commerce Platform',
    description: 'Discover curated products at competitive prices.',
    siteName: 'NovaShop',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'NovaShop — Premium E-Commerce Platform',
    description: 'Full-stack e-commerce built with Next.js, Node.js & PostgreSQL.',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&family=Outfit:wght@300;400;500;600;700;800&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>
        <AppProvider>
          {children}
        </AppProvider>
      </body>
    </html>
  );
}

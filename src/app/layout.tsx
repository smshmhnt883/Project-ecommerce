import type { Metadata, Viewport } from 'next';
import './globals.css';
import { Providers } from '@/context/Providers';
import { StoreLayout } from '@/components/layout/StoreLayout';

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  viewportFit: 'cover',
  themeColor: '#172D20',
};

export const metadata: Metadata = {
  title: 'Ayurveda & Botanicals | Authentic Patanjali Marketplace',
  description: 'Shop 100% authentic Patanjali Ayurvedic products for daily personal care, hair care, health supplements, and pure Vedic foods. Free Pan-India shipping above ₹499.',
  keywords: ['Patanjali', 'Ayurveda', 'Herbal', 'Dant Kanti', 'Kesh Kanti', 'Cow Ghee', 'Aloe Vera Gel', 'Chyawanprash', 'Indian Wellness'],
  openGraph: {
    title: 'Ayurveda & Botanicals | Authentic Patanjali Store',
    description: 'Everyday Wellness, Rooted in Ayurveda. Explore genuine Patanjali formulations directly from Haridwar.',
    url: 'https://ayurveda-botanicals.in',
    siteName: 'Ayurveda & Botanicals',
    images: [
      {
        url: 'https://images.unsplash.com/photo-1540555700478-4be289fbecef?q=80&w=1200&auto=format&fit=crop',
        width: 1200,
        height: 630,
        alt: 'Ayurvedic Botanicals and Herbal Care',
      },
    ],
    locale: 'en_IN',
    type: 'website',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="scroll-smooth">
      <body className="bg-ayur-ivory text-ayur-charcoal-800 antialiased selection:bg-ayur-green-100 selection:text-ayur-green-900">
        <Providers>
          <StoreLayout>
            {children}
          </StoreLayout>
        </Providers>
      </body>
    </html>
  );
}

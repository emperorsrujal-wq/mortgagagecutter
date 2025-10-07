import type { Metadata } from 'next';
import './globals.css';
import { Toaster } from '@/components/ui/toaster';
import Header from '@/components/layout/header';
import Footer from '@/components/layout/footer';
import { FirebaseClientProvider } from '@/firebase/client-provider';

const siteConfig = {
  name: 'Mortgage Cutter',
  url: 'https://mortgagecutter.com',
  description:
    'Discover the Mortgage Cutter method to pay off your mortgage 10+ years sooner. Use our free mortgage payoff calculator to get a personalized savings estimate and accelerate your journey to financial freedom.',
  ogImage:
    'https://images.unsplash.com/photo-1555689070-2d15336749b6?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDE5ODJ8MHwxfHNlYXJjaHwzfHxoYXBweSUyMGNvdXBsZXxlbnwwfHx8fDE3NTk1NjI5MTl8MA&ixlib=rb-4.1.0&q=80&w=1080',
  keywords: [
    'mortgagecutter',
    'mortgage cutter',
    'pay off mortgage early',
    'mortgage accelerator',
    'HELOC strategy',
    'mortgage calculator',
    'financial freedom',
    'debt consolidation',
    'home equity loan',
    'mortgage payoff calculator',
    'real estate investing',
    'wealth building',
    'all-in-one mortgage',
  ],
};

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.url),
  title: {
    default: `Mortgage Cutter Method | Pay Off Your Mortgage 10+ Years Sooner`,
    template: `%s | Mortgage Cutter`,
  },
  description: siteConfig.description,
  keywords: siteConfig.keywords,
  creator: 'Private Wealth Academy',
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: siteConfig.url,
    title: `Mortgage Cutter: Pay Off Your Mortgage Faster`,
    description: siteConfig.description,
    images: [
      {
        url: siteConfig.ogImage,
        width: 1200,
        height: 630,
        alt: 'A happy couple celebrating their financial freedom after using the Mortgage Cutter method.',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: `Mortgage Cutter: Pay Off Your Mortgage Faster`,
    description: siteConfig.description,
    images: [siteConfig.ogImage],
  },
  icons: {
    icon: '/favicon.ico',
  },
};

const organizationSchema = {
  '@context': 'https://schema.org',
  '@type': 'Organization',
  name: 'Mortgage Cutter',
  url: 'https://mortgagecutter.com',
  logo: `${siteConfig.url}/favicon.ico`, 
  sameAs: [], 
};

const websiteSchema = {
  '@context': 'https://schema.org',
  '@type': 'WebSite',
  name: 'Mortgage Cutter',
  url: 'https://mortgagecutter.com',
  potentialAction: {
    '@type': 'SearchAction',
    target: `${siteConfig.url}/search?q={search_term_string}`,
    'query-input': 'required name=search_term_string',
  },
};


export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="light" suppressHydrationWarning={true}>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap"
          rel="stylesheet"
        />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }} />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteSchema) }} />
      </head>
      <body
        className="font-body antialiased bg-background"
        suppressHydrationWarning={true}
      >
        <FirebaseClientProvider>
          <div className="flex flex-col min-h-screen">
            <Header />
            <main className="flex-1 flex flex-col">{children}</main>
            <Footer />
          </div>
          <Toaster />
        </FirebaseClientProvider>
      </body>
    </html>
  );
}

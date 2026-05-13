
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
    'Use our free mortgage payoff estimator to see how the Mortgage Cutter method could help you pay off your mortgage faster. This simple HELOC strategy can save you thousands.',
  ogImage:
    'https://images.unsplash.com/photo-1555689070-2d15336749b6?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDE5ODJ8MHwxfHNlYXJjaHwzfHxoYXBweSUyMGNvdXBsZXxlbnwwfHx8fDE3NTk1NjI5MTl8MA&ixlib=rb-4.1.0&q=80&w=1080',
  keywords: [
    'mortgage payoff estimator',
    'mortgage payoff calculator',
    'heloc calculator',
    'pay off mortgage faster',
    'mortgage cutter',
    'mortgagecutter',
    'heloc strategy',
    'mortgage accelerator',
    'financial freedom',
    'first-lien heloc',
  ],
};

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.url),
  title: {
    default: `Mortgage Payoff Estimator | Mortgage Cutter`,
    template: `%s | Mortgage Cutter`,
  },
  description: siteConfig.description,
  keywords: siteConfig.keywords,
  creator: 'Private Wealth Academy',
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: siteConfig.url,
    title: `Mortgage Cutter: A Smarter Mortgage Payoff Estimator`,
    description: siteConfig.description,
    images: [
      {
        url: siteConfig.ogImage,
        width: 1200,
        height: 630,
        alt: 'A happy couple considering their future after using a mortgage payoff estimator to pay their loan off faster.',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: `Mortgage Cutter: A Smarter Mortgage Payoff Estimator`,
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
          href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&family=Fraunces:wght@400;700;800;900&family=Inter:wght@400;500;600;700&display=swap"
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
            <main className="flex-1 flex flex-col pt-[72px]">{children}</main>
            <Footer />
          </div>
          <Toaster />
        </FirebaseClientProvider>
      </body>
    </html>
  );
}

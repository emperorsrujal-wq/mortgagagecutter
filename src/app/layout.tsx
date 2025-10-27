
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

        <script type="module" dangerouslySetInnerHTML={{ __html: `
          /***** Firebase (CDN) *****/
          import { initializeApp } from "https://www.gstatic.com/firebasejs/10.13.0/firebase-app.js";
          import { getAuth, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.13.0/firebase-auth.js";

          // ⬇️ Replace with your Firebase config if not already initialized somewhere else
          const firebaseConfig = {
            "projectId": "studio-3460964595-6810c",
            "appId": "1:154043444381:web:b6adc8497743e2da713874",
            "storageBucket": "studio-3460964595-6810c.appspot.com",
            "apiKey": "AIzaSyDzy-gfxzicLhJIIgQ68ygEW3w9dotdssU",
            "authDomain": "studio-3460964595-6810c.firebaseapp.com",
            "measurementId": "G-5G01SM2ZCE",
            "messagingSenderId": "154043444381"
          };
          
          let app;
          try {
            app = initializeApp(firebaseConfig);
          } catch (e) {
            // App may already be initialized by the main app, which is fine.
            console.log("Firebase already initialized or config error:", e.message);
          }
          
          if (app) {
            const auth = getAuth(app);

            /***** EmailJS (CDN) *****/
            // Note: Using a dynamic import for emailjs to avoid breaking server-side rendering
            import("https://cdn.jsdelivr.net/npm/@emailjs/browser@4/dist/email.min.js")
              .then((emailjs) => {
                emailjs.default.init("w6aZ3uubR3H1yhVwO"); // <-- YOUR PUBLIC KEY (safe to use on client)
                
                const SERVICE_ID  = "service_p8lcxos";
                const TEMPLATE_ID = "template_10wbszi";
                
                async function sendWelcomeIfFirstLogin(user) {
                  try {
                    if (!user?.email) return;
                    
                    const firstLogin = user.metadata?.creationTime === user.metadata?.lastSignInTime;
                    if (!firstLogin) return;
                    
                    const dedupeKey = \`welcome_sent_\${user.uid}\`;
                    if (localStorage.getItem(dedupeKey)) return;
                    
                    const nameFromProvider = user.displayName && user.displayName.trim()
                      ? user.displayName.trim()
                      : (user.email.split("@")[0]);
                    
                    const params = {
                      email: user.email,
                      name:  nameFromProvider,
                      // These are added to match the default template, can be removed if your template doesn't use them
                      from_name: 'Mortgage Cutter',
                      message: 'Welcome to your financial freedom journey. Get started by filling out our questionnaire.'
                    };
                    
                    console.log("[EmailJS] Sending welcome with params:", params);
                    await emailjs.default.send(SERVICE_ID, TEMPLATE_ID, params);
                    localStorage.setItem(dedupeKey, "1");
                    console.log("[EmailJS] Welcome email sent ✅");
                  } catch (err) {
                    console.error("[EmailJS] Welcome email failed ❌", err);
                  }
                }
                
                onAuthStateChanged(auth, (user) => {
                  if (user) sendWelcomeIfFirstLogin(user);
                });
              })
              .catch(err => console.error("Failed to load EmailJS module", err));
          }
        `}} />
      </body>
    </html>
  );
}

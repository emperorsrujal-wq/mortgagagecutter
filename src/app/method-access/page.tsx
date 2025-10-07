import Image from 'next/image';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import Link from 'next/link';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Access Unlocked | Mortgage Cutter Method',
  description: 'Congratulations! Your access to the complete Mortgage Cutter Method, tools, and step-by-step guides is now unlocked.',
  robots: {
    index: false,
    follow: false,
  }
};

const breadcrumbSchema = {
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  'itemListElement': [
    {
      '@type': 'ListItem',
      'position': 1,
      'name': 'Home',
      'item': 'https://mortgagecutter.com'
    },
    {
      '@type': 'ListItem',
      'position': 2,
      'name': 'Access Unlocked'
    }
  ]
};

export default function MethodAccessPage() {
  const accessImage = PlaceHolderImages.find((p) => p.id === 'method-access');

  return (
    <>
     <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
      <div className="container mx-auto py-12 px-4 text-center">
        <Card className="max-w-3xl mx-auto shadow-lg">
          <CardHeader>
            <CardTitle className="text-3xl md:text-4xl font-bold text-primary">
              Congratulations!
            </CardTitle>
            <CardDescription className="text-lg text-muted-foreground">
              Welcome to the Mortgage Cutter Family! Your access to the complete
              Method is now unlocked.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {accessImage && (
              <div className="relative aspect-video max-w-md mx-auto">
                <Image
                  src={accessImage.imageUrl}
                  alt={accessImage.description}
                  width={600}
                  height={400}
                  className="rounded-lg object-cover"
                  data-ai-hint={accessImage.imageHint}
                />
              </div>
            )}
            <Button size="lg" asChild>
              <Link href="#">Access Your Method & Tools Now</Link>
            </Button>
            <div className="text-left p-6 bg-secondary rounded-lg">
              <h3 className="font-bold text-xl mb-4">What's inside:</h3>
              <ul className="list-disc list-inside space-y-2 text-secondary-foreground">
                <li>
                  Step-by-step guide to implementing the Mortgage Cutter Method.
                </li>
                <li>Interactive calculators to track your progress.</li>
                <li>Frequently Asked Questions and answers.</li>
                <li>Tips and resources for financial freedom.</li>
              </ul>
            </div>
          </CardContent>
        </Card>
      </div>
    </>
  );
}

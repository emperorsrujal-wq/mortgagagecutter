import { QuestionnaireForm } from '@/components/questionnaire/questionnaire-form';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Mortgage Savings Calculator',
  description: 'Enter your mortgage and financial details into our free calculator to see how the Mortgage Cutter Method can help you pay off your home years sooner.',
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
      'name': 'Savings Calculator'
    }
  ]
};

export default function QuestionnairePage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
      <div className="container mx-auto py-12 px-4">
        <Card className="max-w-4xl mx-auto shadow-lg">
          <CardHeader className="text-center">
            <CardTitle className="text-3xl font-bold">
              Tell Us About Your Mortgage
            </CardTitle>
            <CardDescription className="text-lg text-muted-foreground">
              For a Personalized Savings Estimate
            </CardDescription>
          </CardHeader>
          <CardContent>
            <QuestionnaireForm />
          </CardContent>
        </Card>
      </div>
    </>
  );
}

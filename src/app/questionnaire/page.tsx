import { QuestionnaireForm } from '@/components/questionnaire/questionnaire-form';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';

export default function QuestionnairePage() {
  return (
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
  );
}

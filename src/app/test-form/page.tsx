
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export default function TestFormPage() {
  return (
    <div className="bg-gray-100 flex-1 flex items-center justify-center py-12 px-4">
      <Card className="w-full max-w-md mx-auto shadow-lg rounded-lg">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl">SendGrid Form Test</CardTitle>
          <CardDescription>
            This page is only for testing the SendGrid embedded form.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <iframe
            src="https://cdn.forms-content-1.sg-form.com/3afc55b0-b157-11f0-9eb7-5e057f64fa4d"
            title="SendGrid Signup Form"
            style={{ width: '100%', minHeight: '420px', border: 'none' }}
          ></iframe>
        </CardContent>
      </Card>
    </div>
  );
}

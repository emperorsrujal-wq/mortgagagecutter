
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
          <div dangerouslySetInnerHTML={{ __html: `
            <style>
              .sg-form-container {
                max-width: 100%;
                font-family: inherit;
              }
              .sg-form-container .sg-header {
                font-size: 1.5rem;
                font-weight: bold;
                margin-bottom: 1rem;
              }
              .sg-form-container .sg-description {
                font-size: 0.875rem;
                margin-bottom: 1rem;
              }
              .sg-form-container .sg-input {
                width: 100%;
                padding: 0.75rem;
                border: 1px solid #d1d5db;
                border-radius: 0.375rem;
                margin-bottom: 1rem;
              }
              .sg-form-container .sg-button {
                width: 100%;
                background-color: #29ABE2;
                color: white;
                padding: 0.75rem;
                border: none;
                border-radius: 0.375rem;
                cursor: pointer;
                font-weight: bold;
              }
              .sg-form-container .sg-button:hover {
                background-color: #1f89b5;
              }
            </style>
            <div id="sg-form-container" class="sg-form-container">
              <form 
                action="https://forms.sendgrid.com/v1/forms/3afc55b0-b157-11f0-9eb7-5e057f64fa4d/submissions" 
                method="post"
              >
                <div class="sg-header">Subscribe</div>
                <div class="sg-description">Get the latest updates.</div>
                <input class="sg-input" type="email" name="email" placeholder="Email Address" required>
                <input class="sg-input" type="text" name="first_name" placeholder="First Name">
                <input class="sg-button" type="submit" value="Subscribe">
              </form>
            </div>
          ` }} />
        </CardContent>
      </Card>
    </div>
  );
}

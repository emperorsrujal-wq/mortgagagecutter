
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';

export default function TestFormPage() {
  return (
    <div className="bg-gray-100 flex-1 flex items-center justify-center py-12 px-4">
      <Card className="w-full max-w-md mx-auto shadow-lg rounded-lg">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl">SendGrid Form Test</CardTitle>
          <CardDescription>
            This page is for testing the SendGrid embedded form.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <h3 className="font-semibold text-center mb-2">Test 1: Iframe Method</h3>
          <iframe
            src="https://cdn.forms-content-1.sg-form.com/3afc55b0-b157-11f0-9eb7-5e057f64fa4d"
            title="SendGrid Signup Form (Iframe)"
            style={{ width: '100%', minHeight: '420px', border: '1px solid #ccc', borderRadius: '0.375rem' }}
          ></iframe>
        </CardContent>
        
        <Separator className="my-4" />

        <CardContent>
           <h3 className="font-semibold text-center mb-4">Test 2: Raw HTML Method</h3>
           <p className="text-sm text-muted-foreground text-center mb-4">If the iframe fails, this version is more reliable and should work.</p>
          <div dangerouslySetInnerHTML={{ __html: `
            <style>
              .sg-form-container { max-width: 100%; font-family: inherit; }
              .sg-form-container .sg-header { font-size: 1.25rem; font-weight: bold; margin-bottom: 1rem; text-align: center; }
              .sg-form-container .sg-description { font-size: 0.875rem; margin-bottom: 1rem; text-align: center; }
              .sg-form-container .sg-input { display: block; width: 100%; padding: 0.75rem; border: 1px solid #d1d5db; border-radius: 0.375rem; margin-bottom: 1rem; }
              .sg-form-container .sg-button { display: block; width: 100%; background-color: #29ABE2; color: white; padding: 0.75rem; border: none; border-radius: 0.375rem; cursor: pointer; font-weight: bold; }
              .sg-form-container .sg-button:hover { background-color: #1f89b5; }
            </style>
            <div id="sg-form-container-html" class="sg-form-container">
              <form 
                action="https://forms.sendgrid.com/v1/forms/3afc55b0-b157-11f0-9eb7-5e057f64fa4d/submissions" 
                method="post"
                target="_blank" 
              >
                <div class="sg-header">Subscribe via HTML</div>
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

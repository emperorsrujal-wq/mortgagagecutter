/**
 * Seed script for Firebase Firestore email templates.
 * Run with: npx ts-node scripts/seed-email-templates.ts
 * Or compile first: npx tsc scripts/seed-email-templates.ts && node scripts/seed-email-templates.js
 *
 * Prerequisites:
 * 1. Log in to Firebase CLI: firebase login
 * 2. Ensure you have the correct project selected: firebase use <project-id>
 */

import admin from 'firebase-admin';

const templates = [
  {
    id: 'welcome_signup',
    subject: 'Welcome to Mortgage Cutter, {{name}}!',
    html: `<div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
  <h1 style="color: #2563EB;">Welcome to the Movement, {{name}}!</h1>
  <p>You've just taken the first step toward reclaiming years of your life and thousands of dollars from the bank.</p>
  <p>The "Interest Trap" is real, but now you have the tools to fight back.</p>
  <div style="text-align: center; margin: 30px 0;">
    <a href="{{ctaUrl}}" style="background-color: #2563EB; color: white; padding: 15px 25px; text-decoration: none; border-radius: 8px; font-weight: bold;">Get Your Savings Blueprint Now →</a>
  </div>
  <p>See you on the inside,</p>
  <p><strong>The Mortgage Cutter Team</strong></p>
</div>`,
  },
  {
    id: 'welcome_oauth',
    subject: 'Welcome aboard, {{name}}!',
    html: `<div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
  <h1 style="color: #2563EB;">Welcome aboard, {{name}}!</h1>
  <p>You've just unlocked access to the strategies the banks would rather you didn't know.</p>
  <p>Ready to see your personalized savings potential?</p>
  <div style="text-align: center; margin: 30px 0;">
    <a href="{{ctaUrl}}" style="background-color: #2563EB; color: white; padding: 15px 25px; text-decoration: none; border-radius: 8px; font-weight: bold;">Calculate My Savings →</a>
  </div>
  <p>Let's get to work.</p>
  <p>Best,</p>
  <p><strong>The Mortgage Cutter Team</strong></p>
</div>`,
  },
  {
    id: 'blueprint_ready',
    subject: 'Your Savings Blueprint is Ready!',
    html: `<div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
  <h1 style="color: #059669;">The Numbers are In!</h1>
  <p>We've analyzed your mortgage details, and the potential for savings is significant.</p>
  <p>Your custom blueprint is securely stored in your account. You can access it anytime using the link below:</p>
  <div style="text-align: center; margin: 30px 0;">
    <a href="{{resultUrl}}" style="background-color: #059669; color: white; padding: 15px 25px; text-decoration: none; border-radius: 8px; font-weight: bold;">View My Blueprint →</a>
  </div>
  <p>Don't let the interest trap slow you down. Start implementing your strategy today.</p>
  <p>Best,</p>
  <p><strong>The Mortgage Cutter Team</strong></p>
</div>`,
  },
  {
    id: 'purchase_confirmation',
    subject: 'Thank You for Your Purchase!',
    html: `<div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
  <h1 style="color: #2563EB;">Thank You for Your Purchase!</h1>
  <p>We're excited to help you on your journey to mortgage freedom.</p>
  <p><strong>Product:</strong> {{productName}}</p>
  <p><strong>Amount:</strong> {{amount}}</p>
  <div style="text-align: center; margin: 30px 0;">
    <a href="{{accessUrl}}" style="background-color: #2563EB; color: white; padding: 15px 25px; text-decoration: none; border-radius: 8px; font-weight: bold;">Access My Purchase →</a>
  </div>
  <p>If you have any questions, reply to this email.</p>
  <p>Best,</p>
  <p><strong>The Mortgage Cutter Team</strong></p>
</div>`,
  },
  {
    id: 'abandoned_questionnaire',
    subject: "Don't Miss Your Savings Blueprint",
    html: `<div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
  <h1 style="color: #2563EB;">Don't Leave Your Savings on the Table!</h1>
  <p>Hi {{name}},</p>
  <p>You started your journey to mortgage freedom, but you haven't completed your Savings Blueprint yet.</p>
  <p>In just 60 seconds, you could see exactly how many years and dollars you could save.</p>
  <div style="text-align: center; margin: 30px 0;">
    <a href="{{questionnaireUrl}}" style="background-color: #2563EB; color: white; padding: 15px 25px; text-decoration: none; border-radius: 8px; font-weight: bold;">Complete My Blueprint →</a>
  </div>
  <p>Best,</p>
  <p><strong>The Mortgage Cutter Team</strong></p>
</div>`,
  },
];

async function seedTemplates() {
  // Initialize Firebase Admin if not already initialized
  if (admin.apps.length === 0) {
    admin.initializeApp();
  }

  const db = admin.firestore();
  const batch = db.batch();

  for (const template of templates) {
    const ref = db.collection('email_templates').doc(template.id);
    batch.set(ref, {
      subject: template.subject,
      html: template.html,
    }, { merge: true });
    console.log(`Prepared template: ${template.id}`);
  }

  await batch.commit();
  console.log('All email templates seeded successfully!');
}

seedTemplates().catch((err) => {
  console.error('Failed to seed templates:', err);
  process.exit(1);
});

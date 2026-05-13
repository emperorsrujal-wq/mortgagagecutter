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
  // ── 5-Day Mortgage Freedom Challenge Emails ──
  {
    id: 'challenge_day1',
    subject: "Day 1: The $87,000 Interest Trap (watch this)",
    html: `<div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
  <h1 style="color: #2563EB;">Welcome to the 5-Day Mortgage Freedom Challenge</h1>
  <p>Hi {{name}},</p>
  <p>Over the next 5 days, I'm going to show you exactly why the banks are praying you never discover this.</p>
  <p>Today, we start with the single most important truth about your mortgage:</p>
  <blockquote style="border-left: 4px solid #2563EB; padding-left: 16px; margin: 20px 0; color: #334155;">
    <strong>The average homeowner loses $87,000 in interest — not because they bought the wrong house, but because they used the wrong payment strategy.</strong>
  </blockquote>
  <p>In Day 1, you'll discover the "Interest Trap" and why your bank never told you about it.</p>
  <div style="text-align: center; margin: 30px 0;">
    <a href="{{lesson1Url}}" style="background-color: #2563EB; color: white; padding: 15px 25px; text-decoration: none; border-radius: 8px; font-weight: bold;">Watch Day 1 Lesson →</a>
  </div>
  <p>Tomorrow, I'll show you how to calculate exactly how much YOU are losing.</p>
  <p>Talk soon,</p>
  <p><strong>The Mortgage Cutter Team</strong></p>
</div>`,
  },
  {
    id: 'challenge_day2',
    subject: "Day 2: How much are YOU losing to interest?",
    html: `<div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
  <h1 style="color: #2563EB;">Day 2: Your Personalized Interest Report</h1>
  <p>Hi {{name}},</p>
  <p>Yesterday you learned how the Interest Trap works. Today, we're making it personal.</p>
  <p>Most homeowners have no idea how much interest they're actually paying over the life of their mortgage. It's not the rate on your statement — it's the <em>total</em> cost.</p>
  <p><strong>Here's what one member discovered:</strong></p>
  <ul>
    <li>Mortgage: $420,000 at 6%</li>
    <li>Total interest paid (traditional): $486,000</li>
    <li>Total interest with the Chunker method: $312,000</li>
    <li><strong>Savings: $174,000</strong></li>
  </ul>
  <p>Your numbers will be different. Let's find out exactly what yours are.</p>
  <div style="text-align: center; margin: 30px 0;">
    <a href="{{calculatorUrl}}" style="background-color: #2563EB; color: white; padding: 15px 25px; text-decoration: none; border-radius: 8px; font-weight: bold;">Calculate My Interest Loss →</a>
  </div>
  <p>Tomorrow: The exact method banks don't want you to know.</p>
  <p>Best,</p>
  <p><strong>The Mortgage Cutter Team</strong></p>
</div>`,
  },
  {
    id: 'challenge_day3',
    subject: "Day 3: The method banks don't want you to know",
    html: `<div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
  <h1 style="color: #2563EB;">Day 3: The Chunker Method Revealed (Partial)</h1>
  <p>Hi {{name}},</p>
  <p>By now you know how much you're losing. Today I'm going to show you <em>exactly</em> how to stop it.</p>
  <p>The Chunker Method isn't about earning more money. It's not about switching banks. And it's definitely not about refinancing.</p>
  <p>It's about one simple change to how your cash flows through your accounts — a change that redirects money you'd otherwise pay as interest back into your principal.</p>
  <p><strong>In this lesson you'll learn:</strong></p>
  <ul>
    <li>Why checking accounts are the bank's secret weapon against you</li>
    <li>How to make your income work 24/7 against your principal</li>
    <li>The "Velocity Trick" that cuts 8-12 years off most mortgages</li>
  </ul>
  <p>But I'm only revealing 70% of the system today. The execution details — the exact scripts, the calculator, the screener — that's for Day 5.</p>
  <div style="text-align: center; margin: 30px 0;">
    <a href="{{lesson2Url}}" style="background-color: #2563EB; color: white; padding: 15px 25px; text-decoration: none; border-radius: 8px; font-weight: bold;">Watch Day 3 Lesson →</a>
  </div>
  <p>Tomorrow: Real homeowners who used this method.</p>
  <p>Best,</p>
  <p><strong>The Mortgage Cutter Team</strong></p>
</div>`,
  },
  {
    id: 'challenge_day4',
    subject: "Day 4: She cut 9 years without switching banks",
    html: `<div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
  <h1 style="color: #2563EB;">Day 4: Real Homeowners. Real Results.</h1>
  <p>Hi {{name}},</p>
  <p>The Chunker Method sounds good in theory. But does it actually work in real life?</p>
  <p>Let me introduce you to three families who put it to the test:</p>
  <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 24px 0;">
  <p><strong>Sarah L., Toronto</strong><br/>
  <em>"We shaved 9 years and about $42,000 in interest — without switching banks. The plan paid for itself in month one."</em></p>
  <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 24px 0;">
  <p><strong>Michael R., Calgary</strong><br/>
  <em>"Our plan showed a clear path to being debt-free. We're saving ~$500/month just by redirecting cash flow smarter."</em></p>
  <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 24px 0;">
  <p><strong>Priya P., Vancouver</strong><br/>
  <em>"I finally see how to beat the interest game. We cut 11 years off our mortgage. This changed our family's timeline forever."</em></p>
  <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 24px 0;">
  <p>These aren't outliers. These are ordinary homeowners who made one strategic change.</p>
  <p><strong>Common objections addressed:</strong></p>
  <ul>
    <li><strong>"Will this work with my bank?"</strong> Yes — any bank, any mortgage type.</li>
    <li><strong>"Do I need extra income?"</strong> No — it's about cash flow timing, not more money.</li>
    <li><strong>"Is this complicated?"</strong> No — 15 minutes per month once set up.</li>
    <li><strong>"What if rates change?"</strong> The method adapts automatically.</li>
  </ul>
  <p>Tomorrow is the big day. The complete system opens.</p>
  <p>Best,</p>
  <p><strong>The Mortgage Cutter Team</strong></p>
</div>`,
  },
  {
    id: 'challenge_day5',
    subject: "Day 5: Your blueprint is ready (doors close soon)",
    html: `<div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
  <h1 style="color: #2563EB;">Day 5: The Complete Mortgage Cutter System</h1>
  <p>Hi {{name}},</p>
  <p>Over the past 4 days, you've learned:</p>
  <ul>
    <li>How the Interest Trap steals $30,000–$60,000 from most families</li>
    <li>Exactly how much YOU are projected to lose</li>
    <li>The Chunker Method concept — the strategy banks hope you never discover</li>
    <li>Real proof from homeowners who've already done it</li>
  </ul>
  <p><strong>Today, you get the complete system.</strong></p>
  <p>This isn't just a course. It's a complete toolkit for mortgage freedom:</p>
  <table style="width: 100%; border-collapse: collapse; margin: 20px 0;">
    <tr><td style="padding: 8px 0;">✅ Full Financial Academy (36 lessons)</td><td style="text-align: right; color: #6b7280;">$2,000 value</td></tr>
    <tr><td style="padding: 8px 0;">✅ Chunker Simulator Tool</td><td style="text-align: right; color: #6b7280;">$500 value</td></tr>
    <tr><td style="padding: 8px 0;">✅ Bank Screener Tool</td><td style="text-align: right; color: #6b7280;">$300 value</td></tr>
    <tr><td style="padding: 8px 0;">✅ Lender Negotiation Scripts</td><td style="text-align: right; color: #6b7280;">$200 value</td></tr>
    <tr><td style="padding: 8px 0;">✅ Mortgage Audit Checklist</td><td style="text-align: right; color: #6b7280;">$100 value</td></tr>
    <tr><td style="padding: 8px 0;">✅ Private Community Access</td><td style="text-align: right; color: #6b7280;">$300 value</td></tr>
    <tr><td style="padding: 8px 0;">✅ Monthly Live Q&A Calls</td><td style="text-align: right; color: #6b7280;">$600 value</td></tr>
  </table>
  <p style="text-align: center; font-size: 18px; margin: 20px 0;"><strong>Total Value: $4,000</strong></p>
  <p style="text-align: center; font-size: 24px; color: #2563EB;"><strong>Today Only: $999</strong></p>
  <p style="text-align: center; font-size: 14px; color: #6b7280;">Or 6 payments of $197</p>
  <div style="text-align: center; margin: 30px 0;">
    <a href="{{salesUrl}}" style="background-color: #2563EB; color: white; padding: 18px 32px; text-decoration: none; border-radius: 8px; font-weight: bold; font-size: 18px;">Get Full Access Now →</a>
  </div>
  <p style="text-align: center; font-size: 13px; color: #6b7280;">30-Day Show-Your-Math Guarantee</p>
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

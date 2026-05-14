/**
 * Seed script for Firebase Firestore email templates.
 * Run with: npx tsx scripts/seed-email-templates.ts
 */

import admin from 'firebase-admin';

// ── Brand Colors ──
const C = {
  primary: '#0ea5e9',      // cyan-500
  primaryDark: '#0284c7',  // cyan-600
  emerald: '#10b981',      // emerald-500
  emeraldDark: '#059669',  // emerald-600
  slate900: '#0f172a',     // headings
  slate700: '#334155',     // body text
  slate500: '#64748b',     // muted text
  slate200: '#e2e8f0',     // borders
  slate100: '#f1f5f9',     // light bg
  slate50: '#f8fafc',      // page bg
  white: '#ffffff',
};

const brandGradient = `background: linear-gradient(135deg, ${C.primary} 0%, ${C.emerald} 100%);`;

function emailWrapper(opts: {
  headline: string;
  headlineColor?: string;
  body: string;
  ctaUrl?: string;
  ctaText?: string;
  footerNote?: string;
  showSignature?: boolean;
}) {
  const { headline, headlineColor = C.primary, body, ctaUrl, ctaText, footerNote, showSignature = true } = opts;
  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>${headline}</title>
</head>
<body style="margin:0;padding:0;background-color:${C.slate50};font-family:'Inter',-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;">
<table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0">
  <tr>
    <td align="center" style="padding: 40px 16px;">
      <table role="presentation" width="600" cellspacing="0" cellpadding="0" border="0" style="max-width:600px;width:100%;border-radius:16px;overflow:hidden;background:${C.white};box-shadow:0 4px 24px rgba(15,23,42,0.08);">
        
        <!-- Header Bar -->
        <tr>
          <td style="${brandGradient} padding: 32px 40px 28px; text-align: center;">
            <table role="presentation" cellspacing="0" cellpadding="0" border="0" align="center">
              <tr>
                <td style="padding-bottom: 8px;">
                  <div style="font-size: 24px; font-weight: 800; color: ${C.white}; letter-spacing: -0.5px;">Mortgage Cutter</div>
                </td>
              </tr>
              <tr>
                <td>
                  <div style="width: 40px; height: 3px; background: rgba(255,255,255,0.5); border-radius: 2px; margin: 0 auto;"></div>
                </td>
              </tr>
            </table>
          </td>
        </tr>

        <!-- Hero Headline -->
        <tr>
          <td style="padding: 40px 40px 12px;">
            <h1 style="margin:0;font-size:28px;font-weight:700;line-height:1.2;color:${headlineColor};letter-spacing:-0.5px;">${headline}</h1>
          </td>
        </tr>

        <!-- Body -->
        <tr>
          <td style="padding: 12px 40px 24px;">
            <div style="font-size:16px;line-height:1.7;color:${C.slate700};">
              ${body}
            </div>
          </td>
        </tr>

        <!-- CTA -->
        ${ctaUrl && ctaText ? `
        <tr>
          <td style="padding: 8px 40px 32px; text-align: center;">
            <table role="presentation" cellspacing="0" cellpadding="0" border="0" align="center">
              <tr>
                <td style="border-radius: 12px; ${brandGradient} text-align: center;">
                  <a href="${ctaUrl}" style="display:inline-block;padding:16px 36px;font-size:16px;font-weight:600;color:${C.white};text-decoration:none;border-radius:12px;">${ctaText}</a>
                </td>
              </tr>
            </table>
          </td>
        </tr>
        ` : ''}

        <!-- Divider -->
        <tr>
          <td style="padding: 0 40px;">
            <div style="height: 1px; background: ${C.slate200};"></div>
          </td>
        </tr>

        <!-- Signature -->
        ${showSignature ? `
        <tr>
          <td style="padding: 28px 40px 16px;">
            <p style="margin:0 0 4px;font-size:15px;color:${C.slate700};">To your financial freedom,</p>
            <p style="margin:0;font-size:15px;font-weight:700;color:${C.slate900};">The Mortgage Cutter Team</p>
          </td>
        </tr>
        ` : ''}

        <!-- Footer -->
        <tr>
          <td style="padding: 16px 40px 32px;">
            ${footerNote ? `<p style="margin:0 0 12px;font-size:13px;color:${C.slate500};line-height:1.5;">${footerNote}</p>` : ''}
            <p style="margin:0;font-size:12px;color:${C.slate500};line-height:1.5;">
              Mortgage Cutter &middot; Helping homeowners reclaim years and dollars from the bank.<br/>
              <a href="https://mortgagecutter.com" style="color:${C.primary};text-decoration:none;">mortgagecutter.com</a>
            </p>
          </td>
        </tr>
      </table>
    </td>
  </tr>
</table>
</body>
</html>`;
}

const templates = [
  {
    id: 'welcome_signup',
    subject: 'Welcome to Mortgage Cutter, {{name}}! 🏠',
    html: emailWrapper({
      headline: `Welcome to the Movement, {{name}}!`,
      body: `
        <p style="margin:0 0 16px;">You've just taken the first step toward reclaiming years of your life and thousands of dollars from the bank.</p>
        <p style="margin:0 0 16px;">The <strong>"Interest Trap"</strong> is real, but now you have the tools to fight back.</p>
        <div style="background:${C.slate100};border-radius:12px;padding:20px 24px;margin:20px 0;">
          <p style="margin:0;font-size:14px;color:${C.slate500};text-transform:uppercase;letter-spacing:0.5px;font-weight:600;">What's Next?</p>
          <p style="margin:8px 0 0;font-size:15px;color:${C.slate700};">Get your personalized Savings Blueprint in 60 seconds. No credit card required.</p>
        </div>
      `,
      ctaUrl: '{{ctaUrl}}',
      ctaText: 'Get My Savings Blueprint →',
    }),
  },
  {
    id: 'welcome_oauth',
    subject: 'Welcome aboard, {{name}}! 🚀',
    html: emailWrapper({
      headline: `Welcome Aboard, {{name}}!`,
      body: `
        <p style="margin:0 0 16px;">You've just unlocked access to the strategies the banks would rather you didn't know.</p>
        <p style="margin:0 0 16px;">Ready to see your personalized savings potential? It takes less than a minute.</p>
        <div style="background:${C.slate100};border-radius:12px;padding:20px 24px;margin:20px 0;">
          <p style="margin:0;font-size:14px;color:${C.slate500};text-transform:uppercase;letter-spacing:0.5px;font-weight:600;">Quick Start</p>
          <p style="margin:8px 0 0;font-size:15px;color:${C.slate700};">Calculate exactly how many years and dollars you could save with the Chunker Method.</p>
        </div>
      `,
      ctaUrl: '{{ctaUrl}}',
      ctaText: 'Calculate My Savings →',
    }),
  },
  {
    id: 'blueprint_ready',
    subject: 'Your Savings Blueprint is Ready! 📊',
    html: emailWrapper({
      headline: `The Numbers Are In!`,
      headlineColor: C.emeraldDark,
      body: `
        <p style="margin:0 0 16px;">We've analyzed your mortgage details, and the potential for savings is significant.</p>
        <p style="margin:0 0 16px;">Your custom blueprint is securely stored in your account. You can access it anytime using the link below:</p>
        <div style="background:${C.slate100};border-radius:12px;padding:20px 24px;margin:20px 0;">
          <p style="margin:0;font-size:14px;color:${C.slate500};text-transform:uppercase;letter-spacing:0.5px;font-weight:600;">Your Results</p>
          <p style="margin:8px 0 0;font-size:15px;color:${C.slate700};">View your personalized payoff strategy, timeline, and projected interest savings.</p>
        </div>
      `,
      ctaUrl: '{{resultUrl}}',
      ctaText: 'View My Blueprint →',
    }),
  },
  {
    id: 'purchase_confirmation',
    subject: 'Thank You for Your Purchase! 🎉',
    html: emailWrapper({
      headline: `Thank You for Your Purchase!`,
      body: `
        <p style="margin:0 0 16px;">We're excited to help you on your journey to mortgage freedom.</p>
        <div style="background:${C.slate100};border-radius:12px;padding:20px 24px;margin:20px 0;">
          <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0">
            <tr>
              <td style="padding: 6px 0; font-size: 14px; color: ${C.slate500}; text-transform: uppercase; letter-spacing: 0.5px; font-weight: 600;">Product</td>
            </tr>
            <tr>
              <td style="padding: 0 0 12px; font-size: 18px; font-weight: 700; color: ${C.slate900};">{{productName}}</td>
            </tr>
            <tr>
              <td style="padding: 6px 0; font-size: 14px; color: ${C.slate500}; text-transform: uppercase; letter-spacing: 0.5px; font-weight: 600;">Amount Paid</td>
            </tr>
            <tr>
              <td style="padding: 0; font-size: 18px; font-weight: 700; color: ${C.emeraldDark};">{{amount}}</td>
            </tr>
          </table>
        </div>
        <p style="margin:0 0 16px;">If you have any questions, simply reply to this email.</p>
      `,
      ctaUrl: '{{accessUrl}}',
      ctaText: 'Access My Purchase →',
    }),
  },
  {
    id: 'abandoned_questionnaire',
    subject: "Don't Miss Your Savings Blueprint ⏳",
    html: emailWrapper({
      headline: `Don't Leave Your Savings on the Table!`,
      body: `
        <p style="margin:0 0 16px;">Hi {{name}},</p>
        <p style="margin:0 0 16px;">You started your journey to mortgage freedom, but you haven't completed your Savings Blueprint yet.</p>
        <p style="margin:0 0 16px;">In just <strong>60 seconds</strong>, you could see exactly how many years and dollars you could save.</p>
        <div style="background:${C.slate100};border-radius:12px;padding:20px 24px;margin:20px 0;">
          <p style="margin:0;font-size:14px;color:${C.slate500};text-transform:uppercase;letter-spacing:0.5px;font-weight:600;">Did You Know?</p>
          <p style="margin:8px 0 0;font-size:15px;color:${C.slate700};">The average homeowner discovers $30,000–$60,000 in potential interest savings with our blueprint.</p>
        </div>
      `,
      ctaUrl: '{{questionnaireUrl}}',
      ctaText: 'Complete My Blueprint →',
    }),
  },
  // ── 5-Day Mortgage Freedom Challenge Emails ──
  {
    id: 'challenge_day1',
    subject: "Day 1: The $87,000 Interest Trap 💰",
    html: emailWrapper({
      headline: `Welcome to the 5-Day Mortgage Freedom Challenge`,
      body: `
        <p style="margin:0 0 16px;">Hi {{name}},</p>
        <p style="margin:0 0 16px;">Over the next 5 days, I'm going to show you exactly why the banks are praying you never discover this.</p>
        <p style="margin:0 0 16px;">Today, we start with the single most important truth about your mortgage:</p>
        <div style="background:${C.slate100};border-left:4px solid ${C.primary};border-radius:0 12px 12px 0;padding:20px 24px;margin:20px 0;">
          <p style="margin:0;font-size:16px;font-weight:600;color:${C.slate900};line-height:1.6;">The average homeowner loses $87,000 in interest — not because they bought the wrong house, but because they used the wrong payment strategy.</p>
        </div>
        <p style="margin:0 0 16px;">In Day 1, you'll discover the <strong>"Interest Trap"</strong> and why your bank never told you about it.</p>
      `,
      ctaUrl: '{{lesson1Url}}',
      ctaText: 'Watch Day 1 Lesson →',
    }),
  },
  {
    id: 'challenge_day2',
    subject: "Day 2: How much are YOU losing? 📈",
    html: emailWrapper({
      headline: `Day 2: Your Personalized Interest Report`,
      body: `
        <p style="margin:0 0 16px;">Hi {{name}},</p>
        <p style="margin:0 0 16px;">Yesterday you learned how the Interest Trap works. Today, we're making it personal.</p>
        <p style="margin:0 0 16px;">Most homeowners have no idea how much interest they're actually paying over the life of their mortgage.</p>
        <div style="background:${C.slate100};border-radius:12px;padding:20px 24px;margin:20px 0;">
          <p style="margin:0 0 12px;font-size:14px;color:${C.slate500};text-transform:uppercase;letter-spacing:0.5px;font-weight:600;">Real Member Result</p>
          <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0">
            <tr><td style="padding:4px 0;font-size:14px;color:${C.slate700};">Mortgage: $420,000 at 6%</td></tr>
            <tr><td style="padding:4px 0;font-size:14px;color:${C.slate700};">Traditional interest: $486,000</td></tr>
            <tr><td style="padding:4px 0;font-size:14px;color:${C.slate700};">Chunker Method interest: $312,000</td></tr>
            <tr><td style="padding:8px 0 0;font-size:16px;font-weight:700;color:${C.emeraldDark};">Savings: $174,000</td></tr>
          </table>
        </div>
        <p style="margin:0 0 16px;">Your numbers will be different. Let's find out exactly what yours are.</p>
      `,
      ctaUrl: '{{calculatorUrl}}',
      ctaText: 'Calculate My Interest Loss →',
    }),
  },
  {
    id: 'challenge_day3',
    subject: "Day 3: The method banks don't want you to know 🔑",
    html: emailWrapper({
      headline: `Day 3: The Chunker Method Revealed`,
      body: `
        <p style="margin:0 0 16px;">Hi {{name}},</p>
        <p style="margin:0 0 16px;">By now you know how much you're losing. Today I'm going to show you <em>exactly</em> how to stop it.</p>
        <p style="margin:0 0 16px;">The Chunker Method isn't about earning more money. It's not about switching banks. And it's definitely not about refinancing.</p>
        <div style="background:${C.slate100};border-radius:12px;padding:20px 24px;margin:20px 0;">
          <p style="margin:0 0 12px;font-size:14px;color:${C.slate500};text-transform:uppercase;letter-spacing:0.5px;font-weight:600;">In This Lesson</p>
          <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0">
            <tr><td style="padding:6px 0;font-size:15px;color:${C.slate700};">✓ Why checking accounts are the bank's secret weapon against you</td></tr>
            <tr><td style="padding:6px 0;font-size:15px;color:${C.slate700};">✓ How to make your income work 24/7 against your principal</td></tr>
            <tr><td style="padding:6px 0;font-size:15px;color:${C.slate700};">✓ The "Velocity Trick" that cuts 8–12 years off most mortgages</td></tr>
          </table>
        </div>
        <p style="margin:0 0 16px;">But I'm only revealing 70% of the system today. The execution details — the exact scripts, the calculator, the screener — that's for Day 5.</p>
      `,
      ctaUrl: '{{lesson2Url}}',
      ctaText: 'Watch Day 3 Lesson →',
    }),
  },
  {
    id: 'challenge_day4',
    subject: "Day 4: She cut 9 years without switching banks 🏆",
    html: emailWrapper({
      headline: `Day 4: Real Homeowners. Real Results.`,
      body: `
        <p style="margin:0 0 16px;">Hi {{name}},</p>
        <p style="margin:0 0 16px;">The Chunker Method sounds good in theory. But does it actually work in real life?</p>
        <div style="background:${C.slate100};border-radius:12px;padding:20px 24px;margin:20px 0;">
          <p style="margin:0 0 16px;font-size:14px;color:${C.slate500};text-transform:uppercase;letter-spacing:0.5px;font-weight:600;">Success Stories</p>
          <p style="margin:0 0 16px;font-size:15px;color:${C.slate700};line-height:1.6;"><strong style="color:${C.slate900};">Sarah L., Toronto</strong><br/><em>"We shaved 9 years and about $42,000 in interest — without switching banks. The plan paid for itself in month one."</em></p>
          <div style="height:1px;background:${C.slate200};margin:12px 0;"></div>
          <p style="margin:0 0 16px;font-size:15px;color:${C.slate700};line-height:1.6;"><strong style="color:${C.slate900};">Michael R., Calgary</strong><br/><em>"Our plan showed a clear path to being debt-free. We're saving ~$500/month just by redirecting cash flow smarter."</em></p>
          <div style="height:1px;background:${C.slate200};margin:12px 0;"></div>
          <p style="margin:0;font-size:15px;color:${C.slate700};line-height:1.6;"><strong style="color:${C.slate900};">Priya P., Vancouver</strong><br/><em>"I finally see how to beat the interest game. We cut 11 years off our mortgage. This changed our family's timeline forever."</em></p>
        </div>
        <p style="margin:0 0 16px;">These aren't outliers. These are ordinary homeowners who made one strategic change.</p>
        <p style="margin:0 0 16px;"><strong>Tomorrow is the big day.</strong> The complete system opens.</p>
      `,
    }),
  },
  {
    id: 'challenge_day5',
    subject: "Day 5: Your blueprint is ready (doors close soon) 🔥",
    html: emailWrapper({
      headline: `Day 5: The Complete Mortgage Cutter System`,
      body: `
        <p style="margin:0 0 16px;">Hi {{name}},</p>
        <p style="margin:0 0 16px;">Over the past 4 days, you've learned:</p>
        <div style="background:${C.slate100};border-radius:12px;padding:20px 24px;margin:20px 0;">
          <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0">
            <tr><td style="padding:6px 0;font-size:15px;color:${C.slate700};">✓ How the Interest Trap steals $30,000–$60,000 from most families</td></tr>
            <tr><td style="padding:6px 0;font-size:15px;color:${C.slate700};">✓ Exactly how much YOU are projected to lose</td></tr>
            <tr><td style="padding:6px 0;font-size:15px;color:${C.slate700};">✓ The Chunker Method concept</td></tr>
            <tr><td style="padding:6px 0;font-size:15px;color:${C.slate700};">✓ Real proof from homeowners who've already done it</td></tr>
          </table>
        </div>
        <p style="margin:0 0 16px;"><strong>Today, you get the complete system.</strong></p>
        <div style="background:${C.slate100};border-radius:12px;padding:20px 24px;margin:20px 0;">
          <p style="margin:0 0 12px;font-size:14px;color:${C.slate500};text-transform:uppercase;letter-spacing:0.5px;font-weight:600;">What's Included</p>
          <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0">
            <tr><td style="padding:6px 0;font-size:15px;color:${C.slate700};">Full Financial Academy (36 lessons)</td><td style="text-align:right;font-size:14px;color:${C.slate500};">$2,000 value</td></tr>
            <tr><td style="padding:6px 0;font-size:15px;color:${C.slate700};">Chunker Simulator Tool</td><td style="text-align:right;font-size:14px;color:${C.slate500};">$500 value</td></tr>
            <tr><td style="padding:6px 0;font-size:15px;color:${C.slate700};">Bank Screener Tool</td><td style="text-align:right;font-size:14px;color:${C.slate500};">$300 value</td></tr>
            <tr><td style="padding:6px 0;font-size:15px;color:${C.slate700};">Lender Negotiation Scripts</td><td style="text-align:right;font-size:14px;color:${C.slate500};">$200 value</td></tr>
            <tr><td style="padding:6px 0;font-size:15px;color:${C.slate700};">Mortgage Audit Checklist</td><td style="text-align:right;font-size:14px;color:${C.slate500};">$100 value</td></tr>
            <tr><td style="padding:6px 0;font-size:15px;color:${C.slate700};">Private Community Access</td><td style="text-align:right;font-size:14px;color:${C.slate500};">$300 value</td></tr>
            <tr><td style="padding:6px 0;font-size:15px;color:${C.slate700};">Monthly Live Q&A Calls</td><td style="text-align:right;font-size:14px;color:${C.slate500};">$600 value</td></tr>
          </table>
          <div style="height:1px;background:${C.slate200};margin:12px 0;"></div>
          <p style="margin:0;text-align:center;font-size:16px;font-weight:700;color:${C.slate900};">Total Value: $4,000</p>
        </div>
        <p style="margin:0;text-align:center;font-size:28px;font-weight:800;color:${C.primary};letter-spacing:-0.5px;">Today Only: $999</p>
        <p style="margin:4px 0 16px;text-align:center;font-size:14px;color:${C.slate500};">Or 6 payments of $197</p>
      `,
      ctaUrl: '{{salesUrl}}',
      ctaText: 'Get Full Access Now →',
      footerNote: '30-Day Show-Your-Math Guarantee. If the numbers don\'t work for your situation, we\'ll refund every penny.',
    }),
  },
];

async function seedTemplates() {
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

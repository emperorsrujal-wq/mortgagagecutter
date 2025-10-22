// === PricingSection.jsx ===
// Paste inside your comparison/results page and render <PricingSection ... />
// Assumes React environment (Firebase Studio).

import React, { useEffect, useMemo, useState } from "react";

export default function PricingSection({
  // Pass these from your page's calculator result:
  // e.g., results = { interestSaved: 68420, yearsSooner: 6.1, monthlySaving: 950 }
  results = { interestSaved: 0, yearsSooner: 0, monthlySaving: 0 },

  // Current signed-in user:
  userId = "anon",

  // Referral data (fetch from your DB and pass in):
  initialReferralsCount = 0,              // 0..5
  referralLink = "https://mortgagecutter.com/?ref=YOURCODE",

  // Optional: first-seen timestamp for deadline; if not provided we set 72h from now and can store it.
  initialDeadlineTs = null
}) {
  const [referralsCount, setReferralsCount] = useState(initialReferralsCount);
  const [deadlineTs, setDeadlineTs] = useState(initialDeadlineTs);
  const [copied, setCopied] = useState(false);
  const [secondsLeft, setSecondsLeft] = useState(0);
  const [showSharePanel, setShowSharePanel] = useState(false);
  const goal = 5;

  // Create a 72h deadline if one doesn't exist (persist in your DB if you want it sticky).
  useEffect(() => {
    if (!deadlineTs) {
      const ts = Date.now() + 72 * 60 * 60 * 1000; // 72 hours
      setDeadlineTs(ts);
      // TODO: persist to Firestore keyed by userId, e.g. users/{uid}/pricingDeadline
    }
  }, [deadlineTs]);

  // Countdown
  useEffect(() => {
    if (!deadlineTs) return;
    const tick = () => setSecondsLeft(Math.max(0, Math.floor((deadlineTs - Date.now()) / 1000)));
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, [deadlineTs]);

  const countdown = useMemo(() => {
    const s = secondsLeft;
    const d = Math.floor(s / 86400);
    const h = Math.floor((s % 86400) / 3600);
    const m = Math.floor((s % 3600) / 60);
    const ss = s % 60;
    return `${d}d ${h}h ${m}m ${ss}s`;
  }, [secondsLeft]);

  const pct = Math.min(100, Math.round((referralsCount / goal) * 100));
  const eliteUrl = `/purchase?plan=elite_997`;
  const proUrl   = `/purchase?plan=pro_197`;
  // When unlocked: free 3-months applied via query; change to your Stripe/logic as needed:
  const basicUrlLocked   = null; // locked until 5 referrals
  const basicUrlUnlocked = `/purchase?plan=basic_29&trialMonths=3&ref=${encodeURIComponent(userId)}`;

  // Simple confetti (CSS burst)
  const [confetti, setConfetti] = useState(false);
  useEffect(() => {
    if (referralsCount >= goal) {
      setConfetti(true);
      setTimeout(() => setConfetti(false), 3500);
    }
  }, [referralsCount]);

  // Share helpers
  const shareText = `I found a way to cut mortgage interest without changing lifestyle. Try the calculator with your numbers: ${referralLink} — you also get $20 off if you like it.`;
  const enc = encodeURIComponent(shareText);

  const shareTargets = [
    { label: "WhatsApp", href: `https://api.whatsapp.com/send?text=${enc}` },
    { label: "SMS", href: `sms:?&body=${enc}` },
    { label: "Messenger", href: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(referralLink)}` },
    { label: "Email", href: `mailto:?subject=Cut%20your%20mortgage%20interest&body=${enc}` },
  ];

  const copyLink = async () => {
    try {
      await navigator.clipboard.writeText(referralLink);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
      // Optional: toast UI
    } catch (e) {}
  };

  // TODO: wire this to your backend webhook that increments verified referrals.
  const simulateReferral = () => setReferralsCount((c) => Math.min(goal, c + 1));

  const fmtMoney = (n) => n.toLocaleString(undefined, { style: "currency", currency: "USD", maximumFractionDigits: 0 });

  return (
    <section className="mca-pricing">
      <style>{`
        .mca-pricing { font-family: ui-sans-serif, system-ui, -apple-system, "Segoe UI", Roboto, "Helvetica Neue", Arial; color: #0f172a; }
        .mca-container { max-width: 1100px; margin: 24px auto; padding: 0 16px; }
        .mca-banner { background: #eef2ff; border:1px solid #c7d2fe; border-radius: 12px; padding: 16px 18px; display:flex; align-items:center; gap:16px; }
        .mca-badge { background:#6366f1; color:#fff; font-weight:600; padding:6px 10px; border-radius:999px; font-size:12px; }
        .mca-banner h3 { margin:0; font-size:20px; font-weight:700; }
        .mca-banner p { margin:0; color:#334155; font-size:14px; }
        .mca-grid { display:grid; grid-template-columns: repeat(3, 1fr); gap:16px; margin-top:18px; }
        @media (max-width: 900px){ .mca-grid { grid-template-columns: 1fr; } }
        .mca-card { background:#fff; border:1px solid #e5e7eb; border-radius:14px; padding:18px; box-shadow: 0 6px 20px rgba(2,6,23,.06); position:relative; }
        .mca-ribbon { position:absolute; top:12px; right:-6px; background:#fde68a; color:#7c2d12; font-weight:700; padding:6px 10px; border-radius:6px; font-size:12px; transform: rotate(2deg); }
        .mca-price { font-size:36px; font-weight:800; margin:6px 0; }
        .mca-sub { color:#64748b; font-size:12px; margin-left:6px; }
        .mca-bullets { margin:14px 0 16px; padding-left:18px; }
        .mca-bullets li { margin:6px 0; }
        .mca-cta { display:block; width:100%; background:#2563eb; color:#fff; text-align:center; padding:12px; border-radius:10px; font-weight:700; border:none; cursor:pointer; }
        .mca-cta.secondary { background:#fbbf24; color:#111827; }
        .mca-cta:disabled { opacity:.6; cursor:not-allowed; }
        .mca-trust { display:flex; gap:12px; align-items:center; color:#64748b; font-size:12px; margin-top:8px; }
        .mca-refer-wrap { background:#f8fafc; border:1px dashed #cbd5e1; border-radius:12px; padding:12px; margin-top:12px; }
        .mca-progress { background:#e5e7eb; height:8px; border-radius:8px; overflow:hidden; }
        .mca-progress > span { display:block; height:100%; background:#22c55e; width:0%; transition:width .4s ease; }
        .mca-deadline { display:flex; justify-content:space-between; align-items:center; margin-top:8px; font-size:12px; color:#475569; }
        .mca-share { display:flex; flex-wrap:wrap; gap:8px; margin-top:10px; }
        .mca-share a, .mca-copy { background:#e2e8f0; padding:8px 10px; border-radius:8px; font-weight:600; font-size:13px; text-decoration:none; color:#0f172a; }
        .mca-copy { border:none; cursor:pointer; }
        .mca-note { font-size:12px; color:#64748b; margin-top:6px; }
        .mca-confetti { position:fixed; inset:0; pointer-events:none; display:grid; place-items:center; }
        .mca-dot { width:10px; height:10px; background:#22d3ee; border-radius:999px; position:absolute; animation:pop 1s ease forwards; }
        @keyframes pop {
          0% { transform: translate(0,0) scale(0); opacity:1; }
          80% { transform: translate(var(--x), var(--y)) scale(1); opacity:.9; }
          100% { opacity:0; }
        }
        .mca-faq { margin-top:24px; display:grid; gap:10px; }
        .mca-faq-item { background:#f8fafc; border:1px solid #e2e8f0; border-radius:10px; padding:12px; }
        .mca-quote { margin-top:16px; font-style:italic; color:#334155; font-size:14px; }
      `}</style>

      {confetti && <Confetti />}

      <div className="mca-container">
        {/* Personalized savings banner */}
        <div className="mca-banner">
          <span className="mca-badge">With your numbers</span>
          <div>
            <h3>Save up to {fmtMoney(results.interestSaved)} & finish ~{results.yearsSooner?.toFixed?.(1) ?? 0} years sooner</h3>
            <p>Typical payback on Pro: ~{Math.max(1, Math.round((197 / Math.max(1, results.monthlySaving || 100)))).toFixed(0)}–{Math.max(2, Math.round((197 / Math.max(1, results.monthlySaving || 150)))).toFixed(0)} weeks at your current rate.</p>
          </div>
        </div>

        {/* Why it works mini */}
        <div className="mca-card" style={{marginTop:16}}>
          <strong>Why it works</strong>
          <ul className="mca-bullets">
            <li>Front-loads principal reduction to choke future interest.</li>
            <li>Automates cash-flow timing so your money sits fewer days in interest-bearing buckets.</li>
            <li>Bank-agnostic: use your current mortgage/HELOC (U.S. & Canada).</li>
          </ul>
        </div>

        {/* Pricing grid */}
        <div className="mca-grid">
          {/* Elite */}
          <div className="mca-card">
            <div className="mca-ribbon">Most Comprehensive</div>
            <h3>Elite</h3>
            <div className="mca-price">$997 <span className="mca-sub">one-time</span></div>
            <ul className="mca-bullets">
              <li>Full course + tools (lifetime)</li>
              <li>Private onboarding call</li>
              <li>Priority email support</li>
              <li>Advanced readvanceable/HELOC tactics</li>
            </ul>
            <button className="mca-cta" onClick={() => { window.location.href = eliteUrl; }}>
              Get Elite — Start Saving Faster
            </button>
            <div className="mca-trust">
              <span>🔒 Secure Checkout</span><span>🧮 Bank-agnostic</span><span>🇺🇸🇨🇦 US/Canada</span>
            </div>
          </div>

          {/* Pro */}
          <div className="mca-card">
            <div className="mca-ribbon" style={{background:"#86efac", color:"#134e4a"}}>Best Value</div>
            <h3>Pro</h3>
            <div className="mca-price">$197 <span className="mca-sub">one-time</span></div>
            <ul className="mca-bullets">
              <li>Core course + calculator toolkit</li>
              <li>Bank-agnostic guidance (U.S. & Canada)</li>
              <li>Monthly strategy email + annual updates</li>
              <li>Referral dashboard to track progress</li>
            </ul>
            <button className="mca-cta secondary" onClick={() => { window.location.href = proUrl; }}>
              Get Pro — Unlock My Plan
            </button>
            <div className="mca-note">Pays for itself in weeks based on your projection.</div>
          </div>

          {/* Basic with referral gating */}
          <div className="mca-card">
            <h3>Basic</h3>
            <div className="mca-price">$29 <span className="mca-sub">/month</span></div>
            <ul className="mca-bullets">
              <li>Calculator + monthly action plan</li>
              <li>Community Q&A</li>
              <li>Cancel anytime</li>
            </ul>

            {/* Referral progress + countdown */}
            <div className="mca-refer-wrap">
              <strong>Founder Perk:</strong> Invite <b>5 friends</b> → get <b>3 months FREE</b>.
              <div className="mca-progress" aria-label="Referral progress">
                <span style={{ width: `${pct}%` }} />
              </div>
              <div className="mca-deadline">
                <div>🎯 {referralsCount}/{goal} referrals completed</div>
                <div>⏳ Ends in <b>{countdown}</b></div>
              </div>

              {!showSharePanel && (
                <div style={{marginTop:12, display:"flex", gap:8}}>
                  <button className="mca-cta" onClick={() => setShowSharePanel(true)}>
                    Invite Friends — Unlock 3 Months Free
                  </button>
                </div>
              )}

              {showSharePanel && (
                <>
                  <div className="mca-share">
                    {shareTargets.map(t => (
                      <a key={t.label} href={t.href} target="_blank" rel="noreferrer">{t.label}</a>
                    ))}
                    <button className="mca-copy" onClick={copyLink}>{copied ? "Link Copied ✅" : "Copy Link"}</button>
                  </div>
                  <div className="mca-note">Your link: {referralLink}</div>
                  {/* DEV helper to simulate referral callback */}
                  <button className="mca-copy" onClick={simulateReferral}>Simulate +1 referral</button>
                </>
              )}
            </div>

            {/* CTA changes when unlocked */}
            {referralsCount >= goal ? (
              <button className="mca-cta" style={{marginTop:12}} onClick={() => { window.location.href = basicUrlUnlocked; }}>
                Checkout — 3 Months FREE Applied
              </button>
            ) : (
              <button className="mca-cta" style={{marginTop:12}} disabled>
                Unlock with 5 Referrals
              </button>
            )}
            <div className="mca-note">Referrals must verify email to count.</div>
          </div>
        </div>

        {/* Social proof */}
        <div className="mca-grid" style={{marginTop:16}}>
          <div className="mca-card">
            <div className="mca-quote">“Numbers looked too good—until they matched my bank’s amortization. Saved 6+ years.”</div>
            <div style={{fontSize:12, color:"#64748b"}}>— Priya S., Calgary • ~$540k @ 5.1%</div>
          </div>
          <div className="mca-card">
            <div className="mca-quote">“Kept my bank. Re-routed cash flow. Plan paid for itself in month one.”</div>
            <div style={{fontSize:12, color:"#64748b"}}>— David R., Austin • ~$420k @ 6.0%</div>
          </div>
          <div className="mca-card">
            <div className="mca-quote">“The monthly action plan made it simple. We just followed the dates.”</div>
            <div style={{fontSize:12, color:"#64748b"}}>— Nisha & Arjun, Brampton • ~$610k @ 5.4%</div>
          </div>
        </div>

        {/* Guarantee + FAQs */}
        <div className="mca-card" style={{marginTop:16}}>
          <strong>30-Day Show-Your-Math Guarantee</strong>
          <p style={{marginTop:6, color:"#334155"}}>If our math doesn’t align with your lender’s amortization, we fix it or refund.</p>
          <div className="mca-faq">
            <div className="mca-faq-item"><b>Do I need to switch banks?</b><br/>No. Many members use readvanceable setups (e.g., STEP, Home Power Plan) with the same bank.</div>
            <div className="mca-faq-item"><b>Will this hurt my credit?</b><br/>No if you pay on time and keep utilization sensible. We cover best practices.</div>
            <div className="mca-faq-item"><b>Is this debt consolidation?</b><br/>No. It’s timing + principal-first strategy that reduces interest days.</div>
          </div>
        </div>
      </div>
    </section>
  );
}

// Tiny confetti component (no libs)
function Confetti() {
  const dots = Array.from({ length: 40 }, (_, i) => ({
    id: i,
    x: (Math.random() * 2 - 1) * 300 + "px",
    y: (Math.random() * 2 - 1) * 220 + "px",
    color: ["#22d3ee","#a78bfa","#34d399","#fbbf24","#f472b6"][Math.floor(Math.random()*5)]
  }));
  return (
    <div className="mca-confetti">
      {dots.map(d => (
        <span key={d.id} className="mca-dot" style={{ "--x": d.x, "--y": d.y, background:d.color }} />
      ))}
    </div>
  );
}

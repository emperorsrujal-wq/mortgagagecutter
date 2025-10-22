
'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { useEffect, useState, useMemo, Suspense, useCallback } from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  DollarSign,
  Calendar,
  Sparkles,
  TrendingUp,
  Info,
  Loader2,
  AlertCircle,
  PiggyBank,
  Wallet,
  X,
  Copy,
  Share2,
  ChevronRight,
  CheckCircle,
} from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import type { Inputs, Outputs, Debt } from '@/lib/mortgage-types';
import { getSavingsReport } from '@/app/actions';
import { cn } from '@/lib/utils';
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from '@/components/ui/chart';
import { Area, AreaChart, CartesianGrid, XAxis, YAxis } from 'recharts';
import { useUser } from '@/firebase';
import { useToast } from '@/hooks/use-toast';
import { Input } from '@/components/ui/input';
import { firebaseConfig } from '@/firebase/config';

const currencyFormatter = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
  minimumFractionDigits: 0,
  maximumFractionDigits: 0,
});

function StatCard({
  icon: Icon,
  label,
  value,
  color,
  description,
}: {
  icon: React.ElementType;
  label: string;
  value: string | number;
  color?: string;
  description?: string;
}) {
  return (
    <div className="flex items-start gap-4 rounded-lg bg-card p-4 shadow-sm border">
      <div className="rounded-full bg-primary/10 p-3">
        <Icon className={cn('h-6 w-6', color || 'text-primary')} />
      </div>
      <div>
        <div id={label.toLowerCase().replace(/\s/g, '-')} className="text-sm text-muted-foreground">{label}</div>
        <div className="text-2xl font-bold" data-monthly-savings={label === 'Monthly Cash Benefit' ? value : undefined}>{value}</div>
        {description && <p className="text-xs text-muted-foreground mt-1">{description}</p>}
      </div>
    </div>
  );
}

function ComparisonChart({ data }: { data: Outputs['series'] }) {
    const chartData = useMemo(() => {
     if (data.length === 0) return [];
     // only show ~120 points for performance
     const step = Math.max(1, Math.floor(data.length / 120));
     return data.filter((_, i) => i % step === 0);
   }, [data]);
 
   const formatYAxis = (tick: number) => {
     if (tick >= 1000000) return `${(tick / 1000000).toFixed(1)}M`;
     if (tick >= 1000) return `${(tick / 1000).toFixed(0)}K`;
     return tick.toString();
   };

  const formatTooltip = (value: number) => currencyFormatter.format(value);

  return (
    <ChartContainer config={{}} className="min-h-[300px] w-full">
      <AreaChart data={chartData} margin={{ left: 10, right: 10, top: 10, bottom: 10 }}>
        <defs>
          <linearGradient id="colorHeloc" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.8} />
            <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0.1} />
          </linearGradient>
          <linearGradient id="colorBaseline" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="hsl(var(--muted-foreground))" stopOpacity={0.5} />
            <stop offset="95%" stopColor="hsl(var(--muted-foreground))" stopOpacity={0.1} />
          </linearGradient>
        </defs>
        <CartesianGrid vertical={false} strokeDasharray="3 3" />
        <XAxis
          dataKey="month"
          tickFormatter={(tick) => `Yr ${Math.floor(tick / 12)}`}
          tickLine={false}
          axisLine={false}
          interval="preserveStartEnd"
          minTickGap={50}
        />
        <YAxis
          tickFormatter={formatYAxis}
          tickLine={false}
          axisLine={false}
          width={50}
        />
        <ChartTooltip
          cursor={true}
          content={
            <ChartTooltipContent
              labelFormatter={(label) => `Month: ${label}`}
              formatter={(value, name) => [
                formatTooltip(value as number),
                name === 'balanceHeloc' ? 'HELOC Method' : 'Baseline',
              ]}
            />
          }
        />
        <Area
          type="monotone"
          dataKey="balanceBaseline"
          stackId="1"
          stroke="hsl(var(--muted-foreground))"
          fill="url(#colorBaseline)"
          name="Baseline"
        />
        <Area
          type="monotone"
          dataKey="balanceHeloc"
          stackId="2"
          stroke="hsl(var(--primary))"
          fill="url(#colorHeloc)"
          name="HELOC Method"
        />
      </AreaChart>
    </ChartContainer>
  );
}

function NewPricingSection() {
    useEffect(() => {
    const styleElement = document.createElement('style');
    styleElement.innerHTML = `
      #mc-pricing.mcp-wrap{margin-top:28px;font-family:Inter,system-ui,-apple-system,Segoe UI,Roboto,Arial;color:#0f172a}
      #mc-pricing .mcp-heading{font-size:clamp(22px,3vw,30px);font-weight:800;margin:0 0 6px}
      #mc-pricing .mcp-sub{color:#64748b;margin:0 0 16px}
      #mc-pricing .mcp-grid{display:grid;gap:18px;grid-template-columns:repeat(3,minmax(0,1fr))}
      #mc-pricing .mcp-card{position:relative;background:#fff;border:1px solid #e5e7eb;border-radius:14px;padding:18px;box-shadow:0 8px 20px rgba(15,23,42,.06)}
      #mc-pricing .mcp-popular{border-color:#93c5fd}
      #mc-pricing .mcp-ribbon{position:absolute;top:-10px;right:14px;background:#2563eb;color:#fff;font-weight:800;font-size:12px;padding:5px 8px;border-radius:8px}
      #mc-pricing .mcp-title{font-weight:800;font-size:18px;margin-bottom:6px}
      #mc-pricing .mcp-price{font-size:36px;font-weight:900;margin-bottom:8px}
      #mc-pricing .mcp-price span{font-size:13px;font-weight:600;color:#64748b}
      #mc-pricing .mcp-list{margin:10px 0 14px;padding-left:18px}
      #mc-pricing .mcp-list li{margin:6px 0}
      #mc-pricing .mcp-btn{width:100%;background:#2563eb;color:#fff;border:0;border-radius:10px;padding:12px 14px;font-weight:800;cursor:pointer}
      #mc-pricing .mcp-btn.alt{background:#0ea5e9;color:#032030}
      #mc-pricing .mcp-divider{height:1px;background:#eef2f7;margin:14px 0}
      #mc-pricing .mcp-alt-title{font-weight:800;margin-bottom:8px}
      #mc-pricing .mcp-note{color:#64748b;font-size:13px;margin:8px 0 0}
      #mc-pricing .mcp-share{margin-top:16px;background:#f8fafc;border:1px solid #e5e7eb;border-radius:12px;padding:14px}
      #mc-pricing .mcp-share-title{font-weight:800;margin-bottom:10px}
      #mc-pricing .mcp-buttons{display:flex;gap:10px;flex-wrap:wrap}
      #mc-pricing .mcp-share-btn{display:inline-flex;align-items:center;justify-content:center;padding:10px 12px;border-radius:10px;background:#0ea5e9;color:#001423;font-weight:800;text-decoration:none;cursor:pointer}
      #mc-pricing .mcp-share-btn.ghost{background:transparent;border:1px solid #cfe0ff;color:#2563eb}

      #mc-pricing .mcp-progress{margin:18px 0;background:#fff;border:1px solid #e5e7eb;border-radius:12px;padding:14px}
      #mc-pricing .mcp-progress-top{display:flex;justify-content:space-between;align-items:center;margin-bottom:8px}
      #mc-pricing .mcp-progress-title{font-weight:800}
      #mc-pricing .mcp-progress-count{font-weight:900;color:#0ea5e9}
      #mc-pricing .mcp-progress-bar{height:12px;background:#eef2f7;border-radius:999px;overflow:hidden}
      #mc-pricing .mcp-progress-fill{height:100%;background:#2563eb;width:0%;transition:width .35s ease;border-radius:999px}
      #mc-pricing .mcp-progress-note{color:#475569;margin-top:8px}
      #mc-pricing .mcp-share.mcp-pulse { box-shadow: 0 0 0 3px rgba(6, 182, 212, .35); transition: box-shadow .25s; }

      @media (max-width: 980px){#mc-pricing .mcp-grid{grid-template-columns:1fr}}
    `;
    document.head.appendChild(styleElement);

    const loadScript = (src: string, onLoad?: () => void) => {
      if (document.querySelector(`script[src="${src}"]`)) {
        onLoad?.();
        return;
      }
      const script = document.createElement('script');
      script.src = src;
      script.async = true;
      if (onLoad) script.onload = onLoad;
      document.body.appendChild(script);
    };

    const runScripts = () => {
      // Logic from the user prompt's <script> tags
      const scriptElement = document.createElement('script');
      scriptElement.innerHTML = `
      (function(){
        const fbConfig = ${JSON.stringify(firebaseConfig)};
        if (!window.firebase?.apps?.length) {
          try {
            window.firebase.initializeApp(fbConfig);
          } catch(e) { console.error("Failed to initialize Firebase compat", e); }
        }
      })();

      (function(){
        // -------------- SETTINGS --------------
        const CHECKOUT_BASE = "/purchase"; // keep using existing purchase page
        const checkoutFor = (plan) => \`\${CHECKOUT_BASE}?plan=\${encodeURIComponent(plan)}\`;

        const auth = window.firebase.auth();

        // Get ref code from a reliable source if available, otherwise make one up
        const REF_CODE = (window.USER_REF_CODE || auth.currentUser?.uid || "ABC123");
        const REF_LINK = (window.USER_REF_LINK || (location.origin + "/r/" + REF_CODE));

        // ---------- BUY/UNLOCK BUTTONS ----------
        const $ = (id)=>document.getElementById(id);
        $("#mcp-elite")?.addEventListener("click", ()=> location.href = checkoutFor("elite-997"));
        $("#mcp-pro-297")?.addEventListener("click", ()=> location.href = checkoutFor("pro-297"));
        $("#mcp-pro-197")?.addEventListener("click", ()=> {
          document.querySelector("#mc-pricing .mcp-share")?.scrollIntoView({behavior:"smooth",block:"center"});
        });
        $("#mcp-basic-39")?.addEventListener("click", ()=> {
          document.querySelector("#mc-pricing .mcp-share")?.scrollIntoView({behavior:"smooth",block:"center"});
        });

        // ---------- SHARE LINKS (persuasive copy) ----------
        const msg = encodeURIComponent(
          "Quick heads-up: there’s a bank-agnostic way to cut years off a mortgage without changing your lifestyle. " +
          "It uses a HELOC + smarter cash-flow timing. My math matched the bank’s amortization—paid for itself fast. " +
          "Grab $20 off here: " + REF_LINK + " (see your Before/After in 60 seconds)."
        );
        const url = encodeURIComponent(REF_LINK);

        // WhatsApp
        const wa = document.getElementById("mcp-share-wa");
        wa?.setAttribute("href", \`https://wa.me/?text=\${msg}\`); wa?.setAttribute("target","_blank");
        // Messenger
        const fbm = document.getElementById("mcp-share-fbm");
        fbm?.setAttribute("href", \`https://www.facebook.com/dialog/send?app_id=117923735210579&link=\${url}&redirect_uri=\${encodeURIComponent(location.href)}\`);
        fbm?.setAttribute("target","_blank");
        // SMS
        const smsText = encodeURIComponent("Cut years off a mortgage w/ HELOC + smart cash-flow timing. $20 off: " + REF_LINK);
        const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent);
        const sms = document.getElementById("mcp-share-sms");
        sms?.setAttribute("href", \`sms:\${isIOS ? "&" : "?"}body=\${smsText}\`);
        // Telegram
        const tg = document.getElementById("mcp-share-tg");
        tg?.setAttribute("href", \`https://t.me/share/url?url=\${url}&text=\${msg}\`); tg?.setAttribute("target","_blank");
        // Copy
        document.getElementById("mcp-copy")?.addEventListener("click", async ()=>{
          try{ await navigator.clipboard.writeText(REF_LINK);
            const btn = document.getElementById("mcp-copy"); const old = btn.textContent;
            btn.textContent = "Copied!"; setTimeout(()=> btn.textContent = old, 1200);
          }catch(e){}
        });

        // ---------- REFERRAL PROGRESS ----------
        const HAVE = typeof window.USER_REF_HAVE === "number" ? window.USER_REF_HAVE : 0;
        const NEED = typeof window.USER_REF_NEED === "number" ? window.USER_REF_NEED : 5;

        function setProgress(have = 0, need = 5){
          const countEl = document.getElementById("mcp-progress-count");
          const fillEl  = document.getElementById("mcp-progress-fill");
          if (!countEl || !fillEl) return;
          const safeHave = Math.max(0, Math.min(have, need));
          const pct = need > 0 ? (safeHave / need) * 100 : 0;
          countEl.textContent = \`\${safeHave} / \${need}\`;
          fillEl.style.width = pct + "%";

          if (safeHave >= need){
            fillEl.parentElement.classList.add("mcp-unlocked");
          }
        }
        setProgress(HAVE, NEED);
        
        window.addEventListener('referral:update', (e)=>{
          const d = e.detail || {};
          setProgress(typeof d.have==='number'?d.have:0, typeof d.need==='number'?d.need:5);
        });

        const db = window.firebase.firestore();
        let unsubStats = null;
        
        function listenToStats(uid){
            if (typeof unsubStats === 'function') { try { unsubStats(); } catch(e){} }
            const ref = db.doc(\`users/\${uid}/stats/main\`);
            unsubStats = ref.onSnapshot(snap => {
            const d = snap.exists ? snap.data() : {};
            const have = Number(d.shareCount || 0);
            const need = Number(d.shareTarget || 5);
            window.dispatchEvent(new CustomEvent('referral:update', { detail: { have, need }}));
            }, err => console.error('stats listener error', err));
        }

        async function ensureStatsDoc(uid){
            const ref = db.doc(\`users/\${uid}/stats/main\`);
            const snap = await ref.get();
            if (!snap.exists) {
            await ref.set({ shareCount: 0, shareTarget: 5, lastUpdated: window.firebase.firestore.FieldValue.serverTimestamp() });
            } else if (snap.exists && typeof snap.data().shareTarget === 'undefined') {
            await ref.set({ shareTarget: 5 }, { merge: true });
            }
        }

        auth.onAuthStateChanged(async user => {
            if (!user) {
                window.dispatchEvent(new CustomEvent('referral:update', { detail: { have: 0, need: 5 }}));
                return;
            }
            await ensureStatsDoc(user.uid);
            listenToStats(user.uid);
        });

        const CHANNEL_IDS = {
            whatsapp:  'mcp-share-wa',
            messenger: 'mcp-share-fbm',
            sms:       'mcp-share-sms',
            telegram:  'mcp-share-tg',
            copy:      'mcp-copy'
        };

        function alreadyCreditedToday(channel){
            const key = \`mc_shared_\${channel}\`;
            const today = new Date().toISOString().slice(0,10);
            try {
            const val = JSON.parse(localStorage.getItem(key) || 'null');
            return val && val.day === today;
            } catch(e){
            return false;
            }
        }
        function markCreditedToday(channel){
            const key = \`mc_shared_\${channel}\`;
            const today = new Date().toISOString().slice(0,10);
            localStorage.setItem(key, JSON.stringify({ day: today }));
        }

        async function creditShare(channel){
            const user = auth.currentUser;
            if (!user) return;
            if (alreadyCreditedToday(channel)) return;

            try {
            const box = document.querySelector('#mc-pricing .mcp-share');
            if (box) { box.classList.add('mcp-pulse'); setTimeout(()=>box.classList.remove('mcp-pulse'), 800); }
            } catch(e){}

            try {
            const ref = db.doc(\`users/\${user.uid}/stats/main\`);
            await ref.set({
                shareCount: window.firebase.firestore.FieldValue.increment(1),
                lastUpdated: window.firebase.firestore.FieldValue.serverTimestamp()
            }, { merge: true });
            markCreditedToday(channel);
            } catch(err){
            console.error('Failed to credit share', err);
            }
        }

        function safeOpen(url){
            const w = window.open(url, '_blank', 'noopener,noreferrer');
            if (!w) location.href = url;
        }

        function getReferralLink(){
            const el = document.querySelector('[data-referral-link]');
            if (el && el.dataset.referralLink) return el.dataset.referralLink;
            return window.location.href.split('#')[0];
        }

        function attachShareHandlers(){
            const link = encodeURIComponent(getReferralLink());
            const text = encodeURIComponent(
            "I found a smarter way to cut mortgage years using your existing accounts. Run your numbers here:"
            );
            const msg  = \`\${text}%0A\${link}\`;
            const WHATSAPP = \`https://wa.me/?text=\${msg}\`;
            const TELEGRAM = \`https://t.me/share/url?url=\${link}&text=\${text}\`;
            const SMS = \`sms:?&body=\${msg}\`;
            const MESSENGER = \`fb-messenger://share/?link=\${link}\`;

            const w = document.getElementById(CHANNEL_IDS.whatsapp);
            if (w) w.addEventListener('click', () => { safeOpen(WHATSAPP); setTimeout(()=>creditShare('whatsapp'), 1500); });

            const m = document.getElementById(CHANNEL_IDS.messenger);
            if (m) m.addEventListener('click', () => { safeOpen(MESSENGER); setTimeout(()=>creditShare('messenger'), 1500); });

            const s = document.getElementById(CHANNEL_IDS.sms);
            if (s) s.addEventListener('click', () => { location.href = SMS; setTimeout(()=>creditShare('sms'), 1500); });

            const t = document.getElementById(CHANNEL_IDS.telegram);
            if (t) t.addEventListener('click', () => { safeOpen(TELEGRAM); setTimeout(()=>creditShare('telegram'), 1500); });

            const c = document.getElementById(CHANNEL_IDS.copy);
            if (c) c.addEventListener('click', async () => {
                const raw = getReferralLink();
                try {
                    await navigator.clipboard.writeText(\`Smarter mortgage payoff calculator (works with your bank): \${raw}\`);
                    creditShare('copy');
                    c.textContent = 'Copied!';
                    setTimeout(()=>c.textContent='Copy link', 1200);
                } catch(e){
                    prompt('Copy your link:', raw);
                    creditShare('copy');
                }
            });
        }
        attachShareHandlers();
      })();
      `;
      document.body.appendChild(scriptElement);
    }
    
    // Load Firebase scripts then run the main logic
    loadScript("https://www.gstatic.com/firebasejs/10.12.0/firebase-app-compat.js", () => {
        loadScript("https://www.gstatic.com/firebasejs/10.12.0/firebase-auth-compat.js", () => {
            loadScript("https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore-compat.js", runScripts)
        })
    })


    return () => {
      document.head.removeChild(styleElement);
    };
  }, []);

  return (
    <section id="mc-pricing" className="mcp-wrap" aria-label="Purchase Options">
      <h2 className="mcp-heading">Pick your path to mortgage freedom</h2>
      <p className="mcp-sub">Buy today or unlock a discount by sharing your link.</p>

      <div className="mcp-grid">
        <div className="mcp-card">
          <div className="mcp-title">Elite</div>
          <div className="mcp-price">$997 <span>one-time</span></div>
          <ul className="mcp-list">
            <li>Lifetime course + tools</li>
            <li>Priority email support</li>
            <li>Advanced HELOC strategies</li>
          </ul>
          <button id="mcp-elite" className="mcp-btn">Get Elite — $997</button>
        </div>

        <div className="mcp-card mcp-popular">
          <div className="mcp-ribbon">Most popular</div>
          <div className="mcp-title">Pro</div>
          <div className="mcp-price">$297 <span>one-time</span></div>
          <ul className="mcp-list">
            <li>Full toolkit access</li>
            <li>Bank-agnostic guidance (U.S. & Canada)</li>
            <li>Referral dashboard to track progress</li>
          </ul>
          <button id="mcp-pro-297" className="mcp-btn">Buy Pro — $297</button>
          <div className="mcp-divider"></div>
          <div className="mcp-alt">
            <div className="mcp-alt-title">Or unlock a discount:</div>
            <button id="mcp-pro-197" className="mcp-btn alt">Get Pro for $197 <span>(with 5 referrals)</span></button>
            <p className="mcp-note">Price auto-drops to $197 when 5 join any paid plan within 14 days. Already bought Pro? We auto-refund $100.</p>
          </div>
        </div>

        <div className="mcp-card">
          <div className="mcp-title">Basic</div>
          <div className="mcp-price">$39 <span>/month</span></div>
          <ul className="mcp-list">
            <li>Calculator + monthly action plan</li>
            <li>Community Q&amp;A</li>
            <li>Cancel anytime</li>
          </ul>
          <button id="mcp-basic-39" className="mcp-btn">Unlock with 5 Referrals</button>
          <p className="mcp-note">Referral required to activate checkout.</p>
        </div>
      </div>

      <div className="mcp-progress" aria-live="polite" aria-label="Referral progress">
        <div className="mcp-progress-top">
          <span className="mcp-progress-title">Referral progress</span>
          <span id="mcp-progress-count" className="mcp-progress-count">0 / 5</span>
        </div>
        <div className="mcp-progress-bar">
          <div id="mcp-progress-fill" className="mcp-progress-fill" style={{width: '0%'}}></div>
        </div>
        <p className="mcp-progress-note">Friends get <strong>$20 off</strong>. Hit <strong>5 signups</strong> in 14 days to unlock Pro at <strong>$197</strong> or Basic at <strong>$39/mo</strong>.</p>
      </div>

      <div className="mcp-share">
        <div className="mcp-share-title">Share your link to unlock savings</div>
        <div className="mcp-buttons">
          <a id="mcp-share-wa" className="mcp-share-btn" rel="noopener">WhatsApp</a>
          <a id="mcp-share-fbm" className="mcp-share-btn" rel="noopener">Messenger</a>
          <a id="mcp-share-sms" className="mcp-share-btn" rel="noopener">Text</a>
          <a id="mcp-share-tg" className="mcp-share-btn" rel="noopener">Telegram</a>
          <button id="mcp-copy" className="mcp-share-btn ghost">Copy link</button>
        </div>
      </div>
    </section>
  );
}


function InnerComparison() {
  const searchParams = useSearchParams();
  const [data, setData] = useState<Outputs | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { user } = useUser();
  const { toast } = useToast();
  const [formInputs, setFormInputs] = useState<Inputs | null>(null);
  
  const yearsSaved = data ? (data.debtFreeMonthsBaseline - data.debtFreeMonthsHeloc) / 12 : 0;
  const yearsSavedTxt = data ? `${Math.floor(yearsSaved)} yrs, ${Math.round((yearsSaved % 1) * 12)} mo` : 'several years';
  
  const monthlySavings = useMemo(() => {
    if (!data || !data.debtFreeMonthsHeloc || data.debtFreeMonthsHeloc === 0) return 150; // Default
    return Math.max(0, (data.interestBaseline - data.interestHeloc) / data.debtFreeMonthsHeloc);
  }, [data]);

  useEffect(() => {
    if (!data) return;

    const now = {
        debtFreeDate: new Date(Date.now() + data.debtFreeMonthsBaseline * 30.4375 * 24 * 60 * 60 * 1000).toLocaleDateString('en-US', { month: 'short', year: 'numeric'}),
        yearsRemainingMonths: data.debtFreeMonthsBaseline,
        totalInterest: data.interestBaseline,
        monthlyInterest: data.series[0]?.balanceBaseline * (formInputs!.mortgageRateAPR / 12 / 100)
    };

    const plan = {
        debtFreeDate: new Date(Date.now() + data.debtFreeMonthsHeloc * 30.4375 * 24 * 60 * 60 * 1000).toLocaleDateString('en-US', { month: 'short', year: 'numeric'}),
        yearsRemainingMonths: data.debtFreeMonthsHeloc,
        totalInterest: data.interestHeloc,
        monthlyInterest: data.series[0]?.balanceHeloc * (formInputs!.helocRateAPR / 12 / 100)
    };

    const referral = { goal: 5, have: 0 };
    const referralUrl = `${location.origin}/r/${user?.uid || 'ABC123'}`;

    if (window.MCSalesUI) {
         window.MCSalesUI.mount("mc-sales-ui", {
            monthlySavings,
            yearsSaved: yearsSavedTxt,
            now,
            plan,
            prices: { pro: 297, elite: 997 },
            referral,
            referralUrl,
            referralCode: user?.uid || "ABC123"
        });
    }

  },[data, monthlySavings, yearsSavedTxt, formInputs, user]);

  useEffect(() => {
    const params = Object.fromEntries(searchParams.entries());
    const input: Inputs = {
      homeValue: parseFloat(params.homeValue),
      mortgageBalance: parseFloat(params.mortgageBalance),
      mortgageRateAPR: parseFloat(params.mortgageRateAPR),
      amortYearsRemaining: parseInt(params.amortYearsRemaining),
      netMonthlyIncome: parseFloat(params.netMonthlyIncome),
      monthlyExpenses: parseFloat(params.monthlyExpenses),
      debts: params.debts ? JSON.parse(params.debts) : [],
      savings: params.savings ? JSON.parse(params.savings) : { savings: 0, chequing: 0, shortTerm: 0 },
      helocRateAPR: parseFloat(params.helocRateAPR),
      ltvLimit: params.ltvLimit ? parseFloat(params.ltvLimit) : 0.8,
      cardOffset: params.cardOffset === 'true',
    };
    setFormInputs(input);

    async function runCalculation() {
      setIsLoading(true);
      setError(null);
      try {
        const result = await getSavingsReport(input);
        if (result.success) {
          setData(result.report);
        } else {
          setError(result.error);
        }
      } catch (e) {
        setError(e instanceof Error ? e.message : 'An unexpected error occurred.');
      } finally {
        setIsLoading(false);
      }
    }

    runCalculation();
  }, [searchParams]);

  if (isLoading) {
    return (
      <div className="flex flex-col justify-center items-center min-h-[calc(100vh-200px)]">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
        <p className="mt-4 text-lg text-muted-foreground">Building your savings blueprint...</p>
      </div>
    );
  }

  if (error) {
    return (
      <Alert variant="destructive" className="container max-w-2xl my-12">
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>Calculation Error</AlertTitle>
        <AlertDescription>
          <p>We couldn't generate your savings report. Here's the error message:</p>
          <pre className="mt-2 text-xs bg-muted/50 p-2 rounded whitespace-pre-wrap">{error}</pre>
          <Button asChild variant="secondary" size="sm" className="mt-4">
            <Link href="/questionnaire">Go Back and Try Again</Link>
          </Button>
        </AlertDescription>
      </Alert>
    );
  }

  if (!data || !formInputs) return null;

  return (
    <>
      <div className="container mx-auto py-12 px-4">
        <header className="text-center mb-12">
          <h1 className="text-4xl lg:text-5xl font-bold tracking-tight text-primary">
            Your Personalized Savings Blueprint
          </h1>
          <p className="text-xl text-muted-foreground mt-2 max-w-3xl mx-auto">
            Here’s how the Mortgage Cutter Method can accelerate your journey to financial freedom.
          </p>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          <StatCard
            icon={Calendar}
            label="Debt-Free Sooner"
            value={data.debtFreeMonthsBaseline === Infinity ? 'Massively' : yearsSavedTxt}
            description="Time until all consolidated debt is paid off."
          />
          <StatCard
            icon={Sparkles}
            label="Total Interest Saved"
            value={data.interestSaved === Infinity ? 'Potentially Unlimited' : currencyFormatter.format(data.interestSaved)}
            description="The extra money that stays in your pocket."
          />
          <StatCard
            icon={Wallet}
            label="Borrowing Room"
            value={currencyFormatter.format(data.borrowingRoomAfterSetup)}
            description="Initial available credit in your HELOC after setup."
            color="text-green-500"
          />
        </div>

        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Debt Payoff Timeline</CardTitle>
            <CardDescription>Visualizing your journey to zero debt: Baseline vs. HELOC Method.</CardDescription>
          </CardHeader>
          <CardContent>
            {data.series.length > 0 ? <ComparisonChart data={data.series} /> : <p>Could not generate chart data.</p>}
          </CardContent>
        </Card>
        
        <div id="mc-sales-ui"></div>
        <NewPricingSection />


        <Alert className="mt-8 border-primary/50">
          <Info className="h-4 w-4" />
          <AlertTitle className="font-bold">Assumptions & Disclaimers</AlertTitle>
          <AlertDescription className="text-xs mt-2">
            Estimates are for educational purposes and are not a guarantee of savings or loan approval. All debts are assumed to be consolidated into the HELOC. The calculation does not include bank fees, closing costs, or property taxes/insurance. Results depend on your actual income, spending, and final lender terms.
          </AlertDescription>
        </Alert>
      </div>
    </>
  );
}

export function ComparisonDisplay() {
  return (
    <Suspense fallback={<Loader2 className="h-12 w-12 animate-spin text-primary self-center mt-24" />}>
      <InnerComparison />
    </Suspense>
  )
}

    
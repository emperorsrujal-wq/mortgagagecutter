
'use client';
import React, { use } from 'react';
import { CourseProvider, useCourse } from '@/components/course/CourseProvider';
import { lessonMeta } from '@/lib/course/lesson-meta';
import { languages } from '@/lib/course/translations';
import { InterestCalc, AmortViz, PayoffRace } from '@/components/course/Calculators';
import { CourseCard, InfoBox, ExpandSection, StatBox } from '@/components/course/UIComponents';
import { TranslatedText } from '@/components/course/TranslatedText';
import Link from 'next/link';
import { ChevronLeft, ChevronRight, Home, CheckCircle2 } from 'lucide-react';
import { useRouter } from 'next/navigation';

function ProgressBar({ current }: { current: number }) {
  return (
    <div className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-[#E8ECF2]">
      <div className="h-1 bg-slate-100 w-full">
        <div 
          className="h-full bg-[#2563EB] transition-all duration-500" 
          style={{ width: `${(current / 5) * 100}%` }}
        />
      </div>
      <div className="max-w-[720px] mx-auto px-4 h-14 flex items-center justify-between">
        <Link href="/learn" className="flex items-center gap-2 text-[#5A6175] hover:text-[#1A1D26] font-bold text-sm">
          <Home className="h-4 w-4" />
          <span className="hidden sm:inline"><TranslatedText>Course Hub</TranslatedText></span>
        </Link>
        <div className="text-xs font-black uppercase text-slate-400 tracking-widest">
          <TranslatedText>Lesson</TranslatedText> {current} <TranslatedText>of</TranslatedText> 5
        </div>
        <div className="w-20" /> {/* Spacer */}
      </div>
    </div>
  );
}

function LessonContent({ id }: { id: number }) {
  const { country, completeLesson, language, setLanguage } = useCourse();
  const meta = lessonMeta.find(l => l.id === id);
  const router = useRouter();

  if (!meta) return <div>Lesson not found</div>;

  const nextLesson = () => {
    completeLesson(id);
    if (id < 5) router.push(`/learn/lesson/${id + 1}`);
    else router.push('/learn');
  };

  const prevLesson = () => {
    if (id > 1) router.push(`/learn/lesson/${id - 1}`);
    else router.push('/learn');
  };

  return (
    <div className="min-h-screen bg-[#FAFBFD] font-dm-sans pb-24">
      <ProgressBar current={id} />
      
      <div className="max-w-[720px] mx-auto px-4 py-12 space-y-10">
        
        <header className="space-y-2">
          <div className="flex items-center justify-between mb-4">
            <span className="text-xs font-black uppercase tracking-widest text-slate-400 px-3 py-1 bg-slate-100 rounded-full">
              {country.flag} {country.name}
            </span>
            <select 
              value={language}
              onChange={(e) => setLanguage(e.target.value)}
              className="text-xs font-bold border rounded-lg p-1 bg-white outline-none"
            >
              {languages.map(l => (
                <option key={l.code} value={l.code}>{l.name}</option>
              ))}
            </select>
          </div>
          <h1 className="text-3xl md:text-4xl font-fraunces font-black text-[#1A1D26] leading-tight">
            <TranslatedText>{meta.title}</TranslatedText>
          </h1>
          <p className="text-[#5A6175] text-lg">
            <TranslatedText>{id === 1 ? `What your ${country.name} lender hopes you'll never calculate.` : `The day-by-day mechanics of ${country.productShort} in ${country.name}.`}</TranslatedText>
          </p>
        </header>

        {id === 1 && (
          <div className="space-y-8">
            <CourseCard title="🍽️ Imagine walking into a restaurant...">
              <p><TranslatedText>{`The menu says a steak costs ${country.symbol}50. You order it. The waiter smiles and says: "That'll be ${country.symbol}97, please." You'd walk out, right?`}</TranslatedText></p>
              <p><TranslatedText>{`But this is EXACTLY what happens with a traditional home loan. You borrow ${new Intl.NumberFormat('en-US', { style: 'currency', currency: country.currency }).format(country.avgHome)} to buy a home. By the time you finish paying, you've paid nearly DOUBLE that amount.`}</TranslatedText></p>
            </CourseCard>
            
            <InterestCalc />

            <CourseCard title="📊 Where does your monthly payment actually go?">
              <p><TranslatedText>{`Here's the part that shocks everyone: your monthly payment stays the same for ${country.amortYears} years. But in the early years, about 80 to 90 cents of every dollar goes to INTEREST — not to actually paying off your home. The lender gets fed first.`}</TranslatedText></p>
            </CourseCard>

            <AmortViz />

            <CourseCard title={`${country.flag} How ${country.productShort} is different in ${country.name}`}>
              <p><TranslatedText>{country.howItWorks}</TranslatedText></p>
              <div className="space-y-4 pt-4">
                <InfoBox title="Analogy" color="blue"><TranslatedText>{country.analogy}</TranslatedText></InfoBox>
                <InfoBox title={`Tax rules in ${country.name}`} color="amber"><TranslatedText>{country.taxRule}</TranslatedText></InfoBox>
                <InfoBox title="Qualification / Stress test" color="purple"><TranslatedText>{country.stressTest}</TranslatedText></InfoBox>
                <InfoBox title={`Why ${country.name} is special`} color="green"><TranslatedText>{country.uniqueInfo}</TranslatedText></InfoBox>
              </div>
            </CourseCard>

            <CourseCard title={`🏦 ${country.name} Products Available`}>
              {country.products.map((p, i) => (
                <ExpandSection key={i} title={p.name}>{p.desc}</ExpandSection>
              ))}
              <div className="pt-4">
                <p className="text-xs font-bold uppercase text-slate-400 mb-3"><TranslatedText>{`Banks offering ${country.productShort} in ${country.name}:`}</TranslatedText></p>
                <div className="flex flex-wrap gap-2">
                  {country.banks.map(b => <span key={b} className="px-3 py-1 bg-blue-50 text-blue-600 rounded-full text-xs font-bold">{b}</span>)}
                </div>
              </div>
            </CourseCard>
          </div>
        )}

        {id === 2 && (
          <div className="space-y-8">
            <CourseCard title="💡 The simple version (no jargon)">
              <p><TranslatedText>{`Imagine you have a bathtub full of water. The water represents your home loan balance. With a traditional loan, you can only drain the tub by a tiny amount once a month. The rest of the time, the water level stays high and the daily interest fee stays high.`}</TranslatedText></p>
              <p><TranslatedText>{`With a ${country.productShort}, you pour ALL your income into the tub on payday, instantly dropping the level. You scoop it back out to pay bills, but for most of the month, the level is LOWER. Over years, this saves a fortune.`}</TranslatedText></p>
              <div className="mt-4 p-4 bg-emerald-50 border border-emerald-100 rounded-xl text-emerald-800 text-sm font-bold">
                🎯 <TranslatedText>The magic isn't in the interest rate. It's in the DAILY RECALCULATION. Every dollar sitting in the account reduces the interest charged immediately.</TranslatedText>
              </div>
            </CourseCard>

            <PayoffRace />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-red-50 p-6 rounded-2xl border border-red-100 space-y-4">
                <h4 className="font-fraunces font-black text-red-800"><TranslatedText>{`🔒 Traditional ${country.amortYears}-Year Loan`}</TranslatedText></h4>
                <ul className="text-sm space-y-3 text-red-700">
                  <li className="flex gap-2">❌ <TranslatedText>Money goes in monthly, never out</TranslatedText></li>
                  <li className="flex gap-2">❌ <TranslatedText>Zero flexibility for emergencies</TranslatedText></li>
                  <li className="flex gap-2">❌ <TranslatedText>Interest calculated on full balance monthly</TranslatedText></li>
                </ul>
              </div>
              <div className="bg-emerald-50 p-6 rounded-2xl border border-emerald-100 space-y-4">
                <h4 className="font-fraunces font-black text-emerald-800"><TranslatedText>{`🔓 ${country.productName}`}</TranslatedText></h4>
                <ul className="text-sm space-y-3 text-emerald-700">
                  <li className="flex gap-2">✅ <TranslatedText>Money flows freely in AND out</TranslatedText></li>
                  <li className="flex gap-2">✅ <TranslatedText>Full liquidity for opportunities</TranslatedText></li>
                  <li className="flex gap-2">✅ <TranslatedText>Interest recalculated DAILY</TranslatedText></li>
                </ul>
              </div>
            </div>
          </div>
        )}

        {/* Lessons 3, 4, 5 content blocks follow similar pattern */}
        {id > 2 && (
          <div className="py-20 text-center space-y-6">
            <div className="text-6xl">{meta.icon}</div>
            <h2 className="text-2xl font-fraunces font-bold"><TranslatedText>Coming Soon in your region!</TranslatedText></h2>
            <p className="text-slate-500"><TranslatedText>We are currently finalizing the advanced strategies for your selected country.</TranslatedText></p>
          </div>
        )}

        <div className="flex items-center justify-between pt-12 border-t border-[#E8ECF2]">
          <button 
            onClick={prevLesson}
            className="flex items-center gap-2 text-[#5A6175] hover:text-[#1A1D26] font-bold transition-all"
          >
            <ChevronLeft className="h-5 w-5" />
            <TranslatedText>Previous</TranslatedText>
          </button>
          <button 
            onClick={nextLesson}
            className="group flex items-center gap-2 bg-[#2563EB] text-white px-6 py-3 rounded-xl font-bold shadow-lg shadow-blue-200 hover:bg-blue-600 transition-all active:scale-95"
          >
            <TranslatedText>{id === 5 ? "Finish Course" : "Next Lesson"}</TranslatedText>
            <ChevronRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>

      </div>
    </div>
  );
}

export default function Page({ params }: { params: { id: string } }) {
  const id = Number(use(params).id);
  return (
    <CourseProvider>
      <LessonContent id={id} />
    </CourseProvider>
  );
}

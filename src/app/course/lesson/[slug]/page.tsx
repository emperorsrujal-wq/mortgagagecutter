'use client';

import React, { use, useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useUser, useFirestore } from '@/firebase';
import {
  doc,
  getDoc,
  setDoc,
  serverTimestamp,
} from 'firebase/firestore';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import {
  ChevronLeft,
  ChevronRight,
  CheckCircle2,
  Clock,
  Play,
  FileText,
  HelpCircle,
  Wrench,
  ListChecks,
  ArrowRight,
  Loader2,
  Lock,
  Globe,
  CheckCircle,
  AlertTriangle,
  ExternalLink,
  BookOpen,
  Target,
  Zap,
  Home,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { cn } from '@/lib/utils';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { CourseSidebar } from '@/components/course/CourseSidebar';
import { UpgradePaywall } from '@/components/course/UpgradePaywall';
import {
  courseModules,
  allCourseLessons,
  getModuleByLessonSlug,
  getLessonBySlug,
  getAdjacentLessons,
  getCourseProgressPercentage,
  FREE_MODULE_COUNT,
} from '@/lib/course/course-curriculum';
import { countries } from '@/lib/course/countries';

/* ------------------------------------------------------------------ */
/*  Animation helpers                                                  */
/* ------------------------------------------------------------------ */
const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.1, duration: 0.5, ease: 'easeOut' },
  }),
};

/* ------------------------------------------------------------------ */
/*  Quiz Component                                                     */
/* ------------------------------------------------------------------ */
function LessonQuiz({
  question,
  options,
  correctAnswer,
  explanation,
}: {
  question: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
}) {
  const [selected, setSelected] = useState<number | null>(null);
  const [showResult, setShowResult] = useState(false);
  const isCorrect = selected === correctAnswer;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
      className="bg-slate-900/50 border border-white/10 rounded-[24px] p-6 md:p-8 space-y-6"
    >
      <div className="flex items-center gap-3 text-blue-400 font-black text-xs uppercase tracking-[0.2em]">
        <HelpCircle className="h-5 w-5" />
        <span>Knowledge Check</span>
      </div>

      <h3 className="text-xl md:text-2xl font-black text-white leading-tight">
        {question}
      </h3>

      <div className="space-y-3">
        {options.map((opt, i) => (
          <button
            key={i}
            onClick={() => {
              setSelected(i);
              setShowResult(true);
            }}
            disabled={showResult}
            className={cn(
              'w-full text-left p-5 rounded-2xl border-2 transition-all font-bold text-base md:text-lg',
              !showResult &&
                'border-white/10 hover:border-blue-500/40 hover:bg-blue-500/5',
              showResult &&
                i === correctAnswer &&
                'border-emerald-500 bg-emerald-500/10 text-emerald-300',
              showResult &&
                i === selected &&
                i !== correctAnswer &&
                'border-red-500 bg-red-500/10 text-red-300',
              showResult &&
                i !== selected &&
                i !== correctAnswer &&
                'opacity-40 border-white/5'
            )}
          >
            {opt}
          </button>
        ))}
      </div>

      <AnimatePresence>
        {showResult && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className={cn(
              'p-5 rounded-2xl overflow-hidden',
              isCorrect
                ? 'bg-emerald-500/10 text-emerald-300 border border-emerald-500/20'
                : 'bg-red-500/10 text-red-300 border border-red-500/20'
            )}
          >
            <div className="flex items-center gap-2 mb-2 font-black uppercase text-xs tracking-widest">
              {isCorrect ? (
                <CheckCircle2 className="h-4 w-4 text-emerald-400" />
              ) : (
                <AlertTriangle className="h-4 w-4 text-red-400" />
              )}
              <span>{isCorrect ? 'Correct!' : 'Not Quite.'}</span>
            </div>
            <p className="text-sm font-medium leading-relaxed text-slate-300">
              {explanation}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

/* ------------------------------------------------------------------ */
/*  Tool Callout Component                                             */
/* ------------------------------------------------------------------ */
function ToolCallout({
  toolName,
  toolLink,
}: {
  toolName: string;
  toolLink: string;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
      className="relative overflow-hidden rounded-[24px] bg-blue-500/5 border border-blue-500/20 p-6 md:p-8"
    >
      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
        <div className="h-12 w-12 rounded-2xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center shrink-0">
          <Wrench className="h-6 w-6 text-blue-400" />
        </div>
        <div className="flex-1 space-y-1">
          <p className="text-xs font-black text-blue-400 uppercase tracking-widest">
            Interactive Tool
          </p>
          <p className="text-lg font-bold text-white">
            Try the {toolName} to apply this lesson
          </p>
          <p className="text-sm text-slate-400">
            Put what you just learned into practice with our free calculator.
          </p>
        </div>
        <Button
          asChild
          className="shrink-0 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-xl px-5 h-11 shadow-lg shadow-blue-500/20"
        >
          <a
            href={toolLink}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2"
          >
            Open {toolName}
            <ExternalLink className="h-4 w-4" />
          </a>
        </Button>
      </div>
    </motion.div>
  );
}

/* ------------------------------------------------------------------ */
/*  Key Takeaways                                                      */
/* ------------------------------------------------------------------ */
function KeyTakeaways({ items }: { items: string[] }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
      className="bg-slate-900/50 border border-white/10 rounded-[24px] p-6 md:p-8 space-y-5"
    >
      <div className="flex items-center gap-3 text-amber-400 font-black text-xs uppercase tracking-[0.2em]">
        <Target className="h-5 w-5" />
        <span>Key Takeaways</span>
      </div>
      <ul className="space-y-4">
        {items.map((item, i) => (
          <motion.li
            key={i}
            custom={i}
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="flex gap-4 items-start"
          >
            <div className="h-6 w-6 rounded-full bg-amber-500/10 border border-amber-500/20 flex items-center justify-center shrink-0 mt-0.5">
              <CheckCircle2 className="h-3.5 w-3.5 text-amber-400" />
            </div>
            <p className="text-slate-300 text-base font-medium leading-relaxed">
              {item}
            </p>
          </motion.li>
        ))}
      </ul>
    </motion.div>
  );
}

/* ------------------------------------------------------------------ */
/*  Action Items                                                       */
/* ------------------------------------------------------------------ */
function ActionItems({ items }: { items: string[] }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
      className="bg-emerald-500/5 border border-emerald-500/20 rounded-[24px] p-6 md:p-8 space-y-5"
    >
      <div className="flex items-center gap-3 text-emerald-400 font-black text-xs uppercase tracking-[0.2em]">
        <Zap className="h-5 w-5" />
        <span>Action Items</span>
      </div>
      <ul className="space-y-3">
        {items.map((item, i) => (
          <motion.li
            key={i}
            custom={i}
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="flex gap-3 items-start"
          >
            <span className="flex items-center justify-center h-6 w-6 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-black shrink-0 mt-0.5">
              {i + 1}
            </span>
            <p className="text-slate-300 text-base font-medium leading-relaxed">
              {item}
            </p>
          </motion.li>
        ))}
      </ul>
    </motion.div>
  );
}

/* ------------------------------------------------------------------ */
/*  Preview Blur (for paid lessons)                                    */
/* ------------------------------------------------------------------ */
function PreviewBlur() {
  return (
    <div className="relative">
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-slate-950/80 to-slate-950 z-10 pointer-events-none" />
      <div className="blur-[2px] opacity-30 pointer-events-none select-none">
        <div className="space-y-4">
          <div className="h-4 bg-slate-800 rounded w-full" />
          <div className="h-4 bg-slate-800 rounded w-[95%]" />
          <div className="h-4 bg-slate-800 rounded w-[90%]" />
          <div className="h-4 bg-slate-800 rounded w-full" />
          <div className="h-4 bg-slate-800 rounded w-[85%]" />
        </div>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Main Page Component                                                */
/* ------------------------------------------------------------------ */
export default function CourseLessonPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = use(params);
  const { user, isUserLoading } = useUser();
  const firestore = useFirestore();
  const router = useRouter();

  const [selectedCountry, setSelectedCountry] = useState<string>('CA');
  const [completedLessons, setCompletedLessons] = useState<string[]>([]);
  const [isMarking, setIsMarking] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isPurchased, setIsPurchased] = useState(false);
  const [sidebarReady, setSidebarReady] = useState(false);

  const currentModule = getModuleByLessonSlug(slug);
  const currentLesson = getLessonBySlug(slug);
  const { prev: prevLesson, next: nextLesson, currentIndex, total } =
    getAdjacentLessons(slug);

  const lessonNumber = currentIndex + 1;
  const progressPercent = getCourseProgressPercentage(completedLessons);

  /* ---- load progress & purchase status ---- */
  useEffect(() => {
    const cachedCountry = localStorage.getItem('mc_course_country');
    if (cachedCountry) setSelectedCountry(cachedCountry);

    async function loadData() {
      if (isUserLoading) return;

      if (user && firestore) {
        try {
          const docRef = doc(firestore, 'userCourseProgress', user.uid);
          const snap = await getDoc(docRef);
          if (snap.exists()) {
            const data = snap.data();
            if (data.selectedCountry) {
              setSelectedCountry(data.selectedCountry);
              localStorage.setItem('mc_course_country', data.selectedCountry);
            }
            setCompletedLessons(data.completedLessons || []);
            setIsPurchased(data.isPurchased || false);
          }

          /* Check purchases collection for purchase status */
          const purchaseRef = doc(firestore, 'purchases', user.uid);
          const purchaseSnap = await getDoc(purchaseRef);
          if (purchaseSnap.exists()) {
            setIsPurchased(true);
          }
        } catch (e) {
          console.error('Error fetching course progress:', e);
        }
      }

      setIsLoading(false);
      setSidebarReady(true);
    }

    loadData();
  }, [user, firestore, isUserLoading]);

  /* ---- country change ---- */
  const handleCountryChange = async (val: string) => {
    setSelectedCountry(val);
    localStorage.setItem('mc_course_country', val);
    if (user && firestore) {
      await setDoc(
        doc(firestore, 'userCourseProgress', user.uid),
        {
          id: user.uid,
          userId: user.uid,
          email: user.email || '',
          selectedCountry: val,
          lastAccessedAt: serverTimestamp(),
        },
        { merge: true }
      );
    }
  };

  /* ---- mark complete ---- */
  const toggleComplete = async () => {
    if (!user || !firestore || !currentLesson) return;
    setIsMarking(true);

    const docRef = doc(firestore, 'userCourseProgress', user.uid);
    const isCompleted = completedLessons.includes(currentLesson.id);
    const newCompleted = isCompleted
      ? completedLessons.filter((id) => id !== currentLesson.id)
      : [...completedLessons, currentLesson.id];

    await setDoc(
      docRef,
      {
        id: user.uid,
        userId: user.uid,
        email: user.email || '',
        completedLessons: newCompleted,
        lastAccessedAt: serverTimestamp(),
        currentLessonId: currentLesson.id,
        currentModuleId: currentModule?.id,
        currentLessonSlug: currentLesson.slug,
      },
      { merge: true }
    );

    setCompletedLessons(newCompleted);
    setIsMarking(false);
  };

  /* ---- quiz data (hardcoded per lesson) ---- */
  const getQuizData = () => {
    const quizMap: Record<
      string,
      { question: string; options: string[]; correctAnswer: number; explanation: string }
    > = {
      'the-2x-cost-trap': {
        question:
          'On a typical 30-year mortgage, approximately how much will you pay in total?',
        options: [
          'Exactly the loan amount',
          'About 1.5x the loan amount',
          'About 2x the loan amount (once in principal, once in interest)',
          'About 3x the loan amount',
        ],
        correctAnswer: 2,
        explanation:
          'Due to front-loaded amortization, you pay nearly the original loan amount in INTEREST alone over 30 years. That means a $400,000 home actually costs you about $800,000 total.',
      },
      'dirty-history-of-banking': {
        question: 'Why were 30-year mortgages originally created?',
        options: [
          'To help families afford homes',
          'To maximize bank profit through long-term interest collection',
          'Because homes were too expensive for shorter loans',
          'As a government stimulus program',
        ],
        correctAnswer: 1,
        explanation:
          'The 30-year mortgage was designed as a profit engine for banks. The longer the term, the more interest you pay, and amortization front-loads that interest so banks get paid first.',
      },
      'the-mathematical-proof': {
        question:
          'What is the core mathematical principle behind paying off your mortgage in 5-7 years?',
        options: [
          'Winning the lottery',
          'Reducing the average daily balance through strategic cashflow',
          'Refinancing every year for lower rates',
          'Inflation making your debt worthless',
        ],
        correctAnswer: 1,
        explanation:
          'By reducing your average daily balance — through tools like HELOCs and offset accounts — every dollar of your income works to reduce interest calculations 24/7.',
      },
      'the-seven-mortgage-scams': {
        question:
          'Which of these is NOT one of the seven mortgage scams?',
        options: [
          'The "Set It and Forget It" trap',
          'The refinancing treadmill',
          'The bi-weekly payment myth',
          'The zero-down payment strategy',
        ],
        correctAnswer: 3,
        explanation:
          'While zero-down strategies exist, they are not one of the seven classic scams. The real scams include front-loaded amortization, the refinancing trap, bi-weekly payment myths, and more.',
      },
      'the-six-deadly-myths': {
        question:
          'What is the biggest myth about mortgage payoff?',
        options: [
          'You need a 30-year term',
          'Extra payments do not help much',
          'You should wait for lower rates before paying extra',
          'All of the above',
        ],
        correctAnswer: 3,
        explanation:
          'All of these are dangerous myths. The 30-year term is a bank profit tool, extra payments MASSIVELY accelerate payoff, and waiting for rate changes costs you years of progress.',
      },
      'the-secret-scorecard': {
        question: 'What does your credit score REALLY measure?',
        options: [
          'Your wealth and net worth',
          'How profitable you are as a banking customer',
          'Your financial responsibility',
          'Your income level',
        ],
        correctAnswer: 1,
        explanation:
          'Your credit score measures how profitable and reliable you are as a customer for banks — not your actual wealth or financial wisdom.',
      },
    };

    return currentLesson ? quizMap[currentLesson.slug] : null;
  };

  const getTakeaways = (): string[] => {
    const takeawayMap: Record<string, string[]> = {
      'the-2x-cost-trap': [
        'Your 30-year mortgage costs roughly 2x the sticker price once interest is included.',
        'Front-loaded amortization means you pay mostly interest for the first 10-15 years.',
        'Every extra dollar you put toward principal in year 1 saves ~$2 over the life of the loan.',
        'The banks designed this system to maximize their profit, not your financial freedom.',
      ],
      'dirty-history-of-banking': [
        'The 30-year mortgage was invented during the Great Depression as a bank profit tool.',
        'Banks use fractional reserve banking to lend out money they do not actually have.',
        'Amortization schedules are mathematically designed to extract maximum interest upfront.',
        'Understanding this history is the first step toward breaking free from the system.',
      ],
      'the-mathematical-proof': [
        'Reducing your average daily balance is the single most powerful lever for early payoff.',
        'HELOCs and offset accounts let every dollar of income work against your mortgage 24/7.',
        'Small changes in cashflow velocity create massive differences in payoff timeline.',
        'The math works in every country — Canada, USA, UK, and Australia.',
      ],
      'the-seven-mortgage-scams': [
        'The "set it and forget it" approach costs you $100,000+ in unnecessary interest.',
        'Refinancing resets your amortization clock and front-loads interest all over again.',
        'Bi-weekly payments help, but they are a fraction of what is possible with velocity banking.',
        'Every scam has a counter-strategy — once you know the rules, you can beat the game.',
      ],
      'the-six-deadly-myths': [
        'The 30-year mortgage is NOT normal — it is a modern invention designed for bank profit.',
        'You do NOT need to wait for lower rates — strategy beats rate shopping every time.',
        'Your home is NOT just a place to live — it is your most powerful financial tool.',
        'Extra payments of ANY size make a dramatic difference when applied strategically.',
      ],
      'the-secret-scorecard': [
        'Your credit score measures bank profitability, not financial wisdom.',
        'You can boost your score 50+ points in 90 days with the right strategy.',
        'Credit utilization is the fastest lever to pull for immediate score improvement.',
        'A higher score unlocks better rates, which amplifies every other strategy.',
      ],
    };

    return currentLesson ? takeawayMap[currentLesson.slug] || [] : [];
  };

  const getActionItems = (): string[] => {
    const actionMap: Record<string, string[]> = {
      'the-2x-cost-trap': [
        'Look up your current mortgage balance and total interest paid to date.',
        'Use the Mortgage Cost Calculator to see your true total cost.',
        'Calculate how much earlier you would be debt-free with just $100 extra per month.',
      ],
      'dirty-history-of-banking': [
        'Look up when your mortgage was originated and how much principal you have actually paid.',
        'Research your country\'s banking regulations and your rights as a borrower.',
        'Identify one scam from this lesson that applies directly to your situation.',
      ],
      'the-mathematical-proof': [
        'Gather your last 3 months of income and expense data.',
        'Use the calculator to model your exact payoff timeline with the velocity strategy.',
        'Identify your largest discretionary expense that could be redirected to your mortgage.',
      ],
      'the-seven-mortgage-scams': [
        'Review your mortgage statement for any signs of the 7 scams.',
        'If you have refinanced, calculate how much that reset cost you.',
        'Write down the counter-strategy for each scam that applies to you.',
      ],
      'the-six-deadly-myths': [
        'Identify which of the 6 myths you have believed.',
        'Calculate the actual cost of following each myth.',
        'Commit to one new behavior that counteracts your biggest myth.',
      ],
      'the-secret-scorecard': [
        'Pull your free credit report from all three bureaus.',
        'Calculate your current credit utilization ratio.',
        'Pick one action from the 90-day boost plan and do it today.',
      ],
    };

    return currentLesson ? actionMap[currentLesson.slug] || [] : [];
  };

  /* ---- render states ---- */
  if (isUserLoading || isLoading) {
    return (
      <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center text-white">
        <Loader2 className="animate-spin h-12 w-12 text-blue-500 mb-4" />
        <p className="text-slate-400 font-bold uppercase tracking-widest text-xs">
          Loading Your Lesson...
        </p>
      </div>
    );
  }

  if (!currentLesson) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center text-white">
        <div className="text-center space-y-4">
          <BookOpen className="h-16 w-16 text-slate-700 mx-auto" />
          <p className="text-2xl font-black">Lesson not found.</p>
          <Button asChild variant="outline" className="border-white/10 text-white hover:bg-white/5">
            <Link href="/course">Back to Course</Link>
          </Button>
        </div>
      </div>
    );
  }

  const isCompleted = completedLessons.includes(currentLesson.id);
  const quizData = getQuizData();
  const takeaways = getTakeaways();
  const actionItems = getActionItems();
  const isPaidLesson = currentLesson.isPaid;
  const hasAccess = !isPaidLesson || isPurchased;
  const countryConfig = countries[selectedCountry] || countries.CA;
  const countryNameMap: Record<string, string> = { CA: 'Canada', US: 'United States', UK: 'United Kingdom', AU: 'Australia' };
  const displayCountryName = countryNameMap[selectedCountry] || 'Canada';

  /* Lesson type icon */
  const typeIcons: Record<string, React.ReactNode> = {
    video: <Play className="h-3.5 w-3.5" />,
    reading: <FileText className="h-3.5 w-3.5" />,
    quiz: <HelpCircle className="h-3.5 w-3.5" />,
    tool: <Wrench className="h-3.5 w-3.5" />,
    action: <ListChecks className="h-3.5 w-3.5" />,
  };

  const typeLabels: Record<string, string> = {
    video: 'Video Lesson',
    reading: 'Reading',
    quiz: 'Quiz',
    tool: 'Tool Walkthrough',
    action: 'Action Plan',
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-50 font-sans selection:bg-blue-500/30">
      {/* Sidebar */}
      {sidebarReady && (
        <CourseSidebar
          completedLessonIds={completedLessons}
          isPurchased={isPurchased}
        />
      )}

      {/* Main content area (offset for sidebar on desktop) */}
      <div className="lg:ml-80">
        {/* Sticky Navigation Bar */}
        <nav className="sticky top-0 z-40 bg-slate-950/80 backdrop-blur-md border-b border-white/5">
          <div className="max-w-4xl mx-auto px-4 py-3 flex justify-between items-center">
            {/* Breadcrumb */}
            <div className="flex items-center gap-2 text-xs font-bold text-slate-500">
              <Link
                href="/course"
                className="flex items-center gap-1 hover:text-white transition-colors"
              >
                <Home className="h-3.5 w-3.5" />
              </Link>
              <ChevronRight className="h-3 w-3" />
              <span className="uppercase tracking-widest text-slate-600">
                Module {currentModule?.number}
              </span>
              <ChevronRight className="h-3 w-3" />
              <span className="text-slate-400 truncate max-w-[120px] sm:max-w-[200px]">
                {currentLesson.title}
              </span>
            </div>

            {/* Right side: Progress + Country */}
            <div className="flex items-center gap-3">
              {/* Progress */}
              <div className="hidden sm:flex flex-col items-end gap-1">
                <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">
                  {progressPercent}% Complete
                </span>
                <div className="w-28 h-1.5 bg-slate-800 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-blue-500 transition-all duration-500"
                    style={{ width: `${progressPercent}%` }}
                  />
                </div>
              </div>

              {/* Country Selector */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="outline"
                    className="bg-slate-900 border-white/10 text-[10px] font-bold text-blue-400 uppercase tracking-widest h-8 px-3"
                  >
                    <Globe className="mr-2 h-3 w-3" />
                    <span className="hidden sm:inline">
                      {displayCountryName}
                    </span>
                    <span className="sm:hidden">
                      {selectedCountry}
                    </span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent
                  align="end"
                  className="bg-slate-900 border-white/10 text-white min-w-[140px]"
                >
                  {Object.entries(countries).map(([code, config]) => (
                    <DropdownMenuItem
                      key={code}
                      onClick={() => handleCountryChange(code)}
                      className="cursor-pointer hover:bg-white/5 py-2 px-4 focus:bg-white/10"
                    >
                      <span
                        className={cn(
                          'text-xs font-bold',
                          selectedCountry === code
                            ? 'text-blue-400'
                            : 'text-slate-300'
                        )}
                      >
                        {config.flag} {config.name}
                      </span>
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </nav>

        {/* Lesson Content */}
        <article className="max-w-3xl mx-auto px-4 py-12 space-y-12">
          {/* Header */}
          <motion.header
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="space-y-5"
          >
            {/* Meta row */}
            <div className="flex flex-wrap items-center gap-3 text-xs font-black uppercase tracking-widest text-slate-500">
              <span className="flex items-center gap-1.5">
                <Clock className="h-3.5 w-3.5" />
                {currentLesson.duration}m {typeLabels[currentLesson.type]}
              </span>
              <Badge
                variant="secondary"
                className="bg-blue-500/10 text-blue-400 border-none px-2.5 py-0.5 text-[10px]"
              >
                {currentLesson.type}
              </Badge>
              {isPaidLesson && (
                <Badge
                  variant="outline"
                  className="border-amber-500/40 text-amber-400 px-2.5 py-0.5 text-[10px]"
                >
                  PRO
                </Badge>
              )}
              {isCompleted && (
                <Badge
                  variant="secondary"
                  className="bg-emerald-500/10 text-emerald-400 border-none px-2.5 py-0.5 text-[10px]"
                >
                  <CheckCircle2 className="h-3 w-3 mr-1" />
                  Completed
                </Badge>
              )}
            </div>

            {/* Title */}
            <div className="space-y-2">
              <p className="text-sm font-black text-blue-400 uppercase tracking-[0.2em]">
                Lesson {lessonNumber} of {total}
              </p>
              <h1 className="text-3xl md:text-5xl font-black tracking-tight leading-tight text-white">
                {currentLesson.title}
              </h1>
            </div>

            {/* Description */}
            <p className="text-lg md:text-xl text-slate-400 font-medium leading-relaxed max-w-2xl">
              {currentLesson.description}
            </p>

            {/* Lesson progress bar */}
            <div className="pt-2">
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-[10px] font-black text-slate-600 uppercase tracking-widest">
                  Lesson Progress
                </span>
                <span className="text-[10px] font-black text-slate-600">
                  {lessonNumber}/{total}
                </span>
              </div>
              <div className="w-full h-2 bg-slate-900 rounded-full overflow-hidden border border-white/5">
                <div
                  className="h-full bg-blue-500 transition-all duration-700"
                  style={{ width: `${(lessonNumber / total) * 100}%` }}
                />
              </div>
            </div>
          </motion.header>

          {/* Video Placeholder (for video lessons) */}
          {currentLesson.type === 'video' && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="relative aspect-video rounded-[24px] overflow-hidden bg-slate-900 border border-white/10 group cursor-pointer"
            >
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="relative">
                  {/* Pulsing ring */}
                  <motion.div
                    animate={{ scale: [1, 1.3, 1], opacity: [0.3, 0, 0.3] }}
                    transition={{ duration: 2, repeat: Infinity }}
                    className="absolute inset-0 rounded-full bg-blue-500/20"
                  />
                  <div className="relative h-20 w-20 rounded-full bg-blue-600 flex items-center justify-center shadow-2xl shadow-blue-500/30 group-hover:scale-110 transition-transform">
                    <Play className="h-8 w-8 text-white fill-white ml-1" />
                  </div>
                </div>
              </div>
              <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-slate-950/90 to-transparent">
                <p className="text-white font-bold text-lg">
                  {currentLesson.title}
                </p>
                <p className="text-slate-400 text-sm">
                  {currentLesson.duration} minutes
                </p>
              </div>
              {/* Lock overlay for paid */}
              {!hasAccess && (
                <div className="absolute inset-0 bg-slate-950/70 backdrop-blur-sm flex items-center justify-center z-10">
                  <div className="text-center space-y-3">
                    <Lock className="h-10 w-10 text-amber-400 mx-auto" />
                    <p className="text-white font-black text-lg">
                      Upgrade to Unlock
                    </p>
                    <p className="text-slate-400 text-sm">
                      This video is part of the Pro course
                    </p>
                  </div>
                </div>
              )}
            </motion.div>
          )}

          {/* Main Content */}
          <div className="space-y-10">
            {hasAccess ? (
              <>
                {/* Free content — full */}
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.5, delay: 0.2 }}
                  className="prose prose-invert prose-slate max-w-none"
                >
                  <LessonContent
                    slug={currentLesson.slug}
                    countryName={displayCountryName}
                    countryConfig={countryConfig}
                  />
                </motion.div>

                {/* Tool Callout */}
                {currentLesson.hasToolCallout &&
                  currentLesson.toolName &&
                  currentLesson.toolLink && (
                    <ToolCallout
                      toolName={currentLesson.toolName}
                      toolLink={currentLesson.toolLink}
                    />
                  )}

                {/* Key Takeaways */}
                {takeaways.length > 0 && <KeyTakeaways items={takeaways} />}

                {/* Quiz */}
                {currentLesson.hasQuiz && quizData && (
                  <LessonQuiz
                    question={quizData.question}
                    options={quizData.options}
                    correctAnswer={quizData.correctAnswer}
                    explanation={quizData.explanation}
                  />
                )}

                {/* Action Items */}
                {actionItems.length > 0 && (
                  <ActionItems items={actionItems} />
                )}
              </>
            ) : (
              <>
                {/* Preview content (first ~30%) */}
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.5, delay: 0.2 }}
                  className="prose prose-invert prose-slate max-w-none"
                >
                  <LessonContentPreview
                    slug={currentLesson.slug}
                    countryName={displayCountryName}
                    countryConfig={countryConfig}
                  />
                </motion.div>

                {/* Preview blur + paywall */}
                <PreviewBlur />
                <UpgradePaywall />
              </>
            )}
          </div>

          {/* Navigation Bar */}
          <div className="pt-8 border-t border-white/5 space-y-8">
            {/* Main nav buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-between items-center">
              {/* Previous */}
              {prevLesson ? (
                <Button
                  asChild
                  variant="outline"
                  className="w-full sm:w-auto h-12 px-6 font-bold border-white/10 hover:bg-white/5 text-slate-300 hover:text-white rounded-xl"
                >
                  <Link href={`/course/lesson/${prevLesson.slug}`}>
                    <ChevronLeft className="mr-2 h-4 w-4" />
                    <span className="hidden sm:inline">Previous: </span>
                    <span className="truncate max-w-[150px]">
                      {prevLesson.title}
                    </span>
                  </Link>
                </Button>
              ) : (
                <div />
              )}

              {/* Mark Complete */}
              <Button
                size="lg"
                onClick={toggleComplete}
                disabled={isMarking}
                className={cn(
                  'w-full sm:w-auto px-8 h-14 text-base font-black rounded-2xl transition-all shadow-2xl active:scale-95',
                  isCompleted
                    ? 'bg-emerald-600 hover:bg-emerald-700 text-white'
                    : 'bg-blue-600 hover:bg-blue-500 text-white'
                )}
              >
                {isMarking ? (
                  <Loader2 className="animate-spin h-5 w-5" />
                ) : isCompleted ? (
                  <>
                    <CheckCircle2 className="mr-2 h-5 w-5" />
                    Completed
                  </>
                ) : (
                  'Mark as Complete'
                )}
              </Button>

              {/* Next */}
              {nextLesson ? (
                <Button
                  asChild
                  variant="outline"
                  className={cn(
                    'w-full sm:w-auto h-12 px-6 font-bold rounded-xl transition-all',
                    nextLesson.isPaid && !isPurchased
                      ? 'border-amber-500/30 hover:bg-amber-500/5 text-amber-400'
                      : 'border-white/10 hover:bg-white/5 text-slate-300 hover:text-white'
                  )}
                >
                  <Link href={`/course/lesson/${nextLesson.slug}`}>
                    <span className="truncate max-w-[150px]">
                      {nextLesson.isPaid && !isPurchased && (
                        <Lock className="inline mr-1 h-3 w-3" />
                      )}
                      {nextLesson.title}
                    </span>
                    <ChevronRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              ) : (
                <div />
              )}
            </div>

            {/* If last lesson, show graduation */}
            {!nextLesson && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-center p-8 bg-emerald-500/5 border border-emerald-500/20 rounded-[24px] space-y-4"
              >
                <CheckCircle className="h-12 w-12 text-emerald-400 mx-auto" />
                <h3 className="text-xl font-black text-white">
                  Course Complete!
                </h3>
                <p className="text-slate-400 text-sm max-w-md mx-auto">
                  You have completed all {total} lessons. You now have the
                  knowledge to pay off your mortgage in 5-7 years instead of 30.
                </p>
                <Button
                  asChild
                  className="bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-xl px-6 h-11"
                >
                  <Link href="/">
                    <Home className="mr-2 h-4 w-4" />
                    Back to Dashboard
                  </Link>
                </Button>
              </motion.div>
            )}

            {/* Free lesson: subtle upgrade teaser at bottom */}
            {!isPaidLesson && !isPurchased && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5 }}
                className="bg-slate-900/50 border border-white/5 rounded-[24px] p-6 text-center space-y-3"
              >
                <div className="flex items-center justify-center gap-2 text-amber-400">
                  <Lock className="h-4 w-4" />
                  <span className="text-sm font-black uppercase tracking-widest">
                    6 Premium Modules Available
                  </span>
                </div>
                <p className="text-slate-400 text-sm max-w-md mx-auto">
                  Upgrade to unlock Credit Mastery, Bank Selection, Advanced
                  Acceleration, and your personalized 90-day action plan.
                </p>
                <Button
                  asChild
                  variant="outline"
                  className="border-amber-500/30 text-amber-400 hover:bg-amber-500/10 font-bold rounded-xl"
                >
                  <a
                    href="https://buy.stripe.com/5kQeVe4qg2Z79MG3vu00006"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Upgrade to Pro — $297
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </a>
                </Button>
              </motion.div>
            )}
          </div>
        </article>

        {/* Footer spacer */}
        <div className="h-12" />
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Lesson Content Renderer (full)                                     */
/* ------------------------------------------------------------------ */
function LessonContent({
  slug,
  countryName,
  countryConfig,
}: {
  slug: string;
  countryName: string;
  countryConfig: (typeof countries)['CA'];
}) {
  switch (slug) {
    case 'the-2x-cost-trap':
      return <CostTrapContent country={countryName} config={countryConfig} />;
    case 'dirty-history-of-banking':
      return <BankingHistoryContent country={countryName} />;
    case 'the-mathematical-proof':
      return <MathProofContent country={countryName} config={countryConfig} />;
    case 'the-seven-mortgage-scams':
      return <ScamsContent country={countryName} />;
    case 'the-six-deadly-myths':
      return <MythsContent country={countryName} />;
    case 'the-secret-scorecard':
      return <ScorecardContent country={countryName} />;
    default:
      return <GenericLessonContent slug={slug} country={countryName} />;
  }
}

/* ------------------------------------------------------------------ */
/*  Lesson Content Preview (first 30% for paid previews)               */
/* ------------------------------------------------------------------ */
function LessonContentPreview({
  slug,
  countryName,
}: {
  slug: string;
  countryName: string;
  countryConfig: (typeof countries)['CA'];
}) {
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-black text-white">Preview</h2>
      <div className="p-6 bg-blue-500/5 border border-blue-500/20 rounded-2xl">
        <p className="text-blue-400 font-black text-xs uppercase tracking-widest mb-2">
          Preview Start
        </p>
        <p className="text-slate-300 leading-relaxed">
          This is a preview of the premium lesson. Upgrade to Pro to access the
          full content, interactive tools, quizzes, and your personalized action
          plan.
        </p>
      </div>
      <p className="text-slate-300 leading-relaxed">
        Welcome to the premium module for {countryName}. In this lesson, we
        dive deep into advanced strategies that build on everything you learned
        in the free modules. These techniques have helped over 10,000
        homeowners cut years off their mortgage.
      </p>
      <p className="text-slate-300 leading-relaxed">
        The strategies in this module are country-specific and take into account
        the unique banking regulations, tax laws, and financial products
        available in {countryName}. We will walk you through each step with
        real examples and give you the exact tools to implement immediately.
      </p>
    </div>
  );
}

/* ================================================================== */
/*  Individual lesson content components                               */
/* ================================================================== */

function CostTrapContent({
  country,
  config,
}: {
  country: string;
  config: (typeof countries)['CA'];
}) {
  return (
    <div className="space-y-10">
      <section className="space-y-4">
        <h2 className="text-2xl md:text-3xl font-black text-white tracking-tight">
          The Most Expensive Lie You Believe
        </h2>
        <p className="text-slate-300 text-lg leading-relaxed">
          When you bought your home in {country}, you probably focused on the
          purchase price. A ${(config.avgHome / 1000000).toFixed(1)}M home. But
          here is what no one told you: with a traditional {config.amortYears}
          -year mortgage at the average rate of {config.avgRate}%, that home
          will cost you nearly <strong className="text-white">$2M</strong> by
          the time you are done paying for it.
        </p>
        <p className="text-slate-300 text-lg leading-relaxed">
          This is not a typo. It is not a miscalculation. It is the mathematical
          reality of front-loaded amortization — a system banks designed to
          extract maximum profit from your hard work.
        </p>
      </section>

      <section className="space-y-4">
        <h2 className="text-2xl md:text-3xl font-black text-white tracking-tight">
          How Amortization Steals Your Future
        </h2>
        <p className="text-slate-300 text-lg leading-relaxed">
          In the first 5 years of your mortgage, approximately{' '}
          <strong className="text-white">75-80% of every payment</strong> goes
          to interest — not principal. The bank gets paid first. You get equity
          crumbs. By year 10, you have barely made a dent in the actual loan
          balance, despite paying hundreds of thousands in {config.currency}.
        </p>
        <p className="text-slate-300 text-lg leading-relaxed">
          This is by design. The amortization schedule is not a neutral
          mathematical tool — it is a wealth transfer mechanism. It transfers
          wealth from your family to the bank shareholders, one payment at a
          time, for decades.
        </p>
      </section>

      <section className="space-y-4">
        <h2 className="text-2xl md:text-3xl font-black text-white tracking-tight">
          The {country}-Specific Reality
        </h2>
        <p className="text-slate-300 text-lg leading-relaxed">
          In {country}, the average home price is {config.symbol}
          {config.avgHome.toLocaleString()} and the average mortgage rate is{' '}
          {config.avgRate}%. With a typical {config.amortYears}-year
          amortization, the total interest paid exceeds the original loan
          amount. The system here is regulated by {config.regulatedBy}, but
          those regulations protect the banks, not you.
        </p>
        <p className="text-slate-300 text-lg leading-relaxed">
          The good news? {country} offers some of the most powerful tools for
          breaking free — including {config.productName}, which we will show
          you how to weaponize against your mortgage.
        </p>
      </section>

      <section className="space-y-4">
        <h2 className="text-2xl md:text-3xl font-black text-white tracking-tight">
          What the Numbers Really Look Like
        </h2>
        <p className="text-slate-300 text-lg leading-relaxed">
          Let us break down a typical {country} mortgage scenario. A {config.symbol}
          {config.avgHome.toLocaleString()} home with a 20% down payment means
          a {config.symbol}{(config.avgHome * 0.8).toLocaleString()} mortgage.
          At {config.avgRate}% over {config.amortYears} years, your monthly
          payment is approximately {config.symbol}
          {Math.round(config.avgHome * 0.8 * (config.avgRate / 100 / 12) / (1 - Math.pow(1 + config.avgRate / 100 / 12, -config.amortYears * 12))).toLocaleString()}
          . But here is the killer: over the life of the loan, you will pay
          roughly {config.symbol}
          {(config.avgHome * 0.8 * 0.8).toLocaleString()} in INTEREST ALONE.
        </p>
        <p className="text-slate-300 text-lg leading-relaxed">
          That interest amount? It is enough to buy a second home. Or fund a
          decade of retirement. Or pay for three college educations. Instead, it
          goes straight to the bank.
        </p>
      </section>
    </div>
  );
}

function BankingHistoryContent({ country }: { country: string }) {
  return (
    <div className="space-y-10">
      <section className="space-y-4">
        <h2 className="text-2xl md:text-3xl font-black text-white tracking-tight">
          The Invention of Modern Banking
        </h2>
        <p className="text-slate-300 text-lg leading-relaxed">
          To understand why your mortgage is designed to bleed you dry, you need
          to understand where the system came from. Modern banking traces its
          roots to medieval Italy, but the 30-year mortgage — the primary weapon
          in the bank arsenal — was born during the Great Depression in the
          United States.
        </p>
        <p className="text-slate-300 text-lg leading-relaxed">
          Before the 1930s, mortgages were short-term loans — typically 5-10
          years — with a large balloon payment at the end. When the Depression
          hit, millions lost their homes because they could not make that final
          payment. The government stepped in and created the 30-year
          amortizing mortgage. It seemed like a gift to homeowners. It was
          actually a gift to banks.
        </p>
      </section>

      <section className="space-y-4">
        <h2 className="text-2xl md:text-3xl font-black text-white tracking-tight">
          The Great Deception
        </h2>
        <p className="text-slate-300 text-lg leading-relaxed">
          The 30-year mortgage solved the foreclosure crisis by stretching
          payments over a generation. But it came with a hidden cost:{' '}
          <strong className="text-white">compound interest</strong>. By
          extending the term from 10 to 30 years, banks multiplied their profit
          by 300% or more. A loan that would have generated $50,000 in interest
          now generated $200,000+.
        </p>
        <p className="text-slate-300 text-lg leading-relaxed">
          The system was so profitable that banks lobbied to make 30-year
          mortgages the standard. They created the narrative that "everyone
          gets a 30-year mortgage" until it became cultural truth. But it is
          not truth. It is marketing.
        </p>
      </section>

      <section className="space-y-4">
        <h2 className="text-2xl md:text-3xl font-black text-white tracking-tight">
          How the System Spread to {country}
        </h2>
        <p className="text-slate-300 text-lg leading-relaxed">
          The American banking model spread worldwide. {country} adopted the
          same amortization structures, the same front-loaded interest, and the
          same cultural narrative. The banks in {country} operate under their
          own regulatory framework, but the underlying mathematics are
          identical: stretch the term, front-load the interest, maximize profit.
        </p>
        <p className="text-slate-300 text-lg leading-relaxed">
          The only thing that changed from country to country was the packaging.
          Different product names. Different regulations. Same extraction
          mechanism.
        </p>
      </section>

      <section className="space-y-4">
        <h2 className="text-2xl md:text-3xl font-black text-white tracking-tight">
          Fractional Reserve Banking: The Magic Trick
        </h2>
        <p className="text-slate-300 text-lg leading-relaxed">
          Here is where it gets truly wild. When a bank lends you money for a
          mortgage, they are not lending you someone else deposits. They are
          creating that money out of thin air through fractional reserve
          banking. For every dollar they hold in deposits, they can lend out 10,
          20, or even 30 dollars.
        </p>
        <p className="text-slate-300 text-lg leading-relaxed">
          So when you pay $500,000 in interest over 30 years, you are paying
          that interest on money that the bank literally created with a few
          keystrokes. They took no risk. They provided no real value. They
          simply had the legal privilege to create credit, and you spend your
          entire working life paying them for that privilege.
        </p>
      </section>
    </div>
  );
}

function MathProofContent({
  country,
  config,
}: {
  country: string;
  config: (typeof countries)['CA'];
}) {
  return (
    <div className="space-y-10">
      <section className="space-y-4">
        <h2 className="text-2xl md:text-3xl font-black text-white tracking-tight">
          The Math Does Not Lie
        </h2>
        <p className="text-slate-300 text-lg leading-relaxed">
          Here is the single most important equation in mortgage acceleration:
          every dollar you reduce from your average daily balance saves you
          interest immediately. Not at the end of the year. Not when your
          mortgage renews. <strong className="text-white">Immediately.</strong>
        </p>
        <p className="text-slate-300 text-lg leading-relaxed">
          In {country}, mortgage interest is calculated daily on your remaining
          balance. If you owe {config.symbol}
          {(config.avgHome * 0.8).toLocaleString()} at {config.avgRate}%, the
          bank charges you approximately {config.symbol}
          {Math.round((config.avgHome * 0.8 * config.avgRate) / 100 / 365).toLocaleString()} in
          interest EVERY SINGLE DAY. That is {config.symbol}
          {Math.round((config.avgHome * 0.8 * config.avgRate) / 100 / 30).toLocaleString()} per
          month in pure interest before you even touch the principal.
        </p>
      </section>

      <section className="space-y-4">
        <h2 className="text-2xl md:text-3xl font-black text-white tracking-tight">
          The Velocity Banking Principle
        </h2>
        <p className="text-slate-300 text-lg leading-relaxed">
          Traditional thinking says: make extra payments when you can. Velocity
          banking says: make EVERY dollar of your income work against your
          mortgage 24/7. Here is how it works:
        </p>
        <ol className="space-y-3 list-decimal list-inside">
          <li className="text-slate-300 text-lg leading-relaxed">
            <strong className="text-white">
              Deposit your entire paycheque
            </strong>{' '}
            into a {config.productShort} or offset account linked to your mortgage.
          </li>
          <li className="text-slate-300 text-lg leading-relaxed">
            <strong className="text-white">
              Pay expenses from the same account
            </strong>{' '}
            — your balance naturally fluctuates, but every dollar sitting in the
            account reduces your daily interest.
          </li>
          <li className="text-slate-300 text-lg leading-relaxed">
            <strong className="text-white">
              The result:
            </strong>{' '}
            your average daily balance drops by thousands, and your interest
            charges collapse.
          </li>
        </ol>
      </section>

      <section className="space-y-4">
        <h2 className="text-2xl md:text-3xl font-black text-white tracking-tight">
          Real Numbers for {country}
        </h2>
        <p className="text-slate-300 text-lg leading-relaxed">
          Let us say you earn {config.symbol}
          {config.avgIncome.toLocaleString()} per month after tax in {country}.
          With traditional banking, that money sits in a checking account earning
          0% while your mortgage costs {config.avgRate}%. The spread is
          literally {config.avgRate}% — and it is bleeding you every day.
        </p>
        <p className="text-slate-300 text-lg leading-relaxed">
          With velocity banking, that same {config.symbol}
          {config.avgIncome.toLocaleString()} sits against your mortgage
          balance for an average of 15 days per month. Even with normal
          expenses, you are reducing your average balance by {config.symbol}
          {(config.avgIncome * 0.3).toLocaleString()}+ per month. Over a year,
          that adds up to hundreds of thousands in interest savings and years
          off your mortgage.
        </p>
      </section>

      <section className="space-y-4">
        <h2 className="text-2xl md:text-3xl font-black text-white tracking-tight">
          The 5-7 Year Timeline Is Real
        </h2>
        <p className="text-slate-300 text-lg leading-relaxed">
          We have run the numbers for thousands of {country} homeowners. The
          average payoff timeline with velocity banking and income optimization
          is 5-7 years — compared to the standard {config.amortYears}-year
          sentence. That is not a typo. That is 18-20 years of freedom
          reclaimed.
        </p>
        <p className="text-slate-300 text-lg leading-relaxed">
          The math is not magic. It is just math. And once you see it, you
          cannot unsee it. That is why the banks do not want you to know this.
          Because informed homeowners are the worst customers.
        </p>
      </section>
    </div>
  );
}

function ScamsContent({ country }: { country: string }) {
  return (
    <div className="space-y-10">
      <section className="space-y-4">
        <h2 className="text-2xl md:text-3xl font-black text-white tracking-tight">
          The Seven Mortgage Scams Banks Use in {country}
        </h2>
        <p className="text-slate-300 text-lg leading-relaxed">
          Banks have spent decades perfecting the art of keeping you in debt.
          Here are the seven most destructive scams they use — and more
          importantly, how to beat each one.
        </p>
      </section>

      {[
        {
          name: 'Scam #1: The "Set It and Forget It" Trap',
          desc: 'Banks want you to set up automatic payments and never think about your mortgage again. Why? Because every month you do not optimize, they extract maximum interest. The autopay feature is not for your convenience — it is for their profit.',
        },
        {
          name: 'Scam #2: Front-Loaded Amortization',
          desc: 'In the first 10 years, 70-80% of every payment goes to interest. Banks know most people move or refinance within 7 years — so they designed the system to extract interest FIRST, before you build any real equity.',
        },
        {
          name: 'Scam #3: The Refinancing Treadmill',
          desc: 'Every time you refinance, your amortization clock resets. Banks market "lower rates" as savings, but resetting from year 8 back to year 0 of a 30-year term means you start paying mostly interest all over again.',
        },
        {
          name: 'Scam #4: Bi-Weekly Payment Myths',
          desc: 'Banks promote bi-weekly payments as an "acceleration strategy." The truth? It helps, but it is a tiny fraction of what is possible. They promote it because it sounds helpful while keeping you locked in their system.',
        },
        {
          name: 'Scam #5: Hidden Fees and Junk Charges',
          desc: 'From application fees to appraisal fees to "administrative" charges, banks layer on costs that add thousands to your mortgage. Most homeowners never question them.',
        },
        {
          name: 'Scam #6: The Rate Shopping Distraction',
          desc: 'Banks want you obsessed with finding a 0.1% lower rate. While you hunt for better rates, you ignore the strategies that matter 100x more: cashflow velocity, offset accounts, and principal reduction.',
        },
        {
          name: 'Scam #7: Mortgage Insurance That Protects the Bank',
          desc: 'CMHC insurance, PMI, and similar products do not protect YOU — they protect the BANK if you default. You pay the premiums. They get the protection. It is a one-sided bet, and you are not the house.',
        },
      ].map((scam, i) => (
        <section key={i} className="space-y-3">
          <h3 className="text-xl font-black text-white">{scam.name}</h3>
          <p className="text-slate-300 text-lg leading-relaxed">{scam.desc}</p>
        </section>
      ))}

      <section className="space-y-4">
        <h2 className="text-2xl md:text-3xl font-black text-white tracking-tight">
          The Antidote: Knowledge + Action
        </h2>
        <p className="text-slate-300 text-lg leading-relaxed">
          Every scam has a counter-strategy. In the modules ahead, we will give
          you the exact playbook to neutralize each one. But the first step is
          simply knowing the game is being played. Now you know. And now you
          can fight back.
        </p>
      </section>
    </div>
  );
}

function MythsContent({ country }: { country: string }) {
  return (
    <div className="space-y-10">
      <section className="space-y-4">
        <h2 className="text-2xl md:text-3xl font-black text-white tracking-tight">
          Six Lies That Cost You Hundreds of Thousands
        </h2>
        <p className="text-slate-300 text-lg leading-relaxed">
          These myths are so deeply embedded in {country} culture that most
          people never question them. They are repeated by parents, bankers,
          real estate agents, and the media. But they are designed to keep you
          docile, indebted, and profitable.
        </p>
      </section>

      {[
        {
          myth: 'Myth #1: "You need a 30-year mortgage"',
          truth: 'The 30-year mortgage is a modern invention designed for bank profit. Before the 1930s, mortgages were 5-10 years. A shorter term with the right strategy is not only possible — it is optimal.',
        },
        {
          myth: 'Myth #2: "Your rate is the most important factor"',
          truth: 'Strategy beats rate every time. A homeowner with a 7% rate using velocity banking will pay off faster than someone with a 5% rate using traditional payments. Rate matters. Strategy matters 100x more.',
        },
        {
          myth: 'Myth #3: "Extra payments do not make much difference"',
          truth: 'An extra $200/month on a typical mortgage saves $50,000+ in interest and cuts 5+ years off the term. The impact is not linear — it is exponential because of how amortization works.',
        },
        {
          myth: 'Myth #4: "You should wait for rates to drop"',
          truth: 'Waiting for rate changes costs you years of potential principal reduction. Every month you delay is a month of full interest charges. Time in the strategy beats timing the market.',
        },
        {
          myth: 'Myth #5: "Your home is not an investment"',
          truth: 'Your home IS your most powerful financial tool — when used correctly. The equity you build through strategic payoff becomes the foundation of generational wealth. Dismissing it as "just a place to live" is financial surrender.',
        },
        {
          myth: 'Myth #6: "This is just how it works"',
          truth: 'Nothing about the mortgage system is natural or inevitable. It was designed by people to benefit banks. And what was designed can be hacked, optimized, and beaten.',
        },
      ].map((item, i) => (
        <section key={i} className="space-y-3">
          <h3 className="text-xl font-black text-red-400">{item.myth}</h3>
          <div className="p-5 rounded-2xl bg-emerald-500/5 border border-emerald-500/20">
            <p className="text-emerald-400 font-black text-xs uppercase tracking-widest mb-2">
              The Truth
            </p>
            <p className="text-slate-300 leading-relaxed">{item.truth}</p>
          </div>
        </section>
      ))}
    </div>
  );
}

function ScorecardContent({ country }: { country: string }) {
  return (
    <div className="space-y-10">
      <section className="space-y-4">
        <h2 className="text-2xl md:text-3xl font-black text-white tracking-tight">
          Your Credit Score Is a Game — Here Is How to Win It
        </h2>
        <p className="text-slate-300 text-lg leading-relaxed">
          Your credit score is not a measure of your worth, your intelligence,
          or even your financial health. It is a measure of how profitable you
          are to banks. The higher your score, the more money banks can make
          from you. Understanding this changes everything.
        </p>
      </section>

      <section className="space-y-4">
        <h2 className="text-2xl md:text-3xl font-black text-white tracking-tight">
          The 5 Factors That Control Your Score
        </h2>
        {[
          {
            name: 'Payment History (35%)',
            desc: 'The single biggest factor. One late payment can drop your score 50-100 points. Set up automatic payments for EVERYTHING.',
          },
          {
            name: 'Credit Utilization (30%)',
            desc: 'How much of your available credit you are using. Keep this under 10% for maximum score impact. This is the fastest lever to pull.',
          },
          {
            name: 'Length of History (15%)',
            desc: 'The age of your oldest account. Never close your oldest credit card — even if you do not use it.',
          },
          {
            name: 'Credit Mix (10%)',
            desc: 'Banks want to see you can handle different types of credit. A mortgage + credit card + line of credit is ideal.',
          },
          {
            name: 'New Credit (10%)',
            desc: 'Hard inquiries from new applications. Each one dings your score slightly for 6-12 months.',
          },
        ].map((factor, i) => (
          <div
            key={i}
            className="p-5 rounded-2xl bg-slate-900/50 border border-white/5 space-y-2"
          >
            <h3 className="text-lg font-black text-white">{factor.name}</h3>
            <p className="text-slate-300 text-base leading-relaxed">
              {factor.desc}
            </p>
          </div>
        ))}
      </section>

      <section className="space-y-4">
        <h2 className="text-2xl md:text-3xl font-black text-white tracking-tight">
          The 90-Day Boost Plan
        </h2>
        <p className="text-slate-300 text-lg leading-relaxed">
          Follow this plan for 90 days and you can add 50+ points to your
          {country} credit score:
        </p>
        <ol className="space-y-3 list-decimal list-inside">
          <li className="text-slate-300 text-base leading-relaxed">
            <strong className="text-white">
              Week 1-2: Pull your credit report
            </strong>{' '}
            and dispute any errors. Even small inaccuracies can drag your score
            down.
          </li>
          <li className="text-slate-300 text-base leading-relaxed">
            <strong className="text-white">
              Week 3-4: Pay down balances
            </strong>{' '}
            to under 10% of credit limits. Focus on the highest-utilization
            cards first.
          </li>
          <li className="text-slate-300 text-base leading-relaxed">
            <strong className="text-white">
              Month 2: Become an authorized user
            </strong>{' '}
            on a family member&apos;s old, high-limit card. Their history
            becomes yours.
          </li>
          <li className="text-slate-300 text-base leading-relaxed">
            <strong className="text-white">
              Month 3: Request credit limit increases
            </strong>{' '}
            on existing cards (without hard pulls). Higher limits = lower
            utilization.
          </li>
        </ol>
      </section>
    </div>
  );
}

function GenericLessonContent({
  slug,
  country,
}: {
  slug: string;
  country: string;
}) {
  return (
    <div className="space-y-8">
      <section className="space-y-4">
        <h2 className="text-2xl md:text-3xl font-black text-white tracking-tight">
          Lesson Overview
        </h2>
        <p className="text-slate-300 text-lg leading-relaxed">
          This lesson covers advanced mortgage acceleration strategies tailored
          for homeowners in {country}. You will learn the exact techniques that
          have helped thousands of families cut 15-20 years off their mortgage
          and save hundreds of thousands in interest.
        </p>
        <p className="text-slate-300 text-lg leading-relaxed">
          The strategies in this lesson are based on real-world case studies and
          have been tested across multiple countries and banking systems.
          Whether you are just starting your mortgage journey or looking to
          optimize an existing loan, this content will give you the tools and
          knowledge to take control of your financial future.
        </p>
      </section>

      <section className="space-y-4">
        <h2 className="text-2xl md:text-3xl font-black text-white tracking-tight">
          Core Concepts
        </h2>
        <div className="space-y-4">
          {[
            'Understanding your true mortgage cost beyond the sticker price',
            'How daily interest calculations work in your favor or against you',
            'The power of cashflow velocity in mortgage acceleration',
            'Country-specific tools and products that enable faster payoff',
            'How to negotiate with banks from a position of knowledge',
          ].map((concept, i) => (
            <div
              key={i}
              className="flex gap-4 items-start p-4 rounded-2xl bg-slate-900/50 border border-white/5"
            >
              <div className="h-8 w-8 rounded-full bg-blue-500/10 border border-blue-500/20 flex items-center justify-center shrink-0 mt-0.5">
                <span className="text-blue-400 text-xs font-black">
                  {i + 1}
                </span>
              </div>
              <p className="text-slate-300 text-base font-medium leading-relaxed">
                {concept}
              </p>
            </div>
          ))}
        </div>
      </section>

      <section className="space-y-4">
        <h2 className="text-2xl md:text-3xl font-black text-white tracking-tight">
          {country}-Specific Considerations
        </h2>
        <p className="text-slate-300 text-lg leading-relaxed">
          Every country has its own banking regulations, tax laws, and financial
          products. This lesson is tailored to the {country} context, taking
          into account local mortgage structures, available acceleration tools,
          and regulatory considerations that affect your strategy.
        </p>
        <p className="text-slate-300 text-lg leading-relaxed">
          Be sure to use the country selector to switch between regions if you
          want to compare strategies across different markets. Many of the core
          principles are universal, but the implementation details can vary
          significantly.
        </p>
      </section>
    </div>
  );
}

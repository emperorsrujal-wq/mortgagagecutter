
'use client';

import React, { useState, useEffect } from 'react';
import { useUser, useFirestore } from '@/firebase';
import { doc, setDoc, getDoc, serverTimestamp } from 'firebase/firestore';
import { academyUnits } from '@/lib/academy/curriculum';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { 
  BookOpen, 
  ChevronRight, 
  CheckCircle2, 
  Award, 
  Globe, 
  Lock, 
  Trophy,
  Loader2
} from 'lucide-react';
import Link from 'next/link';
import { cn } from '@/lib/utils';

export default function FinancialAcademyHub() {
  const { user, isUserLoading } = useUser();
  const firestore = useFirestore();
  const [selectedCountry, setSelectedCountry] = useState('Canada');
  const [completedLessons, setCompletedLessons] = useState<string[]>([]);
  const [isLoadingProgress, setIsLoadingProgress] = useState(true);

  useEffect(() => {
    // Initial load from localStorage for speed
    const cached = localStorage.getItem('mc_academy_country');
    if (cached) setSelectedCountry(cached);

    async function loadProgress() {
      if (!user || !firestore) return;
      const docRef = doc(firestore, 'userFinancialProgress', user.uid);
      const snap = await getDoc(docRef);
      if (snap.exists()) {
        const data = snap.data();
        if (data.selectedCountry) {
          setSelectedCountry(data.selectedCountry);
          localStorage.setItem('mc_academy_country', data.selectedCountry);
        }
        setCompletedLessons(data.completedLessons || []);
      }
      setIsLoadingProgress(false);
    }
    if (!isUserLoading) loadProgress();
  }, [user, firestore, isUserLoading]);

  const handleCountryChange = async (val: string) => {
    setSelectedCountry(val);
    localStorage.setItem('mc_academy_country', val);
    if (user && firestore) {
      await setDoc(doc(firestore, 'userFinancialProgress', user.uid), {
        id: user.uid,
        userId: user.uid,
        email: user.email,
        selectedCountry: val,
        lastAccessedAt: serverTimestamp(),
      }, { merge: true });
    }
  };

  const totalLessons = 36;
  const progressPercent = Math.round((completedLessons.length / totalLessons) * 100);

  if (isUserLoading || isLoadingProgress) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <Loader2 className="h-12 w-12 animate-spin text-blue-500" />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center p-4 text-center">
        <Lock className="h-16 w-16 text-slate-700 mb-6" />
        <h1 className="text-3xl font-bold text-white mb-4">Member Access Only</h1>
        <p className="text-slate-400 max-w-md mb-8">The Financial Education Academy is reserved for Mortgage Cutter members. Please sign in to begin your journey.</p>
        <Button asChild size="lg" className="bg-blue-600 hover:bg-blue-700">
          <Link href="/">Back to Home</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-50 pb-24">
      <header className="relative py-20 px-4 overflow-hidden border-b border-white/5">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-900/20 via-slate-950 to-slate-950 -z-10" />
        <div className="container mx-auto max-w-5xl text-center">
          <Badge variant="outline" className="mb-4 border-blue-500/50 text-blue-400 px-4 py-1 rounded-full bg-blue-500/5">
            Academy Course: 36 Lessons
          </Badge>
          <h1 className="text-4xl md:text-6xl font-black tracking-tight mb-6 leading-tight">
            What Nobody Taught You <br /><span className="text-blue-500 italic">About Money</span>
          </h1>
          <p className="text-xl text-slate-400 max-w-2xl mx-auto leading-relaxed">
            Master the hidden mechanics of banking, insurance, and the economy used by the top 1% to build generational wealth in {selectedCountry}.
          </p>
        </div>
      </header>

      <main className="container mx-auto max-w-5xl px-4 py-12 space-y-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-center bg-slate-900/50 p-8 rounded-3xl border border-white/10 backdrop-blur-sm shadow-2xl">
          <div className="space-y-4">
            <div className="flex items-center gap-2 text-blue-400 font-bold uppercase tracking-widest text-xs">
              <Globe className="h-4 w-4" /> Selected Region
            </div>
            <RadioGroup 
              value={selectedCountry} 
              onValueChange={handleCountryChange}
              className="grid grid-cols-2 gap-2"
            >
              {['Canada', 'USA', 'UK', 'Australia'].map((c) => (
                <div key={c}>
                  <RadioGroupItem value={c} id={c} className="peer sr-only" />
                  <Label
                    htmlFor={c}
                    className="flex items-center justify-center p-3 rounded-xl border-2 border-slate-800 bg-slate-950 cursor-pointer transition-all peer-data-[state=checked]:border-blue-500 peer-data-[state=checked]:bg-blue-500/10 font-bold text-sm hover:border-slate-700"
                  >
                    {c}
                  </Label>
                </div>
              ))}
            </RadioGroup>
          </div>

          <div className="lg:col-span-2 space-y-4">
            <div className="flex justify-between items-end">
              <div className="space-y-1">
                <p className="text-xs font-black uppercase text-slate-500 tracking-widest">Academy Progress</p>
                <h3 className="text-2xl font-bold">{completedLessons.length} of 36 <span className="text-slate-500 font-medium">Lessons Complete</span></h3>
              </div>
              <p className="text-blue-400 font-black text-2xl">{progressPercent}%</p>
            </div>
            <Progress value={progressPercent} className="h-3 bg-slate-800" />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {academyUnits.map((unit) => {
            const unitCompleted = unit.lessons.filter(l => completedLessons.includes(l.id)).length;
            const unitPercent = Math.round((unitCompleted / unit.lessons.length) * 100);

            return (
              <Card key={unit.number} className="bg-slate-900 border-white/5 hover:border-blue-500/30 transition-all group relative overflow-hidden">
                <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
                  <BookOpen className="h-24 w-24" />
                </div>
                <CardHeader>
                  <div className="flex justify-between items-start mb-2">
                    <span className="text-[10px] font-black uppercase tracking-[0.2em] text-blue-500 bg-blue-500/10 px-2 py-1 rounded">
                      Unit {unit.number}
                    </span>
                    {unitPercent === 100 && <CheckCircle2 className="h-5 w-5 text-emerald-500" />}
                  </div>
                  <CardTitle className="text-xl text-white group-hover:text-blue-400 transition-colors">{unit.title}</CardTitle>
                  <CardDescription className="text-slate-400 text-sm line-clamp-2">{unit.description}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-3">
                    {unit.lessons.map((lesson) => (
                      <Link 
                        key={lesson.id} 
                        href={`/financial-academy/lesson/${lesson.slug}`}
                        className="flex items-center justify-between group/lesson p-2 -mx-2 rounded-lg hover:bg-white/5 transition-colors"
                      >
                        <div className="flex items-center gap-3">
                          <div className={cn(
                            "h-2 w-2 rounded-full",
                            completedLessons.includes(lesson.id) ? "bg-emerald-500" : "bg-slate-700 group-hover/lesson:bg-blue-500"
                          )} />
                          <span className={cn(
                            "text-sm font-medium",
                            completedLessons.includes(lesson.id) ? "text-slate-500 line-through" : "text-slate-300 group-hover/lesson:text-white"
                          )}>{lesson.title}</span>
                        </div>
                        <ChevronRight className="h-4 w-4 text-slate-600 group-hover/lesson:text-blue-400 transition-transform group-hover/lesson:translate-x-1" />
                      </Link>
                    ))}
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </main>
    </div>
  );
}

'use client';
import React from 'react';
import { CourseProvider, useCourse } from '@/components/course/CourseProvider';
import { lessonMeta } from '@/lib/course/lesson-meta';
import { languages } from '@/lib/course/translations';
import { countries } from '@/lib/course/countries';
import Link from 'next/link';
import { CheckCircle2, ChevronRight, Globe, Languages } from 'lucide-react';
import { TranslatedText } from '@/components/course/TranslatedText';
import { useUser } from '@/firebase';

function LearnHub() {
  const { country, setCountryCode, language, setLanguage, progress } = useCourse();
  const { user } = useUser();
  const isPrivileged = user?.email === 'emperorsrujal@gmail.com';

  return (
    <div className="min-h-screen bg-[#FAFBFD] font-dm-sans">
      <div className="max-w-[720px] mx-auto px-4 py-12 md:py-20 space-y-12">
        
        <header className="text-center space-y-4">
          <h1 className="text-4xl md:text-5xl font-fraunces font-black text-[#1A1D26] tracking-tight">
            <TranslatedText>The Mortgage Freedom Accelerator</TranslatedText>
          </h1>
          <p className="text-lg text-[#5A6175] max-w-xl mx-auto">
            <TranslatedText>{`Master the open credit strategies used in ${country.name} to pay off your home in record time.`}</TranslatedText>
          </p>
        </header>

        <section className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-white p-6 rounded-2xl border border-[#E8ECF2] shadow-sm">
            <div className="flex items-center gap-2 mb-4 text-[#2563EB]">
              <Globe className="h-5 w-5" />
              <h3 className="font-bold text-sm uppercase tracking-wider"><TranslatedText>Select Country</TranslatedText></h3>
            </div>
            <div className="grid grid-cols-2 gap-2">
              {Object.entries(countries).map(([code, c]) => (
                <button 
                  key={code}
                  onClick={() => setCountryCode(code)}
                  className={`flex items-center justify-center gap-2 p-3 rounded-xl border-2 transition-all ${country.name === c.name ? "border-[#2563EB] bg-blue-50 text-[#2563EB]" : "border-slate-100 hover:border-slate-200"}`}
                >
                  <span className="text-xl">{c.flag}</span>
                  <span className="font-bold text-sm">{c.name}</span>
                </button>
              ))}
            </div>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-[#E8ECF2] shadow-sm">
            <div className="flex items-center gap-2 mb-4 text-[#7C3AED]">
              <Languages className="h-5 w-5" />
              <h3 className="font-bold text-sm uppercase tracking-wider"><TranslatedText>Select Language</TranslatedText></h3>
            </div>
            <select 
              value={language}
              onChange={(e) => setLanguage(e.target.value)}
              className="w-full p-3 rounded-xl border-2 border-slate-100 bg-slate-50 font-bold focus:border-[#7C3AED] outline-none"
            >
              {languages.map(l => (
                <option key={l.code} value={l.code}>{l.name}</option>
              ))}
            </select>
          </div>
        </section>

        <section className="space-y-4">
          <h2 className="text-2xl font-fraunces font-bold px-2"><TranslatedText>Your Lessons</TranslatedText></h2>
          <div className="space-y-3">
            {lessonMeta.map((lesson, idx) => {
              const isCompleted = progress.includes(lesson.id);
              // Admins see all lessons as available immediately
              const isAvailable = idx === 0 || progress.includes(lessonMeta[idx-1].id) || isPrivileged;

              return (
                <Link 
                  key={lesson.id}
                  href={isAvailable ? `/learn/lesson/${lesson.id}` : '#'}
                  className={`group flex items-center gap-4 p-5 rounded-2xl border transition-all ${isAvailable ? "bg-white border-[#E8ECF2] hover:shadow-md hover:translate-x-1" : "bg-slate-50 border-slate-100 opacity-60 cursor-not-allowed"}`}
                >
                  <div className={`h-12 w-12 rounded-full flex items-center justify-center text-xl shadow-inner ${isCompleted ? "bg-[#059669] text-white" : "bg-slate-100"}`}>
                    {isCompleted ? <CheckCircle2 className="h-6 w-6" /> : lesson.icon}
                  </div>
                  <div className="flex-1">
                    <h4 className="font-bold text-[#1A1D26] group-hover:text-[#2563EB] transition-colors"><TranslatedText>{lesson.title}</TranslatedText></h4>
                    <p className="text-xs text-[#9DA3B0] font-bold uppercase"><TranslatedText>{`Lesson ${lesson.id}`}</TranslatedText></p>
                  </div>
                  {isAvailable && <ChevronRight className="h-5 w-5 text-[#9DA3B0] group-hover:text-[#2563EB]" />}
                </Link>
              );
            })}
          </div>
        </section>

      </div>
    </div>
  );
}

export default function Page() {
  return (
    <CourseProvider>
      <LearnHub />
    </CourseProvider>
  );
}

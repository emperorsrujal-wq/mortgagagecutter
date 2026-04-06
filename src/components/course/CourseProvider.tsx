
'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { CountryConfig, countries } from '@/lib/course/countries';
import { languages } from '@/lib/course/translations';

interface CourseContextType {
  country: CountryConfig;
  setCountryCode: (code: string) => void;
  language: string;
  setLanguage: (lang: string) => void;
  progress: number[];
  completeLesson: (id: number) => void;
  checklist: Record<string, boolean>;
  toggleTask: (taskId: string) => void;
}

const CourseContext = createContext<CourseContextType | undefined>(undefined);

export function CourseProvider({ children }: { children: ReactNode }) {
  const [countryCode, setCountryCodeState] = useState<string>('CA');
  const [language, setLanguageState] = useState<string>('en');
  const [progress, setProgress] = useState<number[]>([]);
  const [checklist, setChecklist] = useState<Record<string, boolean>>({});
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const storedCountry = localStorage.getItem('mc_course_country') || 'CA';
    const storedLang = localStorage.getItem('mc_course_lang') || 'en';
    const storedProgress = JSON.parse(localStorage.getItem('mc_course_progress') || '[]');
    const storedChecklist = JSON.parse(localStorage.getItem('mc_course_checklist') || '{}');

    setCountryCodeState(storedCountry);
    setLanguageState(storedLang);
    setProgress(storedProgress);
    setChecklist(storedChecklist);
    setMounted(true);
  }, []);

  const setCountryCode = (code: string) => {
    setCountryCodeState(code);
    localStorage.setItem('mc_course_country', code);
  };

  const setLanguage = (lang: string) => {
    setLanguageState(lang);
    localStorage.setItem('mc_course_lang', lang);
  };

  const completeLesson = (id: number) => {
    if (!progress.includes(id)) {
      const newProgress = [...progress, id];
      setProgress(newProgress);
      localStorage.setItem('mc_course_progress', JSON.stringify(newProgress));
    }
  };

  const toggleTask = (taskId: string) => {
    const newChecklist = { ...checklist, [taskId]: !checklist[taskId] };
    setChecklist(newChecklist);
    localStorage.setItem('mc_course_checklist', JSON.stringify(newChecklist));
  };

  if (!mounted) return null;

  return (
    <CourseContext.Provider value={{
      country: countries[countryCode] || countries.CA,
      setCountryCode,
      language,
      setLanguage,
      progress,
      completeLesson,
      checklist,
      toggleTask
    }}>
      <div dir={languages.find(l => l.code === language)?.dir || 'ltr'}>
        {children}
      </div>
    </CourseContext.Provider>
  );
}

export function useCourse() {
  const context = useContext(CourseContext);
  if (!context) throw new Error('useCourse must be used within CourseProvider');
  return context;
}

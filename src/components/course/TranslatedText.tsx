
'use client';
import { useState, useEffect } from 'react';
import { useCourse } from './CourseProvider';
import { translateContent } from '@/app/learn/actions';

const translationCache = new Map<string, string>();

export function TranslatedText({ children }: { children: string }) {
  const { language } = useCourse();
  const [translated, setTranslated] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (language === 'en') {
      setTranslated(null);
      return;
    }

    const cacheKey = `${language}:${children}`;
    if (translationCache.has(cacheKey)) {
      setTranslated(translationCache.get(cacheKey)!);
      return;
    }

    async function performTranslation() {
      setLoading(true);
      try {
        const result = await translateContent(children, language);
        translationCache.set(cacheKey, result);
        setTranslated(result);
      } catch (e) {
        console.error('Translation error', e);
        setTranslated(children);
      } finally {
        setLoading(false);
      }
    }

    performTranslation();
  }, [children, language]);

  if (language === 'en') return <>{children}</>;

  return (
    <span className={loading ? 'opacity-50 transition-opacity' : 'transition-opacity'}>
      {translated || children}
    </span>
  );
}

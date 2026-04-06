
'use client';
import React, { ReactNode, useState } from 'react';
import { cn } from '@/lib/utils';
import { ChevronDown, ChevronUp, CheckCircle2 } from 'lucide-react';
import { TranslatedText } from './TranslatedText';

export function CourseCard({ title, children, className }: { title?: string, children: ReactNode, className?: string }) {
  return (
    <div className={cn("bg-white border border-[#E8ECF2] rounded-[16px] shadow-sm p-7 md:p-8 space-y-4", className)}>
      {title && <h3 className="text-xl font-fraunces font-bold text-[#1A1D26]"><TranslatedText>{title}</TranslatedText></h3>}
      <div className="text-[#5A6175] font-dm-sans leading-relaxed">
        {children}
      </div>
    </div>
  );
}

export function InfoBox({ title, children, color = 'blue' }: { title: string, children: ReactNode, color?: 'blue' | 'amber' | 'purple' | 'green' | 'red' }) {
  const styles = {
    blue: "bg-blue-50 border-blue-100 text-blue-800",
    amber: "bg-amber-50 border-amber-100 text-amber-800",
    purple: "bg-purple-50 border-purple-100 text-purple-800",
    green: "bg-emerald-50 border-emerald-100 text-emerald-800",
    red: "bg-red-50 border-red-100 text-red-800",
  };

  return (
    <div className={cn("p-5 border-l-4 rounded-r-lg", styles[color])}>
      <h4 className="font-bold text-sm uppercase tracking-wider mb-2"><TranslatedText>{title}</TranslatedText></h4>
      <div className="text-sm">
        {children}
      </div>
    </div>
  );
}

export function ExpandSection({ title, children }: { title: string, children: ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <div className="border rounded-lg overflow-hidden mb-3">
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between p-4 bg-slate-50 hover:bg-slate-100 transition-colors"
      >
        <span className="font-semibold text-left"><TranslatedText>{title}</TranslatedText></span>
        {isOpen ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
      </button>
      {isOpen && <div className="p-4 bg-white border-t text-sm"><TranslatedText>{typeof children === 'string' ? children : ''}</TranslatedText>{typeof children !== 'string' && children}</div>}
    </div>
  );
}

export function StatBox({ label, value, colorClass = "" }: { label: string, value: string, colorClass?: string }) {
  return (
    <div className="bg-slate-50 p-4 rounded-xl text-center border border-slate-100">
      <p className="text-[10px] uppercase tracking-widest text-[#9DA3B0] mb-1 font-bold"><TranslatedText>{label}</TranslatedText></p>
      <p className={cn("text-xl md:text-2xl font-fraunces font-black", colorClass)}>{value}</p>
    </div>
  );
}

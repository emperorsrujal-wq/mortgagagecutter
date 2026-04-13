'use client';
import React, { ReactNode, useState } from 'react';
import { cn } from '@/lib/utils';
import { ChevronDown, ChevronUp, CheckCircle2, Circle, HelpCircle, Quote, Trophy, AlertTriangle } from 'lucide-react';
import { TranslatedText } from './TranslatedText';
import { useCourse } from './CourseProvider';
import { Button } from '@/components/ui/button';

export function CourseCard({ title, children, className }: { title?: string, children: ReactNode, className?: string }) {
  return (
    <div className={cn("bg-white border border-[#E8ECF2] rounded-[24px] shadow-sm p-7 md:p-10 space-y-4", className)}>
      {title && <h3 className="text-2xl font-fraunces font-black text-[#1A1D26]"><TranslatedText>{title}</TranslatedText></h3>}
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
    <div className={cn("p-6 border-l-4 rounded-r-2xl shadow-sm", styles[color])}>
      <h4 className="font-black text-xs uppercase tracking-[0.2em] mb-3"><TranslatedText>{title}</TranslatedText></h4>
      <div className="text-sm font-medium leading-relaxed">
        {typeof children === 'string' ? <TranslatedText>{children}</TranslatedText> : children}
      </div>
    </div>
  );
}

export function CaseStudy({ name, savings, timeline, quote }: { name: string, savings: string, timeline: string, quote: string }) {
  return (
    <div className="bg-slate-900 text-white p-8 rounded-[32px] border border-white/10 relative overflow-hidden group">
      <div className="absolute top-0 right-0 p-6 opacity-10 group-hover:scale-110 transition-transform">
        <Quote className="h-20 w-20" />
      </div>
      <div className="relative z-10 space-y-4">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-full bg-blue-500 flex items-center justify-center font-black text-xs">
            {name.charAt(0)}
          </div>
          <div>
            <p className="font-black text-sm uppercase tracking-widest">{name}</p>
            <p className="text-[10px] text-blue-400 font-bold uppercase tracking-widest">Case Study</p>
          </div>
        </div>
        <p className="text-xl italic font-serif leading-relaxed text-slate-200">"{quote}"</p>
        <div className="grid grid-cols-2 gap-4 pt-4 border-t border-white/5">
          <div>
            <p className="text-[10px] text-slate-500 font-black uppercase tracking-widest">Total Interest Saved</p>
            <p className="text-xl font-black text-emerald-400">{savings}</p>
          </div>
          <div>
            <p className="text-[10px] text-slate-500 font-black uppercase tracking-widest">Amortization Cut</p>
            <p className="text-xl font-black text-blue-400">{timeline}</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export function Quiz({ question, options, correctAnswer, explanation }: { question: string, options: string[], correctAnswer: number, explanation: string }) {
  const [selected, setSelected] = useState<number | null>(null);
  const [showResult, setShowResult] = useState(false);

  const isCorrect = selected === correctAnswer;

  return (
    <div className="bg-white border-2 border-slate-100 rounded-[32px] p-8 md:p-10 space-y-6 shadow-xl">
      <div className="flex items-center gap-3 text-blue-600 font-black text-xs uppercase tracking-[0.3em]">
        <HelpCircle className="h-5 w-5" />
        <TranslatedText>Knowledge Check</TranslatedText>
      </div>
      <h3 className="text-2xl font-black text-slate-900 leading-tight">
        <TranslatedText>{question}</TranslatedText>
      </h3>
      <div className="space-y-3">
        {options.map((opt, i) => (
          <button
            key={i}
            onClick={() => { setSelected(i); setShowResult(true); }}
            disabled={showResult}
            className={cn(
              "w-full text-left p-5 rounded-2xl border-2 transition-all font-bold text-lg",
              !showResult && "border-slate-50 hover:border-blue-200 hover:bg-blue-50/30",
              showResult && i === correctAnswer && "border-emerald-500 bg-emerald-50 text-emerald-900",
              showResult && i === selected && i !== correctAnswer && "border-red-500 bg-red-50 text-red-900",
              showResult && i !== selected && i !== correctAnswer && "opacity-40 border-slate-50"
            )}
          >
            {opt}
          </button>
        ))}
      </div>
      {showResult && (
        <div className={cn("p-6 rounded-2xl animate-in zoom-in duration-300", isCorrect ? "bg-emerald-100 text-emerald-900" : "bg-red-100 text-red-900")}>
          <div className="flex items-center gap-2 mb-2 font-black uppercase text-xs tracking-widest">
            {isCorrect ? <CheckCircle2 className="h-4 w-4" /> : <AlertTriangle className="h-4 w-4" />}
            <TranslatedText>{isCorrect ? "Correct!" : "Not Quite."}</TranslatedText>
          </div>
          <p className="text-base font-medium leading-relaxed">
            <TranslatedText>{explanation}</TranslatedText>
          </p>
        </div>
      )}
    </div>
  );
}

export function ExpandSection({ title, children }: { title: string, children: ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <div className="border rounded-2xl overflow-hidden mb-3 transition-all duration-300">
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className={cn("w-full flex items-center justify-between p-5 transition-colors", isOpen ? "bg-slate-900 text-white" : "bg-slate-50 hover:bg-slate-100 text-slate-900")}
      >
        <span className="font-bold text-lg text-left"><TranslatedText>{title}</TranslatedText></span>
        {isOpen ? <ChevronUp className="h-5 w-5" /> : <ChevronDown className="h-5 w-5" />}
      </button>
      {isOpen && (
        <div className="p-6 bg-white border-t text-base leading-relaxed text-slate-600">
          {typeof children === 'string' ? <TranslatedText>{children}</TranslatedText> : children}
        </div>
      )}
    </div>
  );
}

export function StatBox({ label, value, colorClass = "" }: { label: string, value: string, colorClass?: string }) {
  return (
    <div className="bg-slate-50 p-5 rounded-2xl text-center border border-slate-100 shadow-inner">
      <p className="text-[10px] uppercase tracking-[0.2em] text-[#9DA3B0] mb-2 font-black"><TranslatedText>{label}</TranslatedText></p>
      <p className={cn("text-2xl md:text-3xl font-fraunces font-black", colorClass)}>{value}</p>
    </div>
  );
}

export function ChatBubble({ role, children }: { role: 'you' | 'bank' | 'pro', children: string }) {
  const styles = {
    you: "bg-blue-600 text-white self-start rounded-br-none shadow-lg shadow-blue-500/20",
    bank: "bg-slate-100 text-slate-900 self-end rounded-bl-none ml-auto border border-slate-200",
    pro: "bg-amber-100 text-amber-900 border border-amber-200 self-center rounded-2xl text-base mx-auto max-w-sm",
  };
  return (
    <div className={cn("max-w-[85%] p-5 rounded-[24px] mb-6 animate-in slide-in-from-bottom-2", styles[role])}>
      <p className="font-black text-[10px] uppercase tracking-[0.2em] mb-2 opacity-60">{role}</p>
      <div className="leading-relaxed font-bold text-lg"><TranslatedText>{children}</TranslatedText></div>
    </div>
  );
}

export function TaskItem({ id, label }: { id: string, label: string }) {
  const { checklist, toggleTask } = useCourse();
  return (
    <label className="flex items-start gap-4 p-4 rounded-2xl hover:bg-blue-50/50 cursor-pointer transition-all group border border-transparent hover:border-blue-100">
      <div className="pt-0.5">
        <input 
          type="checkbox" 
          checked={!!checklist[id]} 
          onChange={() => toggleTask(id)}
          className="h-6 w-6 rounded-lg border-slate-300 text-[#2563EB] focus:ring-[#2563EB]" 
        />
      </div>
      <span className={cn("text-lg font-bold transition-all", checklist[id] ? "text-slate-400 line-through" : "text-[#1A1D26]")}>
        <TranslatedText>{label}</TranslatedText>
      </span>
    </label>
  );
}

'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import {
  CheckCircle2,
  Circle,
  Lock,
  ChevronDown,
  ChevronRight,
  Play,
  FileText,
  HelpCircle,
  Wrench,
  ListChecks,
  Home,
  X,
  Menu,
  Award,
  BookOpen,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import {
  courseModules,
  CourseLesson,
  getModuleProgress,
  FREE_MODULE_COUNT,
} from '@/lib/course/course-curriculum';

const lessonTypeIcons: Record<string, React.ReactNode> = {
  video: <Play className="h-3.5 w-3.5" />,
  reading: <FileText className="h-3.5 w-3.5" />,
  quiz: <HelpCircle className="h-3.5 w-3.5" />,
  tool: <Wrench className="h-3.5 w-3.5" />,
  action: <ListChecks className="h-3.5 w-3.5" />,
};

type CourseSidebarProps = {
  completedLessonIds: string[];
  isPurchased: boolean;
};

function LessonRow({
  lesson,
  isActive,
  isCompleted,
  isLocked,
}: {
  lesson: CourseLesson;
  isActive: boolean;
  isCompleted: boolean;
  isLocked: boolean;
}) {
  return (
    <Link
      href={isLocked ? '#' : `/course/lesson/${lesson.slug}`}
      onClick={(e) => isLocked && e.preventDefault()}
      className={cn(
        'group flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm transition-all duration-200',
        isActive && 'bg-blue-500/10 border border-blue-500/30',
        !isActive && !isLocked && 'hover:bg-white/5 border border-transparent',
        isLocked && 'opacity-50 cursor-not-allowed border border-transparent'
      )}
    >
      {/* Status indicator */}
      <div className="shrink-0">
        {isCompleted ? (
          <CheckCircle2 className="h-5 w-5 text-emerald-500" />
        ) : isLocked ? (
          <Lock className="h-5 w-5 text-slate-600" />
        ) : isActive ? (
          <motion.div
            animate={{ scale: [1, 1.15, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            <Circle className="h-5 w-5 text-blue-400 fill-blue-400/20" />
          </motion.div>
        ) : (
          <Circle className="h-5 w-5 text-slate-600" />
        )}
      </div>

      {/* Lesson info */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <span
            className={cn(
              'text-xs font-bold truncate',
              isActive ? 'text-blue-400' : 'text-slate-400'
            )}
          >
            {lesson.number}. {lesson.title}
          </span>
          {lesson.isPaid && !isLocked && (
            <Badge
              variant="outline"
              className="text-[9px] h-4 px-1 border-amber-500/40 text-amber-400 font-bold uppercase tracking-wider"
            >
              PRO
            </Badge>
          )}
          {lesson.isPaid && isLocked && (
            <Badge
              variant="outline"
              className="text-[9px] h-4 px-1 border-slate-700 text-slate-500 font-bold uppercase tracking-wider"
            >
              LOCKED
            </Badge>
          )}
        </div>
        <div className="flex items-center gap-2 mt-0.5">
          <span className="text-slate-600">
            {lessonTypeIcons[lesson.type]}
          </span>
          <span className="text-[10px] font-medium text-slate-500">
            {lesson.duration}m
          </span>
        </div>
      </div>
    </Link>
  );
}

function ModuleSection({
  module,
  currentSlug,
  completedLessonIds,
  isExpanded,
  onToggle,
  isPurchased,
}: {
  module: (typeof courseModules)[0];
  currentSlug: string;
  completedLessonIds: string[];
  isExpanded: boolean;
  onToggle: () => void;
  isPurchased: boolean;
}) {
  const moduleProgress = getModuleProgress(module, completedLessonIds);
  const hasCurrentLesson = module.lessons.some((l) => l.slug === currentSlug);
  const isPaidModule = module.number > FREE_MODULE_COUNT;

  return (
    <div className="border-b border-white/5 last:border-b-0">
      {/* Module Header */}
      <button
        onClick={onToggle}
        className={cn(
          'w-full flex items-center gap-3 px-4 py-3.5 transition-all hover:bg-white/5',
          hasCurrentLesson && 'bg-white/[0.02]'
        )}
      >
        <div className="shrink-0">
          {isExpanded ? (
            <ChevronDown className="h-4 w-4 text-slate-500" />
          ) : (
            <ChevronRight className="h-4 w-4 text-slate-500" />
          )}
        </div>

        <div className="flex-1 text-left min-w-0">
          <div className="flex items-center gap-2">
            <span className="text-xs font-black text-slate-500 uppercase tracking-widest">
              Module {module.number}
            </span>
            {isPaidModule && (
              <Badge
                variant="outline"
                className="text-[8px] h-3.5 px-1 border-amber-500/40 text-amber-400 font-bold uppercase"
              >
                PRO
              </Badge>
            )}
            {!isPaidModule && (
              <Badge
                variant="outline"
                className="text-[8px] h-3.5 px-1 border-emerald-500/40 text-emerald-400 font-bold uppercase"
              >
                FREE
              </Badge>
            )}
          </div>
          <p className="text-sm font-bold text-slate-300 truncate mt-0.5">
            {module.title}
          </p>
        </div>

        <div className="shrink-0 text-right">
          <span className="text-[10px] font-black text-slate-500">
            {moduleProgress}%
          </span>
        </div>
      </button>

      {/* Module Lessons */}
      <AnimatePresence initial={false}>
        {(isExpanded || hasCurrentLesson) && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2, ease: 'easeInOut' }}
            className="overflow-hidden"
          >
            <div className="px-4 pb-3 space-y-1">
              {/* Progress bar */}
              <div className="px-3 mb-2">
                <Progress
                  value={moduleProgress}
                  className="h-1 bg-slate-800"
                />
              </div>

              {module.lessons.map((lesson) => {
                const isActive = lesson.slug === currentSlug;
                const isCompleted = completedLessonIds.includes(lesson.id);
                const isLocked =
                  lesson.isPaid && !isPurchased;

                return (
                  <LessonRow
                    key={lesson.id}
                    lesson={lesson}
                    isActive={isActive}
                    isCompleted={isCompleted}
                    isLocked={isLocked}
                  />
                );
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export function CourseSidebar({
  completedLessonIds,
  isPurchased,
}: CourseSidebarProps) {
  const pathname = usePathname();
  const currentSlug = pathname?.split('/').pop() || '';
  const [mobileOpen, setMobileOpen] = useState(false);

  // Auto-expand modules that contain the current lesson or have progress
  const [expandedModules, setExpandedModules] = useState<Set<string>>(() => {
    const initial = new Set<string>();
    courseModules.forEach((mod) => {
      const hasCurrent = mod.lessons.some((l) => l.slug === currentSlug);
      const hasProgress = mod.lessons.some((l) =>
        completedLessonIds.includes(l.id)
      );
      if (hasCurrent || hasProgress) initial.add(mod.id);
    });
    // Also expand free modules by default
    courseModules.forEach((mod) => {
      if (mod.number <= FREE_MODULE_COUNT) initial.add(mod.id);
    });
    return initial;
  });

  const toggleModule = (moduleId: string) => {
    setExpandedModules((prev) => {
      const next = new Set(prev);
      if (next.has(moduleId)) {
        next.delete(moduleId);
      } else {
        next.add(moduleId);
      }
      return next;
    });
  };

  const totalLessons = courseModules.reduce(
    (acc, m) => acc + m.lessons.length,
    0
  );
  const overallProgress = Math.round(
    (completedLessonIds.length / totalLessons) * 100
  );

  const sidebarContent = (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="p-4 border-b border-white/5">
        <Link
          href="/course"
          className="flex items-center gap-2.5 group"
          onClick={() => setMobileOpen(false)}
        >
          <div className="h-9 w-9 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center">
            <BookOpen className="h-4.5 w-4.5 text-blue-400" />
          </div>
          <div>
            <p className="text-sm font-black text-white group-hover:text-blue-400 transition-colors">
              Mortgage Cutter
            </p>
            <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">
              Complete Course
            </p>
          </div>
        </Link>

        {/* Overall Progress */}
        <div className="mt-4 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">
              Overall Progress
            </span>
            <span className="text-[10px] font-black text-blue-400">
              {overallProgress}%
            </span>
          </div>
          <Progress value={overallProgress} className="h-1.5 bg-slate-800" />
          <div className="flex items-center justify-between text-[10px] text-slate-600 font-medium">
            <span>
              {completedLessonIds.length} / {totalLessons} lessons
            </span>
            {completedLessonIds.length > 0 && (
              <span className="flex items-center gap-1 text-emerald-500">
                <Award className="h-3 w-3" />
                {completedLessonIds.length} completed
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Module List */}
      <div className="flex-1 overflow-y-auto">
        {courseModules.map((module) => (
          <ModuleSection
            key={module.id}
            module={module}
            currentSlug={currentSlug}
            completedLessonIds={completedLessonIds}
            isExpanded={expandedModules.has(module.id)}
            onToggle={() => toggleModule(module.id)}
            isPurchased={isPurchased}
          />
        ))}
      </div>

      {/* Footer */}
      <div className="p-4 border-t border-white/5">
        <Link
          href="/"
          className="flex items-center gap-2 text-xs font-bold text-slate-500 hover:text-white transition-colors"
          onClick={() => setMobileOpen(false)}
        >
          <Home className="h-3.5 w-3.5" />
          Back to Home
        </Link>
      </div>
    </div>
  );

  return (
    <>
      {/* Mobile Toggle Button */}
      <button
        onClick={() => setMobileOpen(!mobileOpen)}
        className="fixed top-4 left-4 z-[60] lg:hidden h-10 w-10 rounded-xl bg-slate-900 border border-white/10 flex items-center justify-center shadow-xl"
      >
        {mobileOpen ? (
          <X className="h-5 w-5 text-white" />
        ) : (
          <Menu className="h-5 w-5 text-white" />
        )}
      </button>

      {/* Mobile Sidebar Overlay */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-[55] bg-black/60 backdrop-blur-sm lg:hidden"
            onClick={() => setMobileOpen(false)}
          />
        )}
      </AnimatePresence>

      {/* Mobile Sidebar */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.aside
            initial={{ x: '-100%' }}
            animate={{ x: 0 }}
            exit={{ x: '-100%' }}
            transition={{ duration: 0.3, ease: 'easeOut' }}
            className="fixed left-0 top-0 bottom-0 z-[56] w-80 bg-slate-950 border-r border-white/10 lg:hidden"
          >
            {sidebarContent}
          </motion.aside>
        )}
      </AnimatePresence>

      {/* Desktop Sidebar */}
      <aside className="hidden lg:block fixed left-0 top-0 bottom-0 w-80 bg-slate-950 border-r border-white/10 z-40">
        {sidebarContent}
      </aside>
    </>
  );
}

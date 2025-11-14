"use client";
import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';

export interface LessonItem { slug: string; title: string; module: string }

export default function ModuleAccordion({
  name,
  lessons,
}: {
  name: string;
  lessons: LessonItem[];
}) {
  const key = `accordion:${name}`;
  const [open, setOpen] = useState(true);
  const [progress, setProgress] = useState(0);
  const total = lessons.length || 1;

  useEffect(() => {
    const savedOpen = localStorage.getItem(key);
    if (savedOpen) setOpen(savedOpen === '1');
  }, [key]);

  useEffect(() => {
    localStorage.setItem(key, open ? '1' : '0');
  }, [key, open]);

  useEffect(() => {
    const done = lessons.reduce((acc, l) => {
      const stored = localStorage.getItem(`progress:${l.slug}`);
      if (!stored) return acc;
      try {
        const obj = JSON.parse(stored) as Record<string, boolean>;
        const ok = Object.values(obj).filter(Boolean).length;
        return acc + (ok > 0 ? 1 : 0);
      } catch {
        return acc;
      }
    }, 0);
    setProgress(Math.round((done / total) * 100));
  }, [lessons, total]);

  return (
    <div className="border rounded bg-white">
      <button
        onClick={() => setOpen(o => !o)}
        className="w-full flex items-center justify-between px-4 py-3 border-b hover:bg-slate-50"
      >
        <span className="capitalize font-semibold">{name}</span>
        <span className="text-xs text-gray-600">Progresso: {progress}%</span>
      </button>
      {open && (
        <ul className="p-3 space-y-1">
          {lessons.map((l) => (
            <li key={l.slug}>
              <Link 
                href={`/curso/${l.module}/${l.slug}`} 
                className="block px-3 py-2.5 rounded-lg border border-gray-200 bg-white hover:bg-blue-50 hover:border-blue-300 transition-all group"
              >
                <div className="flex items-center justify-between">
                  <span className="text-gray-800 font-medium group-hover:text-blue-700">
                    {l.title}
                  </span>
                  <span className="text-xs px-2 py-1 bg-gray-100 text-gray-600 rounded group-hover:bg-blue-100 group-hover:text-blue-700 transition-colors">
                    {l.module}
                  </span>
                </div>
                <span className="text-xs text-gray-500 mt-1 block">
                  {l.slug}
                </span>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

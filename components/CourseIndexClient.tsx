"use client";
import { useState } from 'react';
import ModuleAccordion from './ModuleAccordion';

export type LightLesson = { slug: string; title: string; module: string };
export type LightModule = { name: string; lessons: LightLesson[] };

export default function CourseIndexClient({ modules }: { modules: LightModule[] }) {
  const [query, setQuery] = useState('');

  const filtered = modules.map(m => ({
    ...m,
    lessons: m.lessons.filter(l =>
      l.title.toLowerCase().includes(query.toLowerCase()) ||
      l.slug.toLowerCase().includes(query.toLowerCase())
    )
  }));

  const totalLessons = modules.reduce((a, m) => a + m.lessons.length, 0);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Curso JavaScript · Interativo</h1>
        <div className="text-sm text-gray-600">{totalLessons} lições</div>
      </div>

      <div className="bg-white border rounded p-3">
        <input
          className="w-full border rounded px-3 py-2 text-sm"
          placeholder="Buscar lições por título ou slug..."
          value={query}
          onChange={e => setQuery(e.target.value)}
        />
      </div>

      <div className="space-y-4">
        {filtered.map(m => (
          <ModuleAccordion key={m.name} name={m.name} lessons={m.lessons} />
        ))}
      </div>
    </div>
  );
}

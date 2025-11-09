"use client";
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { getExercisesFor, Exercise } from '../../../../../lib/exercises';

interface StoredResult { [id: string]: boolean }

export default function ExercisesPage({ params }: { params: { slug: string } }) {
  const { slug } = params;
  const [exercises, setExercises] = useState<Exercise[]>([]);
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [checked, setChecked] = useState<StoredResult>({});

  useEffect(() => {
    setExercises(getExercisesFor(slug));
    const raw = localStorage.getItem(`progress:${slug}`);
    if (raw) setChecked(JSON.parse(raw));
  }, [slug]);

  function select(exId: string, idx: number) {
    setAnswers(a => ({ ...a, [exId]: idx }));
  }

  function check(ex: Exercise) {
    const isCorrect = answers[ex.id] === ex.correctIndex;
    const next = { ...checked, [ex.id]: isCorrect };
    setChecked(next);
    localStorage.setItem(`progress:${slug}`, JSON.stringify(next));
  }

  const doneCount = Object.values(checked).filter(Boolean).length;

  return (
    <main className="container mx-auto p-6">
      <nav className="text-sm mb-4 text-gray-600">
        <Link className="hover:underline" href="/curso">Curso</Link> / <Link className="hover:underline" href="/curso/fundamentals">Fundamentals</Link> / <Link className="hover:underline" href={`/curso/fundamentals/${slug}`}>{slug}</Link> / <span>Exercícios</span>
      </nav>
      <h1 className="text-2xl font-bold mb-2">Exercícios – {slug.replace(/^\d+-/, '').replace(/-/g,' ')}</h1>
      <p className="text-gray-700 mb-4">Resolva e clique em "Verificar". Seu progresso (acertos) fica salvo no navegador.</p>
      <div className="mb-6 text-sm text-gray-600">Progresso: {doneCount}/{exercises.length} corretos</div>
      <ul className="space-y-6">
        {exercises.map(ex => {
          const selected = answers[ex.id];
          const state = checked[ex.id];
          return (
            <li key={ex.id} className="bg-white border rounded p-4">
              <p className="font-medium mb-2">{ex.prompt}</p>
              <div className="space-y-1">
                {ex.options.map((opt, i) => {
                  const active = selected === i;
                  return (
                    <button
                      key={i}
                      onClick={() => select(ex.id, i)}
                      className={`w-full text-left px-3 py-2 rounded border text-sm hover:bg-slate-50 ${active ? 'bg-blue-50 border-blue-300' : ''}`}
                    >{opt}</button>
                  );
                })}
              </div>
              <div className="mt-3 flex items-center gap-3">
                <button
                  onClick={() => check(ex)}
                  disabled={selected === undefined}
                  className="px-4 py-2 rounded bg-blue-600 text-white disabled:opacity-40"
                >Verificar</button>
                {state !== undefined && (
                  <span className={state ? 'text-green-700 font-semibold' : 'text-red-700 font-semibold'}>
                    {state ? 'Correto ✅' : 'Incorreto ❌'}
                  </span>
                )}
              </div>
              {state !== undefined && (
                <p className="mt-2 text-sm text-gray-600"><strong>Explicação:</strong> {ex.explanation}</p>
              )}
            </li>
          );
        })}
      </ul>
      {exercises.length === 0 && <p>Nenhum exercício configurado para esta lição.</p>}
    </main>
  );
}

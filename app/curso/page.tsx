import Link from 'next/link';
import { getModules, ModuleInfo, LessonInfo } from '../../lib/course';

export default function CursoIndexPage() {
  const modules = getModules();
  return (
    <main className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-4">Curso JavaScript · Interativo</h1>
      {modules.length === 0 ? (
        <p className="text-gray-600">Nenhum conteúdo encontrado. Verifique a pasta <code>docs/course</code>.</p>
      ) : (
        <div className="space-y-8">
          {modules.map((m: ModuleInfo) => (
            <section key={m.name} className="bg-white rounded border p-4">
              <h2 className="text-xl font-semibold mb-3 capitalize">{m.name}</h2>
              <ul className="space-y-2">
                {m.lessons.map((lesson: LessonInfo) => (
                  <li key={lesson.slug}>
                    <Link className="text-blue-700 hover:underline" href={`/curso/${m.name}/${lesson.slug}`}>
                      {lesson.slug.replace(/^\d+-/, '')} — {lesson.title}
                    </Link>
                  </li>
                ))}
              </ul>
            </section>
          ))}
        </div>
      )}
    </main>
  );
}

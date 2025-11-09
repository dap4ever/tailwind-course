import Link from 'next/link';
import { getLesson, readLessonMarkdown, getModules } from '../../../../lib/course';
import { remark } from 'remark';
import html from 'remark-html';

function toTitle(id: string) {
  return id.replace(/^\d+-/, '').replace(/-/g, ' ');
}

export default async function LessonPage({ params }: { params: { slug: string } }) {
  const lesson = getLesson('fundamentals', params.slug);
  if (!lesson) {
    return (
      <main className="container mx-auto p-6">
        <h1 className="text-2xl font-bold mb-2">Lição não encontrada</h1>
        <Link className="text-blue-700 hover:underline" href="/curso">Voltar ao curso</Link>
      </main>
    );
  }
  const raw = readLessonMarkdown(lesson.filePath);
  const processed = await remark().use(html).process(raw);
  const content = processed.toString();

  // Prev/Next
  const mods = getModules();
  const fundamentals = mods.find(m => m.name === 'fundamentals');
  const idx = fundamentals ? fundamentals.lessons.findIndex(l => l.slug === lesson.slug) : -1;
  const prev = fundamentals && idx > 0 ? fundamentals.lessons[idx - 1] : null;
  const next = fundamentals && idx >= 0 && idx < fundamentals.lessons.length - 1 ? fundamentals.lessons[idx + 1] : null;
  return (
    <main className="container mx-auto p-6">
      <nav className="text-sm mb-4 text-gray-600">
        <Link className="hover:underline" href="/curso">Curso</Link>
        <span> / </span>
        <Link className="hover:underline" href="/curso/fundamentals">Fundamentals</Link>
        <span> / </span>
        <span className="capitalize">{toTitle(lesson.slug)}</span>
      </nav>
      <h1 className="text-3xl font-bold mb-4">{lesson.title}</h1>
      <article className="prose prose-slate max-w-none bg-white border rounded p-6" dangerouslySetInnerHTML={{ __html: content }} />
      <div className="mt-6 flex justify-between text-sm">
        <div>
          {prev && (
            <Link className="text-blue-700 hover:underline" href={`/curso/fundamentals/${prev.slug}`}>
              ← {prev.title}
            </Link>
          )}
        </div>
        <div>
          {next && (
            <Link className="text-blue-700 hover:underline" href={`/curso/fundamentals/${next.slug}`}>
              {next.title} →
            </Link>
          )}
        </div>
      </div>
      <div className="mt-4 text-sm text-gray-600">
        <p>
          Dica: rode a demonstração relacionada a esta lição no terminal.
        </p>
        <code className="block bg-slate-100 rounded p-2 mt-2">npm run course 01</code>
      </div>
    </main>
  );
}

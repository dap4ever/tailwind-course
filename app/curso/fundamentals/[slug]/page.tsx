import Link from 'next/link';
import { getLesson, readLessonMarkdown } from '../../../../lib/course';

function toTitle(id: string) {
  return id.replace(/^\d+-/, '').replace(/-/g, ' ');
}

export default function LessonPage({ params }: { params: { slug: string } }) {
  const lesson = getLesson('fundamentals', params.slug);
  if (!lesson) {
    return (
      <main className="container mx-auto p-6">
        <h1 className="text-2xl font-bold mb-2">Lição não encontrada</h1>
        <Link className="text-blue-700 hover:underline" href="/curso">Voltar ao curso</Link>
      </main>
    );
  }
  const content = readLessonMarkdown(lesson.filePath);
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
      <article className="prose max-w-none bg-white border rounded p-4">
        <pre className="whitespace-pre-wrap text-sm leading-6">{content}</pre>
      </article>
      <div className="mt-4 text-sm text-gray-600">
        <p>
          Dica: rode a demonstração relacionada a esta lição no terminal.
        </p>
        <code className="block bg-slate-100 rounded p-2 mt-2">npm run course:01</code>
      </div>
    </main>
  );
}

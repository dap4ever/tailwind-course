import fs from 'fs';
import path from 'path';

function getLessonContent(id: string) {
  const file = path.join(process.cwd(), 'javascript-course', 'lessons', `lesson-${id}.md`);
  if (!fs.existsSync(file)) return null;
  return fs.readFileSync(file, 'utf-8');
}

export default function LessonPage({ params }: { params: { id: string } }) {
  const content = getLessonContent(params.id);
  if (!content) {
    return (
      <main className="container mx-auto p-6">
        <h1 className="text-2xl font-bold mb-4">Lição não encontrada</h1>
        <p>Verifique o número da lição.</p>
      </main>
    );
  }
  return (
    <main className="container mx-auto p-6">
      <article className="prose max-w-none">
        <pre className="whitespace-pre-wrap text-sm leading-6 p-4 bg-white rounded border">{content}</pre>
      </article>
    </main>
  );
}

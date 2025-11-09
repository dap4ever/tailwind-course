import Link from 'next/link';
import { getModules, ModuleInfo, LessonInfo } from '../../../lib/course';

export default function FundamentalsModulePage() {
  const mods = getModules();
  const fundamentals = mods.find(m => m.name === 'fundamentals');
  if (!fundamentals) {
    return <main className="container mx-auto p-6"><p>Fundamentals não encontrado.</p></main>;
  }
  return (
    <main className="container mx-auto p-6">
      <nav className="text-sm mb-4 text-gray-600">
        <Link className="hover:underline" href="/curso">Curso</Link> / <span>Fundamentals</span>
      </nav>
      <h1 className="text-2xl font-bold mb-4">Fundamentals</h1>
      <ul className="space-y-2">
        {fundamentals.lessons.map((l: LessonInfo) => (
          <li key={l.slug} className="bg-white border rounded p-3">
            <Link className="text-blue-700 hover:underline" href={`/curso/fundamentals/${l.slug}`}>{l.title}</Link>
          </li>
        ))}
      </ul>
    </main>
  );
}

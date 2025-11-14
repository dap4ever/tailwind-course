import Link from 'next/link';
import { getLesson, readLessonMarkdown, getModules } from '../../../../lib/course';
import { remark } from 'remark';
import html from 'remark-html';
import dynamic from 'next/dynamic';
const CodeRunner = dynamic(() => import('../../../../components/CodeRunner'), { ssr: false });
const AITutor = dynamic(() => import('../../../../components/AITutor'), { ssr: false });
const MiniChallenge = dynamic(() => import('../../../../components/MiniChallenge'), { ssr: false });

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

  // Verificar se é a lição de variáveis (01-variaveis-e-tipos) e dividir conteúdo
  const isVariablesLesson = params.slug === '01-variaveis-e-tipos';
  let beforeChallenges = content;
  let afterChallenges = '';
  
  if (isVariablesLesson) {
    // Dividir conteúdo no marcador dos mini-desafios
    const splitMarker = '<h2>💪 Mini-Desafios</h2>';
    const parts = content.split(splitMarker);
    if (parts.length > 1) {
      beforeChallenges = parts[0];
      afterChallenges = parts[1];
    }
  }

  // Prev/Next
  const mods = getModules();
  const fundamentals = mods.find(m => m.name === 'fundamentals');
  const idx = fundamentals ? fundamentals.lessons.findIndex(l => l.slug === lesson.slug) : -1;
  const prev = fundamentals && idx > 0 ? fundamentals.lessons[idx - 1] : null;
  const next = fundamentals && idx >= 0 && idx < fundamentals.lessons.length - 1 ? fundamentals.lessons[idx + 1] : null;
  return (
    <main className="container mx-auto p-4 sm:p-6">
      <nav className="text-xs sm:text-sm mb-4 text-gray-600 overflow-x-auto whitespace-nowrap">
        <Link className="hover:underline" href="/curso">Curso</Link>
        <span> / </span>
        <Link className="hover:underline" href="/curso/fundamentals">Fundamentals</Link>
        <span> / </span>
        <span className="capitalize">{toTitle(lesson.slug)}</span>
      </nav>
      <h1 className="text-2xl sm:text-3xl font-bold mb-4">{lesson.title}</h1>
      <article className="prose prose-slate max-w-none bg-white border rounded p-4 sm:p-6">
        <div dangerouslySetInnerHTML={{ __html: beforeChallenges }} />
        
        {isVariablesLesson && (
          <MiniChallenge challenges={[
            {
              id: 1,
              title: 'Qual o tipo?',
              code: `let misterio = null;\n// Qual é o resultado de typeof misterio?`,
              answer: '"object" — é um bug histórico do JavaScript! null deveria ser "null", mas por compatibilidade legada, retorna "object".',
              options: ['"null"', '"undefined"', '"object"', '"number"'],
            },
            {
              id: 2,
              title: 'Conversões Estranhas',
              code: `console.log("5" - 2);  // ?\nconsole.log("5" + 2);  // ?`,
              answer: '3 e "52" — O operador "-" força conversão numérica ("5" vira 5), mas "+" concatena strings quando um lado é string.',
              options: ['3 e 7', '3 e "52"', '"3" e "52"', 'NaN e 7'],
            },
            {
              id: 3,
              title: 'Verdadeiro ou Falso?',
              code: `if ([]) { console.log("A"); }\nif ("") { console.log("B"); }\nif (0) { console.log("C"); }`,
              answer: 'Apenas "A" será impresso! Array vazio [] é truthy, mas string vazia "" e zero são falsy.',
              options: ['Apenas A', 'A e B', 'B e C', 'Nenhum'],
            },
            {
              id: 4,
              title: 'NaN Misterioso',
              code: `const resultado = 0 / 0;\nconsole.log(resultado === resultado);`,
              answer: 'false! NaN é o único valor em JavaScript que não é igual a si mesmo. Use Number.isNaN() para verificar.',
              options: ['true', 'false', 'undefined', 'TypeError'],
            },
            {
              id: 5,
              title: 'BigInt vs Number',
              code: `const big = 10n;\nconst normal = 5;\nconsole.log(big + normal);`,
              answer: 'TypeError! Não é possível misturar BigInt com Number diretamente. Você precisa converter: big + BigInt(normal) ou Number(big) + normal.',
              options: ['15', '15n', 'TypeError', 'NaN'],
            },
          ]} />
        )}
        
        {isVariablesLesson && afterChallenges && (
          <div dangerouslySetInnerHTML={{ __html: afterChallenges }} />
        )}
      </article>

      <section className="mt-4 sm:mt-6">
        <h2 className="text-lg sm:text-xl font-semibold mb-2">Experimente no navegador</h2>
        <p className="text-xs sm:text-sm text-gray-600 mb-2">Altere o código e clique em Executar. As saídas aparecerão abaixo via console.log.</p>
        <CodeRunner storageKey={`fundamentals:${lesson.slug}`} initialCode={`// Experimente: declare variáveis e use console.log\nconst nome = 'Ana'\nconst idade = 30\nconsole.log(nome, idade)\nconsole.log(typeof nome, typeof idade)`} />
      </section>
      <div className="mt-4 sm:mt-6">
        <Link className="inline-block px-4 py-2 text-sm sm:text-base rounded bg-emerald-600 text-white hover:bg-emerald-700" href={`/curso/fundamentals/${lesson.slug}/exercises`}>
          Praticar: Exercícios Interativos
        </Link>
      </div>
      <div className="mt-4 sm:mt-6 flex justify-between text-xs sm:text-sm flex-wrap gap-2">
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
      
      {/* Assistente Pedagógico IA */}
      <AITutor lessonSlug={params.slug} lessonContent={raw} />
    </main>
  );
}

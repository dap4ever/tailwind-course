"use client";
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { getExercisesFor, Exercise } from '../../../../../lib/exercises';
import AITutor from '../../../../../components/AITutor';

interface StoredResult { 
  correct: boolean;
  attempts: number;
}

interface ProgressData {
  [id: string]: StoredResult;
}

export default function ExercisesPage({ params }: { params: { slug: string } }) {
  const { slug } = params;
  const router = useRouter();
  const [exercises, setExercises] = useState<Exercise[]>([]);
  const [answers, setAnswers] = useState<Record<string, number>>({});
  // Não usamos mais progresso por questão; manter para compatibilidade futura
  const [progress, setProgress] = useState<ProgressData>({});
  const [showHints, setShowHints] = useState<Record<string, boolean>>({});
  const [showDetailed, setShowDetailed] = useState<Record<string, boolean>>({});
  const [showFailModal, setShowFailModal] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [result, setResult] = useState<{correct:number; wrong:number; percentage:number; pass:boolean} | null>(null);
  const PASS_THRESHOLD = 0.8;
  const RETAKE_THRESHOLD = 0.4; // erro > 40% permite retake

  useEffect(() => {
    const examRaw = localStorage.getItem(`examResult:${slug}`);
    if (examRaw) {
      try {
        const prev = JSON.parse(examRaw);
        if (prev?.pass) {
          setSubmitted(true);
          setResult(prev);
        }
      } catch {}
    }

    // Ler progresso passado (por questão) para lógica adaptativa
    const progressRaw = localStorage.getItem(`progress:${slug}`);
    let stored: ProgressData = {};
    if (progressRaw) {
      try { stored = JSON.parse(progressRaw); } catch {}
      setProgress(stored);
    }

    const all = getExercisesFor(slug);
    const shuffled = [...all].sort(() => Math.random() - 0.5);
    const byDifficulty = {
      easy: shuffled.filter(e => e.difficulty === 'easy'),
      medium: shuffled.filter(e => e.difficulty === 'medium'),
      hard: shuffled.filter(e => e.difficulty === 'hard')
    };

    // Calcular desempenho por dificuldade
    const perf = (key: 'easy'|'medium'|'hard') => {
      const ids = byDifficulty[key].map(e => e.id);
      if (ids.length === 0) return { accuracy: 0, attempts: 0 };
      let correct = 0; let attempts = 0;
      ids.forEach(id => {
        const r = (stored as ProgressData)[id];
        if (r) { attempts += r.attempts; if (r.correct) correct++; }
      });
      return { accuracy: attempts > 0 ? correct / ids.length : 0, attempts };
    };

    const easyPerf = perf('easy');
    const medPerf = perf('medium');
    const hardPerf = perf('hard');

    // Regras adaptativas básicas:
    // - Se accuracy hard < 0.4 => reduzir hard para 2, aumentar easy.
    // - Se accuracy easy > 0.8 e medium > 0.7 => reduzir easy e aumentar medium/hard.
    // - Se nenhuma tentativa ainda => distribuição padrão 4/4/4.
    let target = { easy: 4, medium: 4, hard: 4 };
    const anyAttempts = (easyPerf.attempts + medPerf.attempts + hardPerf.attempts) > 0;
    if (anyAttempts) {
      if (hardPerf.accuracy < 0.4) {
        target = { easy: 6, medium: 4, hard: 2 };
      }
      if (easyPerf.accuracy > 0.8 && medPerf.accuracy > 0.7) {
        target = { easy: 3, medium: 5, hard: 4 };
      }
      if (hardPerf.accuracy > 0.7) {
        // Usuário indo bem em hard: gradualmente mais desafio
        target = { easy: 3, medium: 4, hard: 5 };
      }
    }

    const pick = (arr: Exercise[], n: number) => arr.slice(0, Math.min(n, arr.length));
    let selection: Exercise[] = [
      ...pick(byDifficulty.easy, target.easy),
      ...pick(byDifficulty.medium, target.medium),
      ...pick(byDifficulty.hard, target.hard),
    ];
    // Completar até 12 se faltar
    const TOTAL = 12;
    if (selection.length < TOTAL) {
      const remaining = shuffled.filter(e => !selection.includes(e)).slice(0, TOTAL - selection.length);
      selection = [...selection, ...remaining];
    } else if (selection.length > TOTAL) {
      selection = selection.slice(0, TOTAL);
    }
    // Embaralhar seleção final para não ficar agrupado por dificuldade
    selection = selection.sort(() => Math.random() - 0.5);
    setExercises(selection);
  }, [slug]);

  function select(exId: string, idx: number) {
    setAnswers(a => ({ ...a, [exId]: idx }));
  }

  function toggleHint(exId: string) {
    setShowHints(h => ({ ...h, [exId]: !h[exId] }));
  }

  function toggleDetailed(exId: string) {
    setShowDetailed(d => ({ ...d, [exId]: !d[exId] }));
  }

  function submitExam() {
    if (submitted) return;
    const total = exercises.length;
    let correct = 0;
    exercises.forEach(ex => {
      if (answers[ex.id] === ex.correctIndex) correct++;
    });
    const wrong = total - correct;
    const percentage = total === 0 ? 0 : correct / total;
    const pass = percentage >= PASS_THRESHOLD;
    setSubmitted(true);
    const res = {correct, wrong, percentage, pass};
    setResult(res);
    localStorage.setItem(`examResult:${slug}`, JSON.stringify(res));
    // Atualizar progresso por questão para adaptação futura
    const prevRaw = localStorage.getItem(`progress:${slug}`);
    let prev: ProgressData = {};
    try { prev = prevRaw ? JSON.parse(prevRaw) : {}; } catch {}
    const merged: ProgressData = { ...prev };
    exercises.forEach(ex => {
      const wasCorrect = answers[ex.id] === ex.correctIndex;
      const prevAttempts = prev[ex.id]?.attempts || 0;
      merged[ex.id] = { correct: wasCorrect, attempts: prevAttempts + 1 };
    });
    setProgress(merged);
    localStorage.setItem(`progress:${slug}`, JSON.stringify(merged));
    // Abrir modal de retake apenas se falhou e erro > 40%
    if (!pass && (wrong / total) > RETAKE_THRESHOLD) {
      setShowFailModal(true);
    }
  }

  function handleBackToLesson() {
    // Limpar progresso
    localStorage.removeItem(`progress:${slug}`);
    // Redirecionar para lição
    router.push(`/curso/fundamentals/${slug}`);
  }

  const total = exercises.length;
  const answeredCount = Object.keys(answers).length;
  const canSubmit = answeredCount === total && total > 0 && !submitted;

  return (
    <main className="container mx-auto p-4 sm:p-6 max-w-4xl">
      <nav className="text-xs sm:text-sm mb-4 text-gray-600 overflow-x-auto whitespace-nowrap">
        <Link className="hover:underline" href="/curso">Curso</Link> / <Link className="hover:underline" href="/curso/fundamentals">Fundamentals</Link> / <Link className="hover:underline" href={`/curso/fundamentals/${slug}`}>{slug}</Link> / <span>Exercícios</span>
      </nav>
      
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-4 sm:p-6 mb-4 sm:mb-6 border border-blue-200">
        <div className="flex items-center justify-between mb-2 flex-wrap gap-2">
          <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-800">Exercícios – {slug.replace(/^\d+-/, '').replace(/-/g,' ')}</h1>
          <span className="inline-flex items-center gap-1.5 px-2.5 sm:px-3 py-1 bg-purple-100 border border-purple-300 rounded-full text-xs font-semibold text-purple-700">
            <span>🧠</span>
            <span className="hidden sm:inline">Modo Adaptativo</span>
            <span className="sm:hidden">Adaptativo</span>
          </span>
        </div>
        <p className="text-sm sm:text-base text-gray-700 mb-2">Simulado: responda todas as questões e clique em Enviar. Aprovado com ≥ 80%.</p>
        <p className="text-xs text-gray-600 mb-3 sm:mb-4">
          💡 As questões são selecionadas dinamicamente com base no seu desempenho anterior para otimizar seu aprendizado.
        </p>
        
        <div className="flex gap-3 sm:gap-6 text-xs sm:text-sm flex-wrap">
          <div className="bg-white px-3 sm:px-4 py-2 rounded-lg shadow-sm">
            <span className="text-gray-600">Progresso: </span>
            <span className="font-bold text-green-600">{answeredCount}/{exercises.length}</span>
          </div>
          <div className="bg-white px-3 sm:px-4 py-2 rounded-lg shadow-sm">
            <span className="text-gray-600">Status: </span>
            <span className="font-bold text-blue-600">{submitted ? 'Enviado' : 'Em andamento'}</span>
          </div>
          {exercises.length > 0 && (
            <div className="bg-white px-3 sm:px-4 py-2 rounded-lg shadow-sm flex items-center gap-2">
              <span className="text-gray-600 text-xs hidden sm:inline">Conclusão:</span>
              <div className="w-24 sm:w-32 h-2 bg-gray-200 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-gradient-to-r from-green-400 to-green-600 transition-all duration-500"
                  style={{ width: `${Math.round(((submitted && result ? (result.correct / exercises.length) : (answeredCount / exercises.length)) ) * 100)}%` }}
                />
              </div>
              <span className="text-xs font-semibold text-gray-700">
                {submitted && result ? Math.round((result.correct / exercises.length) * 100) : Math.round((answeredCount / exercises.length) * 100)}%
              </span>
            </div>
          )}
        </div>
      </div>

      {submitted && result && result.pass && (
        <div className="bg-green-50 border-2 border-green-300 rounded-lg p-4 sm:p-6 mb-4 sm:mb-6">
          <div className="text-center">
            <div className="text-4xl sm:text-5xl mb-2">🎉</div>
            <h2 className="text-xl sm:text-2xl font-bold text-green-800 mb-2">Aprovado!</h2>
            <p className="text-sm sm:text-base text-green-700 mb-1">Acertos: {result.correct} / {total} ({Math.round(result.percentage*100)}%)</p>
            <p className="text-xs sm:text-sm text-green-600 mb-3 sm:mb-4">Critério: ≥ 80% de acertos.</p>
            <Link 
              href={`/curso/fundamentals/${slug}`}
              className="inline-block px-4 sm:px-6 py-2 text-sm sm:text-base bg-green-600 text-white rounded-lg hover:bg-green-700 transition"
            >
              Voltar para a lição
            </Link>
          </div>
        </div>
      )}
      {submitted && result && !result.pass && !showFailModal && (
        <div className="bg-red-50 border-2 border-red-300 rounded-lg p-4 sm:p-6 mb-4 sm:mb-6">
          <div className="text-center">
            <div className="text-4xl sm:text-5xl mb-2">📝</div>
            <h2 className="text-xl sm:text-2xl font-bold text-red-800 mb-2">Não Atingiu 80%</h2>
            <p className="text-sm sm:text-base text-red-700 mb-1">Acertos: {result.correct} / {total} ({Math.round(result.percentage*100)}%)</p>
            <p className="text-xs sm:text-sm text-red-600 mb-3 sm:mb-4">Erro ≤ 40%: revise a lição antes de um novo simulado.</p>
            <Link 
              href={`/curso/fundamentals/${slug}`}
              className="inline-block px-4 sm:px-6 py-2 text-sm sm:text-base bg-red-600 text-white rounded-lg hover:bg-red-700 transition"
            >
              Revisar conteúdo
            </Link>
          </div>
        </div>
      )}

      <ul className="space-y-4 sm:space-y-6">
        {exercises.map((ex, idx) => {
          const selected = answers[ex.id];
          const isCorrect = submitted ? answers[ex.id] === ex.correctIndex : false;
          const hasAnswered = answers[ex.id] !== undefined;

          return (
            <li key={ex.id} className={`bg-white border-2 rounded-lg p-4 sm:p-5 shadow-sm transition-all ${submitted ? (isCorrect ? 'border-green-300 bg-green-50' : 'border-red-300 bg-red-50') : 'border-gray-200'}`}>
              <div className="flex items-start gap-2 sm:gap-3 mb-3">
                <div className={`flex-shrink-0 w-7 h-7 sm:w-8 sm:h-8 rounded-full flex items-center justify-center text-sm sm:text-base font-bold ${
                  isCorrect ? 'bg-green-500 text-white' : 'bg-gray-200 text-gray-700'
                }`}>
                  {idx + 1}
                </div>
                <div className="flex-1">
                  <p className="font-semibold text-base sm:text-lg text-gray-800">{ex.prompt}</p>
                  {ex.difficulty && (
                    <span className={`inline-block mt-1 text-xs px-2 py-0.5 rounded-full border ${
                      ex.difficulty === 'easy' ? 'bg-green-100 border-green-300 text-green-700' :
                      ex.difficulty === 'medium' ? 'bg-yellow-100 border-yellow-300 text-yellow-700' :
                      'bg-purple-100 border-purple-300 text-purple-700'
                    }`}>{
                      ex.difficulty === 'easy' ? 'Fácil' : ex.difficulty === 'medium' ? 'Médio' : 'Difícil'
                    }</span>
                  )}
                </div>
              </div>

              <div className="space-y-2 mb-3 sm:mb-4">
                {ex.options.map((opt, i) => {
                  const active = selected === i;
                  const isCorrectOption = submitted && i === ex.correctIndex;
                  const markedWrong = submitted && active && !isCorrectOption;
                  return (
                    <label key={i} className={`block px-3 sm:px-4 py-2.5 sm:py-3 rounded-lg border-2 text-xs sm:text-sm transition-all cursor-pointer ${
                      isCorrectOption ? 'bg-green-100 border-green-500 font-semibold' :
                      markedWrong ? 'bg-red-100 border-red-500' :
                      active ? 'bg-blue-50 border-blue-400' : 'border-gray-200 hover:bg-gray-50'
                    }`}>
                      <div className="flex items-center gap-2">
                        <input
                          type="radio"
                          name={ex.id}
                          value={i}
                          disabled={submitted}
                          checked={active || false}
                          onChange={() => select(ex.id, i)}
                          className="accent-blue-600"
                        />
                        <span className="flex items-center gap-1">
                          {isCorrectOption && <span className="text-green-600">✓</span>}
                          {markedWrong && <span className="text-red-600">✗</span>}
                          {opt}
                        </span>
                      </div>
                    </label>
                  );
                })}
              </div>
              {!submitted && ex.hint && (
                <button
                  onClick={() => toggleHint(ex.id)}
                  className="px-3 py-1.5 text-sm rounded-lg bg-yellow-100 text-yellow-800 border border-yellow-300 hover:bg-yellow-200 transition"
                >
                  {showHints[ex.id] ? '🔒 Esconder dica' : '💡 Ver dica'}
                </button>
              )}

              {showHints[ex.id] && ex.hint && !submitted && (
                <div className="mt-3 p-3 bg-yellow-50 border-l-4 border-yellow-400 rounded text-sm text-yellow-900">
                  <strong>💡 Dica:</strong> {ex.hint}
                </div>
              )}

              {submitted && (
                <div className="mt-4 space-y-3">
                  {/* Analogia */}
                  {ex.analogy && (
                    <div className="p-4 bg-purple-50 border-l-4 border-purple-400 rounded text-sm text-gray-800 leading-relaxed">
                      <strong>🌟 Analogia:</strong> {ex.analogy}
                    </div>
                  )}

                  {/* Explicação rápida */}
                  <div className="p-3 bg-blue-50 border-l-4 border-blue-400 rounded text-sm text-gray-700">
                    <strong>📖 Explicação:</strong> {ex.explanation}
                  </div>
                  
                  {/* Explicação detalhada */}
                  {ex.detailedExplanation && (
                    <>
                      <button
                        onClick={() => toggleDetailed(ex.id)}
                        className="text-sm text-blue-600 hover:text-blue-800 underline font-medium"
                      >
                        {showDetailed[ex.id] ? '▼ Esconder detalhes completos' : '▶ Ver explicação completa'}
                      </button>
                      {showDetailed[ex.id] && (
                        <div className="space-y-3">
                          <div className="p-4 bg-indigo-50 border border-indigo-200 rounded text-sm text-gray-800 leading-relaxed">
                            {ex.detailedExplanation}
                          </div>
                          
                          {/* Exemplo de código */}
                          {ex.codeExample && (
                            <div className="bg-gray-900 text-gray-100 rounded-lg p-4 overflow-x-auto">
                              <div className="flex items-center justify-between mb-2">
                                <span className="text-xs text-gray-400 font-mono">💻 Exemplo Prático</span>
                                <button
                                  onClick={() => {
                                    navigator.clipboard.writeText(ex.codeExample || '');
                                  }}
                                  className="text-xs px-2 py-1 bg-gray-700 hover:bg-gray-600 rounded text-gray-300 transition"
                                  title="Copiar código"
                                >
                                  📋 Copiar
                                </button>
                              </div>
                              <pre className="text-sm font-mono leading-relaxed whitespace-pre-wrap">
                                {ex.codeExample}
                              </pre>
                              <p className="text-xs text-gray-400 mt-3">
                                💡 <strong>Dica:</strong> Copie este código e teste no CodeRunner da lição!
                              </p>
                            </div>
                          )}
                        </div>
                      )}
                    </>
                  )}
                </div>
              )}
            </li>
          );
        })}
      </ul>
      
      {exercises.length === 0 && (
        <div className="text-center py-12 text-gray-500">
          <p className="text-lg">Nenhum exercício configurado para esta lição.</p>
        </div>
      )}

      {!submitted && exercises.length > 0 && (
        <div className="mt-6 sm:mt-8 flex justify-center">
          <button
            onClick={submitExam}
            disabled={!canSubmit}
            className="px-6 sm:px-8 py-3 text-base sm:text-lg rounded-lg bg-indigo-600 text-white font-semibold disabled:opacity-40 disabled:cursor-not-allowed hover:bg-indigo-700 transition shadow-lg"
          >
            {canSubmit ? '✅ Enviar Prova' : `⏳ Responda todas (${answeredCount}/${total})`}
          </button>
        </div>
      )}

      {/* Modal de Retake (erro > 40%) */}
      {showFailModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-2xl max-w-md w-full p-4 sm:p-6">
            <div className="text-center mb-4">
              <div className="text-5xl sm:text-6xl mb-3">📚</div>
              <h2 className="text-xl sm:text-2xl font-bold text-orange-800 mb-2">Retake Necessário</h2>
            </div>
            
            <div className="bg-orange-50 border-l-4 border-orange-400 p-3 sm:p-4 mb-4 text-xs sm:text-sm">
              <p className="text-gray-800 mb-2">
                <strong>Você errou mais que 40% da prova.</strong>
              </p>
              <p className="text-gray-700">
                Revise o conteúdo e tente novamente o simulado com nova combinação de questões.
              </p>
            </div>

            <div className="bg-blue-50 border border-blue-200 rounded p-4 mb-4 text-sm">
              <p className="text-gray-800 mb-2">
                <strong>💡 O que vai acontecer:</strong>
              </p>
              <ul className="space-y-1 text-gray-700">
                <li className="flex items-start gap-2">
                  <span className="text-blue-600">•</span>
                  <span>Você voltará para a lição para revisar</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-blue-600">•</span>
                  <span>Suas respostas serão apagadas</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-blue-600">•</span>
                  <span>As questões virão em ordem diferente</span>
                </li>
              </ul>
            </div>

            <div className="bg-green-50 border border-green-200 rounded p-3 mb-4 text-sm text-gray-700">
              <strong>✅ Dica:</strong> Use o CodeRunner e o Assistente IA 🤖 para tirar dúvidas!
            </div>

            <button
              onClick={() => {
                localStorage.removeItem(`examResult:${slug}`);
                localStorage.removeItem(`progress:${slug}`); // legado
                router.refresh();
              }}
              className="w-full px-6 py-3 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition font-semibold"
            >
              Tentar novamente �
            </button>
          </div>
        </div>
      )}

      {/* Assistente Pedagógico IA */}
      <AITutor lessonSlug={slug} />
    </main>
  );
}

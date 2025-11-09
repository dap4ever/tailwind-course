export default function Home() {
  return (
    <main className="min-h-[70vh] flex flex-col items-center justify-center p-6">
      <section className="max-w-3xl w-full bg-white rounded-xl shadow-md p-8 border">
        <h1 className="text-3xl font-bold mb-2 text-center">Plataforma de Curso JS</h1>
        <p className="text-gray-700 text-center mb-6">
          Estude JavaScript do básico ao avançado com documentação profissional e demos locais.
        </p>

        <div className="space-y-3">
          <div className="p-4 rounded bg-slate-50 border">
            <h2 className="font-semibold mb-1">Documentação</h2>
            <p className="text-sm text-gray-700">Acesse as aulas em <code>docs/course/</code> no repositório.</p>
          </div>
          <div className="p-4 rounded bg-slate-50 border">
            <h2 className="font-semibold mb-1">Executar Demos</h2>
            <p className="text-sm text-gray-700">Use os scripts <code>npm run course:01</code> até <code>course:05</code> ou <code>npm run course 03</code>.</p>
          </div>
          <div className="p-4 rounded bg-slate-50 border">
            <h2 className="font-semibold mb-1">Estrutura</h2>
            <p className="text-sm text-gray-700"><code>javascript-course/</code> contém lições, demos e exercícios.</p>
          </div>
        </div>
      </section>
    </main>
  )
}

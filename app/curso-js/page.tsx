export default function CursoJsPage() {
  return (
    <main className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-2">Curso JavaScript</h1>
      <p className="text-gray-700 mb-4">
        Este curso está disponível em formato de documentação profissional no repositório, sem navegação interativa no site.
      </p>
      <div className="rounded border bg-white p-4">
        <p>
          Consulte as aulas em <code>docs/course/</code> e execute as demos em <code>javascript-course/lessons</code>.
        </p>
        <ul className="list-disc pl-6 mt-3 text-sm text-gray-600">
          <li>Leia o índice em <code>docs/course/README.md</code>.</li>
          <li>Rode as demos via scripts <code>npm run course:01</code> … <code>course:05</code>.</li>
        </ul>
      </div>
    </main>
  );
}

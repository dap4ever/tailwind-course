export default function ContatoPage() {
  return (
    <main className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Contato</h1>
      <form className="max-w-md mx-auto bg-white p-6 rounded shadow">
        <label className="block mb-2">Nome
          <input type="text" className="w-full border rounded p-2" required />
        </label>
        <label className="block mb-2">Email
          <input type="email" className="w-full border rounded p-2" required />
        </label>
        <label className="block mb-4">Mensagem
          <textarea className="w-full border rounded p-2" rows={4} required />
        </label>
        <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded">Enviar</button>
      </form>
    </main>
  );
}

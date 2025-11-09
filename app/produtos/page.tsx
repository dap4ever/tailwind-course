const produtos = [
  { id: 1, nome: 'Arroz', preco: 20.99 },
  { id: 2, nome: 'Feijão', preco: 8.49 },
  { id: 3, nome: 'Óleo', preco: 6.99 },
  { id: 4, nome: 'Macarrão', preco: 4.99 },
];

export default function ProdutosPage() {
  return (
    <main className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Produtos</h1>
      <ul className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {produtos.map(produto => (
          <li key={produto.id} className="border rounded p-4 shadow">
            <span className="font-semibold">{produto.nome}</span>
            <span className="block text-green-600">R$ {produto.preco.toFixed(2)}</span>
          </li>
        ))}
      </ul>
    </main>
  );
}

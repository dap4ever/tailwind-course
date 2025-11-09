# Lição 05: Objetos

## Criação e acesso
```js
const user = { id: 1, nome: 'Ana', ativo: true }
console.log(user.nome)
```

## Destructuring e shorthand
```js
const { id, nome } = user
const ativo = true
const u2 = { id, nome, ativo }
```

## Métodos e this
```js
const conta = {
  saldo: 100,
  depositar(valor) { this.saldo += valor }
}
conta.depositar(50)
console.log(conta.saldo)
```

## Referência vs cópia
```js
const a = { x: 1 }
const b = a // referência
const c = { ...a } // cópia rasa
```

## Exercícios
1. Modele um produto (id, nome, preco) e crie funções para aplicar desconto.
2. Converta um array de objetos em um Map pelo id.
3. Faça deep clone simples usando JSON para objetos sem funções.

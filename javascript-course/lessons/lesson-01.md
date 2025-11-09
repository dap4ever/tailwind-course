# Lição 01: Variáveis e Tipos

JavaScript é dinamicamente tipado: o tipo é associado ao valor, não à variável.

## Declaração de variáveis
- `var`: legado, escopo de função, sofre hoisting peculiar.
- `let`: escopo de bloco, ideal para variáveis mutáveis.
- `const`: escopo de bloco, não pode ser reatribuída (mas objetos internos podem mudar).

```js
let nome = 'Ana'
const PI = 3.14159
var idade = 30
```

## Tipos primitivos
- string
- number (inteiros e floats)
- boolean
- null (intencionalmente vazio)
- undefined (não definido ainda)
- bigint (números muito grandes)
- symbol (identificadores únicos)

```js
let texto = 'Olá'
let quantidade = 42
let ativo = true
let nada = null
let desconhecido
let grande = 9007199254740991n
let id = Symbol('usuario')
```

## typeof
```js
console.log(typeof texto) // 'string'
console.log(typeof nada) // 'object' (peculiaridade histórica)
```

## Conversões
```js
Number('10') // 10
String(20) // '20'
Boolean(0) // false
```

## Boas práticas
- Prefira `const` e use `let` somente quando precisar mudar.
- Evite `var`.

## Exercícios
1. Crie três variáveis (nome, idade, ativo) e imprima tipos.
2. Converta uma string numérica em número e some + 5.
3. Teste diferença entre `null` e `undefined`.

Veja `demo-01.js` para exemplos.

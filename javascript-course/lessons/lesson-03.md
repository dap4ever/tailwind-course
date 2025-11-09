# Lição 03: Funções

## Declaração vs Expressão
```js
function soma(a, b) {
  return a + b
}

const mult = function (a, b) {
  return a * b
}
```

## Arrow Functions
```js
const sub = (a, b) => a - b
const dobro = x => x * 2
```

## Parâmetros padrão e rest
```js
function ola(nome = 'mundo') {
  return `Olá, ${nome}`
}

function somaTudo(...nums) {
  return nums.reduce((acc, n) => acc + n, 0)
}
```

## Escopo e closures
```js
function contador() {
  let i = 0
  return function () {
    i++
    return i
  }
}

const c = contador()
console.log(c(), c()) // 1, 2
```

## Exercícios
1. Implemente `calc(a, b, op)` para + - * /.
2. Crie uma factory `criaUsuario(nome)` que retorna objeto com método `saudar()`.
3. Escreva uma função que memoiza resultados simples.

# Lição 04: Arrays

## Criação e acesso
```js
const nums = [10, 20, 30]
console.log(nums[0], nums.length)
```

## Métodos principais
- push, pop, shift, unshift
- map, filter, reduce, forEach, find, some, every

```js
const dobrados = nums.map(n => n * 2)
const pares = nums.filter(n => n % 2 === 0)
const soma = nums.reduce((acc, n) => acc + n, 0)
```

## Imutabilidade básica
```js
const novo = [...nums, 40]
```

## Exercícios
1. Dado um array de preços, calcule total e média.
2. Filtre nomes com mais de 4 letras.
3. Transforme uma lista de objetos em um índice por id (reduce).

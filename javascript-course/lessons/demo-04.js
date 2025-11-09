// Demo 04: Arrays

const nums = [10, 20, 30]
console.log('len', nums.length, 'primeiro', nums[0])

const dobrados = nums.map(n => n * 2)
const pares = nums.filter(n => n % 2 === 0)
const soma = nums.reduce((acc, n) => acc + n, 0)

console.log({ dobrados, pares, soma })

const novo = [...nums, 40]
console.log('novo', novo)

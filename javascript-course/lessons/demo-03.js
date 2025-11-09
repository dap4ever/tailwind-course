// Demo 03: Funções

function soma(a, b) { return a + b }
const mult = function (a, b) { return a * b }
const sub = (a, b) => a - b

console.log(soma(2,3), mult(2,3), sub(5,2))

function ola(nome = 'mundo') { return `Olá, ${nome}` }
console.log(ola(), ola('Ana'))

function somaTudo(...nums) { return nums.reduce((acc, n) => acc + n, 0) }
console.log(somaTudo(1,2,3,4))

function contador() {
  let i = 0
  return () => ++i
}
const c = contador()
console.log(c(), c(), c())

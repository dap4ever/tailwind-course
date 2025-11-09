// Demo 01: Variáveis e Tipos

let nome = 'Ana'
const PI = 3.14159
var idade = 30

console.log(nome, PI, idade)

let texto = 'Olá'
let quantidade = 42
let ativo = true
let nada = null
let desconhecido
let grande = 9007199254740991n
let id = Symbol('usuario')

console.log(typeof texto, typeof quantidade, typeof ativo)
console.log(typeof nada, typeof desconhecido, typeof grande, typeof id)

// Conversões
console.log(Number('10') + 5)
console.log(String(20))
console.log(Boolean(0), Boolean(1))

// Exercício guia:
// 1. Crie suas próprias variáveis e imprima tipos.
// 2. Converta '123' em número e some 7.
// 3. Compare null == undefined e null === undefined.

console.log('null == undefined ?', null == undefined)
console.log('null === undefined ?', null === undefined)

// Demo 02: Controle de Fluxo e Operadores

// If/else
const idade = 18
if (idade >= 18) {
  console.log('Maior de idade')
} else {
  console.log('Menor de idade')
}

// Switch
const cor = 'verde'
switch (cor) {
  case 'vermelho':
    console.log('pare')
    break
  case 'verde':
    console.log('siga')
    break
  default:
    console.log('atenção')
}

// Loops
for (let i = 1; i <= 5; i++) {
  console.log('i =', i)
}

let j = 0
while (j < 3) {
  console.log('j =', j)
  j++
}

// Ternário
const saldo = 25
const statusSaldo = saldo > 0 ? 'positivo' : 'zerado ou negativo'
console.log('Saldo está', statusSaldo)

# Lição 02: Controle de Fluxo e Operadores

## Operadores
- Aritméticos: +, -, *, /, %, **
- Atribuição: =, +=, -=, *=, /=
- Comparação: >, <, >=, <=, ==, !=, ===, !==
- Lógicos: &&, ||, !
- Ternário: `cond ? a : b`

## If / Else
```js
const idade = 18
if (idade >= 18) {
  console.log('Maior de idade')
} else {
  console.log('Menor de idade')
}
```

## Switch
```js
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
```

## Loops
```js
for (let i = 0; i < 3; i++) {
  console.log(i)
}

let j = 0
while (j < 3) {
  console.log('j', j)
  j++
}
```

## Exercícios
1. Crie um programa que imprime Fizz/Buzz de 1 a 20.
2. Use switch para classificar notas A/B/C/D/F.
3. Reescreva um if/else usando operador ternário.

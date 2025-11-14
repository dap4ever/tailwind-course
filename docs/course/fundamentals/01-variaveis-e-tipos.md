# 01 · Variáveis e Tipos

## 🎯 O que você vai aprender

Bem-vindo à sua primeira lição de JavaScript! Nesta aula, você vai aprender os fundamentos mais importantes de qualquer linguagem de programação: **como guardar informações** e **quais tipos de informações existem**.

Não se preocupe se você nunca programou antes - vamos começar do absoluto zero! 🚀

---

## 📦 O que são Variáveis?

Imagine que você tem várias caixas na sua casa. Em cada caixa, você pode guardar coisas diferentes: livros, roupas, brinquedos. **Variáveis são exatamente isso: caixas na memória do computador onde guardamos informações.**

```javascript
// Criando uma "caixa" chamada nome e guardando texto nela
let nome = "Maria";

// Criando outra "caixa" chamada idade e guardando um número
let idade = 25;

// Podemos usar essas "caixas" depois
console.log(nome);  // Mostra: Maria
console.log(idade); // Mostra: 25
```

---

## 🔑 Três formas de criar variáveis

Em JavaScript, temos **três palavras-chave** para criar variáveis:

### 1️⃣ **const** - A Caixa Trancada 🔒

Use `const` quando você quer guardar algo que **não vai mudar**:

```javascript
const anoDeNascimento = 2000;
const nomeDoPais = "Brasil";
const PI = 3.14159;

// ❌ Isso daria ERRO:
// anoDeNascimento = 2001;  // Não pode mudar!
```

**Quando usar:** Para valores fixos como configurações, constantes matemáticas, ou qualquer coisa que não deve ser alterada.

### 2️⃣ **let** - A Caixa Normal 📦

Use `let` quando o valor **pode mudar**:

```javascript
let pontos = 0;
console.log(pontos);  // 0

pontos = pontos + 10;
console.log(pontos);  // 10

pontos = pontos + 5;
console.log(pontos);  // 15
```

**Quando usar:** Para valores que vão mudando, como contadores, pontuações, status de um jogo, etc.

### 3️⃣ **var** - A Caixa Velha (EVITE!) ⚠️

`var` é a forma antiga de criar variáveis. Hoje em dia, **não use var**! Ela tem problemas técnicos que podem causar bugs difíceis de encontrar.

```javascript
// ❌ NÃO FAÇA ISSO
var numero = 5;

// ✅ FAÇA ISSO
let numero = 5;
```

---

## 🎨 Tipos de Dados Primitivos

JavaScript tem **7 tipos básicos** de informação que você pode guardar:

### 1. **String** - Texto 📝

Qualquer texto vai entre aspas (simples `'...'` ou duplas `"..."`):

```javascript
const saudacao = "Olá, mundo!";
const cidade = 'São Paulo';
const frase = "Hoje é segunda-feira";

console.log(typeof saudacao);  // "string"
```

### 2. **Number** - Números 🔢

Todos os números (inteiros ou decimais) são do tipo `number`:

```javascript
const idade = 25;
const preco = 19.99;
const temperatura = -5;
const grande = 1000000;

console.log(typeof idade);  // "number"
```

### 3. **Boolean** - Verdadeiro ou Falso ✅❌

Apenas dois valores possíveis: `true` (verdadeiro) ou `false` (falso):

```javascript
const estaLogado = true;
const temDesconto = false;
const maiorDeIdade = true;

console.log(typeof estaLogado);  // "boolean"
```

**Uso prático:** Para decisões (se algo está ligado/desligado, ativo/inativo, etc.)

### 4. **Undefined** - Ainda não definido 🤷

Quando uma variável existe mas não tem valor:

```javascript
let nomeUsuario;
console.log(nomeUsuario);        // undefined
console.log(typeof nomeUsuario); // "undefined"
```

### 5. **Null** - Vazio intencional 🗑️

Representa "nada" ou "vazio" de propósito:

```javascript
let carrinhoDeCompras = null;  // Vazio de propósito
console.log(carrinhoDeCompras);  // null

// ⚠️ PEGADINHA FAMOSA DO JAVASCRIPT:
console.log(typeof null);  // "object" (isso é um BUG histórico!)
```

### 6. **BigInt** - Números gigantes 🦕

Para números maiores que `9007199254740991`:

```javascript
const numeroGrande = 9007199254740991n;  // Note o 'n' no final
const muitoGrande = BigInt("12345678901234567890");

console.log(typeof numeroGrande);  // "bigint"
```

### 7. **Symbol** - Identificador único 🔐

Usado em casos avançados (não se preocupe por enquanto):

```javascript
const id = Symbol("identificador");
console.log(typeof id);  // "symbol"
```

---


## 🔍 Descobrindo o tipo: `typeof`

### 🕵️‍♂️ Analogia: O Raio-X das Variáveis
Imagine que você tem uma caixa fechada e quer saber o que tem dentro sem abrir. O operador `typeof` funciona como um raio-x: ele "olha" para dentro da variável e te diz que tipo de coisa está guardada lá!

### Como funciona?
O `typeof` retorna uma palavra (string) dizendo o tipo do valor:

```javascript
console.log(typeof "Olá");      // "string" (texto)
console.log(typeof 42);         // "number" (número)
console.log(typeof true);       // "boolean" (verdadeiro/falso)
console.log(typeof undefined);  // "undefined" (ainda não definido)
console.log(typeof 123n);       // "bigint" (número gigante)
console.log(typeof function(){}); // "function" (função)

// ⚠️ Pegadinha famosa:
console.log(typeof null);       // "object" (isso é um bug histórico do JavaScript!)
```

### Para que serve?
- Descobrir o tipo de uma variável antes de usar
- Evitar erros ao comparar ou converter valores
- Depurar seu código e entender o que está acontecendo

### Dica prática
Sempre que estiver em dúvida sobre o que tem dentro de uma variável, use:
```javascript
console.log(typeof minhaVariavel);
```
Assim você evita surpresas e bugs!

---

## 🔄 Conversões de Tipo

Às vezes precisamos **transformar** um tipo em outro:

### String → Number

```javascript
const textoIdade = "25";
const numeroIdade = Number(textoIdade);

console.log(textoIdade + 5);    // "255" (concatena texto)
console.log(numeroIdade + 5);   // 30 (soma números)

// ⚠️ Cuidado com textos inválidos:
const invalido = Number("abc");
console.log(invalido);  // NaN (Not a Number)
```

### Number → String

```javascript
const numero = 42;
const texto = String(numero);

console.log(typeof numero);  // "number"
console.log(typeof texto);   // "string"
```

### 🚫 O que é NaN?

**NaN** significa "**Not a Number**" (Não é um Número). É um valor especial que JavaScript retorna quando uma operação matemática falha ou produz resultado inválido:

```javascript
// Operações que geram NaN:
console.log(0 / 0);           // NaN (divisão impossível)
console.log(Number("abc"));   // NaN (conversão inválida)
console.log(Math.sqrt(-1));   // NaN (raiz de negativo)
console.log(parseInt("xyz")); // NaN (parsing falhou)

// NaN "contamina" operações:
console.log(10 + NaN);        // NaN
console.log(NaN * 5);         // NaN

// Peculiaridade famosa:
console.log(NaN === NaN);     // false! 😱
console.log(typeof NaN);      // "number" (irônico!)
```

**Como verificar se algo é NaN?**

```javascript
const resultado = Number("texto");

// ❌ ERRADO: não funciona!
if (resultado === NaN) { }

// ✅ CORRETO:
if (Number.isNaN(resultado)) {
  console.log("É NaN!");
}

// ⚠️ ALTERNATIVA (menos precisa):
if (isNaN(resultado)) {
  console.log("É NaN ou não é número");
}
```

**Por que NaN !== NaN?**
É uma regra do padrão IEEE 754 (matemática de ponto flutuante): resultados indefinidos não devem ser comparáveis entre si. Isso evita que você compare "erros" como se fossem valores válidos.

### Qualquer coisa → Boolean

```javascript
console.log(Boolean(1));        // true
console.log(Boolean(0));        // false
console.log(Boolean("olá"));    // true
console.log(Boolean(""));       // false
console.log(Boolean(null));     // false
console.log(Boolean(undefined));// false
```

**Regra geral:** Valores "vazios" viram `false`, o resto vira `true`.

---

## ⚖️ Comparações: == vs ===

JavaScript tem **dois** operadores de igualdade:

### `===` - Igualdade Estrita (RECOMENDADO) ✅

Compara valor **E** tipo:

```javascript
console.log(5 === 5);      // true
console.log(5 === "5");    // false (número vs string)
console.log(true === 1);   // false (boolean vs number)
```

### `==` - Igualdade Frouxa (EVITE) ⚠️

Tenta converter tipos antes de comparar:

```javascript
console.log(5 == "5");     // true (converte string)
console.log(true == 1);    // true (converte boolean)
console.log(null == undefined);  // true 🤔

// ⚠️ Isso pode causar bugs! Prefira sempre ===
```

### 🔬 `Object.is()` - Comparação Ultra-Precisa

Existe uma terceira forma ainda mais precisa que `===`:

```javascript
// Caso especial 1: NaN
console.log(NaN === NaN);          // false (pegadinha!)
console.log(Object.is(NaN, NaN));  // true ✅

// Caso especial 2: +0 vs -0
console.log(0 === -0);             // true
console.log(Object.is(0, -0));     // false ✅

// Casos normais: funciona igual a ===
console.log(Object.is(5, 5));      // true
console.log(Object.is(5, "5"));    // false
```

**Quando usar:**
- Use `===` em 99% dos casos (é o padrão).
- Use `Object.is()` apenas quando precisar detectar `NaN` ou distinguir `+0` de `-0` (casos raros).
- Para checar NaN especificamente, prefira `Number.isNaN(valor)`.

---

## 💪 Mini-Desafios

Antes de ir para os exercícios, teste seu raciocínio com estes desafios interativos:

<!-- O carrossel de mini-desafios será renderizado aqui pelo componente MiniChallenge -->

---

## 💡 Boas Práticas

1. ✅ **Use `const` por padrão**. Só use `let` quando realmente precisar mudar o valor.
2. ✅ **Nunca use `var`**.
3. ✅ **Dê nomes descritivos** às variáveis: `idadeUsuario` é melhor que `x`.
4. ✅ **Use `===` sempre** (não `==`).
5. ✅ **Converta tipos explicitamente** com `Number()`, `String()`, `Boolean()`.

---

## 🎯 Desafios Práticos

Agora é sua vez! Teste seus conhecimentos:

1. **Clique em "Exercícios"** no final desta página para fazer o simulado (12 questões)
2. **Use o CodeRunner abaixo** para experimentar com código real
3. Experimente os mini-desafios acima no CodeRunner!

---

## 🚀 Próximos Passos

Depois de dominar variáveis e tipos, você estará pronto para:
- **Lição 02:** Controle de Fluxo (if, else, switch)
- **Lição 03:** Funções
- **Lição 04:** Arrays
- **Lição 05:** Objetos

Vamos nessa! 💪

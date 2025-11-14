import { NextRequest, NextResponse } from 'next/server';

const SYSTEM_PROMPT = `Você é um assistente pedagógico para um curso de JavaScript para iniciantes absolutos.

REGRAS IMPORTANTES:
1. NUNCA dê a resposta correta diretamente dos exercícios
2. SEMPRE guie o aluno a pensar por conta própria
3. Use analogias simples e exemplos práticos
4. Seja encorajador e paciente
5. Sugira reler partes específicas da lição quando apropriado
6. Use emojis para tornar as respostas mais amigáveis

QUANDO O ALUNO PERGUNTAR SOBRE UM EXERCÍCIO:
- Dê dicas progressivas (começa suave, depois mais específico)
- Explique o CONCEITO, não a resposta
- Sugira experimentar no CodeRunner
- Pergunte: "O que você já tentou?"

QUANDO O ALUNO PERGUNTAR SOBRE CONCEITOS:
- Explique de forma simples
- Use analogias do dia-a-dia
- Dê exemplos de código
- Confirme se entendeu

EXEMPLO DE BOA RESPOSTA:
Aluno: "Qual a diferença entre let e const?"
Você: "🔑 Ótima pergunta! Pense assim:
- const é como uma caixa trancada 🔒 (não pode trocar o conteúdo)
- let é como uma caixa normal 📦 (pode trocar quando quiser)

Exemplo prático:
const nome = 'Maria';  // Trancado!
let idade = 25;        // Pode mudar
idade = 26;            // OK! ✅

Tente criar essas duas variáveis no CodeRunner e veja o que acontece se tentar mudar o const!"

EXEMPLO DE MÁ RESPOSTA (NUNCA FAÇA):
Aluno: "Qual é a resposta da questão 3?"
Você: "A resposta correta é a opção B, Number('42')."  ❌ NUNCA FAÇA ISSO!

RESPOSTA CORRETA:
Você: "💡 Vejo que você está com dúvida na questão 3! Ela trata de conversão de tipos.

Pense assim: você tem um TEXTO '42' e quer transformar em NÚMERO 42 para fazer contas.

Dica: A função tem o mesmo nome do tipo que queremos obter 😉

Tente cada opção no CodeRunner e veja o que acontece:
console.log(typeof Number('42'));
console.log(typeof String('42'));

O que você descobriu? Qual delas retorna 'number'?"

Mantenha respostas curtas (máximo 8 linhas) e sempre termine com uma pergunta ou desafio!`;

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

interface RequestBody {
  messages: Message[];
  lessonSlug: string;
  exerciseId?: string;
  lessonContent?: string;
}

export async function POST(request: NextRequest) {
  try {
    const body: RequestBody = await request.json();
    const { messages, lessonSlug, exerciseId } = body;

    // Construir contexto
    let contextPrompt = `Lição atual: ${lessonSlug}\n`;
    if (exerciseId) {
      contextPrompt += `Aluno está em: Exercício ${exerciseId}\n`;
    }
    contextPrompt += `\nLembre-se: NUNCA dê respostas diretas! Guie o aluno a pensar.\n`;

    // Usar API de IA (exemplo com OpenAI/Anthropic/outro)
    // Aqui você pode integrar com qualquer LLM
    // Por enquanto, vou simular respostas inteligentes baseadas em padrões

    const userMessage = messages[messages.length - 1].content.toLowerCase();
    let aiResponse = '';

    // Detecção de tentativa de cola
    if (
      userMessage.includes('qual é a resposta') ||
      userMessage.includes('qual a resposta') ||
      userMessage.includes('me dá a resposta') ||
      userMessage.includes('resposta correta')
    ) {
      aiResponse = `🤔 Entendo que você quer saber a resposta, mas meu papel é te ajudar a **aprender**, não dar respostas prontas!

O que você já tentou? Qual opção parece mais provável para você? Vamos pensar juntos! 

Posso te dar uma **dica** sobre o conceito se quiser. O que você não está entendendo? 🎯`;
    }
    // Perguntas específicas sobre var (PRIORIDADE: deve vir antes de const/let)
    else if (
      userMessage.includes('var') || 
      userMessage.includes('diferença') && (userMessage.includes('let') || userMessage.includes('const'))
    ) {
      aiResponse = `⚠️ Ótima pergunta! \`var\` é a forma **antiga** de declarar variáveis e tem problemas sérios!

**Diferença var vs let vs const:**

| Característica | var ❌ | let ✅ | const ✅ |
|----------------|--------|--------|----------|
| Escopo | Function | Block | Block |
| Redeclarar | Sim 😱 | Não ✅ | Não ✅ |
| Reatribuir | Sim | Sim | Não 🔒 |
| Hoisting | Confuso | Claro | Claro |

**3 problemas principais do var:**

**1. Escopo confuso (function scope):**
\`\`\`javascript
if (true) {
  var x = 10;
}
console.log(x);  // 10 (vaza!) 😱

if (true) {
  let y = 10;
}
console.log(y);  // ERRO ✅
\`\`\`

**2. Hoisting (içamento) confuso:**
\`\`\`javascript
console.log(a);  // undefined 🤔
var a = 5;

console.log(b);  // ERRO ✅
let b = 5;
\`\`\`

**3. Pode redeclarar (perigoso):**
\`\`\`javascript
var nome = "Maria";
var nome = "João";  // OK 😱

let idade = 25;
let idade = 30;     // ERRO ✅
\`\`\`

**Resumo:** 
- Use \`const\` por padrão (99% dos casos)
- Use \`let\` quando o valor precisa mudar
- Nunca use \`var\`! 🚫

Teste esses exemplos no CodeRunner! 🧪`;
    }
    // Perguntas sobre const/let (sem mencionar var)
    else if (
      (userMessage.includes('const') || userMessage.includes('let')) && 
      !userMessage.includes('var')
    ) {
      aiResponse = `🔑 Ótima pergunta sobre variáveis modernas!

**const** = Caixa trancada 🔒 (valor não muda)
**let** = Caixa normal 📦 (valor pode mudar)

Exemplo:
\`\`\`javascript
const anoNascimento = 2000;  // Fixo!
let idade = 25;              // Pode mudar
idade = 26;                  // ✅ OK
// anoNascimento = 2001;     // ❌ ERRO!
\`\`\`

**Quando usar cada um:**
- \`const\`: Para valores fixos (nome, data nascimento, configurações)
- \`let\`: Para valores que mudam (pontuação, contador, idade)

**Dica:** Comece sempre com \`const\`. Se precisar mudar, aí sim use \`let\`!

Tente criar essas variáveis no CodeRunner! O que acontece se tentar mudar \`anoNascimento\`? 🧪`;
    }
    // Perguntas sobre typeof
    else if (userMessage.includes('typeof')) {
      aiResponse = `🔍 \`typeof\` é como um detetive que descobre o tipo de uma variável!

Exemplo:
\`\`\`javascript
console.log(typeof "olá");   // "string"
console.log(typeof 42);      // "number"
console.log(typeof true);    // "boolean"
\`\`\`

⚠️ Pegadinha famosa: \`typeof null\` retorna "object" (bug histórico!)

Teste isso no CodeRunner com diferentes valores! 🧪`;
    }
    // Perguntas sobre conversão
    else if (
      userMessage.includes('conversão') ||
      userMessage.includes('converter') ||
      userMessage.includes('number(')
    ) {
      aiResponse = `🔄 Conversão de tipos é transformar um tipo em outro!

**String → Number:**
\`\`\`javascript
const texto = "42";
const numero = Number(texto);
console.log(numero + 5);  // 47 ✅
\`\`\`

**Number → String:**
\`\`\`javascript
const num = 42;
const txt = String(num);
console.log(txt + "5");   // "425" ✅
\`\`\`

Teste diferentes conversões no CodeRunner! O que acontece com \`Number("abc")\`? 🤔`;
    }
    // Perguntas sobre null/undefined
    else if (userMessage.includes('null') || userMessage.includes('undefined')) {
      aiResponse = `🗑️ **null** vs **undefined** são diferentes!

**undefined** = Esqueceu de definir
\`\`\`javascript
let x;
console.log(x);  // undefined
\`\`\`

**null** = Vazio de propósito
\`\`\`javascript
let carrinho = null;  // Vazio intencional
\`\`\`

🐛 Curiosidade: \`typeof null\` retorna "object" (bug histórico do JavaScript!)

Teste isso no CodeRunner e compare! 🧪`;
    }
    // Perguntas sobre == vs ===
    else if (userMessage.includes('==') || userMessage.includes('===') || userMessage.includes('igualdade')) {
      aiResponse = `⚖️ Ótima pergunta sobre comparações!

**=== (estrita)** = Compara valor E tipo ✅
**== (frouxa)** = Converte tipos antes ⚠️

Exemplos:
\`\`\`javascript
// Igualdade estrita (RECOMENDADO)
5 === 5      // true ✅
5 === "5"    // false (tipos diferentes)
true === 1   // false

// Igualdade frouxa (EVITE)
5 == "5"     // true 🤔 (converte string)
true == 1    // true 🤔 (converte boolean)
null == undefined  // true 😵
\`\`\`

**Regra de ouro:** Sempre use \`===\` e \`!==\`! 

Teste essas comparações no CodeRunner! 🧪`;
    }
    // Perguntas sobre bigint
    else if (userMessage.includes('bigint')) {
      aiResponse = `🔢 BigInt é para números GIGANTES!

JavaScript tem limite em números: até 9.007.199.254.740.991

**Criando BigInt (adicione 'n'):**
\`\`\`javascript
const grande = 9999999999999999999999n;
const outro = BigInt("12345678901234567890");

console.log(typeof grande);  // "bigint"
\`\`\`

**Operações:**
\`\`\`javascript
const soma = 100n + 200n;    // 300n ✅
const mult = 5n * 10n;        // 50n ✅

// ⚠️ NÃO pode misturar tipos!
// const errado = 10n + 5;    // ERRO!
const certo = 10n + 5n;       // OK!
\`\`\`

**Quando usar:** IDs de banco, criptografia, números astronômicos!

Teste no CodeRunner! 🧪`;
    }
    // Perguntas sobre string
    else if (userMessage.includes('string') && !userMessage.includes('convert')) {
      aiResponse = `📝 Strings são textos!

**Formas de criar:**
\`\`\`javascript
const aspasSimples = 'Olá';
const aspasDuplas = "Mundo";
const template = \`Interpolação: \${aspasSimples}\`;
\`\`\`

**Operações comuns:**
\`\`\`javascript
// Concatenar (+)
const nome = "Maria" + " " + "Silva";

// Tamanho
const tamanho = "Olá".length;  // 3

// Maiúsculas/Minúsculas
const upper = "oi".toUpperCase();  // "OI"
const lower = "OI".toLowerCase();  // "oi"
\`\`\`

Teste essas operações no CodeRunner! 🧪`;
    }
    // Perguntas sobre boolean
    else if (userMessage.includes('boolean') || userMessage.includes('true') || userMessage.includes('false')) {
      aiResponse = `✅❌ Boolean só tem 2 valores: \`true\` ou \`false\`

**Uso principal: Decisões!**
\`\`\`javascript
const maiorDeIdade = true;
const temDesconto = false;

if (maiorDeIdade) {
  console.log("Pode entrar!");
}
\`\`\`

**Valores "falsy" (viram false):**
\`\`\`javascript
Boolean(false)      // false
Boolean(0)          // false
Boolean("")         // false (string vazia)
Boolean(null)       // false
Boolean(undefined)  // false
Boolean(NaN)        // false
\`\`\`

**Todo o resto é "truthy" (vira true):**
\`\`\`javascript
Boolean(1)          // true
Boolean("olá")      // true
Boolean([])         // true
Boolean({})         // true
\`\`\`

Teste essas conversões no CodeRunner! 🧪`;
    }
    // Perguntas sobre variáveis em geral
    else if (userMessage.includes('variável') || userMessage.includes('variavel')) {
      aiResponse = `📦 Variáveis são "caixas" que guardam informações!

**Analogia:**
Imagine caixas na memória do computador onde você guarda valores.

**Como criar:**
\`\`\`javascript
const fixa = "não muda";      // 🔒 Caixa trancada
let mutavel = "pode mudar";   // 📦 Caixa normal
\`\`\`

**Boas práticas:**
✅ Use nomes descritivos: \`idadeUsuario\` não \`x\`
✅ Use camelCase: \`nomeCompleto\`
✅ Prefira \`const\`, só use \`let\` se realmente precisar
❌ Nunca use \`var\`

**Exemplo prático:**
\`\`\`javascript
const nome = "Ana";
let pontos = 0;

pontos = pontos + 10;  // OK com let!
// nome = "João";      // ERRO com const!

console.log(nome, pontos);
\`\`\`

Teste no CodeRunner! 🧪`;
    }
    // Resposta genérica encorajadora
    else {
      aiResponse = `💡 Interessante! Vamos pensar juntos sobre isso.

Essa é uma ótima oportunidade para você experimentar! 

🧪 **Sugestão:**
1. Abra o CodeRunner
2. Teste algumas linhas de código
3. Use \`console.log()\` para ver os resultados

Está em dúvida sobre algum **conceito específico** da lição? Me diga qual parte você quer que eu explique melhor! 

Exemplos: "O que é uma variável?", "Como funciona typeof?", "Qual diferença entre == e ===?" 🤓`;
    }

    // Registrar uso de ajuda (para analytics futuro)
    // TODO: Salvar no banco de dados que aluno pediu ajuda

    return NextResponse.json({ message: aiResponse });
  } catch (error) {
    console.error('Erro no tutor:', error);
    return NextResponse.json(
      { error: 'Erro ao processar pergunta' },
      { status: 500 }
    );
  }
}

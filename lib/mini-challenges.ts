export interface Challenge {
  id: number;
  title: string;
  code: string;
  answer: string;
}

export const variablesAndTypesChallenges: Challenge[] = [
  {
    id: 1,
    title: 'Qual o tipo?',
    code: `let misterio = null;
// Qual é o resultado de typeof misterio?`,
    answer: '"object" — é um bug histórico do JavaScript! null deveria ser "null", mas por compatibilidade legada, retorna "object".',
  },
  {
    id: 2,
    title: 'Conversões Estranhas',
    code: `console.log("5" - 2);  // ?
console.log("5" + 2);  // ?`,
    answer: '3 e "52" — O operador "-" força conversão numérica ("5" vira 5), mas "+" concatena strings quando um lado é string.',
  },
  {
    id: 3,
    title: 'Verdadeiro ou Falso?',
    code: `if ([]) { console.log("A"); }
if ("") { console.log("B"); }
if (0) { console.log("C"); }`,
    answer: 'Apenas "A" será impresso! Array vazio [] é truthy, mas string vazia "" e zero são falsy.',
  },
  {
    id: 4,
    title: 'NaN Misterioso',
    code: `const resultado = 0 / 0;
console.log(resultado === resultado);`,
    answer: 'false! NaN é o único valor em JavaScript que não é igual a si mesmo. Use Number.isNaN() para verificar.',
  },
  {
    id: 5,
    title: 'BigInt vs Number',
    code: `const big = 10n;
const normal = 5;
console.log(big + normal);`,
    answer: 'TypeError! Não é possível misturar BigInt com Number diretamente. Você precisa converter: big + BigInt(normal) ou Number(big) + normal.',
  },
];

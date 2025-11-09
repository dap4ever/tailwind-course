export type MCQ = {
  id: string;
  type: 'mcq';
  prompt: string;
  options: string[];
  correctIndex: number;
  explanation: string;
};

export type Exercise = MCQ;

export function getExercisesFor(slug: string): Exercise[] {
  if (slug === '01-variaveis-e-tipos') {
    const list: MCQ[] = [
      {
        id: 'q1',
        type: 'mcq',
        prompt: "Qual é a melhor escolha para declarar uma variável cujo valor NÃO muda?",
        options: ['var', 'let', 'const', 'number'],
        correctIndex: 2,
        explanation: 'Use const para valores que não serão reatribuídos; let para valores mutáveis; evite var.',
      },
      {
        id: 'q2',
        type: 'mcq',
        prompt: "Qual o resultado de typeof null?",
        options: ["'null'", "'object'", "'undefined'", "'boolean'"],
        correctIndex: 1,
        explanation: "Por uma peculiaridade histórica, typeof null retorna 'object'.",
      },
      {
        id: 'q3',
        type: 'mcq',
        prompt: "Qual chamada converte a string '42' em número 42?",
        options: ["String('42')", "Number('42')", "Boolean('42')", "+'42' + '0'"],
        correctIndex: 1,
        explanation: "Number('42') retorna o número 42. Também funcionaria o operador unário +('42').",
      },
      {
        id: 'q4',
        type: 'mcq',
        prompt: "Qual expressão é verdadeira?",
        options: ["null === undefined", "null == undefined", "Boolean(0) === true", "typeof 9007199254740991n === 'number'"],
        correctIndex: 1,
        explanation: "null == undefined é true (igualdade frouxa). Já === é false.",
      },
      {
        id: 'q5',
        type: 'mcq',
        prompt: "Qual opção descreve corretamente bigint?",
        options: [
          'Um tipo para strings muito grandes',
          'Um número inteiro arbitrariamente grande, escrito com sufixo n',
          'Um alias para number',
          'Um objeto especial do DOM',
        ],
        correctIndex: 1,
        explanation: 'bigint representa inteiros arbitrariamente grandes: ex.: 9007199254740991n.',
      },
    ];
    return list;
  }
  return [];
}

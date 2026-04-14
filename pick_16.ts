import { questions } from './src/data/questions';

let questionStats = questions.map((q, idx) => {
  let qMinN=0, qMaxN=0, qMinB=0, qMaxB=0, qMinT=0, qMaxT=0, qMinS=0, qMaxS=0;
  for (const opt of q.options) {
    if ((opt.scores.N||0) < qMinN) qMinN = opt.scores.N||0;
    if ((opt.scores.N||0) > qMaxN) qMaxN = opt.scores.N||0;
    
    if ((opt.scores.B||0) < qMinB) qMinB = opt.scores.B||0;
    if ((opt.scores.B||0) > qMaxB) qMaxB = opt.scores.B||0;
    
    if ((opt.scores.T||0) < qMinT) qMinT = opt.scores.T||0;
    if ((opt.scores.T||0) > qMaxT) qMaxT = opt.scores.T||0;
    
    if ((opt.scores.S||0) < qMinS) qMinS = opt.scores.S||0;
    if ((opt.scores.S||0) > qMaxS) qMaxS = opt.scores.S||0;
  }
  return {
    idx,
    title: q.title,
    N: qMaxN - qMinN,
    B: qMaxB - qMinB,
    T: qMaxT - qMinT,
    S: qMaxS - qMinS,
    total: (qMaxN - qMinN) + (qMaxB - qMinB) + (qMaxT - qMinT) + (qMaxS - qMinS)
  };
});

// Let's just pick 16 questions by picking 4 questions that maximize N variance, 4 that maximize B, 4 for T, 4 for S.
let selectedIndices = new Set<number>();

function pickTop(dim: 'N' | 'B' | 'T' | 'S', count: number) {
  const sorted = [...questionStats].filter(q => !selectedIndices.has(q.idx)).sort((a, b) => b[dim] - a[dim]);
  for (let i = 0; i < count; i++) {
    if (sorted[i]) selectedIndices.add(sorted[i].idx);
  }
}

pickTop('N', 4);
pickTop('B', 4);
pickTop('T', 4);
pickTop('S', 4);

console.log(Array.from(selectedIndices).sort((a, b) => a - b));

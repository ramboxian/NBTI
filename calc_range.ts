import { questions } from './src/data/questions';

let minN=0, maxN=0;
let minB=0, maxB=0;
let minT=0, maxT=0;
let minS=0, maxS=0;

for (const q of questions) {
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
  minN += qMinN; maxN += qMaxN;
  minB += qMinB; maxB += qMaxB;
  minT += qMinT; maxT += qMaxT;
  minS += qMinS; maxS += qMaxS;
}

console.log(`N: [${minN}, ${maxN}], range: ${maxN - minN}`);
console.log(`B: [${minB}, ${maxB}], range: ${maxB - minB}`);
console.log(`T: [${minT}, ${maxT}], range: ${maxT - minT}`);
console.log(`S: [${minS}, ${maxS}], range: ${maxS - minS}`);

import { questions } from './src/data/questions.ts';

let maxN = 0, minN = 0;
let maxB = 0, minB = 0;
let maxT = 0, minT = 0;
let maxS = 0, minS = 0;

for (const q of questions) {
  let qMaxN = -Infinity, qMinN = Infinity;
  let qMaxB = -Infinity, qMinB = Infinity;
  let qMaxT = -Infinity, qMinT = Infinity;
  let qMaxS = -Infinity, qMinS = Infinity;
  
  for (const opt of q.options) {
    const n = opt.scores.N || 0;
    const b = opt.scores.B || 0;
    const t = opt.scores.T || 0;
    const s = opt.scores.S || 0;
    
    if (n > qMaxN) qMaxN = n;
    if (n < qMinN) qMinN = n;
    if (b > qMaxB) qMaxB = b;
    if (b < qMinB) qMinB = b;
    if (t > qMaxT) qMaxT = t;
    if (t < qMinT) qMinT = t;
    if (s > qMaxS) qMaxS = s;
    if (s < qMinS) qMinS = s;
  }
  
  maxN += qMaxN; minN += qMinN;
  maxB += qMaxB; minB += qMinB;
  maxT += qMaxT; minT += qMinT;
  maxS += qMaxS; minS += qMinS;
}

console.log(`N: ${minN} to ${maxN} (range: ${maxN - minN})`);
console.log(`B: ${minB} to ${maxB} (range: ${maxB - minB})`);
console.log(`T: ${minT} to ${maxT} (range: ${maxT - minT})`);
console.log(`S: ${minS} to ${maxS} (range: ${maxS - minS})`);

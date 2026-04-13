import { questions } from './src/data/questions.ts';

function analyzeBias() {
  let totalN = 0, totalB = 0, totalT = 0;
  
  for (const q of questions) {
    let qN = 0, qB = 0, qT = 0;
    for (const opt of q.options) {
      if (opt.scores.N) qN += opt.scores.N;
      if (opt.scores.B) qB += opt.scores.B;
      if (opt.scores.T) qT += opt.scores.T;
    }
    // Average score per question for random guessing
    totalN += qN / q.options.length;
    totalB += qB / q.options.length;
    totalT += qT / q.options.length;
  }
  
  console.log(`Expected value for N: ${totalN.toFixed(2)}`);
  console.log(`Expected value for B: ${totalB.toFixed(2)}`);
  console.log(`Expected value for T: ${totalT.toFixed(2)}`);
}

analyzeBias();

import { questions16 } from './src/data/questions';

const N_TRIALS = 100000;
let eggCounts = {
  3: 0,
  4: 0,
  5: 0,
  6: 0
};

let nCounts = {}, bCounts = {}, tCounts = {}, sCounts = {};

for (let i = 0; i < N_TRIALS; i++) {
  let N = 0, B = 0, T = 0, S = 0;
  for (const q of questions16) {
    const opt = q.options[Math.floor(Math.random() * q.options.length)];
    N += opt.scores.N || 0;
    B += opt.scores.B || 0;
    T += opt.scores.T || 0;
    S += opt.scores.S || 0;
  }
  
  nCounts[N>0?'+':'-'] = (nCounts[N>0?'+':'-'] || 0) + 1;
  bCounts[B>0?'+':'-'] = (bCounts[B>0?'+':'-'] || 0) + 1;
  tCounts[T>0?'+':'-'] = (tCounts[T>0?'+':'-'] || 0) + 1;
  sCounts[S>0?'+':'-'] = (sCounts[S>0?'+':'-'] || 0) + 1;

  for (const thresh of [3, 4, 5, 6]) {
    if (Math.abs(N) >= thresh || Math.abs(B) >= thresh || Math.abs(T) >= thresh || Math.abs(S) >= thresh) {
      eggCounts[thresh]++;
    }
  }
}

console.log('N split:', nCounts);
console.log('B split:', bCounts);
console.log('T split:', tCounts);
console.log('S split:', sCounts);

for (const thresh in eggCounts) {
  console.log(`Threshold ${thresh}: ${(eggCounts[thresh] / N_TRIALS * 100).toFixed(2)}% chance of getting at least one easter egg`);
}

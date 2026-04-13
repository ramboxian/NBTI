import { questions } from './src/data/questions';

const N_TRIALS = 100000;
let eggCounts = {
  5: 0,
  6: 0,
  7: 0,
  8: 0
};

for (let i = 0; i < N_TRIALS; i++) {
  let N = 0, B = 0, T = 0, S = 0;
  for (const q of questions) {
    const opt = q.options[Math.floor(Math.random() * q.options.length)];
    N += opt.scores.N || 0;
    B += opt.scores.B || 0;
    T += opt.scores.T || 0;
    S += opt.scores.S || 0;
  }
  
  for (const thresh of [5, 6, 7, 8]) {
    if (Math.abs(N) >= thresh || Math.abs(B) >= thresh || Math.abs(T) >= thresh || Math.abs(S) >= thresh) {
      eggCounts[thresh]++;
    }
  }
}

for (const thresh in eggCounts) {
  console.log(`Threshold ${thresh}: ${(eggCounts[thresh] / N_TRIALS * 100).toFixed(2)}% chance of getting at least one easter egg`);
}

import { questions } from './src/data/questions.ts';

function simulate() {
  const TRIALS = 1000000;
  const counts: Record<string, number> = {
    'N+B+T+': 0,
    'N+B+T-': 0,
    'N+B-T+': 0,
    'N+B-T-': 0,
    'N-B+T+': 0,
    'N-B+T-': 0,
    'N-B-T+': 0,
    'N-B-T-': 0,
  };

  for (let i = 0; i < TRIALS; i++) {
    let n = 0;
    let b = 0;
    let t = 0;

    for (const q of questions) {
      const randIdx = Math.floor(Math.random() * q.options.length);
      const opt = q.options[randIdx];
      if (opt.scores.N) n += opt.scores.N;
      if (opt.scores.B) b += opt.scores.B;
      if (opt.scores.T) t += opt.scores.T;
    }

    const finalN = n === 0 ? (b + t >= 0 ? -1 : 1) : n;
    const finalB = b === 0 ? (n + t >= 0 ? -1 : 1) : b;
    const finalT = t === 0 ? (n + b >= 0 ? -1 : 1) : t;

    const resId = `${finalN > 0 ? 'N+' : 'N-'}${finalB > 0 ? 'B+' : 'B-'}${finalT > 0 ? 'T+' : 'T-'}`;
    if (counts[resId] !== undefined) {
      counts[resId]++;
    }
  }

  console.log("Probabilities with balance compensation:");
  for (const [id, count] of Object.entries(counts)) {
    console.log(`${id}: ${((count / TRIALS) * 100).toFixed(2)}%`);
  }
}

simulate();

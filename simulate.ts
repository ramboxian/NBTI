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

    const resId = `${n >= 0 ? 'N+' : 'N-'}${b >= 0 ? 'B+' : 'B-'}${t >= 0 ? 'T+' : 'T-'}`;
    if (counts[resId] !== undefined) {
      counts[resId]++;
    }
  }

  console.log("Probabilities based on random guessing:");
  for (const [id, count] of Object.entries(counts)) {
    console.log(`${id}: ${((count / TRIALS) * 100).toFixed(2)}%`);
  }
}

simulate();

const fs = require('fs');
const path = require('path');

const content = fs.readFileSync(path.join(__dirname, 'src/data/results.ts'), 'utf-8');
const match = content.match(/export const resultsData: Record<string, PersonalityResult> = (\{[\s\S]*?\n\});/);
if (!match) process.exit(1);

let data;
try {
  data = eval('(' + match[1] + ')');
} catch(e) {
  process.exit(1);
}

const urlMap = {
  "N-B-T-S+": "https://i.ibb.co/W4WMZWCj/Nm-Bm-Tm-Sp.png",
  "N-B-T-S-": "https://i.ibb.co/Y7vFYZBN/Nm-Bm-Tm-Sm.png",
  "N-B-T+S-": "https://i.ibb.co/zCB1vsM/Nm-Bm-Tp-Sm.png",
  "N-B-T+S+": "https://i.ibb.co/hJLzv7kf/Nm-Bm-Tp-Sp.png",
  "N-B+T-S-": "https://i.ibb.co/pjXrffDQ/Nm-Bp-Tm-Sm.png",
  "N-B+T-S+": "https://i.ibb.co/q3y7K1c4/Nm-Bp-Tm-Sp.png",
  "N-B+T+S-": "https://i.ibb.co/MxLWF3h9/Nm-Bp-Tp-Sm.png",
  "N-B+T+S+": "https://i.ibb.co/JWqzdYBj/Nm-Bp-Tp-Sp.png",
  "N+B-T-S-": "https://i.ibb.co/TDQzWXRs/Np-Bm-Tm-Sm.png",
  "N+B-T-S+": "https://i.ibb.co/wNy639rc/Np-Bm-Tm-Sp.png",
  "N+B-T+S-": "https://i.ibb.co/C51QmGBV/Np-Bm-Tp-Sm.png",
  "N+B-T+S+": "https://i.ibb.co/ymVprjR1/Np-Bm-Tp-Sp.png",
  "N+B+T-S-": "https://i.ibb.co/PGbTVVTG/Np-Bp-Tm-Sm.png",
  "N+B+T-S+": "https://i.ibb.co/Pyd3Pnt/Np-Bp-Tm-Sp.png",
  "N+B+T+S-": "https://i.ibb.co/Jjbryr17/Np-Bp-Tp-Sm.png",
  "N+B+T+S+": "https://i.ibb.co/mFR0N85r/Np-Bp-Tp-Sp.png",
};

for (const id in urlMap) {
  if (data[id]) {
    data[id].paintingUrl = urlMap[id];
  }
}

const prefix = content.substring(0, match.index);
const suffix = content.substring(match.index + match[0].length);

const newContent = prefix + 'export const resultsData: Record<string, PersonalityResult> = ' + JSON.stringify(data, null, 2) + ';\n' + suffix;

fs.writeFileSync(path.join(__dirname, 'src/data/results.ts'), newContent, 'utf-8');
console.log('URLs updated.');

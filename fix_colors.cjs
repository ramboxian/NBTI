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

// 摸鱼皇帝: N-B-T-S+
if (data["N-B-T-S+"]) data["N-B-T-S+"].themeColor = "#363A3D"; // 高级深空灰

// 赏金猎人: N+B-T+S-
if (data["N+B-T+S-"]) data["N+B-T+S-"].themeColor = "#2C2E33"; // 高级黑灰

// 九命猫: N-B-T+S-
if (data["N-B-T+S-"]) data["N-B-T+S-"].themeColor = "#3D3D3D"; // 高级炭灰

const prefix = content.substring(0, match.index);
const suffix = content.substring(match.index + match[0].length);

const newContent = prefix + 'export const resultsData: Record<string, PersonalityResult> = ' + JSON.stringify(data, null, 2) + ';\n' + suffix;

fs.writeFileSync(path.join(__dirname, 'src/data/results.ts'), newContent, 'utf-8');
console.log('Colors updated.');

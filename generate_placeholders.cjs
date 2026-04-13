const fs = require('fs');

const placeholders = [
  { new: 'NpBpTpSp.png', old: 'saiboniuma.png' },
  { new: 'NpBpTpSm.png', old: 'saiboniuma.png' },
  { new: 'NpBpTmSp.png', old: 'juanxincai.png' },
  { new: 'NpBpTmSm.png', old: 'juanxincai.png' },
  { new: 'NpBmTpSp.png', old: 'zhichangpixiu.png' },
  { new: 'NpBmTpSm.png', old: 'zhichangpixiu.png' },
  { new: 'NpBmTmSp.png', old: 'morikuanghua.png' },
  { new: 'NpBmTmSm.png', old: 'morikuanghua.png' },
  { new: 'NmBpTpSp.png', old: 'renjianqingxing.png' },
  { new: 'NmBpTpSm.png', old: 'renjianqingxing.png' },
  { new: 'NmBpTmSp.png', old: 'tianxuangongjuren.png' },
  { new: 'NmBpTmSm.png', old: 'tianxuangongjuren.png' },
  { new: 'NmBmTpSp.png', old: 'buzhanguo.png' },
  { new: 'NmBmTpSm.png', old: 'buzhanguo.png' },
  { new: 'NmBmTmSp.png', old: 'moyuhuangdi.png' },
  { new: 'NmBmTmSm.png', old: 'moyuhuangdi.png' },
];

for (const p of placeholders) {
  if (fs.existsSync('public/images/8/' + p.old)) {
    fs.copyFileSync('public/images/8/' + p.old, 'public/images/16/' + p.new);
    console.log('Created ' + p.new + ' from ' + p.old);
  } else {
    console.log('Missing: ' + p.old);
  }
}

import { loadImage, fillTextWrap, measureTextHeight, roundRect, drawTicketCard, drawDashedLine } from './canvasHelpers';

export const getLighterColor = (hex: string, lightenFactor = 1.5) => {
  if (!hex) return '#ffffff';
  hex = hex.replace(/^#/, '');
  if (hex.length === 3) hex = hex.split('').map(c => c + c).join('');
  let r = parseInt(hex.substring(0, 2), 16);
  let g = parseInt(hex.substring(2, 4), 16);
  let b = parseInt(hex.substring(4, 6), 16);
  const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
  let targetLuminance = Math.max(0.6, luminance * lightenFactor);
  if (luminance < 0.2) targetLuminance = 0.7;
  r /= 255; g /= 255; b /= 255;
  const max = Math.max(r, g, b), min = Math.min(r, g, b);
  let h = 0, s = 0, l = (max + min) / 2;
  if (max !== min) {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case r: h = (g - b) / d + (g < b ? 6 : 0); break;
      case g: h = (b - r) / d + 2; break;
      case b: h = (r - g) / d + 4; break;
    }
    h /= 6;
  }
  l = targetLuminance;
  s = Math.max(s, 0.4);
  let r2, g2, b2;
  if (s === 0) {
    r2 = g2 = b2 = l;
  } else {
    const hue2rgb = (p: number, q: number, t: number) => {
      if (t < 0) t += 1; if (t > 1) t -= 1;
      if (t < 1/6) return p + (q - p) * 6 * t;
      if (t < 1/2) return q;
      if (t < 2/3) return p + (q - p) * (2/3 - t) * 6;
      return p;
    };
    const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
    const p = 2 * l - q;
    r2 = hue2rgb(p, q, h + 1/3);
    g2 = hue2rgb(p, q, h);
    b2 = hue2rgb(p, q, h - 1/3);
  }
  const toHex = (x: number) => {
    const hexStr = Math.round(x * 255).toString(16);
    return hexStr.length === 1 ? '0' + hexStr : hexStr;
  };
  return `#${toHex(r2)}${toHex(g2)}${toHex(b2)}`;
};

const FONT_SERIF = '${FONT_SERIF}';
const FONT_SANS = '"Montserrat", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, ${FONT_SANS}';

export const generatePosterCanvas = async (
  result: any,
  scores: Record<string, number>,
  EASTER_EGG_BANNER_URL: string
): Promise<string> => {
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');
  if (!ctx) throw new Error('Could not get 2d context');

  const W = 760;
  canvas.width = W;
  canvas.height = 15000; 
  
  const scale = 2;
  
  // Background
  ctx.fillStyle = '#1a1817';
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  const rg = ctx.createRadialGradient(W/2, W*0.4, 0, W/2, W*0.4, W*1.4);
  rg.addColorStop(0, `${result.themeColor}33`);
  rg.addColorStop(1, 'transparent');
  ctx.fillStyle = rg;
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  let y = 60 * scale; // 顶部初始位置留白改成30px (30 * 2 = 60 * scale)

  // ==========================================
  // Header: Title
  // ==========================================
  ctx.fillStyle = 'rgba(255,255,255,0.8)';
  ctx.font = `600 ${28 * scale}px ${FONT_SERIF}`;
  ctx.textAlign = 'center';
  ctx.fillText('NBTI', W / 2, y);

  ctx.textAlign = 'left';
  y += 40 * scale; // 标题与卡片间距设为20px (40 * scale)

  const paddingX = 20 * scale;
  const contentW = W - paddingX * 2;

  // Preload Images
  let mainImg: HTMLImageElement | null = null;
  let bannerImg: HTMLImageElement | null = null;
  try { mainImg = await loadImage(result.paintingUrl); } catch (e) { console.warn(e); }
  if (result.easterEggs && result.easterEggs.length > 0) {
    try { bannerImg = await loadImage(EASTER_EGG_BANNER_URL); } catch (e) { console.warn(e); }
  }

  // ==========================================
  // Ticket Card
  // ==========================================
  const ticketRadius = 16 * scale;
  const cutRadius = 10 * scale;
  const imgHeight = contentW * (3 / 4);
  
  ctx.font = `600 ${42 * scale}px ${FONT_SERIF}`;
  const nameH = 42 * scale;
  ctx.font = `italic ${16 * scale}px ${FONT_SANS}`;
  
  // 简介文字左右至少距离卡片 24px，所以 maxWidth = contentW - 48*2 = contentW - 96
  const sloganMaxWidth = contentW - 48 * scale;
  const sloganH = measureTextHeight(ctx, `"${result.slogan}"`, sloganMaxWidth, 24 * scale);
  
  // 名字向下偏移 12px (24px at 2x) -> 所以这里从 24 改为 36
  const ticketContentTopH = 36 * scale + nameH + 12 * scale + sloganH + 32 * scale + 10 * scale + 16 * scale;
  const cutY = imgHeight + ticketContentTopH; 
  
  // 底部票据增加至少 40px (80px at 2x) 的高度
  const ticketBottomH = 80 * scale; // 原来是68，现在增加12px (24 at 2x)，68+12=80
  const ticketHeight = cutY + ticketBottomH;

  ctx.save();
  ctx.fillStyle = result.themeColor;
  ctx.shadowColor = 'rgba(0,0,0,0.6)';
  ctx.shadowBlur = 60;
  ctx.shadowOffsetY = 30;
  drawTicketCard(ctx, paddingX, y, contentW, ticketHeight, cutY, ticketRadius, cutRadius);
  ctx.fill();
  ctx.restore();

  if (mainImg) {
    ctx.save();
    roundRect(ctx, paddingX, y, contentW, imgHeight, { tl: ticketRadius, tr: ticketRadius, bl: 0, br: 0 });
    ctx.clip();
    ctx.drawImage(mainImg, paddingX, y, contentW, imgHeight);
    
    // 过渡蒙层加高，从底部往上 80*scale 开始渐变，看起来更自然
    const lgHeight = 80 * scale;
    const lg = ctx.createLinearGradient(0, y + imgHeight - lgHeight, 0, y + imgHeight);
    lg.addColorStop(0, 'transparent');
    lg.addColorStop(0.7, `${result.themeColor}dd`);
    lg.addColorStop(1, result.themeColor);
    ctx.fillStyle = lg;
    ctx.fillRect(paddingX, y + imgHeight - lgHeight, contentW, lgHeight);
    ctx.restore();
  }

  let ty = y + imgHeight + 44 * scale; // 名字上移 16px (32px at 2x), 从 60 变成 60-16=44

  ctx.fillStyle = result.textColor;
  ctx.textAlign = 'center';
  ctx.font = `600 ${42 * scale}px ${FONT_SERIF}`;
  ctx.fillText(result.name, W / 2, ty);
  ty += 42 * scale + 12 * scale; // ty 是为了下一个元素的起点

  ctx.font = `italic 300 ${16 * scale}px ${FONT_SANS}`; // 将粗细调细，比如加上 300
  ctx.globalAlpha = 0.8;
  
  // slogan 居中
  ty = fillTextWrap(ctx, `"${result.slogan}"`, paddingX + 24 * scale, ty, sloganMaxWidth, 24 * scale, 'center');
  ctx.globalAlpha = 1.0;
  
  ty += 32 * scale;

  ctx.font = `400 ${10 * scale}px ${FONT_SANS}`;
  ctx.globalAlpha = 0.6;
  ctx.textAlign = 'left';
  ctx.fillText('FOR: RAMBOX', paddingX + 24 * scale, ty);
  ctx.textAlign = 'right';
  const d = new Date().toLocaleDateString('zh-CN', { year: 'numeric', month: '2-digit', day: '2-digit' }).replace(/\//g, '.');
  ctx.fillText(`DATE: ${d}`, paddingX + contentW - 24 * scale, ty);
  ctx.globalAlpha = 1.0;
  ctx.textAlign = 'left';

  ctx.strokeStyle = result.textColor;
  ctx.globalAlpha = 0.3;
  ctx.lineWidth = 1.5 * scale;
  drawDashedLine(ctx, paddingX + cutRadius, y + cutY, paddingX + contentW - cutRadius, [6, 6]);
  ctx.globalAlpha = 1.0;

  ty = y + cutY + 24 * scale;
  ctx.font = `400 ${9 * scale}px ${FONT_SANS}`;
  ctx.globalAlpha = 0.9;
  const nStr = `N${scores.N > 0 ? '+' : ''}${scores.N || 0}`;
  const bStr = `B${scores.B > 0 ? '+' : ''}${scores.B || 0}`;
  const tStr = `T${scores.T > 0 ? '+' : ''}${scores.T || 0}`;
  const sStr = `S${scores.S > 0 ? '+' : ''}${scores.S || 0}`;
  
  ctx.fillText(`${nStr} / ${bStr} / ${tStr} / ${sStr}`, paddingX + 24 * scale, ty);
  ctx.fillText('NBTI ASSESSMENT', paddingX + 24 * scale, ty + 16 * scale);
  ctx.fillText('VALID FOR ONE LIFE', paddingX + 24 * scale, ty + 32 * scale);

  ctx.fillStyle = result.textColor;
  ctx.globalAlpha = 0.8;
  const barcodeX = paddingX + contentW - 100 * scale;
  const barcodeY = ty - 8 * scale;
  const barcodeH = 24 * scale;
  const bars = [3,1,4,2,1,4,1,3,1,2,4,2,1,3,4,1,2,4,1,3,2,4,2];
  let curBx = barcodeX;
  bars.forEach((w, i) => {
    ctx.fillRect(curBx, barcodeY, w * scale * 0.8, barcodeH);
    curBx += (w * scale * 0.8) + (i % 2 === 0 ? 2 * scale : 1 * scale);
  });
  
  ctx.font = `bold ${7.5 * scale}px ${FONT_SANS}`;
  ctx.globalAlpha = 0.7;
  ctx.textAlign = 'right';
  ctx.fillText('SCAN TO TEST', paddingX + contentW - 24 * scale, barcodeY + barcodeH + 12 * scale);
  ctx.textAlign = 'left';
  ctx.globalAlpha = 1.0;

  y += ticketHeight;

  // ==========================================
  // Section: Diagnosis
  // ==========================================
  const drawSectionTitle = (titleEn: string, titleCn: string, cy: number) => {
    ctx.fillStyle = '#f4f0ea';
    ctx.font = `300 ${32 * scale}px ${FONT_SERIF}`; // 从400改300
    ctx.fillText(titleEn, paddingX, cy);
    
    const enW = ctx.measureText(titleEn).width;
    ctx.font = `300 ${12 * scale}px ${FONT_SANS}`;
    ctx.globalAlpha = 0.6;
    ctx.fillText(titleCn, paddingX + enW + 16 * scale, cy - 4 * scale);
    ctx.globalAlpha = 1.0;

    cy += 16 * scale;
    ctx.strokeStyle = 'rgba(244, 240, 234, 0.2)';
    ctx.lineWidth = 0.5 * scale;
    ctx.beginPath();
    ctx.moveTo(paddingX, cy);
    ctx.lineTo(paddingX + contentW, cy);
    ctx.stroke();

    return cy + 24 * scale;
  };

  const drawParagraph = (titleEn: string, titleCn: string, text: string, cy: number) => {
    ctx.fillStyle = '#f4f0ea';
    ctx.globalAlpha = 0.5;
    ctx.font = `300 ${11 * scale}px ${FONT_SANS}`; // 减轻粗细
    ctx.fillText(titleEn, paddingX, cy);
    
    const enW = ctx.measureText(titleEn).width;
    ctx.globalAlpha = 0.8;
    ctx.font = `300 ${9 * scale}px ${FONT_SANS}`; // 减轻粗细
    ctx.fillText(titleCn, paddingX + enW + 8 * scale, cy - 1 * scale);
    
    cy += 32 * scale;
    ctx.globalAlpha = 0.8;
    ctx.font = `100 ${15 * scale}px ${FONT_SERIF}`; // 正文改成100最细, 字号改成15px
    // 2.0倍行高对应15px是 30 * scale
    cy = fillTextWrap(ctx, text, paddingX, cy, contentW, 30 * scale);
    ctx.globalAlpha = 1.0;

    return cy + 32 * scale;
  };

  y += 72 * scale; // 原来是96, 减少12px (24 at 2x) = 72
  y = drawSectionTitle('Diagnosis', '核心诊断', y);

  // Easter Eggs
  if (result.easterEggs && result.easterEggs.length > 0) {
    y -= 8 * scale; // 与上方标题间距减少20px (原来 y+=32, 这里 y+=32-40 = -8)
    
    // 预计算画框的尺寸和高度
    const plaqueW = contentW * 0.96;
    const plaqueX = paddingX + (contentW - plaqueW) / 2;
    const innerPaddingX = 20 * scale; 
    const textMaxWidth = plaqueW - innerPaddingX * 2;
    
    let py = 64 * scale; 
    py += 32 * scale; 
    
    ctx.font = `300 ${14 * scale}px ${FONT_SERIF}`; // 减轻粗细
    const congratsText = "恭喜你！在原有的人格诊断中，\n我们为你检测出了隐藏的专属彩蛋。\n这简直是万里挑一的独特存在。";
    py += measureTextHeight(ctx, congratsText, textMaxWidth, 14 * scale * 1.8);
    py += 24 * scale; 
    py += 1 * scale; 
    py += 32 * scale; 
    
    result.easterEggs.forEach((egg: any, idx: number) => {
      py += 18 * scale; 
      py += 8 * scale;  
      ctx.font = `300 ${14 * scale}px ${FONT_SERIF}`; // 减轻粗细
      py += measureTextHeight(ctx, egg.desc, textMaxWidth, 14 * scale * 1.8);
      if (idx < result.easterEggs.length - 1) {
        py += 20 * scale; 
        py += 1 * scale; 
        py += 20 * scale; 
      }
    });
    py += 40 * scale; 
    
    const plaqueH = py;

    // 先画半透明画框 (在底层)
    let currentY = y;
    if (bannerImg) {
      // 如果有图片，画框往下挪一点，给图片腾空间
      const bw = contentW * 1.1;
      const bh = (bannerImg.height / bannerImg.width) * bw;
      currentY += bh - 40 * scale;
    }

    const pg = ctx.createLinearGradient(0, currentY, 0, currentY + plaqueH);
    pg.addColorStop(0, '#2c2620');
    pg.addColorStop(1, '#1e1c1a');
    ctx.fillStyle = pg;
    ctx.shadowColor = 'rgba(0,0,0,0.6)';
    ctx.shadowBlur = 40;
    ctx.shadowOffsetY = 20;
    roundRect(ctx, plaqueX, currentY, plaqueW, plaqueH, 12 * scale);
    ctx.fill();
    ctx.shadowColor = 'transparent';

    ctx.strokeStyle = 'rgba(216, 195, 158, 0.2)';
    ctx.lineWidth = 1 * scale;
    ctx.stroke();

    ctx.strokeStyle = 'rgba(216, 195, 158, 0.1)';
    roundRect(ctx, plaqueX + 6 * scale, currentY + 6 * scale, plaqueW - 12 * scale, plaqueH - 12 * scale, 8 * scale);
    ctx.stroke();

    // 再画图片 (盖在画框上面)
    if (bannerImg) {
      const bw = contentW * 1.1;
      const bx = paddingX - contentW * 0.05;
      const bh = (bannerImg.height / bannerImg.width) * bw;
      
      ctx.save();
      ctx.shadowColor = 'rgba(0,0,0,0.8)';
      ctx.shadowBlur = 30;
      ctx.shadowOffsetY = 20;
      ctx.drawImage(bannerImg, bx, y, bw, bh);
      ctx.restore();
    }

    // 画文字
    let innerY = currentY + 64 * scale + 32 * scale; 
    ctx.fillStyle = '#e6dfd1';
    ctx.globalAlpha = 0.9;
    ctx.font = `300 ${14 * scale}px ${FONT_SERIF}`; // 减轻粗细
    ctx.textAlign = 'center';
    
    innerY = fillTextWrap(ctx, congratsText, plaqueX + innerPaddingX, innerY, textMaxWidth, 14 * scale * 1.8, 'center');
    
    innerY += 24 * scale;
    const lgLine = ctx.createLinearGradient(W/2 - 40 * scale, innerY, W/2 + 40 * scale, innerY);
    lgLine.addColorStop(0, 'transparent');
    lgLine.addColorStop(0.5, 'rgba(216, 195, 158, 0.5)');
    lgLine.addColorStop(1, 'transparent');
    ctx.fillStyle = lgLine;
    ctx.fillRect(W/2 - 40 * scale, innerY, 80 * scale, 1 * scale);
    innerY += 1 * scale;
    
    innerY += 32 * scale;

    result.easterEggs.forEach((egg: any, idx: number) => {
      ctx.fillStyle = '#d8c39e';
      ctx.font = `500 ${18 * scale}px ${FONT_SERIF}`; // 从 bold(700) 减轻为 500
      ctx.textAlign = 'center'; // 确保标题居中
      ctx.fillText(egg.title, W/2, innerY);
      innerY += 18 * scale;
      innerY += 8 * scale; 

      ctx.fillStyle = '#f4f0ea';
      ctx.globalAlpha = 0.8;
      ctx.font = `300 ${14 * scale}px ${FONT_SERIF}`; // 减轻粗细
      innerY = fillTextWrap(ctx, egg.desc, plaqueX + innerPaddingX, innerY, textMaxWidth, 14 * scale * 1.8, 'center');
      ctx.globalAlpha = 1.0;

      if (idx < result.easterEggs.length - 1) {
        innerY += 20 * scale; 
        const lgLine2 = ctx.createLinearGradient(W/2 - 24 * scale, innerY, W/2 + 24 * scale, innerY);
        lgLine2.addColorStop(0, 'transparent');
        lgLine2.addColorStop(0.5, 'rgba(216, 195, 158, 0.3)');
        lgLine2.addColorStop(1, 'transparent');
        ctx.fillStyle = lgLine2;
        ctx.fillRect(W/2 - 24 * scale, innerY, 48 * scale, 1 * scale);
        innerY += 1 * scale;
        innerY += 20 * scale; 
      }
    });
    ctx.textAlign = 'left';

    y = currentY + plaqueH + 56 * scale; // 原来96，减少20px(40 at 2x) = 56
  }

  y = drawParagraph('Core Profile', '核心画像', result.description, y);
  y = drawParagraph('Daily Routine', '职场日常', result.routine, y);
  y = drawParagraph('Fatal Weakness', '致命弱点', result.weakness, y);

  // Traits
  ctx.font = `300 ${9 * scale}px ${FONT_SANS}`; // 减轻粗细
  ctx.textBaseline = 'middle';
  let tagX = paddingX;
  let tagY = y - 8 * scale;
  result.traits.forEach((trait: string) => {
    const tw = ctx.measureText(trait).width + 32 * scale;
    if (tagX + tw > paddingX + contentW) {
      tagX = paddingX;
      tagY += 40 * scale; // 上下间距+4px (原来36，变成40)
    }
    ctx.strokeStyle = 'rgba(244, 240, 234, 0.3)';
    ctx.lineWidth = 1 * scale;
    roundRect(ctx, tagX, tagY - 14 * scale, tw, 28 * scale, 14 * scale); // 恢复为高度的一半，实现胶囊型纯圆角
    ctx.stroke();
    
    ctx.fillStyle = 'rgba(244, 240, 234, 0.7)';
    ctx.fillText(trait, tagX + 16 * scale, tagY);
    tagX += tw + 8 * scale;
  });
  ctx.textBaseline = 'alphabetic';

  y = tagY + 72 * scale; // 减少12px (24 at 2x) = 72

  // ==========================================
  // Section: Survival Stats
  // ==========================================
  const chartColor = getLighterColor(result.themeColor || '#ffffff');
  
  y = drawSectionTitle('Survival Stats', '职场生存属性', y);

  ctx.fillStyle = 'rgba(255, 255, 255, 0.05)';
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.05)';
  ctx.lineWidth = 1 * scale;
  roundRect(ctx, paddingX, y, contentW, 164 * scale, 12 * scale);
  ctx.fill();
  ctx.stroke();

  let sy = y + 20 * scale;
  const stats = [
    { label: '卷王指数', value: result.stats?.workaholic || 0, opacity: 1 },
    { label: '黑锅抗性', value: result.stats?.resilience || 0, opacity: 0.8 },
    { label: '套路深浅', value: result.stats?.strategy || 0, opacity: 0.6 },
    { label: '社交指数', value: result.stats?.social || 0, opacity: 0.5 },
    { label: '生存寿命', value: result.stats?.survival || 0, opacity: 0.4 },
  ];

  stats.forEach(stat => {
    ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
    ctx.font = `300 ${12 * scale}px ${FONT_SANS}`; // 减轻粗细
    ctx.fillText(stat.label, paddingX + 20 * scale, sy + 10 * scale);
    
    const barX = paddingX + 20 * scale + 64 * scale + 12 * scale;
    const barW = contentW - 64 * scale - 32 * scale - 60 * scale;
    ctx.fillStyle = 'rgba(255, 255, 255, 0.1)';
    roundRect(ctx, barX, sy + 4 * scale, barW, 6 * scale, 3 * scale);
    ctx.fill();

    ctx.fillStyle = chartColor;
    ctx.globalAlpha = stat.opacity;
    roundRect(ctx, barX, sy + 4 * scale, barW * (stat.value / 100), 6 * scale, 3 * scale);
    ctx.fill();
    ctx.globalAlpha = 1.0;

    ctx.fillStyle = 'rgba(255, 255, 255, 0.9)';
    ctx.font = `300 ${12 * scale}px monospace`; // 减轻粗细
    ctx.textAlign = 'right';
    ctx.fillText(stat.value.toString(), barX + barW + 12 * scale + 32 * scale, sy + 10 * scale);
    ctx.textAlign = 'left';

    sy += 28 * scale;
  });

  y += 164 * scale + 72 * scale; // 减少12px (24 at 2x) = 72

  // ==========================================
  // Section: Radar (Match)
  // ==========================================
  y = drawSectionTitle('Radar', '职场人际雷达', y);

  const halfW = (contentW - 16 * scale) / 2;
  
  const drawMatchCard = (title: string, emoji: string, name: string, reason: string, mx: number, my: number) => {
    ctx.font = `300 ${13 * scale}px ${FONT_SANS}`;
    const reasonH = measureTextHeight(ctx, reason, halfW - 32 * scale, 13 * scale * 1.8); // 行高从 1.4 倍放大到 1.8 倍
    const cardH = 80 * scale + reasonH + 24 * scale;

    ctx.fillStyle = 'rgba(255, 255, 255, 0.05)';
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.05)';
    ctx.lineWidth = 1 * scale;
    roundRect(ctx, mx, my, halfW, cardH, 12 * scale);
    ctx.fill();
    ctx.stroke();

    ctx.fillStyle = '#ffffff';
    ctx.font = `500 ${12 * scale}px ${FONT_SANS}`;
    ctx.fillText(`${emoji} ${title}`, mx + 16 * scale, my + 24 * scale);

    ctx.font = `400 ${20 * scale}px ${FONT_SERIF}`; // 从 400 改 300 会太细, 保留400或300均可，名字使用400比较好
    ctx.fillText(name, mx + 16 * scale, my + 56 * scale);

    ctx.fillStyle = 'rgba(255, 255, 255, 0.7)';
    ctx.font = `300 ${13 * scale}px ${FONT_SANS}`;
    // 标题和说明直接的间距调整成8px, 说明从 80*scale 变为 56 + 20(字体高) + 8 = 84*scale
    fillTextWrap(ctx, reason, mx + 16 * scale, my + 84 * scale, halfW - 32 * scale, 13 * scale * 1.8); // 行高从 1.4 倍放大到 1.8 倍

    return cardH;
  };

  const h1 = drawMatchCard('职场天作之合', '🤝', result.bestMatch?.name || '', result.bestMatch?.reason || '', paddingX, y);
  const h2 = drawMatchCard('职场命中克星', '☠️', result.worstMatch?.name || '', result.worstMatch?.reason || '', paddingX + halfW + 16 * scale, y);

  y += Math.max(h1, h2) + 72 * scale; // 减少12px (24 at 2x) = 72

  // ==========================================
  // Section: Energy Distribution
  // ==========================================
  // 这里修正一下，覆盖之前画的 title，重新绘制
  ctx.clearRect(paddingX, y - 80 * scale, contentW, 80 * scale);
  
  // 补回可能被清掉的渐变背景
  ctx.fillStyle = '#1a1817';
  ctx.fillRect(paddingX, y - 80 * scale, contentW, 80 * scale);
  const rgE = ctx.createRadialGradient(W/2, W*0.4, 0, W/2, W*0.4, W*1.4);
  rgE.addColorStop(0, `${result.themeColor}33`);
  rgE.addColorStop(1, 'transparent');
  ctx.fillStyle = rgE;
  ctx.fillRect(paddingX, y - 80 * scale, contentW, 80 * scale);

  ctx.fillStyle = '#f4f0ea';
  ctx.font = `300 ${32 * scale}px ${FONT_SERIF}`; // 使用300减轻粗细
  ctx.fillText('Energy', paddingX, y);
  ctx.fillText('Distribution', paddingX, y + 36 * scale);
  
  ctx.font = `300 ${12 * scale}px ${FONT_SANS}`;
  ctx.globalAlpha = 0.6;
  const distW = ctx.measureText('Distribution').width;
  ctx.fillText('能量分配模型', paddingX + distW + 16 * scale + 120 * scale, y + 36 * scale); // 向右移动120px (这里使用画布坐标系，直接+120*scale, 即实际240像素偏移)
  ctx.globalAlpha = 1.0;

  y += 36 * scale; // 标题高度
  y += 16 * scale; // 间距

  // 重新画下面的横线
  ctx.strokeStyle = 'rgba(244, 240, 234, 0.2)';
  ctx.lineWidth = 0.5 * scale;
  ctx.beginPath();
  ctx.moveTo(paddingX, y);
  ctx.lineTo(paddingX + contentW, y);
  ctx.stroke();
  
  y += 24 * scale;

  const energyCardH = 200 * scale;
  ctx.fillStyle = 'rgba(255, 255, 255, 0.05)';
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.05)';
  roundRect(ctx, paddingX, y, contentW, energyCardH, 12 * scale);
  ctx.fill();
  ctx.stroke();

  const rawProd = result.stats?.workaholic || 50;
  const rawFric = 100 - (result.stats?.social || 50);
  const rawSlack = 100 - rawProd;
  const total = rawProd + rawFric + rawSlack;
  const prodPct = Math.round((rawProd / total) * 100);
  const fricPct = Math.round((rawFric / total) * 100);
  const slackPct = 100 - prodPct - fricPct;
  
  const eItems = [
    { label: '🧠 精神内耗', value: fricPct, opacity: 0.6 },
    { label: '💼 实际产出', value: prodPct, opacity: 1 },
    { label: '🎣 摸鱼时间', value: slackPct, opacity: 0.3 }
  ];

  let ey = y + 32 * scale;
  eItems.forEach(item => {
    ctx.fillStyle = chartColor;
    ctx.globalAlpha = item.opacity;
    ctx.beginPath();
    ctx.arc(paddingX + 24 * scale, ey + 4 * scale, 4 * scale, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = 'rgba(255,255,255,0.8)';
    ctx.globalAlpha = 1.0;
    ctx.font = `300 ${12 * scale}px ${FONT_SANS}`; // 减轻粗细
    ctx.fillText(item.label, paddingX + 36 * scale, ey + 8 * scale);

    ctx.fillStyle = 'rgba(244, 240, 234, 0.9)';
    ctx.font = `300 ${16 * scale}px monospace`; // 减轻粗细
    ctx.fillText(`${item.value}%`, paddingX + 36 * scale, ey + 32 * scale);

    ey += 56 * scale;
  });

  const donutX = paddingX + contentW - 90 * scale;
  const donutY = y + 100 * scale;
  const donutR = 50 * scale;
  const lineW = 14 * scale;

  ctx.lineWidth = lineW;
  ctx.beginPath();
  ctx.arc(donutX, donutY, donutR, 0, Math.PI * 2);
  ctx.strokeStyle = 'rgba(255,255,255,0.05)';
  ctx.stroke();

  let startAngle = -Math.PI / 2;
  const drawArc = (pct: number, opacity: number) => {
    const endAngle = startAngle + (pct / 100) * Math.PI * 2;
    ctx.beginPath();
    ctx.arc(donutX, donutY, donutR, startAngle, endAngle);
    ctx.strokeStyle = chartColor;
    ctx.globalAlpha = opacity;
    ctx.stroke();
    startAngle = endAngle;
  };

  drawArc(fricPct, 0.6);
  drawArc(prodPct, 1.0);
  drawArc(slackPct, 0.3);
  ctx.globalAlpha = 1.0;

  ctx.textAlign = 'center';
  ctx.fillStyle = 'rgba(255,255,255,0.5)';
  ctx.font = `300 ${10 * scale}px ${FONT_SANS}`; // 减轻粗细
  ctx.fillText('ENERGY', donutX, donutY - 4 * scale);
  ctx.fillStyle = 'rgba(244,240,234,0.9)';
  ctx.font = `300 ${14 * scale}px ${FONT_SERIF}`; // 减轻粗细
  ctx.fillText('100%', donutX, donutY + 12 * scale);
  ctx.textAlign = 'left';

  y += energyCardH + 72 * scale; // 减少12px (24 at 2x) = 72

  // ==========================================
  // Section: Colleague's View
  // ==========================================
  y = drawSectionTitle("Colleague's View", '同事眼中的你', y);

  (result.colleagueView || []).forEach((view: string) => {
    ctx.font = `300 ${15 * scale}px ${FONT_SERIF}`; // 减轻粗细
    const linesH = measureTextHeight(ctx, view, contentW - 40 * scale, 15 * scale * 1.8);
    const cardH = linesH + 40 * scale;

    ctx.fillStyle = 'rgba(255, 255, 255, 0.05)';
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.05)';
    roundRect(ctx, paddingX, y, contentW, cardH, 12 * scale);
    ctx.fill();
    ctx.stroke();

    ctx.fillStyle = 'rgba(244, 240, 234, 0.8)';
    ctx.font = `300 ${15 * scale}px ${FONT_SERIF}`; // 减轻粗细
    
    // 文本在卡片内部上下左右居中
    const textY = y + (cardH - linesH) / 2 + 15 * scale * 0.8; // 垂直居中，15*scale*0.8是为了修正baseline偏移
    ctx.textAlign = 'center';
    fillTextWrap(ctx, view, paddingX + 20 * scale, textY, contentW - 40 * scale, 15 * scale * 1.8, 'center');
    ctx.textAlign = 'left';

    y += cardH + 16 * scale;
  });

  y += 72 * scale; // 减少12px (24 at 2x) = 72

  // ==========================================
  // Section: Strategy & Risks
  // ==========================================
  y = drawSectionTitle("Strategy & Risks", '生存指南', y);

  (result.strategy || []).forEach((strat: string) => {
    ctx.fillStyle = '#d8c39e';
    ctx.font = `300 ${15 * scale}px ${FONT_SERIF}`; // 减轻粗细
    ctx.fillText('•', paddingX, y + 15 * scale);
    
    ctx.fillStyle = 'rgba(244, 240, 234, 0.8)';
    const eh = fillTextWrap(ctx, strat, paddingX + 16 * scale, y + 15 * scale, contentW - 16 * scale, 15 * scale * 1.8);
    y = eh + 24 * scale;
  });

  y += 72 * scale; // 减少12px (24 at 2x) = 72

  // ==========================================
  // Final Radar Chart
  // ==========================================
  ctx.fillStyle = '#f4f0ea';
  ctx.font = `400 ${14 * scale}px ${FONT_SANS}`;
  ctx.globalAlpha = 0.6;
  ctx.textAlign = 'center';
  ctx.fillText('DIMENSION RADAR', W / 2, y);
  ctx.font = `300 ${10 * scale}px ${FONT_SANS}`; // 减轻粗细
  ctx.globalAlpha = 0.8;
  ctx.fillText('维度雷达', W / 2, y + 16 * scale);

  y += 48 * scale;
  ctx.font = `300 ${11 * scale}px ${FONT_SANS}`; // 减轻粗细
  ctx.globalAlpha = 0.6;
  
  // N B T S 文字居中计算
  const radarTextsW = 280 * scale; 
  const radarTextsX = paddingX + (contentW - radarTextsW) / 2;
  
  ctx.textAlign = 'left';
  ctx.fillText('N : 牛马 (卷/躺)', radarTextsX, y);
  ctx.fillText('B : 背锅 (扛/闪)', radarTextsX + 160 * scale, y);
  ctx.fillText('T : 套路 (深/浅)', radarTextsX, y + 24 * scale);
  ctx.fillText('S : 社交 (戏/NPC)', radarTextsX + 160 * scale, y + 24 * scale);

  y += 64 * scale;

  const rcx = W / 2;
  const rcy = y + 112 * scale; // 稍微往上移一点，让画面更紧凑
  const rr = 100 * scale; // 将半径从 144*scale 缩小到 100*scale

  const normN = Math.max(0, Math.min(1, ((scores.N || 0) + 21) / 43));
  const normS = Math.max(0, Math.min(1, ((scores.S || 0) + 22) / 45));
  const normB = Math.max(0, Math.min(1, ((scores.B || 0) + 20) / 42));
  const normT = Math.max(0, Math.min(1, ((scores.T || 0) + 24) / 47));

  const getRPoint = (normValue: number, angleDeg: number) => {
    const rad = (angleDeg - 90) * (Math.PI / 180);
    return {
      x: rcx + (rr * normValue) * Math.cos(rad),
      y: rcy + (rr * normValue) * Math.sin(rad)
    };
  };

  const drawRPolygon = (pts: any[], strokeStyle: string, fillStyle: string, lineWidth: number) => {
    ctx.beginPath();
    ctx.moveTo(pts[0].x, pts[0].y);
    for (let i = 1; i < pts.length; i++) ctx.lineTo(pts[i].x, pts[i].y);
    ctx.closePath();
    if (fillStyle) {
      ctx.fillStyle = fillStyle;
      ctx.fill();
    }
    if (strokeStyle) {
      ctx.strokeStyle = strokeStyle;
      ctx.lineWidth = lineWidth;
      ctx.stroke();
    }
  };

  const rg1 = [getRPoint(1, 0), getRPoint(1, 90), getRPoint(1, 180), getRPoint(1, 270)];
  const rg2 = [getRPoint(0.66, 0), getRPoint(0.66, 90), getRPoint(0.66, 180), getRPoint(0.66, 270)];
  const rg3 = [getRPoint(0.33, 0), getRPoint(0.33, 90), getRPoint(0.33, 180), getRPoint(0.33, 270)];

  drawRPolygon(rg1, 'rgba(255,255,255,0.2)', '', 1 * scale);
  drawRPolygon(rg2, 'rgba(255,255,255,0.2)', '', 1 * scale);
  drawRPolygon(rg3, 'rgba(255,255,255,0.2)', '', 1 * scale);

  ctx.beginPath();
  ctx.moveTo(rg1[3].x, rcy); ctx.lineTo(rg1[1].x, rcy);
  ctx.moveTo(rcx, rg1[0].y); ctx.lineTo(rcx, rg1[2].y);
  ctx.strokeStyle = 'rgba(255,255,255,0.2)';
  ctx.lineWidth = 1 * scale;
  ctx.stroke();

  ctx.fillStyle = 'rgba(255,255,255,0.7)';
  ctx.font = `400 ${10 * scale}px ${FONT_SANS}`;
  ctx.textAlign = 'center';
  ctx.fillText('N', rg1[0].x, rg1[0].y - 8 * scale);
  ctx.fillText('B', rg1[2].x, rg1[2].y + 16 * scale);
  ctx.textAlign = 'left';
  ctx.fillText('S', rg1[1].x + 8 * scale, rg1[1].y + 4 * scale);
  ctx.textAlign = 'right';
  ctx.fillText('T', rg1[3].x - 8 * scale, rg1[3].y + 4 * scale);

  const rDataPts = [
    getRPoint(normN, 0), getRPoint(normS, 90), getRPoint(normB, 180), getRPoint(normT, 270)
  ];
  
  ctx.globalAlpha = 0.3;
  drawRPolygon(rDataPts, '', chartColor, 0);
  ctx.globalAlpha = 1.0;
  drawRPolygon(rDataPts, chartColor, '', 1.5 * scale);

  rDataPts.forEach(pt => {
    ctx.beginPath();
    ctx.arc(pt.x, pt.y, 3 * scale, 0, Math.PI * 2);
    ctx.fillStyle = chartColor;
    ctx.fill();
  });

  y = rcy + rr + 64 * scale;
  ctx.textAlign = 'left';

  // ==========================================
  // Footer: Scan QR -> Text Only + Signature
  // ==========================================
  ctx.fillStyle = 'rgba(255,255,255,0.8)';
  ctx.font = `600 ${28 * scale}px ${FONT_SERIF}`;
  ctx.textAlign = 'center';
  ctx.fillText('NBTI', W / 2, y);
  
  y += 32 * scale;
  ctx.fillStyle = 'rgba(255,255,255,0.4)';
  ctx.font = `300 ${14 * scale}px ${FONT_SANS}`;
  ctx.fillText('职场牛马人格诊断', W / 2, y);

  y += 64 * scale;

  // 画 SVG 署名
  const signatureUrl = '/md.svg';
  try {
    const sigImg = await loadImage(signatureUrl);
    const sigW = 142 * scale;
    const sigH = (sigImg.height / sigImg.width) * sigW;
    ctx.save();
    ctx.globalAlpha = 0.3; // 保持网页上 opacity-[0.3] 的效果
    ctx.drawImage(sigImg, W / 2 - sigW / 2, y, sigW, sigH);
    ctx.restore();
    y += sigH + 64 * scale; // 图片下方留白
  } catch (err) {
    console.warn('Failed to load signature svg', err);
    y += 32 * scale; // 失败时给点兜底空白
  }

  const finalCanvas = document.createElement('canvas');
  finalCanvas.width = W;
  finalCanvas.height = y;
  const finalCtx = finalCanvas.getContext('2d');
  if (finalCtx) {
    finalCtx.drawImage(canvas, 0, 0, W, y, 0, 0, W, y);
    return finalCanvas.toDataURL('image/png');
  }

  return canvas.toDataURL('image/png');
};
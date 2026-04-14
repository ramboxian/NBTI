export const loadImage = (url: string): Promise<HTMLImageElement> => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => resolve(img);
    img.onerror = () => {
      console.error('Failed to load image for canvas:', url);
      reject(new Error(`Failed to load image: ${url}`));
    };
    img.src = url + (url.includes('?') ? '&' : '?') + 't=' + new Date().getTime();
  });
};

export const measureTextHeight = (
  ctx: CanvasRenderingContext2D,
  text: string,
  maxWidth: number,
  lineHeight: number
): number => {
  if (!text) return 0;
  let lines = 0;
  const paragraphs = text.split('\n');

  for (let p = 0; p < paragraphs.length; p++) {
    const paragraph = paragraphs[p];
    let line = '';
    for (let n = 0; n < paragraph.length; n++) {
      const testLine = line + paragraph[n];
      const testWidth = ctx.measureText(testLine).width;
      
      if (testWidth > maxWidth && n > 0) {
        lines++;
        line = paragraph[n];
      } else {
        line = testLine;
      }
    }
    lines++;
  }
  return lines * lineHeight;
};

export const fillTextWrap = (
  ctx: CanvasRenderingContext2D,
  text: string,
  x: number,
  y: number,
  maxWidth: number,
  lineHeight: number,
  align: 'left' | 'center' | 'right' = 'left'
): number => {
  if (!text) return y;
  let currentY = y;
  const paragraphs = text.split('\n');

  for (let p = 0; p < paragraphs.length; p++) {
    const paragraph = paragraphs[p];
    let line = '';
    
    for (let n = 0; n < paragraph.length; n++) {
      const testLine = line + paragraph[n];
      const testWidth = ctx.measureText(testLine).width;
      
      if (testWidth > maxWidth && n > 0) {
        drawAligned(ctx, line, x, currentY, maxWidth, align);
        line = paragraph[n];
        currentY += lineHeight;
      } else {
        line = testLine;
      }
    }
    drawAligned(ctx, line, x, currentY, maxWidth, align);
    currentY += lineHeight;
  }
  return currentY;
};

const drawAligned = (ctx: CanvasRenderingContext2D, text: string, x: number, y: number, maxWidth: number, align: 'left'|'center'|'right') => {
  let drawX = x;
  if (align === 'center') {
    drawX = x + maxWidth / 2;
    ctx.textAlign = 'center';
  } else if (align === 'right') {
    drawX = x + maxWidth;
    ctx.textAlign = 'right';
  } else {
    ctx.textAlign = 'left';
  }
  ctx.fillText(text, drawX, y);
  ctx.textAlign = 'left'; // reset
};

export const roundRect = (
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  width: number,
  height: number,
  radius: number | { tl: number; tr: number; br: number; bl: number }
) => {
  let r = { tl: 0, tr: 0, br: 0, bl: 0 };
  if (typeof radius === 'number') {
    r = { tl: radius, tr: radius, br: radius, bl: radius };
  } else {
    r = { ...r, ...radius };
  }
  ctx.beginPath();
  ctx.moveTo(x + r.tl, y);
  ctx.lineTo(x + width - r.tr, y);
  ctx.quadraticCurveTo(x + width, y, x + width, y + r.tr);
  ctx.lineTo(x + width, y + height - r.br);
  ctx.quadraticCurveTo(x + width, y + height, x + width - r.br, y + height);
  ctx.lineTo(x + r.bl, y + height);
  ctx.quadraticCurveTo(x, y + height, x, y + height - r.bl);
  ctx.lineTo(x, y + r.tl);
  ctx.quadraticCurveTo(x, y, x + r.tl, y);
  ctx.closePath();
};

export const drawTicketCard = (
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  width: number,
  height: number,
  cutY: number,
  radius: number,
  cutRadius: number
) => {
  ctx.beginPath();
  ctx.moveTo(x + radius, y);
  ctx.lineTo(x + width - radius, y);
  ctx.quadraticCurveTo(x + width, y, x + width, y + radius);
  
  ctx.lineTo(x + width, y + cutY - cutRadius);
  ctx.arc(x + width, y + cutY, cutRadius, Math.PI * 1.5, Math.PI * 0.5, true);
  
  ctx.lineTo(x + width, y + height - radius);
  ctx.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
  ctx.lineTo(x + radius, y + height);
  ctx.quadraticCurveTo(x, y + height, x, y + height - radius);
  
  ctx.lineTo(x, y + cutY + cutRadius);
  ctx.arc(x, y + cutY, cutRadius, Math.PI * 0.5, Math.PI * 1.5, true);
  
  ctx.lineTo(x, y + radius);
  ctx.quadraticCurveTo(x, y, x + radius, y);
  ctx.closePath();
};

export const drawDashedLine = (
  ctx: CanvasRenderingContext2D,
  x1: number,
  y: number,
  x2: number,
  dashArray: number[]
) => {
  ctx.beginPath();
  ctx.setLineDash(dashArray);
  ctx.moveTo(x1, y);
  ctx.lineTo(x2, y);
  ctx.stroke();
  ctx.setLineDash([]);
};

/* responsibility */

// Creates and paints the canvas textures
// used as in-world signs in Runned Over.


import { CanvasTexture, SRGBColorSpace } from 'three';


export function createSign(width, height) {

  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;


  const ctx = canvas.getContext('2d');
  const texture = new CanvasTexture(canvas);
  texture.colorSpace = SRGBColorSpace;
  texture.needsUpdate = true;


  return {
    canvas,
    ctx,
    texture,
  };

}

export function fillParagraph(ctx, text, x, y, maxWidth, lineHeight) {

  const words = text.split(' ');
  let line = '';
  let cursorY = y;


  for (const word of words) {

    const next = line ? `${line} ${word}` : word;

    if (ctx.measureText(next).width > maxWidth && line) {
      ctx.fillText(line, x, cursorY);
      line = word;
      cursorY += lineHeight;
    }
    else {
      line = next;
    }

  }


  if (line) {
    ctx.fillText(line, x, cursorY);
  }

}

export function paintPanel(sign, background, draw) {

  if (!sign) {
    return;
  }


  const { ctx, canvas, texture } = sign;


  ctx.fillStyle = background;
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  ctx.strokeStyle = '#e07a2f';
  ctx.lineWidth = Math.max(10, canvas.height * 0.045);
  ctx.strokeRect(14, 14, canvas.width - 28, canvas.height - 28);
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  draw(ctx, canvas);
  texture.needsUpdate = true;

}

export function paintButton(sign, label, hot) {

  if (!sign) {
    return;
  }


  const { ctx, canvas, texture } = sign;


  ctx.fillStyle = hot ? '#3d8a3a' : '#1f4d1d';
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  ctx.strokeStyle = '#ffe08a';
  ctx.lineWidth = 18;
  ctx.strokeRect(12, 12, canvas.width - 24, canvas.height - 24);
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillStyle = '#fff6d0';
  ctx.font = '900 84px ui-sans-serif, system-ui';
  ctx.fillText(label, canvas.width / 2, canvas.height / 2 + 4);
  texture.needsUpdate = true;

}

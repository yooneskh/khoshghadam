
/* responsibility */

// Generates a random numeric captcha code
// and renders it as a base64 PNG image.
// The digits are drawn on a hand-rolled bitmap
// and encoded to PNG with Bun's image pipeline.


const CAPTCHA_ALPHABET = '0123456789';
const CAPTCHA_LENGTH = 5;
const CAPTCHA_WIDTH = 160;
const CAPTCHA_HEIGHT = 56;

const GLYPH_WIDTH = 5;
const GLYPH_HEIGHT = 7;
const GLYPH_SCALE = 4;
const GLYPH_ADVANCE = 30;
const GLYPH_ORIGIN_X = 12;
const GLYPH_ORIGIN_Y = 14;

const BACKGROUND = [243, 244, 246] as const;
const INK = [31, 41, 55] as const;
const NOISE = [33, 33, 33] as const;


type Color = readonly [number, number, number];


// A compact 5x7 bitmap font
// covering the captcha digits.

const GLYPHS: Record<string, string[]> = {
  '0': [
    '.###.',
    '#...#',
    '#..##',
    '#.#.#',
    '##..#',
    '#...#',
    '.###.',
  ],
  '1': [
    '..#..',
    '.##..',
    '..#..',
    '..#..',
    '..#..',
    '..#..',
    '.###.',
  ],
  '2': [
    '.###.',
    '#...#',
    '....#',
    '...#.',
    '..#..',
    '.#...',
    '#####',
  ],
  '3': [
    '####.',
    '....#',
    '....#',
    '.###.',
    '....#',
    '....#',
    '####.',
  ],
  '4': [
    '...#.',
    '..##.',
    '.#.#.',
    '#..#.',
    '#####',
    '...#.',
    '...#.',
  ],
  '5': [
    '#####',
    '#....',
    '####.',
    '....#',
    '....#',
    '#...#',
    '.###.',
  ],
  '6': [
    '..##.',
    '.#...',
    '#....',
    '####.',
    '#...#',
    '#...#',
    '.###.',
  ],
  '7': [
    '#####',
    '....#',
    '...#.',
    '..#..',
    '.#...',
    '.#...',
    '.#...',
  ],
  '8': [
    '.###.',
    '#...#',
    '#...#',
    '.###.',
    '#...#',
    '#...#',
    '.###.',
  ],
  '9': [
    '.###.',
    '#...#',
    '#...#',
    '.####',
    '....#',
    '...#.',
    '.##..',
  ],
};


function createCaptchaCode(): string {

  let code = '';


  for (let index = 0; index < CAPTCHA_LENGTH; index++) {
    code += CAPTCHA_ALPHABET[Math.floor(Math.random() * CAPTCHA_ALPHABET.length)]!;
  }


  return code;

}

function createCanvas(): Uint8Array {

  const pixels = new Uint8Array(CAPTCHA_WIDTH * CAPTCHA_HEIGHT * 3);


  for (let index = 0; index < pixels.length; index += 3) {
    pixels[index] = BACKGROUND[0];
    pixels[index + 1] = BACKGROUND[1];
    pixels[index + 2] = BACKGROUND[2];
  }


  return pixels;

}

function setPixel(pixels: Uint8Array, x: number, y: number, color: Color): void {

  const column = Math.round(x);
  const row = Math.round(y);

  if (column < 0 || column >= CAPTCHA_WIDTH || row < 0 || row >= CAPTCHA_HEIGHT) {
    return;
  }


  const index = (row * CAPTCHA_WIDTH + column) * 3;

  pixels[index] = color[0];
  pixels[index + 1] = color[1];
  pixels[index + 2] = color[2];

}

function drawGlyph(pixels: Uint8Array, glyph: string[], originX: number, originY: number, angle: number, color: Color): void {

  const centerX = originX + (GLYPH_WIDTH * GLYPH_SCALE) / 2;
  const centerY = originY + (GLYPH_HEIGHT * GLYPH_SCALE) / 2;

  const cos = Math.cos(angle);
  const sin = Math.sin(angle);


  for (let row = 0; row < GLYPH_HEIGHT; row++) {

    for (let column = 0; column < GLYPH_WIDTH; column++) {

      if (glyph[row]![column] !== '#') {
        continue;
      }


      for (let subRow = 0; subRow < GLYPH_SCALE; subRow++) {

        for (let subColumn = 0; subColumn < GLYPH_SCALE; subColumn++) {

          const localX = column * GLYPH_SCALE + subColumn + 0.5 - (GLYPH_WIDTH * GLYPH_SCALE) / 2;
          const localY = row * GLYPH_SCALE + subRow + 0.5 - (GLYPH_HEIGHT * GLYPH_SCALE) / 2;

          setPixel(
            pixels,
            centerX + localX * cos - localY * sin,
            centerY + localX * sin + localY * cos,
            color,
          );

        }

      }

    }

  }

}

function drawLine(pixels: Uint8Array, x0: number, y0: number, x1: number, y1: number, color: Color): void {

  let startX = Math.round(x0);
  let startY = Math.round(y0);
  const endX = Math.round(x1);
  const endY = Math.round(y1);

  const deltaX = Math.abs(endX - startX);
  const deltaY = -Math.abs(endY - startY);
  const stepX = startX < endX ? 1 : -1;
  const stepY = startY < endY ? 1 : -1;

  let error = deltaX + deltaY;


  while (true) {

    setPixel(pixels, startX, startY, color);


    if (startX === endX && startY === endY) {
      break;
    }


    const doubledError = error * 2;


    if (doubledError >= deltaY) {
      error += deltaY;
      startX += stepX;
    }


    if (doubledError <= deltaX) {
      error += deltaX;
      startY += stepY;
    }

  }

}

function encodeBmp(pixels: Uint8Array): Uint8Array {

  const rowSize = Math.ceil((CAPTCHA_WIDTH * 3) / 4) * 4;
  const pixelDataSize = rowSize * CAPTCHA_HEIGHT;
  const fileSize = 54 + pixelDataSize;

  const output = new Uint8Array(fileSize);
  const view = new DataView(output.buffer);


  // file header

  output[0] = 0x42;
  output[1] = 0x4D;
  view.setUint32(2, fileSize, true);
  view.setUint32(10, 54, true);


  // info header

  view.setUint32(14, 40, true);
  view.setInt32(18, CAPTCHA_WIDTH, true);
  view.setInt32(22, CAPTCHA_HEIGHT, true);
  view.setUint16(26, 1, true);
  view.setUint16(28, 24, true);
  view.setUint32(30, 0, true);
  view.setUint32(34, pixelDataSize, true);
  view.setInt32(38, 2835, true);
  view.setInt32(42, 2835, true);
  view.setUint32(46, 0, true);
  view.setUint32(50, 0, true);


  // pixel data, bottom-up and BGR

  for (let row = 0; row < CAPTCHA_HEIGHT; row++) {

    const sourceRow = (CAPTCHA_HEIGHT - 1 - row) * CAPTCHA_WIDTH * 3;
    const targetRow = 54 + row * rowSize;


    for (let column = 0; column < CAPTCHA_WIDTH; column++) {

      const source = sourceRow + column * 3;
      const target = targetRow + column * 3;

      output[target] = pixels[source + 2]!;
      output[target + 1] = pixels[source + 1]!;
      output[target + 2] = pixels[source]!;

    }

  }


  return output;

}


export async function generateCaptcha() {

  const code = createCaptchaCode();
  const pixels = createCanvas();


  for (let index = 0; index < code.length; index++) {

    const glyph = GLYPHS[code[index]!]!;

    const originX = GLYPH_ORIGIN_X + index * GLYPH_ADVANCE + Math.random() * 4 - 2;
    const originY = GLYPH_ORIGIN_Y + Math.random() * 8 - 4;
    const angle = (Math.random() * 30 - 15) * (Math.PI / 180);

    drawGlyph(pixels, glyph, originX, originY, angle, INK);

  }


  for (let index = 0; index < 16; index++) {
    drawLine(
      pixels,
      Math.random() * CAPTCHA_WIDTH,
      Math.random() * CAPTCHA_HEIGHT,
      Math.random() * CAPTCHA_WIDTH,
      Math.random() * CAPTCHA_HEIGHT,
      NOISE,
    );
  }


  const image = await new Bun.Image(encodeBmp(pixels)).png().toBase64();


  return {
    code,
    image,
  };

}

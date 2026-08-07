import sharp from 'sharp';


const CAPTCHA_ALPHABET = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
const CAPTCHA_LENGTH = 5;
const CAPTCHA_WIDTH = 160;
const CAPTCHA_HEIGHT = 56;


function createCaptchaCode() {

  let code = '';

  for (let index = 0; index < CAPTCHA_LENGTH; index++) {
    code += CAPTCHA_ALPHABET[Math.floor(Math.random() * CAPTCHA_ALPHABET.length)]!;
  }

  return code;

}


function createCaptchaSvg(code: string) {

  const characters = code.split('').map((character, index) => {

    const x = 22 + index * 28;
    const y = 34 + (Math.random() * 10 - 5);
    const rotate = Math.random() * 30 - 15;

    return `<text x="${x}" y="${y}" transform="rotate(${rotate} ${x} ${y})" fill="#1f2937" font-size="28" font-family="monospace" font-weight="700">${character}</text>`;

  }).join('');

  const lines = Array.from({ length: 16 }, () => {

    const x1 = Math.random() * CAPTCHA_WIDTH;
    const y1 = Math.random() * CAPTCHA_HEIGHT;
    const x2 = Math.random() * CAPTCHA_WIDTH;
    const y2 = Math.random() * CAPTCHA_HEIGHT;

    return `<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" stroke="#212121" stroke-width="1"/>`;

  }).join('');

  return `
    <svg xmlns="http://www.w3.org/2000/svg" width="${CAPTCHA_WIDTH}" height="${CAPTCHA_HEIGHT}" viewBox="0 0 ${CAPTCHA_WIDTH} ${CAPTCHA_HEIGHT}">
      <rect width="100%" height="100%" fill="#f3f4f6"/>
      ${characters}
      ${lines}
    </svg>
  `;

}


export async function generateCaptcha() {

  const code = createCaptchaCode();

  const image = await sharp(Buffer.from(createCaptchaSvg(code)))
    .png()
    .toBuffer()
    .then(buffer => buffer.toString('base64'));

  return {
    code,
    image,
  };

}

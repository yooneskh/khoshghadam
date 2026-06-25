
import { access } from 'node:fs/promises';
import { createReadStream } from 'node:fs';
import { relative, resolve } from 'node:path';
import mime from 'mime';


export default defineEventHandler(async event => {

  const fileName = getRouterParam(event, 'fileName');

  if (!fileName) {
    throw createError({
      statusCode: 401,
      statusMessage: 'invalid file name',
    });
  }


  const mediaDir = resolve(process.cwd(), '.data/media');
  const filePath = resolve(mediaDir, fileName);

  if (relative(mediaDir, filePath).startsWith('..')) {
    throw createError({
      statusCode: 401,
      statusMessage: 'invalid file name',
    });
  }


  try {
    await access(filePath);
  }
  catch {
    throw createError({
      statusCode: 404,
      statusMessage: 'file not found',
    });
  }


  setResponseHeader(event, 'content-type', mime.getType(fileName) || 'application/octet-stream');

  return sendStream(event, createReadStream(filePath));

});

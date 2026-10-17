
/* responsibility */

// Streams a stored media file
// from the media directory in development.


const MEDIA_FILE_NAME_PATTERN = /^[A-Za-z0-9][A-Za-z0-9._-]*$/;


export default defineEventHandler(async event => {

  const fileName = getRouterParam(event, 'fileName');

  if (!fileName || !MEDIA_FILE_NAME_PATTERN.test(fileName)) {
    throw createError({
      statusCode: 401,
      statusMessage: 'invalid file name',
    });
  }


  const file = Bun.file(`${app.media.directory}/${fileName}`);

  if (!(await file.exists())) {
    throw createError({
      statusCode: 404,
      statusMessage: 'file not found',
    });
  }


  setResponseHeader(event, 'content-type', file.type || 'application/octet-stream');

  return sendStream(event, file.stream());

});

import { mkdir, writeFile } from 'node:fs/promises';
import { join } from 'node:path';
import { createImageMediaVariants } from '../../lib/media-variants-image';
import { eraseMedia } from '../../lib/media-erase';


const MEDIA_DIR = join(process.cwd(), '.data/media');


export default defineEventHandler(async event => {

  const form = await readFormData(event);
  const file = form.get('file') as File;

  if (!file || !file.size) {
    throw createError({
      statusCode: 401,
      statusMessage: 'invalid file',
    });
  }


  let media = await event.context.media.dbo.create({
    document: {
      name: file.name,
      type: file.type,
      size: file.size,
      path: '',
    },
  });


  const mediaFileName = `${media._id}.${file.name.slice(file.name.lastIndexOf('.') + 1)}`;
  const mediaFilePath = join(MEDIA_DIR, mediaFileName);

  await mkdir(MEDIA_DIR, { recursive: true });
  await writeFile(mediaFilePath, Buffer.from(await file.arrayBuffer()));


  try {

    media = await event.context.media.dbo.update({
      resourceId: media._id,
      document: {
        path: `/media/${mediaFileName}`,
      },
    });


    if (file.type.startsWith('image/')) {
      media = await createImageMediaVariants(event, MEDIA_DIR, media);
    }

    return media;

  }
  catch {

    await eraseMedia(event, MEDIA_DIR, media);

    throw createError({
      statusCode: 500,
      statusMessage: 'could not process the media',
    });

  }

});

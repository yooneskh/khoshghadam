import { mkdir, writeFile } from 'node:fs/promises';
import { join } from 'node:path';
import { createImageMediaVariants } from '../../lib/media-variants-image';


export default defineEventHandler(async event => {

  const user = await assertUser({ event });
  const form = await readFormData(event);
  const file = form.get('file') as File;

  if (!file || !file.size) {
    throw createError({
      statusCode: 401,
      statusMessage: 'invalid file',
    });
  }


  let media = await resources.media.dbo.create({
    document: {
      owner: user._id,
      name: file.name,
      type: file.type,
      size: file.size,
      path: '',
    },
  });


  const mediaFileName = `${media._id}.${file.name.slice(file.name.lastIndexOf('.') + 1)}`;
  const mediaFilePath = join(resources.media.directory, mediaFileName);

  await mkdir(resources.media.directory, { recursive: true });
  await writeFile(mediaFilePath, Buffer.from(await file.arrayBuffer()));


  try {

    media = await resources.media.dbo.update({
      resourceId: media._id,
      document: {
        path: `/media/${mediaFileName}`,
      },
    });


    if (file.type.startsWith('image/')) {
      media = await createImageMediaVariants(media);
    }

    return media;

  }
  catch {

    await eraseMedia(media);

    throw createError({
      statusCode: 500,
      statusMessage: 'could not process the media',
    });

  }

});

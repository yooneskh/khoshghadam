
/* responsibility */

// Stores an uploaded file as a media
// owned by the current user.


import { createImageMediaVariants } from '../../lib/media-variants-image';


export default defineEventHandler(async event => {

  const user = await assertUser({
    event,
  });


  const form = await readFormData(event);
  const file = form.get('file') as File;

  if (!file || !file.size) {
    throw createError({
      statusCode: 400,
      statusMessage: 'invalid file',
    });
  }


  let media = await app.media.dbo.create({
    document: {
      owner: user._id,
      name: file.name,
      type: file.type,
      size: file.size,
      path: '',
    },
  });


  const mediaFileName = `${media._id}.${file.name.slice(file.name.lastIndexOf('.') + 1)}`;
  const mediaFilePath = `${app.media.directory}/${mediaFileName}`;

  await Bun.write(mediaFilePath, file);


  try {

    media = await app.media.dbo.update({
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

    await eraseMedia(media._id);

    throw createError({
      statusCode: 500,
      statusMessage: 'could not process the media',
    });

  }

});

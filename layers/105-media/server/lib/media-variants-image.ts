
/* responsibility */

// Generates resized image variants of a media file
// and records their paths on the media document.


export async function createImageMediaVariants(media: any) {

  const variants = [
    {
      variant: 'thumb',
      size: 128,
      extension: 'png',
    },
    {
      variant: 'small',
      size: 256,
      extension: 'png',
    },
  ];


  const sourceFileName = media.path.slice(media.path.lastIndexOf('/') + 1);
  const sourcePath = `${app.media.directory}/${sourceFileName}`;


  for (const variant of variants) {

    const fileName = `${generateUuid()}.${variant.extension}`;

    await new Bun.Image(sourcePath)
      .resize(variant.size, variant.size, {
        fit: 'inside',
      })
      .png()
      .write(`${app.media.directory}/${fileName}`);

    media = await app.media.dbo.update({
      resourceId: media._id,
      document: {
        variants: {
          ...media.variants,
          [variant.variant]: `/media/${fileName}`,
        },
      },
    });

  }


  return media;

}

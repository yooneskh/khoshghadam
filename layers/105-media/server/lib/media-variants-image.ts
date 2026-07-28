import { join } from 'node:path';
import sharp from 'sharp';


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


  const sourcePath = join(resources.media.directory, media.path.slice(media.path.lastIndexOf('/') + 1));


  for (const variant of variants) {

    const fileName = `${generateUuid()}.${variant.extension}`;

    (await sharp(sourcePath)
      .resize(variant.size, variant.size, { fit: 'inside' })
      .png()
      .toFile(join(resources.media.directory, fileName))
    );

    media = await resources.media.dbo.update({
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

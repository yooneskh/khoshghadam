import { join } from 'node:path';
import sharp from 'sharp';


export async function createImageMediaVariants(mediaDirectoryBase: string, media: any) {

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


  const sourcePath = join(mediaDirectoryBase, media.path.slice(media.path.lastIndexOf('/') + 1));


  for (const variant of variants) {

    const fileName = `${generateUuid()}.${variant.extension}`;

    (await sharp(sourcePath)
      .resize(variant.size, variant.size, { fit: 'inside' })
      .png()
      .toFile(join(mediaDirectoryBase, fileName))
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

import { join } from 'node:path';
import { unlink } from 'node:fs/promises';


export async function eraseMedia(mediaId: string | undefined) {

  if (!mediaId) {
    return;
  }


  const media = await resources.media.dbo.find({
    resourceId: mediaId,
  });

  if (!media) {
    return;
  }



  if (media.path) {
    await eraseMediaFile(media.path);
  }

  if (media.variants) {
    await Promise.all(
      Object.values(media.variants).map(it =>
        eraseMediaFile(it as string),
      ),
    );
  }


  try {
    return await resources.media.dbo.delete({
      resourceId: media._id,
    });
  }
  catch {
    return media;
  }

}


async function eraseMediaFile(path: string) {

  if (!path) {
    return;
  }


  const fileName = path.slice(path.lastIndexOf('/') + 1);

  if (!fileName) {
    return;
  }


  try {
    await unlink(join(resources.media.directory, fileName));
  }
  catch (error) {
    if ((error as NodeJS.ErrnoException).code !== 'ENOENT') {
      throw error;
    }
  }

}

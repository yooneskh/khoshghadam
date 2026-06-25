import { H3Event } from 'h3';
import { join } from 'node:path';
import { unlink } from 'node:fs/promises';


export async function eraseMedia(event: H3Event, mediaDir: string, media: any) {

  if (media.path) {
    await eraseMediaFile(mediaDir, media.path);
  }


  if (media.variants) {
    await Promise.all(
      Object.values(media.variants).map(it =>
        eraseMediaFile(mediaDir, it as string),
      ),
    );
  }


  try {
    return await event.context.media.dbo.delete({
      resourceId: media._id,
    });
  }
  catch {
    return media;
  }

}


async function eraseMediaFile(mediaDir: string, path: string) {

  if (!path) {
    return;
  }


  const fileName = path.slice(path.lastIndexOf('/') + 1);

  if (!fileName) {
    return;
  }


  try {
    await unlink(join(mediaDir, fileName));
  }
  catch (error) {
    if ((error as NodeJS.ErrnoException).code !== 'ENOENT') {
      throw error;
    }
  }

}

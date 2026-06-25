import { join } from 'node:path';
import { eraseMedia } from '../../lib/media-erase';


export default defineEventHandler(async event => {

  const media = await handleResourceDelete({
    resource: 'media',
    event,
    permission: 'admin.media.delete',
  });


  return eraseMedia(
    event,
    join(process.cwd(), '.data/media'),
    media,
  );

});


/* responsibility */

// Opens the media viewer dialog
// for one media file at full size.


import MediaViewerDialog from '../atoms/media-viewer-dialog.vue';


export function launchMediaViewerDialog(args: { media: any; }) {
  return launchDialog({
    component: MediaViewerDialog,
    props: args,
  });
}

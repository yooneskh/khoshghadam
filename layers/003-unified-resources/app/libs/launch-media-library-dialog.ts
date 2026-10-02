
/* responsibility */

// Opens the media library dialog
// for picking media items.


import MediaLibraryDialog from '../atoms/media-library-dialog.vue';


export function launchMediaLibraryDialog(args: { items: any[]; multiple: boolean; onSelected: (items: any[]) => void; }) {
  return launchDialog({
    component: MediaLibraryDialog,
    props: args,
  });
}

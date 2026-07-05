import MediaLibraryDialog from '../dialogs/media-library-dialog.vue';


export function launchMediaLibraryDialog(args: { items: any[]; multiple: boolean; onSelected: (items: any[]) => void; }) {
  return launchDialog({
    component: MediaLibraryDialog,
    props: args,
  });
}

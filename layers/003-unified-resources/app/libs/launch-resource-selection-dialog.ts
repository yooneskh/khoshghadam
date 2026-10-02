
/* responsibility */

// Opens the resource selection dialog
// and resolves with the picked items.


import ResourceSelectionDialog from '../atoms/resource-selection-dialog.vue';


export function launchResourceSelectionDialog(args: { resource: string; items: any[]; multiple: boolean; onSelected: (items: any[]) => void; }) {
  return launchDialog({
    component: ResourceSelectionDialog,
    props: args,
  });
}

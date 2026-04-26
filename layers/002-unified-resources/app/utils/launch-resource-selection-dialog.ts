import ResourceSelectionDialog from '../dialogs/resource-selection-dialog.vue';


export function launchResourceSelectionDialog(args: { resource: string; items: any[]; multiple: boolean; onSelected: (items: any[]) => void; }) {
  return launchDialog({
    component: ResourceSelectionDialog,
    props: args,
  });
}

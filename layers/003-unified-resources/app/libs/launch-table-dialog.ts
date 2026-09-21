import TableDialog from '../dialogs/table-dialog.vue';


export function launchTableDialog(args: { icon: string; title: string; subtitle: string; cardActions: any[]; columns: any[]; data: any[]; tableActions: any[]; }) {
  return launchDialog({
    component: TableDialog,
    props: args,
  });
}

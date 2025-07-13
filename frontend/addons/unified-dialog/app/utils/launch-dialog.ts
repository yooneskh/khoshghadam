

export async function launchDialog(options: { component: any, props: any }) {

  const modal = useOverlay().create(options.component, {
    destroyOnClose: true,
  });

  return await modal.open(options.props).result;

}

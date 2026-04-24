

export function useResourceMeta(args: { resource: MaybeRefOrGetter<string> }) {

  const { data: schema } = useUFetch(
    computed(() => `/${toValue(args.resource)}/schema`),
  );


  const fields = computed(() => {
    return (
      ((schema.value as any[] || [])
        .filter(it => !it.hidden)
        .map(it => {

          const field: any = {
            key: it.key,
            identifier: 'input',
            label: radTitle(it.key),
          };


          if (it.ref) {
            field.identifier = 'resource';
            field.resource = it.ref;
          }

          return field;

        })
      )
    );
  });

  const columns = computed(() => {
    return [
      ...((schema.value as any[] || [])
        .filter(it => !it.hidden)
        .map(it => ({
          accessorKey: it.key,
          header: radTitle(it.key),
        }))
      ),
      {
        accessorKey: 'createdAt',
        header: 'Created',
      },
      {
        accessorKey: 'updatedAt',
        header: 'Updated',
      },
    ];
  });


  return {
    meta: schema,
    fields,
    columns,
  };

}

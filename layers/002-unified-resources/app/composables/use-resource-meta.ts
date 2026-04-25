

export function useResourceMeta(args: { resource: MaybeRefOrGetter<string> }) {

  const { data: schema } = useUFetch(
    computed(() => `/${toValue(args.resource)}/schema`),
  );


  const fields = computed(() => {
    return (
      ((schema.value as any[] || [])
        .filter(it => !it.hidden)
        .map(convertMetaToField)
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


function convertMetaToField(meta: any) {

  const field: any = {
    key: meta.key,
    identifier: 'input',
    label: radTitle(meta.key),
    width: meta.width,
  };


  if (meta.ref) {
    field.identifier = 'resource';
    field.resource = meta.ref;
    field.multiple = meta.multiple;
  }
  else if (meta.type === 'array' && meta.items.type === 'string') {
    field.identifier = 'tags';
  }
  else if (meta.type === 'array' && meta.items.type === 'object') {
    field.identifier = 'series';
    field.itemFields = meta.items.properties.map(convertMetaToField);
  }

  return field;

}

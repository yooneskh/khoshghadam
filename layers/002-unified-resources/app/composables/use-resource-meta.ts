

export function useResourceMeta(args: { resource: MaybeRefOrGetter<string> }) {

  const schema = asyncComputed<any>(async () => {

    if (!toValue(args.resource)) {
      return [];
    }


    return ufetch(`/${toValue(args.resource)}/schema`);

  });


  const meta = computed(() => {
    return schema.value || [];
  });

  const fields = computed(() => {
    return (
      (meta.value
        .filter((it: any) => !it.hidden)
        .map(convertMetaToField)
      )
    );
  });

  const columns = computed(() => {
    return [
      ...(meta.value
        .filter((it: any) => !it.hidden)
        .map((it: any) => ({
          accessorKey: it.key,
          header: radTitle(it.key),
          ref: it.ref,
          type: it.type,
          items: it.items,
          labelFormat: it.labelFormat,
        }))
      ),
      {
        accessorKey: 'createdAt',
        header: 'Created',
        type: 'date',
      },
      {
        accessorKey: 'updatedAt',
        header: 'Updated',
        type: 'date',
      },
    ];
  });


  return {
    meta,
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

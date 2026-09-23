import { useResourceName } from './use-resource-name';
import { retrieveResourceSchema } from './retrieve-resource';


export function useResourceMeta(args: { resource: MaybeRefOrGetter<string>; }) {

  const { resourcePath } = useResourceName({
    resource: args.resource,
  });


  const schema = computedAsync<any>(async () => {

    if (!resourcePath.value) {
      return [];
    }


    return await retrieveResourceSchema({
      resourcePath: resourcePath.value,
    });

  });

  const meta = computed(() => {
    return schema.value || [];
  });

  const fields = computed(() => {
    return meta.value.filter((it: any) => !it.hidden).map(convertMetaToField);
  });

  const columns = computed(() => {
    return [
      ...meta.value.filter((it: any) => !it.hidden && !it.hideInTable).map((it: any) => ({
        accessorKey: it.key,
        header: radTitle(it.key),
        resource: it.resource,
        type: it.type,
        items: it.items,
        enum: it.enum,
        labelFormat: it.labelFormat,
      })),
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


  if (meta.resource === 'media') {
    field.identifier = 'media';
    field.multiple = meta.type === 'array';
  }
  else if (meta.resource) {
    field.identifier = 'resource';
    field.resource = meta.resource;
    field.multiple = meta.type === 'array';
  }
  else if (meta.type === 'array' && meta.items.type === 'string') {
    field.identifier = 'tags';
  }
  else if (meta.type === 'array' && meta.items.type === 'object') {
    field.identifier = 'series';
    field.itemFields = meta.items.properties.map(convertMetaToField);
  }
  else if (meta.longText) {
    field.identifier = 'textarea';
  }
  else if (meta.enum) {
    field.identifier = 'select';
    field.items = meta.enum;
  }
  else if (meta.type === 'boolean') {
    field.identifier = 'checkbox';
  }
  else if (meta.labelFormat) {
    field.identifier = 'date';
  }
  else if (meta.type === 'number') {
    field.type = 'number';
  }


  return field;

}

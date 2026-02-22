

export function useResourceFormFields(args: { resource: MaybeRefOrGetter<string> }) {

  const { data: schema } = useUFetch(
    computed(() => `/${toValue(args.resource)}/schema`),
  );


  const fields = computed(() => {
    return Object.keys(schema.value ?? {}).map(it => ({
      key: it,
      identifier: 'input',
      label: radTitle(it),
    }));
  });


  return {
    fields,
  };

}

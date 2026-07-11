

export function useResourceName(args: { resource: MaybeRefOrGetter<string> }) {
  return {
    resource: computed(() => radPascal(wordToSingular(toValue(args.resource) || ''))),
    resourcePath: computed(() => radDash(wordToPlural(toValue(args.resource) || ''))),
    title: computed(() => radTitle(wordToSingular(toValue(args.resource) || ''))),
    titlePlural: computed(() => radTitle(wordToPlural(toValue(args.resource) || ''))),
  };
}

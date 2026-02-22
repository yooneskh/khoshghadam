import pluralize from '@theothergothamdev/pluralize-ts';


export function wordToPlural(word: string): string {
  return pluralize.plural(word);
}

export function wordToSingular(word: string): string {
  return pluralize.singular(word);
}

export function wordToCount(word: string, count: number, includeCount: boolean): string {
  return pluralize(word, count, includeCount);
}

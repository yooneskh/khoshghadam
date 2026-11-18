
/* responsibility */

// Loads and evicts one resource document
// through the preemptive cache.


/* resource */

import { preemptCache, evictCache } from './preemptive-cache';


export async function retrieveResource(args: { resourcePath: string, id: string, options?: any }) {
  return preemptCache({
    key: `--unified-resources-resource-${args.resourcePath}-${args.id}--`,
    run: async () => {
      return ufetch(`/api/${args.resourcePath}/${args.id}`, args.options);
    },
  });
}

export async function evictResource(args: { resourcePath: string, id: string }) {
  return evictCache({
    key: `--unified-resources-resource-${args.resourcePath}-${args.id}--`,
  });
}

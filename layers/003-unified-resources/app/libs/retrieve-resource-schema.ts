
/* responsibility */

// Retrieves resource schemas
// through the preemptive cache.


import { preemptCache } from './preemptive-cache';


export async function retrieveResourceSchema(args: { resourcePath: string }) {
  return preemptCache({
    key: `--unified-resources-resource-schema-${args.resourcePath}--`,
    run: async () => {
      return ufetch(`/api/${args.resourcePath}/schema`);
    },
  });
}

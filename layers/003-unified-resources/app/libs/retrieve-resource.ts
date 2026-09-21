import { preemptCache, evictCache } from './preemptive-cache';


export async function retrieveResourceSchema(args: { resourcePath: string; }) {
  return preemptCache({
    key: `--unified-resources-resource-schema-${args.resourcePath}--`,
    run: async () => {
      return ufetch(`/api/${args.resourcePath}/schema`);
    },
  });
}

export async function retrieveResource(args: { resourcePath: string; id: string; options: any; }) {
  return preemptCache({
    key: `--unified-resources-resource-${args.resourcePath}-${args.id}--`,
    run: async () => {
      return ufetch(`/api/${args.resourcePath}/${args.id}`, args.options);
    },
  });
}

export async function evictResource(args: { resourcePath: string; id: string; }) {
  return evictCache({
    key: `--unified-resources-resource-${args.resourcePath}-${args.id}--`,
  });
}

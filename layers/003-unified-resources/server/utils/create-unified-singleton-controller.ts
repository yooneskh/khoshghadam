
/* responsibility */

// Creates the typed controller for one fixed singleton row
// with schema, retrieve, and update.


/* interface */

import { type, Type } from 'arktype';


export interface UnifiedSingletonController<T> {
  schema: UnifiedResourceController<T>['schema'];
  retrieve: (args?: {
    select?: string[];
    populate?: Record<string, string[]> | undefined;
  }) => ReturnType<UnifiedResourceController<T>['retrieve']>;
  update: (args: {
    document: Partial<T>;
  }) => ReturnType<UnifiedResourceController<T>['update']>;
}


/* singleton */

export function createUnifiedSingletonController<T extends object>(props: {
  resource: string;
  schema: any;
  type: Type<T>;
  meta?: Partial<Record<Extract<keyof T, string>, ResourceMeta>>;
  defaults?: T;
}): UnifiedSingletonController<T> {

  const validatedDefaults = props.type(props.defaults ?? {});

  if (validatedDefaults instanceof type.errors) {
    throw new Error(`singleton "${props.resource}" defaults are invalid: ${validatedDefaults.summary}`);
  }


  const dbo = createUnifiedResourceController({
    resource: props.resource,
    schema: props.schema,
    type: props.type,
    meta: props.meta,
  });


  let resourceId: string | undefined;


  async function ensureDocument() {

    if (resourceId) {
      return resourceId;
    }


    const existing = await dbo.find({
      filter: {},
    });


    if (existing) {
      resourceId = existing._id;
      return resourceId;
    }


    const created = await dbo.create({
      document: radCloneDeep(validatedDefaults) as T,
    });


    resourceId = created._id;


    return resourceId;

  }


  return {
    schema: () => dbo.schema(),
    retrieve: async (args) => {

      const resourceId = await ensureDocument();


      return dbo.retrieve({
        resourceId,
        select: args?.select,
        populate: args?.populate,
      });

    },
    update: async (args) => {

      const resourceId = await ensureDocument();


      return dbo.update({
        resourceId,
        document: args.document,
      });

    },
  };

}

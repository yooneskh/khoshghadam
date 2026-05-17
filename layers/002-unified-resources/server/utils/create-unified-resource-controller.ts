import type { H3Event } from 'h3';
import { type, Type } from 'arktype';


type AddIdToNestedArrayObjects<T> = (
  T extends (infer Item)[]
    ? Item extends object
      ? (AddIdToNestedArrayObjects<Item> & { _id: string })[]
      : T
    : T extends object
      ? { [Key in keyof T]: AddIdToNestedArrayObjects<T[Key]> }
      : T
);

type UnifiedResourceDocument<T> = AddIdToNestedArrayObjects<T> & {
  _id: string;
  createdAt: number;
  updatedAt?: number;
};


interface ResourceMeta {
  resource?: string;
  hidden?: boolean;
  hideInTable?: boolean;
  width?: number;
  children?: Record<string, ResourceMeta>;
}


export interface UnifiedResourceController<T> {
  schema: () => any;
  list: (args: { filter?: any; select?: string[]; sort?: any; skip?: any; limit?: any; populate?: Record<string, string[]> | undefined; }) => Promise<UnifiedResourceDocument<T>[]>;
  count: (args: { filter?: any; }) => Promise<number>;
  find: (args: { resourceId?: string; filter?: any; select?: string[]; populate?: Record<string, string[]> | undefined; }) => Promise<UnifiedResourceDocument<T> | undefined>;
  retrieve: (args: { resourceId?: string; filter?: any; select?: string[]; populate?: Record<string, string[]> | undefined; }) => Promise<UnifiedResourceDocument<T>>;
  create: (args: { document: T; }) => Promise<UnifiedResourceDocument<T>>;
  update: (args: { resourceId?: string; document: Partial<T>; }) => Promise<UnifiedResourceDocument<T>>;
  delete: (args: { resourceId?: string; }) => Promise<UnifiedResourceDocument<T>>;
}


const resourceRegistry = new Map<string, any>();


export function createUnifiedResourceController<T extends object>(props: { event: H3Event; resource: string; schema: any, type: Type<T>; meta?: Partial<Record<Extract<keyof T, string>, ResourceMeta>> }): UnifiedResourceController<T> {

  const collectionName = props.resource;


  if (props.meta) {
    resourceRegistry.set(collectionName, props.meta);
  }


  return {
    schema: () => {

      const convertPropertyToSchema = (schema: any, properties: any, meta: any): any => {
        return Object.keys(schema).map(key => ({
          key: key.replaceAll('?', ''),
          ...(properties[key.replaceAll('?', '')]),
          ...(meta?.[key.replaceAll('?', '')] ?? {}),
          items: !properties[key.replaceAll('?', '')]?.items ? undefined : {
            ...properties[key.replaceAll('?', '')].items,
            properties: !properties[key.replaceAll('?', '')].items.properties ? undefined : convertPropertyToSchema(
              schema[key.replaceAll('?', '')][0],
              properties[key.replaceAll('?', '')].items.properties,
              meta?.[key.replaceAll('?', '')]?.children,
            ),
          },
        }));
      };


      return convertPropertyToSchema(
        props.schema,
        (props.type.toJsonSchema() as any)?.properties,
        props.meta,
      );

    },
    list: async (args) => {

      const collection = await loadDbClient(props.event).then(it => it.collection(collectionName));


      const documents = await collection.find(args.filter).project(!args.select ? undefined : Object.fromEntries(args.select.map(it => [it, 1])) as any).sort(args.sort).skip(args.skip).limit(args.limit).toArray() as unknown as UnifiedResourceDocument<T>[];


      if (args.populate) {
        await Promise.all(
          documents.map(it =>
            populateDocument({
              event: props.event,
              document: it,
              meta: props.meta,
              populate: args.populate!,
            }),
          ),
        );
      }


      return documents;

    },
    count: async (args) => {

      const collection = await loadDbClient(props.event).then(it => it.collection(collectionName));


      return collection.countDocuments(args.filter);

    },
    find: async (args) => {

      const collection = await loadDbClient(props.event).then(it => it.collection(collectionName));


      const filter = args.resourceId ? { _id: args.resourceId as any } : args.filter;
      const projection = args.select ? Object.fromEntries(args.select.map(it => [it, 1])) as any : undefined;

      const document = await collection.findOne(filter, {
        projection,
      });

      if (!document) {
        return undefined;
      }


      if (args.populate) {
        await populateDocument({
          event: props.event,
          document,
          meta: props.meta,
          populate: args.populate,
        });
      }


      return document as unknown as UnifiedResourceDocument<T>;

    },
    retrieve: async (args) => {

      const collection = await loadDbClient(props.event).then(it => it.collection(collectionName));


      const filter = args.resourceId ? { _id: args.resourceId as any } : args.filter;
      const projection = args.select ? Object.fromEntries(args.select.map(it => [it, 1])) as any : undefined;

      const document = await collection.findOne(filter, {
        projection,
      });

      if (!document) {
        throw new Error('document not found');
      }


      if (args.populate) {
        await populateDocument({
          event: props.event,
          document,
          meta: props.meta,
          populate: args.populate,
        });
      }


      return document as unknown as UnifiedResourceDocument<T>;

    },
    create: async (args) => {

      const collection = await loadDbClient(props.event).then(it => it.collection(collectionName));


      const document = {
        ...args.document,
        _id: generateUuid() as any,
        createdAt: Date.now(),
      };


      const validatedDocument = props.type(document);

      if (validatedDocument instanceof type.errors) {
        throw new Error('document is invalid: ' + validatedDocument.summary);
      }


      normalizeDocumentIds(document);


      await collection.insertOne(document);

      return validatedDocument as unknown as UnifiedResourceDocument<T>;

    },
    update: async (args) => {

      const collection = await loadDbClient(props.event).then(it => it.collection(collectionName));


      const document = await collection.findOne({ _id: args.resourceId as any });

      if (!document) {
        throw new Error('document not found');
      }


      const updatedDocument = Object.fromEntries(
        Object.entries({ ...document, ...args.document, updatedAt: Date.now() })
          .filter(entry => !['_id', 'createdAt', 'updatedAt'].includes(entry[0]))
      );


      const validatedDocument = props.type(updatedDocument);

      if (validatedDocument instanceof type.errors) {
        throw new Error('document is invalid: ' + validatedDocument.summary);
      }


      const finalDocument = {
        _id: document._id,
        ...updatedDocument,
        createdAt: document.createdAt,
        updatedAt: Date.now(),
      };


      normalizeDocumentIds(finalDocument);


      await collection.updateOne({ _id: args.resourceId as any }, { $set: finalDocument });

      return finalDocument as unknown as UnifiedResourceDocument<T>;

    },
    delete: async (args) => {

      const collection = await loadDbClient(props.event).then(it => it.collection(collectionName));


      const document = await collection.findOne({ _id: args.resourceId as any });

      if (!document) {
        throw new Error('document not found');
      }


      await collection.deleteOne({ _id: document._id });

      return document as unknown as UnifiedResourceDocument<T>;

    },
  };

}


function normalizeDocumentIds(value: any) {

  if (!value || typeof value !== 'object') {
    return;
  }


  if (Array.isArray(value)) {
    for (const item of value) {

      if (!item || typeof item !== 'object') {
        continue;
      }

      if (!('_id' in item)) {
        item._id = generateUuid();
      }

      normalizeDocumentIds(item);

    }
  }
  else {
    for (const key in value) {
      normalizeDocumentIds(value[key]);
    }
  }

}

async function populateDocument(args: { event: H3Event; document: any, meta: any, populate: Record<string, string[]>; parents?: string[] }) {

  if (!args.document || typeof args.document !== 'object' || Array.isArray(args.document) || !args.meta) {
    return;
  }


  for (const key in args.document) {

    const value = args.document[key];
    const populatePath = [...(args.parents ?? []), key];
    const keyExactMatch = Object.keys(args.populate).find(it => it === populatePath.join('.'));
    const keyPreMatch = Object.keys(args.populate).find(it => it.startsWith(populatePath.join('.')));
    const populateFields = keyExactMatch ? args.populate[populatePath.join('.')] : keyPreMatch ? [''] : undefined;
    const targetMeta = args.meta[key];

    if (typeof value !== 'string' && !Array.isArray(value)) {
      continue;
    }

    if (!targetMeta || !populateFields || (!targetMeta.resource && !targetMeta.children)) {
      continue;
    }


    if (typeof value === 'string' && targetMeta.resource) {

      args.document[key] = await (args.event.context[targetMeta.resource]?.dbo as UnifiedResourceController<any> | undefined)?.find({
        resourceId: value,
        select: !populateFields?.[0] ? undefined : populateFields,
      });

      if (args.document[key]) {
        await populateDocument({
          event: args.event,
          document: args.document[key],
          meta: resourceRegistry.get(targetMeta.resource),
          populate: args.populate,
          parents: populatePath,
        });
      }

    }
    else if (Array.isArray(value)) {
      await Promise.all(
        value.map(async (it, index) => {
          if (typeof it === 'string' && targetMeta.resource) {

            args.document[key][index] = await (args.event.context[targetMeta.resource]?.dbo as UnifiedResourceController<any> | undefined)?.find({
              resourceId: it,
              select: !populateFields?.[0] ? undefined : populateFields,
            });

            if (args.document[key][index]) {
              await populateDocument({
                event: args.event,
                document: args.document[key][index],
                meta: resourceRegistry.get(targetMeta.resource),
                populate: args.populate,
                parents: populatePath,
              });
            }

          }
          else if (it && typeof it === 'object' && targetMeta.children) {
            await populateDocument({
              event: args.event,
              document: it,
              meta: targetMeta.children,
              populate: args.populate,
              parents: populatePath,
            });
          }
        }),
      );
    }

  }

}

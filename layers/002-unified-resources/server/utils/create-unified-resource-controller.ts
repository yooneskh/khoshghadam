import type { H3Event } from 'h3';
import { type, Type } from 'arktype';


interface DocumentCreated {
  _id: string;
  createdAt: number;
  updatedAt?: number;
}

type AddIdToNestedArrayObjects<T> = T extends (infer Item)[]
  ? Item extends object
    ? (AddIdToNestedArrayObjects<Item> & { _id: string })[]
    : T
  : T extends object
    ? { [Key in keyof T]: AddIdToNestedArrayObjects<T[Key]> }
    : T;

type UnifiedResourceDocument<T> = AddIdToNestedArrayObjects<T> & DocumentCreated;

interface ResourceMeta {
  ref?: string;
  hidden?: boolean;
  width?: number;
  children?: Record<string, ResourceMeta>;
}


export interface UnifiedResourceController<T> {
  schema: () => any;
  list: (args: { filter?: any; sort?: any; skip?: any; limit?: any; }) => Promise<UnifiedResourceDocument<T>[]>;
  count: (args: { filter?: any; }) => Promise<number>;
  find: (args: { resourceId?: string; filter?: any; }) => Promise<UnifiedResourceDocument<T> | undefined>;
  retrieve: (args: { resourceId?: string; filter?: any; }) => Promise<UnifiedResourceDocument<T>>;
  create: (args: { document: T; }) => Promise<UnifiedResourceDocument<T>>;
  update: (args: { resourceId?: string; document: Partial<T>; }) => Promise<UnifiedResourceDocument<T>>;
  delete: (args: { resourceId?: string; }) => Promise<UnifiedResourceDocument<T>>;
}


export function createUnifiedResourceController<T extends object>(props: { event: H3Event; collectionName: string; schema: any, type: Type<T>; meta?: Partial<Record<Extract<keyof T, string>, ResourceMeta>> }): UnifiedResourceController<T> {
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

      const collection = await loadDbClient(props.event).then(it => it.collection(props.collectionName));


      return collection.find(args.filter).sort(args.sort).skip(args.skip).limit(args.limit).toArray() as unknown as UnifiedResourceDocument<T>[];

    },
    count: async (args) => {

      const collection = await loadDbClient(props.event).then(it => it.collection(props.collectionName));


      return collection.countDocuments(args.filter);

    },
    find: async (args) => {

      const collection = await loadDbClient(props.event).then(it => it.collection(props.collectionName));


      const document = await (args.resourceId ? collection.findOne({ _id: args.resourceId as any }) : collection.findOne(args.filter));

      if (!document) {
        return undefined;
      }


      return document as unknown as UnifiedResourceDocument<T>;

    },
    retrieve: async (args) => {

      const collection = await loadDbClient(props.event).then(it => it.collection(props.collectionName));


      const document = await (args.resourceId ? collection.findOne({ _id: args.resourceId as any }) : collection.findOne(args.filter));

      if (!document) {
        throw new Error('document not found');
      }


      return document as unknown as UnifiedResourceDocument<T>;

    },
    create: async (args) => {

      const collection = await loadDbClient(props.event).then(it => it.collection(props.collectionName));


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

      const collection = await loadDbClient(props.event).then(it => it.collection(props.collectionName));


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

      const collection = await loadDbClient(props.event).then(it => it.collection(props.collectionName));


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

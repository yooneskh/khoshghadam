import type { H3Event } from 'h3';
import { type, Type } from 'arktype';
import generateUUIDv7 from '@quentinadam/uuidv7';


interface DocumentCreated {
  _id: string;
  createdAt: number;
  updatedAt?: number;
}


export interface UnifiedResourceController<T> {
  schema: () => any;
  list: (args: { filter?: any; sort?: any; skip?: any; limit?: any; }) => Promise<(T & DocumentCreated)[]>;
  find: (args: { resourceId?: string; filter?: any; }) => Promise<(T & DocumentCreated) | undefined>;
  retrieve: (args: { resourceId?: string; filter?: any; }) => Promise<(T & DocumentCreated)>;
  create: (args: { document: any; }) => Promise<(T & DocumentCreated)>;
  update: (args: { resourceId?: string; document: any; }) => Promise<(T & DocumentCreated)>;
  delete: (args: { resourceId?: string; }) => Promise<(T & DocumentCreated)>;
}


export function createUnifiedResourceController<T>(props: { event: H3Event; collectionName: string; type: Type<T>; }): UnifiedResourceController<T> {
  return {
    schema: () => {
      return (props.type.toJsonSchema() as any)?.properties;
    },
    list: async (args) => {

      const collection = await loadDbClient(props.event).then(it => it.collection(props.collectionName));


      return collection.find(args.filter).sort(args.sort).skip(args.skip).limit(args.limit).toArray() as unknown as (T & DocumentCreated)[];

    },
    find: async (args) => {

      const collection = await loadDbClient(props.event).then(it => it.collection(props.collectionName));


      const document = await (args.resourceId ? collection.findOne({ _id: args.resourceId as any }) : collection.findOne(args.filter));

      if (!document) {
        return undefined;
      }


      return document as unknown as (T & DocumentCreated);

    },
    retrieve: async (args) => {

      const collection = await loadDbClient(props.event).then(it => it.collection(props.collectionName));


      const document = await (args.resourceId ? collection.findOne({ _id: args.resourceId as any }) : collection.findOne(args.filter));

      if (!document) {
        throw new Error('document not found');
      }


      return document as unknown as (T & DocumentCreated);

    },
    create: async (args) => {

      const collection = await loadDbClient(props.event).then(it => it.collection(props.collectionName));


      const document = {
        ...args.document,
        _id: generateUUIDv7(),
        createdAt: Date.now(),
      };


      const validatedDocument = props.type(document);

      if (validatedDocument instanceof type.errors) {
        throw new Error('document is invalid: ' + validatedDocument.summary);
      }


      await collection.insertOne(document);

      return validatedDocument as unknown as (T & DocumentCreated);

    },
    update: async (args) => {

      const collection = await loadDbClient(props.event).then(it => it.collection(props.collectionName));


      const document = await collection.findOne({ _id: args.resourceId as any });

      if (!document) {
        throw new Error('document not found');
      }


      const updatedDocument = {
        ...document,
        ...args.document,
        updatedAt: Date.now(),
      };

      delete updatedDocument._id;
      delete updatedDocument.createdAt;
      delete updatedDocument.updatedAt;


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

      await collection.updateOne({ _id: args.resourceId as any }, { $set: finalDocument });

      return finalDocument as unknown as (T & DocumentCreated);

    },
    delete: async (args) => {

      const collection = await loadDbClient(props.event).then(it => it.collection(props.collectionName));


      const document = await collection.findOne({ _id: args.resourceId as any });

      if (!document) {
        throw new Error('document not found');
      }


      await collection.deleteOne({ _id: document._id });

      return document as unknown as (T & DocumentCreated);

    },
  };
}

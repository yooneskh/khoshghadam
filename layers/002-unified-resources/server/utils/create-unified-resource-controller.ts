import type { H3Event } from 'h3';
import generateUUIDv7 from '@quentinadam/uuidv7';


export interface UnifiedResourceController {
  list: (args: { filter?: any; sort?: any; skip?: any; limit?: any; }) => Promise<any[]>;
  find: (args: { resourceId?: string; filter?: any; }) => Promise<any | undefined>;
  retrieve: (args: { resourceId?: string; filter?: any; }) => Promise<any>;
  create: (args: { document: any; }) => Promise<any>;
  update: (args: { resourceId?: string; document: any; }) => Promise<any>;
  delete: (args: { resourceId?: string; }) => Promise<any>;
}


export function createUnifiedResourceController(props: { event: H3Event; collectionName: string; }): UnifiedResourceController {
  return {
    list: async (args) => {

      const collection = await loadDbClient(props.event).then(it => it.collection(props.collectionName));


      return collection.find(args.filter).sort(args.sort).skip(args.skip).limit(args.limit).toArray();

    },
    find: async (args) => {

      const collection = await loadDbClient(props.event).then(it => it.collection(props.collectionName));


      const document = await (args.resourceId ? collection.findOne({ _id: args.resourceId as any }) : collection.findOne(args.filter));

      if (!document) {
        return undefined;
      }


      return document;

    },
    retrieve: async (args) => {

      const collection = await loadDbClient(props.event).then(it => it.collection(props.collectionName));


      const document = await (args.resourceId ? collection.findOne({ _id: args.resourceId as any }) : collection.findOne(args.filter));

      if (!document) {
        throw new Error('document not found');
      }


      return document;

    },
    create: async (args) => {

      const collection = await loadDbClient(props.event).then(it => it.collection(props.collectionName));


      const document = {
        ...args.document,
        _id: generateUUIDv7(),
        createdAt: Date.now(),
      };


      await collection.insertOne(document);

      return document;

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


      await collection.updateOne({ _id: args.resourceId as any }, { $set: updatedDocument });

      return updatedDocument;

    },
    delete: async (args) => {

      const collection = await loadDbClient(props.event).then(it => it.collection(props.collectionName));


      const document = await collection.findOne({ _id: args.resourceId as any });

      if (!document) {
        throw new Error('document not found');
      }


      await collection.deleteOne({ _id: document._id });

      return document;

    },
  };
}

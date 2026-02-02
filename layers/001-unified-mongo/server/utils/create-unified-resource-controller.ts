import type { H3Event } from 'h3';


export interface UnifiedResourceController {
  list: () => Promise<any[]>;
}


export function createUnifiedResourceController(event: H3Event, collectionName: string): UnifiedResourceController {
  return {
    list: async () => {

      const db = await loadDbClient(event);
      const collection = db.collection(collectionName);

      return collection.find().toArray();

    },
  };
}

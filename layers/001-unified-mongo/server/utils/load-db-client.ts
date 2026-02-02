import type { H3Event } from 'h3';
import { MongoClient } from 'mongodb';


let client: MongoClient | null = null;


export async function loadDbClient(event: H3Event) {

  const config = useRuntimeConfig(event);


  if (client) {
    return client.db(config.database.name);
  }


  client = new MongoClient(config.database.url, {
    maxPoolSize: 1,
    minPoolSize: 0,
    serverSelectionTimeoutMS: 5000,
  } as any);

  await client.connect();


  return client.db(config.database.name);

}

import type { H3Event } from 'h3';
import { MongoClient } from 'mongodb';


export async function loadDbClient(event: H3Event) {

  const config = useRuntimeConfig(event);


  const client = new MongoClient(config.database.url, {
    maxPoolSize: 1,
    minPoolSize: 0,
    serverSelectionTimeoutMS: 5000,
  });

  await client.connect();


  return client.db(config.database.name);

}

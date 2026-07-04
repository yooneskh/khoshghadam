import type { H3Event } from 'h3';
import { Db, MongoClient } from 'mongodb';


let database: Db | null = null;


export async function loadDbClient(event: H3Event) {

  if (database) {
    return database;
  }


  const config = useRuntimeConfig(event);

  const client = new MongoClient(config.database.url);
  await client.connect();

  database = client.db(config.database.name);
  return database;

}

import { Db, MongoClient } from 'mongodb';


let database: Db | null = null;


export async function loadDbClient() {

  if (database) {
    return database;
  }


  const config = useRuntimeConfig();

  const client = new MongoClient(config.database.url);
  await client.connect();

  database = client.db(config.database.name);
  return database;

}


/* responsibility */

// Connects to MongoDB once
// and shares the configured database.


import { Db, MongoClient } from 'mongodb';


export const loadDbClient = radPromiseMemo(async (): Promise<Db> => {

  const config = useRuntimeConfig();


  const client = new MongoClient(config.database.url);
  await client.connect();


  return client.db(config.database.name);

});

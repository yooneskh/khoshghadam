import { Db, MongoClient } from 'mongodb';


let databasePromise: Promise<Db> | null = null;


export function loadDbClient() {

  if (!databasePromise) {

    databasePromise = (async () => {

      const config = useRuntimeConfig();


      const client = new MongoClient(config.database.url);
      await client.connect();


      return client.db(config.database.name);

    })();

    databasePromise.catch(() => {
      databasePromise = null;
    });

  }


  return databasePromise;

}

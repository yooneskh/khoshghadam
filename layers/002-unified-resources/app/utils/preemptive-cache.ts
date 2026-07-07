

const cache: Record<string, any> = {};
const promiseCache: Record<string, Promise<any>> = {};


export function preemptCache(args: { key: string; run: () => Promise<any>; }) {

  if (args.key in cache) {
    return cache[args.key];
  }

  if (args.key in promiseCache) {
    return promiseCache[args.key];
  }


  const promise = new Promise(async (resolve, reject) => {
    try {

      const result = await args.run();


      cache[args.key] = result;


      resolve(result);

    }
    catch (error) {
      reject(error);
    }
    finally {
      delete promiseCache[args.key];
    }
  });


  promiseCache[args.key] = promise;

  return promise;

}

export function evictCache(args: { key: string }) {
  delete cache[args.key];
  delete promiseCache[args.key];
}

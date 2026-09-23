import { MongoServerError, type Collection, type IndexDescriptionInfo } from 'mongodb';
import type { UnifiedResourceIndex } from './create-unified-resource-controller';


export async function ensureCollectionIndexes(args: {
  collectionName: string;
  indexes: UnifiedResourceIndex[];
}) {

  validateDesiredIndexes(args.collectionName, args.indexes);


  const collection = await loadDbClient().then(it => it.collection(args.collectionName));
  const existingIndexes = await listCollectionIndexes(collection);


  const desiredIndexes = args.indexes.filter(it => !isIdIndex(it));
  const remainingExistingIndexes = existingIndexes.filter(it => !isIdIndex(it));
  const indexesToCreate: UnifiedResourceIndex[] = [];

  for (const desiredIndex of desiredIndexes) {

    const matchIndex = remainingExistingIndexes.findIndex(it => doesExistingMatchDesired(it, desiredIndex));


    if (matchIndex === -1) {
      indexesToCreate.push(desiredIndex);
    }
    else {
      remainingExistingIndexes.splice(matchIndex, 1);
    }

  }


  for (const existingIndex of remainingExistingIndexes) {

    if (!existingIndex.name) {
      throw new Error(`resource "${args.collectionName}" has an existing index without a name`);
    }


    await collection.dropIndex(existingIndex.name);

  }


  if (indexesToCreate.length) {
    await collection.createIndexes(indexesToCreate);
  }

}

function validateDesiredIndexes(collectionName: string, indexes: UnifiedResourceIndex[]) {

  const seenKeys = new Set<string>();
  const seenNames = new Set<string>();


  for (const index of indexes) {

    if (!index?.key || typeof index.key !== 'object') {
      throw new Error(`resource "${collectionName}" index is missing a key`);
    }

    if (isIdIndex(index)) {
      continue;
    }


    const keySignature = serializeIndexKey(index.key);


    if (seenKeys.has(keySignature)) {
      throw new Error(`resource "${collectionName}" index key is duplicated: ${keySignature}`);
    }


    seenKeys.add(keySignature);


    if (!index.name) {
      continue;
    }

    if (seenNames.has(index.name)) {
      throw new Error(`resource "${collectionName}" index name is duplicated: ${index.name}`);
    }


    seenNames.add(index.name);

  }

}

function isIdIndex(index: UnifiedResourceIndex | IndexDescriptionInfo) {
  if (index.name === '_id_') {
    return true;
  }
  else {
    const keys = Object.keys(resolveIndexKey(index.key));
    return keys.length === 1 && keys[0] === '_id';
  }
}

function doesExistingMatchDesired(existingIndex: IndexDescriptionInfo, desiredIndex: UnifiedResourceIndex) {
  if (serializeIndexKey(existingIndex.key) !== serializeIndexKey(desiredIndex.key)) {
    return false;
  }
  else if (serializeIndexOptions(existingIndex) !== serializeIndexOptions(desiredIndex)) {
    return false;
  }
  else if (desiredIndex.name && existingIndex.name !== desiredIndex.name) {
    return false;
  }
  else {
    return true;
  }
}

async function listCollectionIndexes(collection: Collection) {
  try {
    return await collection.indexes();
  }
  catch (error) {
    if (error instanceof MongoServerError && Number(error.code) === 26) {
      return [];
    }
    else {
      throw error;
    }
  }
}

function resolveIndexKey(key: UnifiedResourceIndex['key'] | IndexDescriptionInfo['key']) {
  return key ?? {};
}

function serializeIndexKey(key: UnifiedResourceIndex['key'] | IndexDescriptionInfo['key']) {
  return JSON.stringify(resolveIndexKey(key));
}

function serializeIndexOptions(index: UnifiedResourceIndex | IndexDescriptionInfo) {

  const extras = index as IndexDescriptionInfo;


  return JSON.stringify({
    unique: index.unique === true,
    sparse: index.sparse === true,
    hidden: index.hidden === true,
    expireAfterSeconds: index.expireAfterSeconds ?? null,
    partialFilterExpression: extras.partialFilterExpression ?? null,
    collation: extras.collation ?? null,
    wildcardProjection: extras.wildcardProjection ?? null,
    weights: extras.weights ?? null,
    default_language: extras.default_language ?? null,
    language_override: extras.language_override ?? null,
  });

}

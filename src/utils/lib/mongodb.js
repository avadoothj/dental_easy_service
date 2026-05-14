import { MongoClient } from "mongodb";

const uri = process.env.MONGO_URL;
const options = {
  maxPoolSize: 10,
  minPoolSize: 2,
};
const indexedQueueCollections = new Set();

let client;
let clientPromise;

let globalWithMongo = global;

if (!globalWithMongo._mongoClientPromise) {
  client = new MongoClient(uri, options);
  // Increase max listeners to prevent warning
  client.setMaxListeners(50);
  globalWithMongo._mongoClientPromise = client.connect();
}
clientPromise = globalWithMongo._mongoClientPromise;
export default clientPromise;

export async function getCollection(collectionName) {
  const client = await clientPromise;
  const db = client.db(process.env.MONGO_DATABASE_NAME);
  return db.collection(collectionName);
}

export async function getMainTenderCollection() {
  return getCollection(process.env.MONGO_COLLECTION_NAME);
}

export async function getAllCategoriesCollection() {
  return await getCollection(process.env.MONGO_COLLECTION_EMAIL);
}

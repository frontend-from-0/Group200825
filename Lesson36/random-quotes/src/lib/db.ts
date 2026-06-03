import { MongoClient, Db } from "mongodb";

const uri = process.env.MONGODB_URI;
const dbName = process.env.MONGODB_DB;

if (!uri) {
  throw new Error("Missing MONGODB_URI in .env.local");
}

if (!dbName) {
  throw new Error("Missing MONGODB_DB in .env.local");
}

const client = new MongoClient(uri);

export async function getDb(): Promise<Db> {
  await client.connect();
  return client.db(dbName);
}

export enum Collections {
  quotes = 'quotes',
  users = 'users'
}
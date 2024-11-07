import { MongoClient, Collection } from "mongodb";

export async function initDb(
  db: string,
  collection: string
): Promise<Collection> {
  const URI = process.env.MONGOURI;

  if (!URI) throw new Error("No URI found");
  try {
    const client = new MongoClient(URI);
    const connection = await client.connect();
    const data = connection.db(db).collection(collection);

    return data;
  } catch (error) {
    throw new Error(`failed to stablishc connection to the DB. \n ${error}`);
  }
}

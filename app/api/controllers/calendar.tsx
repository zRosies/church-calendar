import { ObjectId } from "mongodb";
import { initDb } from "../connect";

export async function getMonthData() {
  const collection = await initDb("calendar", "months");
  const data = collection.find({}).toArray();

  return data;
}

export interface Events {
  date: string;
  memberName: string;
  address: string;
  phone: string;
  notes: string;
}

export async function BookLunch(newEvent: Events) {
  const collection = await initDb("calendar", "months");

  const result = await collection.updateOne(
    { _id: new ObjectId("6727b7ef0ba079eef065cbd3") },
    {
      $push: {
        events: {
          ...newEvent,
        },
      },
    }
  );
  return result;
}

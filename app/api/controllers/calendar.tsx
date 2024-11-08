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
export async function UpdateBookedDate(newEvent: Events) {
  const collection = await initDb("calendar", "months");

  console.log(newEvent);
  try {
    const result = await collection.updateOne(
      { "events.date": newEvent.date },
      {
        $set: {
          "events.$": {
            ...newEvent,
          },
        },
      }
    );

    console.log(result);
    if (result.modifiedCount > 0) {
      return [
        { messsage: "Booked date deleted successfully" },
        { status: 200 },
      ];
    }
    return [
      { messsage: `No booked date found with this ID: ${newEvent.date}` },
      { status: 404 },
    ];
  } catch (error) {
    throw new Error(`Error deleting booked date: ${error}`);
  }
}
export async function DeleteBookedDate(dateId: string) {
  const collection = await initDb("calendar", "months");

  try {
    const result = await collection.updateOne(
      { "events.date": dateId },
      { $pull: { events: { date: dateId } } }
    );

    console.log(result);
    if (result.modifiedCount > 0) {
      return [
        { messsage: "Booked date deleted successfully" },
        { status: 200 },
      ];
    }
    return [
      { messsage: `No booked date found with this ID: ${dateId}` },
      { status: 404 },
    ];
  } catch (error) {
    throw new Error(`Error deleting booked date: ${error}`);
  }
}

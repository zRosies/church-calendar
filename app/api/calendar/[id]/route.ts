import { NextResponse } from "next/server";
import { DeleteBookedDate } from "../../controllers/calendar";

interface Context {
  params: {
    id: string;
  };
}

export async function DELETE(req: Request, context: Context) {
  const { id } = context.params;

  const result = await DeleteBookedDate(id);

  return NextResponse.json(result[0], result[1]);
}

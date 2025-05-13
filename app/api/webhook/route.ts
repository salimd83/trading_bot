import { NextResponse } from "next/server";
import { z } from "zod";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const hookSchema = z.object({
  timestamp: z.string(),
  trigger_price: z.string().or(z.number()),
  tv_exchange: z.string(),
  tv_instrument: z.string(),
  action: z.enum(["enter_long", "enter_short"]),
});

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const parsed = hookSchema.parse(body);

    const result = await prisma.tradeSignal.create({
      data: {
        timestamp: parsed.timestamp,
        triggerPrice: parsed.trigger_price.toString(),
        exchange: parsed.tv_exchange,
        instrument: parsed.tv_instrument,
        action: parsed.action,
      },
    });

    return NextResponse.json({ message: "Stored successfully", id: result.id });
  } catch (error) {
    console.error("❌ Error:", error);
    if (error instanceof z.ZodError) {
      return NextResponse.json({ message: "Validation failed", errors: error.errors }, { status: 400 });
    }
    return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
  }
}

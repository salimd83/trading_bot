// pages/api/submit.ts
import type { NextApiRequest, NextApiResponse } from "next";
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

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    res.setHeader("Allow", ["POST"]);
    return res.status(405).json({ message: "Method Not Allowed" });
  }

  try {
    const parsed = hookSchema.parse(req.body);

    const result = await prisma.tradeSignal.create({
      data: {
        timestamp: parsed.timestamp,
        triggerPrice: parsed.trigger_price.toString(),
        exchange: parsed.tv_exchange,
        instrument: parsed.tv_instrument,
        action: parsed.action,
      },
    });

    return res.status(200).json({ message: "Stored successfully", id: result.id });
  } catch (error) {
    console.error("❌ Error:", error);
    if (error instanceof z.ZodError) {
      return res.status(400).json({ message: "Validation failed", errors: error.errors });
    }
    return res.status(500).json({ message: "Internal Server Error" });
  }
}

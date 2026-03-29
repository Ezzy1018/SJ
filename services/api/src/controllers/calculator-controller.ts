import { Request, Response } from "express";
import { z } from "zod";
import { calculateGoldValue } from "../services/calculator-service";

const schema = z.object({
  karat: z.union([z.literal(18), z.literal(22), z.literal(24)]),
  weight: z.number().positive(),
  city: z.enum([
    "jaipur",
    "delhi",
    "mumbai",
    "bangalore",
    "hyderabad",
    "pune",
    "kolkata",
    "chennai",
  ]),
});

export const calculateValueHandler = (req: Request, res: Response): void => {
  const parsed = schema.safeParse(req.body);
  if (!parsed.success) {
    res
      .status(400)
      .json({ error: "Invalid body", details: parsed.error.flatten() });
    return;
  }

  res.json(calculateGoldValue(parsed.data));
};

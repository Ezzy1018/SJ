import { Request, Response } from "express";
import { z } from "zod";
import { City, Karat } from "@sj/contracts";
import { getCurrentPrices, getPriceHistory } from "../services/price-service";

const citySchema = z.enum([
  "jaipur",
  "delhi",
  "mumbai",
  "bangalore",
  "hyderabad",
  "pune",
  "kolkata",
  "chennai",
]);

const periodSchema = z.enum(["1d", "1w", "1m", "3m", "1y"]);

const karatSchema = z.enum(["18", "22", "24"]);

export const getCurrentPricesHandler = (req: Request, res: Response): void => {
  const querySchema = z.object({
    city: citySchema.default("jaipur"),
    karat: z.string().optional().default("22,24"),
  });

  const parsed = querySchema.safeParse(req.query);
  if (!parsed.success) {
    res
      .status(400)
      .json({ error: "Invalid query", details: parsed.error.flatten() });
    return;
  }

  const city = parsed.data.city as City;
  const rawKarats = parsed.data.karat.split(",").map((value) => value.trim());

  const invalid = rawKarats.filter(
    (value) => !karatSchema.safeParse(value).success,
  );
  if (invalid.length > 0) {
    res.status(400).json({
      error: "Invalid karat query value",
      allowed: [18, 22, 24],
      invalid,
    });
    return;
  }

  const karats = rawKarats.map((value) => Number(value) as Karat);

  const result = getCurrentPrices(city, karats);
  res.json(result);
};

export const getPriceHistoryHandler = (req: Request, res: Response): void => {
  const querySchema = z.object({
    city: citySchema.default("jaipur"),
    karat: karatSchema.default("22"),
    period: periodSchema.default("1d"),
  });

  const parsed = querySchema.safeParse(req.query);
  if (!parsed.success) {
    res
      .status(400)
      .json({ error: "Invalid query", details: parsed.error.flatten() });
    return;
  }

  const result = getPriceHistory(
    parsed.data.city as City,
    Number(parsed.data.karat) as Karat,
    parsed.data.period,
  );

  res.json(result);
};

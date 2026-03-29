import {
  City,
  CurrentPriceResponse,
  HistoryPoint,
  Karat,
  PriceHistoryResponse,
  PriceSnapshot,
} from "@sj/contracts";
import { getBasePrice } from "../models/store";
import { roundToNearestFive, toPercent } from "../utils/rounding";

interface CachedPrice {
  price: number;
  updatedAt: number;
}

const lastValidPrices = new Map<string, CachedPrice>();

const saneRangeByKarat: Record<Karat, { min: number; max: number }> = {
  18: { min: 3500, max: 9000 },
  22: { min: 5000, max: 12000 },
  24: { min: 5000, max: 14000 },
};

const periodPointCount: Record<string, number> = {
  "1d": 24,
  "1w": 7,
  "1m": 30,
  "3m": 90,
  "1y": 365,
};

const periodIntervalMs: Record<string, number> = {
  "1d": 30 * 60 * 1000,
  "1w": 24 * 60 * 60 * 1000,
  "1m": 24 * 60 * 60 * 1000,
  "3m": 24 * 60 * 60 * 1000,
  "1y": 24 * 60 * 60 * 1000,
};

const marketStatus = (): "open" | "closed" => {
  const hour = new Date().getHours();
  return hour >= 9 && hour <= 18 ? "open" : "closed";
};

const mockVariance = (seed: number, i: number): number => {
  const value = Math.sin((seed + i) / 3.2) * 0.012;
  return Number(value.toFixed(4));
};

const cacheKey = (city: City, karat: Karat): string => `${city}:${karat}`;

const getValidatedPrice = (
  city: City,
  karat: Karat,
  candidatePrice: number,
  source: "IBJA" | "MCX",
): {
  price: number;
  source: "IBJA" | "MCX" | "CACHED";
  stale: boolean;
  lastUpdatedAt: string;
  staleMinutes: number;
} => {
  const range = saneRangeByKarat[karat];
  const now = Date.now();
  const key = cacheKey(city, karat);

  if (candidatePrice >= range.min && candidatePrice <= range.max) {
    lastValidPrices.set(key, {
      price: candidatePrice,
      updatedAt: now,
    });

    return {
      price: candidatePrice,
      source,
      stale: false,
      lastUpdatedAt: new Date(now).toISOString(),
      staleMinutes: 0,
    };
  }

  const cached = lastValidPrices.get(key);
  if (cached) {
    const staleMinutes = Math.floor((now - cached.updatedAt) / 60000);
    return {
      price: cached.price,
      source: "CACHED",
      stale: true,
      lastUpdatedAt: new Date(cached.updatedAt).toISOString(),
      staleMinutes,
    };
  }

  const fallback = getBasePrice(city, karat);
  return {
    price: fallback,
    source: "CACHED",
    stale: true,
    lastUpdatedAt: new Date(now).toISOString(),
    staleMinutes: 31,
  };
};

export const getCurrentPrices = (
  city: City,
  karats: Karat[],
): CurrentPriceResponse => {
  const nowIso = new Date().toISOString();
  const prices: Record<string, PriceSnapshot> = {};
  let maxStaleMinutes = 0;

  karats.forEach((karat) => {
    const base = getBasePrice(city, karat);
    const drift = base * mockVariance(karat, new Date().getUTCMinutes());
    const current = roundToNearestFive(base + drift);
    const validated = getValidatedPrice(city, karat, current, "IBJA");
    const yesterday = roundToNearestFive(base - base * 0.007);
    const change = validated.price - yesterday;
    maxStaleMinutes = Math.max(maxStaleMinutes, validated.staleMinutes);

    prices[`${karat}K`] = {
      city,
      karat,
      pricePer10g: validated.price,
      change,
      changePercent: toPercent(change, yesterday),
      timestamp: nowIso,
      lastUpdatedAt: validated.lastUpdatedAt,
      source: validated.source,
      marketStatus: marketStatus(),
      stale: validated.stale,
    };
  });

  const twentyTwoPrice = prices["22K"]?.pricePer10g ?? getBasePrice(city, 22);
  return {
    prices,
    stats: {
      high: roundToNearestFive(twentyTwoPrice * 1.02),
      low: roundToNearestFive(twentyTwoPrice * 0.98),
      yesterdayClose: roundToNearestFive(twentyTwoPrice * 0.993),
      weekAverage: roundToNearestFive(twentyTwoPrice * 0.988),
      monthAverage: roundToNearestFive(twentyTwoPrice * 0.975),
    },
    delay: {
      isDelayed: maxStaleMinutes >= 30,
      staleMinutes: maxStaleMinutes,
      message: maxStaleMinutes >= 30 ? "Price data may be delayed." : null,
    },
  };
};

export const getPriceHistory = (
  city: City,
  karat: Karat,
  period: "1d" | "1w" | "1m" | "3m" | "1y",
): PriceHistoryResponse => {
  const points = periodPointCount[period];
  const interval = periodIntervalMs[period];
  const base = getBasePrice(city, karat);
  const now = Date.now();

  const data: HistoryPoint[] = Array.from({ length: points }).map((_, i) => {
    const index = points - i;
    const variance = mockVariance(karat * 11, index);
    const price = roundToNearestFive(base + base * variance);
    return {
      timestamp: new Date(now - index * interval).toISOString(),
      price,
    };
  });

  const prices = data.map((p) => p.price);
  return {
    data,
    high: Math.max(...prices),
    low: Math.min(...prices),
    period,
  };
};

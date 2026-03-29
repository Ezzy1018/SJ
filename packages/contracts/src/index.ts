export type City =
  | "jaipur"
  | "delhi"
  | "mumbai"
  | "bangalore"
  | "hyderabad"
  | "pune"
  | "kolkata"
  | "chennai";

export type Karat = 22 | 24 | 18;

export interface PriceSnapshot {
  city: City;
  karat: Karat;
  pricePer10g: number;
  change: number;
  changePercent: number;
  timestamp: string;
  lastUpdatedAt: string;
  source: "IBJA" | "MCX" | "CACHED";
  marketStatus: "open" | "closed";
  stale: boolean;
}

export interface CurrentPriceResponse {
  prices: Record<string, PriceSnapshot>;
  stats: {
    high: number;
    low: number;
    yesterdayClose: number;
    weekAverage: number;
    monthAverage: number;
  };
  delay: {
    isDelayed: boolean;
    staleMinutes: number;
    message: string | null;
  };
}

export interface HistoryPoint {
  timestamp: string;
  price: number;
}

export interface PriceHistoryResponse {
  data: HistoryPoint[];
  high: number;
  low: number;
  period: "1d" | "1w" | "1m" | "3m" | "1y";
}

export interface CreateAlertRequest {
  userId: string;
  type: "below" | "above" | "specific";
  price: number;
  karat: Karat;
  city: City;
  frequency: "daily" | "triggered" | "weekly";
}

export interface AlertRecord extends CreateAlertRequest {
  id: string;
  status: "active" | "triggered" | "disabled";
  createdAt: string;
  triggeredAt?: string;
}

export interface CalculatorRequest {
  karat: Karat;
  weight: number;
  city: City;
}

export interface CalculatorResponse {
  value: number;
  rate: number;
  purityMultiplier: number;
  breakdown: {
    goldValue: number;
    disclaimer: string;
  };
}

export interface RegisterRequest {
  phone: string;
  name: string;
}

export interface VerifyOtpRequest {
  userId: string;
  otp: string;
}

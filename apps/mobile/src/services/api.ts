const API_BASE_URL = "http://localhost:4000/api";

export interface CurrentPricesResponse {
  prices: Record<
    string,
    {
      city: string;
      karat: number;
      pricePer10g: number;
      change: number;
      changePercent: number;
      timestamp: string;
      lastUpdatedAt: string;
      source: string;
      marketStatus: string;
      stale: boolean;
    }
  >;
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

export const fetchCurrentPrices = async (
  city: string,
): Promise<CurrentPricesResponse> => {
  const response = await fetch(
    `${API_BASE_URL}/prices/current?city=${city}&karat=22,24`,
  );

  if (!response.ok) {
    throw new Error("Failed to fetch current prices");
  }

  return response.json();
};

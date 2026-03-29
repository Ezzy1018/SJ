import { CalculatorRequest, CalculatorResponse, Karat } from "@sj/contracts";
import { getBasePrice } from "../models/store";

const purityMap: Record<Karat, number> = {
  24: 1,
  22: 0.916,
  18: 0.75,
};

export const calculateGoldValue = (
  payload: CalculatorRequest,
): CalculatorResponse => {
  const rate = getBasePrice(payload.city, payload.karat);
  const purityMultiplier = purityMap[payload.karat];
  const value = Number(((payload.weight / 10) * rate).toFixed(2));

  return {
    value,
    rate,
    purityMultiplier,
    breakdown: {
      goldValue: value,
      disclaimer: "Excludes making charges, taxes, wastage",
    },
  };
};

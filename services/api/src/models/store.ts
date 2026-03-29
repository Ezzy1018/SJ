import { AlertRecord, City, Karat } from "@sj/contracts";

interface PriceSeed {
  [city: string]: {
    [karat: number]: number;
  };
}

const basePrices: PriceSeed = {
  jaipur: { 22: 7450, 24: 8120, 18: 6100 },
  delhi: { 22: 7480, 24: 8150, 18: 6140 },
  mumbai: { 22: 7510, 24: 8190, 18: 6170 },
  bangalore: { 22: 7470, 24: 8130, 18: 6120 },
  hyderabad: { 22: 7460, 24: 8125, 18: 6110 },
  pune: { 22: 7475, 24: 8135, 18: 6128 },
  kolkata: { 22: 7495, 24: 8165, 18: 6155 },
  chennai: { 22: 7500, 24: 8170, 18: 6160 },
};

export const priceStore = {
  basePrices,
};

export const alertStore: AlertRecord[] = [];

export const getBasePrice = (city: City, karat: Karat): number => {
  return priceStore.basePrices[city][karat];
};

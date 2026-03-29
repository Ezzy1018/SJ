export const roundToNearestFive = (value: number): number => {
  return Math.round(value / 5) * 5;
};

export const toPercent = (value: number, baseline: number): number => {
  if (baseline === 0) {
    return 0;
  }
  return Number(((value / baseline) * 100).toFixed(2));
};

export function formatSE(value: number): string {
  if (value < 1000) return value.toFixed(1);
  if (value < 1e6) return (value / 1e3).toFixed(2) + 'K';
  if (value < 1e9) return (value / 1e6).toFixed(2) + 'M';
  if (value < 1e12) return (value / 1e9).toFixed(2) + 'B';
  if (value < 1e15) return (value / 1e12).toFixed(2) + 'T';
  return value.toExponential(2);
}

export function calcHelperCost(baseCost: number, count: number): number {
  return Math.floor(baseCost * Math.pow(1.15, count));
}

export function calcCurseStones(totalSE: number): number {
  return Math.floor(Math.sqrt(totalSE / 1_000_000));
}

export function calcMilestoneBonus(count: number, architectCount: number = 0): number {
  // Abyss Architect (Tier 8): Fills development bar twice as fast
  const multiplier = architectCount > 0 ? 2 : 1;
  const milestones = Math.floor((count * multiplier) / 10);
  return Math.pow(1.15, milestones);
}

export function calcDarkCrystals(curseStones: number): number {
  if (curseStones < 1000) return 0;
  return Math.floor(Math.sqrt(curseStones / 1000));
}

export function calcDissolutionSparks(darkCrystals: number): number {
  if (darkCrystals < 100) return 0;
  return Math.floor(Math.sqrt(darkCrystals / 100));
}

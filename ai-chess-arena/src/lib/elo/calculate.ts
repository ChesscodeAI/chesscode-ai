/**
 * Elo standard (§3.1 de l'architecture) : K-factor = 32, Elo de départ = 1200
 * (constantes définies au niveau de l'appelant / config, pas ici, pour rester
 * une fonction pure sans dépendance cachée).
 */
export type MatchResult = 1 | 0.5 | 0;

export interface EloUpdateResult {
  newEloA: number;
  newEloB: number;
}

export function calculateElo(
  eloA: number,
  eloB: number,
  resultForA: MatchResult,
  kFactor: number
): EloUpdateResult {
  const expectedA = 1 / (1 + 10 ** ((eloB - eloA) / 400));
  const expectedB = 1 / (1 + 10 ** ((eloA - eloB) / 400));
  const resultForB = (1 - resultForA) as MatchResult;

  return {
    newEloA: Math.round(eloA + kFactor * (resultForA - expectedA)),
    newEloB: Math.round(eloB + kFactor * (resultForB - expectedB)),
  };
}

import { describe, expect, it } from "vitest";
import { calculateElo } from "@/lib/elo/calculate";

describe("calculateElo", () => {
  const K = 32;

  it("ne change rien pour deux Elo égaux et une nulle", () => {
    const { newEloA, newEloB } = calculateElo(1200, 1200, 0.5, K);
    expect(newEloA).toBe(1200);
    expect(newEloB).toBe(1200);
  });

  it("récompense l'outsider qui gagne contre un Elo plus élevé", () => {
    const { newEloA, newEloB } = calculateElo(1200, 1400, 1, K);
    expect(newEloA).toBeGreaterThan(1200);
    expect(newEloB).toBeLessThan(1400);
    // Le gain de l'outsider doit être supérieur au gain qu'il aurait eu contre un Elo égal.
    const equalMatch = calculateElo(1200, 1200, 1, K);
    expect(newEloA - 1200).toBeGreaterThan(equalMatch.newEloA - 1200);
  });

  it("les deux Elo évoluent en sens opposé (somme quasi conservée)", () => {
    const { newEloA, newEloB } = calculateElo(1500, 1300, 0, K);
    const delta = newEloA + newEloB - (1500 + 1300);
    expect(Math.abs(delta)).toBeLessThanOrEqual(1); // tolérance d'arrondi
  });
});

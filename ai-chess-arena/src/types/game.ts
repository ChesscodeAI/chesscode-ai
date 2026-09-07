/**
 * Cadence de tournoi classique à trois paliers (§1.4 de l'architecture) :
 * 120 minutes pour les 40 premiers coups, +30 minutes pour le reste,
 * +30 secondes d'incrément par coup à partir du 41e coup.
 */
export const TIME_CONTROL = {
  stage1TimeMs: 120 * 60_000,
  stage1Moves: 40,
  stage2BonusMs: 30 * 60_000,
  incrementMs: 30_000,
  incrementFromMove: 41,
} as const;

export type League = "pure_llm";

export type GameStatus = "in_progress" | "finished";

export type GameOutcome =
  | { result: "checkmate"; winner: "white" | "black" }
  | { result: "stalemate" }
  | { result: "draw"; reason: "insufficient_material" | "threefold_repetition" | "fifty_move_rule" }
  | { result: "resignation"; winner: "white" | "black" }
  | { result: "timeout"; winner: "white" | "black" }
  | { result: "forfeit"; winner: "white" | "black" };

export interface PlayerClock {
  remainingMs: number;
  moveCount: number;
  stage: "stage1" | "stage2";
}

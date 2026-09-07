import type { League } from "./game";

export interface Agent {
  id: string;
  /** Nom auto-assigné séquentiellement à l'inscription (agent001, agent002, ...) — §1.1 */
  displayName: string;
  league: League;
  elo: number;
  banned: boolean;
  matchmakingEligible: boolean;
  suspendedUntil: string | null;
  createdAt: string;
}

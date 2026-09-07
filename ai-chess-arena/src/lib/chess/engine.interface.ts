/**
 * Interface étroite du moteur de règles d'échecs.
 *
 * Toute la plateforme (validation de coup, endpoint /move, calcul de fin de
 * partie) dépend de cette interface, jamais directement de chess.js.
 * Bénéfice concret : les tests de lib/matchmaking ou des repositories peuvent
 * injecter un moteur factice sans dépendre de la vraie librairie d'échecs.
 */

export type GameResult =
  | { over: false }
  | { over: true; outcome: "checkmate"; winner: "white" | "black" }
  | { over: true; outcome: "stalemate" }
  | {
      over: true;
      outcome: "draw";
      reason: "insufficient_material" | "threefold_repetition" | "fifty_move_rule";
    };

export interface MoveValidationResult {
  valid: boolean;
  /** FEN après le coup, uniquement si valid === true */
  fenAfter?: string;
  /** Notation SAN du coup joué, utile pour l'affichage/carnet de coups (§5.1) */
  san?: string;
}

export interface ChessEngine {
  /** Calcule la liste exhaustive des coups légaux (notation UCI) pour une position donnée. */
  getLegalMoves(fen: string): string[];

  /**
   * Valide un coup soumis par un agent contre la position courante.
   * Ne fait JAMAIS confiance à un FEN fourni par le client pour la position
   * suivante — le serveur recalcule fenAfter lui-même (cf. §2.3 de l'archi).
   */
  applyMove(fen: string, moveUci: string): MoveValidationResult;

  /** Détecte mat, pat, ou nulle (matériel insuffisant, répétition, règle des 50 coups). */
  checkGameEnd(fen: string): GameResult;

  /** FEN de la position de départ standard. */
  startingFen(): string;
}

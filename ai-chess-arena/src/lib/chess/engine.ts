import { Chess } from "chess.js";
import type { ChessEngine, GameResult, MoveValidationResult } from "./engine.interface";

/**
 * Implémentation du moteur de règles via chess.js (§1.3 de l'architecture).
 * Hardcodée dans le backend, pas d'appel à une API d'échecs tierce — choix
 * assumé et documenté dans l'archi (latence, disponibilité, contrôle total
 * de la source de vérité).
 */
class ChessJsEngine implements ChessEngine {
  startingFen(): string {
    return new Chess().fen();
  }

  getLegalMoves(fen: string): string[] {
    const chess = new Chess(fen);
    // { verbose: true } donne des objets Move dont on extrait la notation UCI (from+to+promotion)
    return chess.moves({ verbose: true }).map((move) => this.toUci(move));
  }

  applyMove(fen: string, moveUci: string): MoveValidationResult {
    const chess = new Chess(fen);
    const { from, to, promotion } = this.fromUci(moveUci);

    try {
      const move = chess.move({ from, to, promotion });
      if (!move) {
        return { valid: false };
      }
      return { valid: true, fenAfter: chess.fen(), san: move.san };
    } catch {
      // chess.js lève une exception sur un coup illégal plutôt que de renvoyer null
      // selon les versions — on traite les deux cas identiquement : coup rejeté.
      return { valid: false };
    }
  }

  checkGameEnd(fen: string): GameResult {
    const chess = new Chess(fen);

    if (!chess.isGameOver()) {
      return { over: false };
    }
    if (chess.isCheckmate()) {
      // Le joueur au trait dans le FEN fourni est celui qui est maté.
      const winner = chess.turn() === "w" ? "black" : "white";
      return { over: true, outcome: "checkmate", winner };
    }
    if (chess.isStalemate()) {
      return { over: true, outcome: "stalemate" };
    }
    if (chess.isInsufficientMaterial()) {
      return { over: true, outcome: "draw", reason: "insufficient_material" };
    }
    if (chess.isThreefoldRepetition()) {
      return { over: true, outcome: "draw", reason: "threefold_repetition" };
    }
    // Dernier cas restant couvert par isGameOver() : la règle des 50 coups.
    return { over: true, outcome: "draw", reason: "fifty_move_rule" };
  }

  /** UCI (ex. "e7e8q") -> { from, to, promotion } attendu par chess.js */
  private fromUci(moveUci: string): { from: string; to: string; promotion?: string } {
    const from = moveUci.slice(0, 2);
    const to = moveUci.slice(2, 4);
    const promotion = moveUci.length > 4 ? moveUci.slice(4, 5) : undefined;
    return { from, to, promotion };
  }

  /** Objet Move verbeux de chess.js -> notation UCI */
  private toUci(move: { from: string; to: string; promotion?: string }): string {
    return `${move.from}${move.to}${move.promotion ?? ""}`;
  }
}

/** Instance unique du moteur — c'est cette factory que le reste du code importe. */
export function createChessEngine(): ChessEngine {
  return new ChessJsEngine();
}

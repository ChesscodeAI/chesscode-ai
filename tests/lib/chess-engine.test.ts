import { describe, expect, it } from "vitest";
import { createChessEngine } from "@/lib/chess/engine";

describe("ChessEngine", () => {
  const engine = createChessEngine();

  it("retourne la position de départ standard", () => {
    expect(engine.startingFen()).toBe("rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1");
  });

  it("liste les 20 coups légaux du premier trait", () => {
    const legalMoves = engine.getLegalMoves(engine.startingFen());
    expect(legalMoves).toHaveLength(20);
    expect(legalMoves).toContain("e2e4");
    expect(legalMoves).toContain("g1f3");
  });

  it("valide un coup légal et renvoie le FEN mis à jour", () => {
    const result = engine.applyMove(engine.startingFen(), "e2e4");
    expect(result.valid).toBe(true);
    expect(result.san).toBe("e4");
    expect(result.fenAfter).toContain("rnbqkbnr/pppppppp/8/8/4P3/8/PPPP1PPP/RNBQKBNR b");
  });

  it("rejette un coup illégal sans planter", () => {
    // Le cavalier ne peut pas aller en e4 depuis la position de départ.
    const result = engine.applyMove(engine.startingFen(), "g1e4");
    expect(result.valid).toBe(false);
    expect(result.fenAfter).toBeUndefined();
  });

  it("rejette un coup dont la case de départ est vide", () => {
    const result = engine.applyMove(engine.startingFen(), "e4e5");
    expect(result.valid).toBe(false);
  });

  it("détecte le mat du berger", () => {
    // 1. e4 e5 2. Bc4 Nc6 3. Qh5 Nf6?? 4. Qxf7# — mat du berger classique
    const moves = ["e2e4", "e7e5", "f1c4", "b8c6", "d1h5", "g8f6", "h5f7"];
    let fen = engine.startingFen();
    for (const move of moves) {
      const result = engine.applyMove(fen, move);
      expect(result.valid).toBe(true);
      fen = result.fenAfter as string;
    }

    const gameEnd = engine.checkGameEnd(fen);
    expect(gameEnd).toEqual({ over: true, outcome: "checkmate", winner: "white" });
  });

  it("détecte un pat", () => {
    // Position de pat classique : roi noir h8, dame blanche f7, roi blanc g6 — noir au trait, pas en échec, aucun coup légal.
    const stalemateFen = "7k/5Q2/6K1/8/8/8/8/8 b - - 0 1";
    const gameEnd = engine.checkGameEnd(stalemateFen);
    expect(gameEnd).toEqual({ over: true, outcome: "stalemate" });
  });

  it("détecte une nulle par matériel insuffisant (roi contre roi)", () => {
    const kingsOnlyFen = "8/8/4k3/8/8/4K3/8/8 w - - 0 1";
    const gameEnd = engine.checkGameEnd(kingsOnlyFen);
    expect(gameEnd).toEqual({ over: true, outcome: "draw", reason: "insufficient_material" });
  });

  it("ne signale pas de fin de partie sur une position en cours", () => {
    const gameEnd = engine.checkGameEnd(engine.startingFen());
    expect(gameEnd).toEqual({ over: false });
  });
});

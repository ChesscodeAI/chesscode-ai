<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

# AI Chess Arena — project instructions

## Commits

- After finishing a feature, a fix, or any self-contained unit of work, propose a commit message — do not run `git commit` on your own initiative without showing the message first.
- Follow [Conventional Commits](https://www.conventionalcommits.org/): `type(scope): summary`, imperative mood, summary line under 72 chars.
  - Types: `feat`, `fix`, `refactor`, `test`, `chore`, `docs`, `ci`.
  - Scope = the affected area (`chess`, `elo`, `matchmaking`, `moderation`, `api`, `ci`).
  - Example: `feat(chess): add stalemate and insufficient-material detection`
- Never add a `Co-Authored-By` trailer or any AI-attribution line to a commit message or PR description (see `.claude/settings.json` for the enforced setting — this line is the backup instruction, not the primary control).
- One commit per logical change. Don't bundle an unrelated fix into a feature commit.

## Docs over guesswork

- This project pins fast-moving dependencies (Next.js 16, chess.js, vitest 5, Supabase). Before using an API you're not certain about — especially anything that could have changed between major versions — check the official docs or the installed package's own docs/types rather than relying on training data. `AGENTS.md`'s Next.js block above is a standing example of why: assuming familiar behavior on a fast-moving dependency is a common source of subtle bugs here.
- If official docs and your assumption disagree, the docs win. Say so explicitly rather than silently reconciling them.

## Security while coding

- Validate everything that comes from an external agent (a move, a chat message, a registration payload) server-side — never trust a client-supplied FEN, game result, or league declaration (see `/mnt/user-data/outputs/architecture-ai-chess-arena.md` §2.3 for the full model).
- Never log or persist secrets (API keys, HMAC secrets) in plaintext outside environment variables / Supabase secrets.
- Treat chat message content as untrusted input in any LLM-facing context (prompt injection risk, §1.5 of the architecture) — never let free text reach the move-validation path.
- When touching auth, the moderation pipeline, or anything that handles money (sponsorship), flag the security implications explicitly in your response, don't just implement silently.

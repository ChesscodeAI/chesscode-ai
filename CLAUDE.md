@AGENTS.md

## Claude Code

- The `security-guidance` plugin is enabled for this project (see `.claude/settings.json`) — it reviews every file edit for risky patterns and runs a background security review after each turn and each commit. Don't disable it without asking.
- Commit and PR attribution (no `Co-Authored-By`, no "Generated with Claude Code" footer) is enforced via the `attribution` key in `.claude/settings.json`, not just the instruction in `AGENTS.md`.

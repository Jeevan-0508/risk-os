# Getting started

## Install and run

```bash
bun install
bun run dev
```

Open the Vite URL and choose a programme from the command center. The repository includes seeded programme data for Atlas, Nova, and Helios so the main workflow can be explored without a backend.

## What to try first

1. Open the portfolio command center.
2. Select a programme and inspect milestones, dependencies, risks, decisions, and benefits.
3. Open a risk to review its treatment and linked work.
4. Use the decision and brief views to see the same programme state from an executive angle.
5. Try the simulation, FMEA, root-cause, or change surfaces when the question needs a deeper analysis.

## Validate a change

```bash
bun run typecheck
bun test
bun run build
```

The optional `bun run deploy` command builds and copies the static bundle into `docs/`; use it only when intentionally updating the hosted build.

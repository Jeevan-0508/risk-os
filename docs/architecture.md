# Architecture

## Layering

```
screens/          presentation only — reads from `analytics`/`program`, renders, dispatches store actions
   │
state/            Zustand store + memoised analytics + persistence
   │
domain/engines/    pure, deterministic, unit-tested business logic
   │
domain/types.ts     strongly-typed domain model
```

The dependency direction only ever points downward. A screen may import an engine's *types* (e.g.
`RiskAssessment`) to type a prop, but the only place engine *functions* are called from is
`src/state/analytics.ts` (for anything shown on more than one screen) or a screen's own top-level
`useMemo` when the calculation is genuinely local to that view (e.g. `ProgramScreen`'s
`layoutNodes()`, which is view layout, not business logic, and correctly does not live in an
engine).

## State

`src/state/store.ts` — one flat Zustand store holding:

- `program: Program` — the currently loaded programme
- `analytics: Analytics` — memoised engine outputs, recomputed only when `program` changes
  (`src/state/analytics.ts`)
- `source: 'demo' | 'imported' | 'created' | 'edited'` — shown in the top bar and Settings so it's
  always clear whether you're looking at the shipped demo or your own data
- `savedAt`, `persistenceAvailable` — localStorage status
- `notices` — the toast queue (`notify()` / `dismissNotice()`)

Actions (`loadDemo`, `importJson`, `createBlank`, `replaceProgram`, `resetToDemo`, `decideChange`,
…) are the only way `program` changes. Every action re-derives `analytics` and persists to
`localStorage` in the same step, so the store can never be left in a state where the UI and the saved
copy disagree.

## Engines

Twelve modules in `src/domain/engines/`, one export surface each, no shared mutable state, no
imports from `state/` or `screens/` (engines never know the UI exists). Each has a co-located
`*.test.ts`. This is what "deterministic and testable" means concretely: call the exported function
with a fixture, assert on the returned object — no mocking, no async, no setup beyond building the
input record.

| Engine | Owns |
|---|---|
| `riskEngine` | inherent→residual exposure, velocity, trend, priority ranking, burndown |
| `controlEngine` | control effectiveness, independent-barrier combination |
| `scheduleEngine` | milestone/action assessment |
| `dependencyEngine` | critical chain, cascade, plain-language impact narrative |
| `changeEngine` | change impact axes, decision quality |
| `benefitEngine` | realisation %, value at risk, pacing |
| `fmeaEngine` | RPN, bands, before/after |
| `dmaicEngine` | Pareto, sigma level, gate readiness |
| `healthEngine` | weighted RAG with attributed drivers — composes all of the above |
| `simulationEngine` | Beta-PERT Monte Carlo |
| `graphEngine` | digital-twin node/edge build, causal chain trace |
| `kpiEngine` | Command Center KPI explanations |

`healthEngine` is the composition root: it calls `riskEngine`, `scheduleEngine`,
`dependencyEngine`, `changeEngine`, `benefitEngine` and returns one `ProgramHealth` object that
every other screen reads from rather than re-deriving.

## UI layer

`src/ui/` holds every shared primitive used across screens: `DataTable` (search/sort/filter/column
visibility), `SlideOver` (focus-trapped detail panel), `Panel`, `Stat`, `Meter`, `RagBadge`,
`ScreenHeader`, `CommandPalette`, `NoticeHost`, plus chart theming (`chart.tsx`) and icon resolution
(`icons.tsx`). No screen defines its own version of a table, a badge, or a stat card — this is what
keeps 13 screens visually and behaviourally consistent without a shared "template" screen to copy
from.

## Routing

`src/nav.ts` defines the 13 routes as data (`ROUTES: RouteMeta[]`), consumed by `Sidebar`,
`CommandPalette`, and `App.tsx`'s route table. Adding a 14th screen means adding one `RouteMeta`
entry and one `ELEMENTS` map entry — the sidebar, command palette and keyboard navigation pick it up
automatically because none of them hardcode the route list.

## Why no backend

Local-first with JSON import/export was a hard requirement, not a fallback: it means the tool works
offline, has no auth surface to build or defend, and puts the user in unambiguous control of their
own data. The persistence layer (`src/state/persistence.ts`) is deliberately the only place that
knows about `localStorage`, so if a future version needed a real backend, that module — and nothing
else in the 13 screens or 12 engines — is what would change.

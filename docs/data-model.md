# Data model

Full type definitions: `src/domain/types.ts` (single source of truth — this document explains the
relationships, not a duplicate schema that can drift out of sync with the code).

## Entity relationship chain

```
Program
 ├─ Workstream[]                 (owner, status, % complete)
 │   └─ Milestone[]              (baseline/forecast date, predecessorIds, isGate)
 │       └─ Deliverable[]        (% complete, owner)
 ├─ Dependency[]                 upstream/downstream, predecessorIds, affectedMilestoneIds
 ├─ Risk[]                       causeIds, controlIds, affectedMilestoneIds, affectedBenefitIds
 │   └─ history: ExposureSample[]  (dated probability/impact/financialExposure snapshots)
 ├─ Cause[]                      category, frequency, isRootCause, linked risk/issue ids
 ├─ Control[]                    type, effectiveness, evidence, nextTest
 ├─ Action[]                     ownerId, dueDate, status, linked risk/issue/fmea id
 ├─ Issue[]                      originRiskId, causeIds, actionIds, affectedMilestoneIds
 ├─ Assumption[]                 status: unvalidated | validated | invalidated
 ├─ ChangeRequest[]               six impact axes, decision, decision maker
 ├─ Decision[]                   optionsConsidered, rationale, evidence, expectedOutcome/actualOutcome
 ├─ Benefit[]                    expectedValue, realisedValue, enablingMilestoneIds
 ├─ FMEAItem[]                   process, S/O/D, post-S/O/D
 ├─ DmaicProject[]               define/measure/analyze/improve/control phases
 └─ Metric[]                     supporting KPI history
```

## Relationships are by id, never by duplication

Every cross-reference (`affectedMilestoneIds`, `controlIds`, `causeIds`, `enablingMilestoneIds`, …)
is an array of string ids resolved at read time by an engine (e.g. `assessRisk` resolves
`risk.controlIds` against `program.controls`). No entity stores a denormalised copy of another
entity's fields. This means:

- Editing a control's effectiveness automatically changes every risk that references it, the health
  score, the KPI drawer, and the digital twin, with nothing to keep in sync by hand.
- The digital twin (`graphEngine.ts`) can build its node/edge list purely by walking these id arrays;
  it does not need a separate "graph" data structure maintained alongside the domain model.

## Defensive validation

`src/domain/validate.ts` is the single point every import (and the demo dataset itself, in tests)
passes through. It never throws on malformed input — it collects a list of specific problems
(missing id reference, invalid ISO date, non-numeric field, empty required array) and returns them
alongside whatever could be salvaged, so a bad JSON import produces a readable error message instead
of a blank screen or a crash.

## Why strong typing end-to-end

Every domain type is a TypeScript interface, and every engine function's input and output is typed
against those interfaces. This is what makes "every screen reads a typed field, never a business
number computed inline" enforceable — a screen that tried to compute, say, a residual exposure
directly from `risk.inherentFinancialImpact` without going through `assessRisk` would still
typecheck, but code review (and the deliberate absence of raw arithmetic outside `domain/engines/`)
is what keeps that rule real. The bigger win is refactor safety: renaming or restructuring a field in
`types.ts` immediately surfaces every call site across all 13 screens and 12 engines via the
compiler, rather than silently breaking a screen that happened not to be tested.

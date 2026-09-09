# Simulation methodology (Monte Carlo)

Source of truth: `src/domain/engines/simulationEngine.ts`. Read the top-of-file comment in that
module first — it is the same caveat repeated here, because it is the single most important thing to
understand about this feature: **this is not a prediction.**

## What is actually being modelled

Each schedule/cost task (one per incomplete milestone, by default, via `deriveTasks()`, or a custom
task list) carries a three-point estimate: optimistic, most likely, pessimistic. Each simulation
iteration samples every task's duration and cost independently from a **Beta-PERT** distribution
built from that three-point estimate, then sums across the modelled task sequence.

```
alpha = 1 + (lambda x (mode - min)) / (max - min)      lambda = 4 (standard PERT weighting)
beta  = 1 + (lambda x (max - mode)) / (max - min)
sample = min + unit x (max - min)      where unit = Gamma(alpha) / (Gamma(alpha) + Gamma(beta))
```

Gamma variates are drawn with the Marsaglia-Tsang method (Johnk boost for shape < 1), normal
variates via Box-Muller — both standard, textbook samplers, run against the module's own seeded RNG
so results are reproducible.

## Risk events

If `includeRiskEvents` is on, every risk linked to a task is treated as an independent Bernoulli
trial at its **residual** probability (not inherent — the simulation reflects the programme as
controlled today, not as if no mitigation existed). If it "fires" in that iteration, its full
inherent schedule and cost impact is added to that task's sampled duration/cost, once per risk per
iteration.

## Outputs

- **Percentiles** (`percentileSorted`) at whatever confidence levels are configured — the app shows
  P10/P50/P80/P90/P95 by default.
- **Histogram**: 24 bins, built by index rather than by comparing floats against a recomputed edge —
  binning by `floor((value - lo) / width)` avoids losing the topmost sample to floating-point
  rounding at the boundary.
- **Contingency at P80**: `P80 - deterministic`, i.e. how much schedule/cost buffer the simulation
  implies over a naive most-likely-only plan.
- **Risk fire rates**: the observed share of iterations each risk fired in, reported next to its
  configured residual probability — a sanity check on the sampler, and a way to see which risks
  actually mattered in the run versus which never fired.
- **Schedule drivers**: tasks ranked by their share of total simulated duration across all
  iterations — which milestones are actually consuming the schedule risk, not just which have the
  biggest single pessimistic estimate.

## The assumption list (always shown, never hidden)

`SIMULATION_ASSUMPTIONS` is a fixed, human-readable list surfaced next to every simulation result:

1. **Distribution** — each task is sampled from a Beta-PERT built from its three-point estimate.
2. **Independence** — task samples are drawn independently; real programmes have correlated delays,
   so the modelled spread is narrower than reality.
3. **Summation** — durations sum along the modelled sequence; there is no resource levelling and no
   parallel-path merge-bias correction.
4. **Risk events** — each linked risk fires as a Bernoulli trial at its residual probability, adding
   its full impact if it fires.
5. **Determinism** — the generator is seeded; the same seed and iteration count always reproduce the
   same result.
6. **Not a forecast** — a P80 of 240 days means 80% of *sampled outcomes given these inputs* finished
   within 240 days. It is a statement about the model, not a promise about the programme.

## Why this matters for how the numbers are worded

`explainPercentile()` is the one function that turns a percentile into a sentence, and every call
site uses it verbatim rather than composing its own wording — this is a deliberate guardrail against
a UI drifting toward forecast-sounding language over time. The sentence always states the percentile
level, the value, the delta against the deterministic plan, and ends with the same disclaimer:
*"This describes the estimate ranges that were entered, not a forecast of what will happen."*

## Defensive behaviour

- Iteration counts are clamped to 100–50,000, with a warning if the requested count was out of
  range, rather than silently running an unbounded or degenerate simulation.
- Tasks with non-numeric estimates are skipped with a named warning, not silently dropped.
- Out-of-order estimates (optimistic > most likely, etc.) are sorted before sampling, with a warning,
  rather than producing a negative or inverted PERT shape.
- If no usable tasks are supplied at all, the simulation returns a clearly empty distribution rather
  than throwing.

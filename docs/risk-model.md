# Risk model

Source of truth: `src/domain/engines/riskEngine.ts` and `src/domain/engines/controlEngine.ts`. This
document explains the formulas in prose; the code is the executable version of the same rules and
carries the same comments inline.

## Inherent assessment

Each risk is entered with an **inherent** probability (0–1) and impact (1–5, Likert), as if no
control existed:

```
inherentScore              = probabilityBand(probability) x impact         (5x5 matrix, 1-25)
inherentFinancialExposure  = inherentFinancialImpact x inherentProbability
inherentScheduleExposureDays = inherentScheduleImpactDays x inherentProbability
```

Probability is banded into five conventional labels for the matrix (Rare ≤10%, Unlikely ≤30%,
Possible ≤50%, Likely ≤75%, Almost certain >75%) — the matrix score is kept deliberately separate
from the financial exposure figure, because a 5×5 score is a ranking heuristic and a euro figure is
a real number; conflating them (e.g. "risk score = €120,000") would misrepresent both.

## Control effect

Controls linked to a risk are combined as **independent barriers**:

```
combined effectiveness = 1 − Π(1 − effectiveness_i)
```

not summed — summing would let three 40%-effective controls "remove" 120% of a risk, which is not
meaningable. The combined effect is capped at 95%: no control set is modelled as perfect. Controls
are also split by mechanism:

- **Preventive / directive** controls reduce **probability** (they stop the event happening).
- **Detective / corrective** controls reduce **consequence** (they don't stop the event, they limit
  what it costs once it happens).

These are tracked and combined separately (`probabilityReduction`, `impactReduction`), not folded
into one number, because a risk with only detective controls is a genuinely different risk profile
from one with only preventive controls even at the same headline "% effective."

## Control effectiveness (per control)

```
effectiveness = design x operating x statusWeight x confidenceWeight x staleness
```

- `design`, `operating` (0–1): design intent vs. how it actually runs in practice.
- `statusWeight`: `active`=1, `degraded`=0.6, `failed`/`planned`/`retired`=0.
- `confidenceWeight`: evidence discount — `anecdotal`=0.55, `indicative`=0.75, `measured`=0.9,
  `verified`=1. A control claimed 90% effective on anecdotal evidence is not worth the same as one
  verified by test, so the claimed number is discounted before it ever reaches a risk calculation.
- `staleness`: an overdue assurance test progressively erodes assurance, capped at a 30% haircut
  (floor 0.7) once the test is 180+ days overdue.

## Residual assessment

```
residualProbability = inherentProbability x (1 − probabilityReduction)
residualImpactMoney = inherentFinancialImpact x (1 − impactReduction)
residualFinancialExposure = residualProbability x residualImpactMoney
exposureReduced = inherentFinancialExposure − residualFinancialExposure
reductionPct = exposureReduced / inherentFinancialExposure
```

**Worked example**, matching the number quoted in the README: a risk with 100% inherent probability
and €1.0M inherent financial impact, covered by controls combining to 80% effectiveness split evenly
across probability and impact reduction, produces a residual financial exposure of roughly €200K —
an 80% reduction, both figures shown side by side in the UI.

## Severity band

```
red    if residualScore >= 15
amber  if residualScore >= 8
green  otherwise
```

## Risk velocity and trend

Velocity is not a manually-set flag — it's computed from the risk's own dated exposure history
(`risk.history: ExposureSample[]`):

```
change = (latestExposure − baselineExposure) / baselineExposure     (baseline = earliest sample within a 28-day window)
velocity = (change / spanDays) x 14        (normalised to a 14-day / fortnightly rate)
```

Trend classification from that velocity:

| velocity | trend |
|---|---|
| ≥ 0.15 (per fortnight) | **accelerating** |
| > 0.03 | **deteriorating** |
| ≤ −0.05 | **improving** |
| otherwise | **stagnant** |
| fewer than 2–3 history samples within 14 days of raising | **new** |

## Priority index (0–100, used for ranking)

```
exposureTerm = clamp(log10(1 + residualFinancialExposure) / 7, 0, 1)     (soft log scale so one
                                                                            huge risk doesn't flatten
                                                                            the ranking of everything else)
scoreTerm    = residualScore / 25
velocityTerm = clamp(0.5 + velocity, 0, 1.5) / 1.5
priorityIndex = (exposureTerm x 0.4 + scoreTerm x 0.4 + velocityTerm x 0.2) x horizonWeight x 100
```

`horizonWeight` up-weights risks with a nearer time horizon (`immediate`=1.15, `near`=1.05,
`mid`=0.95, `far`=0.85): two risks with identical exposure and score are not equally urgent if one
could land next week and the other next year.

## Criticality flag

A risk is `isCritical` if it is not closed **and** (residual severity is red, **or** it is
accelerating with a residual score ≥12, **or** its priority index ≥70). This is deliberately an OR
of three different failure modes — a risk can be critical because it's simply bad, or because it's
getting worse fast even if not yet "bad," or because the composite ranking says so even if no single
threshold trips on its own.

## Risk burndown

`computeBurndown()` replays each risk's own exposure history against a series of month-end cutoffs,
reconstructing what the register would have looked like assessed *as of* that date — not
reconstructing a separate stored snapshot. The resulting chart plots open/critical/accepted/closed
counts **and** residual/inherent exposure together, because the point of a burndown is falling
*exposure*, not a falling *count*: a register can shrink in row count while the money at stake grows,
and this chart is built specifically to make that visible rather than hide it behind a headcount
metric.

# Programme health model

Source of truth: `src/domain/engines/healthEngine.ts`. This is the composition root of the whole
application — it calls every other engine and produces the one `ProgramHealth` object every screen
ultimately reads from.

## Dimensions and weights

```
risk        24%
schedule    22%
dependency  16%
cost        15%
benefit     14%
scope        9%
```

Risk and schedule dominate the weighting because, per the product philosophy, they are the two axes
a programme manager can still act on day to day — cost and scope are largely lagging indicators of
decisions already made, and benefit realisation is downstream of all of the others.

## Every dimension score is 100 minus attributed penalties

```
score = clamp(100 + sum(driver.contribution), 0, 100)      each contribution is <= 0
```

Each dimension has 4–5 named drivers. Every driver uses the same `penalty(badness, maxPoints)` shape:

```
penalty(badness, maxPoints) = -clamp(badness, 0, 1) x maxPoints
```

`badness` is a ratio of "how bad is this, out of the level that alone would justify losing the whole
maxPoints budget." The anchors (the denominator in each ratio) are stated per-driver below so a
reader can disagree with a specific number rather than the whole score.

### Risk (max penalty points per driver)

| Driver | Anchor ("fully bad" = losing all points) | Max points |
|---|---|---|
| Residual exposure vs. budget | Residual exposure = 100% of budget | 40 |
| Critical risks | 12 critical risks | 22 |
| Accelerating risks | 6 accelerating risks | 16 |
| Control effectiveness | 0% average control effectiveness | 14 |
| Uncontrolled exposure | All residual exposure sits on uncontrolled risks | 10 |

### Schedule

| Driver | Anchor | Max points |
|---|---|---|
| Milestones at risk | 60% of all milestones at risk | 34 |
| Overdue milestones | 25% of all milestones overdue | 24 |
| Worst slip | 60-day single slip | 18 |
| Gates at risk | 6 stage gates at risk | 14 |
| Overdue actions | 25% of all actions overdue | 10 |

### Cost

| Driver | Anchor | Max points |
|---|---|---|
| Forecast vs. budget | 15% forecast overrun | 40 |
| Burn rate vs. elapsed time | 15 percentage-point gap between % budget consumed and % time elapsed | 24 |
| Approved change cost | Approved changes = 8% of budget | 20 |
| Financial risk exposure | Residual exposure = 35% of budget | 16 |

### Scope

| Driver | Anchor | Max points |
|---|---|---|
| Change volume | 3x workstream count (min 6) changes with scope impact | 30 |
| Undecided changes | 8 pending + escalated changes | 26 |
| Invalidated assumptions | 5 invalidated assumptions | 24 |
| Unvalidated assumptions | 100% of assumptions still unvalidated | 16 |

### Dependency

| Driver | Anchor | Max points |
|---|---|---|
| Late dependencies | 20% of open dependencies already late | 34 |
| At-risk dependencies | 50% of open dependencies flagged at risk | 26 |
| Critical chain slip | 90 probability-weighted days on the critical chain | 22 |
| External exposure | 95% of dependencies sit outside programme control | 18 |

### Benefit

| Driver | Anchor | Max points |
|---|---|---|
| Value at risk | 60% of expected benefit exposed | 34 |
| Realisation pace | 60-percentage-point gap between % time elapsed and % benefit realised | 28 |
| Low-confidence benefits | 60% of benefits assessed low confidence | 22 |
| Lost benefits | 2 benefits written off | 16 |

## Overall status: a single red dimension caps green

```
overallScore = sum(dimension.score x weight)
overallStatus = ragFromScore(overallScore)      (green >= 75, amber >= 55, red otherwise)
if overallStatus == 'green' and any dimension is red: overallStatus = 'amber'
if 2 or more dimensions are red: overallStatus = 'red'
```

This override exists because a weighted average can mathematically stay "green" while one dimension
is genuinely broken, if the other five are strong enough to average it out. A programme is never
shown green while a real problem exists on one axis — that is exactly the failure mode of a naive
weighted-average health score, and it's the reason this override is a hard rule rather than a
tunable weight.

## Every dimension carries its own drivers and headline

`DimensionHealth.drivers: HealthDriver[]` and `.headline` are populated at calculation time, in the
same function that computes the score — so the KPI drawer, the Command Center dimension cards, and
the Executive Brief's health panel all read the *same* driver list rather than three independently
maintained descriptions that could disagree with each other or with the number itself.

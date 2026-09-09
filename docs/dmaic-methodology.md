# DMAIC and root-cause methodology

Source of truth: `src/domain/engines/dmaicEngine.ts`.

## Root cause: 5 Whys and Fishbone

Causes (`Cause` records) are real, addressable entities — not free text — carrying a `category`
(one of the seven conventional Ishikawa buckets: People, Process, Technology, Policy, Environment,
Measurement, Management), a `frequency`, and an `isRootCause` flag. `groupFishbone()` buckets every
cause by category and reports each bucket's total frequency and root-cause count, which is what
drives the Fishbone diagram in the Root Cause screen. A 5-Whys chain is modelled as causes linked to
other causes (each "why" is one more Cause record pointing at the one before it), so the chain is
inspectable and connectable to a risk or issue at any link, not just at the end.

## Pareto (the "vital few")

```
share_i = frequency_i / sum(frequency)
cumulative_i = running sum of share
isVitalFew = true while cumulative <= 80%, including the slice that crosses 80%
```

Causes are sorted by frequency descending before the cumulative sum runs, so `isVitalFew` correctly
identifies the smallest leading set of causes that together account for 80% of observed frequency —
the classic Pareto "vital few" cut, applied to the *cumulative* share so the boundary slice that
pushes the total past 80% is included rather than excluded.

## Process sigma

```
dpmo = defectRate x 1,000,000
yield = 1 - defectRate
sigmaLevel = normalQuantile(yield) + 1.5      (long-term sigma with the conventional 1.5-sigma
                                                short-term process shift)
```

`normalQuantile()` is the inverse standard normal CDF via Acklam's rational approximation (accurate
to ~1e-9), rather than a lookup table — this keeps the sigma level continuous and exact for any
defect rate the data produces, instead of snapping to the nearest tabulated value.

## Improvement projection

```
combinedRemaining = Π(1 - effect_i)     for implemented countermeasures (full weight)
                    x Π(1 - effect_i/2)  for piloting countermeasures (half weight)
expectedImprovementPct = 1 - combinedRemaining      (capped at 95%)
projected = baseline x (1 - expectedImprovementPct)
projectedSavings = costOfPoorQuality x expectedImprovementPct
```

Countermeasures are combined multiplicatively for the same reason controls are in the risk engine —
summing percentage improvements would let enough small countermeasures "over-fix" a defect rate below
zero. Piloted countermeasures count at half their claimed effect, because a pilot has not yet
demonstrated it holds at full scale.

## Gate readiness (Define → Measure → Analyze → Improve → Control)

Each gate's readiness is computed from the phase's actual recorded prerequisites, not a manually
ticked checkbox:

| Gate | Ready when |
|---|---|
| Define | Problem statement is substantive (>20 chars) and at least one CTQ is defined |
| Measure | Baseline > 0 and at least 3 periods of trend data are recorded |
| Analyze | At least one linked cause is validated as root cause **and** at least one FMEA line is linked |
| Improve | At least one countermeasure has status `implemented` |
| Control | A control metric is named **and** at least one standing control is linked |

The Control gate's check exists specifically to catch the common DMAIC failure mode: an improvement
that was never handed off to a standing control tends to regress once the project team moves on — if
no control is linked, the gate reports "improvement will not hold," in those words, rather than a
generic "not ready."

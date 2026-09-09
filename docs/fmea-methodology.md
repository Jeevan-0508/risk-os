# FMEA methodology

Source of truth: `src/domain/engines/fmeaEngine.ts`.

## RPN

Standard Failure Mode and Effects Analysis scoring:

```
RPN = Severity (1-5) x Occurrence (1-5) x Detection (1-5)
```

Detection is scored so that **5 means hard to detect** (worst) and **1 means easily detected**
(best) — consistent with AIAG-VDA convention, so a high RPN always means "this needs attention" in
every one of the three factors, not just two of them.

## Why there is no single RPN cut-off

A flat "RPN ≥ 100 is critical" rule is exactly the guidance AIAG-VDA's 2019 handbook update warns
against, because it lets a severity-5 (safety/programme-catastrophic), low-occurrence failure mode
hide below the threshold. RISK//OS treats severity as an **independent escalation trigger**:

```
band = 'critical'  if severity >= 5 AND rpn >= 40
band = 'critical'  if rpn >= 80
band = 'high'      if rpn >= 40
band = 'moderate'  if rpn >= 20
band = 'low'       otherwise
```

A Severity-5 failure mode with a middling RPN of 45 is flagged critical, where a flat-RPN model would
have called it merely "high."

## Criticality (S x O)

Reported alongside RPN as `criticality = severity x occurrence` — the AIAG-VDA S×O pair, deliberately
excluding detection. This surfaces failure modes that are severe and frequent even when strong
detection is currently holding the RPN down, which leads into:

## Detection-dependent flag

```
detectionDependent = detection <= 2 AND criticality >= 12
```

A failure mode flagged detection-dependent is one whose acceptable RPN exists *only* because
detection is strong — if the detection mechanism itself fails (a test gets skipped, an alarm gets
silenced), the exposure jumps straight back to its full severity × occurrence level. This is called
out explicitly in the item's driver text rather than left implicit in three separate numbers.

## Before/after (residual RPN)

Every item carries a post-countermeasure S/O/D triple, and the residual RPN is computed with the
same formula:

```
residualRpn = postSeverity x postOccurrence x postDetection
rpnReduction = max(0, rpn - residualRpn)
rpnReductionPct = rpnReduction / rpn
```

A countermeasure that lowers **severity** (changes the effect, not just how often it happens or how
well it's caught) is flagged separately in the drivers, because a severity reduction is structurally
a stronger intervention than an occurrence or detection improvement — it changes what happens if the
failure occurs at all, not just how likely or how visible it is.

## Action requirement

```
actionRequired = band is 'critical' or 'high', OR severity >= 5
```

Again an OR of independent triggers, for the same reason as the risk engine's criticality flag: a
severity-5 item requires action even if its current RPN band looks moderate.

## Portfolio view

The FMEA Studio ranks items worst-first by RPN then severity, groups by process (`byProcess`) so a
process with many moderate failure modes can be seen to carry more total RPN than one process with a
single severe one, and tracks `severity5Count` and `detectionDependentCount` as headline figures —
both of which are exactly the failure modes a flat RPN ranking would otherwise bury.

# Fraud Watch to Risk OS automation

Fraud Watch candidate exports can be converted automatically into Risk OS intake files:

```text
node scripts/import-fraud-watch-candidates.mjs <fraud-watch-export-dir> risk-intake-inbox
```

The bridge accepts only `candidate-mo.v1` with `data_class: synthetic_simulation` and `source.authenticity: unverified_export`. Every output is forced to `risk-intake.v1` with:

- lifecycle `hypothesis` and authority `synthetic`
- empty supporting and contradicting evidence arrays
- null likelihood, impact, owner, control effectiveness and confidence
- a SHA-256 hash of the complete candidate payload as hypothesis context

The generated files can be imported through the Risk OS Risk Intake screen. They cannot be promoted into a scored `Risk[]` record. An operator must provide a separate, source-bound real-world observation and complete assessment; synthetic candidates remain hypotheses forever.

Schedule the command in the local or CI environment that owns the Fraud Watch export directory. A repository token, authenticated service, and deployment policy are still required before this becomes a hosted cross-repository job.

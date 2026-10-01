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

Risk OS includes `.github/workflows/fraud-watch-intake.yml`, which checks out the public
`Jeevan-0508/fraud-watch` `main` ref every six hours, runs this importer, and commits only new
hypothesis files into `risk-intake-inbox`. The source ref and repository are workflow environment
values so an operator can pin them to a reviewed fork or release. If Fraud Watch is private, the
workflow must be given a repository-read token by the repository owner; credentials and hosted
deployment are not inferred by this code. The workflow never calls the promotion API and cannot
create a scored risk from these exports.

# Security and data boundaries

RISK//OS is a browser-first programme-risk tool. The current repository contains seeded TypeScript data and a client-side state store; it does not implement a hosted API, authentication, or multi-user permission model.

## Local persistence

State persistence is handled in `src/state/persistence.ts`. Treat a browser profile as the data boundary. A real organisational deployment would need access control, encryption, retention, backup, audit logging, and change governance.

## Imported risk intake

The risk-intake domain validates structured records before turning them into a risk. The tests reject synthetic simulation claims, model-output claims, unknown fields, invalid revisions, and unsupported evidence relationships. Validation is a guardrail, not proof that the underlying source is true.

## Decision and benefit boundaries

The register can show decisions, residual risk, benefit impact, and dependencies. It does not independently verify financial values, programme outcomes, or the truth of an owner’s input.

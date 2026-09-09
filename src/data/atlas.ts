// GENERATED FILE. Do not edit by hand.
// Produced by tools/gen_satellite.py. Re-generate with:
//   python tools/gen_satellite.py
import type { Program } from '@/domain/types';

export const atlasProgram: Program = {
  "id": "prog-atlas",
  "name": "Enterprise Data Platform Modernization",
  "codename": "ATLAS",
  "description": "Replacement of eleven legacy on-premise data stores with a single cloud data platform, including a governed catalogue, unified access model and an API layer that ORION and other programmes integrate against.",
  "sponsor": "Nadia Kessler, Chief Data Officer",
  "programManager": "Marcus Lindqvist",
  "startDate": "2025-11-01",
  "endDate": "2026-12-15",
  "statusDate": "2026-09-09",
  "budget": 8000000,
  "spendToDate": 5050000,
  "forecastSpend": 8450000,
  "currency": "EUR",
  "businessUnit": "Enterprise Technology",
  "strategicPriority": "critical",
  "programStatus": "active",
  "createdAt": "2025-11-01",
  "updatedAt": "2026-09-09",
  "strategicObjectives": [
    "Retire eleven legacy on-premise data stores onto a single governed cloud platform",
    "Provide full lineage evidence for every regulated reporting feed",
    "Expose a stable API layer that downstream programmes, including ORION, can integrate against",
    "Bring cloud spend in line with the negotiated committed-use pricing model"
  ],
  "owners": [
    {
      "id": "own-a1",
      "name": "Nadia Kessler",
      "role": "Programme Director"
    },
    {
      "id": "own-a2",
      "name": "Marcus Lindqvist",
      "role": "Programme Manager"
    },
    {
      "id": "own-a3",
      "name": "Fatima Zohra",
      "role": "Data Platform Architect",
      "workstreamId": "ws-a-plat"
    },
    {
      "id": "own-a4",
      "name": "Owen Chukwu",
      "role": "Migration Lead",
      "workstreamId": "ws-a-mig"
    },
    {
      "id": "own-a5",
      "name": "Yuki Tanaka",
      "role": "Data Governance Lead",
      "workstreamId": "ws-a-gov"
    },
    {
      "id": "own-a6",
      "name": "Sara Lindberg",
      "role": "API Platform Lead",
      "workstreamId": "ws-a-api"
    },
    {
      "id": "own-a7",
      "name": "Ben Osei",
      "role": "Security and Compliance Lead"
    },
    {
      "id": "own-a8",
      "name": "Ines Duarte",
      "role": "Vendor Management Lead"
    }
  ],
  "workstreams": [
    {
      "id": "ws-a-plat",
      "name": "Cloud Data Platform Build",
      "code": "PLAT",
      "description": "Build of the new cloud data lake and warehouse to replace eleven legacy on-premise data stores.",
      "leadOwnerId": "own-a3",
      "startDate": "2025-11-01",
      "endDate": "2026-12-26",
      "budget": 3200000,
      "spendToDate": 2100000,
      "percentComplete": 68,
      "status": "in-progress"
    },
    {
      "id": "ws-a-mig",
      "name": "Legacy Migration and Backfill",
      "code": "MIG",
      "description": "Migration of source-system feeds and historical backfill onto the new platform.",
      "leadOwnerId": "own-a4",
      "startDate": "2025-12-01",
      "endDate": "2026-12-06",
      "budget": 2400000,
      "spendToDate": 1650000,
      "percentComplete": 60,
      "status": "in-progress"
    },
    {
      "id": "ws-a-gov",
      "name": "Data Governance and Quality",
      "code": "GOV",
      "description": "Lineage, cataloguing, access control and quality rules for the new platform.",
      "leadOwnerId": "own-a5",
      "startDate": "2025-11-01",
      "endDate": "2026-12-16",
      "budget": 900000,
      "spendToDate": 520000,
      "percentComplete": 55,
      "status": "in-progress"
    },
    {
      "id": "ws-a-api",
      "name": "API Platform and Integration",
      "code": "API",
      "description": "The API layer that exposes platform data to consuming programmes, including ORION's integration.",
      "leadOwnerId": "own-a6",
      "startDate": "2025-12-31",
      "endDate": "2026-12-21",
      "budget": 1500000,
      "spendToDate": 780000,
      "percentComplete": 48,
      "status": "in-progress"
    }
  ],
  "milestones": [
    {
      "id": "ms-a-01",
      "name": "Cloud landing zone live",
      "workstreamId": "ws-a-plat",
      "ownerId": "own-a3",
      "baselineDate": "2025-11-21",
      "forecastDate": "2025-11-21",
      "status": "complete",
      "isGate": true,
      "predecessorIds": [],
      "deliverableIds": [],
      "description": "Core cloud landing zone provisioned and accredited."
    },
    {
      "id": "ms-a-02",
      "name": "Warehouse schema v1 signed off",
      "workstreamId": "ws-a-plat",
      "ownerId": "own-a3",
      "baselineDate": "2026-01-20",
      "forecastDate": "2026-02-01",
      "status": "in-progress",
      "isGate": true,
      "predecessorIds": [
        "ms-a-01"
      ],
      "deliverableIds": [],
      "description": "Unified warehouse schema agreed with all consuming business units."
    },
    {
      "id": "ms-a-03",
      "name": "Finance feed migrated",
      "workstreamId": "ws-a-mig",
      "ownerId": "own-a4",
      "baselineDate": "2026-03-31",
      "forecastDate": "2026-04-28",
      "status": "in-progress",
      "isGate": false,
      "predecessorIds": [
        "ms-a-02"
      ],
      "deliverableIds": [],
      "description": "Finance source system feed cut over to the new platform."
    },
    {
      "id": "ms-a-04",
      "name": "Historical backfill complete",
      "workstreamId": "ws-a-mig",
      "ownerId": "own-a4",
      "baselineDate": "2026-06-09",
      "forecastDate": "2026-07-19",
      "status": "at-risk",
      "isGate": false,
      "predecessorIds": [
        "ms-a-03"
      ],
      "deliverableIds": [],
      "description": "Five years of historical data backfilled and reconciled."
    },
    {
      "id": "ms-a-05",
      "name": "Lineage and catalogue live",
      "workstreamId": "ws-a-gov",
      "ownerId": "own-a5",
      "baselineDate": "2026-03-01",
      "forecastDate": "2026-03-11",
      "status": "complete",
      "isGate": false,
      "predecessorIds": [],
      "deliverableIds": [],
      "description": "End-to-end lineage tracing available for every regulated feed."
    },
    {
      "id": "ms-a-06",
      "name": "Access control model accredited",
      "workstreamId": "ws-a-gov",
      "ownerId": "own-a5",
      "baselineDate": "2026-05-20",
      "forecastDate": "2026-06-04",
      "status": "in-progress",
      "isGate": true,
      "predecessorIds": [
        "ms-a-05"
      ],
      "deliverableIds": [],
      "description": "Role-based access model passes internal audit."
    },
    {
      "id": "ms-a-07",
      "name": "API Platform GA",
      "workstreamId": "ws-a-api",
      "ownerId": "own-a6",
      "baselineDate": "2026-07-19",
      "forecastDate": "2026-08-24",
      "status": "at-risk",
      "isGate": true,
      "predecessorIds": [
        "ms-a-02"
      ],
      "deliverableIds": [],
      "description": "General availability of the API layer, the fulcrum milestone that ORION's Integration workstream depends on."
    },
    {
      "id": "ms-a-08",
      "name": "ORION integration contract signed off",
      "workstreamId": "ws-a-api",
      "ownerId": "own-a6",
      "baselineDate": "2026-08-08",
      "forecastDate": "2026-09-02",
      "status": "in-progress",
      "isGate": false,
      "predecessorIds": [
        "ms-a-07"
      ],
      "deliverableIds": [],
      "description": "API contract for ORION's carrier integration formally accepted."
    },
    {
      "id": "ms-a-09",
      "name": "Legacy platform decommissioned",
      "workstreamId": "ws-a-mig",
      "ownerId": "own-a4",
      "baselineDate": "2026-11-16",
      "forecastDate": "2026-12-06",
      "status": "not-started",
      "isGate": true,
      "predecessorIds": [
        "ms-a-04"
      ],
      "deliverableIds": [],
      "description": "Final legacy data stores switched off."
    },
    {
      "id": "ms-a-10",
      "name": "Cost allocation live",
      "workstreamId": "ws-a-plat",
      "ownerId": "own-a3",
      "baselineDate": "2026-08-28",
      "forecastDate": "2026-09-07",
      "status": "in-progress",
      "isGate": false,
      "predecessorIds": [
        "ms-a-02"
      ],
      "deliverableIds": [],
      "description": "Chargeback tagging live for every consuming business unit."
    }
  ],
  "deliverables": [
    {
      "id": "dlv-a-01",
      "name": "Landing zone accreditation pack",
      "milestoneId": "ms-a-01",
      "ownerId": "own-a3",
      "dueDate": "2025-11-19",
      "status": "complete",
      "percentComplete": 100,
      "acceptanceCriteria": "Security accreditation signed by CISO."
    },
    {
      "id": "dlv-a-02",
      "name": "Warehouse schema document",
      "milestoneId": "ms-a-02",
      "ownerId": "own-a3",
      "dueDate": "2026-01-28",
      "status": "in-progress",
      "percentComplete": 80,
      "acceptanceCriteria": "Schema reviewed by all business unit data leads."
    },
    {
      "id": "dlv-a-03",
      "name": "Finance feed cutover runbook",
      "milestoneId": "ms-a-03",
      "ownerId": "own-a4",
      "dueDate": "2026-04-20",
      "status": "in-progress",
      "percentComplete": 65,
      "acceptanceCriteria": "Runbook tested in staging with production volumes."
    },
    {
      "id": "dlv-a-04",
      "name": "Backfill reconciliation report",
      "milestoneId": "ms-a-04",
      "ownerId": "own-a4",
      "dueDate": "2026-07-14",
      "status": "in-progress",
      "percentComplete": 40,
      "acceptanceCriteria": "Five-year reconciliation signed off by finance."
    },
    {
      "id": "dlv-a-05",
      "name": "Data catalogue",
      "milestoneId": "ms-a-05",
      "ownerId": "own-a5",
      "dueDate": "2026-03-09",
      "status": "complete",
      "percentComplete": 100,
      "acceptanceCriteria": "Catalogue live and searchable for every regulated feed."
    },
    {
      "id": "dlv-a-06",
      "name": "Access model audit evidence",
      "milestoneId": "ms-a-06",
      "ownerId": "own-a5",
      "dueDate": "2026-06-01",
      "status": "in-progress",
      "percentComplete": 70,
      "acceptanceCriteria": "Evidence pack accepted by internal audit."
    },
    {
      "id": "dlv-a-07",
      "name": "API platform OpenAPI spec",
      "milestoneId": "ms-a-07",
      "ownerId": "own-a6",
      "dueDate": "2026-08-18",
      "status": "in-progress",
      "percentComplete": 55,
      "acceptanceCriteria": "Spec published and versioned for consuming programmes."
    },
    {
      "id": "dlv-a-08",
      "name": "ORION integration contract",
      "milestoneId": "ms-a-08",
      "ownerId": "own-a6",
      "dueDate": "2026-08-28",
      "status": "in-progress",
      "percentComplete": 30,
      "acceptanceCriteria": "Contract signed by both ATLAS and ORION integration leads."
    }
  ],
  "risks": [
    {
      "id": "rsk-01",
      "ref": "ATL-01",
      "title": "Legacy finance source system export format is undocumented and inconsistent",
      "description": "Original vendor support lapsed years ago; the export format actually produced differs from the last known specification, and the migration cannot be tested reliably against it.",
      "category": "technology",
      "ownerId": "own-a4",
      "workstreamId": "ws-a-mig",
      "status": "escalated",
      "dateIdentified": "2026-05-10",
      "reviewDate": "2026-10-17",
      "strategy": "mitigate",
      "inherentProbability": 0.75,
      "inherentImpact": 4,
      "inherentFinancialImpact": 620000,
      "inherentScheduleImpactDays": 30,
      "strategicImpact": 4,
      "reputationImpact": 2,
      "timeHorizon": "immediate",
      "evidenceConfidence": "verified",
      "controlIds": [
        "ctl-a01"
      ],
      "causeIds": [
        "cse-a1"
      ],
      "actionIds": [
        "act-a01"
      ],
      "affectedMilestoneIds": [
        "ms-a-03"
      ],
      "affectedBenefitIds": [
        "ben-a01"
      ],
      "dependencyIds": [
        "dep-a01"
      ],
      "issueIds": [
        "iss-a01"
      ],
      "evidence": [],
      "comments": [],
      "tags": [
        "migration",
        "critical-path"
      ],
      "history": [
        {
          "date": "2026-05-10",
          "probability": 0.6,
          "impactScore": 3,
          "financialExposure": 400000
        },
        {
          "date": "2026-07-09",
          "probability": 0.75,
          "impactScore": 4,
          "financialExposure": 620000
        }
      ]
    },
    {
      "id": "rsk-03",
      "ref": "ATL-03",
      "title": "Cloud egress and compute cost model is materially under forecast",
      "description": "The original cost model used list price rather than negotiated volume pricing; actual spend has exceeded forecast for two consecutive months.",
      "category": "financial",
      "ownerId": "own-a8",
      "workstreamId": "ws-a-plat",
      "status": "monitoring",
      "dateIdentified": "2026-06-09",
      "reviewDate": "2026-10-07",
      "strategy": "mitigate",
      "inherentProbability": 0.6,
      "inherentImpact": 3,
      "inherentFinancialImpact": 420000,
      "inherentScheduleImpactDays": 0,
      "strategicImpact": 2,
      "reputationImpact": 1,
      "timeHorizon": "near",
      "evidenceConfidence": "measured",
      "controlIds": [
        "ctl-a02"
      ],
      "causeIds": [
        "cse-a2"
      ],
      "actionIds": [
        "act-a02"
      ],
      "affectedMilestoneIds": [
        "ms-a-10"
      ],
      "affectedBenefitIds": [],
      "dependencyIds": [
        "dep-a02"
      ],
      "issueIds": [
        "iss-a02"
      ],
      "evidence": [],
      "comments": [],
      "tags": [
        "cost"
      ],
      "history": [
        {
          "date": "2026-06-09",
          "probability": 0.5,
          "impactScore": 2,
          "financialExposure": 250000
        },
        {
          "date": "2026-08-08",
          "probability": 0.6,
          "impactScore": 3,
          "financialExposure": 420000
        }
      ]
    },
    {
      "id": "rsk-06",
      "ref": "ATL-06",
      "title": "Unmasked PII fields found in the new data lake zone",
      "description": "Masking rules were validated against a schema sample, not the full production schema; fields added later were never covered.",
      "category": "security",
      "ownerId": "own-a7",
      "workstreamId": "ws-a-gov",
      "status": "monitoring",
      "dateIdentified": "2026-07-17",
      "reviewDate": "2026-09-27",
      "strategy": "mitigate",
      "inherentProbability": 0.3,
      "inherentImpact": 5,
      "inherentFinancialImpact": 900000,
      "inherentScheduleImpactDays": 10,
      "strategicImpact": 4,
      "reputationImpact": 5,
      "timeHorizon": "immediate",
      "evidenceConfidence": "verified",
      "controlIds": [
        "ctl-a04"
      ],
      "causeIds": [
        "cse-a4"
      ],
      "actionIds": [
        "act-a04"
      ],
      "affectedMilestoneIds": [
        "ms-a-06"
      ],
      "affectedBenefitIds": [],
      "dependencyIds": [],
      "issueIds": [
        "iss-a03"
      ],
      "evidence": [],
      "comments": [],
      "tags": [
        "security",
        "compliance"
      ],
      "history": [
        {
          "date": "2026-07-17",
          "probability": 0.5,
          "impactScore": 5,
          "financialExposure": 1400000
        },
        {
          "date": "2026-07-29",
          "probability": 0.3,
          "impactScore": 5,
          "financialExposure": 900000
        }
      ]
    },
    {
      "id": "rsk-09",
      "ref": "ATL-09",
      "title": "Historical data backfill volume is four times the original estimate",
      "description": "The sizing model used average daily volume and ignored the Q4 archive retention peak, so storage and compute are under-provisioned for the real backfill.",
      "category": "operational",
      "ownerId": "own-a4",
      "workstreamId": "ws-a-mig",
      "status": "escalated",
      "dateIdentified": "2026-05-20",
      "reviewDate": "2026-10-12",
      "strategy": "mitigate",
      "inherentProbability": 0.85,
      "inherentImpact": 4,
      "inherentFinancialImpact": 540000,
      "inherentScheduleImpactDays": 40,
      "strategicImpact": 3,
      "reputationImpact": 1,
      "timeHorizon": "immediate",
      "evidenceConfidence": "verified",
      "controlIds": [
        "ctl-a06"
      ],
      "causeIds": [
        "cse-a6"
      ],
      "actionIds": [
        "act-a06"
      ],
      "affectedMilestoneIds": [
        "ms-a-04"
      ],
      "affectedBenefitIds": [
        "ben-a01"
      ],
      "dependencyIds": [],
      "issueIds": [],
      "evidence": [],
      "comments": [],
      "tags": [
        "capacity",
        "critical-path"
      ],
      "history": [
        {
          "date": "2026-05-20",
          "probability": 0.7,
          "impactScore": 3,
          "financialExposure": 350000
        },
        {
          "date": "2026-07-19",
          "probability": 0.85,
          "impactScore": 4,
          "financialExposure": 540000
        }
      ]
    },
    {
      "id": "rsk-15",
      "ref": "ATL-15",
      "title": "Meridian Cloud Systems cannot guarantee production-scale capacity for API Platform GA",
      "description": "The shared cloud platform vendor Meridian Cloud Systems has not confirmed a firm capacity guarantee ahead of the API Platform go-live; the same vendor constraint is separately threatening HELIOS's SOC tooling rollout.",
      "category": "vendor",
      "ownerId": "own-a8",
      "workstreamId": "ws-a-api",
      "status": "escalated",
      "dateIdentified": "2026-07-29",
      "reviewDate": "2026-10-22",
      "strategy": "mitigate",
      "inherentProbability": 0.7,
      "inherentImpact": 4,
      "inherentFinancialImpact": 780000,
      "inherentScheduleImpactDays": 25,
      "strategicImpact": 4,
      "reputationImpact": 2,
      "timeHorizon": "immediate",
      "evidenceConfidence": "verified",
      "controlIds": [],
      "causeIds": [],
      "actionIds": [],
      "affectedMilestoneIds": [
        "ms-a-07"
      ],
      "affectedBenefitIds": [
        "ben-a04"
      ],
      "dependencyIds": [
        "dep-a04"
      ],
      "issueIds": [],
      "evidence": [],
      "comments": [],
      "tags": [
        "vendor",
        "critical-path",
        "shared-vendor"
      ],
      "history": [
        {
          "date": "2026-07-29",
          "probability": 0.5,
          "impactScore": 3,
          "financialExposure": 450000
        },
        {
          "date": "2026-08-28",
          "probability": 0.7,
          "impactScore": 4,
          "financialExposure": 780000
        }
      ],
      "vendor": "Meridian Cloud Systems",
      "sharedRiskGroupId": "shared-meridian-capacity-01"
    },
    {
      "id": "rsk-02",
      "ref": "ATL-02",
      "title": "Legacy ETL pipeline migration exceeds the planned cutover window",
      "description": "Legacy ETL pipeline migration exceeds the planned cutover window.",
      "category": "technology",
      "ownerId": "own-a1",
      "workstreamId": "ws-a-plat",
      "status": "monitoring",
      "dateIdentified": "2025-11-21",
      "reviewDate": "2026-08-28",
      "strategy": "mitigate",
      "inherentProbability": 0.25,
      "inherentImpact": 2,
      "inherentFinancialImpact": 80000,
      "inherentScheduleImpactDays": 5,
      "strategicImpact": 2,
      "reputationImpact": 1,
      "timeHorizon": "immediate",
      "evidenceConfidence": "measured",
      "controlIds": [],
      "causeIds": [],
      "actionIds": [],
      "affectedMilestoneIds": [
        "ms-a-01"
      ],
      "affectedBenefitIds": [],
      "dependencyIds": [],
      "issueIds": [],
      "evidence": [],
      "comments": [],
      "tags": [
        "atlas",
        "vendor"
      ],
      "history": [
        {
          "date": "2025-12-01",
          "probability": 0.1,
          "impactScore": 1,
          "financialExposure": 56000
        },
        {
          "date": "2026-01-30",
          "probability": 0.25,
          "impactScore": 2,
          "financialExposure": 80000
        }
      ]
    },
    {
      "id": "rsk-04",
      "ref": "ATL-04",
      "title": "Data lineage cannot be proven for three regulated reporting feeds",
      "description": "Data lineage cannot be proven for three regulated reporting feeds.",
      "category": "data",
      "ownerId": "own-a2",
      "workstreamId": "ws-a-mig",
      "status": "open",
      "dateIdentified": "2025-11-25",
      "reviewDate": "2026-08-31",
      "strategy": "mitigate",
      "inherentProbability": 0.67,
      "inherentImpact": 3,
      "inherentFinancialImpact": 133000,
      "inherentScheduleImpactDays": 8,
      "strategicImpact": 3,
      "reputationImpact": 2,
      "timeHorizon": "near",
      "evidenceConfidence": "verified",
      "controlIds": [],
      "causeIds": [],
      "actionIds": [],
      "affectedMilestoneIds": [
        "ms-a-02"
      ],
      "affectedBenefitIds": [],
      "dependencyIds": [],
      "issueIds": [],
      "evidence": [],
      "comments": [],
      "tags": [
        "atlas",
        "data-quality"
      ],
      "history": [
        {
          "date": "2025-12-06",
          "probability": 0.52,
          "impactScore": 2,
          "financialExposure": 93100
        },
        {
          "date": "2026-02-04",
          "probability": 0.67,
          "impactScore": 3,
          "financialExposure": 133000
        }
      ]
    },
    {
      "id": "rsk-05",
      "ref": "ATL-05",
      "title": "Cloud egress cost model is materially wrong against actual volumes",
      "description": "Cloud egress cost model is materially wrong against actual volumes.",
      "category": "financial",
      "ownerId": "own-a3",
      "workstreamId": "ws-a-gov",
      "status": "open",
      "dateIdentified": "2025-11-29",
      "reviewDate": "2026-09-03",
      "strategy": "mitigate",
      "inherentProbability": 0.49,
      "inherentImpact": 4,
      "inherentFinancialImpact": 186000,
      "inherentScheduleImpactDays": 11,
      "strategicImpact": 4,
      "reputationImpact": 3,
      "timeHorizon": "near",
      "evidenceConfidence": "indicative",
      "controlIds": [],
      "causeIds": [],
      "actionIds": [],
      "affectedMilestoneIds": [
        "ms-a-03"
      ],
      "affectedBenefitIds": [],
      "dependencyIds": [],
      "issueIds": [],
      "evidence": [],
      "comments": [],
      "tags": [
        "atlas",
        "cost"
      ],
      "history": [
        {
          "date": "2025-12-11",
          "probability": 0.33999999999999997,
          "impactScore": 3,
          "financialExposure": 130199
        },
        {
          "date": "2026-02-09",
          "probability": 0.49,
          "impactScore": 4,
          "financialExposure": 186000
        }
      ]
    },
    {
      "id": "rsk-07",
      "ref": "ATL-07",
      "title": "Schema drift between source systems breaks the unified data model",
      "description": "Schema drift between source systems breaks the unified data model.",
      "category": "technology",
      "ownerId": "own-a4",
      "workstreamId": "ws-a-api",
      "status": "open",
      "dateIdentified": "2025-12-03",
      "reviewDate": "2026-09-06",
      "strategy": "transfer",
      "inherentProbability": 0.31,
      "inherentImpact": 5,
      "inherentFinancialImpact": 239000,
      "inherentScheduleImpactDays": 14,
      "strategicImpact": 2,
      "reputationImpact": 1,
      "timeHorizon": "mid",
      "evidenceConfidence": "anecdotal",
      "controlIds": [],
      "causeIds": [],
      "actionIds": [],
      "affectedMilestoneIds": [
        "ms-a-04"
      ],
      "affectedBenefitIds": [],
      "dependencyIds": [],
      "issueIds": [],
      "evidence": [],
      "comments": [],
      "tags": [
        "atlas",
        "technology"
      ],
      "history": [
        {
          "date": "2025-12-16",
          "probability": 0.16,
          "impactScore": 4,
          "financialExposure": 167300
        },
        {
          "date": "2026-02-14",
          "probability": 0.31,
          "impactScore": 5,
          "financialExposure": 239000
        }
      ]
    },
    {
      "id": "rsk-08",
      "ref": "ATL-08",
      "title": "Platform SRE team is understaffed against the go-live support model",
      "description": "Platform SRE team is understaffed against the go-live support model.",
      "category": "people",
      "ownerId": "own-a5",
      "workstreamId": "ws-a-plat",
      "status": "monitoring",
      "dateIdentified": "2025-12-07",
      "reviewDate": "2026-09-09",
      "strategy": "accept",
      "inherentProbability": 0.73,
      "inherentImpact": 2,
      "inherentFinancialImpact": 292000,
      "inherentScheduleImpactDays": 17,
      "strategicImpact": 3,
      "reputationImpact": 2,
      "timeHorizon": "far",
      "evidenceConfidence": "measured",
      "controlIds": [],
      "causeIds": [],
      "actionIds": [],
      "affectedMilestoneIds": [
        "ms-a-05"
      ],
      "affectedBenefitIds": [],
      "dependencyIds": [],
      "issueIds": [],
      "evidence": [],
      "comments": [],
      "tags": [
        "atlas",
        "people"
      ],
      "history": [
        {
          "date": "2025-12-21",
          "probability": 0.58,
          "impactScore": 1,
          "financialExposure": 204400
        },
        {
          "date": "2026-02-19",
          "probability": 0.73,
          "impactScore": 2,
          "financialExposure": 292000
        }
      ]
    },
    {
      "id": "rsk-10",
      "ref": "ATL-10",
      "title": "PII discovery sweep finds unmasked fields in the new lake zone",
      "description": "PII discovery sweep finds unmasked fields in the new lake zone.",
      "category": "security",
      "ownerId": "own-a6",
      "workstreamId": "ws-a-mig",
      "status": "open",
      "dateIdentified": "2025-12-11",
      "reviewDate": "2026-09-12",
      "strategy": "mitigate",
      "inherentProbability": 0.55,
      "inherentImpact": 3,
      "inherentFinancialImpact": 345000,
      "inherentScheduleImpactDays": 20,
      "strategicImpact": 4,
      "reputationImpact": 3,
      "timeHorizon": "immediate",
      "evidenceConfidence": "verified",
      "controlIds": [],
      "causeIds": [],
      "actionIds": [],
      "affectedMilestoneIds": [
        "ms-a-06"
      ],
      "affectedBenefitIds": [],
      "dependencyIds": [],
      "issueIds": [],
      "evidence": [],
      "comments": [],
      "tags": [
        "atlas",
        "security"
      ],
      "history": [
        {
          "date": "2025-12-26",
          "probability": 0.4,
          "impactScore": 2,
          "financialExposure": 241499
        },
        {
          "date": "2026-02-24",
          "probability": 0.55,
          "impactScore": 3,
          "financialExposure": 345000
        }
      ]
    },
    {
      "id": "rsk-11",
      "ref": "ATL-11",
      "title": "Batch-to-streaming rework for the finance feed slips past the freeze date",
      "description": "Batch-to-streaming rework for the finance feed slips past the freeze date.",
      "category": "delivery",
      "ownerId": "own-a7",
      "workstreamId": "ws-a-gov",
      "status": "open",
      "dateIdentified": "2025-12-15",
      "reviewDate": "2026-09-15",
      "strategy": "mitigate",
      "inherentProbability": 0.37,
      "inherentImpact": 4,
      "inherentFinancialImpact": 398000,
      "inherentScheduleImpactDays": 23,
      "strategicImpact": 2,
      "reputationImpact": 1,
      "timeHorizon": "near",
      "evidenceConfidence": "indicative",
      "controlIds": [],
      "causeIds": [],
      "actionIds": [],
      "affectedMilestoneIds": [
        "ms-a-07"
      ],
      "affectedBenefitIds": [],
      "dependencyIds": [],
      "issueIds": [],
      "evidence": [],
      "comments": [],
      "tags": [
        "atlas",
        "delivery"
      ],
      "history": [
        {
          "date": "2025-12-31",
          "probability": 0.22,
          "impactScore": 3,
          "financialExposure": 278600
        },
        {
          "date": "2026-03-01",
          "probability": 0.37,
          "impactScore": 4,
          "financialExposure": 398000
        }
      ]
    },
    {
      "id": "rsk-12",
      "ref": "ATL-12",
      "title": "Third-party data quality tool licence negotiation stalls procurement",
      "description": "Third-party data quality tool licence negotiation stalls procurement.",
      "category": "vendor",
      "ownerId": "own-a8",
      "workstreamId": "ws-a-api",
      "status": "open",
      "dateIdentified": "2025-12-19",
      "reviewDate": "2026-09-18",
      "strategy": "mitigate",
      "inherentProbability": 0.79,
      "inherentImpact": 5,
      "inherentFinancialImpact": 451000,
      "inherentScheduleImpactDays": 26,
      "strategicImpact": 3,
      "reputationImpact": 2,
      "timeHorizon": "near",
      "evidenceConfidence": "anecdotal",
      "controlIds": [],
      "causeIds": [],
      "actionIds": [],
      "affectedMilestoneIds": [
        "ms-a-08"
      ],
      "affectedBenefitIds": [],
      "dependencyIds": [],
      "issueIds": [],
      "evidence": [],
      "comments": [],
      "tags": [
        "atlas",
        "vendor"
      ],
      "history": [
        {
          "date": "2026-01-05",
          "probability": 0.64,
          "impactScore": 4,
          "financialExposure": 315700
        },
        {
          "date": "2026-03-06",
          "probability": 0.79,
          "impactScore": 5,
          "financialExposure": 451000
        }
      ]
    },
    {
      "id": "rsk-13",
      "ref": "ATL-13",
      "title": "Historical data backfill volume is 4x the original sizing estimate",
      "description": "Historical data backfill volume is 4x the original sizing estimate.",
      "category": "operational",
      "ownerId": "own-a1",
      "workstreamId": "ws-a-plat",
      "status": "monitoring",
      "dateIdentified": "2025-12-23",
      "reviewDate": "2026-09-21",
      "strategy": "transfer",
      "inherentProbability": 0.61,
      "inherentImpact": 2,
      "inherentFinancialImpact": 504000,
      "inherentScheduleImpactDays": 29,
      "strategicImpact": 4,
      "reputationImpact": 3,
      "timeHorizon": "mid",
      "evidenceConfidence": "measured",
      "controlIds": [],
      "causeIds": [],
      "actionIds": [],
      "affectedMilestoneIds": [
        "ms-a-09"
      ],
      "affectedBenefitIds": [],
      "dependencyIds": [],
      "issueIds": [],
      "evidence": [],
      "comments": [],
      "tags": [
        "atlas",
        "capacity"
      ],
      "history": [
        {
          "date": "2026-01-10",
          "probability": 0.45999999999999996,
          "impactScore": 1,
          "financialExposure": 352800
        },
        {
          "date": "2026-03-11",
          "probability": 0.61,
          "impactScore": 2,
          "financialExposure": 504000
        }
      ]
    },
    {
      "id": "rsk-14",
      "ref": "ATL-14",
      "title": "Access control model for the new platform is not ready for audit",
      "description": "Access control model for the new platform is not ready for audit.",
      "category": "security",
      "ownerId": "own-a2",
      "workstreamId": "ws-a-mig",
      "status": "open",
      "dateIdentified": "2025-12-27",
      "reviewDate": "2026-09-24",
      "strategy": "accept",
      "inherentProbability": 0.43,
      "inherentImpact": 3,
      "inherentFinancialImpact": 557000,
      "inherentScheduleImpactDays": 32,
      "strategicImpact": 2,
      "reputationImpact": 1,
      "timeHorizon": "far",
      "evidenceConfidence": "verified",
      "controlIds": [],
      "causeIds": [],
      "actionIds": [],
      "affectedMilestoneIds": [
        "ms-a-10"
      ],
      "affectedBenefitIds": [],
      "dependencyIds": [],
      "issueIds": [],
      "evidence": [],
      "comments": [],
      "tags": [
        "atlas",
        "security"
      ],
      "history": [
        {
          "date": "2026-01-15",
          "probability": 0.28,
          "impactScore": 2,
          "financialExposure": 389900
        },
        {
          "date": "2026-03-16",
          "probability": 0.43,
          "impactScore": 3,
          "financialExposure": 557000
        }
      ]
    },
    {
      "id": "rsk-16",
      "ref": "ATL-16",
      "title": "Two source systems retire before their consumers are migrated",
      "description": "Two source systems retire before their consumers are migrated.",
      "category": "delivery",
      "ownerId": "own-a3",
      "workstreamId": "ws-a-gov",
      "status": "open",
      "dateIdentified": "2025-12-31",
      "reviewDate": "2026-09-27",
      "strategy": "mitigate",
      "inherentProbability": 0.25,
      "inherentImpact": 4,
      "inherentFinancialImpact": 610000,
      "inherentScheduleImpactDays": 35,
      "strategicImpact": 3,
      "reputationImpact": 2,
      "timeHorizon": "immediate",
      "evidenceConfidence": "indicative",
      "controlIds": [],
      "causeIds": [],
      "actionIds": [],
      "affectedMilestoneIds": [
        "ms-a-01"
      ],
      "affectedBenefitIds": [],
      "dependencyIds": [],
      "issueIds": [],
      "evidence": [],
      "comments": [],
      "tags": [
        "atlas",
        "delivery"
      ],
      "history": [
        {
          "date": "2026-01-20",
          "probability": 0.1,
          "impactScore": 3,
          "financialExposure": 427000
        },
        {
          "date": "2026-03-21",
          "probability": 0.25,
          "impactScore": 4,
          "financialExposure": 610000
        }
      ]
    },
    {
      "id": "rsk-17",
      "ref": "ATL-17",
      "title": "Data contract sign-off from a regulated business unit is delayed",
      "description": "Data contract sign-off from a regulated business unit is delayed.",
      "category": "data",
      "ownerId": "own-a4",
      "workstreamId": "ws-a-api",
      "status": "open",
      "dateIdentified": "2026-01-04",
      "reviewDate": "2026-09-30",
      "strategy": "mitigate",
      "inherentProbability": 0.67,
      "inherentImpact": 5,
      "inherentFinancialImpact": 663000,
      "inherentScheduleImpactDays": 38,
      "strategicImpact": 4,
      "reputationImpact": 3,
      "timeHorizon": "near",
      "evidenceConfidence": "anecdotal",
      "controlIds": [],
      "causeIds": [],
      "actionIds": [],
      "affectedMilestoneIds": [
        "ms-a-02"
      ],
      "affectedBenefitIds": [],
      "dependencyIds": [],
      "issueIds": [],
      "evidence": [],
      "comments": [],
      "tags": [
        "atlas",
        "data-quality"
      ],
      "history": [
        {
          "date": "2026-01-25",
          "probability": 0.52,
          "impactScore": 4,
          "financialExposure": 464099
        },
        {
          "date": "2026-03-26",
          "probability": 0.67,
          "impactScore": 5,
          "financialExposure": 663000
        }
      ]
    },
    {
      "id": "rsk-18",
      "ref": "ATL-18",
      "title": "Query performance on the new warehouse regresses for finance workloads",
      "description": "Query performance on the new warehouse regresses for finance workloads.",
      "category": "technology",
      "ownerId": "own-a5",
      "workstreamId": "ws-a-plat",
      "status": "monitoring",
      "dateIdentified": "2026-01-08",
      "reviewDate": "2026-10-03",
      "strategy": "mitigate",
      "inherentProbability": 0.49,
      "inherentImpact": 2,
      "inherentFinancialImpact": 716000,
      "inherentScheduleImpactDays": 41,
      "strategicImpact": 2,
      "reputationImpact": 1,
      "timeHorizon": "near",
      "evidenceConfidence": "measured",
      "controlIds": [],
      "causeIds": [],
      "actionIds": [],
      "affectedMilestoneIds": [
        "ms-a-03"
      ],
      "affectedBenefitIds": [],
      "dependencyIds": [],
      "issueIds": [],
      "evidence": [],
      "comments": [],
      "tags": [
        "atlas",
        "technology"
      ],
      "history": [
        {
          "date": "2026-01-30",
          "probability": 0.33999999999999997,
          "impactScore": 1,
          "financialExposure": 501199
        },
        {
          "date": "2026-03-31",
          "probability": 0.49,
          "impactScore": 2,
          "financialExposure": 716000
        }
      ]
    },
    {
      "id": "rsk-19",
      "ref": "ATL-19",
      "title": "Cost allocation tagging is incomplete, blocking chargeback to business units",
      "description": "Cost allocation tagging is incomplete, blocking chargeback to business units.",
      "category": "financial",
      "ownerId": "own-a6",
      "workstreamId": "ws-a-mig",
      "status": "open",
      "dateIdentified": "2026-01-12",
      "reviewDate": "2026-10-06",
      "strategy": "transfer",
      "inherentProbability": 0.31,
      "inherentImpact": 3,
      "inherentFinancialImpact": 769000,
      "inherentScheduleImpactDays": 44,
      "strategicImpact": 3,
      "reputationImpact": 2,
      "timeHorizon": "mid",
      "evidenceConfidence": "verified",
      "controlIds": [],
      "causeIds": [],
      "actionIds": [],
      "affectedMilestoneIds": [
        "ms-a-04"
      ],
      "affectedBenefitIds": [],
      "dependencyIds": [],
      "issueIds": [],
      "evidence": [],
      "comments": [],
      "tags": [
        "atlas",
        "cost"
      ],
      "history": [
        {
          "date": "2026-02-04",
          "probability": 0.16,
          "impactScore": 2,
          "financialExposure": 538300
        },
        {
          "date": "2026-04-05",
          "probability": 0.31,
          "impactScore": 3,
          "financialExposure": 769000
        }
      ]
    },
    {
      "id": "rsk-20",
      "ref": "ATL-20",
      "title": "On-call runbook for the new platform does not exist yet",
      "description": "On-call runbook for the new platform does not exist yet.",
      "category": "operational",
      "ownerId": "own-a7",
      "workstreamId": "ws-a-gov",
      "status": "open",
      "dateIdentified": "2026-01-16",
      "reviewDate": "2026-10-09",
      "strategy": "accept",
      "inherentProbability": 0.73,
      "inherentImpact": 4,
      "inherentFinancialImpact": 822000,
      "inherentScheduleImpactDays": 7,
      "strategicImpact": 4,
      "reputationImpact": 3,
      "timeHorizon": "far",
      "evidenceConfidence": "indicative",
      "controlIds": [],
      "causeIds": [],
      "actionIds": [],
      "affectedMilestoneIds": [
        "ms-a-05"
      ],
      "affectedBenefitIds": [],
      "dependencyIds": [],
      "issueIds": [],
      "evidence": [],
      "comments": [],
      "tags": [
        "atlas",
        "operational"
      ],
      "history": [
        {
          "date": "2026-02-09",
          "probability": 0.58,
          "impactScore": 3,
          "financialExposure": 575400
        },
        {
          "date": "2026-04-10",
          "probability": 0.73,
          "impactScore": 4,
          "financialExposure": 822000
        }
      ]
    }
  ],
  "causes": [
    {
      "id": "cse-a1",
      "ref": "ATL-C-01",
      "title": "Legacy source system documentation is incomplete",
      "description": "Why did the migration slip? Source system behaviour was undocumented.",
      "category": "process",
      "isRootCause": true,
      "whyChain": [
        "Why did the migration slip? Source system behaviour was undocumented.",
        "Why undocumented? Original vendor support contract lapsed years ago."
      ],
      "frequency": 9,
      "linkedRiskIds": [
        "rsk-01",
        "rsk-11"
      ],
      "linkedIssueIds": [],
      "ownerId": "own-a4"
    },
    {
      "id": "cse-a2",
      "ref": "ATL-C-02",
      "title": "Cloud cost model was built on list price, not negotiated volume pricing",
      "description": "Why was the forecast wrong? List price was used instead of the negotiated tier.",
      "category": "measurement",
      "isRootCause": true,
      "whyChain": [
        "Why was the forecast wrong? List price was used instead of the negotiated tier."
      ],
      "frequency": 6,
      "linkedRiskIds": [
        "rsk-03",
        "rsk-14"
      ],
      "linkedIssueIds": [],
      "ownerId": "own-a8"
    },
    {
      "id": "cse-a3",
      "ref": "ATL-C-03",
      "title": "Platform SRE hiring plan was built before scope was finalised",
      "description": "Why is SRE short-staffed? Headcount was approved against an earlier, smaller scope.",
      "category": "people",
      "isRootCause": true,
      "whyChain": [
        "Why is SRE short-staffed? Headcount was approved against an earlier, smaller scope."
      ],
      "frequency": 5,
      "linkedRiskIds": [
        "rsk-05"
      ],
      "linkedIssueIds": [],
      "ownerId": "own-a1"
    },
    {
      "id": "cse-a4",
      "ref": "ATL-C-04",
      "title": "Masking rules were written against a sample, not the full production schema",
      "description": "Why did PII leak through? Masking rules never saw the fields added later.",
      "category": "technology",
      "isRootCause": true,
      "whyChain": [
        "Why did PII leak through? Masking rules never saw the fields added later."
      ],
      "frequency": 4,
      "linkedRiskIds": [
        "rsk-06"
      ],
      "linkedIssueIds": [],
      "ownerId": "own-a7"
    },
    {
      "id": "cse-a5",
      "ref": "ATL-C-05",
      "title": "Vendor procurement cycle was not started until after the pilot concluded",
      "description": "Why is licensing stalled? Procurement only opened after the pilot proved the tool, losing the early-adopter pricing window.",
      "category": "process",
      "isRootCause": false,
      "whyChain": [
        "Why is licensing stalled? Procurement only opened after the pilot proved the tool, losing the early-adopter pricing window."
      ],
      "frequency": 3,
      "linkedRiskIds": [
        "rsk-08"
      ],
      "linkedIssueIds": [],
      "ownerId": "own-a8"
    },
    {
      "id": "cse-a6",
      "ref": "ATL-C-06",
      "title": "Backfill volume estimate used average daily volume, not peak retention periods",
      "description": "Why is backfill 4x over? The estimate ignored the retention peak in Q4 archives.",
      "category": "measurement",
      "isRootCause": true,
      "whyChain": [
        "Why is backfill 4x over? The estimate ignored the retention peak in Q4 archives."
      ],
      "frequency": 5,
      "linkedRiskIds": [
        "rsk-09"
      ],
      "linkedIssueIds": [],
      "ownerId": "own-a4"
    }
  ],
  "controls": [
    {
      "id": "ctl-a01",
      "ref": "ATL-CTL-01",
      "name": "Weekly migration cutover readiness review",
      "description": "Cross-functional review of every source feed against cutover exit criteria.",
      "type": "detective",
      "ownerId": "own-a4",
      "frequency": "weekly",
      "designEffectiveness": 0.7,
      "operatingEffectiveness": 0.6,
      "evidenceRef": "steering pack",
      "automated": false,
      "linkedRiskIds": [
        "rsk-01",
        "rsk-11"
      ],
      "status": "active",
      "lastTested": "2026-07-19",
      "nextTest": "2026-07-26"
    },
    {
      "id": "ctl-a02",
      "ref": "ATL-CTL-02",
      "name": "Automated cost anomaly alerting",
      "description": "Alerts finance and platform leads when cloud spend deviates from forecast by more than 8%.",
      "type": "detective",
      "ownerId": "own-a8",
      "frequency": "continuous",
      "designEffectiveness": 0.75,
      "operatingEffectiveness": 0.7,
      "evidenceRef": "billing dashboard",
      "automated": true,
      "linkedRiskIds": [
        "rsk-03",
        "rsk-14"
      ],
      "status": "active",
      "lastTested": "2026-07-09"
    },
    {
      "id": "ctl-a03",
      "ref": "ATL-CTL-03",
      "name": "SRE surge-hire and contractor bench",
      "description": "Pre-approved contractor bench to cover SRE gaps through go-live.",
      "type": "corrective",
      "ownerId": "own-a1",
      "frequency": "monthly",
      "designEffectiveness": 0.5,
      "operatingEffectiveness": 0.45,
      "evidenceRef": "resourcing tracker",
      "automated": false,
      "linkedRiskIds": [
        "rsk-05"
      ],
      "status": "active",
      "lastTested": "2026-07-29",
      "nextTest": "2026-08-28"
    },
    {
      "id": "ctl-a04",
      "ref": "ATL-CTL-04",
      "name": "Full-schema PII discovery scan",
      "description": "Automated scan of every field in the new lake zone, not a sample.",
      "type": "preventive",
      "ownerId": "own-a7",
      "frequency": "monthly",
      "designEffectiveness": 0.85,
      "operatingEffectiveness": 0.75,
      "evidenceRef": "scan report",
      "automated": true,
      "linkedRiskIds": [
        "rsk-06"
      ],
      "status": "active",
      "lastTested": "2026-07-24",
      "nextTest": "2026-08-23"
    },
    {
      "id": "ctl-a05",
      "ref": "ATL-CTL-05",
      "name": "Vendor licence fallback agreement",
      "description": "Short-term fallback licence to bridge the negotiation gap.",
      "type": "preventive",
      "ownerId": "own-a8",
      "frequency": "quarterly",
      "designEffectiveness": 0.6,
      "operatingEffectiveness": 0.55,
      "evidenceRef": "contract file",
      "automated": false,
      "linkedRiskIds": [
        "rsk-08"
      ],
      "status": "active",
      "lastTested": "2026-06-29"
    },
    {
      "id": "ctl-a06",
      "ref": "ATL-CTL-06",
      "name": "Backfill volume re-forecast with peak retention",
      "description": "Revised backfill sizing including Q4 archive peaks.",
      "type": "corrective",
      "ownerId": "own-a4",
      "frequency": "monthly",
      "designEffectiveness": 0.65,
      "operatingEffectiveness": 0.5,
      "evidenceRef": "capacity model v2",
      "automated": false,
      "linkedRiskIds": [
        "rsk-09"
      ],
      "status": "active",
      "lastTested": "2026-08-03",
      "nextTest": "2026-09-02"
    },
    {
      "id": "ctl-a07",
      "ref": "ATL-CTL-07",
      "name": "Access model pre-audit dry run",
      "description": "Internal dry run of the access model against audit criteria before the real audit.",
      "type": "detective",
      "ownerId": "own-a5",
      "frequency": "monthly",
      "designEffectiveness": 0.7,
      "operatingEffectiveness": 0.65,
      "evidenceRef": "dry-run report",
      "automated": false,
      "linkedRiskIds": [
        "rsk-10"
      ],
      "status": "active",
      "lastTested": "2026-08-08",
      "nextTest": "2026-09-07"
    },
    {
      "id": "ctl-a08",
      "ref": "ATL-CTL-08",
      "name": "Dual-run reconciliation for retiring source systems",
      "description": "Old and new systems run in parallel until reconciliation is clean.",
      "type": "preventive",
      "ownerId": "own-a4",
      "frequency": "weekly",
      "designEffectiveness": 0.8,
      "operatingEffectiveness": 0.7,
      "evidenceRef": "reconciliation log",
      "automated": true,
      "linkedRiskIds": [
        "rsk-11"
      ],
      "status": "active",
      "lastTested": "2026-08-18"
    },
    {
      "id": "ctl-a09",
      "ref": "ATL-CTL-09",
      "name": "Data contract escalation path to business unit sponsors",
      "description": "Direct escalation route when a business unit stalls a data contract sign-off.",
      "type": "corrective",
      "ownerId": "own-a2",
      "frequency": "event-driven",
      "designEffectiveness": 0.55,
      "operatingEffectiveness": 0.5,
      "evidenceRef": "escalation log",
      "automated": false,
      "linkedRiskIds": [
        "rsk-12"
      ],
      "status": "active"
    },
    {
      "id": "ctl-a10",
      "ref": "ATL-CTL-10",
      "name": "Warehouse workload query performance baseline",
      "description": "Ongoing benchmark of finance workloads against the legacy baseline.",
      "type": "detective",
      "ownerId": "own-a3",
      "frequency": "weekly",
      "designEffectiveness": 0.7,
      "operatingEffectiveness": 0.6,
      "evidenceRef": "perf dashboard",
      "automated": true,
      "linkedRiskIds": [
        "rsk-13"
      ],
      "status": "active",
      "lastTested": "2026-08-13",
      "nextTest": "2026-09-12"
    }
  ],
  "actions": [
    {
      "id": "act-a01",
      "ref": "ATL-A-01",
      "title": "Recover source system documentation via original vendor archive",
      "description": "Requesting archived documentation under the lapsed support contract's data-return clause.",
      "ownerId": "own-a4",
      "dueDate": "2026-08-08",
      "status": "in-progress",
      "priority": "high",
      "linkedRiskIds": [
        "rsk-01"
      ],
      "linkedIssueIds": [],
      "linkedDependencyIds": [],
      "expectedRiskReduction": 0.3,
      "percentComplete": 55
    },
    {
      "id": "act-a02",
      "ref": "ATL-A-02",
      "title": "Re-negotiate cloud pricing to committed-use tier",
      "description": "Moving from on-demand to a three-year committed-use discount.",
      "ownerId": "own-a8",
      "dueDate": "2026-07-19",
      "status": "in-progress",
      "priority": "high",
      "linkedRiskIds": [
        "rsk-03"
      ],
      "linkedIssueIds": [],
      "linkedDependencyIds": [],
      "expectedRiskReduction": 0.4,
      "percentComplete": 60
    },
    {
      "id": "act-a03",
      "ref": "ATL-A-03",
      "title": "Confirm SRE contractor bench start dates",
      "description": "Locking contractor start dates against the go-live date.",
      "ownerId": "own-a1",
      "dueDate": "2026-08-03",
      "status": "open",
      "priority": "medium",
      "linkedRiskIds": [
        "rsk-05"
      ],
      "linkedIssueIds": [],
      "linkedDependencyIds": [],
      "expectedRiskReduction": 0.25,
      "percentComplete": 20
    },
    {
      "id": "act-a04",
      "ref": "ATL-A-04",
      "title": "Re-run PII scan against full production schema",
      "description": "Full-schema scan completed; two additional fields masked.",
      "ownerId": "own-a7",
      "dueDate": "2026-07-29",
      "status": "complete",
      "priority": "critical",
      "linkedRiskIds": [
        "rsk-06"
      ],
      "linkedIssueIds": [],
      "linkedDependencyIds": [],
      "expectedRiskReduction": 0.6,
      "percentComplete": 100,
      "completedDate": "2026-07-27"
    },
    {
      "id": "act-a05",
      "ref": "ATL-A-05",
      "title": "Sign interim licence bridge with data quality vendor",
      "description": "Interim licence in legal review.",
      "ownerId": "own-a8",
      "dueDate": "2026-07-09",
      "status": "in-progress",
      "priority": "medium",
      "linkedRiskIds": [
        "rsk-08"
      ],
      "linkedIssueIds": [],
      "linkedDependencyIds": [],
      "expectedRiskReduction": 0.35,
      "percentComplete": 40
    },
    {
      "id": "act-a06",
      "ref": "ATL-A-06",
      "title": "Re-forecast backfill volume against Q4 peak retention",
      "description": "Revised model delivered to steering committee.",
      "ownerId": "own-a4",
      "dueDate": "2026-08-13",
      "status": "complete",
      "priority": "high",
      "linkedRiskIds": [
        "rsk-09"
      ],
      "linkedIssueIds": [],
      "linkedDependencyIds": [],
      "expectedRiskReduction": 0.3,
      "percentComplete": 100,
      "completedDate": "2026-08-10"
    },
    {
      "id": "act-a07",
      "ref": "ATL-A-07",
      "title": "Run access model dry audit with internal audit team",
      "description": "Dry-run scheduled ahead of the formal audit window.",
      "ownerId": "own-a5",
      "dueDate": "2026-08-23",
      "status": "in-progress",
      "priority": "high",
      "linkedRiskIds": [
        "rsk-10"
      ],
      "linkedIssueIds": [],
      "linkedDependencyIds": [],
      "expectedRiskReduction": 0.4,
      "percentComplete": 45
    },
    {
      "id": "act-a08",
      "ref": "ATL-A-08",
      "title": "Escalate finance data contract to steering committee",
      "description": "Sponsor-level escalation drafted for next steering meeting.",
      "ownerId": "own-a2",
      "dueDate": "2026-07-24",
      "status": "open",
      "priority": "high",
      "linkedRiskIds": [
        "rsk-12"
      ],
      "linkedIssueIds": [],
      "linkedDependencyIds": [],
      "expectedRiskReduction": 0.25,
      "percentComplete": 15
    }
  ],
  "issues": [
    {
      "id": "iss-a01",
      "ref": "ATL-I-01",
      "title": "Two source systems missed their planned retirement date",
      "description": "Legacy support cost accruing beyond the planned retirement date.",
      "ownerId": "own-a4",
      "workstreamId": "ws-a-mig",
      "priority": "high",
      "status": "open",
      "dateRaised": "2026-05-20",
      "targetResolution": "2026-07-19",
      "actualCostImpact": 45000,
      "actualScheduleImpactDays": 12,
      "causeIds": [
        "cse-a1"
      ],
      "actionIds": [
        "act-a01"
      ],
      "affectedMilestoneIds": [
        "ms-a-04"
      ],
      "evidence": [],
      "comments": []
    },
    {
      "id": "iss-a02",
      "ref": "ATL-I-02",
      "title": "Cloud spend exceeded forecast for two consecutive months",
      "description": "Committed-use negotiation is the resolution path.",
      "ownerId": "own-a8",
      "workstreamId": "ws-a-plat",
      "priority": "medium",
      "status": "in-progress",
      "dateRaised": "2026-06-19",
      "targetResolution": "2026-08-18",
      "actualCostImpact": 180000,
      "actualScheduleImpactDays": 0,
      "causeIds": [
        "cse-a2"
      ],
      "actionIds": [
        "act-a02"
      ],
      "affectedMilestoneIds": [],
      "evidence": [],
      "comments": []
    },
    {
      "id": "iss-a03",
      "ref": "ATL-I-03",
      "title": "PII fields found unmasked in a lake zone during internal review",
      "description": "Resolved by full-schema scan and remediation; no external disclosure required.",
      "ownerId": "own-a7",
      "workstreamId": "ws-a-gov",
      "priority": "critical",
      "status": "resolved",
      "dateRaised": "2026-07-19",
      "targetResolution": "2026-07-29",
      "actualCostImpact": 0,
      "actualScheduleImpactDays": 0,
      "causeIds": [
        "cse-a4"
      ],
      "actionIds": [
        "act-a04"
      ],
      "affectedMilestoneIds": [
        "ms-a-06"
      ],
      "evidence": [],
      "comments": [],
      "resolvedDate": "2026-07-27"
    },
    {
      "id": "iss-a04",
      "ref": "ATL-I-04",
      "title": "Finance data contract sign-off overdue by three weeks",
      "description": "Business unit sponsor unavailable; escalation path invoked.",
      "ownerId": "own-a2",
      "workstreamId": "ws-a-api",
      "priority": "high",
      "status": "open",
      "dateRaised": "2026-07-14",
      "targetResolution": "2026-08-13",
      "actualCostImpact": 0,
      "actualScheduleImpactDays": 21,
      "causeIds": [],
      "actionIds": [
        "act-a08"
      ],
      "affectedMilestoneIds": [
        "ms-a-08"
      ],
      "evidence": [],
      "comments": []
    }
  ],
  "assumptions": [
    {
      "id": "asm-a01",
      "ref": "ATL-AS-01",
      "statement": "Original source system vendor will provide archived documentation on request",
      "ownerId": "own-a4",
      "status": "validating",
      "confidence": "indicative",
      "validationDate": "2026-08-28",
      "riskIfFalseId": "rsk-01",
      "linkedMilestoneIds": [
        "ms-a-03"
      ],
      "note": "Formal request submitted; response pending."
    },
    {
      "id": "asm-a02",
      "ref": "ATL-AS-02",
      "statement": "Committed-use cloud pricing will be approved within the current budget cycle",
      "ownerId": "own-a8",
      "status": "unvalidated",
      "confidence": "anecdotal",
      "validationDate": "2026-08-08",
      "riskIfFalseId": "rsk-03",
      "linkedMilestoneIds": [
        "ms-a-10"
      ],
      "note": "Finance sign-off still required."
    },
    {
      "id": "asm-a03",
      "ref": "ATL-AS-03",
      "statement": "Contractor bench candidates remain available through go-live",
      "ownerId": "own-a1",
      "status": "validated",
      "confidence": "measured",
      "validationDate": "2026-08-03",
      "riskIfFalseId": "rsk-05",
      "linkedMilestoneIds": [
        "ms-a-04"
      ],
      "note": "Three contractors confirmed availability in writing."
    },
    {
      "id": "asm-a04",
      "ref": "ATL-AS-04",
      "statement": "ORION's Integration workstream will accept the API contract without material rework",
      "ownerId": "own-a6",
      "status": "unvalidated",
      "confidence": "indicative",
      "validationDate": "2026-09-02",
      "linkedMilestoneIds": [
        "ms-a-08"
      ],
      "note": "First joint review with ORION integration lead scheduled."
    }
  ],
  "dependencies": [
    {
      "id": "dep-a01",
      "ref": "ATL-DEP-01",
      "name": "Finance system vendor sign-off on data export format",
      "description": "Vendor must confirm the export format before the finance feed can migrate.",
      "type": "external",
      "upstream": "Legacy finance vendor",
      "upstreamOwnerId": "own-a4",
      "downstream": "ATLAS migration workstream",
      "downstreamOwnerId": "own-a4",
      "dueDate": "2026-04-15",
      "status": "at-risk",
      "criticality": "high",
      "delayProbability": 0.4,
      "potentialDelayDays": 20,
      "affectedMilestoneIds": [
        "ms-a-03"
      ],
      "affectedBenefitIds": [],
      "predecessorIds": [],
      "linkedRiskIds": [
        "rsk-01"
      ]
    },
    {
      "id": "dep-a02",
      "ref": "ATL-DEP-02",
      "name": "Cloud committed-use contract execution",
      "description": "Signed contract needed to lock in committed-use pricing.",
      "type": "vendor",
      "upstream": "Cloud provider commercial team",
      "upstreamOwnerId": "own-a8",
      "downstream": "ATLAS platform workstream",
      "downstreamOwnerId": "own-a3",
      "dueDate": "2026-07-14",
      "status": "on-track",
      "criticality": "medium",
      "delayProbability": 0.3,
      "potentialDelayDays": 15,
      "affectedMilestoneIds": [
        "ms-a-10"
      ],
      "affectedBenefitIds": [],
      "predecessorIds": [],
      "linkedRiskIds": [
        "rsk-03"
      ]
    },
    {
      "id": "dep-a03",
      "ref": "ATL-DEP-03",
      "name": "Internal audit slot for access model review",
      "description": "Audit slot booked; dry run must complete before it.",
      "type": "internal",
      "upstream": "Internal Audit",
      "upstreamOwnerId": "own-a5",
      "downstream": "ATLAS governance workstream",
      "downstreamOwnerId": "own-a5",
      "dueDate": "2026-06-04",
      "status": "on-track",
      "criticality": "high",
      "delayProbability": 0.25,
      "potentialDelayDays": 10,
      "affectedMilestoneIds": [
        "ms-a-06"
      ],
      "affectedBenefitIds": [],
      "predecessorIds": [],
      "linkedRiskIds": [
        "rsk-10"
      ]
    },
    {
      "id": "dep-a04",
      "ref": "ATL-DEP-04",
      "name": "Meridian Cloud Systems platform capacity guarantee",
      "description": "Capacity guarantee needed before API Platform GA can be declared safe at production load.",
      "type": "vendor",
      "upstream": "Meridian Cloud Systems",
      "upstreamOwnerId": "own-a8",
      "downstream": "ATLAS API workstream",
      "downstreamOwnerId": "own-a6",
      "dueDate": "2026-08-18",
      "status": "at-risk",
      "criticality": "critical",
      "delayProbability": 0.5,
      "potentialDelayDays": 25,
      "affectedMilestoneIds": [
        "ms-a-07"
      ],
      "affectedBenefitIds": [],
      "predecessorIds": [],
      "linkedRiskIds": [
        "rsk-15"
      ]
    },
    {
      "id": "dep-a05",
      "ref": "ATL-DEP-05",
      "name": "ORION integration lead joint design review",
      "description": "Joint review confirming ORION can consume the ATLAS API contract as designed.",
      "type": "cross-program",
      "upstream": "ATLAS API workstream",
      "upstreamOwnerId": "own-a6",
      "downstream": "ORION integration workstream",
      "downstreamOwnerId": "own-a6",
      "dueDate": "2026-08-28",
      "status": "on-track",
      "criticality": "high",
      "delayProbability": 0.3,
      "potentialDelayDays": 15,
      "affectedMilestoneIds": [
        "ms-a-08"
      ],
      "affectedBenefitIds": [],
      "predecessorIds": [],
      "linkedRiskIds": []
    },
    {
      "id": "dep-a06",
      "ref": "ATL-DEP-06",
      "name": "Business unit sponsor sign-off on data contract",
      "description": "Sponsor sign-off is the last gate before the contract can be finalised.",
      "type": "internal",
      "upstream": "Finance business unit",
      "upstreamOwnerId": "own-a2",
      "downstream": "ATLAS API workstream",
      "downstreamOwnerId": "own-a2",
      "dueDate": "2026-08-13",
      "status": "late",
      "criticality": "high",
      "delayProbability": 0.5,
      "potentialDelayDays": 21,
      "affectedMilestoneIds": [
        "ms-a-08"
      ],
      "affectedBenefitIds": [],
      "predecessorIds": [],
      "linkedRiskIds": []
    },
    {
      "id": "dep-a07",
      "ref": "ATL-DEP-07",
      "name": "Security accreditation renewal for the landing zone",
      "description": "Renewal completed ahead of schedule.",
      "type": "internal",
      "upstream": "CISO office",
      "upstreamOwnerId": "own-a7",
      "downstream": "ATLAS platform workstream",
      "downstreamOwnerId": "own-a3",
      "dueDate": "2025-11-26",
      "status": "delivered",
      "criticality": "medium",
      "delayProbability": 0.1,
      "potentialDelayDays": 5,
      "affectedMilestoneIds": [
        "ms-a-01"
      ],
      "affectedBenefitIds": [],
      "predecessorIds": [],
      "linkedRiskIds": []
    },
    {
      "id": "dep-a08",
      "ref": "ATL-DEP-08",
      "name": "Legacy platform decommission approval",
      "description": "Formal approval to switch off legacy stores once reconciliation is clean.",
      "type": "internal",
      "upstream": "IT operations",
      "upstreamOwnerId": "own-a4",
      "downstream": "ATLAS migration workstream",
      "downstreamOwnerId": "own-a4",
      "dueDate": "2026-12-01",
      "status": "on-track",
      "criticality": "medium",
      "delayProbability": 0.2,
      "potentialDelayDays": 10,
      "affectedMilestoneIds": [
        "ms-a-09"
      ],
      "affectedBenefitIds": [],
      "predecessorIds": [
        "dep-a01"
      ],
      "linkedRiskIds": []
    }
  ],
  "changes": [
    {
      "id": "chg-a01",
      "ref": "ATL-CHG-01",
      "title": "Extend committed-use contract term from 1 to 3 years",
      "description": "Locking in a longer commitment to capture a materially better discount tier.",
      "requesterId": "own-a8",
      "reason": "Better discount tier available for a longer commitment",
      "raisedDate": "2026-06-29",
      "scopeImpact": "No scope change",
      "costImpact": -420000,
      "scheduleImpactDays": 0,
      "resourceImpact": "None",
      "riskImpact": "Reduces cost-overrun risk",
      "benefitImpact": -420000,
      "affectedWorkstreamIds": [
        "ws-a-plat"
      ],
      "affectedMilestoneIds": [
        "ms-a-10"
      ],
      "affectedDependencyIds": [
        "dep-a02"
      ],
      "affectedBenefitIds": [],
      "linkedRiskIds": [
        "rsk-03"
      ],
      "decision": "approved",
      "status": "implemented",
      "decisionMakerId": "own-a1",
      "decisionDate": "2026-07-07",
      "decisionRationale": "Net saving outweighs the reduced flexibility"
    },
    {
      "id": "chg-a02",
      "ref": "ATL-CHG-02",
      "title": "Add a second SRE surge-hire wave",
      "description": "A second contractor wave to close the remaining SRE gap before go-live.",
      "requesterId": "own-a1",
      "reason": "First wave insufficient to cover go-live support model",
      "raisedDate": "2026-07-29",
      "scopeImpact": "No scope change",
      "costImpact": 180000,
      "scheduleImpactDays": 0,
      "resourceImpact": "Two additional contractors",
      "riskImpact": "Reduces operational risk at go-live",
      "benefitImpact": 0,
      "affectedWorkstreamIds": [
        "ws-a-plat"
      ],
      "affectedMilestoneIds": [],
      "affectedDependencyIds": [],
      "affectedBenefitIds": [],
      "linkedRiskIds": [
        "rsk-05"
      ],
      "decision": "approved",
      "status": "implemented",
      "decisionMakerId": "own-a1",
      "decisionDate": "2026-08-02",
      "decisionRationale": "Support model risk outweighs the incremental cost"
    },
    {
      "id": "chg-a03",
      "ref": "ATL-CHG-03",
      "title": "Defer legacy decommission by six weeks",
      "description": "Extra runway to make sure reconciliation is genuinely clean before switch-off.",
      "requesterId": "own-a4",
      "reason": "Reconciliation taking longer than planned",
      "raisedDate": "2026-11-16",
      "scopeImpact": "Schedule only",
      "costImpact": 0,
      "scheduleImpactDays": 42,
      "resourceImpact": "None",
      "riskImpact": "Reduces risk of premature decommission",
      "benefitImpact": 0,
      "affectedWorkstreamIds": [
        "ws-a-mig"
      ],
      "affectedMilestoneIds": [
        "ms-a-09"
      ],
      "affectedDependencyIds": [
        "dep-a08"
      ],
      "affectedBenefitIds": [],
      "linkedRiskIds": [
        "rsk-09"
      ],
      "decision": "pending",
      "status": "in-review"
    }
  ],
  "decisions": [
    {
      "id": "dec-a01",
      "ref": "ATL-DEC-01",
      "title": "Committed-use vs on-demand cloud pricing",
      "context": "Cloud spend has exceeded forecast for two months running",
      "ownerId": "own-a8",
      "decisionMakerId": "own-a1",
      "forum": "Programme Steering",
      "dateRequired": "2026-07-04",
      "status": "decided",
      "options": [
        {
          "id": "opt-a01a",
          "label": "Move to 3-year committed-use",
          "pros": [
            "Largest discount",
            "Predictable spend"
          ],
          "cons": [
            "Less flexibility"
          ],
          "estimatedCost": -420000,
          "estimatedScheduleDays": 0,
          "residualRiskNote": "Locks in usage assumptions for 3 years."
        },
        {
          "id": "opt-a01b",
          "label": "Stay on-demand, tighten anomaly alerting",
          "pros": [
            "Full flexibility"
          ],
          "cons": [
            "No discount",
            "Cost risk continues"
          ],
          "estimatedCost": 0,
          "estimatedScheduleDays": 0,
          "residualRiskNote": "Cost overrun risk remains open."
        }
      ],
      "evidence": [],
      "expectedOutcome": "Cloud spend variance reduced below 5 percent within two quarters",
      "linkedRiskIds": [
        "rsk-03"
      ],
      "linkedChangeIds": [
        "chg-a01"
      ],
      "linkedBenefitIds": [],
      "linkedMilestoneIds": [
        "ms-a-10"
      ],
      "dateDecided": "2026-07-07",
      "chosenOptionId": "opt-a01a",
      "rationale": "Discount outweighs the flexibility cost given stable usage growth"
    },
    {
      "id": "dec-a02",
      "ref": "ATL-DEC-02",
      "title": "SRE surge-hire scope",
      "context": "Go-live support model is short-staffed against original plan",
      "ownerId": "own-a1",
      "decisionMakerId": "own-a1",
      "forum": "Programme Steering",
      "dateRequired": "2026-07-31",
      "status": "decided",
      "options": [
        {
          "id": "opt-a02a",
          "label": "Second contractor wave",
          "pros": [
            "Closes gap before go-live"
          ],
          "cons": [
            "Incremental cost"
          ],
          "estimatedCost": 180000,
          "estimatedScheduleDays": 0,
          "residualRiskNote": "Contractor availability not guaranteed."
        },
        {
          "id": "opt-a02b",
          "label": "Reduce go-live support model scope",
          "pros": [
            "No added cost"
          ],
          "cons": [
            "Higher incident risk at go-live"
          ],
          "estimatedCost": 0,
          "estimatedScheduleDays": 0,
          "residualRiskNote": "Accepts higher incident risk."
        }
      ],
      "evidence": [],
      "expectedOutcome": "Go-live support model fully staffed",
      "linkedRiskIds": [
        "rsk-05"
      ],
      "linkedChangeIds": [
        "chg-a02"
      ],
      "linkedBenefitIds": [],
      "linkedMilestoneIds": [],
      "dateDecided": "2026-08-02",
      "chosenOptionId": "opt-a02a",
      "rationale": "Incident risk at go-live is not an acceptable trade for the saving"
    },
    {
      "id": "dec-a03",
      "ref": "ATL-DEC-03",
      "title": "Legacy decommission timing",
      "context": "Reconciliation is not yet clean for two source systems",
      "ownerId": "own-a4",
      "decisionMakerId": "own-a2",
      "forum": "Programme Steering",
      "dateRequired": "2026-11-14",
      "status": "required",
      "options": [
        {
          "id": "opt-a03a",
          "label": "Defer decommission six weeks",
          "pros": [
            "Avoids premature switch-off"
          ],
          "cons": [
            "Extends dual-run cost"
          ],
          "estimatedCost": 30000,
          "estimatedScheduleDays": 42,
          "residualRiskNote": "Small extension of dual-run cost."
        },
        {
          "id": "opt-a03b",
          "label": "Decommission on original date",
          "pros": [
            "No schedule slip"
          ],
          "cons": [
            "Risk of reconciliation gaps going undetected"
          ],
          "estimatedCost": 0,
          "estimatedScheduleDays": 0,
          "residualRiskNote": "Data integrity risk if reconciliation is not actually clean."
        }
      ],
      "evidence": [],
      "expectedOutcome": "Zero data-integrity findings after decommission",
      "linkedRiskIds": [
        "rsk-09"
      ],
      "linkedChangeIds": [
        "chg-a03"
      ],
      "linkedBenefitIds": [],
      "linkedMilestoneIds": [
        "ms-a-09"
      ]
    }
  ],
  "benefits": [
    {
      "id": "ben-a01",
      "ref": "ATL-BEN-01",
      "name": "Legacy platform running-cost reduction",
      "description": "Legacy platform running-cost reduction",
      "type": "financial",
      "ownerId": "own-a1",
      "expectedValue": 4200000,
      "realisedValue": 900000,
      "measure": "Annualised infrastructure and licence spend",
      "baseline": 6800000,
      "target": 2600000,
      "current": 5900000,
      "startDate": "2025-11-01",
      "targetDate": "2026-12-06",
      "status": "in-progress",
      "enablingMilestoneIds": [
        "ms-a-09"
      ],
      "threateningRiskIds": [
        "rsk-01",
        "rsk-09"
      ],
      "linkedChangeIds": [
        "chg-a03"
      ],
      "linkedDecisionIds": [
        "dec-a03"
      ],
      "history": [
        {
          "date": "2026-03-01",
          "realisedValue": 200000
        },
        {
          "date": "2026-06-29",
          "realisedValue": 500000
        },
        {
          "date": "2026-10-27",
          "realisedValue": 900000
        }
      ]
    },
    {
      "id": "ben-a02",
      "ref": "ATL-BEN-02",
      "name": "Regulated reporting lineage compliance",
      "description": "Regulated reporting lineage compliance",
      "type": "compliance",
      "ownerId": "own-a5",
      "expectedValue": 1500000,
      "realisedValue": 1500000,
      "measure": "Feeds with full lineage evidence",
      "baseline": 0,
      "target": 12,
      "current": 12,
      "startDate": "2025-11-01",
      "targetDate": "2026-03-31",
      "status": "realised",
      "enablingMilestoneIds": [
        "ms-a-05"
      ],
      "threateningRiskIds": [],
      "linkedChangeIds": [],
      "linkedDecisionIds": [],
      "history": [
        {
          "date": "2025-12-31",
          "realisedValue": 400000
        },
        {
          "date": "2026-03-01",
          "realisedValue": 900000
        },
        {
          "date": "2026-03-31",
          "realisedValue": 1500000
        }
      ]
    },
    {
      "id": "ben-a03",
      "ref": "ATL-BEN-03",
      "name": "Query performance improvement for finance workloads",
      "description": "Query performance improvement for finance workloads",
      "type": "efficiency",
      "ownerId": "own-a3",
      "expectedValue": 900000,
      "realisedValue": 300000,
      "measure": "P95 query latency reduction",
      "baseline": 0,
      "target": 60,
      "current": 25,
      "startDate": "2026-02-09",
      "targetDate": "2026-09-17",
      "status": "at-risk",
      "enablingMilestoneIds": [
        "ms-a-02"
      ],
      "threateningRiskIds": [
        "rsk-13"
      ],
      "linkedChangeIds": [],
      "linkedDecisionIds": [],
      "history": [
        {
          "date": "2026-03-31",
          "realisedValue": 80000
        },
        {
          "date": "2026-07-09",
          "realisedValue": 200000
        },
        {
          "date": "2026-09-17",
          "realisedValue": 300000
        }
      ]
    },
    {
      "id": "ben-a04",
      "ref": "ATL-BEN-04",
      "name": "API platform reuse value for downstream programmes",
      "description": "API platform reuse value for downstream programmes",
      "type": "strategic",
      "ownerId": "own-a6",
      "expectedValue": 2000000,
      "realisedValue": 0,
      "measure": "Downstream programmes onboarded",
      "baseline": 0,
      "target": 3,
      "current": 0,
      "startDate": "2026-07-19",
      "targetDate": "2026-11-16",
      "status": "not-started",
      "enablingMilestoneIds": [
        "ms-a-07",
        "ms-a-08"
      ],
      "threateningRiskIds": [
        "rsk-15"
      ],
      "linkedChangeIds": [],
      "linkedDecisionIds": [],
      "history": []
    }
  ],
  "fmea": [
    {
      "id": "fme-a01",
      "ref": "ATL-FM-01",
      "process": "Finance feed cutover",
      "processStep": "Export and load",
      "failureMode": "Export format mismatch",
      "effect": "Load job fails silently",
      "cause": "Undocumented source schema",
      "severity": 5,
      "occurrence": 3,
      "detection": 3,
      "existingControl": "Manual spot-check of load counts",
      "recommendedAction": "Automated schema-diff gate before load",
      "ownerId": "own-a4",
      "dueDate": "2026-07-19",
      "actionStatus": "in-progress",
      "postSeverity": 5,
      "postOccurrence": 2,
      "postDetection": 2,
      "linkedRiskIds": [
        "rsk-01"
      ],
      "linkedCauseIds": [
        "cse-a1"
      ],
      "linkedControlIds": [
        "ctl-a01"
      ]
    },
    {
      "id": "fme-a02",
      "ref": "ATL-FM-02",
      "process": "PII discovery",
      "processStep": "Scan and mask",
      "failureMode": "Field added after sample was taken",
      "effect": "PII exposed in lake zone",
      "cause": "Sample-based masking rules",
      "severity": 5,
      "occurrence": 2,
      "detection": 2,
      "existingControl": "Sample-based scan",
      "recommendedAction": "Full-schema scan on every release",
      "ownerId": "own-a7",
      "dueDate": "2026-07-29",
      "actionStatus": "complete",
      "postSeverity": 5,
      "postOccurrence": 1,
      "postDetection": 1,
      "linkedRiskIds": [
        "rsk-06"
      ],
      "linkedCauseIds": [
        "cse-a4"
      ],
      "linkedControlIds": [
        "ctl-a04"
      ]
    },
    {
      "id": "fme-a03",
      "ref": "ATL-FM-03",
      "process": "Backfill sizing",
      "processStep": "Capacity estimate",
      "failureMode": "Peak retention period ignored",
      "effect": "Storage and compute under-provisioned",
      "cause": "Average-volume estimate",
      "severity": 4,
      "occurrence": 4,
      "detection": 3,
      "existingControl": "Manual capacity review",
      "recommendedAction": "Automated capacity model including peak retention",
      "ownerId": "own-a4",
      "dueDate": "2026-08-13",
      "actionStatus": "complete",
      "postSeverity": 4,
      "postOccurrence": 2,
      "postDetection": 2,
      "linkedRiskIds": [
        "rsk-09"
      ],
      "linkedCauseIds": [
        "cse-a6"
      ],
      "linkedControlIds": [
        "ctl-a06"
      ]
    },
    {
      "id": "fme-a04",
      "ref": "ATL-FM-04",
      "process": "API contract handoff",
      "processStep": "Joint design review",
      "failureMode": "Contract accepted without full ORION validation",
      "effect": "Rework after ORION integration starts",
      "cause": "Single-side review",
      "severity": 4,
      "occurrence": 3,
      "detection": 3,
      "existingControl": "ATLAS-only review",
      "recommendedAction": "Mandatory joint sign-off with ORION integration lead",
      "ownerId": "own-a6",
      "dueDate": "2026-08-28",
      "actionStatus": "in-progress",
      "postSeverity": 4,
      "postOccurrence": 2,
      "postDetection": 2,
      "linkedRiskIds": [],
      "linkedCauseIds": [],
      "linkedControlIds": [
        "ctl-a09"
      ]
    }
  ],
  "dmaic": [],
  "metrics": [
    {
      "id": "met-a01",
      "name": "Source feeds migrated",
      "unit": "feeds",
      "workstreamId": "ws-a-mig",
      "target": 14,
      "direction": "higher-is-better",
      "series": [
        {
          "date": "2025-12-01",
          "value": 2
        },
        {
          "date": "2026-03-31",
          "value": 6
        },
        {
          "date": "2026-07-09",
          "value": 9
        },
        {
          "date": "2026-10-17",
          "value": 11
        }
      ]
    },
    {
      "id": "met-a02",
      "name": "Cloud spend variance vs forecast",
      "unit": "pct",
      "workstreamId": "ws-a-plat",
      "target": 5,
      "direction": "lower-is-better",
      "series": [
        {
          "date": "2025-12-31",
          "value": 4
        },
        {
          "date": "2026-03-31",
          "value": 9
        },
        {
          "date": "2026-07-09",
          "value": 11
        },
        {
          "date": "2026-10-17",
          "value": 6
        }
      ]
    },
    {
      "id": "met-a03",
      "name": "Critical PII findings open",
      "unit": "findings",
      "workstreamId": "ws-a-gov",
      "target": 0,
      "direction": "lower-is-better",
      "series": [
        {
          "date": "2026-05-20",
          "value": 3
        },
        {
          "date": "2026-07-19",
          "value": 1
        },
        {
          "date": "2026-07-29",
          "value": 0
        },
        {
          "date": "2026-10-17",
          "value": 0
        }
      ]
    }
  ],
  "treatments": [],
  "acceptances": []
};

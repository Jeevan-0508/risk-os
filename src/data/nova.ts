// GENERATED FILE. Do not edit by hand.
// Produced by tools/gen_satellite.py. Re-generate with:
//   python tools/gen_satellite.py
import type { Program } from '@/domain/types';

export const novaProgram: Program = {
  "id": "prog-nova",
  "name": "Customer Experience Transformation",
  "codename": "NOVA",
  "description": "End-to-end redesign of the customer journey across mobile app, web, contact centre and loyalty, with a launch that depends on ATLAS's API platform and ORION's carrier integration both being live.",
  "sponsor": "Camille Rousseau, Chief Customer Officer",
  "programManager": "Diego Fernandez",
  "startDate": "2025-12-01",
  "endDate": "2026-12-31",
  "statusDate": "2026-09-09",
  "budget": 7700000,
  "spendToDate": 4430000,
  "forecastSpend": 8050000,
  "currency": "EUR",
  "businessUnit": "Customer and Marketing",
  "strategicPriority": "high",
  "programStatus": "active",
  "createdAt": "2025-12-01",
  "updatedAt": "2026-09-09",
  "strategicObjectives": [
    "Redesign the customer journey end to end across app, web and contact centre",
    "Lift checkout conversion through validated, live-traffic-tested personalisation",
    "Migrate the loyalty programme without losing a single customer's balance",
    "Bring consent management to full regulatory compliance in every operating market"
  ],
  "owners": [
    {
      "id": "own-n1",
      "name": "Camille Rousseau",
      "role": "Programme Director"
    },
    {
      "id": "own-n2",
      "name": "Diego Fernandez",
      "role": "Programme Manager"
    },
    {
      "id": "own-n3",
      "name": "Aoife Byrne",
      "role": "Customer Experience Lead",
      "workstreamId": "ws-n-cx"
    },
    {
      "id": "own-n4",
      "name": "Rian Cole",
      "role": "Mobile Platform Lead",
      "workstreamId": "ws-n-app"
    },
    {
      "id": "own-n5",
      "name": "Meera Krishnan",
      "role": "Contact Centre Transformation Lead",
      "workstreamId": "ws-n-cc"
    },
    {
      "id": "own-n6",
      "name": "Tobias Hahn",
      "role": "Marketing Technology Lead",
      "workstreamId": "ws-n-mkt"
    },
    {
      "id": "own-n7",
      "name": "Layla Haddad",
      "role": "Data and Privacy Lead"
    },
    {
      "id": "own-n8",
      "name": "Connor Walsh",
      "role": "Vendor Management Lead"
    }
  ],
  "workstreams": [
    {
      "id": "ws-n-cx",
      "name": "Customer Journey Redesign",
      "code": "CX",
      "description": "Redesign of the end-to-end customer journey across web, app and contact centre.",
      "leadOwnerId": "own-n3",
      "startDate": "2025-12-01",
      "endDate": "2026-11-26",
      "budget": 2100000,
      "spendToDate": 1250000,
      "percentComplete": 62,
      "status": "in-progress"
    },
    {
      "id": "ws-n-app",
      "name": "Mobile App and Personalisation",
      "code": "APP",
      "description": "Rebuild of the customer mobile app with a new personalisation and checkout engine.",
      "leadOwnerId": "own-n4",
      "startDate": "2025-12-31",
      "endDate": "2026-12-06",
      "budget": 2600000,
      "spendToDate": 1500000,
      "percentComplete": 55,
      "status": "in-progress"
    },
    {
      "id": "ws-n-cc",
      "name": "Contact Centre Transformation",
      "code": "CC",
      "description": "New agent workflow, training and capacity model for the redesigned contact centre.",
      "leadOwnerId": "own-n5",
      "startDate": "2026-01-10",
      "endDate": "2026-11-16",
      "budget": 1400000,
      "spendToDate": 780000,
      "percentComplete": 50,
      "status": "in-progress"
    },
    {
      "id": "ws-n-mkt",
      "name": "Loyalty and Marketing Technology",
      "code": "MKT",
      "description": "Loyalty programme migration and consent-aware personalised marketing.",
      "leadOwnerId": "own-n6",
      "startDate": "2025-12-21",
      "endDate": "2026-12-01",
      "budget": 1600000,
      "spendToDate": 900000,
      "percentComplete": 46,
      "status": "in-progress"
    }
  ],
  "milestones": [
    {
      "id": "ms-n-01",
      "name": "Customer journey blueprint signed off",
      "workstreamId": "ws-n-cx",
      "ownerId": "own-n3",
      "baselineDate": "2025-12-31",
      "forecastDate": "2025-12-31",
      "status": "complete",
      "isGate": true,
      "predecessorIds": [],
      "deliverableIds": [],
      "description": "End-to-end journey blueprint agreed with all channel owners."
    },
    {
      "id": "ms-n-02",
      "name": "Usability testing round 1 complete",
      "workstreamId": "ws-n-cx",
      "ownerId": "own-n3",
      "baselineDate": "2026-03-01",
      "forecastDate": "2026-03-06",
      "status": "complete",
      "isGate": false,
      "predecessorIds": [
        "ms-n-01"
      ],
      "deliverableIds": [],
      "description": "First round of usability testing with the target customer cohort."
    },
    {
      "id": "ms-n-03",
      "name": "Mobile app beta release",
      "workstreamId": "ws-n-app",
      "ownerId": "own-n4",
      "baselineDate": "2026-05-10",
      "forecastDate": "2026-06-09",
      "status": "in-progress",
      "isGate": true,
      "predecessorIds": [
        "ms-n-02"
      ],
      "deliverableIds": [],
      "description": "Beta release of the redesigned mobile app to a limited customer cohort."
    },
    {
      "id": "ms-n-04",
      "name": "Personalisation engine live",
      "workstreamId": "ws-n-app",
      "ownerId": "own-n4",
      "baselineDate": "2026-06-29",
      "forecastDate": "2026-08-03",
      "status": "at-risk",
      "isGate": false,
      "predecessorIds": [
        "ms-n-03"
      ],
      "deliverableIds": [],
      "description": "Checkout personalisation engine live for all customers."
    },
    {
      "id": "ms-n-05",
      "name": "Agent workflow training complete",
      "workstreamId": "ws-n-cc",
      "ownerId": "own-n5",
      "baselineDate": "2026-07-29",
      "forecastDate": "2026-08-23",
      "status": "in-progress",
      "isGate": false,
      "predecessorIds": [
        "ms-n-01"
      ],
      "deliverableIds": [],
      "description": "All contact centre agents trained on the new workflow."
    },
    {
      "id": "ms-n-06",
      "name": "Loyalty programme migrated",
      "workstreamId": "ws-n-mkt",
      "ownerId": "own-n6",
      "baselineDate": "2026-06-19",
      "forecastDate": "2026-07-19",
      "status": "at-risk",
      "isGate": true,
      "predecessorIds": [],
      "deliverableIds": [],
      "description": "Customer loyalty balances migrated to the new platform."
    },
    {
      "id": "ms-n-07",
      "name": "Consent management live in all markets",
      "workstreamId": "ws-n-mkt",
      "ownerId": "own-n7",
      "baselineDate": "2026-05-30",
      "forecastDate": "2026-06-24",
      "status": "in-progress",
      "isGate": true,
      "predecessorIds": [],
      "deliverableIds": [],
      "description": "Consent capture and enforcement live in every operating market."
    },
    {
      "id": "ms-n-08",
      "name": "Customer launch",
      "workstreamId": "ws-n-cx",
      "ownerId": "own-n1",
      "baselineDate": "2026-09-27",
      "forecastDate": "2026-11-06",
      "status": "at-risk",
      "isGate": true,
      "predecessorIds": [
        "ms-n-04",
        "ms-n-05"
      ],
      "deliverableIds": [],
      "description": "Full customer-facing launch, the fulcrum milestone that receives ATLAS/ORION integration slip and depends on ORION's carrier integration being live."
    },
    {
      "id": "ms-n-09",
      "name": "Contact centre capacity ramp complete",
      "workstreamId": "ws-n-cc",
      "ownerId": "own-n5",
      "baselineDate": "2026-10-17",
      "forecastDate": "2026-11-11",
      "status": "not-started",
      "isGate": false,
      "predecessorIds": [
        "ms-n-05",
        "ms-n-08"
      ],
      "deliverableIds": [],
      "description": "Contact centre scaled to handle post-launch ticket volume."
    },
    {
      "id": "ms-n-10",
      "name": "Post-launch conversion review",
      "workstreamId": "ws-n-app",
      "ownerId": "own-n4",
      "baselineDate": "2026-11-26",
      "forecastDate": "2026-12-16",
      "status": "not-started",
      "isGate": false,
      "predecessorIds": [
        "ms-n-08"
      ],
      "deliverableIds": [],
      "description": "First conversion and satisfaction review after full launch."
    }
  ],
  "deliverables": [
    {
      "id": "dlv-n-01",
      "name": "Customer journey blueprint document",
      "milestoneId": "ms-n-01",
      "ownerId": "own-n3",
      "dueDate": "2025-12-29",
      "status": "complete",
      "percentComplete": 100,
      "acceptanceCriteria": "Blueprint signed by every channel owner."
    },
    {
      "id": "dlv-n-02",
      "name": "Usability test report round 1",
      "milestoneId": "ms-n-02",
      "ownerId": "own-n3",
      "dueDate": "2026-03-04",
      "status": "complete",
      "percentComplete": 100,
      "acceptanceCriteria": "Findings incorporated into the design backlog."
    },
    {
      "id": "dlv-n-03",
      "name": "Mobile app beta build",
      "milestoneId": "ms-n-03",
      "ownerId": "own-n4",
      "dueDate": "2026-06-04",
      "status": "in-progress",
      "percentComplete": 75,
      "acceptanceCriteria": "Beta build passes app store pre-review."
    },
    {
      "id": "dlv-n-04",
      "name": "Personalisation engine integration",
      "milestoneId": "ms-n-04",
      "ownerId": "own-n4",
      "dueDate": "2026-07-29",
      "status": "in-progress",
      "percentComplete": 55,
      "acceptanceCriteria": "Engine integrated with checkout and A/B test infrastructure."
    },
    {
      "id": "dlv-n-05",
      "name": "Agent workflow training pack",
      "milestoneId": "ms-n-05",
      "ownerId": "own-n5",
      "dueDate": "2026-08-18",
      "status": "in-progress",
      "percentComplete": 60,
      "acceptanceCriteria": "Training pack covers every new workflow path."
    },
    {
      "id": "dlv-n-06",
      "name": "Loyalty balance migration report",
      "milestoneId": "ms-n-06",
      "ownerId": "own-n6",
      "dueDate": "2026-07-14",
      "status": "in-progress",
      "percentComplete": 45,
      "acceptanceCriteria": "Reconciliation report for every migrated customer segment."
    },
    {
      "id": "dlv-n-07",
      "name": "Consent management rollout plan",
      "milestoneId": "ms-n-07",
      "ownerId": "own-n7",
      "dueDate": "2026-06-19",
      "status": "in-progress",
      "percentComplete": 70,
      "acceptanceCriteria": "Rollout plan covering all regulatory regimes in scope."
    },
    {
      "id": "dlv-n-08",
      "name": "Launch readiness pack",
      "milestoneId": "ms-n-08",
      "ownerId": "own-n1",
      "dueDate": "2026-11-01",
      "status": "in-progress",
      "percentComplete": 30,
      "acceptanceCriteria": "Go/no-go pack for the full customer launch."
    }
  ],
  "risks": [
    {
      "id": "rsk-01",
      "ref": "NOV-01",
      "title": "Customer app redesign fails usability testing with the target cohort",
      "description": "The first usability round recruited a convenience sample skewed to power users; the redesign failed on three of five target tasks with typical customers.",
      "category": "delivery",
      "ownerId": "own-n3",
      "workstreamId": "ws-n-cx",
      "status": "monitoring",
      "dateIdentified": "2026-03-03",
      "reviewDate": "2026-09-27",
      "strategy": "mitigate",
      "inherentProbability": 0.35,
      "inherentImpact": 3,
      "inherentFinancialImpact": 380000,
      "inherentScheduleImpactDays": 10,
      "strategicImpact": 3,
      "reputationImpact": 3,
      "timeHorizon": "near",
      "evidenceConfidence": "measured",
      "controlIds": [
        "ctl-n01"
      ],
      "causeIds": [
        "cse-n1"
      ],
      "actionIds": [
        "act-n01"
      ],
      "affectedMilestoneIds": [
        "ms-n-02"
      ],
      "affectedBenefitIds": [
        "ben-n03"
      ],
      "dependencyIds": [],
      "issueIds": [
        "iss-n01"
      ],
      "evidence": [],
      "comments": [],
      "tags": [
        "ux",
        "customer-impact"
      ],
      "history": [
        {
          "date": "2026-03-03",
          "probability": 0.6,
          "impactScore": 4,
          "financialExposure": 700000
        },
        {
          "date": "2026-08-08",
          "probability": 0.35,
          "impactScore": 3,
          "financialExposure": 380000
        }
      ]
    },
    {
      "id": "rsk-03",
      "ref": "NOV-03",
      "title": "Contact centre agents are not trained ahead of the new workflow launch",
      "description": "Training content could not be finalised until the workflow design was frozen, which happened later than planned, compressing the training window before launch.",
      "category": "people",
      "ownerId": "own-n5",
      "workstreamId": "ws-n-cc",
      "status": "escalated",
      "dateIdentified": "2026-07-29",
      "reviewDate": "2026-10-07",
      "strategy": "mitigate",
      "inherentProbability": 0.55,
      "inherentImpact": 4,
      "inherentFinancialImpact": 260000,
      "inherentScheduleImpactDays": 14,
      "strategicImpact": 3,
      "reputationImpact": 3,
      "timeHorizon": "immediate",
      "evidenceConfidence": "verified",
      "controlIds": [
        "ctl-n02"
      ],
      "causeIds": [
        "cse-n2"
      ],
      "actionIds": [
        "act-n02"
      ],
      "affectedMilestoneIds": [
        "ms-n-05"
      ],
      "affectedBenefitIds": [
        "ben-n02"
      ],
      "dependencyIds": [],
      "issueIds": [],
      "evidence": [],
      "comments": [],
      "tags": [
        "people",
        "critical-path"
      ],
      "history": [
        {
          "date": "2026-07-29",
          "probability": 0.65,
          "impactScore": 4,
          "financialExposure": 320000
        },
        {
          "date": "2026-09-07",
          "probability": 0.55,
          "impactScore": 4,
          "financialExposure": 260000
        }
      ]
    },
    {
      "id": "rsk-06",
      "ref": "NOV-06",
      "title": "Personalisation engine recommendations degrade checkout conversion",
      "description": "The recommendation model was tuned on a synthetic dataset and has not yet been validated against real customer behaviour; a live-traffic shadow test is under way.",
      "category": "technology",
      "ownerId": "own-n4",
      "workstreamId": "ws-n-app",
      "status": "monitoring",
      "dateIdentified": "2026-07-19",
      "reviewDate": "2026-10-02",
      "strategy": "mitigate",
      "inherentProbability": 0.4,
      "inherentImpact": 4,
      "inherentFinancialImpact": 520000,
      "inherentScheduleImpactDays": 8,
      "strategicImpact": 3,
      "reputationImpact": 2,
      "timeHorizon": "near",
      "evidenceConfidence": "measured",
      "controlIds": [
        "ctl-n03"
      ],
      "causeIds": [
        "cse-n3"
      ],
      "actionIds": [
        "act-n03"
      ],
      "affectedMilestoneIds": [
        "ms-n-04"
      ],
      "affectedBenefitIds": [
        "ben-n01"
      ],
      "dependencyIds": [],
      "issueIds": [],
      "evidence": [],
      "comments": [],
      "tags": [
        "technology",
        "customer-impact"
      ],
      "history": [
        {
          "date": "2026-07-19",
          "probability": 0.5,
          "impactScore": 4,
          "financialExposure": 600000
        },
        {
          "date": "2026-09-17",
          "probability": 0.4,
          "impactScore": 4,
          "financialExposure": 520000
        }
      ]
    },
    {
      "id": "rsk-09",
      "ref": "NOV-09",
      "title": "Loyalty programme migration loses point balances for a customer segment",
      "description": "The migration script does not correctly handle multi-currency balances; a dry run found discrepancies before any production migration occurred.",
      "category": "operational",
      "ownerId": "own-n6",
      "workstreamId": "ws-n-mkt",
      "status": "monitoring",
      "dateIdentified": "2026-07-07",
      "reviewDate": "2026-09-27",
      "strategy": "mitigate",
      "inherentProbability": 0.3,
      "inherentImpact": 5,
      "inherentFinancialImpact": 640000,
      "inherentScheduleImpactDays": 15,
      "strategicImpact": 3,
      "reputationImpact": 5,
      "timeHorizon": "near",
      "evidenceConfidence": "verified",
      "controlIds": [
        "ctl-n04"
      ],
      "causeIds": [
        "cse-n4"
      ],
      "actionIds": [
        "act-n04"
      ],
      "affectedMilestoneIds": [
        "ms-n-06"
      ],
      "affectedBenefitIds": [
        "ben-n04"
      ],
      "dependencyIds": [],
      "issueIds": [
        "iss-n02"
      ],
      "evidence": [],
      "comments": [],
      "tags": [
        "customer-impact",
        "compliance"
      ],
      "history": [
        {
          "date": "2026-07-07",
          "probability": 0.55,
          "impactScore": 5,
          "financialExposure": 900000
        },
        {
          "date": "2026-07-14",
          "probability": 0.3,
          "impactScore": 5,
          "financialExposure": 640000
        }
      ]
    },
    {
      "id": "rsk-15",
      "ref": "NOV-15",
      "title": "Consent management gaps block personalised marketing in two markets",
      "description": "The consent capture flow was designed and legally validated for the home market only; two other in-scope markets have not yet been re-validated against local regulation.",
      "category": "regulatory",
      "ownerId": "own-n7",
      "workstreamId": "ws-n-mkt",
      "status": "escalated",
      "dateIdentified": "2026-06-14",
      "reviewDate": "2026-09-22",
      "strategy": "mitigate",
      "inherentProbability": 0.5,
      "inherentImpact": 4,
      "inherentFinancialImpact": 460000,
      "inherentScheduleImpactDays": 18,
      "strategicImpact": 4,
      "reputationImpact": 4,
      "timeHorizon": "immediate",
      "evidenceConfidence": "verified",
      "controlIds": [
        "ctl-n05"
      ],
      "causeIds": [
        "cse-n5"
      ],
      "actionIds": [
        "act-n05"
      ],
      "affectedMilestoneIds": [
        "ms-n-07"
      ],
      "affectedBenefitIds": [],
      "dependencyIds": [
        "dep-n06"
      ],
      "issueIds": [
        "iss-n03"
      ],
      "evidence": [],
      "comments": [],
      "tags": [
        "regulatory",
        "critical-path"
      ],
      "history": [
        {
          "date": "2026-06-14",
          "probability": 0.65,
          "impactScore": 4,
          "financialExposure": 600000
        },
        {
          "date": "2026-07-19",
          "probability": 0.5,
          "impactScore": 4,
          "financialExposure": 460000
        }
      ]
    },
    {
      "id": "rsk-02",
      "ref": "NOV-02",
      "title": "Customer app redesign fails usability testing with the target cohort",
      "description": "Customer app redesign fails usability testing with the target cohort.",
      "category": "delivery",
      "ownerId": "own-n1",
      "workstreamId": "ws-n-cx",
      "status": "monitoring",
      "dateIdentified": "2025-12-19",
      "reviewDate": "2026-09-07",
      "strategy": "mitigate",
      "inherentProbability": 0.2,
      "inherentImpact": 2,
      "inherentFinancialImpact": 60000,
      "inherentScheduleImpactDays": 4,
      "strategicImpact": 2,
      "reputationImpact": 1,
      "timeHorizon": "immediate",
      "evidenceConfidence": "measured",
      "controlIds": [],
      "causeIds": [],
      "actionIds": [],
      "affectedMilestoneIds": [
        "ms-n-01"
      ],
      "affectedBenefitIds": [],
      "dependencyIds": [],
      "issueIds": [],
      "evidence": [],
      "comments": [],
      "tags": [
        "nova",
        "people"
      ],
      "history": [
        {
          "date": "2025-12-26",
          "probability": 0.1,
          "impactScore": 1,
          "financialExposure": 45000
        },
        {
          "date": "2026-02-19",
          "probability": 0.2,
          "impactScore": 2,
          "financialExposure": 60000
        }
      ]
    },
    {
      "id": "rsk-04",
      "ref": "NOV-04",
      "title": "Contact centre agents are not trained ahead of the new workflow launch",
      "description": "Contact centre agents are not trained ahead of the new workflow launch.",
      "category": "people",
      "ownerId": "own-n2",
      "workstreamId": "ws-n-app",
      "status": "open",
      "dateIdentified": "2025-12-24",
      "reviewDate": "2026-09-10",
      "strategy": "mitigate",
      "inherentProbability": 0.27,
      "inherentImpact": 3,
      "inherentFinancialImpact": 101000,
      "inherentScheduleImpactDays": 6,
      "strategicImpact": 3,
      "reputationImpact": 2,
      "timeHorizon": "near",
      "evidenceConfidence": "verified",
      "controlIds": [],
      "causeIds": [],
      "actionIds": [],
      "affectedMilestoneIds": [
        "ms-n-02"
      ],
      "affectedBenefitIds": [],
      "dependencyIds": [],
      "issueIds": [],
      "evidence": [],
      "comments": [],
      "tags": [
        "nova",
        "technology"
      ],
      "history": [
        {
          "date": "2026-01-01",
          "probability": 0.15000000000000002,
          "impactScore": 2,
          "financialExposure": 75750
        },
        {
          "date": "2026-02-25",
          "probability": 0.27,
          "impactScore": 3,
          "financialExposure": 101000
        }
      ]
    },
    {
      "id": "rsk-05",
      "ref": "NOV-05",
      "title": "Personalisation engine recommendations degrade checkout conversion",
      "description": "Personalisation engine recommendations degrade checkout conversion.",
      "category": "technology",
      "ownerId": "own-n3",
      "workstreamId": "ws-n-cc",
      "status": "open",
      "dateIdentified": "2025-12-29",
      "reviewDate": "2026-09-13",
      "strategy": "mitigate",
      "inherentProbability": 0.33,
      "inherentImpact": 4,
      "inherentFinancialImpact": 142000,
      "inherentScheduleImpactDays": 8,
      "strategicImpact": 4,
      "reputationImpact": 3,
      "timeHorizon": "near",
      "evidenceConfidence": "indicative",
      "controlIds": [],
      "causeIds": [],
      "actionIds": [],
      "affectedMilestoneIds": [
        "ms-n-03"
      ],
      "affectedBenefitIds": [],
      "dependencyIds": [],
      "issueIds": [],
      "evidence": [],
      "comments": [],
      "tags": [
        "nova",
        "operational"
      ],
      "history": [
        {
          "date": "2026-01-07",
          "probability": 0.21000000000000002,
          "impactScore": 3,
          "financialExposure": 106500
        },
        {
          "date": "2026-03-03",
          "probability": 0.33,
          "impactScore": 4,
          "financialExposure": 142000
        }
      ]
    },
    {
      "id": "rsk-07",
      "ref": "NOV-07",
      "title": "Loyalty programme migration loses point balances for a customer segment",
      "description": "Loyalty programme migration loses point balances for a customer segment.",
      "category": "operational",
      "ownerId": "own-n4",
      "workstreamId": "ws-n-mkt",
      "status": "monitoring",
      "dateIdentified": "2026-01-03",
      "reviewDate": "2026-09-16",
      "strategy": "transfer",
      "inherentProbability": 0.4,
      "inherentImpact": 5,
      "inherentFinancialImpact": 183000,
      "inherentScheduleImpactDays": 10,
      "strategicImpact": 2,
      "reputationImpact": 4,
      "timeHorizon": "mid",
      "evidenceConfidence": "anecdotal",
      "controlIds": [],
      "causeIds": [],
      "actionIds": [],
      "affectedMilestoneIds": [
        "ms-n-04"
      ],
      "affectedBenefitIds": [],
      "dependencyIds": [],
      "issueIds": [],
      "evidence": [],
      "comments": [],
      "tags": [
        "nova",
        "regulatory"
      ],
      "history": [
        {
          "date": "2026-01-13",
          "probability": 0.28,
          "impactScore": 4,
          "financialExposure": 137250
        },
        {
          "date": "2026-03-09",
          "probability": 0.4,
          "impactScore": 5,
          "financialExposure": 183000
        }
      ]
    },
    {
      "id": "rsk-08",
      "ref": "NOV-08",
      "title": "Consent management gaps block personalised marketing in two markets",
      "description": "Consent management gaps block personalised marketing in two markets.",
      "category": "regulatory",
      "ownerId": "own-n5",
      "workstreamId": "ws-n-cx",
      "status": "open",
      "dateIdentified": "2026-01-08",
      "reviewDate": "2026-09-19",
      "strategy": "accept",
      "inherentProbability": 0.46,
      "inherentImpact": 2,
      "inherentFinancialImpact": 224000,
      "inherentScheduleImpactDays": 12,
      "strategicImpact": 3,
      "reputationImpact": 1,
      "timeHorizon": "far",
      "evidenceConfidence": "measured",
      "controlIds": [],
      "causeIds": [],
      "actionIds": [],
      "affectedMilestoneIds": [
        "ms-n-05"
      ],
      "affectedBenefitIds": [],
      "dependencyIds": [],
      "issueIds": [],
      "evidence": [],
      "comments": [],
      "tags": [
        "nova",
        "vendor"
      ],
      "history": [
        {
          "date": "2026-01-19",
          "probability": 0.34,
          "impactScore": 1,
          "financialExposure": 168000
        },
        {
          "date": "2026-03-15",
          "probability": 0.46,
          "impactScore": 2,
          "financialExposure": 224000
        }
      ]
    },
    {
      "id": "rsk-10",
      "ref": "NOV-10",
      "title": "Customer data platform vendor delays the identity resolution milestone",
      "description": "Customer data platform vendor delays the identity resolution milestone.",
      "category": "vendor",
      "ownerId": "own-n6",
      "workstreamId": "ws-n-app",
      "status": "open",
      "dateIdentified": "2026-01-13",
      "reviewDate": "2026-09-22",
      "strategy": "mitigate",
      "inherentProbability": 0.53,
      "inherentImpact": 3,
      "inherentFinancialImpact": 265000,
      "inherentScheduleImpactDays": 14,
      "strategicImpact": 4,
      "reputationImpact": 2,
      "timeHorizon": "immediate",
      "evidenceConfidence": "verified",
      "controlIds": [],
      "causeIds": [],
      "actionIds": [],
      "affectedMilestoneIds": [
        "ms-n-06"
      ],
      "affectedBenefitIds": [],
      "dependencyIds": [],
      "issueIds": [],
      "evidence": [],
      "comments": [],
      "tags": [
        "nova",
        "data"
      ],
      "history": [
        {
          "date": "2026-01-25",
          "probability": 0.41000000000000003,
          "impactScore": 2,
          "financialExposure": 198750
        },
        {
          "date": "2026-03-21",
          "probability": 0.53,
          "impactScore": 3,
          "financialExposure": 265000
        }
      ]
    },
    {
      "id": "rsk-11",
      "ref": "NOV-11",
      "title": "Voice-of-customer survey response rate is too low to validate the redesign",
      "description": "Voice-of-customer survey response rate is too low to validate the redesign.",
      "category": "data",
      "ownerId": "own-n7",
      "workstreamId": "ws-n-cc",
      "status": "monitoring",
      "dateIdentified": "2026-01-18",
      "reviewDate": "2026-09-25",
      "strategy": "mitigate",
      "inherentProbability": 0.59,
      "inherentImpact": 4,
      "inherentFinancialImpact": 306000,
      "inherentScheduleImpactDays": 16,
      "strategicImpact": 2,
      "reputationImpact": 3,
      "timeHorizon": "near",
      "evidenceConfidence": "indicative",
      "controlIds": [],
      "causeIds": [],
      "actionIds": [],
      "affectedMilestoneIds": [
        "ms-n-07"
      ],
      "affectedBenefitIds": [],
      "dependencyIds": [],
      "issueIds": [],
      "evidence": [],
      "comments": [],
      "tags": [
        "nova",
        "delivery"
      ],
      "history": [
        {
          "date": "2026-01-31",
          "probability": 0.47,
          "impactScore": 3,
          "financialExposure": 229500
        },
        {
          "date": "2026-03-27",
          "probability": 0.59,
          "impactScore": 4,
          "financialExposure": 306000
        }
      ]
    },
    {
      "id": "rsk-12",
      "ref": "NOV-12",
      "title": "Mobile app store review rejects the release ahead of the launch date",
      "description": "Mobile app store review rejects the release ahead of the launch date.",
      "category": "delivery",
      "ownerId": "own-n8",
      "workstreamId": "ws-n-mkt",
      "status": "open",
      "dateIdentified": "2026-01-23",
      "reviewDate": "2026-09-28",
      "strategy": "mitigate",
      "inherentProbability": 0.66,
      "inherentImpact": 5,
      "inherentFinancialImpact": 347000,
      "inherentScheduleImpactDays": 18,
      "strategicImpact": 3,
      "reputationImpact": 4,
      "timeHorizon": "near",
      "evidenceConfidence": "anecdotal",
      "controlIds": [],
      "causeIds": [],
      "actionIds": [],
      "affectedMilestoneIds": [
        "ms-n-08"
      ],
      "affectedBenefitIds": [],
      "dependencyIds": [],
      "issueIds": [],
      "evidence": [],
      "comments": [],
      "tags": [
        "nova",
        "operational"
      ],
      "history": [
        {
          "date": "2026-02-06",
          "probability": 0.54,
          "impactScore": 4,
          "financialExposure": 260250
        },
        {
          "date": "2026-04-02",
          "probability": 0.66,
          "impactScore": 5,
          "financialExposure": 347000
        }
      ]
    },
    {
      "id": "rsk-13",
      "ref": "NOV-13",
      "title": "Customer support ticket volume spikes beyond the new workflow's capacity",
      "description": "Customer support ticket volume spikes beyond the new workflow's capacity.",
      "category": "operational",
      "ownerId": "own-n1",
      "workstreamId": "ws-n-cx",
      "status": "open",
      "dateIdentified": "2026-01-28",
      "reviewDate": "2026-10-01",
      "strategy": "transfer",
      "inherentProbability": 0.72,
      "inherentImpact": 2,
      "inherentFinancialImpact": 388000,
      "inherentScheduleImpactDays": 20,
      "strategicImpact": 4,
      "reputationImpact": 1,
      "timeHorizon": "mid",
      "evidenceConfidence": "measured",
      "controlIds": [],
      "causeIds": [],
      "actionIds": [],
      "affectedMilestoneIds": [
        "ms-n-09"
      ],
      "affectedBenefitIds": [],
      "dependencyIds": [],
      "issueIds": [],
      "evidence": [],
      "comments": [],
      "tags": [
        "nova",
        "delivery"
      ],
      "history": [
        {
          "date": "2026-02-12",
          "probability": 0.6,
          "impactScore": 1,
          "financialExposure": 291000
        },
        {
          "date": "2026-04-08",
          "probability": 0.72,
          "impactScore": 2,
          "financialExposure": 388000
        }
      ]
    },
    {
      "id": "rsk-14",
      "ref": "NOV-14",
      "title": "Brand and legal sign-off on new messaging is delayed past the campaign date",
      "description": "Brand and legal sign-off on new messaging is delayed past the campaign date.",
      "category": "delivery",
      "ownerId": "own-n2",
      "workstreamId": "ws-n-app",
      "status": "monitoring",
      "dateIdentified": "2026-02-02",
      "reviewDate": "2026-10-04",
      "strategy": "accept",
      "inherentProbability": 0.79,
      "inherentImpact": 3,
      "inherentFinancialImpact": 429000,
      "inherentScheduleImpactDays": 22,
      "strategicImpact": 2,
      "reputationImpact": 2,
      "timeHorizon": "far",
      "evidenceConfidence": "verified",
      "controlIds": [],
      "causeIds": [],
      "actionIds": [],
      "affectedMilestoneIds": [
        "ms-n-10"
      ],
      "affectedBenefitIds": [],
      "dependencyIds": [],
      "issueIds": [],
      "evidence": [],
      "comments": [],
      "tags": [
        "nova",
        "technology"
      ],
      "history": [
        {
          "date": "2026-02-18",
          "probability": 0.67,
          "impactScore": 2,
          "financialExposure": 321750
        },
        {
          "date": "2026-04-14",
          "probability": 0.79,
          "impactScore": 3,
          "financialExposure": 429000
        }
      ]
    },
    {
      "id": "rsk-16",
      "ref": "NOV-16",
      "title": "A/B test infrastructure cannot reliably attribute conversion lift",
      "description": "A/B test infrastructure cannot reliably attribute conversion lift.",
      "category": "technology",
      "ownerId": "own-n3",
      "workstreamId": "ws-n-cc",
      "status": "open",
      "dateIdentified": "2026-02-07",
      "reviewDate": "2026-10-07",
      "strategy": "mitigate",
      "inherentProbability": 0.2,
      "inherentImpact": 4,
      "inherentFinancialImpact": 470000,
      "inherentScheduleImpactDays": 24,
      "strategicImpact": 3,
      "reputationImpact": 3,
      "timeHorizon": "immediate",
      "evidenceConfidence": "indicative",
      "controlIds": [],
      "causeIds": [],
      "actionIds": [],
      "affectedMilestoneIds": [
        "ms-n-01"
      ],
      "affectedBenefitIds": [],
      "dependencyIds": [],
      "issueIds": [],
      "evidence": [],
      "comments": [],
      "tags": [
        "nova",
        "security"
      ],
      "history": [
        {
          "date": "2026-02-24",
          "probability": 0.1,
          "impactScore": 3,
          "financialExposure": 352500
        },
        {
          "date": "2026-04-20",
          "probability": 0.2,
          "impactScore": 4,
          "financialExposure": 470000
        }
      ]
    },
    {
      "id": "rsk-17",
      "ref": "NOV-17",
      "title": "Third-party payment provider integration fails PCI compliance review",
      "description": "Third-party payment provider integration fails PCI compliance review.",
      "category": "security",
      "ownerId": "own-n4",
      "workstreamId": "ws-n-mkt",
      "status": "open",
      "dateIdentified": "2026-02-12",
      "reviewDate": "2026-10-10",
      "strategy": "mitigate",
      "inherentProbability": 0.27,
      "inherentImpact": 5,
      "inherentFinancialImpact": 511000,
      "inherentScheduleImpactDays": 26,
      "strategicImpact": 4,
      "reputationImpact": 4,
      "timeHorizon": "near",
      "evidenceConfidence": "anecdotal",
      "controlIds": [],
      "causeIds": [],
      "actionIds": [],
      "affectedMilestoneIds": [
        "ms-n-02"
      ],
      "affectedBenefitIds": [],
      "dependencyIds": [],
      "issueIds": [],
      "evidence": [],
      "comments": [],
      "tags": [
        "nova",
        "data"
      ],
      "history": [
        {
          "date": "2026-03-02",
          "probability": 0.15000000000000002,
          "impactScore": 4,
          "financialExposure": 383250
        },
        {
          "date": "2026-04-26",
          "probability": 0.27,
          "impactScore": 5,
          "financialExposure": 511000
        }
      ]
    },
    {
      "id": "rsk-18",
      "ref": "NOV-18",
      "title": "Customer segmentation model uses stale data from the legacy CRM",
      "description": "Customer segmentation model uses stale data from the legacy CRM.",
      "category": "data",
      "ownerId": "own-n5",
      "workstreamId": "ws-n-cx",
      "status": "monitoring",
      "dateIdentified": "2026-02-17",
      "reviewDate": "2026-10-13",
      "strategy": "mitigate",
      "inherentProbability": 0.33,
      "inherentImpact": 2,
      "inherentFinancialImpact": 552000,
      "inherentScheduleImpactDays": 28,
      "strategicImpact": 2,
      "reputationImpact": 1,
      "timeHorizon": "near",
      "evidenceConfidence": "measured",
      "controlIds": [],
      "causeIds": [],
      "actionIds": [],
      "affectedMilestoneIds": [
        "ms-n-03"
      ],
      "affectedBenefitIds": [],
      "dependencyIds": [],
      "issueIds": [],
      "evidence": [],
      "comments": [],
      "tags": [
        "nova",
        "financial"
      ],
      "history": [
        {
          "date": "2026-03-08",
          "probability": 0.21000000000000002,
          "impactScore": 1,
          "financialExposure": 414000
        },
        {
          "date": "2026-05-02",
          "probability": 0.33,
          "impactScore": 2,
          "financialExposure": 552000
        }
      ]
    },
    {
      "id": "rsk-19",
      "ref": "NOV-19",
      "title": "Regional pricing engine miscalculates promotional discounts at launch",
      "description": "Regional pricing engine miscalculates promotional discounts at launch.",
      "category": "financial",
      "ownerId": "own-n6",
      "workstreamId": "ws-n-app",
      "status": "open",
      "dateIdentified": "2026-02-22",
      "reviewDate": "2026-10-16",
      "strategy": "transfer",
      "inherentProbability": 0.4,
      "inherentImpact": 3,
      "inherentFinancialImpact": 593000,
      "inherentScheduleImpactDays": 30,
      "strategicImpact": 3,
      "reputationImpact": 2,
      "timeHorizon": "mid",
      "evidenceConfidence": "verified",
      "controlIds": [],
      "causeIds": [],
      "actionIds": [],
      "affectedMilestoneIds": [
        "ms-n-04"
      ],
      "affectedBenefitIds": [],
      "dependencyIds": [],
      "issueIds": [],
      "evidence": [],
      "comments": [],
      "tags": [
        "nova",
        "financial"
      ],
      "history": [
        {
          "date": "2026-03-14",
          "probability": 0.28,
          "impactScore": 2,
          "financialExposure": 444750
        },
        {
          "date": "2026-05-08",
          "probability": 0.4,
          "impactScore": 3,
          "financialExposure": 593000
        }
      ]
    },
    {
      "id": "rsk-20",
      "ref": "NOV-20",
      "title": "Customer journey orchestration tool licence costs exceed budget",
      "description": "Customer journey orchestration tool licence costs exceed budget.",
      "category": "financial",
      "ownerId": "own-n7",
      "workstreamId": "ws-n-cc",
      "status": "open",
      "dateIdentified": "2026-02-27",
      "reviewDate": "2026-10-19",
      "strategy": "accept",
      "inherentProbability": 0.46,
      "inherentImpact": 4,
      "inherentFinancialImpact": 634000,
      "inherentScheduleImpactDays": 32,
      "strategicImpact": 4,
      "reputationImpact": 3,
      "timeHorizon": "far",
      "evidenceConfidence": "indicative",
      "controlIds": [],
      "causeIds": [],
      "actionIds": [],
      "affectedMilestoneIds": [
        "ms-n-05"
      ],
      "affectedBenefitIds": [],
      "dependencyIds": [],
      "issueIds": [],
      "evidence": [],
      "comments": [],
      "tags": [
        "nova",
        "people"
      ],
      "history": [
        {
          "date": "2026-03-20",
          "probability": 0.34,
          "impactScore": 3,
          "financialExposure": 475500
        },
        {
          "date": "2026-05-14",
          "probability": 0.46,
          "impactScore": 4,
          "financialExposure": 634000
        }
      ]
    }
  ],
  "causes": [
    {
      "id": "cse-n1",
      "ref": "NOV-C-01",
      "title": "Usability testing recruited too narrow a customer cohort",
      "description": "Why did the redesign fail testing? The cohort skewed to power users, not typical customers.",
      "category": "process",
      "isRootCause": true,
      "whyChain": [
        "Why did the redesign fail testing? The cohort skewed to power users, not typical customers."
      ],
      "frequency": 7,
      "linkedRiskIds": [
        "rsk-01",
        "rsk-11"
      ],
      "linkedIssueIds": [],
      "ownerId": "own-n3"
    },
    {
      "id": "cse-n2",
      "ref": "NOV-C-02",
      "title": "Contact centre training schedule was built before the workflow was finalised",
      "description": "Why are agents untrained? Training content could not be finalised until the workflow was frozen, which happened late.",
      "category": "process",
      "isRootCause": true,
      "whyChain": [
        "Why are agents untrained? Training content could not be finalised until the workflow was frozen, which happened late."
      ],
      "frequency": 6,
      "linkedRiskIds": [
        "rsk-03",
        "rsk-14"
      ],
      "linkedIssueIds": [],
      "ownerId": "own-n5"
    },
    {
      "id": "cse-n3",
      "ref": "NOV-C-03",
      "title": "Personalisation engine was tuned on a synthetic dataset, not live traffic",
      "description": "Why is conversion degrading? The model was never validated against real customer behaviour before launch.",
      "category": "technology",
      "isRootCause": true,
      "whyChain": [
        "Why is conversion degrading? The model was never validated against real customer behaviour before launch."
      ],
      "frequency": 5,
      "linkedRiskIds": [
        "rsk-06"
      ],
      "linkedIssueIds": [],
      "ownerId": "own-n4"
    },
    {
      "id": "cse-n4",
      "ref": "NOV-C-04",
      "title": "Loyalty platform migration script does not handle multi-currency balances",
      "description": "Why are balances lost? The migration script assumes single-currency accounts.",
      "category": "technology",
      "isRootCause": true,
      "whyChain": [
        "Why are balances lost? The migration script assumes single-currency accounts."
      ],
      "frequency": 5,
      "linkedRiskIds": [
        "rsk-09"
      ],
      "linkedIssueIds": [],
      "ownerId": "own-n6"
    },
    {
      "id": "cse-n5",
      "ref": "NOV-C-05",
      "title": "Consent capture flow was designed against one market's regulation only",
      "description": "Why is consent non-compliant elsewhere? The flow was designed for the home market and not re-validated per market.",
      "category": "policy",
      "isRootCause": true,
      "whyChain": [
        "Why is consent non-compliant elsewhere? The flow was designed for the home market and not re-validated per market."
      ],
      "frequency": 4,
      "linkedRiskIds": [
        "rsk-15"
      ],
      "linkedIssueIds": [],
      "ownerId": "own-n7"
    },
    {
      "id": "cse-n6",
      "ref": "NOV-C-06",
      "title": "Customer data platform vendor underestimated identity resolution complexity",
      "description": "Why is the vendor late? Their original estimate assumed clean source data, which was not true here.",
      "category": "technology",
      "isRootCause": false,
      "whyChain": [
        "Why is the vendor late? Their original estimate assumed clean source data, which was not true here."
      ],
      "frequency": 4,
      "linkedRiskIds": [
        "rsk-08"
      ],
      "linkedIssueIds": [],
      "ownerId": "own-n8"
    }
  ],
  "controls": [
    {
      "id": "ctl-n01",
      "ref": "NOV-CTL-01",
      "name": "Widened usability panel with representative recruitment",
      "description": "Recruitment broadened to match the real customer base, not just power users.",
      "type": "corrective",
      "ownerId": "own-n3",
      "frequency": "monthly",
      "designEffectiveness": 0.65,
      "operatingEffectiveness": 0.55,
      "evidenceRef": "panel report",
      "automated": false,
      "linkedRiskIds": [
        "rsk-01",
        "rsk-11"
      ],
      "status": "active",
      "lastTested": "2026-07-29",
      "nextTest": "2026-08-28"
    },
    {
      "id": "ctl-n02",
      "ref": "NOV-CTL-02",
      "name": "Workflow freeze gate before training content lock",
      "description": "Training content cannot be finalised until the workflow is formally frozen.",
      "type": "preventive",
      "ownerId": "own-n5",
      "frequency": "event-driven",
      "designEffectiveness": 0.7,
      "operatingEffectiveness": 0.6,
      "evidenceRef": "gate log",
      "automated": false,
      "linkedRiskIds": [
        "rsk-03",
        "rsk-14"
      ],
      "status": "active"
    },
    {
      "id": "ctl-n03",
      "ref": "NOV-CTL-03",
      "name": "Live-traffic shadow testing for the personalisation engine",
      "description": "Model recommendations run in shadow against live traffic before going live.",
      "type": "detective",
      "ownerId": "own-n4",
      "frequency": "continuous",
      "designEffectiveness": 0.75,
      "operatingEffectiveness": 0.65,
      "evidenceRef": "shadow test dashboard",
      "automated": true,
      "linkedRiskIds": [
        "rsk-06"
      ],
      "status": "active",
      "lastTested": "2026-07-19"
    },
    {
      "id": "ctl-n04",
      "ref": "NOV-CTL-04",
      "name": "Multi-currency migration dry run with reconciliation",
      "description": "Full dry run of the migration script against multi-currency test accounts.",
      "type": "preventive",
      "ownerId": "own-n6",
      "frequency": "weekly",
      "designEffectiveness": 0.7,
      "operatingEffectiveness": 0.6,
      "evidenceRef": "reconciliation log",
      "automated": false,
      "linkedRiskIds": [
        "rsk-09"
      ],
      "status": "active",
      "lastTested": "2026-07-09",
      "nextTest": "2026-08-08"
    },
    {
      "id": "ctl-n05",
      "ref": "NOV-CTL-05",
      "name": "Per-market consent flow legal review",
      "description": "Each market's consent flow reviewed against local regulation before launch.",
      "type": "preventive",
      "ownerId": "own-n7",
      "frequency": "quarterly",
      "designEffectiveness": 0.75,
      "operatingEffectiveness": 0.65,
      "evidenceRef": "legal sign-off log",
      "automated": false,
      "linkedRiskIds": [
        "rsk-15"
      ],
      "status": "active",
      "lastTested": "2026-06-09",
      "nextTest": "2026-07-09"
    },
    {
      "id": "ctl-n06",
      "ref": "NOV-CTL-06",
      "name": "Vendor identity-resolution data quality remediation plan",
      "description": "Joint remediation plan with the vendor to clean source data before resolution runs.",
      "type": "corrective",
      "ownerId": "own-n8",
      "frequency": "monthly",
      "designEffectiveness": 0.55,
      "operatingEffectiveness": 0.45,
      "evidenceRef": "remediation tracker",
      "automated": false,
      "linkedRiskIds": [
        "rsk-08"
      ],
      "status": "active",
      "lastTested": "2026-06-29",
      "nextTest": "2026-07-29"
    },
    {
      "id": "ctl-n07",
      "ref": "NOV-CTL-07",
      "name": "Contact centre capacity model with launch-week surge factor",
      "description": "Capacity model includes a surge factor for the launch week specifically.",
      "type": "detective",
      "ownerId": "own-n5",
      "frequency": "weekly",
      "designEffectiveness": 0.6,
      "operatingEffectiveness": 0.5,
      "evidenceRef": "capacity model",
      "automated": false,
      "linkedRiskIds": [
        "rsk-10"
      ],
      "status": "active",
      "lastTested": "2026-09-27",
      "nextTest": "2026-10-27"
    },
    {
      "id": "ctl-n08",
      "ref": "NOV-CTL-08",
      "name": "App store pre-review submission a fortnight early",
      "description": "Early pre-review submission to surface rejection reasons before the real deadline.",
      "type": "preventive",
      "ownerId": "own-n4",
      "frequency": "event-driven",
      "designEffectiveness": 0.6,
      "operatingEffectiveness": 0.55,
      "evidenceRef": "submission log",
      "automated": false,
      "linkedRiskIds": [
        "rsk-12"
      ],
      "status": "active"
    },
    {
      "id": "ctl-n09",
      "ref": "NOV-CTL-09",
      "name": "PCI compliance pre-assessment with the payment provider",
      "description": "Independent PCI pre-assessment ahead of the formal compliance review.",
      "type": "preventive",
      "ownerId": "own-n8",
      "frequency": "quarterly",
      "designEffectiveness": 0.7,
      "operatingEffectiveness": 0.6,
      "evidenceRef": "pre-assessment report",
      "automated": false,
      "linkedRiskIds": [
        "rsk-13"
      ],
      "status": "active",
      "lastTested": "2026-08-08",
      "nextTest": "2026-09-07"
    },
    {
      "id": "ctl-n10",
      "ref": "NOV-CTL-10",
      "name": "A/B test attribution audit",
      "description": "Independent audit of the A/B attribution pipeline for leakage between arms.",
      "type": "detective",
      "ownerId": "own-n4",
      "frequency": "monthly",
      "designEffectiveness": 0.65,
      "operatingEffectiveness": 0.55,
      "evidenceRef": "attribution audit",
      "automated": true,
      "linkedRiskIds": [
        "rsk-17"
      ],
      "status": "active",
      "lastTested": "2026-08-18",
      "nextTest": "2026-09-17"
    }
  ],
  "actions": [
    {
      "id": "act-n01",
      "ref": "NOV-A-01",
      "title": "Re-recruit usability panel with representative sampling",
      "description": "Second round completed with a representative cohort.",
      "ownerId": "own-n3",
      "dueDate": "2026-08-08",
      "status": "complete",
      "priority": "high",
      "linkedRiskIds": [
        "rsk-01"
      ],
      "linkedIssueIds": [],
      "linkedDependencyIds": [],
      "expectedRiskReduction": 0.35,
      "percentComplete": 100,
      "completedDate": "2026-08-04"
    },
    {
      "id": "act-n02",
      "ref": "NOV-A-02",
      "title": "Freeze workflow design and unlock training content build",
      "description": "Workflow frozen; training content build now underway.",
      "ownerId": "own-n5",
      "dueDate": "2026-08-03",
      "status": "in-progress",
      "priority": "high",
      "linkedRiskIds": [
        "rsk-03"
      ],
      "linkedIssueIds": [],
      "linkedDependencyIds": [],
      "expectedRiskReduction": 0.4,
      "percentComplete": 50
    },
    {
      "id": "act-n03",
      "ref": "NOV-A-03",
      "title": "Run shadow test of personalisation engine against live traffic",
      "description": "Shadow test running; early results show conversion parity within tolerance.",
      "ownerId": "own-n4",
      "dueDate": "2026-07-24",
      "status": "in-progress",
      "priority": "critical",
      "linkedRiskIds": [
        "rsk-06"
      ],
      "linkedIssueIds": [],
      "linkedDependencyIds": [],
      "expectedRiskReduction": 0.45,
      "percentComplete": 60
    },
    {
      "id": "act-n04",
      "ref": "NOV-A-04",
      "title": "Fix multi-currency handling in migration script",
      "description": "Script patched and re-tested against multi-currency accounts.",
      "ownerId": "own-n6",
      "dueDate": "2026-07-14",
      "status": "complete",
      "priority": "critical",
      "linkedRiskIds": [
        "rsk-09"
      ],
      "linkedIssueIds": [],
      "linkedDependencyIds": [],
      "expectedRiskReduction": 0.5,
      "percentComplete": 100,
      "completedDate": "2026-07-12"
    },
    {
      "id": "act-n05",
      "ref": "NOV-A-05",
      "title": "Localise consent flow for each in-scope market",
      "description": "Two of four markets localised and legally signed off.",
      "ownerId": "own-n7",
      "dueDate": "2026-06-19",
      "status": "in-progress",
      "priority": "high",
      "linkedRiskIds": [
        "rsk-15"
      ],
      "linkedIssueIds": [],
      "linkedDependencyIds": [],
      "expectedRiskReduction": 0.4,
      "percentComplete": 45
    },
    {
      "id": "act-n06",
      "ref": "NOV-A-06",
      "title": "Escalate vendor data quality remediation plan",
      "description": "Escalation raised at vendor governance forum.",
      "ownerId": "own-n8",
      "dueDate": "2026-07-04",
      "status": "open",
      "priority": "medium",
      "linkedRiskIds": [
        "rsk-08"
      ],
      "linkedIssueIds": [],
      "linkedDependencyIds": [],
      "expectedRiskReduction": 0.3,
      "percentComplete": 25
    }
  ],
  "issues": [
    {
      "id": "iss-n01",
      "ref": "NOV-I-01",
      "title": "First usability round failed on three of five target tasks",
      "description": "Resolved by re-testing with a representative cohort; redesign validated on retest.",
      "ownerId": "own-n3",
      "workstreamId": "ws-n-cx",
      "priority": "high",
      "status": "resolved",
      "dateRaised": "2026-03-03",
      "targetResolution": "2026-08-08",
      "actualCostImpact": 0,
      "actualScheduleImpactDays": 0,
      "causeIds": [
        "cse-n1"
      ],
      "actionIds": [
        "act-n01"
      ],
      "affectedMilestoneIds": [
        "ms-n-02"
      ],
      "evidence": [],
      "comments": [],
      "resolvedDate": "2026-08-04"
    },
    {
      "id": "iss-n02",
      "ref": "NOV-I-02",
      "title": "Loyalty balance discrepancy found for multi-currency accounts in dry run",
      "description": "Resolved before production migration; no live balances affected.",
      "ownerId": "own-n6",
      "workstreamId": "ws-n-mkt",
      "priority": "critical",
      "status": "resolved",
      "dateRaised": "2026-07-11",
      "targetResolution": "2026-07-15",
      "actualCostImpact": 0,
      "actualScheduleImpactDays": 0,
      "causeIds": [
        "cse-n4"
      ],
      "actionIds": [
        "act-n04"
      ],
      "affectedMilestoneIds": [
        "ms-n-06"
      ],
      "evidence": [],
      "comments": [],
      "resolvedDate": "2026-07-12"
    },
    {
      "id": "iss-n03",
      "ref": "NOV-I-03",
      "title": "Consent flow found non-compliant in one market during legal review",
      "description": "Localisation underway for the affected market.",
      "ownerId": "own-n7",
      "workstreamId": "ws-n-mkt",
      "priority": "high",
      "status": "in-progress",
      "dateRaised": "2026-06-14",
      "targetResolution": "2026-07-19",
      "actualCostImpact": 0,
      "actualScheduleImpactDays": 15,
      "causeIds": [
        "cse-n5"
      ],
      "actionIds": [
        "act-n05"
      ],
      "affectedMilestoneIds": [
        "ms-n-07"
      ],
      "evidence": [],
      "comments": []
    },
    {
      "id": "iss-n04",
      "ref": "NOV-I-04",
      "title": "Customer data platform vendor missed the identity resolution milestone date",
      "description": "Vendor remediation plan in progress; new date not yet firm.",
      "ownerId": "own-n8",
      "workstreamId": "ws-n-app",
      "priority": "medium",
      "status": "open",
      "dateRaised": "2026-06-29",
      "targetResolution": "2026-08-18",
      "actualCostImpact": 90000,
      "actualScheduleImpactDays": 20,
      "causeIds": [
        "cse-n6"
      ],
      "actionIds": [
        "act-n06"
      ],
      "affectedMilestoneIds": [],
      "evidence": [],
      "comments": []
    }
  ],
  "assumptions": [
    {
      "id": "asm-n01",
      "ref": "NOV-AS-01",
      "statement": "The widened usability panel will validate the redesign without further major rework",
      "ownerId": "own-n3",
      "status": "validated",
      "confidence": "measured",
      "validationDate": "2026-08-13",
      "riskIfFalseId": "rsk-01",
      "linkedMilestoneIds": [
        "ms-n-02"
      ],
      "note": "Retest passed on all five target tasks."
    },
    {
      "id": "asm-n02",
      "ref": "NOV-AS-02",
      "statement": "Contact centre agents can complete training within the two-week window before launch",
      "ownerId": "own-n5",
      "status": "unvalidated",
      "confidence": "indicative",
      "validationDate": "2026-08-18",
      "riskIfFalseId": "rsk-03",
      "linkedMilestoneIds": [
        "ms-n-05"
      ],
      "note": "Training capacity not yet confirmed against the compressed window."
    },
    {
      "id": "asm-n03",
      "ref": "NOV-AS-03",
      "statement": "ORION's carrier integration will be live before the NOVA customer launch date",
      "ownerId": "own-n1",
      "status": "unvalidated",
      "confidence": "anecdotal",
      "validationDate": "2026-11-01",
      "linkedMilestoneIds": [
        "ms-n-08"
      ],
      "note": "Dependent on ORION's own integration milestone, tracked as a cross-programme link."
    },
    {
      "id": "asm-n04",
      "ref": "NOV-AS-04",
      "statement": "Payment provider will pass the PCI pre-assessment without material remediation",
      "ownerId": "own-n8",
      "status": "validating",
      "confidence": "indicative",
      "validationDate": "2026-09-02",
      "riskIfFalseId": "rsk-13",
      "linkedMilestoneIds": [
        "ms-n-04"
      ],
      "note": "Pre-assessment scheduled; provider has flagged one likely finding."
    }
  ],
  "dependencies": [
    {
      "id": "dep-n01",
      "ref": "NOV-DEP-01",
      "name": "ORION carrier integration go-live",
      "description": "NOVA's customer launch assumes ORION's carrier integration (with real-time order tracking) is live first.",
      "type": "cross-program",
      "upstream": "ORION integration workstream",
      "upstreamOwnerId": "own-n1",
      "downstream": "NOVA customer launch workstream",
      "downstreamOwnerId": "own-n1",
      "dueDate": "2026-09-23",
      "status": "at-risk",
      "criticality": "critical",
      "delayProbability": 0.4,
      "potentialDelayDays": 20,
      "affectedMilestoneIds": [
        "ms-n-08"
      ],
      "affectedBenefitIds": [],
      "predecessorIds": [],
      "linkedRiskIds": []
    },
    {
      "id": "dep-n02",
      "ref": "NOV-DEP-02",
      "name": "ATLAS API Platform contract for customer data",
      "description": "Personalisation engine consumes customer data through the ATLAS API layer once it reaches general availability.",
      "type": "cross-program",
      "upstream": "ATLAS API workstream",
      "upstreamOwnerId": "own-n4",
      "downstream": "NOVA personalisation workstream",
      "downstreamOwnerId": "own-n4",
      "dueDate": "2026-09-23",
      "status": "at-risk",
      "criticality": "high",
      "delayProbability": 0.45,
      "potentialDelayDays": 18,
      "affectedMilestoneIds": [
        "ms-n-04"
      ],
      "affectedBenefitIds": [],
      "predecessorIds": [],
      "linkedRiskIds": []
    },
    {
      "id": "dep-n03",
      "ref": "NOV-DEP-03",
      "name": "Customer data platform vendor identity resolution delivery",
      "description": "Personalisation depends on resolved customer identities from the vendor platform.",
      "type": "vendor",
      "upstream": "Customer data platform vendor",
      "upstreamOwnerId": "own-n8",
      "downstream": "NOVA app workstream",
      "downstreamOwnerId": "own-n4",
      "dueDate": "2026-07-29",
      "status": "at-risk",
      "criticality": "high",
      "delayProbability": 0.5,
      "potentialDelayDays": 22,
      "affectedMilestoneIds": [
        "ms-n-04"
      ],
      "affectedBenefitIds": [],
      "predecessorIds": [],
      "linkedRiskIds": [
        "rsk-08"
      ]
    },
    {
      "id": "dep-n04",
      "ref": "NOV-DEP-04",
      "name": "Payment provider PCI compliance sign-off",
      "description": "Checkout cannot go live without a clean PCI sign-off.",
      "type": "vendor",
      "upstream": "Payment provider",
      "upstreamOwnerId": "own-n8",
      "downstream": "NOVA app workstream",
      "downstreamOwnerId": "own-n4",
      "dueDate": "2026-09-07",
      "status": "on-track",
      "criticality": "critical",
      "delayProbability": 0.3,
      "potentialDelayDays": 15,
      "affectedMilestoneIds": [
        "ms-n-04"
      ],
      "affectedBenefitIds": [],
      "predecessorIds": [],
      "linkedRiskIds": [
        "rsk-13"
      ]
    },
    {
      "id": "dep-n05",
      "ref": "NOV-DEP-05",
      "name": "App store review and approval",
      "description": "Store review must clear before the beta can release.",
      "type": "external",
      "upstream": "Mobile app store",
      "upstreamOwnerId": "own-n4",
      "downstream": "NOVA app workstream",
      "downstreamOwnerId": "own-n4",
      "dueDate": "2026-06-09",
      "status": "on-track",
      "criticality": "high",
      "delayProbability": 0.35,
      "potentialDelayDays": 10,
      "affectedMilestoneIds": [
        "ms-n-03"
      ],
      "affectedBenefitIds": [],
      "predecessorIds": [],
      "linkedRiskIds": [
        "rsk-12"
      ]
    },
    {
      "id": "dep-n06",
      "ref": "NOV-DEP-06",
      "name": "Legal sign-off on per-market consent flows",
      "description": "Each market's consent flow needs independent legal sign-off.",
      "type": "regulatory",
      "upstream": "Legal and compliance",
      "upstreamOwnerId": "own-n7",
      "downstream": "NOVA marketing workstream",
      "downstreamOwnerId": "own-n7",
      "dueDate": "2026-06-24",
      "status": "at-risk",
      "criticality": "high",
      "delayProbability": 0.4,
      "potentialDelayDays": 18,
      "affectedMilestoneIds": [
        "ms-n-07"
      ],
      "affectedBenefitIds": [],
      "predecessorIds": [],
      "linkedRiskIds": [
        "rsk-15"
      ]
    },
    {
      "id": "dep-n07",
      "ref": "NOV-DEP-07",
      "name": "Contact centre workforce management system upgrade",
      "description": "Capacity ramp needs the upgraded workforce management system.",
      "type": "internal",
      "upstream": "IT operations",
      "upstreamOwnerId": "own-n5",
      "downstream": "NOVA contact centre workstream",
      "downstreamOwnerId": "own-n5",
      "dueDate": "2026-08-18",
      "status": "on-track",
      "criticality": "medium",
      "delayProbability": 0.25,
      "potentialDelayDays": 10,
      "affectedMilestoneIds": [
        "ms-n-09"
      ],
      "affectedBenefitIds": [],
      "predecessorIds": [],
      "linkedRiskIds": []
    },
    {
      "id": "dep-n08",
      "ref": "NOV-DEP-08",
      "name": "Brand and legal sign-off on launch messaging",
      "description": "Final messaging sign-off ahead of the customer launch.",
      "type": "internal",
      "upstream": "Brand and legal",
      "upstreamOwnerId": "own-n1",
      "downstream": "NOVA CX workstream",
      "downstreamOwnerId": "own-n3",
      "dueDate": "2026-10-27",
      "status": "on-track",
      "criticality": "medium",
      "delayProbability": 0.3,
      "potentialDelayDays": 12,
      "affectedMilestoneIds": [
        "ms-n-08"
      ],
      "affectedBenefitIds": [],
      "predecessorIds": [],
      "linkedRiskIds": []
    }
  ],
  "changes": [
    {
      "id": "chg-n01",
      "ref": "NOV-CHG-01",
      "title": "Widen the usability panel recruitment brief",
      "description": "Broadened recruitment to better represent the real customer base.",
      "requesterId": "own-n3",
      "reason": "First round skewed to power users and failed on three tasks",
      "raisedDate": "2026-08-06",
      "scopeImpact": "No scope change",
      "costImpact": 25000,
      "scheduleImpactDays": 10,
      "resourceImpact": "Additional recruitment budget",
      "riskImpact": "Reduces redesign-rejection risk",
      "benefitImpact": 0,
      "affectedWorkstreamIds": [
        "ws-n-cx"
      ],
      "affectedMilestoneIds": [
        "ms-n-02"
      ],
      "affectedDependencyIds": [],
      "affectedBenefitIds": [],
      "linkedRiskIds": [
        "rsk-01"
      ],
      "decision": "approved",
      "status": "implemented",
      "decisionMakerId": "own-n1",
      "decisionDate": "2026-08-07",
      "decisionRationale": "Cost is small against the risk of shipping an unvalidated redesign"
    },
    {
      "id": "chg-n02",
      "ref": "NOV-CHG-02",
      "title": "Compress training window and add a second trainer cohort",
      "description": "A second trainer cohort compresses delivery time without cutting content.",
      "requesterId": "own-n5",
      "reason": "Workflow freeze slipped, compressing the available training time",
      "raisedDate": "2026-08-04",
      "scopeImpact": "No scope change",
      "costImpact": 60000,
      "scheduleImpactDays": 0,
      "resourceImpact": "Second trainer cohort",
      "riskImpact": "Reduces go-live support risk",
      "benefitImpact": 0,
      "affectedWorkstreamIds": [
        "ws-n-cc"
      ],
      "affectedMilestoneIds": [
        "ms-n-05"
      ],
      "affectedDependencyIds": [],
      "affectedBenefitIds": [],
      "linkedRiskIds": [
        "rsk-03"
      ],
      "decision": "approved",
      "status": "implemented",
      "decisionMakerId": "own-n1",
      "decisionDate": "2026-08-08",
      "decisionRationale": "Protects the launch date without descoping training depth"
    },
    {
      "id": "chg-n03",
      "ref": "NOV-CHG-03",
      "title": "Localise consent flow ahead of legal review, market by market",
      "description": "Per-market localisation ahead of each market's own legal review.",
      "requesterId": "own-n7",
      "reason": "Consent flow found non-compliant in one market during review",
      "raisedDate": "2026-06-17",
      "scopeImpact": "No scope change",
      "costImpact": 40000,
      "scheduleImpactDays": 14,
      "resourceImpact": "None",
      "riskImpact": "Reduces regulatory exposure",
      "benefitImpact": 0,
      "affectedWorkstreamIds": [
        "ws-n-mkt"
      ],
      "affectedMilestoneIds": [
        "ms-n-07"
      ],
      "affectedDependencyIds": [
        "dep-n06"
      ],
      "affectedBenefitIds": [],
      "linkedRiskIds": [
        "rsk-15"
      ],
      "decision": "pending",
      "status": "in-review"
    }
  ],
  "decisions": [
    {
      "id": "dec-n01",
      "ref": "NOV-DEC-01",
      "title": "Usability panel recruitment scope",
      "context": "First usability round failed on three of five target tasks",
      "ownerId": "own-n3",
      "decisionMakerId": "own-n1",
      "forum": "Programme Steering",
      "dateRequired": "2026-08-04",
      "status": "decided",
      "options": [
        {
          "id": "opt-n01a",
          "label": "Widen recruitment to a representative cohort",
          "pros": [
            "More representative signal"
          ],
          "cons": [
            "Added cost and time"
          ],
          "estimatedCost": 25000,
          "estimatedScheduleDays": 10,
          "residualRiskNote": "Small schedule cost."
        },
        {
          "id": "opt-n01b",
          "label": "Proceed on the existing panel's findings",
          "pros": [
            "No added cost"
          ],
          "cons": [
            "Redesign risk stays unvalidated"
          ],
          "estimatedCost": 0,
          "estimatedScheduleDays": 0,
          "residualRiskNote": "Risk of shipping an unvalidated redesign."
        }
      ],
      "evidence": [],
      "expectedOutcome": "Redesign validated on retest with representative users",
      "linkedRiskIds": [
        "rsk-01"
      ],
      "linkedChangeIds": [
        "chg-n01"
      ],
      "linkedBenefitIds": [],
      "linkedMilestoneIds": [
        "ms-n-02"
      ],
      "dateDecided": "2026-08-07",
      "chosenOptionId": "opt-n01a",
      "rationale": "Validating against a representative cohort is worth the small delay"
    },
    {
      "id": "dec-n02",
      "ref": "NOV-DEC-02",
      "title": "Training delivery model under a compressed window",
      "context": "Workflow freeze slipped, compressing the training window before launch",
      "ownerId": "own-n5",
      "decisionMakerId": "own-n1",
      "forum": "Programme Steering",
      "dateRequired": "2026-08-05",
      "status": "decided",
      "options": [
        {
          "id": "opt-n02a",
          "label": "Add a second trainer cohort",
          "pros": [
            "Protects depth and the launch date"
          ],
          "cons": [
            "Incremental cost"
          ],
          "estimatedCost": 60000,
          "estimatedScheduleDays": 0,
          "residualRiskNote": "Trainer availability not guaranteed."
        },
        {
          "id": "opt-n02b",
          "label": "Cut training content depth",
          "pros": [
            "No added cost"
          ],
          "cons": [
            "Higher agent error rate at launch"
          ],
          "estimatedCost": 0,
          "estimatedScheduleDays": 0,
          "residualRiskNote": "Accepts higher go-live support risk."
        }
      ],
      "evidence": [],
      "expectedOutcome": "Agents fully trained ahead of launch",
      "linkedRiskIds": [
        "rsk-03"
      ],
      "linkedChangeIds": [
        "chg-n02"
      ],
      "linkedBenefitIds": [],
      "linkedMilestoneIds": [
        "ms-n-05"
      ],
      "dateDecided": "2026-08-08",
      "chosenOptionId": "opt-n02a",
      "rationale": "Go-live support risk is not an acceptable trade for the saving"
    },
    {
      "id": "dec-n03",
      "ref": "NOV-DEC-03",
      "title": "Consent flow localisation sequencing",
      "context": "Consent flow found non-compliant in one market during legal review",
      "ownerId": "own-n7",
      "decisionMakerId": "own-n1",
      "forum": "Programme Steering",
      "dateRequired": "2026-06-16",
      "status": "required",
      "options": [
        {
          "id": "opt-n03a",
          "label": "Localise market by market ahead of each review",
          "pros": [
            "Reduces regulatory exposure per market"
          ],
          "cons": [
            "Schedule slip per market"
          ],
          "estimatedCost": 40000,
          "estimatedScheduleDays": 14,
          "residualRiskNote": "Cumulative slip across markets."
        },
        {
          "id": "opt-n03b",
          "label": "Launch on the home-market flow everywhere",
          "pros": [
            "No schedule slip"
          ],
          "cons": [
            "Regulatory exposure in non-home markets"
          ],
          "estimatedCost": 0,
          "estimatedScheduleDays": 0,
          "residualRiskNote": "Direct regulatory exposure."
        }
      ],
      "evidence": [],
      "expectedOutcome": "Zero regulatory findings at launch across all markets",
      "linkedRiskIds": [
        "rsk-15"
      ],
      "linkedChangeIds": [
        "chg-n03"
      ],
      "linkedBenefitIds": [],
      "linkedMilestoneIds": [
        "ms-n-07"
      ]
    }
  ],
  "benefits": [
    {
      "id": "ben-n01",
      "ref": "NOV-BEN-01",
      "name": "Checkout conversion rate uplift",
      "description": "Checkout conversion rate uplift",
      "type": "financial",
      "ownerId": "own-n4",
      "expectedValue": 3500000,
      "realisedValue": 400000,
      "measure": "Checkout conversion rate",
      "baseline": 2.1,
      "target": 3.4,
      "current": 2.5,
      "startDate": "2026-06-09",
      "targetDate": "2026-12-16",
      "status": "in-progress",
      "enablingMilestoneIds": [
        "ms-n-04"
      ],
      "threateningRiskIds": [
        "rsk-06"
      ],
      "linkedChangeIds": [],
      "linkedDecisionIds": [],
      "history": [
        {
          "date": "2026-06-19",
          "realisedValue": 100000
        },
        {
          "date": "2026-09-07",
          "realisedValue": 250000
        },
        {
          "date": "2026-11-26",
          "realisedValue": 400000
        }
      ]
    },
    {
      "id": "ben-n02",
      "ref": "NOV-BEN-02",
      "name": "Contact centre cost-to-serve reduction",
      "description": "Contact centre cost-to-serve reduction",
      "type": "efficiency",
      "ownerId": "own-n5",
      "expectedValue": 1800000,
      "realisedValue": 200000,
      "measure": "Average handle time",
      "baseline": 620,
      "target": 420,
      "current": 560,
      "startDate": "2026-07-29",
      "targetDate": "2026-11-26",
      "status": "at-risk",
      "enablingMilestoneIds": [
        "ms-n-05",
        "ms-n-09"
      ],
      "threateningRiskIds": [
        "rsk-03"
      ],
      "linkedChangeIds": [],
      "linkedDecisionIds": [],
      "history": [
        {
          "date": "2026-08-18",
          "realisedValue": 60000
        },
        {
          "date": "2026-10-17",
          "realisedValue": 140000
        },
        {
          "date": "2026-11-26",
          "realisedValue": 200000
        }
      ]
    },
    {
      "id": "ben-n03",
      "ref": "NOV-BEN-03",
      "name": "Customer satisfaction score improvement",
      "description": "Customer satisfaction score improvement",
      "type": "customer",
      "ownerId": "own-n3",
      "expectedValue": 1200000,
      "realisedValue": 500000,
      "measure": "Net customer satisfaction score",
      "baseline": 61,
      "target": 75,
      "current": 68,
      "startDate": "2025-12-31",
      "targetDate": "2026-12-16",
      "status": "in-progress",
      "enablingMilestoneIds": [
        "ms-n-01",
        "ms-n-08"
      ],
      "threateningRiskIds": [],
      "linkedChangeIds": [],
      "linkedDecisionIds": [],
      "history": [
        {
          "date": "2026-03-11",
          "realisedValue": 100000
        },
        {
          "date": "2026-08-08",
          "realisedValue": 300000
        },
        {
          "date": "2026-11-26",
          "realisedValue": 500000
        }
      ]
    },
    {
      "id": "ben-n04",
      "ref": "NOV-BEN-04",
      "name": "Loyalty programme retention uplift",
      "description": "Loyalty programme retention uplift",
      "type": "strategic",
      "ownerId": "own-n6",
      "expectedValue": 2200000,
      "realisedValue": 0,
      "measure": "12-month repeat purchase rate",
      "baseline": 34,
      "target": 42,
      "current": 34,
      "startDate": "2026-07-19",
      "targetDate": "2027-01-05",
      "status": "not-started",
      "enablingMilestoneIds": [
        "ms-n-06"
      ],
      "threateningRiskIds": [
        "rsk-09"
      ],
      "linkedChangeIds": [],
      "linkedDecisionIds": [],
      "history": []
    }
  ],
  "fmea": [
    {
      "id": "fme-n01",
      "ref": "NOV-FM-01",
      "process": "Usability validation",
      "processStep": "Panel recruitment",
      "failureMode": "Panel skews to power users",
      "effect": "Redesign fails on typical customer tasks",
      "cause": "Convenience-sample recruitment",
      "severity": 4,
      "occurrence": 3,
      "detection": 3,
      "existingControl": "Manual recruitment review",
      "recommendedAction": "Representative recruitment quota by segment",
      "ownerId": "own-n3",
      "dueDate": "2026-08-04",
      "actionStatus": "complete",
      "postSeverity": 4,
      "postOccurrence": 1,
      "postDetection": 1,
      "linkedRiskIds": [
        "rsk-01"
      ],
      "linkedCauseIds": [
        "cse-n1"
      ],
      "linkedControlIds": [
        "ctl-n01"
      ]
    },
    {
      "id": "fme-n02",
      "ref": "NOV-FM-02",
      "process": "Loyalty migration",
      "processStep": "Balance transfer",
      "failureMode": "Multi-currency balances mis-converted",
      "effect": "Customer-visible balance loss",
      "cause": "Single-currency migration script",
      "severity": 5,
      "occurrence": 3,
      "detection": 2,
      "existingControl": "Spot-check sample",
      "recommendedAction": "Full dry-run reconciliation before production migration",
      "ownerId": "own-n6",
      "dueDate": "2026-07-12",
      "actionStatus": "complete",
      "postSeverity": 5,
      "postOccurrence": 1,
      "postDetection": 1,
      "linkedRiskIds": [
        "rsk-09"
      ],
      "linkedCauseIds": [
        "cse-n4"
      ],
      "linkedControlIds": [
        "ctl-n04"
      ]
    },
    {
      "id": "fme-n03",
      "ref": "NOV-FM-03",
      "process": "Consent capture",
      "processStep": "Flow design",
      "failureMode": "Flow designed for one market only",
      "effect": "Non-compliant capture in other markets",
      "cause": "Home-market-only design",
      "severity": 4,
      "occurrence": 3,
      "detection": 3,
      "existingControl": "Home-market legal review only",
      "recommendedAction": "Per-market legal review before each market's launch",
      "ownerId": "own-n7",
      "dueDate": "2026-07-19",
      "actionStatus": "in-progress",
      "postSeverity": 4,
      "postOccurrence": 1,
      "postDetection": 2,
      "linkedRiskIds": [
        "rsk-15"
      ],
      "linkedCauseIds": [
        "cse-n5"
      ],
      "linkedControlIds": [
        "ctl-n05"
      ]
    },
    {
      "id": "fme-n04",
      "ref": "NOV-FM-04",
      "process": "Personalisation launch",
      "processStep": "Model validation",
      "failureMode": "Model validated on synthetic data only",
      "effect": "Conversion degrades against real traffic",
      "cause": "Synthetic-dataset validation",
      "severity": 4,
      "occurrence": 3,
      "detection": 3,
      "existingControl": "Offline synthetic validation",
      "recommendedAction": "Live-traffic shadow testing before full rollout",
      "ownerId": "own-n4",
      "dueDate": "2026-07-24",
      "actionStatus": "in-progress",
      "postSeverity": 4,
      "postOccurrence": 2,
      "postDetection": 2,
      "linkedRiskIds": [
        "rsk-06"
      ],
      "linkedCauseIds": [
        "cse-n3"
      ],
      "linkedControlIds": [
        "ctl-n03"
      ]
    }
  ],
  "dmaic": [],
  "metrics": [
    {
      "id": "met-n01",
      "name": "Checkout conversion rate",
      "unit": "pct",
      "workstreamId": "ws-n-app",
      "target": 3.4,
      "direction": "higher-is-better",
      "series": [
        {
          "date": "2026-06-09",
          "value": 2.1
        },
        {
          "date": "2026-08-18",
          "value": 2.4
        },
        {
          "date": "2026-10-17",
          "value": 2.8
        },
        {
          "date": "2026-12-06",
          "value": 3.0
        }
      ]
    },
    {
      "id": "met-n02",
      "name": "Average agent handle time",
      "unit": "seconds",
      "workstreamId": "ws-n-cc",
      "target": 420,
      "direction": "lower-is-better",
      "series": [
        {
          "date": "2026-07-29",
          "value": 620
        },
        {
          "date": "2026-09-17",
          "value": 560
        },
        {
          "date": "2026-10-27",
          "value": 500
        },
        {
          "date": "2026-11-16",
          "value": 460
        }
      ]
    },
    {
      "id": "met-n03",
      "name": "Net customer satisfaction score",
      "unit": "score",
      "workstreamId": "ws-n-cx",
      "target": 75,
      "direction": "higher-is-better",
      "series": [
        {
          "date": "2025-12-31",
          "value": 61
        },
        {
          "date": "2026-04-30",
          "value": 64
        },
        {
          "date": "2026-09-07",
          "value": 68
        },
        {
          "date": "2026-11-26",
          "value": 70
        }
      ]
    }
  ]
};

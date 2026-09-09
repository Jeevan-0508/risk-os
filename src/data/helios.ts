// GENERATED FILE. Do not edit by hand.
// Produced by tools/gen_satellite.py. Re-generate with:
//   python tools/gen_satellite.py
import type { Program } from '@/domain/types';

export const heliosProgram: Program = {
  "id": "prog-helios",
  "name": "Cybersecurity Transformation",
  "codename": "HELIOS",
  "description": "Modernisation of identity, security operations, cloud security posture and governance, with a SOC tooling vendor whose regional capacity shortfall also affects ATLAS, and a privacy officer shared with NOVA's consent programme.",
  "sponsor": "Marcus Weber, Chief Information Security Officer",
  "programManager": "Priya Anand",
  "startDate": "2025-11-01",
  "endDate": "2026-12-31",
  "statusDate": "2026-09-09",
  "budget": 7100000,
  "spendToDate": 3980000,
  "forecastSpend": 7450000,
  "currency": "EUR",
  "businessUnit": "Information Security",
  "strategicPriority": "critical",
  "programStatus": "active",
  "createdAt": "2025-11-01",
  "updatedAt": "2026-09-09",
  "strategicObjectives": [
    "Modernise identity and access management with time-boxed, re-certified privileged access",
    "Stand up a new SOC detection and response capability across every monitored estate",
    "Move to zero-trust network segmentation and continuous cloud security posture management",
    "Close every open regulatory audit finding ahead of the transformation close"
  ],
  "owners": [
    {
      "id": "own-h1",
      "name": "Marcus Weber",
      "role": "Programme Director"
    },
    {
      "id": "own-h2",
      "name": "Priya Anand",
      "role": "Programme Manager"
    },
    {
      "id": "own-h3",
      "name": "Sofia Almeida",
      "role": "Identity and Access Management Lead",
      "workstreamId": "ws-h-iam"
    },
    {
      "id": "own-h4",
      "name": "Kwame Mensah",
      "role": "Security Operations Centre Lead",
      "workstreamId": "ws-h-soc"
    },
    {
      "id": "own-h5",
      "name": "Elena Petrova",
      "role": "Cloud Security Posture Lead",
      "workstreamId": "ws-h-cloud"
    },
    {
      "id": "own-h6",
      "name": "Noah Bergstrom",
      "role": "Governance Risk and Compliance Lead",
      "workstreamId": "ws-h-gov"
    },
    {
      "id": "own-h7",
      "name": "Layla Haddad",
      "role": "Data Protection and Privacy Officer"
    },
    {
      "id": "own-h8",
      "name": "Ravi Desai",
      "role": "Vendor and Third-Party Risk Lead"
    }
  ],
  "workstreams": [
    {
      "id": "ws-h-iam",
      "name": "Identity and Access Management Modernisation",
      "code": "IAM",
      "description": "Modernisation of identity, privileged access and authentication across the estate.",
      "leadOwnerId": "own-h3",
      "startDate": "2025-11-01",
      "endDate": "2026-10-07",
      "budget": 1900000,
      "spendToDate": 1050000,
      "percentComplete": 60,
      "status": "in-progress"
    },
    {
      "id": "ws-h-soc",
      "name": "Security Operations Centre Uplift",
      "code": "SOC",
      "description": "New detection, response and SOC tooling stack replacing the legacy monitoring platform.",
      "leadOwnerId": "own-h4",
      "startDate": "2025-11-21",
      "endDate": "2026-10-27",
      "budget": 2300000,
      "spendToDate": 1350000,
      "percentComplete": 52,
      "status": "in-progress"
    },
    {
      "id": "ws-h-cloud",
      "name": "Cloud Security Posture Management",
      "code": "CLOUD",
      "description": "Zero-trust segmentation and continuous posture management across all cloud accounts.",
      "leadOwnerId": "own-h5",
      "startDate": "2025-12-01",
      "endDate": "2026-10-22",
      "budget": 1700000,
      "spendToDate": 950000,
      "percentComplete": 48,
      "status": "in-progress"
    },
    {
      "id": "ws-h-gov",
      "name": "Governance, Risk and Compliance",
      "code": "GOV",
      "description": "Regulatory, privacy and audit programme underpinning the transformation.",
      "leadOwnerId": "own-h6",
      "startDate": "2025-11-11",
      "endDate": "2026-11-06",
      "budget": 1200000,
      "spendToDate": 640000,
      "percentComplete": 44,
      "status": "in-progress"
    }
  ],
  "milestones": [
    {
      "id": "ms-h-01",
      "name": "IAM target architecture signed off",
      "workstreamId": "ws-h-iam",
      "ownerId": "own-h3",
      "baselineDate": "2025-12-01",
      "forecastDate": "2025-12-01",
      "status": "complete",
      "isGate": true,
      "predecessorIds": [],
      "deliverableIds": [],
      "description": "Target identity and access architecture agreed with all platform owners."
    },
    {
      "id": "ms-h-02",
      "name": "Privileged access review complete",
      "workstreamId": "ws-h-iam",
      "ownerId": "own-h3",
      "baselineDate": "2026-01-30",
      "forecastDate": "2026-02-04",
      "status": "complete",
      "isGate": false,
      "predecessorIds": [
        "ms-h-01"
      ],
      "deliverableIds": [],
      "description": "Full review of standing privileged access across the estate."
    },
    {
      "id": "ms-h-03",
      "name": "SOC tooling platform general availability",
      "workstreamId": "ws-h-soc",
      "ownerId": "own-h4",
      "baselineDate": "2026-04-20",
      "forecastDate": "2026-05-25",
      "status": "at-risk",
      "isGate": true,
      "predecessorIds": [
        "ms-h-02"
      ],
      "deliverableIds": [],
      "description": "New SOC detection and response tooling live for all monitored estates, dependent on Meridian Cloud Systems capacity."
    },
    {
      "id": "ms-h-04",
      "name": "Zero-trust network segmentation phase 1 live",
      "workstreamId": "ws-h-cloud",
      "ownerId": "own-h5",
      "baselineDate": "2026-05-20",
      "forecastDate": "2026-06-14",
      "status": "in-progress",
      "isGate": false,
      "predecessorIds": [
        "ms-h-01"
      ],
      "deliverableIds": [],
      "description": "First phase of network micro-segmentation live in production."
    },
    {
      "id": "ms-h-05",
      "name": "Cloud security posture management live in all accounts",
      "workstreamId": "ws-h-cloud",
      "ownerId": "own-h5",
      "baselineDate": "2026-06-24",
      "forecastDate": "2026-07-24",
      "status": "at-risk",
      "isGate": false,
      "predecessorIds": [
        "ms-h-04"
      ],
      "deliverableIds": [],
      "description": "Continuous posture management live across every cloud account in scope."
    },
    {
      "id": "ms-h-06",
      "name": "Endpoint detection and response rollout complete",
      "workstreamId": "ws-h-soc",
      "ownerId": "own-h4",
      "baselineDate": "2026-07-09",
      "forecastDate": "2026-08-13",
      "status": "in-progress",
      "isGate": true,
      "predecessorIds": [
        "ms-h-03"
      ],
      "deliverableIds": [],
      "description": "EDR agent deployed and tuned across all managed endpoints."
    },
    {
      "id": "ms-h-07",
      "name": "Data protection impact assessments complete for all markets",
      "workstreamId": "ws-h-gov",
      "ownerId": "own-h7",
      "baselineDate": "2026-05-30",
      "forecastDate": "2026-07-04",
      "status": "at-risk",
      "isGate": true,
      "predecessorIds": [],
      "deliverableIds": [],
      "description": "DPIAs signed off for every in-scope regulatory market."
    },
    {
      "id": "ms-h-08",
      "name": "Security awareness training complete",
      "workstreamId": "ws-h-gov",
      "ownerId": "own-h6",
      "baselineDate": "2026-07-29",
      "forecastDate": "2026-08-23",
      "status": "in-progress",
      "isGate": false,
      "predecessorIds": [],
      "deliverableIds": [],
      "description": "All staff complete the refreshed security awareness curriculum."
    },
    {
      "id": "ms-h-09",
      "name": "Regulatory penetration test and audit sign-off",
      "workstreamId": "ws-h-gov",
      "ownerId": "own-h6",
      "baselineDate": "2026-09-17",
      "forecastDate": "2026-10-12",
      "status": "not-started",
      "isGate": true,
      "predecessorIds": [
        "ms-h-06",
        "ms-h-07"
      ],
      "deliverableIds": [],
      "description": "Independent penetration test and regulator sign-off ahead of the transformation close."
    },
    {
      "id": "ms-h-10",
      "name": "Legacy VPN decommissioned",
      "workstreamId": "ws-h-cloud",
      "ownerId": "own-h5",
      "baselineDate": "2026-10-02",
      "forecastDate": "2026-10-27",
      "status": "not-started",
      "isGate": false,
      "predecessorIds": [
        "ms-h-04"
      ],
      "deliverableIds": [],
      "description": "Legacy remote-access VPN fully retired in favour of zero-trust access."
    }
  ],
  "deliverables": [
    {
      "id": "dlv-h-01",
      "name": "IAM target architecture document",
      "milestoneId": "ms-h-01",
      "ownerId": "own-h3",
      "dueDate": "2025-11-29",
      "status": "complete",
      "percentComplete": 100,
      "acceptanceCriteria": "Architecture signed by every platform owner."
    },
    {
      "id": "dlv-h-02",
      "name": "Privileged access review report",
      "milestoneId": "ms-h-02",
      "ownerId": "own-h3",
      "dueDate": "2026-02-02",
      "status": "complete",
      "percentComplete": 100,
      "acceptanceCriteria": "All excessive standing access findings tracked to remediation."
    },
    {
      "id": "dlv-h-03",
      "name": "SOC tooling deployment runbook",
      "milestoneId": "ms-h-03",
      "ownerId": "own-h4",
      "dueDate": "2026-05-15",
      "status": "in-progress",
      "percentComplete": 65,
      "acceptanceCriteria": "Runbook covers detection, triage and escalation for the new platform."
    },
    {
      "id": "dlv-h-04",
      "name": "Network segmentation phase 1 build",
      "milestoneId": "ms-h-04",
      "ownerId": "own-h5",
      "dueDate": "2026-06-04",
      "status": "in-progress",
      "percentComplete": 70,
      "acceptanceCriteria": "Segmentation policy live for the first wave of business-critical zones."
    },
    {
      "id": "dlv-h-05",
      "name": "Cloud posture management dashboard",
      "milestoneId": "ms-h-05",
      "ownerId": "own-h5",
      "dueDate": "2026-07-09",
      "status": "in-progress",
      "percentComplete": 50,
      "acceptanceCriteria": "Dashboard covers every in-scope cloud account and control."
    },
    {
      "id": "dlv-h-06",
      "name": "EDR deployment and tuning report",
      "milestoneId": "ms-h-06",
      "ownerId": "own-h4",
      "dueDate": "2026-07-29",
      "status": "in-progress",
      "percentComplete": 55,
      "acceptanceCriteria": "Deployment coverage and false-positive tuning tracked per estate."
    },
    {
      "id": "dlv-h-07",
      "name": "DPIA pack for all in-scope markets",
      "milestoneId": "ms-h-07",
      "ownerId": "own-h7",
      "dueDate": "2026-06-19",
      "status": "in-progress",
      "percentComplete": 60,
      "acceptanceCriteria": "DPIA pack complete and signed for every in-scope regulatory market."
    },
    {
      "id": "dlv-h-08",
      "name": "Audit readiness pack",
      "milestoneId": "ms-h-09",
      "ownerId": "own-h6",
      "dueDate": "2026-09-27",
      "status": "not-started",
      "percentComplete": 15,
      "acceptanceCriteria": "Evidence pack ready ahead of the independent penetration test."
    }
  ],
  "risks": [
    {
      "id": "rsk-01",
      "ref": "HEL-01",
      "title": "Identity and access management rollout misses a legacy application tier",
      "description": "The original application inventory did not cover a regional finance system, which went live outside IAM control until a reconciliation sweep found it.",
      "category": "technology",
      "ownerId": "own-h3",
      "workstreamId": "ws-h-iam",
      "status": "monitoring",
      "dateIdentified": "2026-07-17",
      "reviewDate": "2026-08-28",
      "strategy": "mitigate",
      "inherentProbability": 0.3,
      "inherentImpact": 3,
      "inherentFinancialImpact": 340000,
      "inherentScheduleImpactDays": 8,
      "strategicImpact": 3,
      "reputationImpact": 2,
      "timeHorizon": "near",
      "evidenceConfidence": "measured",
      "controlIds": [
        "ctl-h01"
      ],
      "causeIds": [
        "cse-h1"
      ],
      "actionIds": [
        "act-h01"
      ],
      "affectedMilestoneIds": [
        "ms-h-01"
      ],
      "affectedBenefitIds": [],
      "dependencyIds": [
        "dep-h08"
      ],
      "issueIds": [
        "iss-h01"
      ],
      "evidence": [],
      "comments": [],
      "tags": [
        "identity",
        "legacy"
      ],
      "history": [
        {
          "date": "2026-07-17",
          "probability": 0.55,
          "impactScore": 4,
          "financialExposure": 620000
        },
        {
          "date": "2026-07-29",
          "probability": 0.3,
          "impactScore": 3,
          "financialExposure": 340000
        }
      ]
    },
    {
      "id": "rsk-03",
      "ref": "HEL-03",
      "title": "Privileged access review finds accounts with excessive standing access",
      "description": "A full audit of privileged access under the legacy identity model found accounts, including service accounts with no owner, that had never been re-certified.",
      "category": "security",
      "ownerId": "own-h3",
      "workstreamId": "ws-h-iam",
      "status": "monitoring",
      "dateIdentified": "2026-02-05",
      "reviewDate": "2026-08-28",
      "strategy": "mitigate",
      "inherentProbability": 0.25,
      "inherentImpact": 4,
      "inherentFinancialImpact": 420000,
      "inherentScheduleImpactDays": 6,
      "strategicImpact": 3,
      "reputationImpact": 4,
      "timeHorizon": "immediate",
      "evidenceConfidence": "verified",
      "controlIds": [
        "ctl-h02"
      ],
      "causeIds": [
        "cse-h2"
      ],
      "actionIds": [
        "act-h02"
      ],
      "affectedMilestoneIds": [
        "ms-h-02"
      ],
      "affectedBenefitIds": [
        "ben-h02"
      ],
      "dependencyIds": [],
      "issueIds": [
        "iss-h02"
      ],
      "evidence": [],
      "comments": [],
      "tags": [
        "identity",
        "security"
      ],
      "history": [
        {
          "date": "2026-02-05",
          "probability": 0.5,
          "impactScore": 5,
          "financialExposure": 900000
        },
        {
          "date": "2026-03-01",
          "probability": 0.25,
          "impactScore": 4,
          "financialExposure": 420000
        }
      ]
    },
    {
      "id": "rsk-06",
      "ref": "HEL-06",
      "title": "Zero-trust network segmentation breaks a business-critical batch job",
      "description": "The segmentation policy was modelled from architecture diagrams rather than live traffic and did not account for an undocumented legacy data flow feeding a nightly finance batch job.",
      "category": "operational",
      "ownerId": "own-h5",
      "workstreamId": "ws-h-cloud",
      "status": "escalated",
      "dateIdentified": "2026-05-30",
      "reviewDate": "2026-09-02",
      "strategy": "mitigate",
      "inherentProbability": 0.45,
      "inherentImpact": 4,
      "inherentFinancialImpact": 480000,
      "inherentScheduleImpactDays": 12,
      "strategicImpact": 3,
      "reputationImpact": 3,
      "timeHorizon": "immediate",
      "evidenceConfidence": "verified",
      "controlIds": [
        "ctl-h03"
      ],
      "causeIds": [
        "cse-h3"
      ],
      "actionIds": [
        "act-h03"
      ],
      "affectedMilestoneIds": [
        "ms-h-04"
      ],
      "affectedBenefitIds": [],
      "dependencyIds": [],
      "issueIds": [],
      "evidence": [],
      "comments": [],
      "tags": [
        "operational",
        "critical-path"
      ],
      "history": [
        {
          "date": "2026-05-30",
          "probability": 0.6,
          "impactScore": 4,
          "financialExposure": 640000
        },
        {
          "date": "2026-06-24",
          "probability": 0.45,
          "impactScore": 4,
          "financialExposure": 480000
        }
      ]
    },
    {
      "id": "rsk-09",
      "ref": "HEL-09",
      "title": "Meridian Cloud Systems capacity shortfall delays SOC tooling rollout",
      "description": "Meridian Cloud Systems sized regional capacity against a single-customer forecast; ATLAS's data platform work draws on the same regional pool, and the shared shortfall now threatens the SOC tooling general-availability date.",
      "category": "vendor",
      "ownerId": "own-h4",
      "workstreamId": "ws-h-soc",
      "status": "escalated",
      "dateIdentified": "2026-05-10",
      "reviewDate": "2026-08-28",
      "strategy": "mitigate",
      "inherentProbability": 0.5,
      "inherentImpact": 4,
      "inherentFinancialImpact": 560000,
      "inherentScheduleImpactDays": 20,
      "strategicImpact": 4,
      "reputationImpact": 2,
      "timeHorizon": "immediate",
      "evidenceConfidence": "verified",
      "controlIds": [
        "ctl-h04"
      ],
      "causeIds": [
        "cse-h4"
      ],
      "actionIds": [
        "act-h04"
      ],
      "affectedMilestoneIds": [
        "ms-h-03"
      ],
      "affectedBenefitIds": [
        "ben-h01"
      ],
      "dependencyIds": [
        "dep-h01",
        "dep-h04"
      ],
      "issueIds": [
        "iss-h03"
      ],
      "evidence": [],
      "comments": [],
      "tags": [
        "vendor",
        "critical-path",
        "shared-vendor"
      ],
      "history": [
        {
          "date": "2026-05-10",
          "probability": 0.65,
          "impactScore": 4,
          "financialExposure": 780000
        },
        {
          "date": "2026-06-09",
          "probability": 0.5,
          "impactScore": 4,
          "financialExposure": 560000
        }
      ],
      "vendor": "Meridian Cloud Systems",
      "sharedRiskGroupId": "shared-meridian-capacity-01"
    },
    {
      "id": "rsk-15",
      "ref": "HEL-15",
      "title": "Data protection impact assessment backlog blocks endpoint rollout in regulated markets",
      "description": "The DPIA template was designed for the home market only; two other in-scope regulatory markets have not yet been re-scoped, and the same privacy officer also carries NOVA's consent management workstream.",
      "category": "regulatory",
      "ownerId": "own-h7",
      "workstreamId": "ws-h-gov",
      "status": "escalated",
      "dateIdentified": "2026-06-07",
      "reviewDate": "2026-08-23",
      "strategy": "mitigate",
      "inherentProbability": 0.4,
      "inherentImpact": 4,
      "inherentFinancialImpact": 380000,
      "inherentScheduleImpactDays": 15,
      "strategicImpact": 3,
      "reputationImpact": 4,
      "timeHorizon": "near",
      "evidenceConfidence": "verified",
      "controlIds": [
        "ctl-h05"
      ],
      "causeIds": [
        "cse-h5"
      ],
      "actionIds": [
        "act-h05"
      ],
      "affectedMilestoneIds": [
        "ms-h-07"
      ],
      "affectedBenefitIds": [
        "ben-h03"
      ],
      "dependencyIds": [
        "dep-h03"
      ],
      "issueIds": [
        "iss-h04"
      ],
      "evidence": [],
      "comments": [],
      "tags": [
        "regulatory",
        "shared-resource"
      ],
      "history": [
        {
          "date": "2026-06-07",
          "probability": 0.55,
          "impactScore": 4,
          "financialExposure": 500000
        },
        {
          "date": "2026-06-29",
          "probability": 0.4,
          "impactScore": 4,
          "financialExposure": 380000
        }
      ]
    },
    {
      "id": "rsk-02",
      "ref": "HEL-02",
      "title": "Multi-factor authentication rollout increases contact centre call volume",
      "description": "Multi-factor authentication rollout increases contact centre call volume.",
      "category": "operational",
      "ownerId": "own-h1",
      "workstreamId": "ws-h-iam",
      "status": "monitoring",
      "dateIdentified": "2025-11-23",
      "reviewDate": "2026-08-18",
      "strategy": "mitigate",
      "inherentProbability": 0.2,
      "inherentImpact": 2,
      "inherentFinancialImpact": 70000,
      "inherentScheduleImpactDays": 4,
      "strategicImpact": 2,
      "reputationImpact": 2,
      "timeHorizon": "immediate",
      "evidenceConfidence": "measured",
      "controlIds": [],
      "causeIds": [],
      "actionIds": [],
      "affectedMilestoneIds": [
        "ms-h-01"
      ],
      "affectedBenefitIds": [],
      "dependencyIds": [],
      "issueIds": [],
      "evidence": [],
      "comments": [],
      "tags": [
        "helios",
        "operational"
      ],
      "history": [
        {
          "date": "2025-11-21",
          "probability": 0.1,
          "impactScore": 1,
          "financialExposure": 50400
        },
        {
          "date": "2026-01-15",
          "probability": 0.2,
          "impactScore": 2,
          "financialExposure": 70000
        }
      ]
    },
    {
      "id": "rsk-04",
      "ref": "HEL-04",
      "title": "Cloud security posture tool reports a high rate of false positives",
      "description": "Cloud security posture tool reports a high rate of false positives.",
      "category": "technology",
      "ownerId": "own-h2",
      "workstreamId": "ws-h-soc",
      "status": "open",
      "dateIdentified": "2025-11-27",
      "reviewDate": "2026-08-21",
      "strategy": "mitigate",
      "inherentProbability": 0.38,
      "inherentImpact": 3,
      "inherentFinancialImpact": 117000,
      "inherentScheduleImpactDays": 7,
      "strategicImpact": 3,
      "reputationImpact": 3,
      "timeHorizon": "near",
      "evidenceConfidence": "verified",
      "controlIds": [],
      "causeIds": [],
      "actionIds": [],
      "affectedMilestoneIds": [
        "ms-h-02"
      ],
      "affectedBenefitIds": [],
      "dependencyIds": [],
      "issueIds": [],
      "evidence": [],
      "comments": [],
      "tags": [
        "helios",
        "technology"
      ],
      "history": [
        {
          "date": "2025-11-27",
          "probability": 0.24,
          "impactScore": 2,
          "financialExposure": 84240
        },
        {
          "date": "2026-01-21",
          "probability": 0.38,
          "impactScore": 3,
          "financialExposure": 117000
        }
      ]
    },
    {
      "id": "rsk-05",
      "ref": "HEL-05",
      "title": "Third-party risk assessment backlog grows faster than it can be cleared",
      "description": "Third-party risk assessment backlog grows faster than it can be cleared.",
      "category": "vendor",
      "ownerId": "own-h3",
      "workstreamId": "ws-h-cloud",
      "status": "open",
      "dateIdentified": "2025-12-01",
      "reviewDate": "2026-08-24",
      "strategy": "mitigate",
      "inherentProbability": 0.56,
      "inherentImpact": 4,
      "inherentFinancialImpact": 164000,
      "inherentScheduleImpactDays": 10,
      "strategicImpact": 4,
      "reputationImpact": 4,
      "timeHorizon": "near",
      "evidenceConfidence": "indicative",
      "controlIds": [],
      "causeIds": [],
      "actionIds": [],
      "affectedMilestoneIds": [
        "ms-h-03"
      ],
      "affectedBenefitIds": [],
      "dependencyIds": [],
      "issueIds": [],
      "evidence": [],
      "comments": [],
      "tags": [
        "helios",
        "vendor"
      ],
      "history": [
        {
          "date": "2025-12-03",
          "probability": 0.42000000000000004,
          "impactScore": 3,
          "financialExposure": 118080
        },
        {
          "date": "2026-01-27",
          "probability": 0.56,
          "impactScore": 4,
          "financialExposure": 164000
        }
      ]
    },
    {
      "id": "rsk-07",
      "ref": "HEL-07",
      "title": "Security awareness training completion lags target ahead of go-live",
      "description": "Security awareness training completion lags target ahead of go-live.",
      "category": "people",
      "ownerId": "own-h4",
      "workstreamId": "ws-h-gov",
      "status": "monitoring",
      "dateIdentified": "2025-12-05",
      "reviewDate": "2026-08-27",
      "strategy": "transfer",
      "inherentProbability": 0.74,
      "inherentImpact": 5,
      "inherentFinancialImpact": 211000,
      "inherentScheduleImpactDays": 13,
      "strategicImpact": 2,
      "reputationImpact": 2,
      "timeHorizon": "mid",
      "evidenceConfidence": "anecdotal",
      "controlIds": [],
      "causeIds": [],
      "actionIds": [],
      "affectedMilestoneIds": [
        "ms-h-04"
      ],
      "affectedBenefitIds": [],
      "dependencyIds": [],
      "issueIds": [],
      "evidence": [],
      "comments": [],
      "tags": [
        "helios",
        "people"
      ],
      "history": [
        {
          "date": "2025-12-09",
          "probability": 0.6,
          "impactScore": 4,
          "financialExposure": 151920
        },
        {
          "date": "2026-02-02",
          "probability": 0.74,
          "impactScore": 5,
          "financialExposure": 211000
        }
      ]
    },
    {
      "id": "rsk-08",
      "ref": "HEL-08",
      "title": "SOC analyst headcount plan lags the tooling rollout schedule",
      "description": "SOC analyst headcount plan lags the tooling rollout schedule.",
      "category": "people",
      "ownerId": "own-h5",
      "workstreamId": "ws-h-iam",
      "status": "open",
      "dateIdentified": "2025-12-09",
      "reviewDate": "2026-08-30",
      "strategy": "accept",
      "inherentProbability": 0.32,
      "inherentImpact": 2,
      "inherentFinancialImpact": 258000,
      "inherentScheduleImpactDays": 16,
      "strategicImpact": 3,
      "reputationImpact": 3,
      "timeHorizon": "far",
      "evidenceConfidence": "measured",
      "controlIds": [],
      "causeIds": [],
      "actionIds": [],
      "affectedMilestoneIds": [
        "ms-h-05"
      ],
      "affectedBenefitIds": [],
      "dependencyIds": [],
      "issueIds": [],
      "evidence": [],
      "comments": [],
      "tags": [
        "helios",
        "people"
      ],
      "history": [
        {
          "date": "2025-12-15",
          "probability": 0.18,
          "impactScore": 1,
          "financialExposure": 185760
        },
        {
          "date": "2026-02-08",
          "probability": 0.32,
          "impactScore": 2,
          "financialExposure": 258000
        }
      ]
    },
    {
      "id": "rsk-10",
      "ref": "HEL-10",
      "title": "Data loss prevention rules block a legitimate finance data export process",
      "description": "Data loss prevention rules block a legitimate finance data export process.",
      "category": "operational",
      "ownerId": "own-h6",
      "workstreamId": "ws-h-soc",
      "status": "open",
      "dateIdentified": "2025-12-13",
      "reviewDate": "2026-09-02",
      "strategy": "mitigate",
      "inherentProbability": 0.5,
      "inherentImpact": 3,
      "inherentFinancialImpact": 305000,
      "inherentScheduleImpactDays": 19,
      "strategicImpact": 4,
      "reputationImpact": 4,
      "timeHorizon": "immediate",
      "evidenceConfidence": "verified",
      "controlIds": [],
      "causeIds": [],
      "actionIds": [],
      "affectedMilestoneIds": [
        "ms-h-06"
      ],
      "affectedBenefitIds": [],
      "dependencyIds": [],
      "issueIds": [],
      "evidence": [],
      "comments": [],
      "tags": [
        "helios",
        "operational"
      ],
      "history": [
        {
          "date": "2025-12-21",
          "probability": 0.36,
          "impactScore": 2,
          "financialExposure": 219600
        },
        {
          "date": "2026-02-14",
          "probability": 0.5,
          "impactScore": 3,
          "financialExposure": 305000
        }
      ]
    },
    {
      "id": "rsk-11",
      "ref": "HEL-11",
      "title": "Legacy VPN decommission is blocked by one remaining regional office",
      "description": "Legacy VPN decommission is blocked by one remaining regional office.",
      "category": "delivery",
      "ownerId": "own-h7",
      "workstreamId": "ws-h-cloud",
      "status": "monitoring",
      "dateIdentified": "2025-12-17",
      "reviewDate": "2026-09-05",
      "strategy": "mitigate",
      "inherentProbability": 0.68,
      "inherentImpact": 4,
      "inherentFinancialImpact": 352000,
      "inherentScheduleImpactDays": 22,
      "strategicImpact": 2,
      "reputationImpact": 2,
      "timeHorizon": "near",
      "evidenceConfidence": "indicative",
      "controlIds": [],
      "causeIds": [],
      "actionIds": [],
      "affectedMilestoneIds": [
        "ms-h-07"
      ],
      "affectedBenefitIds": [],
      "dependencyIds": [],
      "issueIds": [],
      "evidence": [],
      "comments": [],
      "tags": [
        "helios",
        "delivery"
      ],
      "history": [
        {
          "date": "2025-12-27",
          "probability": 0.54,
          "impactScore": 3,
          "financialExposure": 253440
        },
        {
          "date": "2026-02-20",
          "probability": 0.68,
          "impactScore": 4,
          "financialExposure": 352000
        }
      ]
    },
    {
      "id": "rsk-12",
      "ref": "HEL-12",
      "title": "Regulatory penetration test finds a critical finding close to the audit date",
      "description": "Regulatory penetration test finds a critical finding close to the audit date.",
      "category": "regulatory",
      "ownerId": "own-h8",
      "workstreamId": "ws-h-gov",
      "status": "open",
      "dateIdentified": "2025-12-21",
      "reviewDate": "2026-09-08",
      "strategy": "mitigate",
      "inherentProbability": 0.26,
      "inherentImpact": 5,
      "inherentFinancialImpact": 399000,
      "inherentScheduleImpactDays": 25,
      "strategicImpact": 3,
      "reputationImpact": 3,
      "timeHorizon": "near",
      "evidenceConfidence": "anecdotal",
      "controlIds": [],
      "causeIds": [],
      "actionIds": [],
      "affectedMilestoneIds": [
        "ms-h-08"
      ],
      "affectedBenefitIds": [],
      "dependencyIds": [],
      "issueIds": [],
      "evidence": [],
      "comments": [],
      "tags": [
        "helios",
        "regulatory"
      ],
      "history": [
        {
          "date": "2026-01-02",
          "probability": 0.12,
          "impactScore": 4,
          "financialExposure": 287280
        },
        {
          "date": "2026-02-26",
          "probability": 0.26,
          "impactScore": 5,
          "financialExposure": 399000
        }
      ]
    },
    {
      "id": "rsk-13",
      "ref": "HEL-13",
      "title": "Security budget reforecast is driven by license cost growth, not scope growth",
      "description": "Security budget reforecast is driven by license cost growth, not scope growth.",
      "category": "financial",
      "ownerId": "own-h1",
      "workstreamId": "ws-h-iam",
      "status": "open",
      "dateIdentified": "2025-12-25",
      "reviewDate": "2026-09-11",
      "strategy": "transfer",
      "inherentProbability": 0.44,
      "inherentImpact": 2,
      "inherentFinancialImpact": 446000,
      "inherentScheduleImpactDays": 28,
      "strategicImpact": 4,
      "reputationImpact": 4,
      "timeHorizon": "mid",
      "evidenceConfidence": "measured",
      "controlIds": [],
      "causeIds": [],
      "actionIds": [],
      "affectedMilestoneIds": [
        "ms-h-09"
      ],
      "affectedBenefitIds": [],
      "dependencyIds": [],
      "issueIds": [],
      "evidence": [],
      "comments": [],
      "tags": [
        "helios",
        "financial"
      ],
      "history": [
        {
          "date": "2026-01-08",
          "probability": 0.3,
          "impactScore": 1,
          "financialExposure": 321120
        },
        {
          "date": "2026-03-04",
          "probability": 0.44,
          "impactScore": 2,
          "financialExposure": 446000
        }
      ]
    },
    {
      "id": "rsk-14",
      "ref": "HEL-14",
      "title": "Incident response tabletop exercise reveals unclear escalation ownership",
      "description": "Incident response tabletop exercise reveals unclear escalation ownership.",
      "category": "operational",
      "ownerId": "own-h2",
      "workstreamId": "ws-h-soc",
      "status": "monitoring",
      "dateIdentified": "2025-12-29",
      "reviewDate": "2026-09-14",
      "strategy": "accept",
      "inherentProbability": 0.62,
      "inherentImpact": 3,
      "inherentFinancialImpact": 493000,
      "inherentScheduleImpactDays": 31,
      "strategicImpact": 2,
      "reputationImpact": 2,
      "timeHorizon": "far",
      "evidenceConfidence": "verified",
      "controlIds": [],
      "causeIds": [],
      "actionIds": [],
      "affectedMilestoneIds": [
        "ms-h-10"
      ],
      "affectedBenefitIds": [],
      "dependencyIds": [],
      "issueIds": [],
      "evidence": [],
      "comments": [],
      "tags": [
        "helios",
        "operational"
      ],
      "history": [
        {
          "date": "2026-01-14",
          "probability": 0.48,
          "impactScore": 2,
          "financialExposure": 354960
        },
        {
          "date": "2026-03-10",
          "probability": 0.62,
          "impactScore": 3,
          "financialExposure": 493000
        }
      ]
    },
    {
      "id": "rsk-16",
      "ref": "HEL-16",
      "title": "Identity provider migration produces duplicate accounts for contractors",
      "description": "Identity provider migration produces duplicate accounts for contractors.",
      "category": "technology",
      "ownerId": "own-h3",
      "workstreamId": "ws-h-cloud",
      "status": "open",
      "dateIdentified": "2026-01-02",
      "reviewDate": "2026-09-17",
      "strategy": "mitigate",
      "inherentProbability": 0.2,
      "inherentImpact": 4,
      "inherentFinancialImpact": 540000,
      "inherentScheduleImpactDays": 4,
      "strategicImpact": 3,
      "reputationImpact": 3,
      "timeHorizon": "immediate",
      "evidenceConfidence": "indicative",
      "controlIds": [],
      "causeIds": [],
      "actionIds": [],
      "affectedMilestoneIds": [
        "ms-h-01"
      ],
      "affectedBenefitIds": [],
      "dependencyIds": [],
      "issueIds": [],
      "evidence": [],
      "comments": [],
      "tags": [
        "helios",
        "technology"
      ],
      "history": [
        {
          "date": "2026-01-20",
          "probability": 0.1,
          "impactScore": 3,
          "financialExposure": 388800
        },
        {
          "date": "2026-03-16",
          "probability": 0.2,
          "impactScore": 4,
          "financialExposure": 540000
        }
      ]
    },
    {
      "id": "rsk-17",
      "ref": "HEL-17",
      "title": "Cloud workload protection agent conflicts with a finance batch process",
      "description": "Cloud workload protection agent conflicts with a finance batch process.",
      "category": "technology",
      "ownerId": "own-h4",
      "workstreamId": "ws-h-gov",
      "status": "open",
      "dateIdentified": "2026-01-06",
      "reviewDate": "2026-09-20",
      "strategy": "mitigate",
      "inherentProbability": 0.38,
      "inherentImpact": 5,
      "inherentFinancialImpact": 587000,
      "inherentScheduleImpactDays": 7,
      "strategicImpact": 4,
      "reputationImpact": 4,
      "timeHorizon": "near",
      "evidenceConfidence": "anecdotal",
      "controlIds": [],
      "causeIds": [],
      "actionIds": [],
      "affectedMilestoneIds": [
        "ms-h-02"
      ],
      "affectedBenefitIds": [],
      "dependencyIds": [],
      "issueIds": [],
      "evidence": [],
      "comments": [],
      "tags": [
        "helios",
        "technology"
      ],
      "history": [
        {
          "date": "2026-01-26",
          "probability": 0.24,
          "impactScore": 4,
          "financialExposure": 422640
        },
        {
          "date": "2026-03-22",
          "probability": 0.38,
          "impactScore": 5,
          "financialExposure": 587000
        }
      ]
    },
    {
      "id": "rsk-18",
      "ref": "HEL-18",
      "title": "Third-party penetration testers cannot access a segmented production network",
      "description": "Third-party penetration testers cannot access a segmented production network.",
      "category": "vendor",
      "ownerId": "own-h5",
      "workstreamId": "ws-h-iam",
      "status": "monitoring",
      "dateIdentified": "2026-01-10",
      "reviewDate": "2026-09-23",
      "strategy": "mitigate",
      "inherentProbability": 0.56,
      "inherentImpact": 2,
      "inherentFinancialImpact": 634000,
      "inherentScheduleImpactDays": 10,
      "strategicImpact": 2,
      "reputationImpact": 2,
      "timeHorizon": "near",
      "evidenceConfidence": "measured",
      "controlIds": [],
      "causeIds": [],
      "actionIds": [],
      "affectedMilestoneIds": [
        "ms-h-03"
      ],
      "affectedBenefitIds": [],
      "dependencyIds": [],
      "issueIds": [],
      "evidence": [],
      "comments": [],
      "tags": [
        "helios",
        "vendor"
      ],
      "history": [
        {
          "date": "2026-02-01",
          "probability": 0.42000000000000004,
          "impactScore": 1,
          "financialExposure": 456480
        },
        {
          "date": "2026-03-28",
          "probability": 0.56,
          "impactScore": 2,
          "financialExposure": 634000
        }
      ]
    },
    {
      "id": "rsk-19",
      "ref": "HEL-19",
      "title": "Security exception backlog grows faster than the governance forum can clear it",
      "description": "Security exception backlog grows faster than the governance forum can clear it.",
      "category": "delivery",
      "ownerId": "own-h6",
      "workstreamId": "ws-h-soc",
      "status": "open",
      "dateIdentified": "2026-01-14",
      "reviewDate": "2026-09-26",
      "strategy": "transfer",
      "inherentProbability": 0.74,
      "inherentImpact": 3,
      "inherentFinancialImpact": 681000,
      "inherentScheduleImpactDays": 13,
      "strategicImpact": 3,
      "reputationImpact": 3,
      "timeHorizon": "mid",
      "evidenceConfidence": "verified",
      "controlIds": [],
      "causeIds": [],
      "actionIds": [],
      "affectedMilestoneIds": [
        "ms-h-04"
      ],
      "affectedBenefitIds": [],
      "dependencyIds": [],
      "issueIds": [],
      "evidence": [],
      "comments": [],
      "tags": [
        "helios",
        "delivery"
      ],
      "history": [
        {
          "date": "2026-02-07",
          "probability": 0.6,
          "impactScore": 2,
          "financialExposure": 490320
        },
        {
          "date": "2026-04-03",
          "probability": 0.74,
          "impactScore": 3,
          "financialExposure": 681000
        }
      ]
    },
    {
      "id": "rsk-20",
      "ref": "HEL-20",
      "title": "Encryption key rotation breaks a legacy reporting integration",
      "description": "Encryption key rotation breaks a legacy reporting integration.",
      "category": "technology",
      "ownerId": "own-h7",
      "workstreamId": "ws-h-cloud",
      "status": "open",
      "dateIdentified": "2026-01-18",
      "reviewDate": "2026-09-29",
      "strategy": "accept",
      "inherentProbability": 0.32,
      "inherentImpact": 4,
      "inherentFinancialImpact": 728000,
      "inherentScheduleImpactDays": 16,
      "strategicImpact": 4,
      "reputationImpact": 4,
      "timeHorizon": "far",
      "evidenceConfidence": "indicative",
      "controlIds": [],
      "causeIds": [],
      "actionIds": [],
      "affectedMilestoneIds": [
        "ms-h-05"
      ],
      "affectedBenefitIds": [],
      "dependencyIds": [],
      "issueIds": [],
      "evidence": [],
      "comments": [],
      "tags": [
        "helios",
        "technology"
      ],
      "history": [
        {
          "date": "2026-02-13",
          "probability": 0.18,
          "impactScore": 3,
          "financialExposure": 524160
        },
        {
          "date": "2026-04-09",
          "probability": 0.32,
          "impactScore": 4,
          "financialExposure": 728000
        }
      ]
    }
  ],
  "causes": [
    {
      "id": "cse-h1",
      "ref": "HEL-C-01",
      "title": "Legacy application inventory was incomplete when IAM scope was set",
      "description": "Why is a legacy tier missed? The original application inventory did not cover a regional finance system.",
      "category": "process",
      "isRootCause": true,
      "whyChain": [
        "Why is a legacy tier missed? The original application inventory did not cover a regional finance system."
      ],
      "frequency": 6,
      "linkedRiskIds": [
        "rsk-01"
      ],
      "linkedIssueIds": [],
      "ownerId": "own-h3"
    },
    {
      "id": "cse-h2",
      "ref": "HEL-C-02",
      "title": "Standing access grants were never time-boxed under the legacy identity model",
      "description": "Why is standing access excessive? The legacy model granted access indefinitely with no periodic re-certification.",
      "category": "process",
      "isRootCause": true,
      "whyChain": [
        "Why is standing access excessive? The legacy model granted access indefinitely with no periodic re-certification."
      ],
      "frequency": 7,
      "linkedRiskIds": [
        "rsk-03"
      ],
      "linkedIssueIds": [],
      "ownerId": "own-h3"
    },
    {
      "id": "cse-h3",
      "ref": "HEL-C-03",
      "title": "Network segmentation policy was modelled from architecture diagrams, not live traffic",
      "description": "Why did segmentation break a batch job? The policy did not account for an undocumented legacy data flow.",
      "category": "technology",
      "isRootCause": true,
      "whyChain": [
        "Why did segmentation break a batch job? The policy did not account for an undocumented legacy data flow."
      ],
      "frequency": 5,
      "linkedRiskIds": [
        "rsk-06"
      ],
      "linkedIssueIds": [],
      "ownerId": "own-h5"
    },
    {
      "id": "cse-h4",
      "ref": "HEL-C-04",
      "title": "Meridian Cloud Systems underestimated regional capacity demand from multiple concurrent customers",
      "description": "Why is the SOC tooling vendor short on capacity? Meridian sized regional capacity against a single-customer forecast, and ATLAS draws on the same regional pool.",
      "category": "management",
      "isRootCause": false,
      "whyChain": [
        "Why is the SOC tooling vendor short on capacity? Meridian sized regional capacity against a single-customer forecast, and ATLAS draws on the same regional pool."
      ],
      "frequency": 5,
      "linkedRiskIds": [
        "rsk-09"
      ],
      "linkedIssueIds": [],
      "ownerId": "own-h8"
    },
    {
      "id": "cse-h5",
      "ref": "HEL-C-05",
      "title": "DPIA process was designed for one regulatory regime and not re-scoped per market",
      "description": "Why are DPIAs behind? The assessment template assumed the home market's regulation and needed rework for each additional market.",
      "category": "policy",
      "isRootCause": true,
      "whyChain": [
        "Why are DPIAs behind? The assessment template assumed the home market's regulation and needed rework for each additional market."
      ],
      "frequency": 4,
      "linkedRiskIds": [
        "rsk-15"
      ],
      "linkedIssueIds": [],
      "ownerId": "own-h7"
    },
    {
      "id": "cse-h6",
      "ref": "HEL-C-06",
      "title": "Third-party risk assessment intake has no capacity ceiling against demand",
      "description": "Why is the backlog growing? Intake accepts every vendor request with no prioritisation against assessor capacity.",
      "category": "process",
      "isRootCause": false,
      "whyChain": [
        "Why is the backlog growing? Intake accepts every vendor request with no prioritisation against assessor capacity."
      ],
      "frequency": 4,
      "linkedRiskIds": [
        "rsk-05"
      ],
      "linkedIssueIds": [],
      "ownerId": "own-h8"
    }
  ],
  "controls": [
    {
      "id": "ctl-h01",
      "ref": "HEL-CTL-01",
      "name": "Legacy application inventory reconciliation",
      "description": "Full reconciliation of the application inventory against network discovery data.",
      "type": "corrective",
      "ownerId": "own-h3",
      "frequency": "monthly",
      "designEffectiveness": 0.65,
      "operatingEffectiveness": 0.55,
      "evidenceRef": "inventory reconciliation log",
      "automated": false,
      "linkedRiskIds": [
        "rsk-01"
      ],
      "status": "active",
      "lastTested": "2026-07-09",
      "nextTest": "2026-08-08"
    },
    {
      "id": "ctl-h02",
      "ref": "HEL-CTL-02",
      "name": "Time-boxed access with periodic re-certification",
      "description": "All privileged access now expires unless re-certified by the resource owner.",
      "type": "preventive",
      "ownerId": "own-h3",
      "frequency": "quarterly",
      "designEffectiveness": 0.75,
      "operatingEffectiveness": 0.65,
      "evidenceRef": "re-certification log",
      "automated": false,
      "linkedRiskIds": [
        "rsk-03"
      ],
      "status": "active",
      "lastTested": "2026-02-09",
      "nextTest": "2026-03-11"
    },
    {
      "id": "ctl-h03",
      "ref": "HEL-CTL-03",
      "name": "Live-traffic segmentation policy validation",
      "description": "Segmentation policy is validated against live traffic before each phase gate.",
      "type": "detective",
      "ownerId": "own-h5",
      "frequency": "continuous",
      "designEffectiveness": 0.7,
      "operatingEffectiveness": 0.6,
      "evidenceRef": "traffic validation dashboard",
      "automated": true,
      "linkedRiskIds": [
        "rsk-06"
      ],
      "status": "active",
      "lastTested": "2026-05-25"
    },
    {
      "id": "ctl-h04",
      "ref": "HEL-CTL-04",
      "name": "Joint capacity forecasting forum with Meridian Cloud Systems",
      "description": "Joint capacity forecast across every Meridian customer programme, including ATLAS.",
      "type": "corrective",
      "ownerId": "own-h8",
      "frequency": "monthly",
      "designEffectiveness": 0.55,
      "operatingEffectiveness": 0.45,
      "evidenceRef": "capacity forum minutes",
      "automated": false,
      "linkedRiskIds": [
        "rsk-09"
      ],
      "status": "active",
      "lastTested": "2026-04-30",
      "nextTest": "2026-05-30"
    },
    {
      "id": "ctl-h05",
      "ref": "HEL-CTL-05",
      "name": "Per-market DPIA re-scoping",
      "description": "Each market's DPIA re-scoped against local regulation before rollout.",
      "type": "preventive",
      "ownerId": "own-h7",
      "frequency": "quarterly",
      "designEffectiveness": 0.75,
      "operatingEffectiveness": 0.65,
      "evidenceRef": "DPIA sign-off log",
      "automated": false,
      "linkedRiskIds": [
        "rsk-15"
      ],
      "status": "active",
      "lastTested": "2026-05-30",
      "nextTest": "2026-06-29"
    },
    {
      "id": "ctl-h06",
      "ref": "HEL-CTL-06",
      "name": "Third-party assessment intake prioritisation",
      "description": "Intake now prioritised by vendor criticality against fixed assessor capacity.",
      "type": "corrective",
      "ownerId": "own-h8",
      "frequency": "monthly",
      "designEffectiveness": 0.5,
      "operatingEffectiveness": 0.4,
      "evidenceRef": "intake backlog report",
      "automated": false,
      "linkedRiskIds": [
        "rsk-05"
      ],
      "status": "active",
      "lastTested": "2026-05-20",
      "nextTest": "2026-06-19"
    },
    {
      "id": "ctl-h07",
      "ref": "HEL-CTL-07",
      "name": "SOC analyst hiring and tooling readiness gate",
      "description": "Tooling go-live gated on SOC analyst headcount reaching the staffing plan.",
      "type": "preventive",
      "ownerId": "own-h4",
      "frequency": "monthly",
      "designEffectiveness": 0.6,
      "operatingEffectiveness": 0.5,
      "evidenceRef": "hiring tracker",
      "automated": false,
      "linkedRiskIds": [
        "rsk-10"
      ],
      "status": "active",
      "lastTested": "2026-06-09",
      "nextTest": "2026-07-09"
    },
    {
      "id": "ctl-h08",
      "ref": "HEL-CTL-08",
      "name": "Security awareness completion dashboard with manager escalation",
      "description": "Managers are escalated automatically when their team's completion lags target.",
      "type": "detective",
      "ownerId": "own-h6",
      "frequency": "weekly",
      "designEffectiveness": 0.6,
      "operatingEffectiveness": 0.5,
      "evidenceRef": "completion dashboard",
      "automated": false,
      "linkedRiskIds": [
        "rsk-08"
      ],
      "status": "active",
      "lastTested": "2026-07-19",
      "nextTest": "2026-08-18"
    },
    {
      "id": "ctl-h09",
      "ref": "HEL-CTL-09",
      "name": "VPN decommission regional office migration plan",
      "description": "Dedicated migration plan for the last regional office blocking VPN decommission.",
      "type": "preventive",
      "ownerId": "own-h5",
      "frequency": "event-driven",
      "designEffectiveness": 0.6,
      "operatingEffectiveness": 0.5,
      "evidenceRef": "migration plan",
      "automated": false,
      "linkedRiskIds": [
        "rsk-07"
      ],
      "status": "active",
      "lastTested": "2026-09-17",
      "nextTest": "2026-10-17"
    },
    {
      "id": "ctl-h10",
      "ref": "HEL-CTL-10",
      "name": "Pre-audit penetration test remediation sprint",
      "description": "Dedicated remediation sprint ahead of the regulatory penetration test.",
      "type": "corrective",
      "ownerId": "own-h6",
      "frequency": "event-driven",
      "designEffectiveness": 0.65,
      "operatingEffectiveness": 0.55,
      "evidenceRef": "remediation tracker",
      "automated": false,
      "linkedRiskIds": [
        "rsk-12"
      ],
      "status": "active",
      "lastTested": "2026-08-28",
      "nextTest": "2026-09-27"
    }
  ],
  "actions": [
    {
      "id": "act-h01",
      "ref": "HEL-A-01",
      "title": "Reconcile application inventory against network discovery",
      "description": "Reconciliation complete; legacy finance system added to IAM scope.",
      "ownerId": "own-h3",
      "dueDate": "2026-07-19",
      "status": "complete",
      "priority": "high",
      "linkedRiskIds": [
        "rsk-01"
      ],
      "linkedIssueIds": [],
      "linkedDependencyIds": [],
      "expectedRiskReduction": 0.35,
      "percentComplete": 100,
      "completedDate": "2026-07-14"
    },
    {
      "id": "act-h02",
      "ref": "HEL-A-02",
      "title": "Implement time-boxed access with owner re-certification",
      "description": "All standing privileged access now expires without re-certification.",
      "ownerId": "own-h3",
      "dueDate": "2026-03-01",
      "status": "complete",
      "priority": "critical",
      "linkedRiskIds": [
        "rsk-03"
      ],
      "linkedIssueIds": [],
      "linkedDependencyIds": [],
      "expectedRiskReduction": 0.45,
      "percentComplete": 100,
      "completedDate": "2026-02-27"
    },
    {
      "id": "act-h03",
      "ref": "HEL-A-03",
      "title": "Validate segmentation policy against live batch traffic",
      "description": "Live validation under way; one undocumented flow found and being added to policy.",
      "ownerId": "own-h5",
      "dueDate": "2026-06-04",
      "status": "in-progress",
      "priority": "critical",
      "linkedRiskIds": [
        "rsk-06"
      ],
      "linkedIssueIds": [],
      "linkedDependencyIds": [],
      "expectedRiskReduction": 0.4,
      "percentComplete": 55
    },
    {
      "id": "act-h04",
      "ref": "HEL-A-04",
      "title": "Escalate Meridian capacity forecast across all customer programmes",
      "description": "Joint forum raised the shortfall; Meridian is re-forecasting regional capacity.",
      "ownerId": "own-h8",
      "dueDate": "2026-05-15",
      "status": "in-progress",
      "priority": "high",
      "linkedRiskIds": [
        "rsk-09"
      ],
      "linkedIssueIds": [],
      "linkedDependencyIds": [],
      "expectedRiskReduction": 0.4,
      "percentComplete": 40
    },
    {
      "id": "act-h05",
      "ref": "HEL-A-05",
      "title": "Re-scope DPIA template per in-scope market",
      "description": "Two of four markets re-scoped and signed off.",
      "ownerId": "own-h7",
      "dueDate": "2026-06-14",
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
      "id": "act-h06",
      "ref": "HEL-A-06",
      "title": "Prioritise third-party assessment backlog by vendor criticality",
      "description": "Prioritisation model agreed; backlog re-ordering under way.",
      "ownerId": "own-h8",
      "dueDate": "2026-06-04",
      "status": "open",
      "priority": "medium",
      "linkedRiskIds": [
        "rsk-05"
      ],
      "linkedIssueIds": [],
      "linkedDependencyIds": [],
      "expectedRiskReduction": 0.3,
      "percentComplete": 25
    }
  ],
  "issues": [
    {
      "id": "iss-h01",
      "ref": "HEL-I-01",
      "title": "Regional finance system found unmanaged by IAM after go-live of phase 1",
      "description": "Resolved by adding the system to IAM scope before the next phase.",
      "ownerId": "own-h3",
      "workstreamId": "ws-h-iam",
      "priority": "high",
      "status": "resolved",
      "dateRaised": "2026-07-17",
      "targetResolution": "2026-07-21",
      "actualCostImpact": 0,
      "actualScheduleImpactDays": 0,
      "causeIds": [
        "cse-h1"
      ],
      "actionIds": [
        "act-h01"
      ],
      "affectedMilestoneIds": [
        "ms-h-01"
      ],
      "evidence": [],
      "comments": [],
      "resolvedDate": "2026-07-19"
    },
    {
      "id": "iss-h02",
      "ref": "HEL-I-02",
      "title": "Privileged access audit finds three service accounts with no owner",
      "description": "Resolved; accounts reassigned or decommissioned before re-certification went live.",
      "ownerId": "own-h3",
      "workstreamId": "ws-h-iam",
      "priority": "critical",
      "status": "resolved",
      "dateRaised": "2026-02-05",
      "targetResolution": "2026-02-09",
      "actualCostImpact": 0,
      "actualScheduleImpactDays": 0,
      "causeIds": [
        "cse-h2"
      ],
      "actionIds": [
        "act-h02"
      ],
      "affectedMilestoneIds": [
        "ms-h-02"
      ],
      "evidence": [],
      "comments": [],
      "resolvedDate": "2026-02-07"
    },
    {
      "id": "iss-h03",
      "ref": "HEL-I-03",
      "title": "Meridian Cloud Systems confirms a regional capacity shortfall for SOC tooling",
      "description": "Escalated jointly with ATLAS, which shares the same regional Meridian capacity pool.",
      "ownerId": "own-h8",
      "workstreamId": "ws-h-soc",
      "priority": "high",
      "status": "in-progress",
      "dateRaised": "2026-05-10",
      "targetResolution": "2026-06-09",
      "actualCostImpact": 180000,
      "actualScheduleImpactDays": 20,
      "causeIds": [
        "cse-h4"
      ],
      "actionIds": [
        "act-h04"
      ],
      "affectedMilestoneIds": [],
      "evidence": [],
      "comments": []
    },
    {
      "id": "iss-h04",
      "ref": "HEL-I-04",
      "title": "DPIA review finds one market's flow non-compliant ahead of rollout",
      "description": "Re-scoping under way for the affected market.",
      "ownerId": "own-h7",
      "workstreamId": "ws-h-gov",
      "priority": "high",
      "status": "in-progress",
      "dateRaised": "2026-06-07",
      "targetResolution": "2026-07-09",
      "actualCostImpact": 0,
      "actualScheduleImpactDays": 15,
      "causeIds": [
        "cse-h5"
      ],
      "actionIds": [
        "act-h05"
      ],
      "affectedMilestoneIds": [
        "ms-h-07"
      ],
      "evidence": [],
      "comments": []
    }
  ],
  "assumptions": [
    {
      "id": "asm-h01",
      "ref": "HEL-AS-01",
      "statement": "The legacy finance system can be onboarded to IAM without a further cutover window",
      "ownerId": "own-h3",
      "status": "validated",
      "confidence": "measured",
      "validationDate": "2026-07-21",
      "riskIfFalseId": "rsk-01",
      "linkedMilestoneIds": [
        "ms-h-01"
      ],
      "note": "Onboarded within the existing IAM phase 1 window."
    },
    {
      "id": "asm-h02",
      "ref": "HEL-AS-02",
      "statement": "Meridian Cloud Systems can resolve the regional capacity shortfall without slipping SOC GA",
      "ownerId": "own-h8",
      "status": "unvalidated",
      "confidence": "indicative",
      "validationDate": "2026-05-25",
      "riskIfFalseId": "rsk-09",
      "linkedMilestoneIds": [
        "ms-h-03"
      ],
      "note": "Dependent on Meridian's re-forecast; not yet confirmed against the GA date."
    },
    {
      "id": "asm-h03",
      "ref": "HEL-AS-03",
      "statement": "ATLAS's own Meridian capacity draw will not worsen the shared regional shortfall",
      "ownerId": "own-h1",
      "status": "unvalidated",
      "confidence": "anecdotal",
      "validationDate": "2026-05-25",
      "riskIfFalseId": "rsk-09",
      "linkedMilestoneIds": [
        "ms-h-03"
      ],
      "note": "Tracked jointly with ATLAS as a shared vendor risk, not treated as independent."
    },
    {
      "id": "asm-h04",
      "ref": "HEL-AS-04",
      "statement": "SOC analyst hiring will reach the staffing plan before EDR rollout completes",
      "ownerId": "own-h4",
      "status": "validating",
      "confidence": "indicative",
      "validationDate": "2026-07-29",
      "riskIfFalseId": "rsk-10",
      "linkedMilestoneIds": [
        "ms-h-06"
      ],
      "note": "Hiring pipeline tracked weekly; two of six roles still open."
    }
  ],
  "dependencies": [
    {
      "id": "dep-h01",
      "ref": "HEL-DEP-01",
      "name": "Meridian Cloud Systems shared regional capacity",
      "description": "SOC tooling GA depends on Meridian resolving the same regional capacity shortfall that also affects ATLAS.",
      "type": "vendor",
      "upstream": "Meridian Cloud Systems",
      "upstreamOwnerId": "own-h8",
      "downstream": "HELIOS SOC workstream",
      "downstreamOwnerId": "own-h4",
      "dueDate": "2026-05-15",
      "status": "at-risk",
      "criticality": "high",
      "delayProbability": 0.5,
      "potentialDelayDays": 22,
      "affectedMilestoneIds": [
        "ms-h-03"
      ],
      "affectedBenefitIds": [],
      "predecessorIds": [],
      "linkedRiskIds": [
        "rsk-09"
      ]
    },
    {
      "id": "dep-h02",
      "ref": "HEL-DEP-02",
      "name": "ATLAS API Platform identity data contract",
      "description": "IAM modernisation consumes identity attribute data from the ATLAS API layer.",
      "type": "cross-program",
      "upstream": "ATLAS API workstream",
      "upstreamOwnerId": "own-h3",
      "downstream": "HELIOS IAM workstream",
      "downstreamOwnerId": "own-h3",
      "dueDate": "2026-07-09",
      "status": "on-track",
      "criticality": "medium",
      "delayProbability": 0.3,
      "potentialDelayDays": 14,
      "affectedMilestoneIds": [
        "ms-h-01"
      ],
      "affectedBenefitIds": [],
      "predecessorIds": [],
      "linkedRiskIds": []
    },
    {
      "id": "dep-h03",
      "ref": "HEL-DEP-03",
      "name": "NOVA consent and privacy programme shared resourcing",
      "description": "DPIA delivery shares its privacy officer with NOVA's consent management workstream.",
      "type": "cross-program",
      "upstream": "NOVA marketing workstream",
      "upstreamOwnerId": "own-h7",
      "downstream": "HELIOS governance workstream",
      "downstreamOwnerId": "own-h7",
      "dueDate": "2026-06-09",
      "status": "at-risk",
      "criticality": "high",
      "delayProbability": 0.4,
      "potentialDelayDays": 16,
      "affectedMilestoneIds": [
        "ms-h-07"
      ],
      "affectedBenefitIds": [],
      "predecessorIds": [],
      "linkedRiskIds": [
        "rsk-15"
      ]
    },
    {
      "id": "dep-h04",
      "ref": "HEL-DEP-04",
      "name": "SOC tooling vendor licence and support contract",
      "description": "Licence and support contract underpins the SOC tooling platform GA.",
      "type": "vendor",
      "upstream": "Meridian Cloud Systems",
      "upstreamOwnerId": "own-h8",
      "downstream": "HELIOS SOC workstream",
      "downstreamOwnerId": "own-h4",
      "dueDate": "2026-04-20",
      "status": "at-risk",
      "criticality": "critical",
      "delayProbability": 0.5,
      "potentialDelayDays": 20,
      "affectedMilestoneIds": [
        "ms-h-03"
      ],
      "affectedBenefitIds": [],
      "predecessorIds": [],
      "linkedRiskIds": [
        "rsk-09"
      ]
    },
    {
      "id": "dep-h05",
      "ref": "HEL-DEP-05",
      "name": "Regional office network migration for VPN decommission",
      "description": "Last regional office needs its own network migration before the VPN can be retired.",
      "type": "internal",
      "upstream": "IT operations",
      "upstreamOwnerId": "own-h5",
      "downstream": "HELIOS cloud workstream",
      "downstreamOwnerId": "own-h5",
      "dueDate": "2026-10-02",
      "status": "on-track",
      "criticality": "medium",
      "delayProbability": 0.3,
      "potentialDelayDays": 12,
      "affectedMilestoneIds": [
        "ms-h-10"
      ],
      "affectedBenefitIds": [],
      "predecessorIds": [],
      "linkedRiskIds": [
        "rsk-07"
      ]
    },
    {
      "id": "dep-h06",
      "ref": "HEL-DEP-06",
      "name": "Independent penetration testing firm engagement",
      "description": "Regulatory sign-off depends on the independent penetration test completing on schedule.",
      "type": "external",
      "upstream": "Penetration testing firm",
      "upstreamOwnerId": "own-h6",
      "downstream": "HELIOS governance workstream",
      "downstreamOwnerId": "own-h6",
      "dueDate": "2026-08-28",
      "status": "on-track",
      "criticality": "high",
      "delayProbability": 0.3,
      "potentialDelayDays": 10,
      "affectedMilestoneIds": [
        "ms-h-09"
      ],
      "affectedBenefitIds": [],
      "predecessorIds": [],
      "linkedRiskIds": [
        "rsk-12"
      ]
    },
    {
      "id": "dep-h07",
      "ref": "HEL-DEP-07",
      "name": "Regulator engagement on audit scope",
      "description": "Regulator confirms audit scope ahead of the penetration test and sign-off.",
      "type": "regulatory",
      "upstream": "Data protection regulator",
      "upstreamOwnerId": "own-h7",
      "downstream": "HELIOS governance workstream",
      "downstreamOwnerId": "own-h6",
      "dueDate": "2026-09-07",
      "status": "on-track",
      "criticality": "high",
      "delayProbability": 0.3,
      "potentialDelayDays": 10,
      "affectedMilestoneIds": [
        "ms-h-09"
      ],
      "affectedBenefitIds": [],
      "predecessorIds": [],
      "linkedRiskIds": []
    },
    {
      "id": "dep-h08",
      "ref": "HEL-DEP-08",
      "name": "Finance system owner sign-off for IAM legacy onboarding",
      "description": "Finance system owner sign-off needed before the legacy tier can be onboarded to IAM.",
      "type": "internal",
      "upstream": "Finance systems team",
      "upstreamOwnerId": "own-h3",
      "downstream": "HELIOS IAM workstream",
      "downstreamOwnerId": "own-h3",
      "dueDate": "2026-07-17",
      "status": "on-track",
      "criticality": "medium",
      "delayProbability": 0.2,
      "potentialDelayDays": 8,
      "affectedMilestoneIds": [
        "ms-h-01"
      ],
      "affectedBenefitIds": [],
      "predecessorIds": [],
      "linkedRiskIds": [
        "rsk-01"
      ]
    }
  ],
  "changes": [
    {
      "id": "chg-h01",
      "ref": "HEL-CHG-01",
      "title": "Add legacy finance system to IAM phase 1 scope",
      "description": "Finance system added to IAM scope and onboarded within the existing window.",
      "requesterId": "own-h3",
      "reason": "Application inventory gap found after phase 1 went live",
      "raisedDate": "2026-07-19",
      "scopeImpact": "Small scope increase",
      "costImpact": 30000,
      "scheduleImpactDays": 5,
      "resourceImpact": "Additional onboarding effort",
      "riskImpact": "Reduces unmanaged-identity risk",
      "benefitImpact": 0,
      "affectedWorkstreamIds": [
        "ws-h-iam"
      ],
      "affectedMilestoneIds": [
        "ms-h-01"
      ],
      "affectedDependencyIds": [],
      "affectedBenefitIds": [],
      "linkedRiskIds": [
        "rsk-01"
      ],
      "decision": "approved",
      "status": "implemented",
      "decisionMakerId": "own-h1",
      "decisionDate": "2026-07-20",
      "decisionRationale": "Cost is small against the exposure of an unmanaged legacy system"
    },
    {
      "id": "chg-h02",
      "ref": "HEL-CHG-02",
      "title": "Establish a joint Meridian capacity forum with ATLAS",
      "description": "Forum established; ATLAS and HELIOS now escalate jointly.",
      "requesterId": "own-h8",
      "reason": "Meridian capacity shortfall found to affect both HELIOS and ATLAS",
      "raisedDate": "2026-05-12",
      "scopeImpact": "No scope change",
      "costImpact": 0,
      "scheduleImpactDays": 0,
      "resourceImpact": "None",
      "riskImpact": "Reduces double-counted vendor escalation effort",
      "benefitImpact": 0,
      "affectedWorkstreamIds": [
        "ws-h-soc"
      ],
      "affectedMilestoneIds": [
        "ms-h-03"
      ],
      "affectedDependencyIds": [
        "dep-h01"
      ],
      "affectedBenefitIds": [],
      "linkedRiskIds": [
        "rsk-09"
      ],
      "decision": "approved",
      "status": "implemented",
      "decisionMakerId": "own-h1",
      "decisionDate": "2026-05-14",
      "decisionRationale": "A joint forum avoids two programmes independently escalating the same shortfall"
    },
    {
      "id": "chg-h03",
      "ref": "HEL-CHG-03",
      "title": "Re-scope DPIA template per market ahead of schedule",
      "description": "Per-market re-scoping ahead of each market's own DPIA sign-off.",
      "requesterId": "own-h7",
      "reason": "DPIA review found a non-compliant flow in one market",
      "raisedDate": "2026-06-09",
      "scopeImpact": "No scope change",
      "costImpact": 35000,
      "scheduleImpactDays": 10,
      "resourceImpact": "None",
      "riskImpact": "Reduces regulatory exposure",
      "benefitImpact": 0,
      "affectedWorkstreamIds": [
        "ws-h-gov"
      ],
      "affectedMilestoneIds": [
        "ms-h-07"
      ],
      "affectedDependencyIds": [
        "dep-h03"
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
      "id": "dec-h01",
      "ref": "HEL-DEC-01",
      "title": "IAM legacy system onboarding scope",
      "context": "Application inventory gap found after phase 1 went live",
      "ownerId": "own-h3",
      "decisionMakerId": "own-h1",
      "forum": "Programme Steering",
      "dateRequired": "2026-07-19",
      "status": "decided",
      "options": [
        {
          "id": "opt-h01a",
          "label": "Add the legacy system to phase 1 scope now",
          "pros": [
            "Closes the identity gap immediately"
          ],
          "cons": [
            "Small scope and cost increase"
          ],
          "estimatedCost": 30000,
          "estimatedScheduleDays": 5,
          "residualRiskNote": "Minor schedule cost."
        },
        {
          "id": "opt-h01b",
          "label": "Defer onboarding to phase 2",
          "pros": [
            "No cost or schedule impact now"
          ],
          "cons": [
            "System remains unmanaged for another phase"
          ],
          "estimatedCost": 0,
          "estimatedScheduleDays": 0,
          "residualRiskNote": "Unmanaged identity risk persists longer."
        }
      ],
      "evidence": [],
      "expectedOutcome": "System onboarded and managed under IAM controls",
      "linkedRiskIds": [
        "rsk-01"
      ],
      "linkedChangeIds": [
        "chg-h01"
      ],
      "linkedBenefitIds": [],
      "linkedMilestoneIds": [
        "ms-h-01"
      ],
      "dateDecided": "2026-07-20",
      "chosenOptionId": "opt-h01a",
      "rationale": "Closing the identity gap now is worth the small scope increase"
    },
    {
      "id": "dec-h02",
      "ref": "HEL-DEC-02",
      "title": "Meridian capacity shortfall escalation approach",
      "context": "Meridian capacity shortfall found to affect both HELIOS and ATLAS",
      "ownerId": "own-h8",
      "decisionMakerId": "own-h1",
      "forum": "Programme Steering",
      "dateRequired": "2026-05-12",
      "status": "decided",
      "options": [
        {
          "id": "opt-h02a",
          "label": "Escalate jointly with ATLAS through one forum",
          "pros": [
            "Single view of shared demand",
            "Avoids duplicated escalation effort"
          ],
          "cons": [
            "Requires cross-programme coordination"
          ],
          "estimatedCost": 0,
          "estimatedScheduleDays": 0,
          "residualRiskNote": "Coordination overhead."
        },
        {
          "id": "opt-h02b",
          "label": "Escalate independently as two separate programmes",
          "pros": [
            "No coordination needed"
          ],
          "cons": [
            "Meridian sees inconsistent demand signals"
          ],
          "estimatedCost": 0,
          "estimatedScheduleDays": 0,
          "residualRiskNote": "Risk of Meridian under-resourcing the shared pool."
        }
      ],
      "evidence": [],
      "expectedOutcome": "Meridian re-forecasts regional capacity against combined demand",
      "linkedRiskIds": [
        "rsk-09"
      ],
      "linkedChangeIds": [
        "chg-h02"
      ],
      "linkedBenefitIds": [],
      "linkedMilestoneIds": [
        "ms-h-03"
      ],
      "dateDecided": "2026-05-14",
      "chosenOptionId": "opt-h02a",
      "rationale": "A joint forum gives Meridian one consistent demand signal across both programmes"
    },
    {
      "id": "dec-h03",
      "ref": "HEL-DEC-03",
      "title": "DPIA re-scoping sequencing",
      "context": "DPIA review found a non-compliant flow in one market",
      "ownerId": "own-h7",
      "decisionMakerId": "own-h1",
      "forum": "Programme Steering",
      "dateRequired": "2026-06-08",
      "status": "required",
      "options": [
        {
          "id": "opt-h03a",
          "label": "Re-scope market by market ahead of each rollout",
          "pros": [
            "Reduces regulatory exposure per market"
          ],
          "cons": [
            "Schedule slip per market"
          ],
          "estimatedCost": 35000,
          "estimatedScheduleDays": 10,
          "residualRiskNote": "Cumulative slip across markets."
        },
        {
          "id": "opt-h03b",
          "label": "Roll out on the home-market template everywhere",
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
      "expectedOutcome": "Zero DPIA findings at rollout across all markets",
      "linkedRiskIds": [
        "rsk-15"
      ],
      "linkedChangeIds": [
        "chg-h03"
      ],
      "linkedBenefitIds": [],
      "linkedMilestoneIds": [
        "ms-h-07"
      ]
    }
  ],
  "benefits": [
    {
      "id": "ben-h01",
      "ref": "HEL-BEN-01",
      "name": "Security incident cost avoidance",
      "description": "Security incident cost avoidance",
      "type": "financial",
      "ownerId": "own-h4",
      "expectedValue": 4200000,
      "realisedValue": 500000,
      "measure": "Annualised incident cost",
      "baseline": 3800000,
      "target": 1200000,
      "current": 2600000,
      "startDate": "2026-05-20",
      "targetDate": "2026-11-16",
      "status": "in-progress",
      "enablingMilestoneIds": [
        "ms-h-03",
        "ms-h-06"
      ],
      "threateningRiskIds": [
        "rsk-09"
      ],
      "linkedChangeIds": [],
      "linkedDecisionIds": [],
      "history": [
        {
          "date": "2026-05-20",
          "realisedValue": 300000
        },
        {
          "date": "2026-08-08",
          "realisedValue": 600000
        },
        {
          "date": "2026-10-27",
          "realisedValue": 900000
        }
      ]
    },
    {
      "id": "ben-h02",
      "ref": "HEL-BEN-02",
      "name": "Privileged access reduction",
      "description": "Privileged access reduction",
      "type": "efficiency",
      "ownerId": "own-h3",
      "expectedValue": 900000,
      "realisedValue": 100000,
      "measure": "Standing privileged accounts",
      "baseline": 1400,
      "target": 400,
      "current": 700,
      "startDate": "2026-02-09",
      "targetDate": "2026-08-28",
      "status": "in-progress",
      "enablingMilestoneIds": [
        "ms-h-02"
      ],
      "threateningRiskIds": [
        "rsk-03"
      ],
      "linkedChangeIds": [],
      "linkedDecisionIds": [],
      "history": [
        {
          "date": "2026-02-09",
          "realisedValue": 200000
        },
        {
          "date": "2026-05-20",
          "realisedValue": 550000
        },
        {
          "date": "2026-08-28",
          "realisedValue": 850000
        }
      ]
    },
    {
      "id": "ben-h03",
      "ref": "HEL-BEN-03",
      "name": "Regulatory audit finding reduction",
      "description": "Regulatory audit finding reduction",
      "type": "strategic",
      "ownerId": "own-h6",
      "expectedValue": 1600000,
      "realisedValue": 700000,
      "measure": "Open audit findings",
      "baseline": 24,
      "target": 6,
      "current": 15,
      "startDate": "2026-07-09",
      "targetDate": "2026-12-06",
      "status": "at-risk",
      "enablingMilestoneIds": [
        "ms-h-09"
      ],
      "threateningRiskIds": [
        "rsk-15"
      ],
      "linkedChangeIds": [],
      "linkedDecisionIds": [],
      "history": [
        {
          "date": "2026-07-09",
          "realisedValue": 150000
        },
        {
          "date": "2026-09-27",
          "realisedValue": 400000
        }
      ]
    },
    {
      "id": "ben-h04",
      "ref": "HEL-BEN-04",
      "name": "Cyber insurance premium reduction",
      "description": "Cyber insurance premium reduction",
      "type": "financial",
      "ownerId": "own-h1",
      "expectedValue": 700000,
      "realisedValue": 0,
      "measure": "Annual premium delta",
      "baseline": 0,
      "target": -700000,
      "current": -200000,
      "startDate": "2026-08-28",
      "targetDate": "2026-12-06",
      "status": "not-started",
      "enablingMilestoneIds": [
        "ms-h-05",
        "ms-h-06"
      ],
      "threateningRiskIds": [],
      "linkedChangeIds": [],
      "linkedDecisionIds": [],
      "history": []
    }
  ],
  "fmea": [
    {
      "id": "fme-h01",
      "ref": "HEL-FM-01",
      "process": "IAM legacy onboarding",
      "processStep": "Application inventory",
      "failureMode": "Legacy application tier missed from scope",
      "effect": "Unmanaged identity exposure for that tier",
      "cause": "Inventory built from architecture diagrams only",
      "severity": 4,
      "occurrence": 3,
      "detection": 3,
      "existingControl": "Manual architecture review",
      "recommendedAction": "Inventory reconciled against live network discovery",
      "ownerId": "own-h3",
      "dueDate": "2026-07-19",
      "actionStatus": "complete",
      "postSeverity": 4,
      "postOccurrence": 1,
      "postDetection": 1,
      "linkedRiskIds": [
        "rsk-01"
      ],
      "linkedCauseIds": [
        "cse-h1"
      ],
      "linkedControlIds": [
        "ctl-h01"
      ]
    },
    {
      "id": "fme-h02",
      "ref": "HEL-FM-02",
      "process": "Privileged access",
      "processStep": "Access grant lifecycle",
      "failureMode": "Standing access never expires",
      "effect": "Excessive access persists indefinitely",
      "cause": "No re-certification requirement",
      "severity": 5,
      "occurrence": 4,
      "detection": 3,
      "existingControl": "Ad hoc manual review",
      "recommendedAction": "Time-boxed access with periodic re-certification",
      "ownerId": "own-h3",
      "dueDate": "2026-02-27",
      "actionStatus": "complete",
      "postSeverity": 5,
      "postOccurrence": 1,
      "postDetection": 1,
      "linkedRiskIds": [
        "rsk-03"
      ],
      "linkedCauseIds": [
        "cse-h2"
      ],
      "linkedControlIds": [
        "ctl-h02"
      ]
    },
    {
      "id": "fme-h03",
      "ref": "HEL-FM-03",
      "process": "Network segmentation",
      "processStep": "Policy modelling",
      "failureMode": "Policy built from diagrams, not live traffic",
      "effect": "Segmentation breaks an undocumented data flow",
      "cause": "Diagram-only policy design",
      "severity": 4,
      "occurrence": 3,
      "detection": 3,
      "existingControl": "Design review only",
      "recommendedAction": "Live-traffic validation before each phase gate",
      "ownerId": "own-h5",
      "dueDate": "2026-06-04",
      "actionStatus": "in-progress",
      "postSeverity": 4,
      "postOccurrence": 2,
      "postDetection": 2,
      "linkedRiskIds": [
        "rsk-06"
      ],
      "linkedCauseIds": [
        "cse-h3"
      ],
      "linkedControlIds": [
        "ctl-h03"
      ]
    },
    {
      "id": "fme-h04",
      "ref": "HEL-FM-04",
      "process": "SOC tooling vendor",
      "processStep": "Capacity planning",
      "failureMode": "Vendor sizes capacity per customer, not shared pool",
      "effect": "Two concurrent customers exhaust regional capacity",
      "cause": "Single-customer capacity forecast",
      "severity": 5,
      "occurrence": 3,
      "detection": 3,
      "existingControl": "Vendor's own forecast only",
      "recommendedAction": "Joint capacity forum spanning every affected customer programme",
      "ownerId": "own-h8",
      "dueDate": "2026-05-14",
      "actionStatus": "in-progress",
      "postSeverity": 5,
      "postOccurrence": 2,
      "postDetection": 2,
      "linkedRiskIds": [
        "rsk-09"
      ],
      "linkedCauseIds": [
        "cse-h4"
      ],
      "linkedControlIds": [
        "ctl-h04"
      ]
    }
  ],
  "dmaic": [],
  "metrics": [
    {
      "id": "met-h01",
      "name": "Standing privileged accounts",
      "unit": "count",
      "workstreamId": "ws-h-iam",
      "target": 400,
      "direction": "lower-is-better",
      "series": [
        {
          "date": "2026-02-09",
          "value": 1400
        },
        {
          "date": "2026-04-30",
          "value": 1050
        },
        {
          "date": "2026-06-29",
          "value": 800
        },
        {
          "date": "2026-08-28",
          "value": 700
        }
      ]
    },
    {
      "id": "met-h02",
      "name": "Mean time to detect",
      "unit": "hours",
      "workstreamId": "ws-h-soc",
      "target": 2,
      "direction": "lower-is-better",
      "series": [
        {
          "date": "2026-04-20",
          "value": 18
        },
        {
          "date": "2026-06-19",
          "value": 10
        },
        {
          "date": "2026-08-18",
          "value": 5
        },
        {
          "date": "2026-10-07",
          "value": 3
        }
      ]
    },
    {
      "id": "met-h03",
      "name": "Open regulatory audit findings",
      "unit": "count",
      "workstreamId": "ws-h-gov",
      "target": 6,
      "direction": "lower-is-better",
      "series": [
        {
          "date": "2026-07-09",
          "value": 24
        },
        {
          "date": "2026-08-28",
          "value": 18
        },
        {
          "date": "2026-10-07",
          "value": 12
        },
        {
          "date": "2026-11-06",
          "value": 8
        }
      ]
    }
  ]
};

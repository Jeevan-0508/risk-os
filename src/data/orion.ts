// GENERATED FILE. Do not edit by hand.
// Produced by tools/gen_orion.py, which validates every cross-reference
// in the programme before writing. Re-generate with:
//   python tools/gen_orion.py
import type { Program } from '@/domain/types';

export const orionProgram: Program = {
  "id": "prog-orion",
  "name": "European Logistics Transformation",
  "codename": "ORION",
  "description": "Consolidation of eleven European distribution sites into seven hubs, replacement of three regional transport systems with a single platform, goods-to-person automation at two consolidation hubs, and a single operational control tower. Fourteen month programme delivering 14.2M of benefit against an 8.4M budget.",
  "sponsor": "Anneke Vermeulen, Programme Director",
  "programManager": "Tomas Bergstrom",
  "startDate": "2025-09-01",
  "endDate": "2026-10-31",
  "statusDate": "2026-09-09",
  "budget": 8400000,
  "spendToDate": 5940000,
  "forecastSpend": 8915000,
  "currency": "EUR",
  "strategicObjectives": [
    "Reduce European freight cost per consolidated load from 412 to 318",
    "Operate a single transport platform and a single operational control tower",
    "Raise on-time in-full delivery performance from 91.2% to 97.2%",
    "Remove the compliance exposure created by eleven locally managed carrier estates"
  ],
  "owners": [
    {
      "id": "own-01",
      "name": "Anneke Vermeulen",
      "role": "Programme Director"
    },
    {
      "id": "own-02",
      "name": "Tomas Bergstrom",
      "role": "Programme Manager"
    },
    {
      "id": "own-03",
      "name": "Priya Raman",
      "role": "Risk and Assurance Lead"
    },
    {
      "id": "own-04",
      "name": "Luca Moretti",
      "role": "Network Design Lead",
      "workstreamId": "ws-net"
    },
    {
      "id": "own-05",
      "name": "Sofia Alvarez",
      "role": "TMS Delivery Lead",
      "workstreamId": "ws-tms"
    },
    {
      "id": "own-06",
      "name": "Daniel Okonkwo",
      "role": "Integration Architect",
      "workstreamId": "ws-int"
    },
    {
      "id": "own-07",
      "name": "Marta Kowalski",
      "role": "Carrier Compliance Lead",
      "workstreamId": "ws-car"
    },
    {
      "id": "own-08",
      "name": "Henrik Larsen",
      "role": "Warehouse Automation Lead",
      "workstreamId": "ws-wms"
    },
    {
      "id": "own-09",
      "name": "Aisha Rahman",
      "role": "Control Tower Product Owner",
      "workstreamId": "ws-ctl"
    },
    {
      "id": "own-10",
      "name": "Jonas Weber",
      "role": "Change and Adoption Lead",
      "workstreamId": "ws-chg"
    },
    {
      "id": "own-11",
      "name": "Chloe Fontaine",
      "role": "Finance Business Partner"
    },
    {
      "id": "own-12",
      "name": "Ravi Menon",
      "role": "Data Quality Manager",
      "workstreamId": "ws-int"
    },
    {
      "id": "own-13",
      "name": "Elena Petrova",
      "role": "Security and Compliance Officer"
    },
    {
      "id": "own-14",
      "name": "Stefan Mueller",
      "role": "Vendor Management Lead"
    },
    {
      "id": "own-15",
      "name": "Karin Jensen",
      "role": "Operations Readiness Manager",
      "workstreamId": "ws-chg"
    }
  ],
  "workstreams": [
    {
      "id": "ws-net",
      "name": "Network Design and Hub Consolidation",
      "code": "NET",
      "description": "Redesign of the European hub network from eleven sites to seven, including two new consolidation hubs.",
      "leadOwnerId": "own-04",
      "startDate": "2025-09-01",
      "endDate": "2026-09-16",
      "budget": 1260000,
      "spendToDate": 1180000,
      "percentComplete": 82,
      "status": "in-progress"
    },
    {
      "id": "ws-tms",
      "name": "Transport Management System",
      "code": "TMS",
      "description": "Replacement of three regional legacy transport systems with a single configured TMS platform.",
      "leadOwnerId": "own-05",
      "startDate": "2025-09-21",
      "endDate": "2026-10-06",
      "budget": 2180000,
      "spendToDate": 1610000,
      "percentComplete": 71,
      "status": "at-risk"
    },
    {
      "id": "ws-int",
      "name": "Integration and Data Platform",
      "code": "INT",
      "description": "Carrier APIs, master data remediation and the event backbone that every other workstream consumes.",
      "leadOwnerId": "own-06",
      "startDate": "2025-10-01",
      "endDate": "2026-10-16",
      "budget": 1540000,
      "spendToDate": 1120000,
      "percentComplete": 64,
      "status": "at-risk"
    },
    {
      "id": "ws-car",
      "name": "Carrier Onboarding and Compliance",
      "code": "CAR",
      "description": "Contractual, customs and compliance onboarding of 34 carriers onto the new operating model.",
      "leadOwnerId": "own-07",
      "startDate": "2025-10-16",
      "endDate": "2026-10-11",
      "budget": 720000,
      "spendToDate": 505000,
      "percentComplete": 68,
      "status": "in-progress"
    },
    {
      "id": "ws-wms",
      "name": "Warehouse Automation",
      "code": "WMS",
      "description": "Goods-to-person automation at the Milan and Frankfurt consolidation hubs.",
      "leadOwnerId": "own-08",
      "startDate": "2025-10-31",
      "endDate": "2026-10-21",
      "budget": 1760000,
      "spendToDate": 1055000,
      "percentComplete": 58,
      "status": "at-risk"
    },
    {
      "id": "ws-ctl",
      "name": "Control Tower and Analytics",
      "code": "CTL",
      "description": "Single operational control tower with exception management and predictive ETA.",
      "leadOwnerId": "own-09",
      "startDate": "2025-11-30",
      "endDate": "2026-10-26",
      "budget": 620000,
      "spendToDate": 330000,
      "percentComplete": 51,
      "status": "in-progress"
    },
    {
      "id": "ws-chg",
      "name": "Change, Training and Adoption",
      "code": "CHG",
      "description": "Operational readiness, training and the benefit handover into the run organisation.",
      "leadOwnerId": "own-10",
      "startDate": "2025-11-15",
      "endDate": "2026-10-31",
      "budget": 320000,
      "spendToDate": 140000,
      "percentComplete": 44,
      "status": "in-progress"
    }
  ],
  "milestones": [
    {
      "id": "ms-01",
      "name": "Network baseline and scenario model",
      "workstreamId": "ws-net",
      "ownerId": "own-04",
      "baselineDate": "2025-10-16",
      "forecastDate": "2025-10-16",
      "status": "complete",
      "isGate": true,
      "predecessorIds": [],
      "deliverableIds": [
        "dlv-01"
      ],
      "description": "Validated baseline of flows, cost-to-serve and eleven-site network model.",
      "actualDate": "2025-10-15"
    },
    {
      "id": "ms-02",
      "name": "Hub consolidation business case approved",
      "workstreamId": "ws-net",
      "ownerId": "own-01",
      "baselineDate": "2025-11-30",
      "forecastDate": "2025-12-06",
      "status": "complete",
      "isGate": true,
      "predecessorIds": [
        "ms-01"
      ],
      "deliverableIds": [
        "dlv-02"
      ],
      "description": "Investment committee approval of the seven-hub target network.",
      "actualDate": "2025-12-06"
    },
    {
      "id": "ms-03",
      "name": "Frankfurt hub lease executed",
      "workstreamId": "ws-net",
      "ownerId": "own-04",
      "baselineDate": "2026-02-13",
      "forecastDate": "2026-02-20",
      "status": "complete",
      "isGate": false,
      "predecessorIds": [
        "ms-02"
      ],
      "deliverableIds": [],
      "description": "Head of terms and lease signature for the northern consolidation hub.",
      "actualDate": "2026-02-20"
    },
    {
      "id": "ms-04",
      "name": "Milan hub fit-out complete",
      "workstreamId": "ws-net",
      "ownerId": "own-04",
      "baselineDate": "2026-06-28",
      "forecastDate": "2026-07-16",
      "status": "complete",
      "isGate": false,
      "predecessorIds": [
        "ms-02"
      ],
      "deliverableIds": [
        "dlv-03"
      ],
      "description": "Civil works, racking and power provisioning for the southern consolidation hub.",
      "actualDate": "2026-07-16"
    },
    {
      "id": "ms-05",
      "name": "Network cutover wave 1",
      "workstreamId": "ws-net",
      "ownerId": "own-04",
      "baselineDate": "2026-10-01",
      "forecastDate": "2026-10-18",
      "status": "at-risk",
      "isGate": true,
      "predecessorIds": [
        "ms-04",
        "ms-24"
      ],
      "deliverableIds": [
        "dlv-04"
      ],
      "description": "First physical flow cutover covering Italy, Austria and Slovenia."
    },
    {
      "id": "ms-06",
      "name": "TMS vendor selected",
      "workstreamId": "ws-tms",
      "ownerId": "own-14",
      "baselineDate": "2025-11-15",
      "forecastDate": "2025-11-22",
      "status": "complete",
      "isGate": true,
      "predecessorIds": [
        "ms-01"
      ],
      "deliverableIds": [
        "dlv-05"
      ],
      "description": "Competitive selection and contract award for the target transport platform.",
      "actualDate": "2025-11-22"
    },
    {
      "id": "ms-07",
      "name": "TMS design authority sign-off",
      "workstreamId": "ws-tms",
      "ownerId": "own-05",
      "baselineDate": "2026-01-29",
      "forecastDate": "2026-02-06",
      "status": "complete",
      "isGate": true,
      "predecessorIds": [
        "ms-06"
      ],
      "deliverableIds": [
        "dlv-06"
      ],
      "description": "Solution design baselined and approved by the design authority.",
      "actualDate": "2026-02-06"
    },
    {
      "id": "ms-08",
      "name": "TMS configuration build complete",
      "workstreamId": "ws-tms",
      "ownerId": "own-05",
      "baselineDate": "2026-06-18",
      "forecastDate": "2026-07-07",
      "status": "complete",
      "isGate": false,
      "predecessorIds": [
        "ms-07"
      ],
      "deliverableIds": [
        "dlv-07"
      ],
      "description": "All in-scope configuration objects built and unit tested in the TMS.",
      "actualDate": "2026-07-07"
    },
    {
      "id": "ms-09",
      "name": "TMS UAT exit",
      "workstreamId": "ws-tms",
      "ownerId": "own-05",
      "baselineDate": "2026-08-17",
      "forecastDate": "2026-09-14",
      "status": "at-risk",
      "isGate": true,
      "predecessorIds": [
        "ms-08",
        "ms-13"
      ],
      "deliverableIds": [
        "dlv-08"
      ],
      "description": "User acceptance testing exit criteria met with no severity 1 or 2 defects open."
    },
    {
      "id": "ms-10",
      "name": "TMS go-live wave 1",
      "workstreamId": "ws-tms",
      "ownerId": "own-05",
      "baselineDate": "2026-09-16",
      "forecastDate": "2026-10-09",
      "status": "at-risk",
      "isGate": true,
      "predecessorIds": [
        "ms-09",
        "ms-14"
      ],
      "deliverableIds": [
        "dlv-09"
      ],
      "description": "Production cutover of the first wave of lanes onto the new platform."
    },
    {
      "id": "ms-11",
      "name": "Integration architecture approved",
      "workstreamId": "ws-int",
      "ownerId": "own-06",
      "baselineDate": "2025-12-30",
      "forecastDate": "2026-01-05",
      "status": "complete",
      "isGate": true,
      "predecessorIds": [
        "ms-07"
      ],
      "deliverableIds": [
        "dlv-10"
      ],
      "description": "Event backbone, API gateway and canonical data model approved.",
      "actualDate": "2026-01-05"
    },
    {
      "id": "ms-12",
      "name": "Data migration dry run 1",
      "workstreamId": "ws-int",
      "ownerId": "own-06",
      "baselineDate": "2026-04-29",
      "forecastDate": "2026-05-10",
      "status": "complete",
      "isGate": false,
      "predecessorIds": [
        "ms-11"
      ],
      "deliverableIds": [
        "dlv-11"
      ],
      "description": "First full-volume extract, transform and load rehearsal into the target platform.",
      "actualDate": "2026-05-10"
    },
    {
      "id": "ms-13",
      "name": "Carrier API integration complete",
      "workstreamId": "ws-int",
      "ownerId": "own-06",
      "baselineDate": "2026-07-18",
      "forecastDate": "2026-08-16",
      "status": "at-risk",
      "isGate": false,
      "predecessorIds": [
        "ms-11"
      ],
      "deliverableIds": [
        "dlv-12"
      ],
      "description": "Bidirectional booking, tracking and invoice APIs live for all tier 1 carriers."
    },
    {
      "id": "ms-14",
      "name": "Security testing sign-off",
      "workstreamId": "ws-int",
      "ownerId": "own-13",
      "baselineDate": "2026-08-22",
      "forecastDate": "2026-09-17",
      "status": "at-risk",
      "isGate": true,
      "predecessorIds": [
        "ms-13"
      ],
      "deliverableIds": [
        "dlv-13"
      ],
      "description": "Penetration test and threat model closure for the integration estate."
    },
    {
      "id": "ms-15",
      "name": "Data quality remediation complete",
      "workstreamId": "ws-int",
      "ownerId": "own-12",
      "baselineDate": "2026-06-28",
      "forecastDate": "2026-07-29",
      "status": "at-risk",
      "isGate": false,
      "predecessorIds": [
        "ms-12"
      ],
      "deliverableIds": [
        "dlv-14"
      ],
      "description": "Master data defect backlog cleared to the agreed exit threshold."
    },
    {
      "id": "ms-16",
      "name": "Carrier compliance framework published",
      "workstreamId": "ws-car",
      "ownerId": "own-07",
      "baselineDate": "2026-01-14",
      "forecastDate": "2026-01-19",
      "status": "complete",
      "isGate": false,
      "predecessorIds": [
        "ms-02"
      ],
      "deliverableIds": [
        "dlv-15"
      ],
      "description": "Contractual, insurance and customs compliance standard issued to all carriers.",
      "actualDate": "2026-01-19"
    },
    {
      "id": "ms-17",
      "name": "Tier 1 carrier onboarding complete",
      "workstreamId": "ws-car",
      "ownerId": "own-07",
      "baselineDate": "2026-07-08",
      "forecastDate": "2026-07-20",
      "status": "complete",
      "isGate": false,
      "predecessorIds": [
        "ms-16",
        "ms-13"
      ],
      "deliverableIds": [
        "dlv-16"
      ],
      "description": "Twelve tier 1 carriers contracted, integrated and operationally verified.",
      "actualDate": "2026-07-20"
    },
    {
      "id": "ms-18",
      "name": "Tier 2 carrier onboarding complete",
      "workstreamId": "ws-car",
      "ownerId": "own-07",
      "baselineDate": "2026-09-06",
      "forecastDate": "2026-09-16",
      "status": "not-started",
      "isGate": false,
      "predecessorIds": [
        "ms-17"
      ],
      "deliverableIds": [],
      "description": "Remaining twenty-two carriers onboarded to the new compliance standard."
    },
    {
      "id": "ms-19",
      "name": "Customs broker integration live",
      "workstreamId": "ws-car",
      "ownerId": "own-07",
      "baselineDate": "2026-08-02",
      "forecastDate": "2026-08-28",
      "status": "complete",
      "isGate": false,
      "predecessorIds": [
        "ms-13",
        "ms-16"
      ],
      "deliverableIds": [
        "dlv-17"
      ],
      "description": "Automated customs declaration handover for cross-border consolidated loads.",
      "actualDate": "2026-08-28"
    },
    {
      "id": "ms-20",
      "name": "Carrier scorecard live",
      "workstreamId": "ws-car",
      "ownerId": "own-07",
      "baselineDate": "2026-09-26",
      "forecastDate": "2026-10-02",
      "status": "not-started",
      "isGate": false,
      "predecessorIds": [
        "ms-18",
        "ms-26"
      ],
      "deliverableIds": [],
      "description": "Automated carrier performance scorecard published monthly from control tower data."
    },
    {
      "id": "ms-21",
      "name": "Automation vendor contract signed",
      "workstreamId": "ws-wms",
      "ownerId": "own-14",
      "baselineDate": "2026-01-09",
      "forecastDate": "2026-01-16",
      "status": "complete",
      "isGate": true,
      "predecessorIds": [
        "ms-02"
      ],
      "deliverableIds": [
        "dlv-18"
      ],
      "description": "Contract award for goods-to-person automation at both consolidation hubs.",
      "actualDate": "2026-01-16"
    },
    {
      "id": "ms-22",
      "name": "Milan automation install complete",
      "workstreamId": "ws-wms",
      "ownerId": "own-08",
      "baselineDate": "2026-08-07",
      "forecastDate": "2026-09-12",
      "status": "at-risk",
      "isGate": false,
      "predecessorIds": [
        "ms-21",
        "ms-04"
      ],
      "deliverableIds": [
        "dlv-19"
      ],
      "description": "Mechanical installation and power-on of the Milan goods-to-person system."
    },
    {
      "id": "ms-23",
      "name": "Automation commissioning and FAT",
      "workstreamId": "ws-wms",
      "ownerId": "own-08",
      "baselineDate": "2026-09-11",
      "forecastDate": "2026-10-10",
      "status": "at-risk",
      "isGate": true,
      "predecessorIds": [
        "ms-22"
      ],
      "deliverableIds": [
        "dlv-20"
      ],
      "description": "Factory acceptance test passed at contractual throughput and availability."
    },
    {
      "id": "ms-24",
      "name": "Warehouse go-live wave 1",
      "workstreamId": "ws-wms",
      "ownerId": "own-08",
      "baselineDate": "2026-09-28",
      "forecastDate": "2026-10-15",
      "status": "at-risk",
      "isGate": false,
      "predecessorIds": [
        "ms-23"
      ],
      "deliverableIds": [],
      "description": "First operational shift running through the automated Milan hub."
    },
    {
      "id": "ms-25",
      "name": "Control tower MVP live",
      "workstreamId": "ws-ctl",
      "ownerId": "own-09",
      "baselineDate": "2026-06-13",
      "forecastDate": "2026-06-20",
      "status": "complete",
      "isGate": false,
      "predecessorIds": [
        "ms-11"
      ],
      "deliverableIds": [
        "dlv-21"
      ],
      "description": "Exception dashboards and shipment visibility live for the pilot region.",
      "actualDate": "2026-06-20"
    },
    {
      "id": "ms-26",
      "name": "Reporting suite v1 released",
      "workstreamId": "ws-ctl",
      "ownerId": "own-09",
      "baselineDate": "2026-07-18",
      "forecastDate": "2026-08-11",
      "status": "at-risk",
      "isGate": false,
      "predecessorIds": [
        "ms-25",
        "ms-15"
      ],
      "deliverableIds": [
        "dlv-22"
      ],
      "description": "Operational and financial reporting pack released to the run organisation."
    },
    {
      "id": "ms-27",
      "name": "Predictive ETA model in production",
      "workstreamId": "ws-ctl",
      "ownerId": "own-09",
      "baselineDate": "2026-09-21",
      "forecastDate": "2026-09-27",
      "status": "not-started",
      "isGate": false,
      "predecessorIds": [
        "ms-26"
      ],
      "deliverableIds": [],
      "description": "Machine-learning ETA model deployed with monitoring and drift alerting."
    },
    {
      "id": "ms-28",
      "name": "Control tower full rollout",
      "workstreamId": "ws-ctl",
      "ownerId": "own-09",
      "baselineDate": "2026-10-11",
      "forecastDate": "2026-10-17",
      "status": "not-started",
      "isGate": false,
      "predecessorIds": [
        "ms-27",
        "ms-10"
      ],
      "deliverableIds": [],
      "description": "Control tower extended to all seven hubs and all in-scope lanes."
    },
    {
      "id": "ms-29",
      "name": "Change impact assessment complete",
      "workstreamId": "ws-chg",
      "ownerId": "own-10",
      "baselineDate": "2026-03-20",
      "forecastDate": "2026-03-26",
      "status": "complete",
      "isGate": false,
      "predecessorIds": [
        "ms-07"
      ],
      "deliverableIds": [
        "dlv-23"
      ],
      "description": "Role-level impact assessment across 1,340 affected operational staff.",
      "actualDate": "2026-03-26"
    },
    {
      "id": "ms-30",
      "name": "Super-user training delivered",
      "workstreamId": "ws-chg",
      "ownerId": "own-10",
      "baselineDate": "2026-08-12",
      "forecastDate": "2026-08-23",
      "status": "complete",
      "isGate": false,
      "predecessorIds": [
        "ms-08",
        "ms-29"
      ],
      "deliverableIds": [
        "dlv-24"
      ],
      "description": "Ninety super-users trained and certified on the new operating process.",
      "actualDate": "2026-08-23"
    },
    {
      "id": "ms-31",
      "name": "Go-live readiness review",
      "workstreamId": "ws-chg",
      "ownerId": "own-15",
      "baselineDate": "2026-09-08",
      "forecastDate": "2026-10-03",
      "status": "at-risk",
      "isGate": true,
      "predecessorIds": [
        "ms-30",
        "ms-10",
        "ms-24"
      ],
      "deliverableIds": [
        "dlv-25"
      ],
      "description": "Formal readiness gate covering process, people, data and cutover rehearsal."
    },
    {
      "id": "ms-32",
      "name": "Customer launch and benefit handover",
      "workstreamId": "ws-chg",
      "ownerId": "own-01",
      "baselineDate": "2026-10-21",
      "forecastDate": "2026-10-31",
      "status": "at-risk",
      "isGate": true,
      "predecessorIds": [
        "ms-31",
        "ms-05"
      ],
      "deliverableIds": [
        "dlv-26"
      ],
      "description": "External customer launch and formal handover of benefit ownership to operations."
    }
  ],
  "deliverables": [
    {
      "id": "dlv-01",
      "name": "Cost-to-serve baseline model",
      "milestoneId": "ms-01",
      "ownerId": "own-11",
      "dueDate": "2025-10-13",
      "status": "complete",
      "percentComplete": 100,
      "acceptanceCriteria": "Signed off by finance with variance under 2% against the general ledger."
    },
    {
      "id": "dlv-02",
      "name": "Seven-hub network business case",
      "milestoneId": "ms-02",
      "ownerId": "own-04",
      "dueDate": "2025-12-04",
      "status": "complete",
      "percentComplete": 100,
      "acceptanceCriteria": "Investment committee minute recording approval."
    },
    {
      "id": "dlv-03",
      "name": "Milan hub fit-out completion certificate",
      "milestoneId": "ms-04",
      "ownerId": "own-04",
      "dueDate": "2026-07-14",
      "status": "complete",
      "percentComplete": 100,
      "acceptanceCriteria": "Landlord and safety authority sign-off obtained."
    },
    {
      "id": "dlv-04",
      "name": "Wave 1 cutover runbook",
      "milestoneId": "ms-05",
      "ownerId": "own-15",
      "dueDate": "2026-10-11",
      "status": "in-progress",
      "percentComplete": 41,
      "acceptanceCriteria": "Rehearsed end to end with rollback proven within four hours."
    },
    {
      "id": "dlv-05",
      "name": "TMS evaluation and award recommendation",
      "milestoneId": "ms-06",
      "ownerId": "own-14",
      "dueDate": "2025-11-20",
      "status": "complete",
      "percentComplete": 100,
      "acceptanceCriteria": "Scored against weighted criteria with procurement counter-signature."
    },
    {
      "id": "dlv-06",
      "name": "TMS solution design document",
      "milestoneId": "ms-07",
      "ownerId": "own-05",
      "dueDate": "2026-02-04",
      "status": "complete",
      "percentComplete": 100,
      "acceptanceCriteria": "Approved by design authority with no open severity 1 comments."
    },
    {
      "id": "dlv-07",
      "name": "Configured TMS build, waves 1 to 3",
      "milestoneId": "ms-08",
      "ownerId": "own-05",
      "dueDate": "2026-07-03",
      "status": "complete",
      "percentComplete": 100,
      "acceptanceCriteria": "All configuration objects unit tested and version controlled."
    },
    {
      "id": "dlv-08",
      "name": "UAT exit report",
      "milestoneId": "ms-09",
      "ownerId": "own-05",
      "dueDate": "2026-09-06",
      "status": "not-started",
      "percentComplete": 12,
      "acceptanceCriteria": "Zero severity 1 and 2 defects, business sign-off recorded."
    },
    {
      "id": "dlv-09",
      "name": "Production cutover plan",
      "milestoneId": "ms-10",
      "ownerId": "own-05",
      "dueDate": "2026-10-05",
      "status": "in-progress",
      "percentComplete": 34,
      "acceptanceCriteria": "Cutover, rollback and hypercare plan approved by the steering committee."
    },
    {
      "id": "dlv-10",
      "name": "Integration architecture and canonical model",
      "milestoneId": "ms-11",
      "ownerId": "own-06",
      "dueDate": "2026-01-03",
      "status": "complete",
      "percentComplete": 100,
      "acceptanceCriteria": "Approved by the architecture review board."
    },
    {
      "id": "dlv-11",
      "name": "Migration dry run 1 report",
      "milestoneId": "ms-12",
      "ownerId": "own-12",
      "dueDate": "2026-05-08",
      "status": "complete",
      "percentComplete": 100,
      "acceptanceCriteria": "Load completeness above 99.5% with a defect log raised."
    },
    {
      "id": "dlv-12",
      "name": "Carrier API contract suite",
      "milestoneId": "ms-13",
      "ownerId": "own-06",
      "dueDate": "2026-08-12",
      "status": "at-risk",
      "percentComplete": 62,
      "acceptanceCriteria": "Booking, tracking and invoice endpoints certified with each tier 1 carrier."
    },
    {
      "id": "dlv-13",
      "name": "Penetration test report and remediation log",
      "milestoneId": "ms-14",
      "ownerId": "own-13",
      "dueDate": "2026-09-15",
      "status": "not-started",
      "percentComplete": 8,
      "acceptanceCriteria": "No open high or critical findings at sign-off."
    },
    {
      "id": "dlv-14",
      "name": "Master data remediation exit report",
      "milestoneId": "ms-15",
      "ownerId": "own-12",
      "dueDate": "2026-07-26",
      "status": "at-risk",
      "percentComplete": 55,
      "acceptanceCriteria": "Defect rate at or below 1.5% on the eight critical data attributes."
    },
    {
      "id": "dlv-15",
      "name": "Carrier compliance standard",
      "milestoneId": "ms-16",
      "ownerId": "own-07",
      "dueDate": "2026-01-17",
      "status": "complete",
      "percentComplete": 100,
      "acceptanceCriteria": "Issued to all carriers with acknowledgement tracked."
    },
    {
      "id": "dlv-16",
      "name": "Tier 1 onboarding evidence pack",
      "milestoneId": "ms-17",
      "ownerId": "own-07",
      "dueDate": "2026-07-18",
      "status": "complete",
      "percentComplete": 100,
      "acceptanceCriteria": "Contract, insurance, customs and integration evidence per carrier."
    },
    {
      "id": "dlv-17",
      "name": "Customs declaration interface",
      "milestoneId": "ms-19",
      "ownerId": "own-07",
      "dueDate": "2026-08-25",
      "status": "complete",
      "percentComplete": 100,
      "acceptanceCriteria": "End-to-end declaration submitted and cleared in the test environment."
    },
    {
      "id": "dlv-18",
      "name": "Automation supply contract",
      "milestoneId": "ms-21",
      "ownerId": "own-14",
      "dueDate": "2026-01-14",
      "status": "complete",
      "percentComplete": 100,
      "acceptanceCriteria": "Executed contract including throughput and availability warranties."
    },
    {
      "id": "dlv-19",
      "name": "Milan mechanical installation certificate",
      "milestoneId": "ms-22",
      "ownerId": "own-08",
      "dueDate": "2026-09-06",
      "status": "at-risk",
      "percentComplete": 46,
      "acceptanceCriteria": "Installation verified against layout drawings and CE documentation."
    },
    {
      "id": "dlv-20",
      "name": "Factory acceptance test protocol and results",
      "milestoneId": "ms-23",
      "ownerId": "own-08",
      "dueDate": "2026-10-08",
      "status": "not-started",
      "percentComplete": 5,
      "acceptanceCriteria": "Sustained throughput of 1,850 units per hour over four hours."
    },
    {
      "id": "dlv-21",
      "name": "Control tower MVP release",
      "milestoneId": "ms-25",
      "ownerId": "own-09",
      "dueDate": "2026-06-18",
      "status": "complete",
      "percentComplete": 100,
      "acceptanceCriteria": "Pilot region users able to manage exceptions without legacy tooling."
    },
    {
      "id": "dlv-22",
      "name": "Operational and financial reporting pack",
      "milestoneId": "ms-26",
      "ownerId": "own-09",
      "dueDate": "2026-08-08",
      "status": "at-risk",
      "percentComplete": 49,
      "acceptanceCriteria": "Reconciles to finance within 1% for three consecutive periods."
    },
    {
      "id": "dlv-23",
      "name": "Role level change impact assessment",
      "milestoneId": "ms-29",
      "ownerId": "own-10",
      "dueDate": "2026-03-24",
      "status": "complete",
      "percentComplete": 100,
      "acceptanceCriteria": "Reviewed with each hub manager and works council."
    },
    {
      "id": "dlv-24",
      "name": "Super-user certification register",
      "milestoneId": "ms-30",
      "ownerId": "own-10",
      "dueDate": "2026-08-20",
      "status": "complete",
      "percentComplete": 100,
      "acceptanceCriteria": "Ninety certified super-users recorded with assessment scores."
    },
    {
      "id": "dlv-25",
      "name": "Go-live readiness scorecard",
      "milestoneId": "ms-31",
      "ownerId": "own-15",
      "dueDate": "2026-09-30",
      "status": "not-started",
      "percentComplete": 15,
      "acceptanceCriteria": "All readiness criteria green or with an accepted deviation."
    },
    {
      "id": "dlv-26",
      "name": "Benefit handover pack",
      "milestoneId": "ms-32",
      "ownerId": "own-11",
      "dueDate": "2026-10-28",
      "status": "not-started",
      "percentComplete": 6,
      "acceptanceCriteria": "Benefit owner, measure and reporting cadence agreed in writing."
    }
  ],
  "risks": [
    {
      "id": "rsk-01",
      "ref": "RSK-01",
      "title": "TMS vendor cannot deliver the carrier API specification to plan",
      "description": "The vendor released the carrier API specification without the invoice message schema. Without it the invoice leg of the carrier integration cannot be built, which holds the integration milestone and every gate behind it.",
      "category": "vendor",
      "ownerId": "own-14",
      "workstreamId": "ws-int",
      "status": "escalated",
      "dateIdentified": "2026-05-03",
      "reviewDate": "2026-09-16",
      "strategy": "mitigate",
      "inherentProbability": 0.85,
      "inherentImpact": 4,
      "inherentFinancialImpact": 940000,
      "inherentScheduleImpactDays": 21,
      "strategicImpact": 4,
      "reputationImpact": 3,
      "timeHorizon": "immediate",
      "evidenceConfidence": "verified",
      "controlIds": [
        "ctl-01",
        "ctl-02"
      ],
      "causeIds": [
        "cse-01"
      ],
      "actionIds": [
        "act-01",
        "act-02"
      ],
      "affectedMilestoneIds": [
        "ms-13",
        "ms-14",
        "ms-10"
      ],
      "affectedBenefitIds": [
        "ben-04"
      ],
      "dependencyIds": [
        "dep-01",
        "dep-02"
      ],
      "issueIds": [
        "iss-03"
      ],
      "history": [
        {
          "date": "2026-05-10",
          "probability": 0.637,
          "impactScore": 4,
          "financialExposure": 517000
        },
        {
          "date": "2026-06-09",
          "probability": 0.708,
          "impactScore": 4,
          "financialExposure": 582040
        },
        {
          "date": "2026-07-09",
          "probability": 0.779,
          "impactScore": 4,
          "financialExposure": 647081
        },
        {
          "date": "2026-08-08",
          "probability": 0.85,
          "impactScore": 4,
          "financialExposure": 712121
        },
        {
          "date": "2026-08-16",
          "probability": 0.733,
          "impactScore": 4,
          "financialExposure": 712121
        },
        {
          "date": "2026-09-06",
          "probability": 0.85,
          "impactScore": 4,
          "financialExposure": 940000
        }
      ],
      "evidence": [
        {
          "id": "rsk-01-ev1",
          "label": "Exposure reassessed at the period 12 risk review",
          "kind": "meeting",
          "date": "2026-09-06",
          "source": "Programme risk review forum",
          "confidence": "verified"
        },
        {
          "id": "rsk-01-ev2",
          "label": "Realised as issue ISS-03",
          "kind": "system-record",
          "date": "2026-08-27",
          "source": "Programme issue log",
          "confidence": "verified"
        }
      ],
      "comments": [
        {
          "id": "rsk-01-cm1",
          "authorId": "own-14",
          "date": "2026-09-06",
          "body": "Trend and exposure are taken from the recorded history rather than a manual rating. Primary mitigation is ACT-01. 2 control(s) are linked."
        }
      ],
      "tags": [
        "vendor",
        "critical-path",
        "scenario-a"
      ]
    },
    {
      "id": "rsk-02",
      "ref": "RSK-02",
      "title": "Security testing identifies critical findings too late to remediate",
      "description": "Penetration testing sits as a single end-stage gate. A critical finding raised at that point cannot be remediated inside the cutover window, so the go-live gate would fail on assurance rather than function.",
      "category": "security",
      "ownerId": "own-13",
      "workstreamId": "ws-int",
      "status": "escalated",
      "dateIdentified": "2026-03-30",
      "reviewDate": "2026-09-14",
      "strategy": "mitigate",
      "inherentProbability": 0.55,
      "inherentImpact": 4,
      "inherentFinancialImpact": 620000,
      "inherentScheduleImpactDays": 18,
      "strategicImpact": 3,
      "reputationImpact": 4,
      "timeHorizon": "near",
      "evidenceConfidence": "measured",
      "controlIds": [
        "ctl-03",
        "ctl-04"
      ],
      "causeIds": [
        "cse-08"
      ],
      "actionIds": [
        "act-03",
        "act-26"
      ],
      "affectedMilestoneIds": [
        "ms-14",
        "ms-10"
      ],
      "affectedBenefitIds": [
        "ben-04",
        "ben-09"
      ],
      "dependencyIds": [
        "dep-03",
        "dep-04",
        "dep-05",
        "dep-35"
      ],
      "issueIds": [],
      "history": [
        {
          "date": "2026-04-06",
          "probability": 0.413,
          "impactScore": 4,
          "financialExposure": 483600
        },
        {
          "date": "2026-05-06",
          "probability": 0.447,
          "impactScore": 4,
          "financialExposure": 502340
        },
        {
          "date": "2026-06-05",
          "probability": 0.481,
          "impactScore": 4,
          "financialExposure": 521079
        },
        {
          "date": "2026-07-05",
          "probability": 0.516,
          "impactScore": 4,
          "financialExposure": 539819
        },
        {
          "date": "2026-08-04",
          "probability": 0.55,
          "impactScore": 4,
          "financialExposure": 558559
        },
        {
          "date": "2026-08-16",
          "probability": 0.521,
          "impactScore": 4,
          "financialExposure": 558559
        },
        {
          "date": "2026-09-06",
          "probability": 0.55,
          "impactScore": 4,
          "financialExposure": 620000
        }
      ],
      "evidence": [
        {
          "id": "rsk-02-ev1",
          "label": "Exposure reassessed at the period 12 risk review",
          "kind": "meeting",
          "date": "2026-09-06",
          "source": "Programme risk review forum",
          "confidence": "measured"
        }
      ],
      "comments": [
        {
          "id": "rsk-02-cm1",
          "authorId": "own-13",
          "date": "2026-09-06",
          "body": "Trend and exposure are taken from the recorded history rather than a manual rating. Primary mitigation is ACT-03. 2 control(s) are linked."
        }
      ],
      "tags": [
        "security",
        "gate",
        "scenario-a"
      ]
    },
    {
      "id": "rsk-03",
      "ref": "RSK-03",
      "title": "Carrier API defects cause booking failures in the first operating week",
      "description": "If booking or tracking calls fail after cutover, loads revert to manual handling. Premium freight and customer credits follow immediately, which is the direct threat to the premium freight benefit.",
      "category": "technology",
      "ownerId": "own-06",
      "workstreamId": "ws-int",
      "status": "open",
      "dateIdentified": "2026-05-21",
      "reviewDate": "2026-09-12",
      "strategy": "mitigate",
      "inherentProbability": 0.45,
      "inherentImpact": 5,
      "inherentFinancialImpact": 760000,
      "inherentScheduleImpactDays": 12,
      "strategicImpact": 3,
      "reputationImpact": 4,
      "timeHorizon": "near",
      "evidenceConfidence": "measured",
      "controlIds": [],
      "causeIds": [
        "cse-01"
      ],
      "actionIds": [
        "act-02"
      ],
      "affectedMilestoneIds": [
        "ms-13",
        "ms-10",
        "ms-32"
      ],
      "affectedBenefitIds": [
        "ben-04"
      ],
      "dependencyIds": [
        "dep-02",
        "dep-50"
      ],
      "issueIds": [],
      "history": [
        {
          "date": "2026-05-28",
          "probability": 0.338,
          "impactScore": 5,
          "financialExposure": 714400
        },
        {
          "date": "2026-06-27",
          "probability": 0.394,
          "impactScore": 5,
          "financialExposure": 737200
        },
        {
          "date": "2026-07-27",
          "probability": 0.45,
          "impactScore": 5,
          "financialExposure": 760000
        },
        {
          "date": "2026-08-16",
          "probability": 0.45,
          "impactScore": 5,
          "financialExposure": 760000
        },
        {
          "date": "2026-09-06",
          "probability": 0.45,
          "impactScore": 5,
          "financialExposure": 760000
        }
      ],
      "evidence": [
        {
          "id": "rsk-03-ev1",
          "label": "Exposure reassessed at the period 12 risk review",
          "kind": "meeting",
          "date": "2026-09-06",
          "source": "Programme risk review forum",
          "confidence": "measured"
        }
      ],
      "comments": [
        {
          "id": "rsk-03-cm1",
          "authorId": "own-06",
          "date": "2026-09-06",
          "body": "Trend and exposure are taken from the recorded history rather than a manual rating. Primary mitigation is ACT-02. 0 control(s) are linked."
        }
      ],
      "tags": [
        "integration",
        "customer-impact",
        "scenario-a"
      ]
    },
    {
      "id": "rsk-04",
      "ref": "RSK-04",
      "title": "Master data defects exceed the remediation exit threshold",
      "description": "The critical attribute defect rate is 3.4% against an exit threshold of 1.5% and the backlog is growing faster than the remediation team can clear it. Everything that reports off this data inherits the defect.",
      "category": "data",
      "ownerId": "own-12",
      "workstreamId": "ws-int",
      "status": "escalated",
      "dateIdentified": "2026-03-16",
      "reviewDate": "2026-09-15",
      "strategy": "mitigate",
      "inherentProbability": 0.8,
      "inherentImpact": 4,
      "inherentFinancialImpact": 680000,
      "inherentScheduleImpactDays": 24,
      "strategicImpact": 3,
      "reputationImpact": 2,
      "timeHorizon": "immediate",
      "evidenceConfidence": "verified",
      "controlIds": [
        "ctl-05",
        "ctl-06",
        "ctl-07"
      ],
      "causeIds": [
        "cse-02",
        "cse-03"
      ],
      "actionIds": [
        "act-04",
        "act-05"
      ],
      "affectedMilestoneIds": [
        "ms-15",
        "ms-26",
        "ms-10"
      ],
      "affectedBenefitIds": [
        "ben-01"
      ],
      "dependencyIds": [
        "dep-07"
      ],
      "issueIds": [
        "iss-01"
      ],
      "history": [
        {
          "date": "2026-03-23",
          "probability": 0.6,
          "impactScore": 3,
          "financialExposure": 374000
        },
        {
          "date": "2026-04-22",
          "probability": 0.65,
          "impactScore": 4,
          "financialExposure": 409288
        },
        {
          "date": "2026-05-22",
          "probability": 0.7,
          "impactScore": 4,
          "financialExposure": 444576
        },
        {
          "date": "2026-06-21",
          "probability": 0.75,
          "impactScore": 4,
          "financialExposure": 479864
        },
        {
          "date": "2026-07-21",
          "probability": 0.8,
          "impactScore": 4,
          "financialExposure": 515152
        },
        {
          "date": "2026-08-16",
          "probability": 0.69,
          "impactScore": 4,
          "financialExposure": 515152
        },
        {
          "date": "2026-09-06",
          "probability": 0.8,
          "impactScore": 4,
          "financialExposure": 680000
        }
      ],
      "evidence": [
        {
          "id": "rsk-04-ev1",
          "label": "Exposure reassessed at the period 12 risk review",
          "kind": "meeting",
          "date": "2026-09-06",
          "source": "Programme risk review forum",
          "confidence": "verified"
        },
        {
          "id": "rsk-04-ev2",
          "label": "Realised as issue ISS-01",
          "kind": "system-record",
          "date": "2026-08-27",
          "source": "Programme issue log",
          "confidence": "verified"
        }
      ],
      "comments": [
        {
          "id": "rsk-04-cm1",
          "authorId": "own-12",
          "date": "2026-09-06",
          "body": "Trend and exposure are taken from the recorded history rather than a manual rating. Primary mitigation is ACT-04. 3 control(s) are linked."
        }
      ],
      "tags": [
        "data-quality",
        "scenario-b"
      ]
    },
    {
      "id": "rsk-05",
      "ref": "RSK-05",
      "title": "Integration platform cannot sustain peak event volume",
      "description": "Event throughput has only been proven at 4% of production volume. A capacity ceiling discovered after cutover would degrade visibility for every hub simultaneously.",
      "category": "technology",
      "ownerId": "own-06",
      "workstreamId": "ws-int",
      "status": "monitoring",
      "dateIdentified": "2026-04-20",
      "reviewDate": "2026-09-22",
      "strategy": "mitigate",
      "inherentProbability": 0.3,
      "inherentImpact": 4,
      "inherentFinancialImpact": 420000,
      "inherentScheduleImpactDays": 10,
      "strategicImpact": 3,
      "reputationImpact": 2,
      "timeHorizon": "mid",
      "evidenceConfidence": "indicative",
      "controlIds": [
        "ctl-07"
      ],
      "causeIds": [
        "cse-06"
      ],
      "actionIds": [
        "act-32"
      ],
      "affectedMilestoneIds": [
        "ms-13",
        "ms-25"
      ],
      "affectedBenefitIds": [],
      "dependencyIds": [],
      "issueIds": [],
      "history": [
        {
          "date": "2026-04-27",
          "probability": 0.225,
          "impactScore": 4,
          "financialExposure": 394800
        },
        {
          "date": "2026-05-27",
          "probability": 0.25,
          "impactScore": 4,
          "financialExposure": 403200
        },
        {
          "date": "2026-06-26",
          "probability": 0.275,
          "impactScore": 4,
          "financialExposure": 411600
        },
        {
          "date": "2026-07-26",
          "probability": 0.3,
          "impactScore": 4,
          "financialExposure": 420000
        },
        {
          "date": "2026-08-16",
          "probability": 0.3,
          "impactScore": 4,
          "financialExposure": 420000
        },
        {
          "date": "2026-09-06",
          "probability": 0.3,
          "impactScore": 4,
          "financialExposure": 420000
        }
      ],
      "evidence": [
        {
          "id": "rsk-05-ev1",
          "label": "Exposure reassessed at the period 12 risk review",
          "kind": "meeting",
          "date": "2026-09-06",
          "source": "Programme risk review forum",
          "confidence": "indicative"
        }
      ],
      "comments": [
        {
          "id": "rsk-05-cm1",
          "authorId": "own-06",
          "date": "2026-09-06",
          "body": "Trend and exposure are taken from the recorded history rather than a manual rating. Primary mitigation is ACT-32. 1 control(s) are linked."
        }
      ],
      "tags": [
        "platform",
        "capacity"
      ]
    },
    {
      "id": "rsk-06",
      "ref": "RSK-06",
      "title": "Automation supplier capacity shortfall delays the Milan line",
      "description": "The supplier reallocated the Milan build slot and has not offered a firm replacement date. Commissioning, warehouse go-live and the network cutover all sit behind this single supplier constraint.",
      "category": "vendor",
      "ownerId": "own-14",
      "workstreamId": "ws-wms",
      "status": "escalated",
      "dateIdentified": "2026-05-14",
      "reviewDate": "2026-09-13",
      "strategy": "mitigate",
      "inherentProbability": 0.9,
      "inherentImpact": 5,
      "inherentFinancialImpact": 1150000,
      "inherentScheduleImpactDays": 28,
      "strategicImpact": 4,
      "reputationImpact": 3,
      "timeHorizon": "immediate",
      "evidenceConfidence": "verified",
      "controlIds": [
        "ctl-08",
        "ctl-09"
      ],
      "causeIds": [
        "cse-04"
      ],
      "actionIds": [
        "act-06",
        "act-07"
      ],
      "affectedMilestoneIds": [
        "ms-22",
        "ms-23",
        "ms-24"
      ],
      "affectedBenefitIds": [
        "ben-03",
        "ben-08"
      ],
      "dependencyIds": [
        "dep-11",
        "dep-13",
        "dep-14"
      ],
      "issueIds": [
        "iss-05"
      ],
      "history": [
        {
          "date": "2026-05-21",
          "probability": 0.675,
          "impactScore": 5,
          "financialExposure": 632500
        },
        {
          "date": "2026-06-20",
          "probability": 0.787,
          "impactScore": 5,
          "financialExposure": 751856
        },
        {
          "date": "2026-07-20",
          "probability": 0.9,
          "impactScore": 5,
          "financialExposure": 871212
        },
        {
          "date": "2026-08-16",
          "probability": 0.776,
          "impactScore": 5,
          "financialExposure": 871212
        },
        {
          "date": "2026-09-06",
          "probability": 0.9,
          "impactScore": 5,
          "financialExposure": 1150000
        }
      ],
      "evidence": [
        {
          "id": "rsk-06-ev1",
          "label": "Exposure reassessed at the period 12 risk review",
          "kind": "meeting",
          "date": "2026-09-06",
          "source": "Programme risk review forum",
          "confidence": "verified"
        },
        {
          "id": "rsk-06-ev2",
          "label": "Realised as issue ISS-05",
          "kind": "system-record",
          "date": "2026-08-27",
          "source": "Programme issue log",
          "confidence": "verified"
        }
      ],
      "comments": [
        {
          "id": "rsk-06-cm1",
          "authorId": "own-14",
          "date": "2026-09-06",
          "body": "Trend and exposure are taken from the recorded history rather than a manual rating. Primary mitigation is ACT-06. 2 control(s) are linked."
        }
      ],
      "tags": [
        "vendor",
        "critical-path",
        "scenario-c"
      ]
    },
    {
      "id": "rsk-07",
      "ref": "RSK-07",
      "title": "Milan power upgrade is not energised before installation",
      "description": "The utility quoted a 26 week lead time against a fit-out plan that assumed 14. A generator bridge is being assessed, which costs money but de-couples the install from the utility date.",
      "category": "operational",
      "ownerId": "own-04",
      "workstreamId": "ws-wms",
      "status": "monitoring",
      "dateIdentified": "2026-04-13",
      "reviewDate": "2026-09-17",
      "strategy": "mitigate",
      "inherentProbability": 0.5,
      "inherentImpact": 4,
      "inherentFinancialImpact": 380000,
      "inherentScheduleImpactDays": 20,
      "strategicImpact": 2,
      "reputationImpact": 2,
      "timeHorizon": "near",
      "evidenceConfidence": "measured",
      "controlIds": [
        "ctl-10"
      ],
      "causeIds": [
        "cse-05"
      ],
      "actionIds": [
        "act-08"
      ],
      "affectedMilestoneIds": [
        "ms-22",
        "ms-04"
      ],
      "affectedBenefitIds": [
        "ben-03"
      ],
      "dependencyIds": [
        "dep-12"
      ],
      "issueIds": [
        "iss-04"
      ],
      "history": [
        {
          "date": "2026-04-20",
          "probability": 0.375,
          "impactScore": 4,
          "financialExposure": 463600
        },
        {
          "date": "2026-05-20",
          "probability": 0.417,
          "impactScore": 4,
          "financialExposure": 459860
        },
        {
          "date": "2026-06-19",
          "probability": 0.458,
          "impactScore": 4,
          "financialExposure": 456121
        },
        {
          "date": "2026-07-19",
          "probability": 0.5,
          "impactScore": 4,
          "financialExposure": 452381
        },
        {
          "date": "2026-08-16",
          "probability": 0.543,
          "impactScore": 4,
          "financialExposure": 452381
        },
        {
          "date": "2026-09-06",
          "probability": 0.5,
          "impactScore": 4,
          "financialExposure": 380000
        }
      ],
      "evidence": [
        {
          "id": "rsk-07-ev1",
          "label": "Exposure reassessed at the period 12 risk review",
          "kind": "meeting",
          "date": "2026-09-06",
          "source": "Programme risk review forum",
          "confidence": "measured"
        },
        {
          "id": "rsk-07-ev2",
          "label": "Realised as issue ISS-04",
          "kind": "system-record",
          "date": "2026-08-27",
          "source": "Programme issue log",
          "confidence": "verified"
        }
      ],
      "comments": [
        {
          "id": "rsk-07-cm1",
          "authorId": "own-04",
          "date": "2026-09-06",
          "body": "Trend and exposure are taken from the recorded history rather than a manual rating. Primary mitigation is ACT-08. 1 control(s) are linked."
        }
      ],
      "tags": [
        "infrastructure",
        "external",
        "scenario-c"
      ]
    },
    {
      "id": "rsk-08",
      "ref": "RSK-08",
      "title": "Automation throughput falls short of the contractual FAT figure",
      "description": "The throughput model used an annual average order profile. Against a real peak week the modelled figure drops by roughly 11%, which would fail the acceptance test and delay the payment milestone.",
      "category": "technology",
      "ownerId": "own-08",
      "workstreamId": "ws-wms",
      "status": "open",
      "dateIdentified": "2026-05-27",
      "reviewDate": "2026-09-19",
      "strategy": "mitigate",
      "inherentProbability": 0.45,
      "inherentImpact": 4,
      "inherentFinancialImpact": 540000,
      "inherentScheduleImpactDays": 15,
      "strategicImpact": 3,
      "reputationImpact": 2,
      "timeHorizon": "near",
      "evidenceConfidence": "indicative",
      "controlIds": [
        "ctl-11",
        "ctl-12"
      ],
      "causeIds": [
        "cse-16"
      ],
      "actionIds": [
        "act-07",
        "act-09"
      ],
      "affectedMilestoneIds": [
        "ms-23",
        "ms-24"
      ],
      "affectedBenefitIds": [],
      "dependencyIds": [],
      "issueIds": [],
      "history": [
        {
          "date": "2026-06-03",
          "probability": 0.338,
          "impactScore": 4,
          "financialExposure": 421200
        },
        {
          "date": "2026-07-03",
          "probability": 0.394,
          "impactScore": 4,
          "financialExposure": 453843
        },
        {
          "date": "2026-08-02",
          "probability": 0.45,
          "impactScore": 4,
          "financialExposure": 486486
        },
        {
          "date": "2026-08-16",
          "probability": 0.427,
          "impactScore": 4,
          "financialExposure": 486486
        },
        {
          "date": "2026-09-06",
          "probability": 0.45,
          "impactScore": 4,
          "financialExposure": 540000
        }
      ],
      "evidence": [
        {
          "id": "rsk-08-ev1",
          "label": "Exposure reassessed at the period 12 risk review",
          "kind": "meeting",
          "date": "2026-09-06",
          "source": "Programme risk review forum",
          "confidence": "indicative"
        }
      ],
      "comments": [
        {
          "id": "rsk-08-cm1",
          "authorId": "own-08",
          "date": "2026-09-06",
          "body": "Trend and exposure are taken from the recorded history rather than a manual rating. Primary mitigation is ACT-07. 2 control(s) are linked."
        }
      ],
      "tags": [
        "automation",
        "warranty"
      ]
    },
    {
      "id": "rsk-09",
      "ref": "RSK-09",
      "title": "Reporting suite fails finance reconciliation and is not accepted",
      "description": "Operations and finance count different things, so the period 11 reconciliation variance was 4.1% against a 1% threshold. Without acceptance the run organisation cannot report benefit.",
      "category": "data",
      "ownerId": "own-11",
      "workstreamId": "ws-ctl",
      "status": "open",
      "dateIdentified": "2026-05-18",
      "reviewDate": "2026-09-11",
      "strategy": "mitigate",
      "inherentProbability": 0.6,
      "inherentImpact": 3,
      "inherentFinancialImpact": 340000,
      "inherentScheduleImpactDays": 14,
      "strategicImpact": 3,
      "reputationImpact": 2,
      "timeHorizon": "near",
      "evidenceConfidence": "measured",
      "controlIds": [
        "ctl-05",
        "ctl-13",
        "ctl-14"
      ],
      "causeIds": [
        "cse-02",
        "cse-09"
      ],
      "actionIds": [
        "act-10"
      ],
      "affectedMilestoneIds": [
        "ms-26",
        "ms-20"
      ],
      "affectedBenefitIds": [
        "ben-08"
      ],
      "dependencyIds": [
        "dep-09",
        "dep-10"
      ],
      "issueIds": [
        "iss-02"
      ],
      "history": [
        {
          "date": "2026-05-25",
          "probability": 0.45,
          "impactScore": 3,
          "financialExposure": 265200
        },
        {
          "date": "2026-06-24",
          "probability": 0.525,
          "impactScore": 3,
          "financialExposure": 285753
        },
        {
          "date": "2026-07-24",
          "probability": 0.6,
          "impactScore": 3,
          "financialExposure": 306306
        },
        {
          "date": "2026-08-16",
          "probability": 0.569,
          "impactScore": 3,
          "financialExposure": 306306
        },
        {
          "date": "2026-09-06",
          "probability": 0.6,
          "impactScore": 3,
          "financialExposure": 340000
        }
      ],
      "evidence": [
        {
          "id": "rsk-09-ev1",
          "label": "Exposure reassessed at the period 12 risk review",
          "kind": "meeting",
          "date": "2026-09-06",
          "source": "Programme risk review forum",
          "confidence": "measured"
        },
        {
          "id": "rsk-09-ev2",
          "label": "Realised as issue ISS-02",
          "kind": "system-record",
          "date": "2026-08-27",
          "source": "Programme issue log",
          "confidence": "verified"
        }
      ],
      "comments": [
        {
          "id": "rsk-09-cm1",
          "authorId": "own-11",
          "date": "2026-09-06",
          "body": "Trend and exposure are taken from the recorded history rather than a manual rating. Primary mitigation is ACT-10. 3 control(s) are linked."
        }
      ],
      "tags": [
        "reporting",
        "finance",
        "scenario-b"
      ]
    },
    {
      "id": "rsk-10",
      "ref": "RSK-10",
      "title": "Control tower adoption stalls below the level the benefit case assumes",
      "description": "Users can still work around the control tower using legacy reports. If they do, exception handling stays local and the service level benefit does not materialise.",
      "category": "people",
      "ownerId": "own-09",
      "workstreamId": "ws-ctl",
      "status": "monitoring",
      "dateIdentified": "2026-06-18",
      "reviewDate": "2026-09-24",
      "strategy": "mitigate",
      "inherentProbability": 0.4,
      "inherentImpact": 3,
      "inherentFinancialImpact": 290000,
      "inherentScheduleImpactDays": 0,
      "strategicImpact": 3,
      "reputationImpact": 2,
      "timeHorizon": "mid",
      "evidenceConfidence": "indicative",
      "controlIds": [
        "ctl-28",
        "ctl-32"
      ],
      "causeIds": [
        "cse-21"
      ],
      "actionIds": [
        "act-34"
      ],
      "affectedMilestoneIds": [
        "ms-28",
        "ms-32"
      ],
      "affectedBenefitIds": [],
      "dependencyIds": [],
      "issueIds": [],
      "history": [
        {
          "date": "2026-06-25",
          "probability": 0.3,
          "impactScore": 3,
          "financialExposure": 272600
        },
        {
          "date": "2026-07-25",
          "probability": 0.4,
          "impactScore": 3,
          "financialExposure": 290000
        },
        {
          "date": "2026-08-16",
          "probability": 0.4,
          "impactScore": 3,
          "financialExposure": 290000
        },
        {
          "date": "2026-09-06",
          "probability": 0.4,
          "impactScore": 3,
          "financialExposure": 290000
        }
      ],
      "evidence": [
        {
          "id": "rsk-10-ev1",
          "label": "Exposure reassessed at the period 12 risk review",
          "kind": "meeting",
          "date": "2026-09-06",
          "source": "Programme risk review forum",
          "confidence": "indicative"
        }
      ],
      "comments": [
        {
          "id": "rsk-10-cm1",
          "authorId": "own-09",
          "date": "2026-09-06",
          "body": "Trend and exposure are taken from the recorded history rather than a manual rating. Primary mitigation is ACT-34. 2 control(s) are linked."
        }
      ],
      "tags": [
        "adoption",
        "benefit"
      ]
    },
    {
      "id": "rsk-11",
      "ref": "RSK-11",
      "title": "Tier 1 carriers refuse the standard data sharing terms",
      "description": "Three carriers rejected the unlimited liability wording. The fallback clause is available but each fallback negotiation costs roughly three weeks of elapsed time.",
      "category": "vendor",
      "ownerId": "own-07",
      "workstreamId": "ws-car",
      "status": "monitoring",
      "dateIdentified": "2026-04-27",
      "reviewDate": "2026-09-16",
      "strategy": "mitigate",
      "inherentProbability": 0.35,
      "inherentImpact": 4,
      "inherentFinancialImpact": 460000,
      "inherentScheduleImpactDays": 12,
      "strategicImpact": 3,
      "reputationImpact": 2,
      "timeHorizon": "near",
      "evidenceConfidence": "measured",
      "controlIds": [
        "ctl-15",
        "ctl-31"
      ],
      "causeIds": [
        "cse-10"
      ],
      "actionIds": [
        "act-11"
      ],
      "affectedMilestoneIds": [
        "ms-17",
        "ms-25"
      ],
      "affectedBenefitIds": [
        "ben-02"
      ],
      "dependencyIds": [
        "dep-41",
        "dep-54"
      ],
      "issueIds": [],
      "history": [
        {
          "date": "2026-05-04",
          "probability": 0.262,
          "impactScore": 4,
          "financialExposure": 561200
        },
        {
          "date": "2026-06-03",
          "probability": 0.292,
          "impactScore": 4,
          "financialExposure": 556673
        },
        {
          "date": "2026-07-03",
          "probability": 0.321,
          "impactScore": 4,
          "financialExposure": 552146
        },
        {
          "date": "2026-08-02",
          "probability": 0.35,
          "impactScore": 4,
          "financialExposure": 547619
        },
        {
          "date": "2026-08-16",
          "probability": 0.38,
          "impactScore": 4,
          "financialExposure": 547619
        },
        {
          "date": "2026-09-06",
          "probability": 0.35,
          "impactScore": 4,
          "financialExposure": 460000
        }
      ],
      "evidence": [
        {
          "id": "rsk-11-ev1",
          "label": "Exposure reassessed at the period 12 risk review",
          "kind": "meeting",
          "date": "2026-09-06",
          "source": "Programme risk review forum",
          "confidence": "measured"
        }
      ],
      "comments": [
        {
          "id": "rsk-11-cm1",
          "authorId": "own-07",
          "date": "2026-09-06",
          "body": "Trend and exposure are taken from the recorded history rather than a manual rating. Primary mitigation is ACT-11. 2 control(s) are linked."
        }
      ],
      "tags": [
        "carrier",
        "legal"
      ]
    },
    {
      "id": "rsk-12",
      "ref": "RSK-12",
      "title": "Carrier rates increase between tender award and signature",
      "description": "Awarded rates are held for 60 days. Slippage in onboarding pushes signature outside that window and exposes the rate to re-quotation.",
      "category": "financial",
      "ownerId": "own-07",
      "workstreamId": "ws-car",
      "status": "monitoring",
      "dateIdentified": "2026-06-04",
      "reviewDate": "2026-09-20",
      "strategy": "transfer",
      "inherentProbability": 0.4,
      "inherentImpact": 3,
      "inherentFinancialImpact": 310000,
      "inherentScheduleImpactDays": 0,
      "strategicImpact": 2,
      "reputationImpact": 1,
      "timeHorizon": "mid",
      "evidenceConfidence": "measured",
      "controlIds": [
        "ctl-25",
        "ctl-27"
      ],
      "causeIds": [
        "cse-18"
      ],
      "actionIds": [],
      "affectedMilestoneIds": [
        "ms-18"
      ],
      "affectedBenefitIds": [],
      "dependencyIds": [],
      "issueIds": [],
      "history": [
        {
          "date": "2026-06-11",
          "probability": 0.3,
          "impactScore": 3,
          "financialExposure": 291400
        },
        {
          "date": "2026-07-11",
          "probability": 0.35,
          "impactScore": 3,
          "financialExposure": 300700
        },
        {
          "date": "2026-08-10",
          "probability": 0.4,
          "impactScore": 3,
          "financialExposure": 310000
        },
        {
          "date": "2026-08-16",
          "probability": 0.4,
          "impactScore": 3,
          "financialExposure": 310000
        },
        {
          "date": "2026-09-06",
          "probability": 0.4,
          "impactScore": 3,
          "financialExposure": 310000
        }
      ],
      "evidence": [
        {
          "id": "rsk-12-ev1",
          "label": "Exposure reassessed at the period 12 risk review",
          "kind": "meeting",
          "date": "2026-09-06",
          "source": "Programme risk review forum",
          "confidence": "measured"
        }
      ],
      "comments": [
        {
          "id": "rsk-12-cm1",
          "authorId": "own-07",
          "date": "2026-09-06",
          "body": "Trend and exposure are taken from the recorded history rather than a manual rating. No mitigating action is currently open. 2 control(s) are linked."
        }
      ],
      "tags": [
        "commercial",
        "inflation"
      ]
    },
    {
      "id": "rsk-13",
      "ref": "RSK-13",
      "title": "UAT defect burn-down is too slow to hit the exit gate",
      "description": "Forty-seven severity 2 defects are open against a curve that needed twenty-two by this point, and tester availability is running at 62% of committed days.",
      "category": "delivery",
      "ownerId": "own-05",
      "workstreamId": "ws-tms",
      "status": "escalated",
      "dateIdentified": "2026-06-11",
      "reviewDate": "2026-09-10",
      "strategy": "mitigate",
      "inherentProbability": 0.7,
      "inherentImpact": 4,
      "inherentFinancialImpact": 520000,
      "inherentScheduleImpactDays": 22,
      "strategicImpact": 3,
      "reputationImpact": 2,
      "timeHorizon": "immediate",
      "evidenceConfidence": "verified",
      "controlIds": [
        "ctl-17",
        "ctl-18"
      ],
      "causeIds": [
        "cse-07",
        "cse-15"
      ],
      "actionIds": [
        "act-15"
      ],
      "affectedMilestoneIds": [
        "ms-09",
        "ms-10"
      ],
      "affectedBenefitIds": [
        "ben-08"
      ],
      "dependencyIds": [
        "dep-27",
        "dep-28"
      ],
      "issueIds": [
        "iss-06"
      ],
      "history": [
        {
          "date": "2026-06-18",
          "probability": 0.525,
          "impactScore": 4,
          "financialExposure": 405600
        },
        {
          "date": "2026-07-18",
          "probability": 0.7,
          "impactScore": 4,
          "financialExposure": 468468
        },
        {
          "date": "2026-08-16",
          "probability": 0.664,
          "impactScore": 4,
          "financialExposure": 468468
        },
        {
          "date": "2026-09-06",
          "probability": 0.7,
          "impactScore": 4,
          "financialExposure": 520000
        }
      ],
      "evidence": [
        {
          "id": "rsk-13-ev1",
          "label": "Exposure reassessed at the period 12 risk review",
          "kind": "meeting",
          "date": "2026-09-06",
          "source": "Programme risk review forum",
          "confidence": "verified"
        },
        {
          "id": "rsk-13-ev2",
          "label": "Realised as issue ISS-06",
          "kind": "system-record",
          "date": "2026-08-27",
          "source": "Programme issue log",
          "confidence": "verified"
        }
      ],
      "comments": [
        {
          "id": "rsk-13-cm1",
          "authorId": "own-05",
          "date": "2026-09-06",
          "body": "Trend and exposure are taken from the recorded history rather than a manual rating. Primary mitigation is ACT-15. 2 control(s) are linked."
        }
      ],
      "tags": [
        "testing",
        "critical-path"
      ]
    },
    {
      "id": "rsk-14",
      "ref": "RSK-14",
      "title": "Customs broker interface is not certified before cross-border cutover",
      "description": "The broker has not released an interface specification. Without automated declarations, cross-border consolidated loads revert to manual clearance with penalty and delay exposure.",
      "category": "regulatory",
      "ownerId": "own-07",
      "workstreamId": "ws-car",
      "status": "escalated",
      "dateIdentified": "2026-05-08",
      "reviewDate": "2026-09-12",
      "strategy": "mitigate",
      "inherentProbability": 0.75,
      "inherentImpact": 4,
      "inherentFinancialImpact": 590000,
      "inherentScheduleImpactDays": 20,
      "strategicImpact": 3,
      "reputationImpact": 3,
      "timeHorizon": "immediate",
      "evidenceConfidence": "measured",
      "controlIds": [
        "ctl-19"
      ],
      "causeIds": [
        "cse-11"
      ],
      "actionIds": [
        "act-12"
      ],
      "affectedMilestoneIds": [
        "ms-19",
        "ms-05"
      ],
      "affectedBenefitIds": [
        "ben-07"
      ],
      "dependencyIds": [
        "dep-43",
        "dep-44"
      ],
      "issueIds": [
        "iss-07"
      ],
      "history": [
        {
          "date": "2026-05-15",
          "probability": 0.562,
          "impactScore": 4,
          "financialExposure": 460200
        },
        {
          "date": "2026-06-14",
          "probability": 0.625,
          "impactScore": 4,
          "financialExposure": 483977
        },
        {
          "date": "2026-07-14",
          "probability": 0.688,
          "impactScore": 4,
          "financialExposure": 507754
        },
        {
          "date": "2026-08-13",
          "probability": 0.75,
          "impactScore": 4,
          "financialExposure": 531532
        },
        {
          "date": "2026-08-16",
          "probability": 0.711,
          "impactScore": 4,
          "financialExposure": 531532
        },
        {
          "date": "2026-09-06",
          "probability": 0.75,
          "impactScore": 4,
          "financialExposure": 590000
        }
      ],
      "evidence": [
        {
          "id": "rsk-14-ev1",
          "label": "Exposure reassessed at the period 12 risk review",
          "kind": "meeting",
          "date": "2026-09-06",
          "source": "Programme risk review forum",
          "confidence": "measured"
        },
        {
          "id": "rsk-14-ev2",
          "label": "Realised as issue ISS-07",
          "kind": "system-record",
          "date": "2026-08-27",
          "source": "Programme issue log",
          "confidence": "verified"
        }
      ],
      "comments": [
        {
          "id": "rsk-14-cm1",
          "authorId": "own-07",
          "date": "2026-09-06",
          "body": "Trend and exposure are taken from the recorded history rather than a manual rating. Primary mitigation is ACT-12. 1 control(s) are linked."
        }
      ],
      "tags": [
        "customs",
        "regulatory"
      ]
    },
    {
      "id": "rsk-15",
      "ref": "RSK-15",
      "title": "Data protection constraints restrict carrier data flows",
      "description": "Two carrier data flows carry personal data of drivers. If the assessment restricts them, tracking granularity drops and the customs handover loses a data field.",
      "category": "regulatory",
      "ownerId": "own-13",
      "workstreamId": "ws-int",
      "status": "monitoring",
      "dateIdentified": "2026-05-03",
      "reviewDate": "2026-09-19",
      "strategy": "mitigate",
      "inherentProbability": 0.3,
      "inherentImpact": 4,
      "inherentFinancialImpact": 350000,
      "inherentScheduleImpactDays": 10,
      "strategicImpact": 3,
      "reputationImpact": 3,
      "timeHorizon": "mid",
      "evidenceConfidence": "measured",
      "controlIds": [
        "ctl-15",
        "ctl-16"
      ],
      "causeIds": [
        "cse-10"
      ],
      "actionIds": [
        "act-13"
      ],
      "affectedMilestoneIds": [
        "ms-13",
        "ms-19"
      ],
      "affectedBenefitIds": [
        "ben-07"
      ],
      "dependencyIds": [
        "dep-36",
        "dep-44"
      ],
      "issueIds": [],
      "history": [
        {
          "date": "2026-05-10",
          "probability": 0.225,
          "impactScore": 4,
          "financialExposure": 329000
        },
        {
          "date": "2026-06-09",
          "probability": 0.25,
          "impactScore": 4,
          "financialExposure": 336000
        },
        {
          "date": "2026-07-09",
          "probability": 0.275,
          "impactScore": 4,
          "financialExposure": 343000
        },
        {
          "date": "2026-08-08",
          "probability": 0.3,
          "impactScore": 4,
          "financialExposure": 350000
        },
        {
          "date": "2026-08-16",
          "probability": 0.3,
          "impactScore": 4,
          "financialExposure": 350000
        },
        {
          "date": "2026-09-06",
          "probability": 0.3,
          "impactScore": 4,
          "financialExposure": 350000
        }
      ],
      "evidence": [
        {
          "id": "rsk-15-ev1",
          "label": "Exposure reassessed at the period 12 risk review",
          "kind": "meeting",
          "date": "2026-09-06",
          "source": "Programme risk review forum",
          "confidence": "measured"
        }
      ],
      "comments": [
        {
          "id": "rsk-15-cm1",
          "authorId": "own-13",
          "date": "2026-09-06",
          "body": "Trend and exposure are taken from the recorded history rather than a manual rating. Primary mitigation is ACT-13. 2 control(s) are linked."
        }
      ],
      "tags": [
        "gdpr",
        "regulatory"
      ]
    },
    {
      "id": "rsk-16",
      "ref": "RSK-16",
      "title": "Integration design knowledge is concentrated in one architect",
      "description": "Design rationale is not documented. During a two week absence in period 10, four integration decisions stalled, which is measured evidence rather than a theoretical concern.",
      "category": "people",
      "ownerId": "own-06",
      "workstreamId": "ws-int",
      "status": "open",
      "dateIdentified": "2026-04-06",
      "reviewDate": "2026-09-18",
      "strategy": "mitigate",
      "inherentProbability": 0.4,
      "inherentImpact": 3,
      "inherentFinancialImpact": 240000,
      "inherentScheduleImpactDays": 12,
      "strategicImpact": 2,
      "reputationImpact": 1,
      "timeHorizon": "near",
      "evidenceConfidence": "verified",
      "controlIds": [
        "ctl-20"
      ],
      "causeIds": [
        "cse-12"
      ],
      "actionIds": [
        "act-14"
      ],
      "affectedMilestoneIds": [
        "ms-13",
        "ms-14"
      ],
      "affectedBenefitIds": [],
      "dependencyIds": [],
      "issueIds": [
        "iss-12"
      ],
      "history": [
        {
          "date": "2026-04-13",
          "probability": 0.3,
          "impactScore": 3,
          "financialExposure": 292800
        },
        {
          "date": "2026-05-13",
          "probability": 0.325,
          "impactScore": 3,
          "financialExposure": 291029
        },
        {
          "date": "2026-06-12",
          "probability": 0.35,
          "impactScore": 3,
          "financialExposure": 289257
        },
        {
          "date": "2026-07-12",
          "probability": 0.375,
          "impactScore": 3,
          "financialExposure": 287486
        },
        {
          "date": "2026-08-11",
          "probability": 0.4,
          "impactScore": 3,
          "financialExposure": 285714
        },
        {
          "date": "2026-08-16",
          "probability": 0.435,
          "impactScore": 3,
          "financialExposure": 285714
        },
        {
          "date": "2026-09-06",
          "probability": 0.4,
          "impactScore": 3,
          "financialExposure": 240000
        }
      ],
      "evidence": [
        {
          "id": "rsk-16-ev1",
          "label": "Exposure reassessed at the period 12 risk review",
          "kind": "meeting",
          "date": "2026-09-06",
          "source": "Programme risk review forum",
          "confidence": "verified"
        },
        {
          "id": "rsk-16-ev2",
          "label": "Realised as issue ISS-12",
          "kind": "system-record",
          "date": "2026-08-27",
          "source": "Programme issue log",
          "confidence": "verified"
        }
      ],
      "comments": [
        {
          "id": "rsk-16-cm1",
          "authorId": "own-06",
          "date": "2026-09-06",
          "body": "Trend and exposure are taken from the recorded history rather than a manual rating. Primary mitigation is ACT-14. 1 control(s) are linked."
        }
      ],
      "tags": [
        "key-person"
      ]
    },
    {
      "id": "rsk-17",
      "ref": "RSK-17",
      "title": "Super-users are not released from operational rosters for training",
      "description": "Attendance is running at 61% against a 90 super-user target. Readiness cannot be declared without certified super-users at each hub.",
      "category": "people",
      "ownerId": "own-10",
      "workstreamId": "ws-chg",
      "status": "open",
      "dateIdentified": "2026-06-25",
      "reviewDate": "2026-09-09",
      "strategy": "mitigate",
      "inherentProbability": 0.55,
      "inherentImpact": 3,
      "inherentFinancialImpact": 280000,
      "inherentScheduleImpactDays": 14,
      "strategicImpact": 2,
      "reputationImpact": 2,
      "timeHorizon": "near",
      "evidenceConfidence": "measured",
      "controlIds": [
        "ctl-18"
      ],
      "causeIds": [
        "cse-07"
      ],
      "actionIds": [
        "act-15"
      ],
      "affectedMilestoneIds": [
        "ms-30",
        "ms-31"
      ],
      "affectedBenefitIds": [
        "ben-02"
      ],
      "dependencyIds": [
        "dep-59",
        "dep-61"
      ],
      "issueIds": [
        "iss-08"
      ],
      "history": [
        {
          "date": "2026-07-02",
          "probability": 0.413,
          "impactScore": 3,
          "financialExposure": 218400
        },
        {
          "date": "2026-08-01",
          "probability": 0.55,
          "impactScore": 3,
          "financialExposure": 252252
        },
        {
          "date": "2026-08-16",
          "probability": 0.521,
          "impactScore": 3,
          "financialExposure": 252252
        },
        {
          "date": "2026-09-06",
          "probability": 0.55,
          "impactScore": 3,
          "financialExposure": 280000
        }
      ],
      "evidence": [
        {
          "id": "rsk-17-ev1",
          "label": "Exposure reassessed at the period 12 risk review",
          "kind": "meeting",
          "date": "2026-09-06",
          "source": "Programme risk review forum",
          "confidence": "measured"
        },
        {
          "id": "rsk-17-ev2",
          "label": "Realised as issue ISS-08",
          "kind": "system-record",
          "date": "2026-08-27",
          "source": "Programme issue log",
          "confidence": "verified"
        }
      ],
      "comments": [
        {
          "id": "rsk-17-cm1",
          "authorId": "own-10",
          "date": "2026-09-06",
          "body": "Trend and exposure are taken from the recorded history rather than a manual rating. Primary mitigation is ACT-15. 1 control(s) are linked."
        }
      ],
      "tags": [
        "training",
        "readiness"
      ]
    },
    {
      "id": "rsk-18",
      "ref": "RSK-18",
      "title": "Cutover rollback cannot be completed inside the agreed window",
      "description": "Rehearsal 1 rolled back in five hours ten minutes against a four hour window. A failed cutover that cannot be reversed inside the window becomes a customer-visible outage.",
      "category": "operational",
      "ownerId": "own-05",
      "workstreamId": "ws-tms",
      "status": "open",
      "dateIdentified": "2026-07-02",
      "reviewDate": "2026-09-15",
      "strategy": "mitigate",
      "inherentProbability": 0.35,
      "inherentImpact": 5,
      "inherentFinancialImpact": 720000,
      "inherentScheduleImpactDays": 8,
      "strategicImpact": 4,
      "reputationImpact": 4,
      "timeHorizon": "near",
      "evidenceConfidence": "measured",
      "controlIds": [
        "ctl-23",
        "ctl-24"
      ],
      "causeIds": [],
      "actionIds": [
        "act-16"
      ],
      "affectedMilestoneIds": [
        "ms-10",
        "ms-31"
      ],
      "affectedBenefitIds": [],
      "dependencyIds": [],
      "issueIds": [],
      "history": [
        {
          "date": "2026-07-09",
          "probability": 0.262,
          "impactScore": 5,
          "financialExposure": 676800
        },
        {
          "date": "2026-08-08",
          "probability": 0.35,
          "impactScore": 5,
          "financialExposure": 720000
        },
        {
          "date": "2026-08-16",
          "probability": 0.35,
          "impactScore": 5,
          "financialExposure": 720000
        },
        {
          "date": "2026-09-06",
          "probability": 0.35,
          "impactScore": 5,
          "financialExposure": 720000
        }
      ],
      "evidence": [
        {
          "id": "rsk-18-ev1",
          "label": "Exposure reassessed at the period 12 risk review",
          "kind": "meeting",
          "date": "2026-09-06",
          "source": "Programme risk review forum",
          "confidence": "measured"
        }
      ],
      "comments": [
        {
          "id": "rsk-18-cm1",
          "authorId": "own-05",
          "date": "2026-09-06",
          "body": "Trend and exposure are taken from the recorded history rather than a manual rating. Primary mitigation is ACT-16. 2 control(s) are linked."
        }
      ],
      "tags": [
        "cutover",
        "customer-impact"
      ]
    },
    {
      "id": "rsk-19",
      "ref": "RSK-19",
      "title": "Warehouse recruitment shortfall at the Milan hub",
      "description": "The pipeline is at 71% of the ramp-up curve in a labour market where three competing sites opened within twenty kilometres.",
      "category": "people",
      "ownerId": "own-15",
      "workstreamId": "ws-wms",
      "status": "monitoring",
      "dateIdentified": "2026-06-18",
      "reviewDate": "2026-09-17",
      "strategy": "mitigate",
      "inherentProbability": 0.45,
      "inherentImpact": 3,
      "inherentFinancialImpact": 260000,
      "inherentScheduleImpactDays": 11,
      "strategicImpact": 2,
      "reputationImpact": 1,
      "timeHorizon": "near",
      "evidenceConfidence": "measured",
      "controlIds": [
        "ctl-22"
      ],
      "causeIds": [
        "cse-14"
      ],
      "actionIds": [
        "act-17"
      ],
      "affectedMilestoneIds": [
        "ms-24"
      ],
      "affectedBenefitIds": [
        "ben-06"
      ],
      "dependencyIds": [
        "dep-15"
      ],
      "issueIds": [],
      "history": [
        {
          "date": "2026-06-25",
          "probability": 0.338,
          "impactScore": 3,
          "financialExposure": 317200
        },
        {
          "date": "2026-07-25",
          "probability": 0.45,
          "impactScore": 3,
          "financialExposure": 309524
        },
        {
          "date": "2026-08-16",
          "probability": 0.489,
          "impactScore": 3,
          "financialExposure": 309524
        },
        {
          "date": "2026-09-06",
          "probability": 0.45,
          "impactScore": 3,
          "financialExposure": 260000
        }
      ],
      "evidence": [
        {
          "id": "rsk-19-ev1",
          "label": "Exposure reassessed at the period 12 risk review",
          "kind": "meeting",
          "date": "2026-09-06",
          "source": "Programme risk review forum",
          "confidence": "measured"
        }
      ],
      "comments": [
        {
          "id": "rsk-19-cm1",
          "authorId": "own-15",
          "date": "2026-09-06",
          "body": "Trend and exposure are taken from the recorded history rather than a manual rating. Primary mitigation is ACT-17. 1 control(s) are linked."
        }
      ],
      "tags": [
        "recruitment"
      ]
    },
    {
      "id": "rsk-20",
      "ref": "RSK-20",
      "title": "Works council objection delays the new role structure",
      "description": "A formal objection was lodged because consultation began after the role design was fixed. A legally reviewed position paper is now in place and the objection is being worked.",
      "category": "regulatory",
      "ownerId": "own-10",
      "workstreamId": "ws-chg",
      "status": "monitoring",
      "dateIdentified": "2026-05-21",
      "reviewDate": "2026-09-16",
      "strategy": "mitigate",
      "inherentProbability": 0.4,
      "inherentImpact": 4,
      "inherentFinancialImpact": 430000,
      "inherentScheduleImpactDays": 24,
      "strategicImpact": 3,
      "reputationImpact": 3,
      "timeHorizon": "near",
      "evidenceConfidence": "verified",
      "controlIds": [
        "ctl-21"
      ],
      "causeIds": [
        "cse-13"
      ],
      "actionIds": [
        "act-18"
      ],
      "affectedMilestoneIds": [
        "ms-31",
        "ms-05"
      ],
      "affectedBenefitIds": [],
      "dependencyIds": [
        "dep-20",
        "dep-62"
      ],
      "issueIds": [
        "iss-11"
      ],
      "history": [
        {
          "date": "2026-05-28",
          "probability": 0.3,
          "impactScore": 4,
          "financialExposure": 524600
        },
        {
          "date": "2026-06-27",
          "probability": 0.35,
          "impactScore": 4,
          "financialExposure": 518252
        },
        {
          "date": "2026-07-27",
          "probability": 0.4,
          "impactScore": 4,
          "financialExposure": 511905
        },
        {
          "date": "2026-08-16",
          "probability": 0.435,
          "impactScore": 4,
          "financialExposure": 511905
        },
        {
          "date": "2026-09-06",
          "probability": 0.4,
          "impactScore": 4,
          "financialExposure": 430000
        }
      ],
      "evidence": [
        {
          "id": "rsk-20-ev1",
          "label": "Exposure reassessed at the period 12 risk review",
          "kind": "meeting",
          "date": "2026-09-06",
          "source": "Programme risk review forum",
          "confidence": "verified"
        },
        {
          "id": "rsk-20-ev2",
          "label": "Realised as issue ISS-11",
          "kind": "system-record",
          "date": "2026-08-27",
          "source": "Programme issue log",
          "confidence": "verified"
        }
      ],
      "comments": [
        {
          "id": "rsk-20-cm1",
          "authorId": "own-10",
          "date": "2026-09-06",
          "body": "Trend and exposure are taken from the recorded history rather than a manual rating. Primary mitigation is ACT-18. 1 control(s) are linked."
        }
      ],
      "tags": [
        "works-council",
        "regulatory"
      ]
    },
    {
      "id": "rsk-21",
      "ref": "RSK-21",
      "title": "Legacy transport system support is withdrawn before cutover completes",
      "description": "Legacy support expires at the end of Q1. With the go-live split into two waves, part of the estate would run unsupported unless the contract is extended in writing.",
      "category": "vendor",
      "ownerId": "own-14",
      "workstreamId": "ws-tms",
      "status": "open",
      "dateIdentified": "2026-05-28",
      "reviewDate": "2026-09-21",
      "strategy": "mitigate",
      "inherentProbability": 0.3,
      "inherentImpact": 5,
      "inherentFinancialImpact": 640000,
      "inherentScheduleImpactDays": 0,
      "strategicImpact": 3,
      "reputationImpact": 3,
      "timeHorizon": "mid",
      "evidenceConfidence": "indicative",
      "controlIds": [
        "ctl-01",
        "ctl-09"
      ],
      "causeIds": [],
      "actionIds": [
        "act-19"
      ],
      "affectedMilestoneIds": [
        "ms-10",
        "ms-28"
      ],
      "affectedBenefitIds": [],
      "dependencyIds": [],
      "issueIds": [],
      "history": [
        {
          "date": "2026-06-04",
          "probability": 0.225,
          "impactScore": 5,
          "financialExposure": 601600
        },
        {
          "date": "2026-07-04",
          "probability": 0.263,
          "impactScore": 5,
          "financialExposure": 620800
        },
        {
          "date": "2026-08-03",
          "probability": 0.3,
          "impactScore": 5,
          "financialExposure": 640000
        },
        {
          "date": "2026-08-16",
          "probability": 0.3,
          "impactScore": 5,
          "financialExposure": 640000
        },
        {
          "date": "2026-09-06",
          "probability": 0.3,
          "impactScore": 5,
          "financialExposure": 640000
        }
      ],
      "evidence": [
        {
          "id": "rsk-21-ev1",
          "label": "Exposure reassessed at the period 12 risk review",
          "kind": "meeting",
          "date": "2026-09-06",
          "source": "Programme risk review forum",
          "confidence": "indicative"
        }
      ],
      "comments": [
        {
          "id": "rsk-21-cm1",
          "authorId": "own-14",
          "date": "2026-09-06",
          "body": "Trend and exposure are taken from the recorded history rather than a manual rating. Primary mitigation is ACT-19. 2 control(s) are linked."
        }
      ],
      "tags": [
        "legacy",
        "vendor"
      ]
    },
    {
      "id": "rsk-22",
      "ref": "RSK-22",
      "title": "Operational business rules change after the configuration freeze",
      "description": "Rules were approved as principles rather than baselined rules, so every clarification lands as configuration rework inside an already tight build window.",
      "category": "delivery",
      "ownerId": "own-05",
      "workstreamId": "ws-tms",
      "status": "open",
      "dateIdentified": "2026-05-14",
      "reviewDate": "2026-09-13",
      "strategy": "mitigate",
      "inherentProbability": 0.6,
      "inherentImpact": 3,
      "inherentFinancialImpact": 390000,
      "inherentScheduleImpactDays": 16,
      "strategicImpact": 2,
      "reputationImpact": 1,
      "timeHorizon": "near",
      "evidenceConfidence": "measured",
      "controlIds": [
        "ctl-02",
        "ctl-17"
      ],
      "causeIds": [
        "cse-15"
      ],
      "actionIds": [
        "act-20"
      ],
      "affectedMilestoneIds": [
        "ms-08",
        "ms-09"
      ],
      "affectedBenefitIds": [
        "ben-01",
        "ben-05"
      ],
      "dependencyIds": [
        "dep-26"
      ],
      "issueIds": [],
      "history": [
        {
          "date": "2026-05-21",
          "probability": 0.45,
          "impactScore": 3,
          "financialExposure": 366600
        },
        {
          "date": "2026-06-20",
          "probability": 0.525,
          "impactScore": 3,
          "financialExposure": 378300
        },
        {
          "date": "2026-07-20",
          "probability": 0.6,
          "impactScore": 3,
          "financialExposure": 390000
        },
        {
          "date": "2026-08-16",
          "probability": 0.6,
          "impactScore": 3,
          "financialExposure": 390000
        },
        {
          "date": "2026-09-06",
          "probability": 0.6,
          "impactScore": 3,
          "financialExposure": 390000
        }
      ],
      "evidence": [
        {
          "id": "rsk-22-ev1",
          "label": "Exposure reassessed at the period 12 risk review",
          "kind": "meeting",
          "date": "2026-09-06",
          "source": "Programme risk review forum",
          "confidence": "measured"
        }
      ],
      "comments": [
        {
          "id": "rsk-22-cm1",
          "authorId": "own-05",
          "date": "2026-09-06",
          "body": "Trend and exposure are taken from the recorded history rather than a manual rating. Primary mitigation is ACT-20. 2 control(s) are linked."
        }
      ],
      "tags": [
        "scope",
        "rework"
      ]
    },
    {
      "id": "rsk-23",
      "ref": "RSK-23",
      "title": "Programme cost forecast exceeds the approved budget",
      "description": "The bottom-up re-forecast lands at 8.92M against an 8.40M approved budget, driven mainly by approved changes and contractor extensions.",
      "category": "financial",
      "ownerId": "own-11",
      "workstreamId": "ws-net",
      "status": "monitoring",
      "dateIdentified": "2026-03-23",
      "reviewDate": "2026-09-10",
      "strategy": "mitigate",
      "inherentProbability": 0.65,
      "inherentImpact": 3,
      "inherentFinancialImpact": 515000,
      "inherentScheduleImpactDays": 0,
      "strategicImpact": 3,
      "reputationImpact": 3,
      "timeHorizon": "immediate",
      "evidenceConfidence": "verified",
      "controlIds": [],
      "causeIds": [],
      "actionIds": [
        "act-21"
      ],
      "affectedMilestoneIds": [
        "ms-32"
      ],
      "affectedBenefitIds": [],
      "dependencyIds": [],
      "issueIds": [],
      "history": [
        {
          "date": "2026-03-30",
          "probability": 0.488,
          "impactScore": 3,
          "financialExposure": 401700
        },
        {
          "date": "2026-04-29",
          "probability": 0.528,
          "impactScore": 3,
          "financialExposure": 417266
        },
        {
          "date": "2026-05-29",
          "probability": 0.569,
          "impactScore": 3,
          "financialExposure": 432832
        },
        {
          "date": "2026-06-28",
          "probability": 0.609,
          "impactScore": 3,
          "financialExposure": 448398
        },
        {
          "date": "2026-07-28",
          "probability": 0.65,
          "impactScore": 3,
          "financialExposure": 463964
        },
        {
          "date": "2026-08-16",
          "probability": 0.616,
          "impactScore": 3,
          "financialExposure": 463964
        },
        {
          "date": "2026-09-06",
          "probability": 0.65,
          "impactScore": 3,
          "financialExposure": 515000
        }
      ],
      "evidence": [
        {
          "id": "rsk-23-ev1",
          "label": "Exposure reassessed at the period 12 risk review",
          "kind": "meeting",
          "date": "2026-09-06",
          "source": "Programme risk review forum",
          "confidence": "verified"
        }
      ],
      "comments": [
        {
          "id": "rsk-23-cm1",
          "authorId": "own-11",
          "date": "2026-09-06",
          "body": "Trend and exposure are taken from the recorded history rather than a manual rating. Primary mitigation is ACT-21. 0 control(s) are linked."
        }
      ],
      "tags": [
        "cost",
        "governance"
      ]
    },
    {
      "id": "rsk-24",
      "ref": "RSK-24",
      "title": "Interface collision with the Commerce Replatform programme",
      "description": "Both programmes booked change windows on the same order management interface. A shared calendar and collision review are now in place, which has reduced but not removed the exposure.",
      "category": "delivery",
      "ownerId": "own-02",
      "workstreamId": "ws-int",
      "status": "monitoring",
      "dateIdentified": "2026-04-20",
      "reviewDate": "2026-09-18",
      "strategy": "mitigate",
      "inherentProbability": 0.35,
      "inherentImpact": 4,
      "inherentFinancialImpact": 410000,
      "inherentScheduleImpactDays": 18,
      "strategicImpact": 3,
      "reputationImpact": 2,
      "timeHorizon": "near",
      "evidenceConfidence": "measured",
      "controlIds": [
        "ctl-26"
      ],
      "causeIds": [
        "cse-17"
      ],
      "actionIds": [
        "act-22"
      ],
      "affectedMilestoneIds": [
        "ms-10",
        "ms-32"
      ],
      "affectedBenefitIds": [
        "ben-09"
      ],
      "dependencyIds": [
        "dep-05",
        "dep-66"
      ],
      "issueIds": [],
      "history": [
        {
          "date": "2026-04-27",
          "probability": 0.262,
          "impactScore": 4,
          "financialExposure": 500200
        },
        {
          "date": "2026-05-27",
          "probability": 0.292,
          "impactScore": 4,
          "financialExposure": 496165
        },
        {
          "date": "2026-06-26",
          "probability": 0.321,
          "impactScore": 4,
          "financialExposure": 492130
        },
        {
          "date": "2026-07-26",
          "probability": 0.35,
          "impactScore": 4,
          "financialExposure": 488095
        },
        {
          "date": "2026-08-16",
          "probability": 0.38,
          "impactScore": 4,
          "financialExposure": 488095
        },
        {
          "date": "2026-09-06",
          "probability": 0.35,
          "impactScore": 4,
          "financialExposure": 410000
        }
      ],
      "evidence": [
        {
          "id": "rsk-24-ev1",
          "label": "Exposure reassessed at the period 12 risk review",
          "kind": "meeting",
          "date": "2026-09-06",
          "source": "Programme risk review forum",
          "confidence": "measured"
        }
      ],
      "comments": [
        {
          "id": "rsk-24-cm1",
          "authorId": "own-02",
          "date": "2026-09-06",
          "body": "Trend and exposure are taken from the recorded history rather than a manual rating. Primary mitigation is ACT-22. 1 control(s) are linked."
        }
      ],
      "tags": [
        "portfolio",
        "cross-programme"
      ]
    },
    {
      "id": "rsk-25",
      "ref": "RSK-25",
      "title": "Hypercare capacity is insufficient for a two-wave go-live",
      "description": "Hypercare was sized for a single wave. Two waves stretch the same rota across a longer period with an overlap in the middle.",
      "category": "operational",
      "ownerId": "own-05",
      "workstreamId": "ws-tms",
      "status": "open",
      "dateIdentified": "2026-07-09",
      "reviewDate": "2026-09-16",
      "strategy": "mitigate",
      "inherentProbability": 0.4,
      "inherentImpact": 3,
      "inherentFinancialImpact": 270000,
      "inherentScheduleImpactDays": 6,
      "strategicImpact": 2,
      "reputationImpact": 2,
      "timeHorizon": "near",
      "evidenceConfidence": "indicative",
      "controlIds": [
        "ctl-23",
        "ctl-24"
      ],
      "causeIds": [
        "cse-20"
      ],
      "actionIds": [
        "act-23"
      ],
      "affectedMilestoneIds": [
        "ms-10",
        "ms-31"
      ],
      "affectedBenefitIds": [],
      "dependencyIds": [],
      "issueIds": [],
      "history": [
        {
          "date": "2026-07-16",
          "probability": 0.3,
          "impactScore": 3,
          "financialExposure": 253800
        },
        {
          "date": "2026-08-15",
          "probability": 0.4,
          "impactScore": 3,
          "financialExposure": 270000
        },
        {
          "date": "2026-08-16",
          "probability": 0.4,
          "impactScore": 3,
          "financialExposure": 270000
        },
        {
          "date": "2026-09-06",
          "probability": 0.4,
          "impactScore": 3,
          "financialExposure": 270000
        }
      ],
      "evidence": [
        {
          "id": "rsk-25-ev1",
          "label": "Exposure reassessed at the period 12 risk review",
          "kind": "meeting",
          "date": "2026-09-06",
          "source": "Programme risk review forum",
          "confidence": "indicative"
        }
      ],
      "comments": [
        {
          "id": "rsk-25-cm1",
          "authorId": "own-05",
          "date": "2026-09-06",
          "body": "Trend and exposure are taken from the recorded history rather than a manual rating. Primary mitigation is ACT-23. 2 control(s) are linked."
        }
      ],
      "tags": [
        "support",
        "cutover"
      ]
    },
    {
      "id": "rsk-26",
      "ref": "RSK-26",
      "title": "Carrier invoice reconciliation errors after go-live",
      "description": "Six invoice formats are in use against a matching engine designed for two. Unmatched invoices become manual work and a rate leakage exposure.",
      "category": "financial",
      "ownerId": "own-07",
      "workstreamId": "ws-car",
      "status": "monitoring",
      "dateIdentified": "2026-06-04",
      "reviewDate": "2026-09-22",
      "strategy": "mitigate",
      "inherentProbability": 0.5,
      "inherentImpact": 3,
      "inherentFinancialImpact": 320000,
      "inherentScheduleImpactDays": 0,
      "strategicImpact": 2,
      "reputationImpact": 2,
      "timeHorizon": "mid",
      "evidenceConfidence": "measured",
      "controlIds": [
        "ctl-14",
        "ctl-25"
      ],
      "causeIds": [
        "cse-19"
      ],
      "actionIds": [
        "act-24"
      ],
      "affectedMilestoneIds": [
        "ms-17",
        "ms-20"
      ],
      "affectedBenefitIds": [],
      "dependencyIds": [],
      "issueIds": [],
      "history": [
        {
          "date": "2026-06-11",
          "probability": 0.375,
          "impactScore": 3,
          "financialExposure": 300800
        },
        {
          "date": "2026-07-11",
          "probability": 0.438,
          "impactScore": 3,
          "financialExposure": 310400
        },
        {
          "date": "2026-08-10",
          "probability": 0.5,
          "impactScore": 3,
          "financialExposure": 320000
        },
        {
          "date": "2026-08-16",
          "probability": 0.5,
          "impactScore": 3,
          "financialExposure": 320000
        },
        {
          "date": "2026-09-06",
          "probability": 0.5,
          "impactScore": 3,
          "financialExposure": 320000
        }
      ],
      "evidence": [
        {
          "id": "rsk-26-ev1",
          "label": "Exposure reassessed at the period 12 risk review",
          "kind": "meeting",
          "date": "2026-09-06",
          "source": "Programme risk review forum",
          "confidence": "measured"
        }
      ],
      "comments": [
        {
          "id": "rsk-26-cm1",
          "authorId": "own-07",
          "date": "2026-09-06",
          "body": "Trend and exposure are taken from the recorded history rather than a manual rating. Primary mitigation is ACT-24. 2 control(s) are linked."
        }
      ],
      "tags": [
        "invoice",
        "finance"
      ]
    },
    {
      "id": "rsk-27",
      "ref": "RSK-27",
      "title": "Benefit baselines are disputed by finance at handover",
      "description": "Only four of nine benefit baselines are signed. An unsigned baseline at handover means the benefit cannot be claimed however well the programme delivers.",
      "category": "financial",
      "ownerId": "own-11",
      "workstreamId": "ws-chg",
      "status": "open",
      "dateIdentified": "2026-06-11",
      "reviewDate": "2026-09-11",
      "strategy": "mitigate",
      "inherentProbability": 0.55,
      "inherentImpact": 4,
      "inherentFinancialImpact": 480000,
      "inherentScheduleImpactDays": 0,
      "strategicImpact": 4,
      "reputationImpact": 3,
      "timeHorizon": "near",
      "evidenceConfidence": "measured",
      "controlIds": [
        "ctl-13",
        "ctl-28"
      ],
      "causeIds": [
        "cse-09"
      ],
      "actionIds": [
        "act-10",
        "act-25"
      ],
      "affectedMilestoneIds": [
        "ms-32"
      ],
      "affectedBenefitIds": [
        "ben-05"
      ],
      "dependencyIds": [
        "dep-10",
        "dep-65",
        "dep-67"
      ],
      "issueIds": [],
      "history": [
        {
          "date": "2026-06-18",
          "probability": 0.413,
          "impactScore": 4,
          "financialExposure": 374400
        },
        {
          "date": "2026-07-18",
          "probability": 0.55,
          "impactScore": 4,
          "financialExposure": 432432
        },
        {
          "date": "2026-08-16",
          "probability": 0.521,
          "impactScore": 4,
          "financialExposure": 432432
        },
        {
          "date": "2026-09-06",
          "probability": 0.55,
          "impactScore": 4,
          "financialExposure": 480000
        }
      ],
      "evidence": [
        {
          "id": "rsk-27-ev1",
          "label": "Exposure reassessed at the period 12 risk review",
          "kind": "meeting",
          "date": "2026-09-06",
          "source": "Programme risk review forum",
          "confidence": "measured"
        }
      ],
      "comments": [
        {
          "id": "rsk-27-cm1",
          "authorId": "own-11",
          "date": "2026-09-06",
          "body": "Trend and exposure are taken from the recorded history rather than a manual rating. Primary mitigation is ACT-10. 2 control(s) are linked."
        }
      ],
      "tags": [
        "benefit",
        "governance",
        "scenario-b"
      ]
    },
    {
      "id": "rsk-28",
      "ref": "RSK-28",
      "title": "Expanded carrier connectivity increases cyber attack surface",
      "description": "Thirty-four carrier connections replace three regional gateways. A compromise through a carrier connection would be both an operational and a reputational event.",
      "category": "security",
      "ownerId": "own-13",
      "workstreamId": "ws-int",
      "status": "monitoring",
      "dateIdentified": "2026-04-06",
      "reviewDate": "2026-09-20",
      "strategy": "mitigate",
      "inherentProbability": 0.25,
      "inherentImpact": 5,
      "inherentFinancialImpact": 880000,
      "inherentScheduleImpactDays": 14,
      "strategicImpact": 4,
      "reputationImpact": 5,
      "timeHorizon": "mid",
      "evidenceConfidence": "measured",
      "controlIds": [
        "ctl-01",
        "ctl-03",
        "ctl-04",
        "ctl-16"
      ],
      "causeIds": [
        "cse-08"
      ],
      "actionIds": [
        "act-26"
      ],
      "affectedMilestoneIds": [
        "ms-13",
        "ms-14"
      ],
      "affectedBenefitIds": [],
      "dependencyIds": [],
      "issueIds": [],
      "history": [
        {
          "date": "2026-04-13",
          "probability": 0.188,
          "impactScore": 4,
          "financialExposure": 827200
        },
        {
          "date": "2026-05-13",
          "probability": 0.203,
          "impactScore": 5,
          "financialExposure": 840400
        },
        {
          "date": "2026-06-12",
          "probability": 0.219,
          "impactScore": 5,
          "financialExposure": 853600
        },
        {
          "date": "2026-07-12",
          "probability": 0.234,
          "impactScore": 5,
          "financialExposure": 866800
        },
        {
          "date": "2026-08-11",
          "probability": 0.25,
          "impactScore": 5,
          "financialExposure": 880000
        },
        {
          "date": "2026-08-16",
          "probability": 0.25,
          "impactScore": 5,
          "financialExposure": 880000
        },
        {
          "date": "2026-09-06",
          "probability": 0.25,
          "impactScore": 5,
          "financialExposure": 880000
        }
      ],
      "evidence": [
        {
          "id": "rsk-28-ev1",
          "label": "Exposure reassessed at the period 12 risk review",
          "kind": "meeting",
          "date": "2026-09-06",
          "source": "Programme risk review forum",
          "confidence": "measured"
        }
      ],
      "comments": [
        {
          "id": "rsk-28-cm1",
          "authorId": "own-13",
          "date": "2026-09-06",
          "body": "Trend and exposure are taken from the recorded history rather than a manual rating. Primary mitigation is ACT-26. 4 control(s) are linked."
        }
      ],
      "tags": [
        "cyber",
        "third-party"
      ]
    },
    {
      "id": "rsk-29",
      "ref": "RSK-29",
      "title": "Network cutover disrupts customer service levels",
      "description": "Wave 1 moves Italian, Austrian and Slovenian flows in a single weekend. Any degradation is immediately visible to customers rather than internal.",
      "category": "operational",
      "ownerId": "own-04",
      "workstreamId": "ws-net",
      "status": "open",
      "dateIdentified": "2026-06-25",
      "reviewDate": "2026-09-14",
      "strategy": "mitigate",
      "inherentProbability": 0.45,
      "inherentImpact": 4,
      "inherentFinancialImpact": 610000,
      "inherentScheduleImpactDays": 10,
      "strategicImpact": 4,
      "reputationImpact": 5,
      "timeHorizon": "near",
      "evidenceConfidence": "measured",
      "controlIds": [
        "ctl-29"
      ],
      "causeIds": [
        "cse-22"
      ],
      "actionIds": [
        "act-27"
      ],
      "affectedMilestoneIds": [
        "ms-05",
        "ms-32"
      ],
      "affectedBenefitIds": [],
      "dependencyIds": [],
      "issueIds": [],
      "history": [
        {
          "date": "2026-07-02",
          "probability": 0.338,
          "impactScore": 4,
          "financialExposure": 573400
        },
        {
          "date": "2026-08-01",
          "probability": 0.45,
          "impactScore": 4,
          "financialExposure": 610000
        },
        {
          "date": "2026-08-16",
          "probability": 0.45,
          "impactScore": 4,
          "financialExposure": 610000
        },
        {
          "date": "2026-09-06",
          "probability": 0.45,
          "impactScore": 4,
          "financialExposure": 610000
        }
      ],
      "evidence": [
        {
          "id": "rsk-29-ev1",
          "label": "Exposure reassessed at the period 12 risk review",
          "kind": "meeting",
          "date": "2026-09-06",
          "source": "Programme risk review forum",
          "confidence": "measured"
        }
      ],
      "comments": [
        {
          "id": "rsk-29-cm1",
          "authorId": "own-04",
          "date": "2026-09-06",
          "body": "Trend and exposure are taken from the recorded history rather than a manual rating. Primary mitigation is ACT-27. 1 control(s) are linked."
        }
      ],
      "tags": [
        "customer-impact",
        "cutover"
      ]
    },
    {
      "id": "rsk-30",
      "ref": "RSK-30",
      "title": "Frankfurt hub ramp-up is slower than the benefit model assumes",
      "description": "The benefit curve assumes a six week ramp to steady state. Comparable sites in the network took nine to eleven weeks.",
      "category": "operational",
      "ownerId": "own-04",
      "workstreamId": "ws-net",
      "status": "monitoring",
      "dateIdentified": "2026-05-21",
      "reviewDate": "2026-09-26",
      "strategy": "accept",
      "inherentProbability": 0.4,
      "inherentImpact": 3,
      "inherentFinancialImpact": 330000,
      "inherentScheduleImpactDays": 0,
      "strategicImpact": 2,
      "reputationImpact": 1,
      "timeHorizon": "far",
      "evidenceConfidence": "indicative",
      "controlIds": [
        "ctl-29"
      ],
      "causeIds": [],
      "actionIds": [
        "act-28"
      ],
      "affectedMilestoneIds": [
        "ms-05"
      ],
      "affectedBenefitIds": [],
      "dependencyIds": [],
      "issueIds": [],
      "history": [
        {
          "date": "2026-05-28",
          "probability": 0.3,
          "impactScore": 3,
          "financialExposure": 310200
        },
        {
          "date": "2026-06-27",
          "probability": 0.35,
          "impactScore": 3,
          "financialExposure": 320100
        },
        {
          "date": "2026-07-27",
          "probability": 0.4,
          "impactScore": 3,
          "financialExposure": 330000
        },
        {
          "date": "2026-08-16",
          "probability": 0.4,
          "impactScore": 3,
          "financialExposure": 330000
        },
        {
          "date": "2026-09-06",
          "probability": 0.4,
          "impactScore": 3,
          "financialExposure": 330000
        }
      ],
      "evidence": [
        {
          "id": "rsk-30-ev1",
          "label": "Exposure reassessed at the period 12 risk review",
          "kind": "meeting",
          "date": "2026-09-06",
          "source": "Programme risk review forum",
          "confidence": "indicative"
        }
      ],
      "comments": [
        {
          "id": "rsk-30-cm1",
          "authorId": "own-04",
          "date": "2026-09-06",
          "body": "Trend and exposure are taken from the recorded history rather than a manual rating. Primary mitigation is ACT-28. 1 control(s) are linked."
        }
      ],
      "tags": [
        "ramp-up",
        "benefit"
      ]
    },
    {
      "id": "rsk-31",
      "ref": "RSK-31",
      "title": "Racking delivery shortfall blocks the Milan fit-out",
      "description": "Two aisles were short-shipped. Expedited delivery closed the gap and the fit-out date was protected, so the risk was closed at the period 11 review.",
      "category": "vendor",
      "ownerId": "own-14",
      "workstreamId": "ws-net",
      "status": "closed",
      "dateIdentified": "2026-05-28",
      "reviewDate": "2026-08-17",
      "strategy": "mitigate",
      "inherentProbability": 0.6,
      "inherentImpact": 3,
      "inherentFinancialImpact": 220000,
      "inherentScheduleImpactDays": 12,
      "strategicImpact": 2,
      "reputationImpact": 1,
      "timeHorizon": "immediate",
      "evidenceConfidence": "verified",
      "controlIds": [
        "ctl-08",
        "ctl-09"
      ],
      "causeIds": [],
      "actionIds": [
        "act-29"
      ],
      "affectedMilestoneIds": [
        "ms-04",
        "ms-22"
      ],
      "affectedBenefitIds": [
        "ben-01"
      ],
      "dependencyIds": [
        "dep-19"
      ],
      "issueIds": [
        "iss-09"
      ],
      "history": [
        {
          "date": "2026-06-04",
          "probability": 0.45,
          "impactScore": 3,
          "financialExposure": 268400
        },
        {
          "date": "2026-07-04",
          "probability": 0.525,
          "impactScore": 3,
          "financialExposure": 265152
        },
        {
          "date": "2026-08-03",
          "probability": 0.6,
          "impactScore": 3,
          "financialExposure": 261905
        },
        {
          "date": "2026-08-16",
          "probability": 0.652,
          "impactScore": 3,
          "financialExposure": 261905
        },
        {
          "date": "2026-09-06",
          "probability": 0.6,
          "impactScore": 3,
          "financialExposure": 220000
        }
      ],
      "evidence": [
        {
          "id": "rsk-31-ev1",
          "label": "Exposure reassessed at the period 12 risk review",
          "kind": "meeting",
          "date": "2026-09-06",
          "source": "Programme risk review forum",
          "confidence": "verified"
        },
        {
          "id": "rsk-31-ev2",
          "label": "Realised as issue ISS-09",
          "kind": "system-record",
          "date": "2026-08-27",
          "source": "Programme issue log",
          "confidence": "verified"
        }
      ],
      "comments": [
        {
          "id": "rsk-31-cm1",
          "authorId": "own-14",
          "date": "2026-09-06",
          "body": "Trend and exposure are taken from the recorded history rather than a manual rating. Primary mitigation is ACT-29. 2 control(s) are linked."
        }
      ],
      "tags": [
        "vendor",
        "closed"
      ]
    },
    {
      "id": "rsk-32",
      "ref": "RSK-32",
      "title": "Fuel and linehaul cost inflation erodes the savings case",
      "description": "Thirty-four percent of linehaul volume sits on spot rates. The exposure is accepted with a staged tender programme as the standing mitigation rather than a project action.",
      "category": "financial",
      "ownerId": "own-11",
      "workstreamId": "ws-net",
      "status": "accepted",
      "dateIdentified": "2026-03-30",
      "reviewDate": "2026-09-07",
      "strategy": "accept",
      "inherentProbability": 0.55,
      "inherentImpact": 3,
      "inherentFinancialImpact": 420000,
      "inherentScheduleImpactDays": 0,
      "strategicImpact": 3,
      "reputationImpact": 1,
      "timeHorizon": "far",
      "evidenceConfidence": "measured",
      "controlIds": [
        "ctl-27"
      ],
      "causeIds": [
        "cse-18"
      ],
      "actionIds": [
        "act-30"
      ],
      "affectedMilestoneIds": [
        "ms-32"
      ],
      "affectedBenefitIds": [],
      "dependencyIds": [],
      "issueIds": [],
      "history": [
        {
          "date": "2026-04-06",
          "probability": 0.413,
          "impactScore": 3,
          "financialExposure": 394800
        },
        {
          "date": "2026-05-06",
          "probability": 0.447,
          "impactScore": 3,
          "financialExposure": 401100
        },
        {
          "date": "2026-06-05",
          "probability": 0.481,
          "impactScore": 3,
          "financialExposure": 407400
        },
        {
          "date": "2026-07-05",
          "probability": 0.516,
          "impactScore": 3,
          "financialExposure": 413700
        },
        {
          "date": "2026-08-04",
          "probability": 0.55,
          "impactScore": 3,
          "financialExposure": 420000
        },
        {
          "date": "2026-08-16",
          "probability": 0.55,
          "impactScore": 3,
          "financialExposure": 420000
        },
        {
          "date": "2026-09-06",
          "probability": 0.55,
          "impactScore": 3,
          "financialExposure": 420000
        }
      ],
      "evidence": [
        {
          "id": "rsk-32-ev1",
          "label": "Exposure reassessed at the period 12 risk review",
          "kind": "meeting",
          "date": "2026-09-06",
          "source": "Programme risk review forum",
          "confidence": "measured"
        }
      ],
      "comments": [
        {
          "id": "rsk-32-cm1",
          "authorId": "own-11",
          "date": "2026-09-06",
          "body": "Trend and exposure are taken from the recorded history rather than a manual rating. Primary mitigation is ACT-30. 1 control(s) are linked."
        }
      ],
      "tags": [
        "market",
        "accepted"
      ]
    },
    {
      "id": "rsk-33",
      "ref": "RSK-33",
      "title": "Automation availability stays below 97% through the first quarter",
      "description": "Comparable installations reach contractual availability after eight to twelve weeks. The benefit case assumes day one performance, which no comparable site achieved.",
      "category": "technology",
      "ownerId": "own-08",
      "workstreamId": "ws-wms",
      "status": "open",
      "dateIdentified": "2026-07-02",
      "reviewDate": "2026-09-24",
      "strategy": "mitigate",
      "inherentProbability": 0.5,
      "inherentImpact": 4,
      "inherentFinancialImpact": 470000,
      "inherentScheduleImpactDays": 0,
      "strategicImpact": 3,
      "reputationImpact": 2,
      "timeHorizon": "far",
      "evidenceConfidence": "indicative",
      "controlIds": [
        "ctl-11",
        "ctl-12"
      ],
      "causeIds": [
        "cse-16"
      ],
      "actionIds": [
        "act-09",
        "act-31"
      ],
      "affectedMilestoneIds": [
        "ms-24",
        "ms-28"
      ],
      "affectedBenefitIds": [
        "ben-03",
        "ben-06"
      ],
      "dependencyIds": [
        "dep-14",
        "dep-49"
      ],
      "issueIds": [],
      "history": [
        {
          "date": "2026-07-09",
          "probability": 0.375,
          "impactScore": 4,
          "financialExposure": 441800
        },
        {
          "date": "2026-08-08",
          "probability": 0.5,
          "impactScore": 4,
          "financialExposure": 470000
        },
        {
          "date": "2026-08-16",
          "probability": 0.5,
          "impactScore": 4,
          "financialExposure": 470000
        },
        {
          "date": "2026-09-06",
          "probability": 0.5,
          "impactScore": 4,
          "financialExposure": 470000
        }
      ],
      "evidence": [
        {
          "id": "rsk-33-ev1",
          "label": "Exposure reassessed at the period 12 risk review",
          "kind": "meeting",
          "date": "2026-09-06",
          "source": "Programme risk review forum",
          "confidence": "indicative"
        }
      ],
      "comments": [
        {
          "id": "rsk-33-cm1",
          "authorId": "own-08",
          "date": "2026-09-06",
          "body": "Trend and exposure are taken from the recorded history rather than a manual rating. Primary mitigation is ACT-09. 2 control(s) are linked."
        }
      ],
      "tags": [
        "automation",
        "availability"
      ]
    },
    {
      "id": "rsk-34",
      "ref": "RSK-34",
      "title": "Insufficient test data volume masks defects until production",
      "description": "The test environment holds 4% of production volume. Volume-sensitive defects therefore cannot surface before cutover, which is why the UAT exit signal is weaker than it looks.",
      "category": "data",
      "ownerId": "own-06",
      "workstreamId": "ws-tms",
      "status": "open",
      "dateIdentified": "2026-06-18",
      "reviewDate": "2026-09-12",
      "strategy": "mitigate",
      "inherentProbability": 0.5,
      "inherentImpact": 4,
      "inherentFinancialImpact": 450000,
      "inherentScheduleImpactDays": 15,
      "strategicImpact": 3,
      "reputationImpact": 2,
      "timeHorizon": "near",
      "evidenceConfidence": "measured",
      "controlIds": [
        "ctl-05",
        "ctl-07",
        "ctl-17"
      ],
      "causeIds": [
        "cse-06"
      ],
      "actionIds": [
        "act-32"
      ],
      "affectedMilestoneIds": [
        "ms-09",
        "ms-10"
      ],
      "affectedBenefitIds": [],
      "dependencyIds": [],
      "issueIds": [],
      "history": [
        {
          "date": "2026-06-25",
          "probability": 0.375,
          "impactScore": 4,
          "financialExposure": 351000
        },
        {
          "date": "2026-07-25",
          "probability": 0.5,
          "impactScore": 4,
          "financialExposure": 405405
        },
        {
          "date": "2026-08-16",
          "probability": 0.474,
          "impactScore": 4,
          "financialExposure": 405405
        },
        {
          "date": "2026-09-06",
          "probability": 0.5,
          "impactScore": 4,
          "financialExposure": 450000
        }
      ],
      "evidence": [
        {
          "id": "rsk-34-ev1",
          "label": "Exposure reassessed at the period 12 risk review",
          "kind": "meeting",
          "date": "2026-09-06",
          "source": "Programme risk review forum",
          "confidence": "measured"
        }
      ],
      "comments": [
        {
          "id": "rsk-34-cm1",
          "authorId": "own-06",
          "date": "2026-09-06",
          "body": "Trend and exposure are taken from the recorded history rather than a manual rating. Primary mitigation is ACT-32. 3 control(s) are linked."
        }
      ],
      "tags": [
        "testing",
        "data"
      ]
    },
    {
      "id": "rsk-35",
      "ref": "RSK-35",
      "title": "Predictive ETA model fails model risk review",
      "description": "The model has no documented risk assessment or drift monitoring. Model risk will not approve production use without both, which would delay the ETA capability rather than the go-live.",
      "category": "technology",
      "ownerId": "own-09",
      "workstreamId": "ws-ctl",
      "status": "open",
      "dateIdentified": "2026-07-16",
      "reviewDate": "2026-09-21",
      "strategy": "mitigate",
      "inherentProbability": 0.35,
      "inherentImpact": 2,
      "inherentFinancialImpact": 180000,
      "inherentScheduleImpactDays": 12,
      "strategicImpact": 2,
      "reputationImpact": 2,
      "timeHorizon": "far",
      "evidenceConfidence": "indicative",
      "controlIds": [
        "ctl-30"
      ],
      "causeIds": [],
      "actionIds": [
        "act-33"
      ],
      "affectedMilestoneIds": [
        "ms-27"
      ],
      "affectedBenefitIds": [],
      "dependencyIds": [],
      "issueIds": [],
      "history": [
        {
          "date": "2026-07-23",
          "probability": 0.262,
          "impactScore": 2,
          "financialExposure": 169200
        },
        {
          "date": "2026-08-16",
          "probability": 0.35,
          "impactScore": 2,
          "financialExposure": 180000
        },
        {
          "date": "2026-09-06",
          "probability": 0.35,
          "impactScore": 2,
          "financialExposure": 180000
        }
      ],
      "evidence": [
        {
          "id": "rsk-35-ev1",
          "label": "Exposure reassessed at the period 12 risk review",
          "kind": "meeting",
          "date": "2026-09-06",
          "source": "Programme risk review forum",
          "confidence": "indicative"
        }
      ],
      "comments": [
        {
          "id": "rsk-35-cm1",
          "authorId": "own-09",
          "date": "2026-09-06",
          "body": "Trend and exposure are taken from the recorded history rather than a manual rating. Primary mitigation is ACT-33. 1 control(s) are linked."
        }
      ],
      "tags": [
        "analytics",
        "governance"
      ]
    },
    {
      "id": "rsk-36",
      "ref": "RSK-36",
      "title": "Change fatigue reduces process compliance after go-live",
      "description": "Operational teams are absorbing a fourth major change in two years. Reported willingness in the readiness survey fell from 74% to 58%.",
      "category": "people",
      "ownerId": "own-10",
      "workstreamId": "ws-chg",
      "status": "monitoring",
      "dateIdentified": "2026-06-11",
      "reviewDate": "2026-09-25",
      "strategy": "mitigate",
      "inherentProbability": 0.45,
      "inherentImpact": 3,
      "inherentFinancialImpact": 300000,
      "inherentScheduleImpactDays": 0,
      "strategicImpact": 2,
      "reputationImpact": 2,
      "timeHorizon": "far",
      "evidenceConfidence": "anecdotal",
      "controlIds": [
        "ctl-21",
        "ctl-32"
      ],
      "causeIds": [
        "cse-13"
      ],
      "actionIds": [
        "act-34"
      ],
      "affectedMilestoneIds": [
        "ms-31",
        "ms-32"
      ],
      "affectedBenefitIds": [],
      "dependencyIds": [],
      "issueIds": [],
      "history": [
        {
          "date": "2026-06-18",
          "probability": 0.338,
          "impactScore": 3,
          "financialExposure": 282000
        },
        {
          "date": "2026-07-18",
          "probability": 0.45,
          "impactScore": 3,
          "financialExposure": 300000
        },
        {
          "date": "2026-08-16",
          "probability": 0.45,
          "impactScore": 3,
          "financialExposure": 300000
        },
        {
          "date": "2026-09-06",
          "probability": 0.45,
          "impactScore": 3,
          "financialExposure": 300000
        }
      ],
      "evidence": [
        {
          "id": "rsk-36-ev1",
          "label": "Exposure reassessed at the period 12 risk review",
          "kind": "meeting",
          "date": "2026-09-06",
          "source": "Programme risk review forum",
          "confidence": "anecdotal"
        }
      ],
      "comments": [
        {
          "id": "rsk-36-cm1",
          "authorId": "own-10",
          "date": "2026-09-06",
          "body": "Trend and exposure are taken from the recorded history rather than a manual rating. Primary mitigation is ACT-34. 2 control(s) are linked."
        }
      ],
      "tags": [
        "adoption",
        "people"
      ]
    },
    {
      "id": "rsk-37",
      "ref": "RSK-37",
      "title": "Third party logistics partner contract gap at wave 1 cutover",
      "description": "A partner contract expired inside the cutover window. A bridging extension was signed in period 10 and the risk was closed.",
      "category": "vendor",
      "ownerId": "own-07",
      "workstreamId": "ws-car",
      "status": "closed",
      "dateIdentified": "2026-05-14",
      "reviewDate": "2026-08-11",
      "strategy": "mitigate",
      "inherentProbability": 0.4,
      "inherentImpact": 3,
      "inherentFinancialImpact": 250000,
      "inherentScheduleImpactDays": 10,
      "strategicImpact": 2,
      "reputationImpact": 1,
      "timeHorizon": "near",
      "evidenceConfidence": "verified",
      "controlIds": [],
      "causeIds": [],
      "actionIds": [],
      "affectedMilestoneIds": [
        "ms-05"
      ],
      "affectedBenefitIds": [],
      "dependencyIds": [],
      "issueIds": [],
      "history": [
        {
          "date": "2026-05-21",
          "probability": 0.3,
          "impactScore": 3,
          "financialExposure": 305000
        },
        {
          "date": "2026-06-20",
          "probability": 0.35,
          "impactScore": 3,
          "financialExposure": 301310
        },
        {
          "date": "2026-07-20",
          "probability": 0.4,
          "impactScore": 3,
          "financialExposure": 297619
        },
        {
          "date": "2026-08-16",
          "probability": 0.435,
          "impactScore": 3,
          "financialExposure": 297619
        },
        {
          "date": "2026-09-06",
          "probability": 0.4,
          "impactScore": 3,
          "financialExposure": 250000
        }
      ],
      "evidence": [
        {
          "id": "rsk-37-ev1",
          "label": "Exposure reassessed at the period 12 risk review",
          "kind": "meeting",
          "date": "2026-09-06",
          "source": "Programme risk review forum",
          "confidence": "verified"
        }
      ],
      "comments": [
        {
          "id": "rsk-37-cm1",
          "authorId": "own-07",
          "date": "2026-09-06",
          "body": "Trend and exposure are taken from the recorded history rather than a manual rating. No mitigating action is currently open. 0 control(s) are linked."
        }
      ],
      "tags": [
        "contract",
        "closed"
      ]
    },
    {
      "id": "rsk-38",
      "ref": "RSK-38",
      "title": "Public commitment to a launch date that then slips",
      "description": "Commercial teams want to announce the launch date to customers. Announcing before the readiness gate converts a schedule risk into a reputational one.",
      "category": "reputational",
      "ownerId": "own-01",
      "workstreamId": "ws-chg",
      "status": "monitoring",
      "dateIdentified": "2026-07-09",
      "reviewDate": "2026-09-17",
      "strategy": "avoid",
      "inherentProbability": 0.3,
      "inherentImpact": 4,
      "inherentFinancialImpact": 400000,
      "inherentScheduleImpactDays": 0,
      "strategicImpact": 4,
      "reputationImpact": 5,
      "timeHorizon": "near",
      "evidenceConfidence": "indicative",
      "controlIds": [
        "ctl-29"
      ],
      "causeIds": [],
      "actionIds": [
        "act-27"
      ],
      "affectedMilestoneIds": [
        "ms-32"
      ],
      "affectedBenefitIds": [],
      "dependencyIds": [],
      "issueIds": [],
      "history": [
        {
          "date": "2026-07-16",
          "probability": 0.225,
          "impactScore": 4,
          "financialExposure": 376000
        },
        {
          "date": "2026-08-15",
          "probability": 0.3,
          "impactScore": 4,
          "financialExposure": 400000
        },
        {
          "date": "2026-08-16",
          "probability": 0.3,
          "impactScore": 4,
          "financialExposure": 400000
        },
        {
          "date": "2026-09-06",
          "probability": 0.3,
          "impactScore": 4,
          "financialExposure": 400000
        }
      ],
      "evidence": [
        {
          "id": "rsk-38-ev1",
          "label": "Exposure reassessed at the period 12 risk review",
          "kind": "meeting",
          "date": "2026-09-06",
          "source": "Programme risk review forum",
          "confidence": "indicative"
        }
      ],
      "comments": [
        {
          "id": "rsk-38-cm1",
          "authorId": "own-01",
          "date": "2026-09-06",
          "body": "Trend and exposure are taken from the recorded history rather than a manual rating. Primary mitigation is ACT-27. 1 control(s) are linked."
        }
      ],
      "tags": [
        "reputation",
        "communications"
      ]
    },
    {
      "id": "rsk-39",
      "ref": "RSK-39",
      "title": "Single carrier concentration on Italian lanes",
      "description": "One carrier holds 46% of Italian volume against a 35% concentration limit. The exception is accepted for wave 1 with a standing concentration report.",
      "category": "operational",
      "ownerId": "own-07",
      "workstreamId": "ws-car",
      "status": "accepted",
      "dateIdentified": "2026-05-03",
      "reviewDate": "2026-09-08",
      "strategy": "accept",
      "inherentProbability": 0.35,
      "inherentImpact": 4,
      "inherentFinancialImpact": 380000,
      "inherentScheduleImpactDays": 8,
      "strategicImpact": 3,
      "reputationImpact": 2,
      "timeHorizon": "mid",
      "evidenceConfidence": "measured",
      "controlIds": [
        "ctl-31"
      ],
      "causeIds": [],
      "actionIds": [],
      "affectedMilestoneIds": [
        "ms-05",
        "ms-18"
      ],
      "affectedBenefitIds": [],
      "dependencyIds": [],
      "issueIds": [],
      "history": [
        {
          "date": "2026-05-10",
          "probability": 0.262,
          "impactScore": 4,
          "financialExposure": 357200
        },
        {
          "date": "2026-06-09",
          "probability": 0.292,
          "impactScore": 4,
          "financialExposure": 364800
        },
        {
          "date": "2026-07-09",
          "probability": 0.321,
          "impactScore": 4,
          "financialExposure": 372400
        },
        {
          "date": "2026-08-08",
          "probability": 0.35,
          "impactScore": 4,
          "financialExposure": 380000
        },
        {
          "date": "2026-08-16",
          "probability": 0.35,
          "impactScore": 4,
          "financialExposure": 380000
        },
        {
          "date": "2026-09-06",
          "probability": 0.35,
          "impactScore": 4,
          "financialExposure": 380000
        }
      ],
      "evidence": [
        {
          "id": "rsk-39-ev1",
          "label": "Exposure reassessed at the period 12 risk review",
          "kind": "meeting",
          "date": "2026-09-06",
          "source": "Programme risk review forum",
          "confidence": "measured"
        }
      ],
      "comments": [
        {
          "id": "rsk-39-cm1",
          "authorId": "own-07",
          "date": "2026-09-06",
          "body": "Trend and exposure are taken from the recorded history rather than a manual rating. No mitigating action is currently open. 1 control(s) are linked."
        }
      ],
      "tags": [
        "concentration",
        "accepted"
      ]
    },
    {
      "id": "rsk-40",
      "ref": "RSK-40",
      "title": "Environmental permit night movement condition limits trunking",
      "description": "The Milan permit restricted movements between 23:00 and 05:00. The trunking plan was reworked to a 05:30 first departure and the risk was closed.",
      "category": "regulatory",
      "ownerId": "own-04",
      "workstreamId": "ws-net",
      "status": "closed",
      "dateIdentified": "2026-04-20",
      "reviewDate": "2026-08-05",
      "strategy": "mitigate",
      "inherentProbability": 0.3,
      "inherentImpact": 3,
      "inherentFinancialImpact": 190000,
      "inherentScheduleImpactDays": 14,
      "strategicImpact": 2,
      "reputationImpact": 2,
      "timeHorizon": "mid",
      "evidenceConfidence": "verified",
      "controlIds": [
        "ctl-10"
      ],
      "causeIds": [
        "cse-22"
      ],
      "actionIds": [],
      "affectedMilestoneIds": [
        "ms-04",
        "ms-05"
      ],
      "affectedBenefitIds": [],
      "dependencyIds": [],
      "issueIds": [],
      "history": [
        {
          "date": "2026-04-27",
          "probability": 0.225,
          "impactScore": 3,
          "financialExposure": 231800
        },
        {
          "date": "2026-05-27",
          "probability": 0.25,
          "impactScore": 3,
          "financialExposure": 229930
        },
        {
          "date": "2026-06-26",
          "probability": 0.275,
          "impactScore": 3,
          "financialExposure": 228060
        },
        {
          "date": "2026-07-26",
          "probability": 0.3,
          "impactScore": 3,
          "financialExposure": 226190
        },
        {
          "date": "2026-08-16",
          "probability": 0.326,
          "impactScore": 3,
          "financialExposure": 226190
        },
        {
          "date": "2026-09-06",
          "probability": 0.3,
          "impactScore": 3,
          "financialExposure": 190000
        }
      ],
      "evidence": [
        {
          "id": "rsk-40-ev1",
          "label": "Exposure reassessed at the period 12 risk review",
          "kind": "meeting",
          "date": "2026-09-06",
          "source": "Programme risk review forum",
          "confidence": "verified"
        }
      ],
      "comments": [
        {
          "id": "rsk-40-cm1",
          "authorId": "own-04",
          "date": "2026-09-06",
          "body": "Trend and exposure are taken from the recorded history rather than a manual rating. No mitigating action is currently open. 1 control(s) are linked."
        }
      ],
      "tags": [
        "permit",
        "closed"
      ]
    },
    {
      "id": "rsk-41",
      "ref": "RSK-41",
      "title": "Knowledge transfer to the run organisation is incomplete at handover",
      "description": "Run organisation roles are not funded until the next budget cycle, so there is no named receiving owner for twenty-one of thirty-four artefacts.",
      "category": "people",
      "ownerId": "own-10",
      "workstreamId": "ws-chg",
      "status": "open",
      "dateIdentified": "2026-06-25",
      "reviewDate": "2026-09-10",
      "strategy": "mitigate",
      "inherentProbability": 0.6,
      "inherentImpact": 3,
      "inherentFinancialImpact": 360000,
      "inherentScheduleImpactDays": 0,
      "strategicImpact": 3,
      "reputationImpact": 2,
      "timeHorizon": "near",
      "evidenceConfidence": "measured",
      "controlIds": [
        "ctl-20",
        "ctl-32"
      ],
      "causeIds": [
        "cse-21"
      ],
      "actionIds": [
        "act-34"
      ],
      "affectedMilestoneIds": [
        "ms-32"
      ],
      "affectedBenefitIds": [],
      "dependencyIds": [],
      "issueIds": [],
      "history": [
        {
          "date": "2026-07-02",
          "probability": 0.45,
          "impactScore": 3,
          "financialExposure": 280800
        },
        {
          "date": "2026-08-01",
          "probability": 0.6,
          "impactScore": 3,
          "financialExposure": 324324
        },
        {
          "date": "2026-08-16",
          "probability": 0.569,
          "impactScore": 3,
          "financialExposure": 324324
        },
        {
          "date": "2026-09-06",
          "probability": 0.6,
          "impactScore": 3,
          "financialExposure": 360000
        }
      ],
      "evidence": [
        {
          "id": "rsk-41-ev1",
          "label": "Exposure reassessed at the period 12 risk review",
          "kind": "meeting",
          "date": "2026-09-06",
          "source": "Programme risk review forum",
          "confidence": "measured"
        }
      ],
      "comments": [
        {
          "id": "rsk-41-cm1",
          "authorId": "own-10",
          "date": "2026-09-06",
          "body": "Trend and exposure are taken from the recorded history rather than a manual rating. Primary mitigation is ACT-34. 2 control(s) are linked."
        }
      ],
      "tags": [
        "handover",
        "run"
      ]
    }
  ],
  "causes": [
    {
      "id": "cse-01",
      "ref": "CSE-01",
      "title": "Carrier API specification issued incomplete by the vendor",
      "description": "The specification was released without the invoice message schema Because the vendor treated invoicing as a phase 2 item",
      "category": "process",
      "isRootCause": true,
      "whyChain": [
        "The specification was released without the invoice message schema",
        "Because the vendor treated invoicing as a phase 2 item",
        "Because the contract statement of work did not name invoice messages explicitly",
        "Because the requirement was captured in a workshop but never written into the SOW",
        "Because there was no requirement traceability check before contract signature"
      ],
      "frequency": 34,
      "linkedRiskIds": [
        "rsk-01",
        "rsk-03"
      ],
      "linkedIssueIds": [
        "iss-03"
      ],
      "ownerId": "own-14"
    },
    {
      "id": "cse-02",
      "ref": "CSE-02",
      "title": "No single owner for master data quality across regions",
      "description": "Defects were not fixed because nobody was accountable for the attribute Because data ownership was defined by system, not by attribute",
      "category": "management",
      "isRootCause": true,
      "whyChain": [
        "Defects were not fixed because nobody was accountable for the attribute",
        "Because data ownership was defined by system, not by attribute",
        "Because the legacy operating model had one system per region",
        "Because regions were run as separate profit centres",
        "Because the target operating model was never translated into data ownership"
      ],
      "frequency": 41,
      "linkedRiskIds": [
        "rsk-04",
        "rsk-09"
      ],
      "linkedIssueIds": [
        "iss-01"
      ],
      "ownerId": "own-12"
    },
    {
      "id": "cse-03",
      "ref": "CSE-03",
      "title": "Manual re-keying between legacy systems introduces errors",
      "description": "Address and weight fields differ between the two systems Because operators re-key data at the hub",
      "category": "process",
      "isRootCause": false,
      "whyChain": [
        "Address and weight fields differ between the two systems",
        "Because operators re-key data at the hub",
        "Because there is no interface between the regional systems"
      ],
      "frequency": 29,
      "linkedRiskIds": [
        "rsk-04"
      ],
      "linkedIssueIds": [
        "iss-01"
      ],
      "ownerId": "own-12"
    },
    {
      "id": "cse-04",
      "ref": "CSE-04",
      "title": "Supplier allocated the Milan build slot to another customer",
      "description": "The Milan line lost its build slot Because the supplier prioritised a larger customer order",
      "category": "management",
      "isRootCause": true,
      "whyChain": [
        "The Milan line lost its build slot",
        "Because the supplier prioritised a larger customer order",
        "Because our contract has no slot-protection clause",
        "Because the negotiation focused on unit price rather than delivery certainty"
      ],
      "frequency": 12,
      "linkedRiskIds": [
        "rsk-06"
      ],
      "linkedIssueIds": [
        "iss-05"
      ],
      "ownerId": "own-14"
    },
    {
      "id": "cse-05",
      "ref": "CSE-05",
      "title": "Utility connection lead times not reflected in the plan",
      "description": "The power upgrade will not complete before install Because the utility quoted a 26 week lead time",
      "category": "environment",
      "isRootCause": true,
      "whyChain": [
        "The power upgrade will not complete before install",
        "Because the utility quoted a 26 week lead time",
        "Because the application was raised after the fit-out plan was baselined",
        "Because utility lead time was assumed to be inside the fit-out float"
      ],
      "frequency": 8,
      "linkedRiskIds": [
        "rsk-07"
      ],
      "linkedIssueIds": [
        "iss-04"
      ],
      "ownerId": "own-04"
    },
    {
      "id": "cse-06",
      "ref": "CSE-06",
      "title": "Test environments do not hold production-like data volumes",
      "description": "Defects appear only in production-like volumes Because the test environment holds 4% of production data",
      "category": "technology",
      "isRootCause": true,
      "whyChain": [
        "Defects appear only in production-like volumes",
        "Because the test environment holds 4% of production data",
        "Because data masking capacity was sized for functional testing only"
      ],
      "frequency": 22,
      "linkedRiskIds": [
        "rsk-34",
        "rsk-05"
      ],
      "linkedIssueIds": [
        "iss-06"
      ],
      "ownerId": "own-06"
    },
    {
      "id": "cse-07",
      "ref": "CSE-07",
      "title": "Business testers not released from operational duties",
      "description": "UAT execution is behind plan Because testers attend only part time",
      "category": "people",
      "isRootCause": true,
      "whyChain": [
        "UAT execution is behind plan",
        "Because testers attend only part time",
        "Because hub managers are measured on operational service, not programme delivery",
        "Because programme contribution is not in the hub manager scorecard"
      ],
      "frequency": 26,
      "linkedRiskIds": [
        "rsk-13",
        "rsk-17"
      ],
      "linkedIssueIds": [
        "iss-06",
        "iss-08"
      ],
      "ownerId": "own-15"
    },
    {
      "id": "cse-08",
      "ref": "CSE-08",
      "title": "Security testing scheduled after integration is complete",
      "description": "Security findings arrive too late to fix cheaply Because penetration testing is a single gate at the end",
      "category": "process",
      "isRootCause": true,
      "whyChain": [
        "Security findings arrive too late to fix cheaply",
        "Because penetration testing is a single gate at the end",
        "Because the assurance model is stage-gated rather than continuous"
      ],
      "frequency": 6,
      "linkedRiskIds": [
        "rsk-02",
        "rsk-28"
      ],
      "linkedIssueIds": [],
      "ownerId": "own-13"
    },
    {
      "id": "cse-09",
      "ref": "CSE-09",
      "title": "Reporting definitions differ between operations and finance",
      "description": "Reported cost does not reconcile to the ledger Because operations count movements and finance counts invoices",
      "category": "measurement",
      "isRootCause": true,
      "whyChain": [
        "Reported cost does not reconcile to the ledger",
        "Because operations count movements and finance counts invoices",
        "Because no common metric dictionary was agreed",
        "Because the reporting requirement was gathered separately by each function"
      ],
      "frequency": 19,
      "linkedRiskIds": [
        "rsk-09",
        "rsk-27"
      ],
      "linkedIssueIds": [
        "iss-02"
      ],
      "ownerId": "own-11"
    },
    {
      "id": "cse-10",
      "ref": "CSE-10",
      "title": "Carrier legal teams reject standard data sharing clause",
      "description": "Visibility data is not flowing from three carriers Because their legal teams rejected the standard clause",
      "category": "policy",
      "isRootCause": false,
      "whyChain": [
        "Visibility data is not flowing from three carriers",
        "Because their legal teams rejected the standard clause",
        "Because the clause assigns unlimited liability for data accuracy"
      ],
      "frequency": 14,
      "linkedRiskIds": [
        "rsk-11",
        "rsk-15"
      ],
      "linkedIssueIds": [],
      "ownerId": "own-07"
    },
    {
      "id": "cse-11",
      "ref": "CSE-11",
      "title": "Customs broker operates a proprietary undocumented interface",
      "description": "The customs interface cannot be built to specification Because the broker has not released an interface specification",
      "category": "technology",
      "isRootCause": false,
      "whyChain": [
        "The customs interface cannot be built to specification",
        "Because the broker has not released an interface specification",
        "Because their platform is a bespoke legacy system"
      ],
      "frequency": 9,
      "linkedRiskIds": [
        "rsk-14"
      ],
      "linkedIssueIds": [
        "iss-07"
      ],
      "ownerId": "own-07"
    },
    {
      "id": "cse-12",
      "ref": "CSE-12",
      "title": "Single deep specialist holds the integration design knowledge",
      "description": "Integration decisions stall when one architect is unavailable Because the design rationale is not documented",
      "category": "people",
      "isRootCause": true,
      "whyChain": [
        "Integration decisions stall when one architect is unavailable",
        "Because the design rationale is not documented",
        "Because the team ran at 100% delivery utilisation with no documentation time"
      ],
      "frequency": 5,
      "linkedRiskIds": [
        "rsk-16"
      ],
      "linkedIssueIds": [
        "iss-12"
      ],
      "ownerId": "own-06"
    },
    {
      "id": "cse-13",
      "ref": "CSE-13",
      "title": "Works council was engaged after the role design was fixed",
      "description": "The works council lodged a formal objection Because they saw the role design as a fait accompli",
      "category": "management",
      "isRootCause": true,
      "whyChain": [
        "The works council lodged a formal objection",
        "Because they saw the role design as a fait accompli",
        "Because consultation started after the design was signed off",
        "Because the change plan treated consultation as a communication step"
      ],
      "frequency": 4,
      "linkedRiskIds": [
        "rsk-20",
        "rsk-36"
      ],
      "linkedIssueIds": [
        "iss-11"
      ],
      "ownerId": "own-10"
    },
    {
      "id": "cse-14",
      "ref": "CSE-14",
      "title": "Local labour market for warehouse operatives is tight",
      "description": "Recruitment is behind the ramp-up curve Because applications per vacancy have halved",
      "category": "environment",
      "isRootCause": false,
      "whyChain": [
        "Recruitment is behind the ramp-up curve",
        "Because applications per vacancy have halved",
        "Because three competing distribution centres opened within 20km"
      ],
      "frequency": 11,
      "linkedRiskIds": [
        "rsk-19"
      ],
      "linkedIssueIds": [],
      "ownerId": "own-15"
    },
    {
      "id": "cse-15",
      "ref": "CSE-15",
      "title": "Operational business rules were still being agreed during build",
      "description": "Configuration is being reworked Because business rules changed after the build freeze",
      "category": "process",
      "isRootCause": true,
      "whyChain": [
        "Configuration is being reworked",
        "Because business rules changed after the build freeze",
        "Because the rules were never formally baselined",
        "Because the design authority approved principles rather than rules"
      ],
      "frequency": 24,
      "linkedRiskIds": [
        "rsk-22",
        "rsk-13"
      ],
      "linkedIssueIds": [],
      "ownerId": "own-05"
    },
    {
      "id": "cse-16",
      "ref": "CSE-16",
      "title": "Automation throughput modelled on ideal order profile",
      "description": "Measured throughput is below the contractual figure Because the model assumed a uniform order profile",
      "category": "measurement",
      "isRootCause": true,
      "whyChain": [
        "Measured throughput is below the contractual figure",
        "Because the model assumed a uniform order profile",
        "Because the profile used was an annual average, not a peak week"
      ],
      "frequency": 7,
      "linkedRiskIds": [
        "rsk-08",
        "rsk-33"
      ],
      "linkedIssueIds": [],
      "ownerId": "own-08"
    },
    {
      "id": "cse-17",
      "ref": "CSE-17",
      "title": "Two programmes are changing the same order management interface",
      "description": "Both programmes have booked the same interface change window Because there is no shared change calendar",
      "category": "management",
      "isRootCause": true,
      "whyChain": [
        "Both programmes have booked the same interface change window",
        "Because there is no shared change calendar",
        "Because portfolio governance reviews scope but not technical collisions"
      ],
      "frequency": 6,
      "linkedRiskIds": [
        "rsk-24"
      ],
      "linkedIssueIds": [],
      "ownerId": "own-02"
    },
    {
      "id": "cse-18",
      "ref": "CSE-18",
      "title": "Linehaul rates are exposed to spot market movement",
      "description": "Forecast savings are eroding Because 34% of linehaul volume sits on spot rates",
      "category": "environment",
      "isRootCause": false,
      "whyChain": [
        "Forecast savings are eroding",
        "Because 34% of linehaul volume sits on spot rates",
        "Because the tender was deliberately staged to keep flexibility"
      ],
      "frequency": 15,
      "linkedRiskIds": [
        "rsk-32",
        "rsk-12"
      ],
      "linkedIssueIds": [],
      "ownerId": "own-11"
    },
    {
      "id": "cse-19",
      "ref": "CSE-19",
      "title": "Carrier invoice formats vary by country",
      "description": "Invoice matching fails for cross-border loads Because six invoice formats are in use",
      "category": "process",
      "isRootCause": false,
      "whyChain": [
        "Invoice matching fails for cross-border loads",
        "Because six invoice formats are in use",
        "Because each country onboarded carriers to a local standard"
      ],
      "frequency": 31,
      "linkedRiskIds": [
        "rsk-26"
      ],
      "linkedIssueIds": [],
      "ownerId": "own-07"
    },
    {
      "id": "cse-20",
      "ref": "CSE-20",
      "title": "Hypercare model sized on single-wave go-live",
      "description": "Support capacity looks thin for the revised plan Because hypercare was sized before the go-live was split into waves",
      "category": "process",
      "isRootCause": false,
      "whyChain": [
        "Support capacity looks thin for the revised plan",
        "Because hypercare was sized before the go-live was split into waves",
        "Because the resourcing model was built from the original single-cutover assumption",
        "Because the wave decision was taken after the support plan was baselined"
      ],
      "frequency": 3,
      "linkedRiskIds": [
        "rsk-25"
      ],
      "linkedIssueIds": [],
      "ownerId": "own-05"
    },
    {
      "id": "cse-21",
      "ref": "CSE-21",
      "title": "Run organisation roles not yet funded",
      "description": "Knowledge transfer has no receiving team Because run roles are not funded until the next budget cycle",
      "category": "management",
      "isRootCause": true,
      "whyChain": [
        "Knowledge transfer has no receiving team",
        "Because run roles are not funded until the next budget cycle",
        "Because the business case treated run cost as a later decision"
      ],
      "frequency": 5,
      "linkedRiskIds": [
        "rsk-41",
        "rsk-10"
      ],
      "linkedIssueIds": [],
      "ownerId": "own-01"
    },
    {
      "id": "cse-22",
      "ref": "CSE-22",
      "title": "Environmental permit carries a night-movement condition",
      "description": "Night trunking at Milan may be restricted Because the permit limits movements between 23:00 and 05:00",
      "category": "policy",
      "isRootCause": false,
      "whyChain": [
        "Night trunking at Milan may be restricted",
        "Because the permit limits movements between 23:00 and 05:00",
        "Because the site sits inside a residential noise zone"
      ],
      "frequency": 2,
      "linkedRiskIds": [
        "rsk-40",
        "rsk-29"
      ],
      "linkedIssueIds": [],
      "ownerId": "own-04"
    }
  ],
  "controls": [
    {
      "id": "ctl-01",
      "ref": "CTL-01",
      "name": "Weekly vendor delivery review with contractual escalation",
      "description": "Standing weekly review of vendor deliverables against the contract schedule, with a written escalation at two consecutive misses.",
      "type": "directive",
      "ownerId": "own-14",
      "frequency": "weekly",
      "designEffectiveness": 0.7,
      "operatingEffectiveness": 0.55,
      "evidenceRef": "Minuted vendor review pack, week 47",
      "automated": false,
      "linkedRiskIds": [
        "rsk-01",
        "rsk-21",
        "rsk-28"
      ],
      "status": "degraded",
      "lastTested": "2026-08-19",
      "nextTest": "2026-08-26"
    },
    {
      "id": "ctl-02",
      "ref": "CTL-02",
      "name": "Requirement traceability matrix reviewed at each gate",
      "description": "Every requirement is traced to a configuration object and a test case before a gate can close.",
      "type": "preventive",
      "ownerId": "own-05",
      "frequency": "event-driven",
      "designEffectiveness": 0.75,
      "operatingEffectiveness": 0.7,
      "evidenceRef": "Traceability matrix v6, design authority minute",
      "automated": false,
      "linkedRiskIds": [
        "rsk-01",
        "rsk-22"
      ],
      "status": "active",
      "lastTested": "2026-07-28",
      "nextTest": "2026-09-16"
    },
    {
      "id": "ctl-03",
      "ref": "CTL-03",
      "name": "Continuous static and dependency scanning in the build pipeline",
      "description": "Automated SAST and software composition analysis on every commit, blocking merges on high findings.",
      "type": "detective",
      "ownerId": "own-13",
      "frequency": "continuous",
      "designEffectiveness": 0.8,
      "operatingEffectiveness": 0.78,
      "evidenceRef": "Pipeline scan dashboard, daily",
      "automated": true,
      "linkedRiskIds": [
        "rsk-02",
        "rsk-28"
      ],
      "status": "active",
      "lastTested": "2026-09-06",
      "nextTest": "2026-09-13"
    },
    {
      "id": "ctl-04",
      "ref": "CTL-04",
      "name": "Threat modelling workshop per integration pattern",
      "description": "Structured threat model completed before each integration pattern is built.",
      "type": "preventive",
      "ownerId": "own-13",
      "frequency": "event-driven",
      "designEffectiveness": 0.65,
      "operatingEffectiveness": 0.5,
      "evidenceRef": "Threat model register, 7 of 11 patterns",
      "automated": false,
      "linkedRiskIds": [
        "rsk-02",
        "rsk-28"
      ],
      "status": "degraded",
      "lastTested": "2026-08-08",
      "nextTest": "2026-09-02"
    },
    {
      "id": "ctl-05",
      "ref": "CTL-05",
      "name": "Automated data quality rules on the eight critical attributes",
      "description": "Rule-based validation runs nightly across the critical attribute set and raises defects into the remediation queue.",
      "type": "detective",
      "ownerId": "own-12",
      "frequency": "daily",
      "designEffectiveness": 0.85,
      "operatingEffectiveness": 0.8,
      "evidenceRef": "Data quality dashboard, daily defect count",
      "automated": true,
      "linkedRiskIds": [
        "rsk-04",
        "rsk-09",
        "rsk-34"
      ],
      "status": "active",
      "lastTested": "2026-09-07",
      "nextTest": "2026-09-14"
    },
    {
      "id": "ctl-06",
      "ref": "CTL-06",
      "name": "Data ownership matrix with named attribute owners",
      "description": "Named accountable owner per critical data attribute, reviewed monthly with the data governance forum.",
      "type": "directive",
      "ownerId": "own-12",
      "frequency": "monthly",
      "designEffectiveness": 0.6,
      "operatingEffectiveness": 0.45,
      "evidenceRef": "Ownership matrix v3, 6 of 8 attributes assigned",
      "automated": false,
      "linkedRiskIds": [
        "rsk-04"
      ],
      "status": "degraded",
      "lastTested": "2026-08-16",
      "nextTest": "2026-09-15"
    },
    {
      "id": "ctl-07",
      "ref": "CTL-07",
      "name": "Full volume migration rehearsal before each cutover",
      "description": "Production-volume extract, transform and load rehearsal with completeness and defect reporting.",
      "type": "detective",
      "ownerId": "own-06",
      "frequency": "event-driven",
      "designEffectiveness": 0.8,
      "operatingEffectiveness": 0.75,
      "evidenceRef": "Dry run 1 report, dry run 2 scheduled",
      "automated": false,
      "linkedRiskIds": [
        "rsk-04",
        "rsk-05",
        "rsk-34"
      ],
      "status": "active",
      "lastTested": "2026-05-10",
      "nextTest": "2026-08-22"
    },
    {
      "id": "ctl-08",
      "ref": "CTL-08",
      "name": "Contractual slot protection and liquidated damages",
      "description": "Delivery slot protection and liquidated damages in supply contracts, applied where the clause exists.",
      "type": "preventive",
      "ownerId": "own-14",
      "frequency": "event-driven",
      "designEffectiveness": 0.5,
      "operatingEffectiveness": 0.3,
      "evidenceRef": "Contract schedule 4, no slot clause on Milan line",
      "automated": false,
      "linkedRiskIds": [
        "rsk-06",
        "rsk-31"
      ],
      "status": "degraded",
      "lastTested": "2026-01-16",
      "nextTest": "2026-09-16"
    },
    {
      "id": "ctl-09",
      "ref": "CTL-09",
      "name": "Dual sourcing assessment for long lead items",
      "description": "Long lead items are assessed for an alternative source, with a switch cost and lead time recorded.",
      "type": "preventive",
      "ownerId": "own-14",
      "frequency": "quarterly",
      "designEffectiveness": 0.55,
      "operatingEffectiveness": 0.4,
      "evidenceRef": "Long lead item register, 9 of 14 assessed",
      "automated": false,
      "linkedRiskIds": [
        "rsk-06",
        "rsk-31",
        "rsk-21"
      ],
      "status": "degraded",
      "lastTested": "2026-07-18",
      "nextTest": "2026-09-16"
    },
    {
      "id": "ctl-10",
      "ref": "CTL-10",
      "name": "Utility and permit lead time tracker",
      "description": "Register of every external permit and utility connection with its quoted lead time and current status.",
      "type": "detective",
      "ownerId": "own-04",
      "frequency": "monthly",
      "designEffectiveness": 0.7,
      "operatingEffectiveness": 0.65,
      "evidenceRef": "Permit tracker, all 6 permits logged",
      "automated": false,
      "linkedRiskIds": [
        "rsk-07",
        "rsk-40"
      ],
      "status": "active",
      "lastTested": "2026-08-25",
      "nextTest": "2026-09-24"
    },
    {
      "id": "ctl-11",
      "ref": "CTL-11",
      "name": "Factory acceptance test with contractual throughput warranty",
      "description": "Throughput and availability are proven against the warranty before payment milestones release.",
      "type": "detective",
      "ownerId": "own-08",
      "frequency": "event-driven",
      "designEffectiveness": 0.85,
      "operatingEffectiveness": 0.8,
      "evidenceRef": "FAT protocol signed by both parties",
      "automated": false,
      "linkedRiskIds": [
        "rsk-08",
        "rsk-33"
      ],
      "status": "active",
      "lastTested": "2026-06-28",
      "nextTest": "2026-10-10"
    },
    {
      "id": "ctl-12",
      "ref": "CTL-12",
      "name": "Peak profile simulation before commissioning",
      "description": "Discrete event simulation of the automation using real order profiles including peak week.",
      "type": "preventive",
      "ownerId": "own-08",
      "frequency": "event-driven",
      "designEffectiveness": 0.6,
      "operatingEffectiveness": 0.4,
      "evidenceRef": "Simulation run on annual average profile only",
      "automated": false,
      "linkedRiskIds": [
        "rsk-08",
        "rsk-33"
      ],
      "status": "degraded",
      "lastTested": "2026-07-08",
      "nextTest": "2026-09-21"
    },
    {
      "id": "ctl-13",
      "ref": "CTL-13",
      "name": "Metric dictionary agreed jointly by operations and finance",
      "description": "Single definition, source and owner per reported metric, signed off by both functions.",
      "type": "preventive",
      "ownerId": "own-11",
      "frequency": "monthly",
      "designEffectiveness": 0.7,
      "operatingEffectiveness": 0.5,
      "evidenceRef": "Dictionary v2, 31 of 48 metrics agreed",
      "automated": false,
      "linkedRiskIds": [
        "rsk-09",
        "rsk-27"
      ],
      "status": "degraded",
      "lastTested": "2026-08-11",
      "nextTest": "2026-09-10"
    },
    {
      "id": "ctl-14",
      "ref": "CTL-14",
      "name": "Monthly reconciliation of reporting to the general ledger",
      "description": "Automated reconciliation of programme reporting to finance with a variance threshold and escalation.",
      "type": "detective",
      "ownerId": "own-11",
      "frequency": "monthly",
      "designEffectiveness": 0.8,
      "operatingEffectiveness": 0.7,
      "evidenceRef": "Reconciliation pack, variance 4.1% in period 11",
      "automated": true,
      "linkedRiskIds": [
        "rsk-09",
        "rsk-26"
      ],
      "status": "active",
      "lastTested": "2026-08-17",
      "nextTest": "2026-09-16"
    },
    {
      "id": "ctl-15",
      "ref": "CTL-15",
      "name": "Standard carrier data sharing clause with fallback wording",
      "description": "Pre-agreed primary and fallback contract wording so carrier legal review does not restart negotiation.",
      "type": "preventive",
      "ownerId": "own-07",
      "frequency": "event-driven",
      "designEffectiveness": 0.65,
      "operatingEffectiveness": 0.55,
      "evidenceRef": "Legal playbook v4, fallback used with 5 carriers",
      "automated": false,
      "linkedRiskIds": [
        "rsk-11",
        "rsk-15"
      ],
      "status": "active",
      "lastTested": "2026-08-07",
      "nextTest": "2026-09-21"
    },
    {
      "id": "ctl-16",
      "ref": "CTL-16",
      "name": "Data protection impact assessment before each new data flow",
      "description": "No new personal data flow is enabled without a completed and approved impact assessment.",
      "type": "preventive",
      "ownerId": "own-13",
      "frequency": "event-driven",
      "designEffectiveness": 0.8,
      "operatingEffectiveness": 0.75,
      "evidenceRef": "DPIA register, 9 of 11 flows assessed",
      "automated": false,
      "linkedRiskIds": [
        "rsk-15",
        "rsk-28"
      ],
      "status": "active",
      "lastTested": "2026-08-15",
      "nextTest": "2026-09-19"
    },
    {
      "id": "ctl-17",
      "ref": "CTL-17",
      "name": "Defect burn-down tracked daily against an exit curve",
      "description": "Daily defect open and close rates plotted against the curve required to hit the UAT exit date.",
      "type": "detective",
      "ownerId": "own-05",
      "frequency": "daily",
      "designEffectiveness": 0.75,
      "operatingEffectiveness": 0.7,
      "evidenceRef": "UAT burn-down chart, daily",
      "automated": true,
      "linkedRiskIds": [
        "rsk-13",
        "rsk-22",
        "rsk-34"
      ],
      "status": "active",
      "lastTested": "2026-09-07",
      "nextTest": "2026-09-11"
    },
    {
      "id": "ctl-18",
      "ref": "CTL-18",
      "name": "Named tester allocation confirmed in writing by hub managers",
      "description": "Written commitment of named testers and training attendees, reviewed fortnightly with attendance actuals.",
      "type": "directive",
      "ownerId": "own-15",
      "frequency": "fortnightly",
      "designEffectiveness": 0.6,
      "operatingEffectiveness": 0.4,
      "evidenceRef": "Allocation sheet, 62% of committed days delivered",
      "automated": false,
      "linkedRiskIds": [
        "rsk-13",
        "rsk-17"
      ],
      "status": "degraded",
      "lastTested": "2026-08-26",
      "nextTest": "2026-09-09"
    },
    {
      "id": "ctl-19",
      "ref": "CTL-19",
      "name": "Broker interface proof of concept before commitment",
      "description": "Working proof of concept against the broker interface before the design is committed.",
      "type": "preventive",
      "ownerId": "own-07",
      "frequency": "event-driven",
      "designEffectiveness": 0.6,
      "operatingEffectiveness": 0.35,
      "evidenceRef": "Proof of concept not yet started",
      "automated": false,
      "linkedRiskIds": [
        "rsk-14"
      ],
      "status": "planned",
      "nextTest": "2026-09-08"
    },
    {
      "id": "ctl-20",
      "ref": "CTL-20",
      "name": "Key person cover plan with documented design decisions",
      "description": "Named deputy and a written decision log for every single-point-of-knowledge role.",
      "type": "preventive",
      "ownerId": "own-06",
      "frequency": "monthly",
      "designEffectiveness": 0.6,
      "operatingEffectiveness": 0.5,
      "evidenceRef": "Decision log v11, cover named for 3 of 5 roles",
      "automated": false,
      "linkedRiskIds": [
        "rsk-16",
        "rsk-41"
      ],
      "status": "degraded",
      "lastTested": "2026-08-19",
      "nextTest": "2026-09-18"
    },
    {
      "id": "ctl-21",
      "ref": "CTL-21",
      "name": "Works council consultation calendar with legal review",
      "description": "Scheduled consultation ahead of each design decision, with legal review of the position paper.",
      "type": "preventive",
      "ownerId": "own-10",
      "frequency": "monthly",
      "designEffectiveness": 0.7,
      "operatingEffectiveness": 0.6,
      "evidenceRef": "Consultation calendar, minutes of 8 sessions",
      "automated": false,
      "linkedRiskIds": [
        "rsk-20",
        "rsk-36"
      ],
      "status": "active",
      "lastTested": "2026-08-23",
      "nextTest": "2026-09-22"
    },
    {
      "id": "ctl-22",
      "ref": "CTL-22",
      "name": "Recruitment pipeline tracked against the ramp-up curve",
      "description": "Weekly funnel report from application to start date against the operational ramp-up requirement.",
      "type": "detective",
      "ownerId": "own-15",
      "frequency": "weekly",
      "designEffectiveness": 0.7,
      "operatingEffectiveness": 0.6,
      "evidenceRef": "Pipeline report, 71% of curve",
      "automated": true,
      "linkedRiskIds": [
        "rsk-19"
      ],
      "status": "active",
      "lastTested": "2026-09-05",
      "nextTest": "2026-09-12"
    },
    {
      "id": "ctl-23",
      "ref": "CTL-23",
      "name": "Cutover rehearsal with timed rollback",
      "description": "Full cutover rehearsal including a timed rollback to prove the exit path.",
      "type": "detective",
      "ownerId": "own-05",
      "frequency": "event-driven",
      "designEffectiveness": 0.8,
      "operatingEffectiveness": 0.6,
      "evidenceRef": "Rehearsal 1 complete, rollback 5h 10m against 4h target",
      "automated": false,
      "linkedRiskIds": [
        "rsk-18",
        "rsk-25"
      ],
      "status": "degraded",
      "lastTested": "2026-08-21",
      "nextTest": "2026-09-26"
    },
    {
      "id": "ctl-24",
      "ref": "CTL-24",
      "name": "Hypercare capacity model reviewed against the go-live plan",
      "description": "Support capacity is re-modelled whenever the go-live sequence changes.",
      "type": "preventive",
      "ownerId": "own-05",
      "frequency": "monthly",
      "designEffectiveness": 0.65,
      "operatingEffectiveness": 0.6,
      "evidenceRef": "Capacity model v3 aligned to two-wave plan",
      "automated": false,
      "linkedRiskIds": [
        "rsk-25",
        "rsk-18"
      ],
      "status": "active",
      "lastTested": "2026-08-27",
      "nextTest": "2026-09-21"
    },
    {
      "id": "ctl-25",
      "ref": "CTL-25",
      "name": "Three-way invoice match at cost, load and contract rate",
      "description": "Automated match of carrier invoice to executed load and contracted rate, with exception routing.",
      "type": "detective",
      "ownerId": "own-07",
      "frequency": "continuous",
      "designEffectiveness": 0.85,
      "operatingEffectiveness": 0.8,
      "evidenceRef": "Match exception report, 2.1% exception rate",
      "automated": true,
      "linkedRiskIds": [
        "rsk-26",
        "rsk-12"
      ],
      "status": "active",
      "lastTested": "2026-09-06",
      "nextTest": "2026-09-13"
    },
    {
      "id": "ctl-26",
      "ref": "CTL-26",
      "name": "Portfolio change calendar with technical collision review",
      "description": "Shared calendar of interface-affecting changes across programmes, reviewed for technical collisions.",
      "type": "preventive",
      "ownerId": "own-02",
      "frequency": "fortnightly",
      "designEffectiveness": 0.6,
      "operatingEffectiveness": 0.55,
      "evidenceRef": "Change calendar, collision review added week 44",
      "automated": false,
      "linkedRiskIds": [
        "rsk-24"
      ],
      "status": "active",
      "lastTested": "2026-09-02",
      "nextTest": "2026-09-16"
    },
    {
      "id": "ctl-27",
      "ref": "CTL-27",
      "name": "Rate exposure hedged through staged tender waves",
      "description": "Volume is progressively moved from spot to fixed rate through staged tender waves.",
      "type": "preventive",
      "ownerId": "own-11",
      "frequency": "quarterly",
      "designEffectiveness": 0.55,
      "operatingEffectiveness": 0.5,
      "evidenceRef": "Tender wave 2 award, 66% of volume on fixed rate",
      "automated": false,
      "linkedRiskIds": [
        "rsk-32",
        "rsk-12"
      ],
      "status": "active",
      "lastTested": "2026-08-11",
      "nextTest": "2026-10-10"
    },
    {
      "id": "ctl-28",
      "ref": "CTL-28",
      "name": "Benefit baseline signed off by finance before handover",
      "description": "Written finance agreement on the baseline, measure and reporting cadence for every benefit.",
      "type": "directive",
      "ownerId": "own-11",
      "frequency": "event-driven",
      "designEffectiveness": 0.75,
      "operatingEffectiveness": 0.4,
      "evidenceRef": "Baseline agreed for 4 of 9 benefits",
      "automated": false,
      "linkedRiskIds": [
        "rsk-27",
        "rsk-10"
      ],
      "status": "degraded",
      "lastTested": "2026-08-07",
      "nextTest": "2026-10-06"
    },
    {
      "id": "ctl-29",
      "ref": "CTL-29",
      "name": "Service level monitoring with customer impact alerting",
      "description": "Continuous on-time in-full monitoring with alerting on customer-visible degradation.",
      "type": "detective",
      "ownerId": "own-09",
      "frequency": "continuous",
      "designEffectiveness": 0.75,
      "operatingEffectiveness": 0.7,
      "evidenceRef": "OTIF dashboard, hourly refresh",
      "automated": true,
      "linkedRiskIds": [
        "rsk-29",
        "rsk-30",
        "rsk-38"
      ],
      "status": "active",
      "lastTested": "2026-09-07",
      "nextTest": "2026-09-14"
    },
    {
      "id": "ctl-30",
      "ref": "CTL-30",
      "name": "Model risk review and drift monitoring for predictive ETA",
      "description": "Formal model risk assessment plus production drift monitoring before the ETA model is relied upon.",
      "type": "preventive",
      "ownerId": "own-13",
      "frequency": "quarterly",
      "designEffectiveness": 0.7,
      "operatingEffectiveness": 0.5,
      "evidenceRef": "Model risk template submitted, review pending",
      "automated": false,
      "linkedRiskIds": [
        "rsk-35"
      ],
      "status": "planned",
      "lastTested": "2026-08-17",
      "nextTest": "2026-09-16"
    },
    {
      "id": "ctl-31",
      "ref": "CTL-31",
      "name": "Concentration limit per carrier per lane",
      "description": "No single carrier may exceed the agreed share of volume on a lane without an accepted exception.",
      "type": "preventive",
      "ownerId": "own-07",
      "frequency": "monthly",
      "designEffectiveness": 0.6,
      "operatingEffectiveness": 0.55,
      "evidenceRef": "Concentration report, one lane above limit",
      "automated": false,
      "linkedRiskIds": [
        "rsk-39",
        "rsk-11"
      ],
      "status": "active",
      "lastTested": "2026-08-25",
      "nextTest": "2026-09-24"
    },
    {
      "id": "ctl-32",
      "ref": "CTL-32",
      "name": "Knowledge transfer plan with run-organisation acceptance",
      "description": "Documented knowledge transfer with named receiving owners who formally accept each artefact.",
      "type": "directive",
      "ownerId": "own-10",
      "frequency": "monthly",
      "designEffectiveness": 0.65,
      "operatingEffectiveness": 0.35,
      "evidenceRef": "Plan drafted, run roles unfunded",
      "automated": false,
      "linkedRiskIds": [
        "rsk-41",
        "rsk-10",
        "rsk-36"
      ],
      "status": "degraded",
      "lastTested": "2026-08-19",
      "nextTest": "2026-09-18"
    }
  ],
  "actions": [
    {
      "id": "act-01",
      "ref": "ACT-01",
      "title": "Escalate carrier API specification gap to vendor executive sponsor",
      "description": "Formal contractual escalation to the Nordwind executive sponsor requiring a dated remediation plan for the invoice message schema.",
      "ownerId": "own-14",
      "dueDate": "2026-08-25",
      "status": "overdue",
      "priority": "critical",
      "linkedRiskIds": [
        "rsk-01"
      ],
      "linkedIssueIds": [
        "iss-03"
      ],
      "linkedDependencyIds": [
        "dep-01"
      ],
      "expectedRiskReduction": 0.25,
      "percentComplete": 60
    },
    {
      "id": "act-02",
      "ref": "ACT-02",
      "title": "Build invoice message adapter in-house as a contingency",
      "description": "Interim adapter that translates the legacy invoice format so go-live is not dependent on the vendor schema.",
      "ownerId": "own-06",
      "dueDate": "2026-09-14",
      "status": "in-progress",
      "priority": "critical",
      "linkedRiskIds": [
        "rsk-01",
        "rsk-03"
      ],
      "linkedIssueIds": [
        "iss-03"
      ],
      "linkedDependencyIds": [
        "dep-01"
      ],
      "expectedRiskReduction": 0.35,
      "percentComplete": 45
    },
    {
      "id": "act-03",
      "ref": "ACT-03",
      "title": "Bring forward penetration testing to a two-cycle model",
      "description": "Split the single end-stage penetration test into an early cycle on completed patterns and a confirmatory cycle before sign-off.",
      "ownerId": "own-13",
      "dueDate": "2026-08-23",
      "status": "complete",
      "priority": "high",
      "linkedRiskIds": [
        "rsk-02"
      ],
      "linkedIssueIds": [],
      "linkedDependencyIds": [
        "dep-04"
      ],
      "expectedRiskReduction": 0.3,
      "percentComplete": 100,
      "completedDate": "2026-08-21"
    },
    {
      "id": "act-04",
      "ref": "ACT-04",
      "title": "Recruit three data quality contractors for the remediation backlog",
      "description": "Short-term capacity to clear the master data defect backlog to the exit threshold.",
      "ownerId": "own-12",
      "dueDate": "2026-08-11",
      "status": "complete",
      "priority": "high",
      "linkedRiskIds": [
        "rsk-04"
      ],
      "linkedIssueIds": [
        "iss-01"
      ],
      "linkedDependencyIds": [
        "dep-07"
      ],
      "expectedRiskReduction": 0.2,
      "percentComplete": 100,
      "completedDate": "2026-08-08"
    },
    {
      "id": "act-05",
      "ref": "ACT-05",
      "title": "Assign named owners to the two unassigned critical data attributes",
      "description": "Close the ownership gap on the two attributes that carry the largest defect counts.",
      "ownerId": "own-12",
      "dueDate": "2026-09-02",
      "status": "overdue",
      "priority": "critical",
      "linkedRiskIds": [
        "rsk-04"
      ],
      "linkedIssueIds": [
        "iss-01"
      ],
      "linkedDependencyIds": [
        "dep-07"
      ],
      "expectedRiskReduction": 0.15,
      "percentComplete": 30
    },
    {
      "id": "act-06",
      "ref": "ACT-06",
      "title": "Negotiate a protected build slot for the Milan automation line",
      "description": "Contract amendment to secure a protected build slot with liquidated damages for further movement.",
      "ownerId": "own-14",
      "dueDate": "2026-08-27",
      "status": "overdue",
      "priority": "critical",
      "linkedRiskIds": [
        "rsk-06"
      ],
      "linkedIssueIds": [
        "iss-05"
      ],
      "linkedDependencyIds": [
        "dep-11"
      ],
      "expectedRiskReduction": 0.3,
      "percentComplete": 40
    },
    {
      "id": "act-07",
      "ref": "ACT-07",
      "title": "Assess a phased automation go-live with two pick stations",
      "description": "Option assessment for opening with reduced automation capacity while the third station is installed later.",
      "ownerId": "own-08",
      "dueDate": "2026-09-19",
      "status": "in-progress",
      "priority": "high",
      "linkedRiskIds": [
        "rsk-06",
        "rsk-08"
      ],
      "linkedIssueIds": [
        "iss-05"
      ],
      "linkedDependencyIds": [
        "dep-13"
      ],
      "expectedRiskReduction": 0.25,
      "percentComplete": 55
    },
    {
      "id": "act-08",
      "ref": "ACT-08",
      "title": "Expedite the Milan power upgrade with the utility",
      "description": "Paid expedite request and a temporary generator option to de-couple install from the utility date.",
      "ownerId": "own-04",
      "dueDate": "2026-08-17",
      "status": "overdue",
      "priority": "high",
      "linkedRiskIds": [
        "rsk-07"
      ],
      "linkedIssueIds": [
        "iss-04"
      ],
      "linkedDependencyIds": [
        "dep-12"
      ],
      "expectedRiskReduction": 0.2,
      "percentComplete": 70
    },
    {
      "id": "act-09",
      "ref": "ACT-09",
      "title": "Re-run the automation simulation with peak week order profiles",
      "description": "Replace the annual average profile with three real peak weeks and re-derive the achievable throughput.",
      "ownerId": "own-08",
      "dueDate": "2026-09-14",
      "status": "in-progress",
      "priority": "high",
      "linkedRiskIds": [
        "rsk-08",
        "rsk-33"
      ],
      "linkedIssueIds": [],
      "linkedDependencyIds": [
        "dep-49"
      ],
      "expectedRiskReduction": 0.3,
      "percentComplete": 35
    },
    {
      "id": "act-10",
      "ref": "ACT-10",
      "title": "Agree the remaining 17 metric definitions with finance",
      "description": "Joint workshop series to close the metric dictionary so reporting reconciles to the ledger.",
      "ownerId": "own-11",
      "dueDate": "2026-09-24",
      "status": "in-progress",
      "priority": "high",
      "linkedRiskIds": [
        "rsk-09",
        "rsk-27"
      ],
      "linkedIssueIds": [
        "iss-02"
      ],
      "linkedDependencyIds": [
        "dep-10"
      ],
      "expectedRiskReduction": 0.3,
      "percentComplete": 65
    },
    {
      "id": "act-11",
      "ref": "ACT-11",
      "title": "Deploy the fallback data sharing clause with the three holdout carriers",
      "description": "Use the pre-agreed fallback wording to unblock visibility data without reopening commercial terms.",
      "ownerId": "own-07",
      "dueDate": "2026-09-29",
      "status": "in-progress",
      "priority": "high",
      "linkedRiskIds": [
        "rsk-11"
      ],
      "linkedIssueIds": [],
      "linkedDependencyIds": [
        "dep-54"
      ],
      "expectedRiskReduction": 0.25,
      "percentComplete": 50
    },
    {
      "id": "act-12",
      "ref": "ACT-12",
      "title": "Run a proof of concept against the customs broker interface",
      "description": "Prove a single declaration end to end before committing the interface design.",
      "ownerId": "own-07",
      "dueDate": "2026-10-04",
      "status": "in-progress",
      "priority": "critical",
      "linkedRiskIds": [
        "rsk-14"
      ],
      "linkedIssueIds": [
        "iss-07"
      ],
      "linkedDependencyIds": [
        "dep-43"
      ],
      "expectedRiskReduction": 0.35,
      "percentComplete": 25
    },
    {
      "id": "act-13",
      "ref": "ACT-13",
      "title": "Complete the outstanding two data protection impact assessments",
      "description": "Close the assessment gap on the two carrier data flows still pending approval.",
      "ownerId": "own-13",
      "dueDate": "2026-10-09",
      "status": "in-progress",
      "priority": "medium",
      "linkedRiskIds": [
        "rsk-15"
      ],
      "linkedIssueIds": [],
      "linkedDependencyIds": [
        "dep-36"
      ],
      "expectedRiskReduction": 0.2,
      "percentComplete": 60
    },
    {
      "id": "act-14",
      "ref": "ACT-14",
      "title": "Document integration design decisions and name a deputy architect",
      "description": "Written decision log plus a named deputy so integration decisions do not stall on one person.",
      "ownerId": "own-06",
      "dueDate": "2026-08-29",
      "status": "overdue",
      "priority": "high",
      "linkedRiskIds": [
        "rsk-16"
      ],
      "linkedIssueIds": [
        "iss-12"
      ],
      "linkedDependencyIds": [],
      "expectedRiskReduction": 0.25,
      "percentComplete": 45
    },
    {
      "id": "act-15",
      "ref": "ACT-15",
      "title": "Add programme contribution to hub manager scorecards",
      "description": "Make tester and trainee release a measured objective for hub managers rather than a request.",
      "ownerId": "own-15",
      "dueDate": "2026-08-23",
      "status": "overdue",
      "priority": "high",
      "linkedRiskIds": [
        "rsk-17",
        "rsk-13"
      ],
      "linkedIssueIds": [
        "iss-08"
      ],
      "linkedDependencyIds": [
        "dep-61"
      ],
      "expectedRiskReduction": 0.3,
      "percentComplete": 20
    },
    {
      "id": "act-16",
      "ref": "ACT-16",
      "title": "Re-run the cutover rehearsal to prove a rollback inside four hours",
      "description": "Second rehearsal with the identified bottleneck steps automated, targeting a rollback under the agreed window.",
      "ownerId": "own-05",
      "dueDate": "2026-09-16",
      "status": "in-progress",
      "priority": "critical",
      "linkedRiskIds": [
        "rsk-18"
      ],
      "linkedIssueIds": [],
      "linkedDependencyIds": [
        "dep-63"
      ],
      "expectedRiskReduction": 0.35,
      "percentComplete": 30
    },
    {
      "id": "act-17",
      "ref": "ACT-17",
      "title": "Launch a targeted recruitment campaign for the Milan hub",
      "description": "Local campaign, referral incentive and an agency framework to close the recruitment gap.",
      "ownerId": "own-15",
      "dueDate": "2026-10-14",
      "status": "in-progress",
      "priority": "high",
      "linkedRiskIds": [
        "rsk-19"
      ],
      "linkedIssueIds": [],
      "linkedDependencyIds": [
        "dep-15"
      ],
      "expectedRiskReduction": 0.25,
      "percentComplete": 55
    },
    {
      "id": "act-18",
      "ref": "ACT-18",
      "title": "Prepare a works council position paper with legal review",
      "description": "Legally reviewed position paper addressing the objection, plus a revised consultation calendar.",
      "ownerId": "own-10",
      "dueDate": "2026-08-21",
      "status": "complete",
      "priority": "critical",
      "linkedRiskIds": [
        "rsk-20"
      ],
      "linkedIssueIds": [
        "iss-11"
      ],
      "linkedDependencyIds": [
        "dep-62"
      ],
      "expectedRiskReduction": 0.3,
      "percentComplete": 100,
      "completedDate": "2026-08-19"
    },
    {
      "id": "act-19",
      "ref": "ACT-19",
      "title": "Secure a written legacy TMS support extension to Q2",
      "description": "Extend legacy support to cover the revised two-wave go-live and hypercare period.",
      "ownerId": "own-14",
      "dueDate": "2026-09-17",
      "status": "in-progress",
      "priority": "high",
      "linkedRiskIds": [
        "rsk-21"
      ],
      "linkedIssueIds": [],
      "linkedDependencyIds": [
        "dep-29"
      ],
      "expectedRiskReduction": 0.4,
      "percentComplete": 40
    },
    {
      "id": "act-20",
      "ref": "ACT-20",
      "title": "Baseline and freeze the outstanding operational business rules",
      "description": "Formal baseline of the remaining rules with change control applied from the freeze date.",
      "ownerId": "own-05",
      "dueDate": "2026-09-02",
      "status": "overdue",
      "priority": "critical",
      "linkedRiskIds": [
        "rsk-22"
      ],
      "linkedIssueIds": [],
      "linkedDependencyIds": [
        "dep-26"
      ],
      "expectedRiskReduction": 0.35,
      "percentComplete": 50
    },
    {
      "id": "act-21",
      "ref": "ACT-21",
      "title": "Re-forecast programme cost with the approved change log",
      "description": "Bottom-up re-forecast including all approved changes and a revised contingency position.",
      "ownerId": "own-11",
      "dueDate": "2026-08-27",
      "status": "complete",
      "priority": "high",
      "linkedRiskIds": [
        "rsk-23"
      ],
      "linkedIssueIds": [],
      "linkedDependencyIds": [],
      "expectedRiskReduction": 0.15,
      "percentComplete": 100,
      "completedDate": "2026-08-25"
    },
    {
      "id": "act-22",
      "ref": "ACT-22",
      "title": "Establish a shared interface change calendar with Commerce Replatform",
      "description": "Joint calendar and a standing collision review between the two programme change boards.",
      "ownerId": "own-02",
      "dueDate": "2026-08-19",
      "status": "complete",
      "priority": "high",
      "linkedRiskIds": [
        "rsk-24"
      ],
      "linkedIssueIds": [],
      "linkedDependencyIds": [
        "dep-66"
      ],
      "expectedRiskReduction": 0.35,
      "percentComplete": 100,
      "completedDate": "2026-08-17"
    },
    {
      "id": "act-23",
      "ref": "ACT-23",
      "title": "Re-size hypercare for the two-wave go-live",
      "description": "Revised hypercare rota, escalation model and vendor cover for the split go-live.",
      "ownerId": "own-05",
      "dueDate": "2026-09-22",
      "status": "in-progress",
      "priority": "medium",
      "linkedRiskIds": [
        "rsk-25"
      ],
      "linkedIssueIds": [],
      "linkedDependencyIds": [
        "dep-29"
      ],
      "expectedRiskReduction": 0.3,
      "percentComplete": 70
    },
    {
      "id": "act-24",
      "ref": "ACT-24",
      "title": "Standardise carrier invoice formats to two accepted variants",
      "description": "Reduce six invoice formats to two so automated matching can be relied upon.",
      "ownerId": "own-07",
      "dueDate": "2026-09-20",
      "status": "open",
      "priority": "medium",
      "linkedRiskIds": [
        "rsk-26"
      ],
      "linkedIssueIds": [],
      "linkedDependencyIds": [
        "dep-40"
      ],
      "expectedRiskReduction": 0.3,
      "percentComplete": 15
    },
    {
      "id": "act-25",
      "ref": "ACT-25",
      "title": "Agree the benefit baseline for the five outstanding benefits",
      "description": "Written finance agreement on baseline, measure and cadence for the benefits still unsigned.",
      "ownerId": "own-11",
      "dueDate": "2026-09-12",
      "status": "in-progress",
      "priority": "critical",
      "linkedRiskIds": [
        "rsk-27"
      ],
      "linkedIssueIds": [],
      "linkedDependencyIds": [
        "dep-65"
      ],
      "expectedRiskReduction": 0.35,
      "percentComplete": 40
    },
    {
      "id": "act-26",
      "ref": "ACT-26",
      "title": "Complete threat models for the four remaining integration patterns",
      "description": "Close the threat model gap so penetration testing is confirmatory rather than exploratory.",
      "ownerId": "own-13",
      "dueDate": "2026-09-27",
      "status": "in-progress",
      "priority": "high",
      "linkedRiskIds": [
        "rsk-28",
        "rsk-02"
      ],
      "linkedIssueIds": [],
      "linkedDependencyIds": [
        "dep-35"
      ],
      "expectedRiskReduction": 0.25,
      "percentComplete": 65
    },
    {
      "id": "act-27",
      "ref": "ACT-27",
      "title": "Build a service level protection plan for the cutover window",
      "description": "Pre-agreed mitigations, customer communication and additional capacity for the cutover window.",
      "ownerId": "own-09",
      "dueDate": "2026-09-18",
      "status": "open",
      "priority": "high",
      "linkedRiskIds": [
        "rsk-29",
        "rsk-38"
      ],
      "linkedIssueIds": [],
      "linkedDependencyIds": [
        "dep-63"
      ],
      "expectedRiskReduction": 0.3,
      "percentComplete": 10
    },
    {
      "id": "act-28",
      "ref": "ACT-28",
      "title": "Model Frankfurt ramp-up with a slower learning curve",
      "description": "Sensitivity analysis on the ramp-up assumption and its effect on the benefit curve.",
      "ownerId": "own-04",
      "dueDate": "2026-09-10",
      "status": "in-progress",
      "priority": "medium",
      "linkedRiskIds": [
        "rsk-30"
      ],
      "linkedIssueIds": [],
      "linkedDependencyIds": [],
      "expectedRiskReduction": 0.2,
      "percentComplete": 45
    },
    {
      "id": "act-29",
      "ref": "ACT-29",
      "title": "Expedite the two outstanding racking aisles for Milan",
      "description": "Expedited delivery of the short-shipped aisles to protect the fit-out completion date.",
      "ownerId": "own-14",
      "dueDate": "2026-08-15",
      "status": "complete",
      "priority": "high",
      "linkedRiskIds": [
        "rsk-31"
      ],
      "linkedIssueIds": [
        "iss-09"
      ],
      "linkedDependencyIds": [
        "dep-19"
      ],
      "expectedRiskReduction": 0.35,
      "percentComplete": 100,
      "completedDate": "2026-08-13"
    },
    {
      "id": "act-30",
      "ref": "ACT-30",
      "title": "Move a further 15% of linehaul volume onto fixed rates",
      "description": "Third tender wave to reduce spot exposure on the highest volume lanes.",
      "ownerId": "own-11",
      "dueDate": "2026-09-26",
      "status": "open",
      "priority": "medium",
      "linkedRiskIds": [
        "rsk-32"
      ],
      "linkedIssueIds": [],
      "linkedDependencyIds": [],
      "expectedRiskReduction": 0.25,
      "percentComplete": 5
    },
    {
      "id": "act-31",
      "ref": "ACT-31",
      "title": "Agree an availability ramp-up schedule in the automation contract",
      "description": "Contractual availability ramp with remedies rather than a single day-one target.",
      "ownerId": "own-08",
      "dueDate": "2026-09-22",
      "status": "open",
      "priority": "high",
      "linkedRiskIds": [
        "rsk-33"
      ],
      "linkedIssueIds": [],
      "linkedDependencyIds": [
        "dep-49"
      ],
      "expectedRiskReduction": 0.3,
      "percentComplete": 10
    },
    {
      "id": "act-32",
      "ref": "ACT-32",
      "title": "Increase masked production data volume in the test environment",
      "description": "Raise test data volume from 4% to 40% of production so volume-sensitive defects surface before UAT exit.",
      "ownerId": "own-06",
      "dueDate": "2026-08-31",
      "status": "overdue",
      "priority": "high",
      "linkedRiskIds": [
        "rsk-34",
        "rsk-05"
      ],
      "linkedIssueIds": [
        "iss-06"
      ],
      "linkedDependencyIds": [],
      "expectedRiskReduction": 0.3,
      "percentComplete": 35
    },
    {
      "id": "act-33",
      "ref": "ACT-33",
      "title": "Submit the predictive ETA model for model risk review",
      "description": "Complete the model risk template and book the review slot before production deployment.",
      "ownerId": "own-09",
      "dueDate": "2026-09-14",
      "status": "open",
      "priority": "medium",
      "linkedRiskIds": [
        "rsk-35"
      ],
      "linkedIssueIds": [],
      "linkedDependencyIds": [
        "dep-56"
      ],
      "expectedRiskReduction": 0.35,
      "percentComplete": 20
    },
    {
      "id": "act-34",
      "ref": "ACT-34",
      "title": "Fund and appoint the run organisation roles",
      "description": "Business case addendum to fund the run roles so knowledge transfer has a receiving team.",
      "ownerId": "own-01",
      "dueDate": "2026-09-24",
      "status": "open",
      "priority": "critical",
      "linkedRiskIds": [
        "rsk-41",
        "rsk-10",
        "rsk-36"
      ],
      "linkedIssueIds": [],
      "linkedDependencyIds": [
        "dep-64"
      ],
      "expectedRiskReduction": 0.4,
      "percentComplete": 15
    }
  ],
  "issues": [
    {
      "id": "iss-01",
      "ref": "ISS-01",
      "title": "Master data defect backlog is above the remediation exit threshold",
      "description": "The critical attribute defect rate is 3.4% against a 1.5% exit threshold. Remediation is clearing 210 defects a week against 260 new arrivals, so the backlog is growing.",
      "ownerId": "own-12",
      "workstreamId": "ws-int",
      "priority": "critical",
      "status": "escalated",
      "dateRaised": "2026-07-16",
      "targetResolution": "2026-09-08",
      "actualCostImpact": 96000,
      "actualScheduleImpactDays": 18,
      "causeIds": [
        "cse-02",
        "cse-03"
      ],
      "actionIds": [
        "act-04",
        "act-05"
      ],
      "affectedMilestoneIds": [
        "ms-15",
        "ms-26"
      ],
      "evidence": [
        {
          "id": "iss-01-ev1",
          "label": "Issue log entry and impact assessment",
          "kind": "system-record",
          "date": "2026-07-18",
          "source": "Programme issue log",
          "confidence": "verified"
        }
      ],
      "comments": [
        {
          "id": "iss-01-cm1",
          "authorId": "own-12",
          "date": "2026-09-07",
          "body": "Impact recorded at 96000 EUR and 18 days. Status reviewed at the weekly issue forum."
        }
      ],
      "originRiskId": "rsk-04"
    },
    {
      "id": "iss-02",
      "ref": "ISS-02",
      "title": "Reporting reconciliation variance of 4.1% against finance",
      "description": "Period 11 reporting did not reconcile to the general ledger. Root cause is definitional rather than technical: operations count movements and finance counts invoices.",
      "ownerId": "own-11",
      "workstreamId": "ws-ctl",
      "priority": "high",
      "status": "open",
      "dateRaised": "2026-08-11",
      "targetResolution": "2026-09-14",
      "actualCostImpact": 34000,
      "actualScheduleImpactDays": 10,
      "causeIds": [
        "cse-09"
      ],
      "actionIds": [
        "act-10"
      ],
      "affectedMilestoneIds": [
        "ms-26"
      ],
      "evidence": [
        {
          "id": "iss-02-ev1",
          "label": "Issue log entry and impact assessment",
          "kind": "system-record",
          "date": "2026-08-13",
          "source": "Programme issue log",
          "confidence": "verified"
        }
      ],
      "comments": [
        {
          "id": "iss-02-cm1",
          "authorId": "own-11",
          "date": "2026-09-07",
          "body": "Impact recorded at 34000 EUR and 10 days. Status reviewed at the weekly issue forum."
        }
      ],
      "originRiskId": "rsk-09"
    },
    {
      "id": "iss-03",
      "ref": "ISS-03",
      "title": "Two tier 1 carriers have not granted API certification slots",
      "description": "Certification requires a joint test window with each carrier. Two carriers have not offered a slot inside the programme window, and one has linked it to the invoice schema being final.",
      "ownerId": "own-07",
      "workstreamId": "ws-int",
      "priority": "critical",
      "status": "escalated",
      "dateRaised": "2026-07-28",
      "targetResolution": "2026-09-02",
      "actualCostImpact": 41000,
      "actualScheduleImpactDays": 14,
      "causeIds": [
        "cse-01"
      ],
      "actionIds": [
        "act-01",
        "act-02"
      ],
      "affectedMilestoneIds": [
        "ms-13",
        "ms-17"
      ],
      "evidence": [
        {
          "id": "iss-03-ev1",
          "label": "Issue log entry and impact assessment",
          "kind": "system-record",
          "date": "2026-07-30",
          "source": "Programme issue log",
          "confidence": "verified"
        }
      ],
      "comments": [
        {
          "id": "iss-03-cm1",
          "authorId": "own-07",
          "date": "2026-09-02",
          "body": "Impact recorded at 41000 EUR and 14 days. Status reviewed at the weekly issue forum."
        }
      ],
      "originRiskId": "rsk-01"
    },
    {
      "id": "iss-04",
      "ref": "ISS-04",
      "title": "Milan power upgrade delayed by the distribution utility",
      "description": "The utility confirmed energisation eight weeks later than the fit-out plan assumed. A temporary generator is being priced as a bridge.",
      "ownerId": "own-04",
      "workstreamId": "ws-wms",
      "priority": "high",
      "status": "in-progress",
      "dateRaised": "2026-07-04",
      "targetResolution": "2026-08-31",
      "actualCostImpact": 58000,
      "actualScheduleImpactDays": 16,
      "causeIds": [
        "cse-05"
      ],
      "actionIds": [
        "act-08"
      ],
      "affectedMilestoneIds": [
        "ms-22",
        "ms-04"
      ],
      "evidence": [
        {
          "id": "iss-04-ev1",
          "label": "Issue log entry and impact assessment",
          "kind": "system-record",
          "date": "2026-07-06",
          "source": "Programme issue log",
          "confidence": "verified"
        }
      ],
      "comments": [
        {
          "id": "iss-04-cm1",
          "authorId": "own-04",
          "date": "2026-08-31",
          "body": "Impact recorded at 58000 EUR and 16 days. Status reviewed at the weekly issue forum."
        }
      ],
      "originRiskId": "rsk-07"
    },
    {
      "id": "iss-05",
      "ref": "ISS-05",
      "title": "Automation supplier moved the Milan build slot",
      "description": "The supplier reallocated the build slot to another customer and has offered no firm replacement date. There is no slot protection clause in the contract to enforce against.",
      "ownerId": "own-14",
      "workstreamId": "ws-wms",
      "priority": "critical",
      "status": "escalated",
      "dateRaised": "2026-07-20",
      "targetResolution": "2026-09-06",
      "actualCostImpact": 124000,
      "actualScheduleImpactDays": 28,
      "causeIds": [
        "cse-04"
      ],
      "actionIds": [
        "act-06",
        "act-07"
      ],
      "affectedMilestoneIds": [
        "ms-22",
        "ms-23"
      ],
      "evidence": [
        {
          "id": "iss-05-ev1",
          "label": "Issue log entry and impact assessment",
          "kind": "system-record",
          "date": "2026-07-22",
          "source": "Programme issue log",
          "confidence": "verified"
        }
      ],
      "comments": [
        {
          "id": "iss-05-cm1",
          "authorId": "own-14",
          "date": "2026-09-06",
          "body": "Impact recorded at 124000 EUR and 28 days. Status reviewed at the weekly issue forum."
        }
      ],
      "originRiskId": "rsk-06"
    },
    {
      "id": "iss-06",
      "ref": "ISS-06",
      "title": "Forty-seven severity 2 UAT defects open against a curve of twenty-two",
      "description": "Defect arrival is steady but closure is behind because business testers are attending part time and three defects require vendor releases.",
      "ownerId": "own-05",
      "workstreamId": "ws-tms",
      "priority": "critical",
      "status": "open",
      "dateRaised": "2026-08-03",
      "targetResolution": "2026-09-07",
      "actualCostImpact": 72000,
      "actualScheduleImpactDays": 15,
      "causeIds": [
        "cse-06",
        "cse-07"
      ],
      "actionIds": [
        "act-32"
      ],
      "affectedMilestoneIds": [
        "ms-09"
      ],
      "evidence": [
        {
          "id": "iss-06-ev1",
          "label": "Issue log entry and impact assessment",
          "kind": "system-record",
          "date": "2026-08-05",
          "source": "Programme issue log",
          "confidence": "verified"
        }
      ],
      "comments": [
        {
          "id": "iss-06-cm1",
          "authorId": "own-05",
          "date": "2026-09-07",
          "body": "Impact recorded at 72000 EUR and 15 days. Status reviewed at the weekly issue forum."
        }
      ],
      "originRiskId": "rsk-13"
    },
    {
      "id": "iss-07",
      "ref": "ISS-07",
      "title": "Customs broker has not released an interface specification",
      "description": "Repeated requests since period 9 have not produced a specification. The broker platform is bespoke legacy and they have offered a managed service instead.",
      "ownerId": "own-07",
      "workstreamId": "ws-car",
      "priority": "high",
      "status": "escalated",
      "dateRaised": "2026-07-26",
      "targetResolution": "2026-09-04",
      "actualCostImpact": 46000,
      "actualScheduleImpactDays": 18,
      "causeIds": [
        "cse-11"
      ],
      "actionIds": [
        "act-12"
      ],
      "affectedMilestoneIds": [
        "ms-19"
      ],
      "evidence": [
        {
          "id": "iss-07-ev1",
          "label": "Issue log entry and impact assessment",
          "kind": "system-record",
          "date": "2026-07-28",
          "source": "Programme issue log",
          "confidence": "verified"
        }
      ],
      "comments": [
        {
          "id": "iss-07-cm1",
          "authorId": "own-07",
          "date": "2026-09-04",
          "body": "Impact recorded at 46000 EUR and 18 days. Status reviewed at the weekly issue forum."
        }
      ],
      "originRiskId": "rsk-14"
    },
    {
      "id": "iss-08",
      "ref": "ISS-08",
      "title": "Super-user training attendance at 61% of the certified target",
      "description": "Fifty-five of ninety super-users are certified. Hub managers are prioritising operational service because programme contribution is not in their scorecard.",
      "ownerId": "own-10",
      "workstreamId": "ws-chg",
      "priority": "high",
      "status": "in-progress",
      "dateRaised": "2026-08-07",
      "targetResolution": "2026-09-09",
      "actualCostImpact": 28000,
      "actualScheduleImpactDays": 12,
      "causeIds": [
        "cse-07"
      ],
      "actionIds": [
        "act-15"
      ],
      "affectedMilestoneIds": [
        "ms-30",
        "ms-31"
      ],
      "evidence": [
        {
          "id": "iss-08-ev1",
          "label": "Issue log entry and impact assessment",
          "kind": "system-record",
          "date": "2026-08-09",
          "source": "Programme issue log",
          "confidence": "verified"
        }
      ],
      "comments": [
        {
          "id": "iss-08-cm1",
          "authorId": "own-10",
          "date": "2026-09-07",
          "body": "Impact recorded at 28000 EUR and 12 days. Status reviewed at the weekly issue forum."
        }
      ],
      "originRiskId": "rsk-17"
    },
    {
      "id": "iss-09",
      "ref": "ISS-09",
      "title": "Racking delivery short by two aisles at Milan",
      "description": "Two aisles were short-shipped against the delivery note. Expedited replacement arrived within the fit-out float and the milestone date held.",
      "ownerId": "own-04",
      "workstreamId": "ws-net",
      "priority": "medium",
      "status": "resolved",
      "dateRaised": "2026-06-28",
      "targetResolution": "2026-08-07",
      "actualCostImpact": 22000,
      "actualScheduleImpactDays": 6,
      "causeIds": [
        "cse-04"
      ],
      "actionIds": [
        "act-29"
      ],
      "affectedMilestoneIds": [
        "ms-04"
      ],
      "evidence": [
        {
          "id": "iss-09-ev1",
          "label": "Issue log entry and impact assessment",
          "kind": "system-record",
          "date": "2026-06-30",
          "source": "Programme issue log",
          "confidence": "verified"
        }
      ],
      "comments": [
        {
          "id": "iss-09-cm1",
          "authorId": "own-04",
          "date": "2026-08-07",
          "body": "Impact recorded at 22000 EUR and 6 days. Status reviewed at the weekly issue forum."
        }
      ],
      "resolvedDate": "2026-08-11",
      "originRiskId": "rsk-31"
    },
    {
      "id": "iss-10",
      "ref": "ISS-10",
      "title": "Legacy extract failures in migration dry run 2",
      "description": "Three of eleven legacy extracts failed on character encoding for Italian and Polish address data. Not a risk realisation, it was found by the rehearsal control working as intended.",
      "ownerId": "own-12",
      "workstreamId": "ws-int",
      "priority": "medium",
      "status": "in-progress",
      "dateRaised": "2026-08-19",
      "targetResolution": "2026-09-12",
      "actualCostImpact": 18000,
      "actualScheduleImpactDays": 5,
      "causeIds": [
        "cse-03",
        "cse-06"
      ],
      "actionIds": [],
      "affectedMilestoneIds": [
        "ms-15"
      ],
      "evidence": [
        {
          "id": "iss-10-ev1",
          "label": "Issue log entry and impact assessment",
          "kind": "system-record",
          "date": "2026-08-21",
          "source": "Programme issue log",
          "confidence": "verified"
        }
      ],
      "comments": [
        {
          "id": "iss-10-cm1",
          "authorId": "own-12",
          "date": "2026-09-07",
          "body": "Impact recorded at 18000 EUR and 5 days. Status reviewed at the weekly issue forum."
        }
      ]
    },
    {
      "id": "iss-11",
      "ref": "ISS-11",
      "title": "Formal works council objection to the new role structure",
      "description": "The council objected on process grounds because consultation began after the design was fixed. A legally reviewed position paper has been submitted and sessions have resumed.",
      "ownerId": "own-10",
      "workstreamId": "ws-chg",
      "priority": "high",
      "status": "in-progress",
      "dateRaised": "2026-06-24",
      "targetResolution": "2026-09-02",
      "actualCostImpact": 39000,
      "actualScheduleImpactDays": 20,
      "causeIds": [
        "cse-13"
      ],
      "actionIds": [
        "act-18"
      ],
      "affectedMilestoneIds": [
        "ms-31"
      ],
      "evidence": [
        {
          "id": "iss-11-ev1",
          "label": "Issue log entry and impact assessment",
          "kind": "system-record",
          "date": "2026-06-26",
          "source": "Programme issue log",
          "confidence": "verified"
        }
      ],
      "comments": [
        {
          "id": "iss-11-cm1",
          "authorId": "own-10",
          "date": "2026-09-02",
          "body": "Impact recorded at 39000 EUR and 20 days. Status reviewed at the weekly issue forum."
        }
      ],
      "originRiskId": "rsk-20"
    },
    {
      "id": "iss-12",
      "ref": "ISS-12",
      "title": "Integration architect unavailable for two weeks",
      "description": "Four integration design decisions stalled during the absence because the design rationale was undocumented. This is the measured evidence behind the key person risk.",
      "ownerId": "own-06",
      "workstreamId": "ws-int",
      "priority": "medium",
      "status": "closed",
      "dateRaised": "2026-06-16",
      "targetResolution": "2026-07-04",
      "actualCostImpact": 14000,
      "actualScheduleImpactDays": 8,
      "causeIds": [
        "cse-12"
      ],
      "actionIds": [
        "act-14"
      ],
      "affectedMilestoneIds": [
        "ms-13"
      ],
      "evidence": [
        {
          "id": "iss-12-ev1",
          "label": "Issue log entry and impact assessment",
          "kind": "system-record",
          "date": "2026-06-18",
          "source": "Programme issue log",
          "confidence": "verified"
        }
      ],
      "comments": [
        {
          "id": "iss-12-cm1",
          "authorId": "own-06",
          "date": "2026-07-04",
          "body": "Impact recorded at 14000 EUR and 8 days. Status reviewed at the weekly issue forum."
        }
      ],
      "resolvedDate": "2026-07-02",
      "originRiskId": "rsk-16"
    }
  ],
  "assumptions": [
    {
      "id": "asm-01",
      "ref": "ASM-01",
      "statement": "The seven-hub network can absorb peak volume without a further site",
      "ownerId": "own-04",
      "status": "validated",
      "confidence": "measured",
      "validationDate": "2025-12-06",
      "linkedMilestoneIds": [
        "ms-05"
      ],
      "note": "Confirmed by the network model against three peak weeks with 8% headroom at the tightest hub."
    },
    {
      "id": "asm-02",
      "ref": "ASM-02",
      "statement": "All tier 1 carriers will support the standard API contract suite",
      "ownerId": "own-06",
      "status": "invalidated",
      "confidence": "verified",
      "validationDate": "2026-07-28",
      "linkedMilestoneIds": [
        "ms-13",
        "ms-17"
      ],
      "note": "Proved false. Two carriers require the invoice message schema to be final before granting certification slots, which is the origin of the vendor specification risk.",
      "riskIfFalseId": "rsk-01"
    },
    {
      "id": "asm-03",
      "ref": "ASM-03",
      "statement": "Master data quality can be remediated by the existing data team",
      "ownerId": "own-12",
      "status": "invalidated",
      "confidence": "verified",
      "validationDate": "2026-07-16",
      "linkedMilestoneIds": [
        "ms-15"
      ],
      "note": "Proved false. Arrival rate exceeds clearance rate, so three contractors were added and the exit date still moved.",
      "riskIfFalseId": "rsk-04"
    },
    {
      "id": "asm-04",
      "ref": "ASM-04",
      "statement": "The automation supplier will hold the contracted build slot",
      "ownerId": "own-14",
      "status": "invalidated",
      "confidence": "verified",
      "validationDate": "2026-07-20",
      "linkedMilestoneIds": [
        "ms-22",
        "ms-23"
      ],
      "note": "Proved false. Without a slot protection clause the supplier reallocated capacity and the programme has no contractual remedy.",
      "riskIfFalseId": "rsk-06"
    },
    {
      "id": "asm-05",
      "ref": "ASM-05",
      "statement": "Business testers will be available for 80% of planned UAT days",
      "ownerId": "own-15",
      "status": "invalidated",
      "confidence": "measured",
      "validationDate": "2026-08-03",
      "linkedMilestoneIds": [
        "ms-09"
      ],
      "note": "Proved false. Actual availability is 62% of committed days because hub managers are measured on operational service only.",
      "riskIfFalseId": "rsk-13"
    },
    {
      "id": "asm-06",
      "ref": "ASM-06",
      "statement": "Utility connection lead times fit inside the fit-out float",
      "ownerId": "own-04",
      "status": "invalidated",
      "confidence": "verified",
      "validationDate": "2026-07-04",
      "linkedMilestoneIds": [
        "ms-04",
        "ms-22"
      ],
      "note": "Proved false. The quoted lead time was 26 weeks against 14 assumed.",
      "riskIfFalseId": "rsk-07"
    },
    {
      "id": "asm-07",
      "ref": "ASM-07",
      "statement": "Legacy transport system support will remain available until full cutover",
      "ownerId": "own-14",
      "status": "validating",
      "confidence": "indicative",
      "validationDate": "2026-09-08",
      "linkedMilestoneIds": [
        "ms-10",
        "ms-28"
      ],
      "note": "Under negotiation. A written extension to the end of Q2 has been requested but not yet countersigned.",
      "riskIfFalseId": "rsk-21"
    },
    {
      "id": "asm-08",
      "ref": "ASM-08",
      "statement": "Finance will accept the programme reporting pack without a separate build",
      "ownerId": "own-11",
      "status": "validating",
      "confidence": "measured",
      "validationDate": "2026-09-14",
      "linkedMilestoneIds": [
        "ms-26"
      ],
      "note": "Partially challenged. Acceptance now depends on closing the metric dictionary, which is 31 of 48 metrics agreed.",
      "riskIfFalseId": "rsk-09"
    },
    {
      "id": "asm-09",
      "ref": "ASM-09",
      "statement": "The run organisation will be funded from the next budget cycle",
      "ownerId": "own-01",
      "status": "unvalidated",
      "confidence": "anecdotal",
      "validationDate": "2026-09-24",
      "linkedMilestoneIds": [
        "ms-32"
      ],
      "note": "No written confirmation. Verbal indication only, and the knowledge transfer plan depends on it.",
      "riskIfFalseId": "rsk-41"
    },
    {
      "id": "asm-10",
      "ref": "ASM-10",
      "statement": "Automation reaches contractual availability from the first operating day",
      "ownerId": "own-08",
      "status": "unvalidated",
      "confidence": "indicative",
      "validationDate": "2026-09-22",
      "linkedMilestoneIds": [
        "ms-24"
      ],
      "note": "Not yet tested and contradicted by comparable installations, which took eight to twelve weeks to reach contractual availability.",
      "riskIfFalseId": "rsk-33"
    },
    {
      "id": "asm-11",
      "ref": "ASM-11",
      "statement": "Carrier rates awarded at tender will hold to signature",
      "ownerId": "own-07",
      "status": "validating",
      "confidence": "measured",
      "validationDate": "2026-09-20",
      "linkedMilestoneIds": [
        "ms-18"
      ],
      "note": "Rates are held for 60 days from award. Two awards are inside 15 days of expiry.",
      "riskIfFalseId": "rsk-12"
    },
    {
      "id": "asm-12",
      "ref": "ASM-12",
      "statement": "Works council consultation will complete without design change",
      "ownerId": "own-10",
      "status": "validating",
      "confidence": "measured",
      "validationDate": "2026-09-02",
      "linkedMilestoneIds": [
        "ms-31"
      ],
      "note": "Objection lodged and being worked. A design change to two roles is a possible outcome.",
      "riskIfFalseId": "rsk-20"
    }
  ],
  "dependencies": [
    {
      "id": "dep-01",
      "ref": "DEP-01",
      "name": "Carrier API specification v2.1 from TMS vendor",
      "description": "Nordwind Systems (TMS vendor) must provide carrier api specification v2.1 from tms vendor to Integration and Data Platform by the due date for downstream work to proceed as planned.",
      "type": "vendor",
      "upstream": "Nordwind Systems (TMS vendor)",
      "upstreamOwnerId": "own-14",
      "downstream": "Integration and Data Platform",
      "downstreamOwnerId": "own-06",
      "dueDate": "2026-06-28",
      "status": "late",
      "criticality": "critical",
      "delayProbability": 0.95,
      "potentialDelayDays": 21,
      "affectedMilestoneIds": [
        "ms-13"
      ],
      "affectedBenefitIds": [
        "ben-04"
      ],
      "predecessorIds": [],
      "linkedRiskIds": [
        "rsk-01"
      ]
    },
    {
      "id": "dep-02",
      "ref": "DEP-02",
      "name": "Tier 1 carrier API certification slots",
      "description": "Tier 1 carrier IT teams must provide tier 1 carrier api certification slots to Carrier API integration by the due date for downstream work to proceed as planned.",
      "type": "external",
      "upstream": "Tier 1 carrier IT teams",
      "upstreamOwnerId": "own-07",
      "downstream": "Carrier API integration",
      "downstreamOwnerId": "own-06",
      "dueDate": "2026-07-30",
      "status": "at-risk",
      "criticality": "critical",
      "delayProbability": 0.7,
      "potentialDelayDays": 14,
      "affectedMilestoneIds": [
        "ms-13",
        "ms-17"
      ],
      "affectedBenefitIds": [
        "ben-04",
        "ben-02"
      ],
      "predecessorIds": [
        "dep-01"
      ],
      "linkedRiskIds": [
        "rsk-01",
        "rsk-03"
      ]
    },
    {
      "id": "dep-03",
      "ref": "DEP-03",
      "name": "Hardened security test environment",
      "description": "Group Security Engineering must provide hardened security test environment to Security testing by the due date for downstream work to proceed as planned.",
      "type": "internal",
      "upstream": "Group Security Engineering",
      "upstreamOwnerId": "own-13",
      "downstream": "Security testing",
      "downstreamOwnerId": "own-13",
      "dueDate": "2026-08-19",
      "status": "at-risk",
      "criticality": "critical",
      "delayProbability": 0.6,
      "potentialDelayDays": 12,
      "affectedMilestoneIds": [
        "ms-14"
      ],
      "affectedBenefitIds": [
        "ben-04"
      ],
      "predecessorIds": [
        "dep-02"
      ],
      "linkedRiskIds": [
        "rsk-02"
      ]
    },
    {
      "id": "dep-04",
      "ref": "DEP-04",
      "name": "Penetration test vendor engagement window",
      "description": "Aegis Assurance must provide penetration test vendor engagement window to Security testing sign-off by the due date for downstream work to proceed as planned.",
      "type": "vendor",
      "upstream": "Aegis Assurance",
      "upstreamOwnerId": "own-13",
      "downstream": "Security testing sign-off",
      "downstreamOwnerId": "own-13",
      "dueDate": "2026-09-04",
      "status": "at-risk",
      "criticality": "critical",
      "delayProbability": 0.5,
      "potentialDelayDays": 10,
      "affectedMilestoneIds": [
        "ms-14"
      ],
      "affectedBenefitIds": [
        "ben-04"
      ],
      "predecessorIds": [
        "dep-03"
      ],
      "linkedRiskIds": [
        "rsk-02"
      ]
    },
    {
      "id": "dep-05",
      "ref": "DEP-05",
      "name": "Production cutover change freeze approval",
      "description": "Group IT Change Board must provide production cutover change freeze approval to TMS go-live wave 1 by the due date for downstream work to proceed as planned.",
      "type": "internal",
      "upstream": "Group IT Change Board",
      "upstreamOwnerId": "own-02",
      "downstream": "TMS go-live wave 1",
      "downstreamOwnerId": "own-05",
      "dueDate": "2026-09-28",
      "status": "at-risk",
      "criticality": "critical",
      "delayProbability": 0.45,
      "potentialDelayDays": 9,
      "affectedMilestoneIds": [
        "ms-10"
      ],
      "affectedBenefitIds": [
        "ben-04",
        "ben-09"
      ],
      "predecessorIds": [
        "dep-04"
      ],
      "linkedRiskIds": [
        "rsk-02",
        "rsk-24"
      ]
    },
    {
      "id": "dep-06",
      "ref": "DEP-06",
      "name": "Customer communication and launch approval",
      "description": "Commercial and Marketing must provide customer communication and launch approval to Customer launch by the due date for downstream work to proceed as planned.",
      "type": "internal",
      "upstream": "Commercial and Marketing",
      "upstreamOwnerId": "own-01",
      "downstream": "Customer launch",
      "downstreamOwnerId": "own-01",
      "dueDate": "2026-10-18",
      "status": "on-track",
      "criticality": "high",
      "delayProbability": 0.3,
      "potentialDelayDays": 7,
      "affectedMilestoneIds": [
        "ms-32"
      ],
      "affectedBenefitIds": [
        "ben-04"
      ],
      "predecessorIds": [
        "dep-05"
      ],
      "linkedRiskIds": []
    },
    {
      "id": "dep-07",
      "ref": "DEP-07",
      "name": "Master data steward capacity from regional operations",
      "description": "Regional operations data stewards must provide master data steward capacity from regional operations to Data quality remediation by the due date for downstream work to proceed as planned.",
      "type": "internal",
      "upstream": "Regional operations data stewards",
      "upstreamOwnerId": "own-12",
      "downstream": "Data quality remediation",
      "downstreamOwnerId": "own-12",
      "dueDate": "2026-06-24",
      "status": "late",
      "criticality": "critical",
      "delayProbability": 0.9,
      "potentialDelayDays": 24,
      "affectedMilestoneIds": [
        "ms-15"
      ],
      "affectedBenefitIds": [
        "ben-05"
      ],
      "predecessorIds": [],
      "linkedRiskIds": [
        "rsk-04"
      ]
    },
    {
      "id": "dep-08",
      "ref": "DEP-08",
      "name": "Reference data from legacy TMS extracts",
      "description": "Legacy TMS support team must provide reference data from legacy tms extracts to Data migration by the due date for downstream work to proceed as planned.",
      "type": "internal",
      "upstream": "Legacy TMS support team",
      "upstreamOwnerId": "own-12",
      "downstream": "Data migration",
      "downstreamOwnerId": "own-06",
      "dueDate": "2026-05-21",
      "status": "delivered",
      "criticality": "high",
      "delayProbability": 0.1,
      "potentialDelayDays": 5,
      "affectedMilestoneIds": [
        "ms-12",
        "ms-15"
      ],
      "affectedBenefitIds": [],
      "predecessorIds": [],
      "linkedRiskIds": []
    },
    {
      "id": "dep-09",
      "ref": "DEP-09",
      "name": "Certified data set for reporting suite",
      "description": "Data Quality must provide certified data set for reporting suite to Reporting suite v1 by the due date for downstream work to proceed as planned.",
      "type": "internal",
      "upstream": "Data Quality",
      "upstreamOwnerId": "own-12",
      "downstream": "Reporting suite v1",
      "downstreamOwnerId": "own-09",
      "dueDate": "2026-07-24",
      "status": "at-risk",
      "criticality": "critical",
      "delayProbability": 0.75,
      "potentialDelayDays": 18,
      "affectedMilestoneIds": [
        "ms-26"
      ],
      "affectedBenefitIds": [
        "ben-08"
      ],
      "predecessorIds": [
        "dep-07"
      ],
      "linkedRiskIds": [
        "rsk-09"
      ]
    },
    {
      "id": "dep-10",
      "ref": "DEP-10",
      "name": "Finance reconciliation sign-off on reporting",
      "description": "Group Finance must provide finance reconciliation sign-off on reporting to Reporting suite v1 by the due date for downstream work to proceed as planned.",
      "type": "internal",
      "upstream": "Group Finance",
      "upstreamOwnerId": "own-11",
      "downstream": "Reporting suite v1",
      "downstreamOwnerId": "own-09",
      "dueDate": "2026-08-07",
      "status": "at-risk",
      "criticality": "high",
      "delayProbability": 0.55,
      "potentialDelayDays": 12,
      "affectedMilestoneIds": [
        "ms-26",
        "ms-20"
      ],
      "affectedBenefitIds": [
        "ben-08"
      ],
      "predecessorIds": [
        "dep-09"
      ],
      "linkedRiskIds": [
        "rsk-09",
        "rsk-27"
      ]
    },
    {
      "id": "dep-11",
      "ref": "DEP-11",
      "name": "Automation supplier build slot, Milan line",
      "description": "Meridian Intralogistics must provide automation supplier build slot, milan line to Milan automation install by the due date for downstream work to proceed as planned.",
      "type": "vendor",
      "upstream": "Meridian Intralogistics",
      "upstreamOwnerId": "own-14",
      "downstream": "Milan automation install",
      "downstreamOwnerId": "own-08",
      "dueDate": "2026-07-16",
      "status": "late",
      "criticality": "critical",
      "delayProbability": 0.92,
      "potentialDelayDays": 28,
      "affectedMilestoneIds": [
        "ms-22"
      ],
      "affectedBenefitIds": [
        "ben-03"
      ],
      "predecessorIds": [],
      "linkedRiskIds": [
        "rsk-06"
      ]
    },
    {
      "id": "dep-12",
      "ref": "DEP-12",
      "name": "Milan hub power upgrade by utility",
      "description": "Enel distribution must provide milan hub power upgrade by utility to Milan automation install by the due date for downstream work to proceed as planned.",
      "type": "external",
      "upstream": "Enel distribution",
      "upstreamOwnerId": "own-04",
      "downstream": "Milan automation install",
      "downstreamOwnerId": "own-08",
      "dueDate": "2026-07-04",
      "status": "at-risk",
      "criticality": "critical",
      "delayProbability": 0.6,
      "potentialDelayDays": 20,
      "affectedMilestoneIds": [
        "ms-22",
        "ms-04"
      ],
      "affectedBenefitIds": [
        "ben-03"
      ],
      "predecessorIds": [],
      "linkedRiskIds": [
        "rsk-07"
      ]
    },
    {
      "id": "dep-13",
      "ref": "DEP-13",
      "name": "Installation crew mobilisation",
      "description": "Meridian Intralogistics must provide installation crew mobilisation to Milan automation install by the due date for downstream work to proceed as planned.",
      "type": "vendor",
      "upstream": "Meridian Intralogistics",
      "upstreamOwnerId": "own-14",
      "downstream": "Milan automation install",
      "downstreamOwnerId": "own-08",
      "dueDate": "2026-08-11",
      "status": "at-risk",
      "criticality": "critical",
      "delayProbability": 0.7,
      "potentialDelayDays": 16,
      "affectedMilestoneIds": [
        "ms-22"
      ],
      "affectedBenefitIds": [
        "ben-03"
      ],
      "predecessorIds": [
        "dep-11",
        "dep-12"
      ],
      "linkedRiskIds": [
        "rsk-06"
      ]
    },
    {
      "id": "dep-14",
      "ref": "DEP-14",
      "name": "FAT commissioning engineers",
      "description": "Meridian Intralogistics must provide fat commissioning engineers to Automation commissioning by the due date for downstream work to proceed as planned.",
      "type": "vendor",
      "upstream": "Meridian Intralogistics",
      "upstreamOwnerId": "own-14",
      "downstream": "Automation commissioning",
      "downstreamOwnerId": "own-08",
      "dueDate": "2026-09-12",
      "status": "at-risk",
      "criticality": "critical",
      "delayProbability": 0.65,
      "potentialDelayDays": 14,
      "affectedMilestoneIds": [
        "ms-23"
      ],
      "affectedBenefitIds": [
        "ben-03",
        "ben-08"
      ],
      "predecessorIds": [
        "dep-13"
      ],
      "linkedRiskIds": [
        "rsk-06",
        "rsk-33"
      ]
    },
    {
      "id": "dep-15",
      "ref": "DEP-15",
      "name": "Warehouse operatives recruited and trained",
      "description": "Milan hub HR must provide warehouse operatives recruited and trained to Warehouse go-live wave 1 by the due date for downstream work to proceed as planned.",
      "type": "internal",
      "upstream": "Milan hub HR",
      "upstreamOwnerId": "own-15",
      "downstream": "Warehouse go-live wave 1",
      "downstreamOwnerId": "own-08",
      "dueDate": "2026-09-24",
      "status": "at-risk",
      "criticality": "high",
      "delayProbability": 0.5,
      "potentialDelayDays": 11,
      "affectedMilestoneIds": [
        "ms-24"
      ],
      "affectedBenefitIds": [
        "ben-03",
        "ben-06"
      ],
      "predecessorIds": [
        "dep-14"
      ],
      "linkedRiskIds": [
        "rsk-19"
      ]
    },
    {
      "id": "dep-16",
      "ref": "DEP-16",
      "name": "Board investment approval for hub consolidation",
      "description": "Investment Committee must provide board investment approval for hub consolidation to Network Design by the due date for downstream work to proceed as planned.",
      "type": "internal",
      "upstream": "Investment Committee",
      "upstreamOwnerId": "own-01",
      "downstream": "Network Design",
      "downstreamOwnerId": "own-04",
      "dueDate": "2025-11-28",
      "status": "delivered",
      "criticality": "critical",
      "delayProbability": 0.05,
      "potentialDelayDays": 10,
      "affectedMilestoneIds": [
        "ms-02"
      ],
      "affectedBenefitIds": [
        "ben-01"
      ],
      "predecessorIds": [],
      "linkedRiskIds": []
    },
    {
      "id": "dep-17",
      "ref": "DEP-17",
      "name": "Frankfurt landlord lease negotiation",
      "description": "Rheinpark Logistik GmbH must provide frankfurt landlord lease negotiation to Frankfurt hub lease by the due date for downstream work to proceed as planned.",
      "type": "external",
      "upstream": "Rheinpark Logistik GmbH",
      "upstreamOwnerId": "own-04",
      "downstream": "Frankfurt hub lease",
      "downstreamOwnerId": "own-04",
      "dueDate": "2026-02-08",
      "status": "delivered",
      "criticality": "high",
      "delayProbability": 0.1,
      "potentialDelayDays": 14,
      "affectedMilestoneIds": [
        "ms-03"
      ],
      "affectedBenefitIds": [
        "ben-01"
      ],
      "predecessorIds": [
        "dep-16"
      ],
      "linkedRiskIds": []
    },
    {
      "id": "dep-18",
      "ref": "DEP-18",
      "name": "Milan hub building permit",
      "description": "Comune di Milano must provide milan hub building permit to Milan hub fit-out by the due date for downstream work to proceed as planned.",
      "type": "regulatory",
      "upstream": "Comune di Milano",
      "upstreamOwnerId": "own-04",
      "downstream": "Milan hub fit-out",
      "downstreamOwnerId": "own-04",
      "dueDate": "2026-05-11",
      "status": "delivered",
      "criticality": "critical",
      "delayProbability": 0.1,
      "potentialDelayDays": 30,
      "affectedMilestoneIds": [
        "ms-04"
      ],
      "affectedBenefitIds": [
        "ben-01"
      ],
      "predecessorIds": [
        "dep-16"
      ],
      "linkedRiskIds": []
    },
    {
      "id": "dep-19",
      "ref": "DEP-19",
      "name": "Racking and MHE delivery, Milan",
      "description": "Stella Storage Systems must provide racking and mhe delivery, milan to Milan hub fit-out by the due date for downstream work to proceed as planned.",
      "type": "vendor",
      "upstream": "Stella Storage Systems",
      "upstreamOwnerId": "own-14",
      "downstream": "Milan hub fit-out",
      "downstreamOwnerId": "own-04",
      "dueDate": "2026-06-20",
      "status": "at-risk",
      "criticality": "high",
      "delayProbability": 0.4,
      "potentialDelayDays": 12,
      "affectedMilestoneIds": [
        "ms-04"
      ],
      "affectedBenefitIds": [
        "ben-01"
      ],
      "predecessorIds": [
        "dep-18"
      ],
      "linkedRiskIds": [
        "rsk-31"
      ]
    },
    {
      "id": "dep-20",
      "ref": "DEP-20",
      "name": "Works council consultation, Italy",
      "description": "Italian works council must provide works council consultation, italy to Network cutover wave 1 by the due date for downstream work to proceed as planned.",
      "type": "regulatory",
      "upstream": "Italian works council",
      "upstreamOwnerId": "own-10",
      "downstream": "Network cutover wave 1",
      "downstreamOwnerId": "own-04",
      "dueDate": "2026-08-27",
      "status": "at-risk",
      "criticality": "high",
      "delayProbability": 0.45,
      "potentialDelayDays": 21,
      "affectedMilestoneIds": [
        "ms-05"
      ],
      "affectedBenefitIds": [
        "ben-01"
      ],
      "predecessorIds": [],
      "linkedRiskIds": [
        "rsk-20"
      ]
    },
    {
      "id": "dep-21",
      "ref": "DEP-21",
      "name": "Legacy site exit notices served",
      "description": "Property and Facilities must provide legacy site exit notices served to Network cutover wave 1 by the due date for downstream work to proceed as planned.",
      "type": "internal",
      "upstream": "Property and Facilities",
      "upstreamOwnerId": "own-04",
      "downstream": "Network cutover wave 1",
      "downstreamOwnerId": "own-04",
      "dueDate": "2026-09-16",
      "status": "on-track",
      "criticality": "medium",
      "delayProbability": 0.25,
      "potentialDelayDays": 10,
      "affectedMilestoneIds": [
        "ms-05"
      ],
      "affectedBenefitIds": [
        "ben-01"
      ],
      "predecessorIds": [
        "dep-20"
      ],
      "linkedRiskIds": []
    },
    {
      "id": "dep-22",
      "ref": "DEP-22",
      "name": "Transport plan re-baselined for seven hubs",
      "description": "Network Design must provide transport plan re-baselined for seven hubs to TMS configuration build by the due date for downstream work to proceed as planned.",
      "type": "internal",
      "upstream": "Network Design",
      "upstreamOwnerId": "own-04",
      "downstream": "TMS configuration build",
      "downstreamOwnerId": "own-05",
      "dueDate": "2026-06-12",
      "status": "delivered",
      "criticality": "high",
      "delayProbability": 0.15,
      "potentialDelayDays": 8,
      "affectedMilestoneIds": [
        "ms-08"
      ],
      "affectedBenefitIds": [
        "ben-01"
      ],
      "predecessorIds": [
        "dep-16"
      ],
      "linkedRiskIds": []
    },
    {
      "id": "dep-23",
      "ref": "DEP-23",
      "name": "TMS vendor contract execution",
      "description": "Nordwind Systems must provide tms vendor contract execution to TMS Delivery by the due date for downstream work to proceed as planned.",
      "type": "vendor",
      "upstream": "Nordwind Systems",
      "upstreamOwnerId": "own-14",
      "downstream": "TMS Delivery",
      "downstreamOwnerId": "own-05",
      "dueDate": "2025-11-18",
      "status": "delivered",
      "criticality": "critical",
      "delayProbability": 0.05,
      "potentialDelayDays": 12,
      "affectedMilestoneIds": [
        "ms-06"
      ],
      "affectedBenefitIds": [
        "ben-09"
      ],
      "predecessorIds": [],
      "linkedRiskIds": []
    },
    {
      "id": "dep-24",
      "ref": "DEP-24",
      "name": "Design authority review slot",
      "description": "Enterprise Architecture must provide design authority review slot to TMS design sign-off by the due date for downstream work to proceed as planned.",
      "type": "internal",
      "upstream": "Enterprise Architecture",
      "upstreamOwnerId": "own-06",
      "downstream": "TMS design sign-off",
      "downstreamOwnerId": "own-05",
      "dueDate": "2026-01-25",
      "status": "delivered",
      "criticality": "high",
      "delayProbability": 0.1,
      "potentialDelayDays": 7,
      "affectedMilestoneIds": [
        "ms-07"
      ],
      "affectedBenefitIds": [],
      "predecessorIds": [
        "dep-23"
      ],
      "linkedRiskIds": []
    },
    {
      "id": "dep-25",
      "ref": "DEP-25",
      "name": "TMS non-production environments",
      "description": "Nordwind Systems must provide tms non-production environments to TMS configuration build by the due date for downstream work to proceed as planned.",
      "type": "vendor",
      "upstream": "Nordwind Systems",
      "upstreamOwnerId": "own-14",
      "downstream": "TMS configuration build",
      "downstreamOwnerId": "own-05",
      "dueDate": "2026-04-01",
      "status": "delivered",
      "criticality": "critical",
      "delayProbability": 0.1,
      "potentialDelayDays": 15,
      "affectedMilestoneIds": [
        "ms-08"
      ],
      "affectedBenefitIds": [],
      "predecessorIds": [
        "dep-23"
      ],
      "linkedRiskIds": []
    },
    {
      "id": "dep-26",
      "ref": "DEP-26",
      "name": "Business rules confirmed by operations",
      "description": "Hub operations managers must provide business rules confirmed by operations to TMS configuration build by the due date for downstream work to proceed as planned.",
      "type": "internal",
      "upstream": "Hub operations managers",
      "upstreamOwnerId": "own-15",
      "downstream": "TMS configuration build",
      "downstreamOwnerId": "own-05",
      "dueDate": "2026-06-04",
      "status": "at-risk",
      "criticality": "high",
      "delayProbability": 0.4,
      "potentialDelayDays": 10,
      "affectedMilestoneIds": [
        "ms-08"
      ],
      "affectedBenefitIds": [
        "ben-01"
      ],
      "predecessorIds": [],
      "linkedRiskIds": [
        "rsk-22"
      ]
    },
    {
      "id": "dep-27",
      "ref": "DEP-27",
      "name": "UAT business tester availability",
      "description": "Regional operations must provide uat business tester availability to TMS UAT exit by the due date for downstream work to proceed as planned.",
      "type": "internal",
      "upstream": "Regional operations",
      "upstreamOwnerId": "own-15",
      "downstream": "TMS UAT exit",
      "downstreamOwnerId": "own-05",
      "dueDate": "2026-08-09",
      "status": "at-risk",
      "criticality": "critical",
      "delayProbability": 0.6,
      "potentialDelayDays": 15,
      "affectedMilestoneIds": [
        "ms-09"
      ],
      "affectedBenefitIds": [
        "ben-04"
      ],
      "predecessorIds": [
        "dep-26"
      ],
      "linkedRiskIds": [
        "rsk-13"
      ]
    },
    {
      "id": "dep-28",
      "ref": "DEP-28",
      "name": "Defect fix releases from TMS vendor",
      "description": "Nordwind Systems must provide defect fix releases from tms vendor to TMS UAT exit by the due date for downstream work to proceed as planned.",
      "type": "vendor",
      "upstream": "Nordwind Systems",
      "upstreamOwnerId": "own-14",
      "downstream": "TMS UAT exit",
      "downstreamOwnerId": "own-05",
      "dueDate": "2026-08-23",
      "status": "at-risk",
      "criticality": "critical",
      "delayProbability": 0.55,
      "potentialDelayDays": 12,
      "affectedMilestoneIds": [
        "ms-09"
      ],
      "affectedBenefitIds": [
        "ben-04"
      ],
      "predecessorIds": [
        "dep-27"
      ],
      "linkedRiskIds": [
        "rsk-13"
      ]
    },
    {
      "id": "dep-29",
      "ref": "DEP-29",
      "name": "Hypercare support contract in force",
      "description": "Nordwind Systems must provide hypercare support contract in force to TMS go-live wave 1 by the due date for downstream work to proceed as planned.",
      "type": "vendor",
      "upstream": "Nordwind Systems",
      "upstreamOwnerId": "own-14",
      "downstream": "TMS go-live wave 1",
      "downstreamOwnerId": "own-05",
      "dueDate": "2026-09-22",
      "status": "on-track",
      "criticality": "high",
      "delayProbability": 0.25,
      "potentialDelayDays": 8,
      "affectedMilestoneIds": [
        "ms-10"
      ],
      "affectedBenefitIds": [
        "ben-09"
      ],
      "predecessorIds": [
        "dep-23"
      ],
      "linkedRiskIds": []
    },
    {
      "id": "dep-30",
      "ref": "DEP-30",
      "name": "Legacy TMS decommission approval",
      "description": "Group IT Asset Management must provide legacy tms decommission approval to Legacy decommission by the due date for downstream work to proceed as planned.",
      "type": "internal",
      "upstream": "Group IT Asset Management",
      "upstreamOwnerId": "own-05",
      "downstream": "Legacy decommission",
      "downstreamOwnerId": "own-05",
      "dueDate": "2026-10-14",
      "status": "on-track",
      "criticality": "medium",
      "delayProbability": 0.3,
      "potentialDelayDays": 14,
      "affectedMilestoneIds": [
        "ms-28"
      ],
      "affectedBenefitIds": [
        "ben-09"
      ],
      "predecessorIds": [
        "dep-29"
      ],
      "linkedRiskIds": []
    },
    {
      "id": "dep-31",
      "ref": "DEP-31",
      "name": "API gateway capacity uplift",
      "description": "Group Platform Engineering must provide api gateway capacity uplift to Integration platform by the due date for downstream work to proceed as planned.",
      "type": "internal",
      "upstream": "Group Platform Engineering",
      "upstreamOwnerId": "own-06",
      "downstream": "Integration platform",
      "downstreamOwnerId": "own-06",
      "dueDate": "2026-05-27",
      "status": "delivered",
      "criticality": "high",
      "delayProbability": 0.15,
      "potentialDelayDays": 10,
      "affectedMilestoneIds": [
        "ms-13"
      ],
      "affectedBenefitIds": [],
      "predecessorIds": [],
      "linkedRiskIds": []
    },
    {
      "id": "dep-32",
      "ref": "DEP-32",
      "name": "Event backbone licence extension",
      "description": "Streamline Data must provide event backbone licence extension to Integration platform by the due date for downstream work to proceed as planned.",
      "type": "vendor",
      "upstream": "Streamline Data",
      "upstreamOwnerId": "own-14",
      "downstream": "Integration platform",
      "downstreamOwnerId": "own-06",
      "dueDate": "2026-06-16",
      "status": "delivered",
      "criticality": "medium",
      "delayProbability": 0.2,
      "potentialDelayDays": 9,
      "affectedMilestoneIds": [
        "ms-13",
        "ms-25"
      ],
      "affectedBenefitIds": [],
      "predecessorIds": [],
      "linkedRiskIds": []
    },
    {
      "id": "dep-33",
      "ref": "DEP-33",
      "name": "Canonical data model ratified",
      "description": "Enterprise Architecture must provide canonical data model ratified to Data migration by the due date for downstream work to proceed as planned.",
      "type": "internal",
      "upstream": "Enterprise Architecture",
      "upstreamOwnerId": "own-06",
      "downstream": "Data migration",
      "downstreamOwnerId": "own-06",
      "dueDate": "2026-04-21",
      "status": "delivered",
      "criticality": "high",
      "delayProbability": 0.1,
      "potentialDelayDays": 8,
      "affectedMilestoneIds": [
        "ms-11",
        "ms-12"
      ],
      "affectedBenefitIds": [],
      "predecessorIds": [],
      "linkedRiskIds": []
    },
    {
      "id": "dep-34",
      "ref": "DEP-34",
      "name": "Data quality tooling licences",
      "description": "Veridian Data Quality must provide data quality tooling licences to Data quality remediation by the due date for downstream work to proceed as planned.",
      "type": "vendor",
      "upstream": "Veridian Data Quality",
      "upstreamOwnerId": "own-14",
      "downstream": "Data quality remediation",
      "downstreamOwnerId": "own-12",
      "dueDate": "2026-05-31",
      "status": "delivered",
      "criticality": "medium",
      "delayProbability": 0.2,
      "potentialDelayDays": 7,
      "affectedMilestoneIds": [
        "ms-15"
      ],
      "affectedBenefitIds": [
        "ben-05"
      ],
      "predecessorIds": [],
      "linkedRiskIds": []
    },
    {
      "id": "dep-35",
      "ref": "DEP-35",
      "name": "Threat model review by security architecture",
      "description": "Security Architecture must provide threat model review by security architecture to Security testing by the due date for downstream work to proceed as planned.",
      "type": "internal",
      "upstream": "Security Architecture",
      "upstreamOwnerId": "own-13",
      "downstream": "Security testing",
      "downstreamOwnerId": "own-13",
      "dueDate": "2026-08-05",
      "status": "at-risk",
      "criticality": "high",
      "delayProbability": 0.5,
      "potentialDelayDays": 10,
      "affectedMilestoneIds": [
        "ms-14"
      ],
      "affectedBenefitIds": [],
      "predecessorIds": [
        "dep-31"
      ],
      "linkedRiskIds": [
        "rsk-02"
      ]
    },
    {
      "id": "dep-36",
      "ref": "DEP-36",
      "name": "Data protection impact assessment approval",
      "description": "Group Data Protection Office must provide data protection impact assessment approval to Carrier API integration by the due date for downstream work to proceed as planned.",
      "type": "regulatory",
      "upstream": "Group Data Protection Office",
      "upstreamOwnerId": "own-13",
      "downstream": "Carrier API integration",
      "downstreamOwnerId": "own-06",
      "dueDate": "2026-07-22",
      "status": "at-risk",
      "criticality": "high",
      "delayProbability": 0.4,
      "potentialDelayDays": 14,
      "affectedMilestoneIds": [
        "ms-13",
        "ms-19"
      ],
      "affectedBenefitIds": [
        "ben-07"
      ],
      "predecessorIds": [],
      "linkedRiskIds": [
        "rsk-15"
      ]
    },
    {
      "id": "dep-37",
      "ref": "DEP-37",
      "name": "Migration cutover data freeze",
      "description": "Regional operations must provide migration cutover data freeze to TMS go-live wave 1 by the due date for downstream work to proceed as planned.",
      "type": "internal",
      "upstream": "Regional operations",
      "upstreamOwnerId": "own-12",
      "downstream": "TMS go-live wave 1",
      "downstreamOwnerId": "own-05",
      "dueDate": "2026-09-26",
      "status": "on-track",
      "criticality": "high",
      "delayProbability": 0.3,
      "potentialDelayDays": 6,
      "affectedMilestoneIds": [
        "ms-10",
        "ms-15"
      ],
      "affectedBenefitIds": [],
      "predecessorIds": [
        "dep-07"
      ],
      "linkedRiskIds": []
    },
    {
      "id": "dep-38",
      "ref": "DEP-38",
      "name": "Predictive ETA feature store",
      "description": "Group Data Science Platform must provide predictive eta feature store to Predictive ETA model by the due date for downstream work to proceed as planned.",
      "type": "internal",
      "upstream": "Group Data Science Platform",
      "upstreamOwnerId": "own-09",
      "downstream": "Predictive ETA model",
      "downstreamOwnerId": "own-09",
      "dueDate": "2026-09-08",
      "status": "on-track",
      "criticality": "medium",
      "delayProbability": 0.35,
      "potentialDelayDays": 12,
      "affectedMilestoneIds": [
        "ms-27"
      ],
      "affectedBenefitIds": [
        "ben-08"
      ],
      "predecessorIds": [
        "dep-32"
      ],
      "linkedRiskIds": []
    },
    {
      "id": "dep-39",
      "ref": "DEP-39",
      "name": "Carrier framework agreement templates from legal",
      "description": "Group Legal must provide carrier framework agreement templates from legal to Carrier onboarding by the due date for downstream work to proceed as planned.",
      "type": "internal",
      "upstream": "Group Legal",
      "upstreamOwnerId": "own-07",
      "downstream": "Carrier onboarding",
      "downstreamOwnerId": "own-07",
      "dueDate": "2026-01-29",
      "status": "delivered",
      "criticality": "high",
      "delayProbability": 0.1,
      "potentialDelayDays": 12,
      "affectedMilestoneIds": [
        "ms-16"
      ],
      "affectedBenefitIds": [
        "ben-02"
      ],
      "predecessorIds": [],
      "linkedRiskIds": []
    },
    {
      "id": "dep-40",
      "ref": "DEP-40",
      "name": "Insurance certificate verification service",
      "description": "CertifyEU must provide insurance certificate verification service to Carrier onboarding by the due date for downstream work to proceed as planned.",
      "type": "vendor",
      "upstream": "CertifyEU",
      "upstreamOwnerId": "own-07",
      "downstream": "Carrier onboarding",
      "downstreamOwnerId": "own-07",
      "dueDate": "2026-06-16",
      "status": "delivered",
      "criticality": "medium",
      "delayProbability": 0.2,
      "potentialDelayDays": 8,
      "affectedMilestoneIds": [
        "ms-17"
      ],
      "affectedBenefitIds": [
        "ben-07"
      ],
      "predecessorIds": [
        "dep-39"
      ],
      "linkedRiskIds": []
    },
    {
      "id": "dep-41",
      "ref": "DEP-41",
      "name": "Tier 1 carrier contract counter-signature",
      "description": "Tier 1 carriers must provide tier 1 carrier contract counter-signature to Tier 1 onboarding by the due date for downstream work to proceed as planned.",
      "type": "external",
      "upstream": "Tier 1 carriers",
      "upstreamOwnerId": "own-07",
      "downstream": "Tier 1 onboarding",
      "downstreamOwnerId": "own-07",
      "dueDate": "2026-07-10",
      "status": "at-risk",
      "criticality": "high",
      "delayProbability": 0.45,
      "potentialDelayDays": 16,
      "affectedMilestoneIds": [
        "ms-17"
      ],
      "affectedBenefitIds": [
        "ben-02"
      ],
      "predecessorIds": [
        "dep-39"
      ],
      "linkedRiskIds": [
        "rsk-11"
      ]
    },
    {
      "id": "dep-42",
      "ref": "DEP-42",
      "name": "Tier 2 carrier tender award",
      "description": "Procurement must provide tier 2 carrier tender award to Tier 2 onboarding by the due date for downstream work to proceed as planned.",
      "type": "internal",
      "upstream": "Procurement",
      "upstreamOwnerId": "own-07",
      "downstream": "Tier 2 onboarding",
      "downstreamOwnerId": "own-07",
      "dueDate": "2026-08-17",
      "status": "on-track",
      "criticality": "medium",
      "delayProbability": 0.3,
      "potentialDelayDays": 14,
      "affectedMilestoneIds": [
        "ms-18"
      ],
      "affectedBenefitIds": [
        "ben-02"
      ],
      "predecessorIds": [
        "dep-41"
      ],
      "linkedRiskIds": []
    },
    {
      "id": "dep-43",
      "ref": "DEP-43",
      "name": "Customs broker system interface specification",
      "description": "Hanseatic Customs Services must provide customs broker system interface specification to Customs broker integration by the due date for downstream work to proceed as planned.",
      "type": "external",
      "upstream": "Hanseatic Customs Services",
      "upstreamOwnerId": "own-07",
      "downstream": "Customs broker integration",
      "downstreamOwnerId": "own-07",
      "dueDate": "2026-07-16",
      "status": "late",
      "criticality": "critical",
      "delayProbability": 0.85,
      "potentialDelayDays": 18,
      "affectedMilestoneIds": [
        "ms-19"
      ],
      "affectedBenefitIds": [
        "ben-07"
      ],
      "predecessorIds": [
        "dep-36"
      ],
      "linkedRiskIds": [
        "rsk-14"
      ]
    },
    {
      "id": "dep-44",
      "ref": "DEP-44",
      "name": "EU customs authority test account",
      "description": "National customs authorities must provide eu customs authority test account to Customs broker integration by the due date for downstream work to proceed as planned.",
      "type": "regulatory",
      "upstream": "National customs authorities",
      "upstreamOwnerId": "own-07",
      "downstream": "Customs broker integration",
      "downstreamOwnerId": "own-07",
      "dueDate": "2026-08-03",
      "status": "at-risk",
      "criticality": "high",
      "delayProbability": 0.5,
      "potentialDelayDays": 20,
      "affectedMilestoneIds": [
        "ms-19"
      ],
      "affectedBenefitIds": [
        "ben-07"
      ],
      "predecessorIds": [
        "dep-43"
      ],
      "linkedRiskIds": [
        "rsk-14",
        "rsk-15"
      ]
    },
    {
      "id": "dep-45",
      "ref": "DEP-45",
      "name": "Carrier performance data feed",
      "description": "Control Tower must provide carrier performance data feed to Carrier scorecard by the due date for downstream work to proceed as planned.",
      "type": "internal",
      "upstream": "Control Tower",
      "upstreamOwnerId": "own-09",
      "downstream": "Carrier scorecard",
      "downstreamOwnerId": "own-07",
      "dueDate": "2026-09-20",
      "status": "on-track",
      "criticality": "medium",
      "delayProbability": 0.3,
      "potentialDelayDays": 9,
      "affectedMilestoneIds": [
        "ms-20"
      ],
      "affectedBenefitIds": [
        "ben-02"
      ],
      "predecessorIds": [
        "dep-09"
      ],
      "linkedRiskIds": []
    },
    {
      "id": "dep-46",
      "ref": "DEP-46",
      "name": "Carrier onboarding portal enhancements",
      "description": "Group Digital must provide carrier onboarding portal enhancements to Tier 2 onboarding by the due date for downstream work to proceed as planned.",
      "type": "internal",
      "upstream": "Group Digital",
      "upstreamOwnerId": "own-07",
      "downstream": "Tier 2 onboarding",
      "downstreamOwnerId": "own-07",
      "dueDate": "2026-08-11",
      "status": "on-track",
      "criticality": "low",
      "delayProbability": 0.25,
      "potentialDelayDays": 7,
      "affectedMilestoneIds": [
        "ms-18"
      ],
      "affectedBenefitIds": [
        "ben-02"
      ],
      "predecessorIds": [
        "dep-40"
      ],
      "linkedRiskIds": []
    },
    {
      "id": "dep-47",
      "ref": "DEP-47",
      "name": "Automation contract award",
      "description": "Procurement must provide automation contract award to Warehouse Automation by the due date for downstream work to proceed as planned.",
      "type": "internal",
      "upstream": "Procurement",
      "upstreamOwnerId": "own-14",
      "downstream": "Warehouse Automation",
      "downstreamOwnerId": "own-08",
      "dueDate": "2026-01-05",
      "status": "delivered",
      "criticality": "critical",
      "delayProbability": 0.05,
      "potentialDelayDays": 15,
      "affectedMilestoneIds": [
        "ms-21"
      ],
      "affectedBenefitIds": [
        "ben-03"
      ],
      "predecessorIds": [
        "dep-16"
      ],
      "linkedRiskIds": []
    },
    {
      "id": "dep-48",
      "ref": "DEP-48",
      "name": "Milan floor slab load certification",
      "description": "Structural engineering consultancy must provide milan floor slab load certification to Milan automation install by the due date for downstream work to proceed as planned.",
      "type": "external",
      "upstream": "Structural engineering consultancy",
      "upstreamOwnerId": "own-04",
      "downstream": "Milan automation install",
      "downstreamOwnerId": "own-08",
      "dueDate": "2026-06-28",
      "status": "delivered",
      "criticality": "high",
      "delayProbability": 0.15,
      "potentialDelayDays": 12,
      "affectedMilestoneIds": [
        "ms-22"
      ],
      "affectedBenefitIds": [
        "ben-03"
      ],
      "predecessorIds": [
        "dep-18"
      ],
      "linkedRiskIds": []
    },
    {
      "id": "dep-49",
      "ref": "DEP-49",
      "name": "Automation control software release",
      "description": "Meridian Intralogistics must provide automation control software release to Automation commissioning by the due date for downstream work to proceed as planned.",
      "type": "vendor",
      "upstream": "Meridian Intralogistics",
      "upstreamOwnerId": "own-14",
      "downstream": "Automation commissioning",
      "downstreamOwnerId": "own-08",
      "dueDate": "2026-09-02",
      "status": "at-risk",
      "criticality": "critical",
      "delayProbability": 0.6,
      "potentialDelayDays": 15,
      "affectedMilestoneIds": [
        "ms-23"
      ],
      "affectedBenefitIds": [
        "ben-03"
      ],
      "predecessorIds": [
        "dep-11"
      ],
      "linkedRiskIds": [
        "rsk-33"
      ]
    },
    {
      "id": "dep-50",
      "ref": "DEP-50",
      "name": "WMS to automation interface build",
      "description": "Integration and Data Platform must provide wms to automation interface build to Automation commissioning by the due date for downstream work to proceed as planned.",
      "type": "internal",
      "upstream": "Integration and Data Platform",
      "upstreamOwnerId": "own-06",
      "downstream": "Automation commissioning",
      "downstreamOwnerId": "own-08",
      "dueDate": "2026-08-29",
      "status": "at-risk",
      "criticality": "critical",
      "delayProbability": 0.55,
      "potentialDelayDays": 13,
      "affectedMilestoneIds": [
        "ms-23"
      ],
      "affectedBenefitIds": [
        "ben-03"
      ],
      "predecessorIds": [
        "dep-31"
      ],
      "linkedRiskIds": [
        "rsk-03"
      ]
    },
    {
      "id": "dep-51",
      "ref": "DEP-51",
      "name": "Health and safety certification, Milan automation",
      "description": "Italian workplace safety authority must provide health and safety certification, milan automation to Warehouse go-live wave 1 by the due date for downstream work to proceed as planned.",
      "type": "regulatory",
      "upstream": "Italian workplace safety authority",
      "upstreamOwnerId": "own-08",
      "downstream": "Warehouse go-live wave 1",
      "downstreamOwnerId": "own-08",
      "dueDate": "2026-10-02",
      "status": "on-track",
      "criticality": "high",
      "delayProbability": 0.35,
      "potentialDelayDays": 18,
      "affectedMilestoneIds": [
        "ms-24"
      ],
      "affectedBenefitIds": [
        "ben-03",
        "ben-06"
      ],
      "predecessorIds": [
        "dep-14"
      ],
      "linkedRiskIds": []
    },
    {
      "id": "dep-52",
      "ref": "DEP-52",
      "name": "Frankfurt automation design freeze",
      "description": "Warehouse Automation must provide frankfurt automation design freeze to Network cutover wave 1 by the due date for downstream work to proceed as planned.",
      "type": "internal",
      "upstream": "Warehouse Automation",
      "upstreamOwnerId": "own-08",
      "downstream": "Network cutover wave 1",
      "downstreamOwnerId": "own-04",
      "dueDate": "2026-09-06",
      "status": "on-track",
      "criticality": "medium",
      "delayProbability": 0.3,
      "potentialDelayDays": 10,
      "affectedMilestoneIds": [
        "ms-05"
      ],
      "affectedBenefitIds": [
        "ben-01"
      ],
      "predecessorIds": [
        "dep-47"
      ],
      "linkedRiskIds": []
    },
    {
      "id": "dep-53",
      "ref": "DEP-53",
      "name": "Control tower cloud tenancy provisioned",
      "description": "Group Cloud Platform must provide control tower cloud tenancy provisioned to Control tower MVP by the due date for downstream work to proceed as planned.",
      "type": "internal",
      "upstream": "Group Cloud Platform",
      "upstreamOwnerId": "own-09",
      "downstream": "Control tower MVP",
      "downstreamOwnerId": "own-09",
      "dueDate": "2026-05-17",
      "status": "delivered",
      "criticality": "high",
      "delayProbability": 0.1,
      "potentialDelayDays": 8,
      "affectedMilestoneIds": [
        "ms-25"
      ],
      "affectedBenefitIds": [],
      "predecessorIds": [],
      "linkedRiskIds": []
    },
    {
      "id": "dep-54",
      "ref": "DEP-54",
      "name": "Visibility data sharing agreements with carriers",
      "description": "Tier 1 carriers must provide visibility data sharing agreements with carriers to Control tower MVP by the due date for downstream work to proceed as planned.",
      "type": "external",
      "upstream": "Tier 1 carriers",
      "upstreamOwnerId": "own-07",
      "downstream": "Control tower MVP",
      "downstreamOwnerId": "own-09",
      "dueDate": "2026-06-10",
      "status": "at-risk",
      "criticality": "high",
      "delayProbability": 0.4,
      "potentialDelayDays": 12,
      "affectedMilestoneIds": [
        "ms-25",
        "ms-28"
      ],
      "affectedBenefitIds": [
        "ben-08"
      ],
      "predecessorIds": [
        "dep-41"
      ],
      "linkedRiskIds": [
        "rsk-11"
      ]
    },
    {
      "id": "dep-55",
      "ref": "DEP-55",
      "name": "Reporting tool licences for run organisation",
      "description": "Lumen Analytics must provide reporting tool licences for run organisation to Reporting suite v1 by the due date for downstream work to proceed as planned.",
      "type": "vendor",
      "upstream": "Lumen Analytics",
      "upstreamOwnerId": "own-09",
      "downstream": "Reporting suite v1",
      "downstreamOwnerId": "own-09",
      "dueDate": "2026-07-28",
      "status": "on-track",
      "criticality": "medium",
      "delayProbability": 0.25,
      "potentialDelayDays": 7,
      "affectedMilestoneIds": [
        "ms-26"
      ],
      "affectedBenefitIds": [
        "ben-08"
      ],
      "predecessorIds": [],
      "linkedRiskIds": []
    },
    {
      "id": "dep-56",
      "ref": "DEP-56",
      "name": "Model risk review for predictive ETA",
      "description": "Group Model Risk must provide model risk review for predictive eta to Predictive ETA model by the due date for downstream work to proceed as planned.",
      "type": "internal",
      "upstream": "Group Model Risk",
      "upstreamOwnerId": "own-13",
      "downstream": "Predictive ETA model",
      "downstreamOwnerId": "own-09",
      "dueDate": "2026-09-16",
      "status": "on-track",
      "criticality": "medium",
      "delayProbability": 0.35,
      "potentialDelayDays": 14,
      "affectedMilestoneIds": [
        "ms-27"
      ],
      "affectedBenefitIds": [
        "ben-08"
      ],
      "predecessorIds": [
        "dep-38"
      ],
      "linkedRiskIds": []
    },
    {
      "id": "dep-57",
      "ref": "DEP-57",
      "name": "Control tower operating model sign-off",
      "description": "Operations leadership must provide control tower operating model sign-off to Control tower full rollout by the due date for downstream work to proceed as planned.",
      "type": "internal",
      "upstream": "Operations leadership",
      "upstreamOwnerId": "own-15",
      "downstream": "Control tower full rollout",
      "downstreamOwnerId": "own-09",
      "dueDate": "2026-10-04",
      "status": "on-track",
      "criticality": "high",
      "delayProbability": 0.3,
      "potentialDelayDays": 12,
      "affectedMilestoneIds": [
        "ms-28"
      ],
      "affectedBenefitIds": [
        "ben-08"
      ],
      "predecessorIds": [
        "dep-55"
      ],
      "linkedRiskIds": []
    },
    {
      "id": "dep-58",
      "ref": "DEP-58",
      "name": "Exception taxonomy agreed with operations",
      "description": "Hub operations managers must provide exception taxonomy agreed with operations to Reporting suite v1 by the due date for downstream work to proceed as planned.",
      "type": "internal",
      "upstream": "Hub operations managers",
      "upstreamOwnerId": "own-09",
      "downstream": "Reporting suite v1",
      "downstreamOwnerId": "own-09",
      "dueDate": "2026-07-12",
      "status": "delivered",
      "criticality": "medium",
      "delayProbability": 0.2,
      "potentialDelayDays": 8,
      "affectedMilestoneIds": [
        "ms-26"
      ],
      "affectedBenefitIds": [
        "ben-08"
      ],
      "predecessorIds": [],
      "linkedRiskIds": []
    },
    {
      "id": "dep-59",
      "ref": "DEP-59",
      "name": "Training environment refreshed with configured TMS",
      "description": "TMS Delivery must provide training environment refreshed with configured tms to Super-user training by the due date for downstream work to proceed as planned.",
      "type": "internal",
      "upstream": "TMS Delivery",
      "upstreamOwnerId": "own-05",
      "downstream": "Super-user training",
      "downstreamOwnerId": "own-10",
      "dueDate": "2026-08-01",
      "status": "at-risk",
      "criticality": "high",
      "delayProbability": 0.5,
      "potentialDelayDays": 11,
      "affectedMilestoneIds": [
        "ms-30"
      ],
      "affectedBenefitIds": [
        "ben-06"
      ],
      "predecessorIds": [
        "dep-25"
      ],
      "linkedRiskIds": [
        "rsk-17"
      ]
    },
    {
      "id": "dep-60",
      "ref": "DEP-60",
      "name": "Translated training material, six languages",
      "description": "Lingua Partners must provide translated training material, six languages to Super-user training by the due date for downstream work to proceed as planned.",
      "type": "vendor",
      "upstream": "Lingua Partners",
      "upstreamOwnerId": "own-10",
      "downstream": "Super-user training",
      "downstreamOwnerId": "own-10",
      "dueDate": "2026-08-07",
      "status": "on-track",
      "criticality": "medium",
      "delayProbability": 0.3,
      "potentialDelayDays": 9,
      "affectedMilestoneIds": [
        "ms-30"
      ],
      "affectedBenefitIds": [
        "ben-06"
      ],
      "predecessorIds": [],
      "linkedRiskIds": []
    },
    {
      "id": "dep-61",
      "ref": "DEP-61",
      "name": "Release of super-users from operational rosters",
      "description": "Hub operations managers must provide release of super-users from operational rosters to Super-user training by the due date for downstream work to proceed as planned.",
      "type": "internal",
      "upstream": "Hub operations managers",
      "upstreamOwnerId": "own-15",
      "downstream": "Super-user training",
      "downstreamOwnerId": "own-10",
      "dueDate": "2026-08-13",
      "status": "at-risk",
      "criticality": "high",
      "delayProbability": 0.55,
      "potentialDelayDays": 13,
      "affectedMilestoneIds": [
        "ms-30"
      ],
      "affectedBenefitIds": [
        "ben-06"
      ],
      "predecessorIds": [
        "dep-60"
      ],
      "linkedRiskIds": [
        "rsk-17"
      ]
    },
    {
      "id": "dep-62",
      "ref": "DEP-62",
      "name": "Works council agreement on new roles",
      "description": "European works council must provide works council agreement on new roles to Go-live readiness review by the due date for downstream work to proceed as planned.",
      "type": "regulatory",
      "upstream": "European works council",
      "upstreamOwnerId": "own-10",
      "downstream": "Go-live readiness review",
      "downstreamOwnerId": "own-15",
      "dueDate": "2026-09-02",
      "status": "at-risk",
      "criticality": "critical",
      "delayProbability": 0.5,
      "potentialDelayDays": 24,
      "affectedMilestoneIds": [
        "ms-31"
      ],
      "affectedBenefitIds": [
        "ben-03",
        "ben-06"
      ],
      "predecessorIds": [
        "dep-20"
      ],
      "linkedRiskIds": [
        "rsk-20"
      ]
    },
    {
      "id": "dep-63",
      "ref": "DEP-63",
      "name": "Cutover rehearsal window agreed with operations",
      "description": "Regional operations must provide cutover rehearsal window agreed with operations to Go-live readiness review by the due date for downstream work to proceed as planned.",
      "type": "internal",
      "upstream": "Regional operations",
      "upstreamOwnerId": "own-15",
      "downstream": "Go-live readiness review",
      "downstreamOwnerId": "own-15",
      "dueDate": "2026-09-20",
      "status": "on-track",
      "criticality": "high",
      "delayProbability": 0.35,
      "potentialDelayDays": 10,
      "affectedMilestoneIds": [
        "ms-31"
      ],
      "affectedBenefitIds": [
        "ben-04"
      ],
      "predecessorIds": [
        "dep-61"
      ],
      "linkedRiskIds": []
    },
    {
      "id": "dep-64",
      "ref": "DEP-64",
      "name": "Run organisation resourcing approved",
      "description": "Operations leadership must provide run organisation resourcing approved to Benefit handover by the due date for downstream work to proceed as planned.",
      "type": "internal",
      "upstream": "Operations leadership",
      "upstreamOwnerId": "own-01",
      "downstream": "Benefit handover",
      "downstreamOwnerId": "own-11",
      "dueDate": "2026-10-10",
      "status": "on-track",
      "criticality": "high",
      "delayProbability": 0.3,
      "potentialDelayDays": 15,
      "affectedMilestoneIds": [
        "ms-32"
      ],
      "affectedBenefitIds": [
        "ben-01",
        "ben-08"
      ],
      "predecessorIds": [
        "dep-57"
      ],
      "linkedRiskIds": []
    },
    {
      "id": "dep-65",
      "ref": "DEP-65",
      "name": "Benefit measurement baseline agreed with finance",
      "description": "Group Finance must provide benefit measurement baseline agreed with finance to Benefit handover by the due date for downstream work to proceed as planned.",
      "type": "internal",
      "upstream": "Group Finance",
      "upstreamOwnerId": "own-11",
      "downstream": "Benefit handover",
      "downstreamOwnerId": "own-11",
      "dueDate": "2026-10-06",
      "status": "at-risk",
      "criticality": "high",
      "delayProbability": 0.4,
      "potentialDelayDays": 12,
      "affectedMilestoneIds": [
        "ms-32"
      ],
      "affectedBenefitIds": [
        "ben-01",
        "ben-05"
      ],
      "predecessorIds": [
        "dep-10"
      ],
      "linkedRiskIds": [
        "rsk-27"
      ]
    },
    {
      "id": "dep-66",
      "ref": "DEP-66",
      "name": "Cross-programme alignment with Commerce Replatform",
      "description": "Commerce Replatform programme must provide cross-programme alignment with commerce replatform to Customer launch by the due date for downstream work to proceed as planned.",
      "type": "cross-program",
      "upstream": "Commerce Replatform programme",
      "upstreamOwnerId": "own-02",
      "downstream": "Customer launch",
      "downstreamOwnerId": "own-01",
      "dueDate": "2026-10-12",
      "status": "at-risk",
      "criticality": "high",
      "delayProbability": 0.45,
      "potentialDelayDays": 20,
      "affectedMilestoneIds": [
        "ms-32"
      ],
      "affectedBenefitIds": [
        "ben-04",
        "ben-08"
      ],
      "predecessorIds": [],
      "linkedRiskIds": [
        "rsk-24"
      ]
    },
    {
      "id": "dep-67",
      "ref": "DEP-67",
      "name": "Cross-programme alignment with Finance Consolidation",
      "description": "Finance Consolidation programme must provide cross-programme alignment with finance consolidation to Reporting suite v1 by the due date for downstream work to proceed as planned.",
      "type": "cross-program",
      "upstream": "Finance Consolidation programme",
      "upstreamOwnerId": "own-11",
      "downstream": "Reporting suite v1",
      "downstreamOwnerId": "own-09",
      "dueDate": "2026-08-15",
      "status": "at-risk",
      "criticality": "medium",
      "delayProbability": 0.4,
      "potentialDelayDays": 16,
      "affectedMilestoneIds": [
        "ms-26"
      ],
      "affectedBenefitIds": [
        "ben-05"
      ],
      "predecessorIds": [],
      "linkedRiskIds": [
        "rsk-27"
      ]
    }
  ],
  "changes": [
    {
      "id": "chg-01",
      "ref": "CHG-01",
      "title": "Add Slovenia to cutover wave 1",
      "description": "Extend the first physical cutover wave to include Slovenian domestic and cross-border flows.",
      "requesterId": "own-04",
      "reason": "Commercial pressure to consolidate Adriatic flows a quarter earlier than planned.",
      "raisedDate": "2026-05-27",
      "scopeImpact": "Wave 1 grows from two countries to three, adding 640 lanes.",
      "costImpact": 185000,
      "scheduleImpactDays": 9,
      "resourceImpact": "Two additional network analysts for eleven weeks.",
      "riskImpact": "Increases cutover concentration risk on a single weekend.",
      "benefitImpact": 240000,
      "affectedWorkstreamIds": [
        "ws-net",
        "ws-car"
      ],
      "affectedMilestoneIds": [
        "ms-05",
        "ms-18"
      ],
      "affectedDependencyIds": [
        "dep-20"
      ],
      "affectedBenefitIds": [
        "ben-01"
      ],
      "linkedRiskIds": [
        "rsk-29"
      ],
      "decision": "approved",
      "status": "implemented",
      "decisionMakerId": "own-01",
      "decisionDate": "2026-06-12",
      "decisionRationale": "Accepted because the incremental freight saving of 240k exceeds the delivery cost, and the additional cutover risk is contained by the existing rehearsal control."
    },
    {
      "id": "chg-02",
      "ref": "CHG-02",
      "title": "Defer Frankfurt automation to a phase 2 investment",
      "description": "Remove the Frankfurt automation scope from the programme and re-plan it as a separate phase 2 investment.",
      "requesterId": "own-08",
      "reason": "Capital constraint after the Milan cost position and the supplier capacity shortfall.",
      "raisedDate": "2026-06-20",
      "scopeImpact": "Removes Frankfurt goods-to-person automation from programme scope.",
      "costImpact": -640000,
      "scheduleImpactDays": 0,
      "resourceImpact": "Releases four automation engineers from month eleven.",
      "riskImpact": "Removes Frankfurt automation delivery risk but concentrates the whole automation benefit on Milan.",
      "benefitImpact": -480000,
      "affectedWorkstreamIds": [
        "ws-wms",
        "ws-net"
      ],
      "affectedMilestoneIds": [
        "ms-05"
      ],
      "affectedDependencyIds": [
        "dep-52"
      ],
      "affectedBenefitIds": [
        "ben-01"
      ],
      "linkedRiskIds": [
        "rsk-06"
      ],
      "decision": "approved",
      "status": "implemented",
      "decisionMakerId": "own-01",
      "decisionDate": "2026-07-04",
      "decisionRationale": "Approved on capital grounds. Accepted that 480k of benefit moves to phase 2 and that Milan now carries the whole automation benefit case, which raises the consequence of the supplier risk."
    },
    {
      "id": "chg-03",
      "ref": "CHG-03",
      "title": "Extend hypercare from four to eight weeks",
      "description": "Extend vendor and internal hypercare cover to eight weeks to match the revised two-wave cutover.",
      "requesterId": "own-05",
      "reason": "The two-wave go-live extends the period during which both platforms operate.",
      "raisedDate": "2026-07-16",
      "scopeImpact": "No functional scope change, extends the support period.",
      "costImpact": 148000,
      "scheduleImpactDays": 0,
      "resourceImpact": "Vendor hypercare team retained four weeks longer.",
      "riskImpact": "Reduces post cutover operational and customer impact risk.",
      "benefitImpact": 0,
      "affectedWorkstreamIds": [
        "ws-tms"
      ],
      "affectedMilestoneIds": [
        "ms-10",
        "ms-31"
      ],
      "affectedDependencyIds": [
        "dep-29"
      ],
      "affectedBenefitIds": [],
      "linkedRiskIds": [
        "rsk-25",
        "rsk-18"
      ],
      "decision": "approved",
      "status": "implemented",
      "decisionMakerId": "own-02",
      "decisionDate": "2026-07-28",
      "decisionRationale": "Approved within delegated authority. The cost is small relative to the customer impact exposure it reduces, and the two-wave plan made the original four week window untenable."
    },
    {
      "id": "chg-04",
      "ref": "CHG-04",
      "title": "Add two integration engineers to the carrier API workstream",
      "description": "Fund two additional integration engineers to build and test the interim invoice message adapter.",
      "requesterId": "own-06",
      "reason": "The vendor specification gap requires an in-house adapter that was not in the original plan.",
      "raisedDate": "2026-07-04",
      "scopeImpact": "Adds the invoice message adapter as an in-scope deliverable.",
      "costImpact": 172000,
      "scheduleImpactDays": -6,
      "resourceImpact": "Two contract integration engineers for five months.",
      "riskImpact": "Reduces dependence on the vendor schema for go-live.",
      "benefitImpact": 0,
      "affectedWorkstreamIds": [
        "ws-int"
      ],
      "affectedMilestoneIds": [
        "ms-13",
        "ms-14"
      ],
      "affectedDependencyIds": [
        "dep-01"
      ],
      "affectedBenefitIds": [
        "ben-04"
      ],
      "linkedRiskIds": [
        "rsk-01",
        "rsk-03"
      ],
      "decision": "approved",
      "status": "implemented",
      "decisionMakerId": "own-01",
      "decisionDate": "2026-07-14",
      "decisionRationale": "Approved because it converts a vendor dependency the programme cannot control into internal work it can. The six day schedule recovery was the deciding factor."
    },
    {
      "id": "chg-05",
      "ref": "CHG-05",
      "title": "Reduce reporting suite v1 to twelve core reports",
      "description": "Cut reporting suite v1 to the twelve reports that reconcile cleanly today, deferring the remainder until master data remediation completes.",
      "requesterId": "own-09",
      "reason": "Data quality remediation will not complete in time to support the full reporting set, so the choice is scope or date.",
      "raisedDate": "2026-08-17",
      "scopeImpact": "Removes 19 of 31 reports from v1 and moves them to a v1.1 release.",
      "costImpact": -85000,
      "scheduleImpactDays": -16,
      "resourceImpact": "No change to the team, the same team delivers less in the same window.",
      "riskImpact": "Reduces the risk that reporting is rejected at acceptance, but leaves the run organisation without nine benefit reports at handover.",
      "benefitImpact": -260000,
      "affectedWorkstreamIds": [
        "ws-ctl",
        "ws-chg"
      ],
      "affectedMilestoneIds": [
        "ms-26",
        "ms-20",
        "ms-32"
      ],
      "affectedDependencyIds": [
        "dep-09",
        "dep-10"
      ],
      "affectedBenefitIds": [
        "ben-04",
        "ben-08"
      ],
      "linkedRiskIds": [
        "rsk-04",
        "rsk-09",
        "rsk-27"
      ],
      "decision": "pending",
      "status": "in-review"
    },
    {
      "id": "chg-06",
      "ref": "CHG-06",
      "title": "Replace the in-house customs interface with a broker managed service",
      "description": "Buy the broker managed customs service instead of building the declaration interface in house.",
      "requesterId": "own-07",
      "reason": "The broker has not released an interface specification and has offered a managed service instead.",
      "raisedDate": "2026-08-11",
      "scopeImpact": "Removes the customs interface build, adds a managed service integration and an annual service fee.",
      "costImpact": 265000,
      "scheduleImpactDays": -12,
      "resourceImpact": "Releases one integration engineer, adds a vendor management overhead.",
      "riskImpact": "Removes the certification risk but creates a long-term third party operational dependency.",
      "benefitImpact": -60000,
      "affectedWorkstreamIds": [
        "ws-car",
        "ws-int"
      ],
      "affectedMilestoneIds": [
        "ms-19",
        "ms-05"
      ],
      "affectedDependencyIds": [
        "dep-43",
        "dep-44"
      ],
      "affectedBenefitIds": [
        "ben-07"
      ],
      "linkedRiskIds": [
        "rsk-14",
        "rsk-15"
      ],
      "decision": "escalated",
      "status": "in-review"
    },
    {
      "id": "chg-07",
      "ref": "CHG-07",
      "title": "Open Milan with two pick stations instead of three",
      "description": "Commission the Milan hub with two of the three planned pick stations and install the third in a later phase.",
      "requesterId": "own-08",
      "reason": "The supplier capacity shortfall makes three pick stations undeliverable for wave 1.",
      "raisedDate": "2026-08-23",
      "scopeImpact": "Reduces day one automation capacity by roughly one third.",
      "costImpact": -210000,
      "scheduleImpactDays": -14,
      "resourceImpact": "No change during delivery, adds a later installation phase.",
      "riskImpact": "Reduces the schedule risk on commissioning but caps early throughput.",
      "benefitImpact": -420000,
      "affectedWorkstreamIds": [
        "ws-wms"
      ],
      "affectedMilestoneIds": [
        "ms-22",
        "ms-23",
        "ms-24"
      ],
      "affectedDependencyIds": [
        "dep-11",
        "dep-13"
      ],
      "affectedBenefitIds": [
        "ben-03"
      ],
      "linkedRiskIds": [
        "rsk-06",
        "rsk-08"
      ],
      "decision": "pending",
      "status": "in-review"
    },
    {
      "id": "chg-08",
      "ref": "CHG-08",
      "title": "Add an early penetration test cycle",
      "description": "Split penetration testing into an early exploratory cycle and a late confirmatory cycle.",
      "requesterId": "own-13",
      "reason": "A single end-stage security gate leaves no time to remediate a critical finding.",
      "raisedDate": "2026-07-20",
      "scopeImpact": "Adds one additional test cycle on completed integration patterns.",
      "costImpact": 62000,
      "scheduleImpactDays": 0,
      "resourceImpact": "External test vendor for two additional weeks.",
      "riskImpact": "Materially reduces the chance that a critical finding is discovered inside the cutover window.",
      "benefitImpact": 0,
      "affectedWorkstreamIds": [
        "ws-int"
      ],
      "affectedMilestoneIds": [
        "ms-14"
      ],
      "affectedDependencyIds": [
        "dep-04"
      ],
      "affectedBenefitIds": [],
      "linkedRiskIds": [
        "rsk-02",
        "rsk-28"
      ],
      "decision": "approved",
      "status": "implemented",
      "decisionMakerId": "own-02",
      "decisionDate": "2026-07-30",
      "decisionRationale": "Approved within delegated authority. Cheap relative to the consequence of failing the security gate at cutover."
    },
    {
      "id": "chg-09",
      "ref": "CHG-09",
      "title": "Extend customs compliance training to tier 2 carriers",
      "description": "Include tier 2 carriers in the customs compliance training curriculum.",
      "requesterId": "own-07",
      "reason": "Tier 2 carriers handle 31% of cross-border volume but were excluded from the training scope.",
      "raisedDate": "2026-08-05",
      "scopeImpact": "Adds 22 carriers to the compliance training programme.",
      "costImpact": 74000,
      "scheduleImpactDays": 0,
      "resourceImpact": "One compliance trainer for eight weeks.",
      "riskImpact": "Reduces customs correction and penalty exposure across the tier 2 base.",
      "benefitImpact": 130000,
      "affectedWorkstreamIds": [
        "ws-car",
        "ws-chg"
      ],
      "affectedMilestoneIds": [
        "ms-18"
      ],
      "affectedDependencyIds": [
        "dep-46"
      ],
      "affectedBenefitIds": [
        "ben-07"
      ],
      "linkedRiskIds": [
        "rsk-14"
      ],
      "decision": "deferred",
      "status": "decided",
      "decisionMakerId": "own-02",
      "decisionDate": "2026-08-25",
      "decisionRationale": "Deferred to the phase 2 backlog. The benefit is credible but the compliance team cannot absorb it before go-live without displacing tier 1 readiness work."
    },
    {
      "id": "chg-10",
      "ref": "CHG-10",
      "title": "Move network cutover wave 1 by three weeks",
      "description": "Move the wave 1 physical cutover three weeks later to separate it from automation commissioning and the works council outcome.",
      "requesterId": "own-04",
      "reason": "Automation commissioning and works council consultation both land inside the current cutover window.",
      "raisedDate": "2026-08-27",
      "scopeImpact": "No scope change, moves the wave 1 cutover date and the dependent readiness gate.",
      "costImpact": 96000,
      "scheduleImpactDays": 21,
      "resourceImpact": "Extends the programme team by three weeks.",
      "riskImpact": "Reduces cutover concentration and readiness risk, increases cost and delays benefit start.",
      "benefitImpact": -310000,
      "affectedWorkstreamIds": [
        "ws-net",
        "ws-wms",
        "ws-chg"
      ],
      "affectedMilestoneIds": [
        "ms-05",
        "ms-31",
        "ms-32"
      ],
      "affectedDependencyIds": [
        "dep-20",
        "dep-62"
      ],
      "affectedBenefitIds": [
        "ben-01",
        "ben-05"
      ],
      "linkedRiskIds": [
        "rsk-06",
        "rsk-20",
        "rsk-29"
      ],
      "decision": "escalated",
      "status": "in-review"
    },
    {
      "id": "chg-11",
      "ref": "CHG-11",
      "title": "Split the TMS go-live into two waves",
      "description": "Deliver the TMS cutover in two waves rather than a single all-lanes go-live.",
      "requesterId": "own-05",
      "reason": "A single go-live across all lanes concentrates too much risk in one weekend given the UAT position.",
      "raisedDate": "2026-06-24",
      "scopeImpact": "Splits the cutover into wave 1 and wave 2 with a six week interval.",
      "costImpact": 128000,
      "scheduleImpactDays": 12,
      "resourceImpact": "Extends the delivery and hypercare teams by six weeks.",
      "riskImpact": "Substantially reduces cutover and rollback risk, adds a period of dual running.",
      "benefitImpact": -140000,
      "affectedWorkstreamIds": [
        "ws-tms",
        "ws-int"
      ],
      "affectedMilestoneIds": [
        "ms-10",
        "ms-31"
      ],
      "affectedDependencyIds": [
        "dep-05",
        "dep-29"
      ],
      "affectedBenefitIds": [
        "ben-04",
        "ben-09"
      ],
      "linkedRiskIds": [
        "rsk-18",
        "rsk-13",
        "rsk-21"
      ],
      "decision": "approved",
      "status": "implemented",
      "decisionMakerId": "own-01",
      "decisionDate": "2026-07-10",
      "decisionRationale": "Approved. The reduction in cutover risk was judged to outweigh 128k of cost and a twelve day delay to full benefit start, on the basis that a failed single cutover would cost materially more."
    },
    {
      "id": "chg-12",
      "ref": "CHG-12",
      "title": "Retain the legacy transport system in parallel for six months",
      "description": "Keep the legacy transport platform live in parallel for six months after wave 2 as a fallback.",
      "requesterId": "own-05",
      "reason": "Concern that a two-wave go-live leaves part of the estate exposed if the new platform underperforms.",
      "raisedDate": "2026-08-01",
      "scopeImpact": "Adds six months of legacy licence, hosting and support.",
      "costImpact": 310000,
      "scheduleImpactDays": 0,
      "resourceImpact": "Retains two legacy support staff for six months.",
      "riskImpact": "Would remove the fallback risk but at material cost, and it defers the decommission benefit.",
      "benefitImpact": -600000,
      "affectedWorkstreamIds": [
        "ws-tms"
      ],
      "affectedMilestoneIds": [
        "ms-28"
      ],
      "affectedDependencyIds": [
        "dep-30"
      ],
      "affectedBenefitIds": [
        "ben-09"
      ],
      "linkedRiskIds": [
        "rsk-21"
      ],
      "decision": "rejected",
      "status": "decided",
      "decisionMakerId": "own-01",
      "decisionDate": "2026-08-15",
      "decisionRationale": "Rejected. Six months of parallel running costs 310k and defers the entire 600k decommission benefit, while the fallback it buys is already covered by the two-wave plan and extended hypercare."
    },
    {
      "id": "chg-13",
      "ref": "CHG-13",
      "title": "Add three data quality contractors for three months",
      "description": "Fund three additional data quality contractors to accelerate the master data remediation backlog.",
      "requesterId": "own-12",
      "reason": "Defect arrival rate exceeds the clearance rate of the existing team.",
      "raisedDate": "2026-07-28",
      "scopeImpact": "No scope change, adds temporary remediation capacity.",
      "costImpact": 118000,
      "scheduleImpactDays": -8,
      "resourceImpact": "Three contractors for thirteen weeks.",
      "riskImpact": "Increases the chance of hitting the remediation exit threshold before the reporting gate.",
      "benefitImpact": 0,
      "affectedWorkstreamIds": [
        "ws-int"
      ],
      "affectedMilestoneIds": [
        "ms-15",
        "ms-26"
      ],
      "affectedDependencyIds": [
        "dep-07"
      ],
      "affectedBenefitIds": [
        "ben-05"
      ],
      "linkedRiskIds": [
        "rsk-04"
      ],
      "decision": "approved",
      "status": "implemented",
      "decisionMakerId": "own-02",
      "decisionDate": "2026-08-07",
      "decisionRationale": "Approved within delegated authority. Cheapest available lever against the largest single driver of the reporting and benefit measurement risk."
    }
  ],
  "decisions": [
    {
      "id": "dec-01",
      "ref": "DEC-01",
      "title": "Approve the seven-hub target network",
      "context": "The network study produced three viable options: keep eleven sites, consolidate to nine, or consolidate to seven with two new automated hubs.",
      "ownerId": "own-04",
      "decisionMakerId": "own-01",
      "forum": "Investment Committee",
      "dateRequired": "2025-11-28",
      "status": "decided",
      "options": [
        {
          "id": "dec-01-opt-1",
          "label": "Retain eleven sites",
          "pros": [
            "No transition risk",
            "No capital required"
          ],
          "cons": [
            "Forgoes the entire freight saving",
            "Leaves the cost base uncompetitive"
          ],
          "estimatedCost": 0,
          "estimatedScheduleDays": 0,
          "residualRiskNote": "Freight cost gap persists at 412 per load."
        },
        {
          "id": "dec-01-opt-2",
          "label": "Consolidate to nine sites",
          "pros": [
            "Lower transition risk",
            "Roughly half the capital"
          ],
          "cons": [
            "Only 55% of the available saving",
            "Two hubs remain sub-scale"
          ],
          "estimatedCost": 4100000,
          "estimatedScheduleDays": 300,
          "residualRiskNote": "Residual sub-scale hub risk on two sites."
        },
        {
          "id": "dec-01-opt-3",
          "label": "Consolidate to seven with automation",
          "pros": [
            "Full 3.6M freight saving",
            "Enables the automation productivity benefit"
          ],
          "cons": [
            "Highest capital and transition risk",
            "Two new sites to commission"
          ],
          "estimatedCost": 8400000,
          "estimatedScheduleDays": 425,
          "residualRiskNote": "Concentration of benefit on two new hubs."
        }
      ],
      "evidence": [
        {
          "id": "dec-01-ev-1",
          "label": "Network scenario model v4",
          "kind": "document",
          "date": "2025-10-15",
          "source": "Network Design",
          "confidence": "verified"
        },
        {
          "id": "dec-01-ev-2",
          "label": "Cost-to-serve baseline reconciliation",
          "kind": "metric",
          "date": "2025-10-13",
          "source": "Group Finance",
          "confidence": "verified"
        }
      ],
      "expectedOutcome": "Freight cost per load reduced from 412 to 318 within twelve months of the final cutover.",
      "linkedRiskIds": [
        "rsk-29",
        "rsk-30"
      ],
      "linkedChangeIds": [
        "chg-01",
        "chg-02"
      ],
      "linkedBenefitIds": [
        "ben-01"
      ],
      "linkedMilestoneIds": [
        "ms-02",
        "ms-05"
      ],
      "dateDecided": "2025-12-06",
      "reviewDate": "2026-04-29",
      "chosenOptionId": "dec-01-opt-3",
      "rationale": "Chose the seven-hub option because it is the only option that closes the cost-to-serve gap, and the incremental transition risk is manageable with staged cutover waves.",
      "actualOutcome": "Network model validated at 8% peak headroom and the first 1.18M of freight saving has been realised. The automation dependency has proved more fragile than assumed at the time.",
      "outcomeScore": 4
    },
    {
      "id": "dec-02",
      "ref": "DEC-02",
      "title": "Sequence security testing in parallel with UAT rather than after it",
      "context": "The assurance model places penetration testing as a single gate after integration completes, which leaves no remediation window before cutover.",
      "ownerId": "own-13",
      "decisionMakerId": "own-02",
      "forum": "Programme Board",
      "dateRequired": "2026-07-14",
      "status": "decided",
      "options": [
        {
          "id": "dec-02-opt-1",
          "label": "Keep the single end-stage gate",
          "pros": [
            "No additional cost",
            "Simplest to manage"
          ],
          "cons": [
            "A critical finding cannot be remediated in time",
            "Assurance failure would stop the gate"
          ],
          "estimatedCost": 0,
          "estimatedScheduleDays": 0,
          "residualRiskNote": "Full residual security gate risk retained."
        },
        {
          "id": "dec-02-opt-2",
          "label": "Add an early exploratory cycle",
          "pros": [
            "Findings surface while there is time to fix",
            "Confirmatory cycle stays as the gate"
          ],
          "cons": [
            "62k additional test cost",
            "Requires patterns to be complete early"
          ],
          "estimatedCost": 62000,
          "estimatedScheduleDays": 0,
          "residualRiskNote": "Residual risk limited to findings in late-built patterns."
        }
      ],
      "evidence": [
        {
          "id": "dec-02-ev-1",
          "label": "Threat model register",
          "kind": "document",
          "date": "2026-08-08",
          "source": "Security Architecture",
          "confidence": "measured"
        },
        {
          "id": "dec-02-ev-2",
          "label": "Assurance model review note",
          "kind": "document",
          "date": "2026-07-18",
          "source": "Security and Compliance",
          "confidence": "measured"
        }
      ],
      "expectedOutcome": "Critical security findings identified at least eight weeks before the go-live gate.",
      "linkedRiskIds": [
        "rsk-02",
        "rsk-28"
      ],
      "linkedChangeIds": [
        "chg-08"
      ],
      "linkedBenefitIds": [
        "ben-04"
      ],
      "linkedMilestoneIds": [
        "ms-14"
      ],
      "dateDecided": "2026-07-30",
      "reviewDate": "2026-10-06",
      "chosenOptionId": "dec-02-opt-2",
      "rationale": "Chose the two-cycle model. The cost is immaterial against the consequence of failing the security gate inside the cutover window, and it converts an unmanageable late risk into a manageable early one."
    },
    {
      "id": "dec-03",
      "ref": "DEC-03",
      "title": "Reduce reporting suite scope or delay the reporting gate",
      "context": "Master data remediation will not reach the exit threshold before the reporting gate, so nineteen of thirty-one reports cannot reconcile. The programme must either cut scope or move the date, and both affect benefit handover.",
      "ownerId": "own-09",
      "decisionMakerId": "own-01",
      "forum": "Steering Committee",
      "dateRequired": "2026-09-10",
      "status": "required",
      "options": [
        {
          "id": "dec-03-opt-1",
          "label": "Cut v1 to twelve reconciling reports",
          "pros": [
            "Holds the gate date",
            "Nothing is shipped that cannot be trusted"
          ],
          "cons": [
            "Run organisation lacks nine benefit reports at handover",
            "260k of benefit measurement deferred"
          ],
          "estimatedCost": -85000,
          "estimatedScheduleDays": -16,
          "residualRiskNote": "Benefit measurement risk rises because the baseline cannot be evidenced."
        },
        {
          "id": "dec-03-opt-2",
          "label": "Delay the reporting gate by six weeks",
          "pros": [
            "Full scope delivered",
            "Benefit measurement intact"
          ],
          "cons": [
            "Delays benefit handover and the readiness gate",
            "Extends programme team cost"
          ],
          "estimatedCost": 96000,
          "estimatedScheduleDays": 42,
          "residualRiskNote": "Schedule risk transfers onto the readiness gate."
        },
        {
          "id": "dec-03-opt-3",
          "label": "Ship full scope with a known variance",
          "pros": [
            "No schedule or scope change"
          ],
          "cons": [
            "Reporting would be rejected by finance",
            "Destroys confidence in programme numbers"
          ],
          "estimatedCost": 0,
          "estimatedScheduleDays": 0,
          "residualRiskNote": "Unacceptable: the acceptance criteria would not be met."
        }
      ],
      "evidence": [
        {
          "id": "dec-03-ev-1",
          "label": "Period 11 reconciliation pack",
          "kind": "metric",
          "date": "2026-08-17",
          "source": "Group Finance",
          "confidence": "verified"
        },
        {
          "id": "dec-03-ev-2",
          "label": "Master data defect trend",
          "kind": "metric",
          "date": "2026-09-07",
          "source": "Data Quality",
          "confidence": "verified"
        },
        {
          "id": "dec-03-ev-3",
          "label": "Metric dictionary status",
          "kind": "document",
          "date": "2026-08-11",
          "source": "Finance Business Partner",
          "confidence": "measured"
        }
      ],
      "expectedOutcome": "A reporting gate that finance accepts, with a documented plan for the deferred reports.",
      "linkedRiskIds": [
        "rsk-04",
        "rsk-09",
        "rsk-27"
      ],
      "linkedChangeIds": [
        "chg-05"
      ],
      "linkedBenefitIds": [
        "ben-08",
        "ben-04"
      ],
      "linkedMilestoneIds": [
        "ms-26",
        "ms-32"
      ]
    },
    {
      "id": "dec-04",
      "ref": "DEC-04",
      "title": "Split the TMS go-live into two waves",
      "context": "The UAT defect position and the rollback rehearsal result both indicate that a single all-lanes cutover carries more risk than the programme can absorb in one weekend.",
      "ownerId": "own-05",
      "decisionMakerId": "own-01",
      "forum": "Programme Board",
      "dateRequired": "2026-06-28",
      "status": "decided",
      "options": [
        {
          "id": "dec-04-opt-1",
          "label": "Single all-lanes cutover",
          "pros": [
            "Fastest route to full benefit",
            "One hypercare period"
          ],
          "cons": [
            "Concentrates all cutover risk in one weekend",
            "Rollback proven only at five hours ten minutes"
          ],
          "estimatedCost": 0,
          "estimatedScheduleDays": 0,
          "residualRiskNote": "Full cutover and rollback risk retained."
        },
        {
          "id": "dec-04-opt-2",
          "label": "Two waves six weeks apart",
          "pros": [
            "Halves the exposed volume per cutover",
            "Learning applied to wave 2"
          ],
          "cons": [
            "128k additional cost",
            "Twelve day delay to full benefit",
            "A period of dual running"
          ],
          "estimatedCost": 128000,
          "estimatedScheduleDays": 12,
          "residualRiskNote": "Residual risk concentrated on wave 1 only."
        }
      ],
      "evidence": [
        {
          "id": "dec-04-ev-1",
          "label": "Cutover rehearsal 1 report",
          "kind": "test-result",
          "date": "2026-08-21",
          "source": "TMS Delivery",
          "confidence": "verified"
        },
        {
          "id": "dec-04-ev-2",
          "label": "UAT defect burn-down",
          "kind": "metric",
          "date": "2026-09-07",
          "source": "TMS Delivery",
          "confidence": "verified"
        }
      ],
      "expectedOutcome": "Wave 1 cutover completed without a customer-visible service failure.",
      "linkedRiskIds": [
        "rsk-18",
        "rsk-13",
        "rsk-21"
      ],
      "linkedChangeIds": [
        "chg-11",
        "chg-03"
      ],
      "linkedBenefitIds": [
        "ben-04",
        "ben-09"
      ],
      "linkedMilestoneIds": [
        "ms-10",
        "ms-31"
      ],
      "dateDecided": "2026-07-10",
      "reviewDate": "2026-10-02",
      "chosenOptionId": "dec-04-opt-2",
      "rationale": "Chose two waves. A failed single cutover would cost materially more than 128k in customer credits and premium freight, and the rehearsal evidence did not support a single-shot approach."
    },
    {
      "id": "dec-05",
      "ref": "DEC-05",
      "title": "Build the customs interface or buy the broker managed service",
      "context": "The broker will not release an interface specification and has offered a managed service. Building without a specification is not possible, so the choice is to buy, to change broker, or to run manual declarations.",
      "ownerId": "own-07",
      "decisionMakerId": "own-01",
      "forum": "Steering Committee",
      "dateRequired": "2026-09-12",
      "status": "required",
      "options": [
        {
          "id": "dec-05-opt-1",
          "label": "Buy the broker managed service",
          "pros": [
            "Removes the certification risk",
            "Twelve days faster"
          ],
          "cons": [
            "265k cost and an ongoing service fee",
            "Creates a long-term third party dependency"
          ],
          "estimatedCost": 265000,
          "estimatedScheduleDays": -12,
          "residualRiskNote": "Certification risk removed, operational dependency created."
        },
        {
          "id": "dec-05-opt-2",
          "label": "Change customs broker",
          "pros": [
            "Regains control of the interface"
          ],
          "cons": [
            "Re-tender takes at least sixteen weeks",
            "Would miss the wave 1 cross-border cutover"
          ],
          "estimatedCost": 180000,
          "estimatedScheduleDays": 60,
          "residualRiskNote": "Schedule risk becomes unacceptable."
        },
        {
          "id": "dec-05-opt-3",
          "label": "Run manual declarations for wave 1",
          "pros": [
            "No capital cost",
            "No new dependency"
          ],
          "cons": [
            "Penalty and delay exposure on every cross-border load",
            "Erodes the compliance benefit"
          ],
          "estimatedCost": 40000,
          "estimatedScheduleDays": 0,
          "residualRiskNote": "Customs penalty exposure retained in full."
        }
      ],
      "evidence": [
        {
          "id": "dec-05-ev-1",
          "label": "Broker correspondence log",
          "kind": "document",
          "date": "2026-07-26",
          "source": "Carrier Compliance",
          "confidence": "verified"
        },
        {
          "id": "dec-05-ev-2",
          "label": "Manual declaration cost estimate",
          "kind": "metric",
          "date": "2026-08-11",
          "source": "Finance Business Partner",
          "confidence": "measured"
        }
      ],
      "expectedOutcome": "Automated customs declarations available for cross-border loads before the wave 1 cutover.",
      "linkedRiskIds": [
        "rsk-14",
        "rsk-15"
      ],
      "linkedChangeIds": [
        "chg-06"
      ],
      "linkedBenefitIds": [
        "ben-07"
      ],
      "linkedMilestoneIds": [
        "ms-19"
      ]
    },
    {
      "id": "dec-06",
      "ref": "DEC-06",
      "title": "Reduce Milan automation to two pick stations for wave 1",
      "context": "The supplier capacity shortfall makes three pick stations undeliverable for wave 1. Opening with two caps throughput but protects the commissioning date.",
      "ownerId": "own-08",
      "decisionMakerId": "own-01",
      "forum": "Steering Committee",
      "dateRequired": "2026-09-14",
      "status": "scheduled",
      "options": [
        {
          "id": "dec-06-opt-1",
          "label": "Open with three stations as planned",
          "pros": [
            "Full benefit from day one"
          ],
          "cons": [
            "Depends on a supplier date that does not exist",
            "Would delay commissioning by an unknown period"
          ],
          "estimatedCost": 0,
          "estimatedScheduleDays": 28,
          "residualRiskNote": "Unbounded schedule risk on a single supplier."
        },
        {
          "id": "dec-06-opt-2",
          "label": "Open with two stations, install the third later",
          "pros": [
            "Protects the commissioning date",
            "Reduces supplier dependency for wave 1"
          ],
          "cons": [
            "Caps day one throughput by a third",
            "420k of benefit deferred"
          ],
          "estimatedCost": -210000,
          "estimatedScheduleDays": -14,
          "residualRiskNote": "Benefit timing risk replaces schedule risk."
        },
        {
          "id": "dec-06-opt-3",
          "label": "Delay Milan automation entirely to phase 2",
          "pros": [
            "Removes the automation risk from the programme"
          ],
          "cons": [
            "Loses 1.8M of productivity benefit from the business case"
          ],
          "estimatedCost": -1100000,
          "estimatedScheduleDays": -30,
          "residualRiskNote": "Benefit case materially weakened."
        }
      ],
      "evidence": [
        {
          "id": "dec-06-ev-1",
          "label": "Supplier capacity correspondence",
          "kind": "document",
          "date": "2026-07-20",
          "source": "Vendor Management",
          "confidence": "verified"
        },
        {
          "id": "dec-06-ev-2",
          "label": "Throughput simulation, two versus three stations",
          "kind": "test-result",
          "date": "2026-08-25",
          "source": "Warehouse Automation",
          "confidence": "measured"
        }
      ],
      "expectedOutcome": "Commissioning completed on the current forecast date with a documented plan for the third station.",
      "linkedRiskIds": [
        "rsk-06",
        "rsk-08",
        "rsk-33"
      ],
      "linkedChangeIds": [
        "chg-07"
      ],
      "linkedBenefitIds": [
        "ben-03"
      ],
      "linkedMilestoneIds": [
        "ms-22",
        "ms-23"
      ],
      "reviewDate": "2026-10-26"
    },
    {
      "id": "dec-07",
      "ref": "DEC-07",
      "title": "Accept or mitigate the Commerce Replatform interface collision",
      "context": "Both programmes booked change windows on the same order management interface. Portfolio governance reviewed scope but not technical collisions.",
      "ownerId": "own-02",
      "decisionMakerId": "own-02",
      "forum": "Portfolio Board",
      "dateRequired": "2026-08-11",
      "status": "decided",
      "options": [
        {
          "id": "dec-07-opt-1",
          "label": "Accept and coordinate informally",
          "pros": [
            "No process overhead"
          ],
          "cons": [
            "Relies on individuals noticing collisions",
            "Has already failed once"
          ],
          "estimatedCost": 0,
          "estimatedScheduleDays": 0,
          "residualRiskNote": "Collision risk essentially unchanged."
        },
        {
          "id": "dec-07-opt-2",
          "label": "Establish a shared change calendar with collision review",
          "pros": [
            "Systematic detection",
            "Applies to future changes too"
          ],
          "cons": [
            "Adds a fortnightly review",
            "Requires both programmes to publish early"
          ],
          "estimatedCost": 12000,
          "estimatedScheduleDays": 0,
          "residualRiskNote": "Residual risk limited to unpublished changes."
        }
      ],
      "evidence": [
        {
          "id": "dec-07-ev-1",
          "label": "Portfolio change calendar",
          "kind": "system-record",
          "date": "2026-09-02",
          "source": "Programme Office",
          "confidence": "verified"
        },
        {
          "id": "dec-07-ev-2",
          "label": "Collision review minutes",
          "kind": "meeting",
          "date": "2026-09-04",
          "source": "Programme Office",
          "confidence": "measured"
        }
      ],
      "expectedOutcome": "No further interface collisions between the two programmes before wave 2.",
      "linkedRiskIds": [
        "rsk-24"
      ],
      "linkedChangeIds": [],
      "linkedBenefitIds": [],
      "linkedMilestoneIds": [
        "ms-10"
      ],
      "dateDecided": "2026-08-17",
      "reviewDate": "2026-10-16",
      "chosenOptionId": "dec-07-opt-2",
      "rationale": "Chose the shared calendar. The overhead is one fortnightly meeting against an exposure that had already materialised once and would have recurred.",
      "actualOutcome": "No collisions since the calendar was introduced in period 10, and two potential collisions were detected and re-sequenced.",
      "outcomeScore": 5
    },
    {
      "id": "dec-08",
      "ref": "DEC-08",
      "title": "Select the master data remediation approach",
      "context": "Two options were available: fix defects in the source systems, or remediate in a staging layer during migration. The staging option was faster and cheaper.",
      "ownerId": "own-12",
      "decisionMakerId": "own-02",
      "forum": "Programme Board",
      "dateRequired": "2026-06-28",
      "status": "decided",
      "options": [
        {
          "id": "dec-08-opt-1",
          "label": "Remediate at source",
          "pros": [
            "Fixes the defect permanently",
            "Improves legacy reporting too"
          ],
          "cons": [
            "Requires regional system changes",
            "Slower and needs regional IT capacity"
          ],
          "estimatedCost": 240000,
          "estimatedScheduleDays": 30,
          "residualRiskNote": "Defect recurrence risk removed."
        },
        {
          "id": "dec-08-opt-2",
          "label": "Remediate in the staging layer",
          "pros": [
            "Faster and cheaper",
            "No regional system change"
          ],
          "cons": [
            "Source systems keep producing defects",
            "Every future load needs the same remediation"
          ],
          "estimatedCost": 90000,
          "estimatedScheduleDays": 0,
          "residualRiskNote": "Defect recurrence risk retained in full."
        }
      ],
      "evidence": [
        {
          "id": "dec-08-ev-1",
          "label": "Defect arrival versus clearance trend",
          "kind": "metric",
          "date": "2026-09-07",
          "source": "Data Quality",
          "confidence": "verified"
        },
        {
          "id": "dec-08-ev-2",
          "label": "Remediation approach options paper",
          "kind": "document",
          "date": "2026-06-30",
          "source": "Data Quality",
          "confidence": "measured"
        }
      ],
      "expectedOutcome": "Master data defect rate below 1.5% at the migration exit gate.",
      "linkedRiskIds": [
        "rsk-04",
        "rsk-09"
      ],
      "linkedChangeIds": [
        "chg-13"
      ],
      "linkedBenefitIds": [
        "ben-05"
      ],
      "linkedMilestoneIds": [
        "ms-15"
      ],
      "dateDecided": "2026-07-06",
      "reviewDate": "2026-08-27",
      "chosenOptionId": "dec-08-opt-2",
      "rationale": "Chose staging layer remediation on cost and speed grounds, accepting that the source systems would continue to produce defects until the legacy platforms are decommissioned.",
      "actualOutcome": "The approach cleared the historic backlog but did not stop new defects arriving. Arrival rate now exceeds clearance rate and the exit gate has moved twice. Remediating at source would have been slower but would have held.",
      "outcomeScore": 2
    },
    {
      "id": "dec-09",
      "ref": "DEC-09",
      "title": "Approve extended hypercare for the two-wave go-live",
      "context": "Splitting the go-live into two waves extended the period during which both platforms operate, beyond the four weeks of hypercare originally funded.",
      "ownerId": "own-05",
      "decisionMakerId": "own-02",
      "forum": "Programme Board",
      "dateRequired": "2026-07-24",
      "status": "decided",
      "options": [
        {
          "id": "dec-09-opt-1",
          "label": "Keep four weeks of hypercare",
          "pros": [
            "No additional cost"
          ],
          "cons": [
            "Wave 2 would run without vendor cover",
            "Support gap during dual running"
          ],
          "estimatedCost": 0,
          "estimatedScheduleDays": 0,
          "residualRiskNote": "Post cutover support risk retained."
        },
        {
          "id": "dec-09-opt-2",
          "label": "Extend to eight weeks",
          "pros": [
            "Cover across both waves",
            "Vendor engineers retained"
          ],
          "cons": [
            "148k additional cost"
          ],
          "estimatedCost": 148000,
          "estimatedScheduleDays": 0,
          "residualRiskNote": "Support risk substantially reduced."
        }
      ],
      "evidence": [
        {
          "id": "dec-09-ev-1",
          "label": "Hypercare capacity model v3",
          "kind": "document",
          "date": "2026-08-27",
          "source": "TMS Delivery",
          "confidence": "verified"
        }
      ],
      "expectedOutcome": "No unsupported period during dual running, and wave 2 covered by the same team that ran wave 1.",
      "linkedRiskIds": [
        "rsk-25",
        "rsk-18"
      ],
      "linkedChangeIds": [
        "chg-03"
      ],
      "linkedBenefitIds": [],
      "linkedMilestoneIds": [
        "ms-10"
      ],
      "dateDecided": "2026-07-28",
      "reviewDate": "2026-10-04",
      "chosenOptionId": "dec-09-opt-2",
      "rationale": "Chose the extension. The two-wave decision created the gap, so funding cover for it was a direct consequence rather than a new choice.",
      "actualOutcome": "Hypercare rota confirmed and the vendor contract amended. No dual running gap remains in the plan.",
      "outcomeScore": 4
    },
    {
      "id": "dec-10",
      "ref": "DEC-10",
      "title": "Approve the carrier data sharing fallback position",
      "context": "Three tier 1 carriers rejected the standard unlimited liability clause for visibility data. Without their data the control tower cannot cover 38% of volume.",
      "ownerId": "own-07",
      "decisionMakerId": "own-01",
      "forum": "Steering Committee",
      "dateRequired": "2026-09-16",
      "status": "required",
      "options": [
        {
          "id": "dec-10-opt-1",
          "label": "Hold the standard clause",
          "pros": [
            "Consistent contractual position",
            "No liability exposure"
          ],
          "cons": [
            "Three carriers withhold data",
            "Control tower coverage drops to 62%"
          ],
          "estimatedCost": 0,
          "estimatedScheduleDays": 0,
          "residualRiskNote": "Benefit risk on the service level uplift."
        },
        {
          "id": "dec-10-opt-2",
          "label": "Apply the pre-agreed fallback wording",
          "pros": [
            "Unblocks the data",
            "Already legally reviewed"
          ],
          "cons": [
            "Accepts a capped liability for data accuracy",
            "Sets a precedent for tier 2 negotiations"
          ],
          "estimatedCost": 0,
          "estimatedScheduleDays": -21,
          "residualRiskNote": "Liability accepted at a capped level."
        },
        {
          "id": "dec-10-opt-3",
          "label": "Source visibility data from a third party aggregator",
          "pros": [
            "No carrier negotiation needed"
          ],
          "cons": [
            "Adds an annual fee",
            "Lower data granularity"
          ],
          "estimatedCost": 140000,
          "estimatedScheduleDays": -14,
          "residualRiskNote": "Data quality risk on ETA accuracy."
        }
      ],
      "evidence": [
        {
          "id": "dec-10-ev-1",
          "label": "Carrier legal position summary",
          "kind": "document",
          "date": "2026-08-07",
          "source": "Group Legal",
          "confidence": "verified"
        },
        {
          "id": "dec-10-ev-2",
          "label": "Control tower coverage analysis",
          "kind": "metric",
          "date": "2026-08-25",
          "source": "Control Tower",
          "confidence": "measured"
        }
      ],
      "expectedOutcome": "Visibility data flowing from all tier 1 carriers before the control tower full rollout.",
      "linkedRiskIds": [
        "rsk-11",
        "rsk-15",
        "rsk-10"
      ],
      "linkedChangeIds": [],
      "linkedBenefitIds": [
        "ben-08"
      ],
      "linkedMilestoneIds": [
        "ms-25",
        "ms-28"
      ]
    }
  ],
  "benefits": [
    {
      "id": "ben-01",
      "ref": "BEN-01",
      "name": "Freight cost reduction from hub consolidation",
      "description": "Freight cost reduction from hub consolidation measured as Freight cost per consolidated load, tracked monthly by the benefit owner against the pre-programme baseline.",
      "type": "financial",
      "ownerId": "own-11",
      "expectedValue": 3600000,
      "realisedValue": 1180000,
      "measure": "Freight cost per consolidated load",
      "baseline": 412.0,
      "target": 318.0,
      "current": 371.0,
      "startDate": "2026-03-20",
      "targetDate": "2026-10-31",
      "status": "in-progress",
      "enablingMilestoneIds": [
        "ms-05",
        "ms-24"
      ],
      "threateningRiskIds": [
        "rsk-04",
        "rsk-22",
        "rsk-31"
      ],
      "linkedChangeIds": [
        "chg-02"
      ],
      "linkedDecisionIds": [
        "dec-01"
      ],
      "history": [
        {
          "date": "2026-04-13",
          "realisedValue": 77401
        },
        {
          "date": "2026-05-08",
          "realisedValue": 204262
        },
        {
          "date": "2026-06-02",
          "realisedValue": 360342
        },
        {
          "date": "2026-06-26",
          "realisedValue": 539050
        },
        {
          "date": "2026-07-21",
          "realisedValue": 736721
        },
        {
          "date": "2026-08-15",
          "realisedValue": 950947
        },
        {
          "date": "2026-09-09",
          "realisedValue": 1180000
        }
      ]
    },
    {
      "id": "ben-02",
      "ref": "BEN-02",
      "name": "Carrier rate optimisation through competitive tendering",
      "description": "Carrier rate optimisation through competitive tendering measured as Weighted average rate index, tracked monthly by the benefit owner against the pre-programme baseline.",
      "type": "financial",
      "ownerId": "own-07",
      "expectedValue": 2400000,
      "realisedValue": 1340000,
      "measure": "Weighted average rate index",
      "baseline": 100.0,
      "target": 88.0,
      "current": 92.5,
      "startDate": "2026-01-29",
      "targetDate": "2026-10-06",
      "status": "in-progress",
      "enablingMilestoneIds": [
        "ms-17",
        "ms-18",
        "ms-20"
      ],
      "threateningRiskIds": [
        "rsk-11",
        "rsk-17"
      ],
      "linkedChangeIds": [],
      "linkedDecisionIds": [],
      "history": [
        {
          "date": "2026-03-01",
          "realisedValue": 87896
        },
        {
          "date": "2026-04-02",
          "realisedValue": 231958
        },
        {
          "date": "2026-05-04",
          "realisedValue": 409202
        },
        {
          "date": "2026-06-05",
          "realisedValue": 612141
        },
        {
          "date": "2026-07-07",
          "realisedValue": 836615
        },
        {
          "date": "2026-08-08",
          "realisedValue": 1079889
        },
        {
          "date": "2026-09-09",
          "realisedValue": 1340000
        }
      ]
    },
    {
      "id": "ben-03",
      "ref": "BEN-03",
      "name": "Warehouse labour productivity uplift",
      "description": "Warehouse labour productivity uplift measured as Units picked per labour hour, tracked monthly by the benefit owner against the pre-programme baseline.",
      "type": "efficiency",
      "ownerId": "own-08",
      "expectedValue": 1800000,
      "realisedValue": 240000,
      "measure": "Units picked per labour hour",
      "baseline": 78.0,
      "target": 132.0,
      "current": 86.0,
      "startDate": "2026-08-07",
      "targetDate": "2026-10-31",
      "status": "at-risk",
      "enablingMilestoneIds": [
        "ms-23",
        "ms-24"
      ],
      "threateningRiskIds": [
        "rsk-06",
        "rsk-07",
        "rsk-33"
      ],
      "linkedChangeIds": [
        "chg-07"
      ],
      "linkedDecisionIds": [
        "dec-06"
      ],
      "history": [
        {
          "date": "2026-08-11",
          "realisedValue": 15743
        },
        {
          "date": "2026-08-16",
          "realisedValue": 41545
        },
        {
          "date": "2026-08-21",
          "realisedValue": 73290
        },
        {
          "date": "2026-08-25",
          "realisedValue": 109637
        },
        {
          "date": "2026-08-30",
          "realisedValue": 149841
        },
        {
          "date": "2026-09-04",
          "realisedValue": 193413
        },
        {
          "date": "2026-09-09",
          "realisedValue": 240000
        }
      ]
    },
    {
      "id": "ben-04",
      "ref": "BEN-04",
      "name": "Reduction in premium and expedited freight",
      "description": "Reduction in premium and expedited freight measured as Premium freight as share of spend, tracked monthly by the benefit owner against the pre-programme baseline.",
      "type": "financial",
      "ownerId": "own-05",
      "expectedValue": 1200000,
      "realisedValue": 155000,
      "measure": "Premium freight as share of spend",
      "baseline": 0.094,
      "target": 0.041,
      "current": 0.083,
      "startDate": "2026-07-18",
      "targetDate": "2026-10-26",
      "status": "at-risk",
      "enablingMilestoneIds": [
        "ms-10",
        "ms-13",
        "ms-32"
      ],
      "threateningRiskIds": [
        "rsk-01",
        "rsk-02",
        "rsk-03"
      ],
      "linkedChangeIds": [
        "chg-05",
        "chg-11"
      ],
      "linkedDecisionIds": [
        "dec-02",
        "dec-04"
      ],
      "history": [
        {
          "date": "2026-07-25",
          "realisedValue": 10167
        },
        {
          "date": "2026-08-02",
          "realisedValue": 26831
        },
        {
          "date": "2026-08-09",
          "realisedValue": 47333
        },
        {
          "date": "2026-08-17",
          "realisedValue": 70807
        },
        {
          "date": "2026-08-24",
          "realisedValue": 96773
        },
        {
          "date": "2026-09-01",
          "realisedValue": 124913
        },
        {
          "date": "2026-09-09",
          "realisedValue": 155000
        }
      ]
    },
    {
      "id": "ben-05",
      "ref": "BEN-05",
      "name": "Inventory carrying cost reduction",
      "description": "Inventory carrying cost reduction measured as Average days of inventory on hand, tracked monthly by the benefit owner against the pre-programme baseline.",
      "type": "financial",
      "ownerId": "own-11",
      "expectedValue": 1500000,
      "realisedValue": 420000,
      "measure": "Average days of inventory on hand",
      "baseline": 34.0,
      "target": 26.0,
      "current": 31.5,
      "startDate": "2026-05-19",
      "targetDate": "2026-10-31",
      "status": "in-progress",
      "enablingMilestoneIds": [
        "ms-05",
        "ms-25"
      ],
      "threateningRiskIds": [
        "rsk-22",
        "rsk-27"
      ],
      "linkedChangeIds": [],
      "linkedDecisionIds": [],
      "history": [
        {
          "date": "2026-06-04",
          "realisedValue": 27549
        },
        {
          "date": "2026-06-20",
          "realisedValue": 72703
        },
        {
          "date": "2026-07-06",
          "realisedValue": 128257
        },
        {
          "date": "2026-07-22",
          "realisedValue": 191865
        },
        {
          "date": "2026-08-07",
          "realisedValue": 262223
        },
        {
          "date": "2026-08-23",
          "realisedValue": 338473
        },
        {
          "date": "2026-09-09",
          "realisedValue": 420000
        }
      ]
    },
    {
      "id": "ben-06",
      "ref": "BEN-06",
      "name": "Claims and damage reduction",
      "description": "Claims and damage reduction measured as Claims per thousand shipments, tracked monthly by the benefit owner against the pre-programme baseline.",
      "type": "efficiency",
      "ownerId": "own-15",
      "expectedValue": 900000,
      "realisedValue": 310000,
      "measure": "Claims per thousand shipments",
      "baseline": 4.8,
      "target": 2.6,
      "current": 3.9,
      "startDate": "2026-04-09",
      "targetDate": "2026-10-16",
      "status": "in-progress",
      "enablingMilestoneIds": [
        "ms-24",
        "ms-30"
      ],
      "threateningRiskIds": [
        "rsk-19",
        "rsk-33"
      ],
      "linkedChangeIds": [],
      "linkedDecisionIds": [],
      "history": [
        {
          "date": "2026-04-30",
          "realisedValue": 20334
        },
        {
          "date": "2026-05-22",
          "realisedValue": 53662
        },
        {
          "date": "2026-06-13",
          "realisedValue": 94666
        },
        {
          "date": "2026-07-05",
          "realisedValue": 141615
        },
        {
          "date": "2026-07-27",
          "realisedValue": 193545
        },
        {
          "date": "2026-08-18",
          "realisedValue": 249825
        },
        {
          "date": "2026-09-09",
          "realisedValue": 310000
        }
      ]
    },
    {
      "id": "ben-07",
      "ref": "BEN-07",
      "name": "Customs and compliance penalty avoidance",
      "description": "Customs and compliance penalty avoidance measured as Customs corrections per month, tracked monthly by the benefit owner against the pre-programme baseline.",
      "type": "compliance",
      "ownerId": "own-07",
      "expectedValue": 800000,
      "realisedValue": 190000,
      "measure": "Customs corrections per month",
      "baseline": 62.0,
      "target": 12.0,
      "current": 44.0,
      "startDate": "2026-04-29",
      "targetDate": "2026-10-21",
      "status": "at-risk",
      "enablingMilestoneIds": [
        "ms-19",
        "ms-16"
      ],
      "threateningRiskIds": [
        "rsk-14",
        "rsk-15"
      ],
      "linkedChangeIds": [
        "chg-09"
      ],
      "linkedDecisionIds": [],
      "history": [
        {
          "date": "2026-05-18",
          "realisedValue": 12463
        },
        {
          "date": "2026-06-06",
          "realisedValue": 32890
        },
        {
          "date": "2026-06-25",
          "realisedValue": 58021
        },
        {
          "date": "2026-07-14",
          "realisedValue": 86796
        },
        {
          "date": "2026-08-02",
          "realisedValue": 118624
        },
        {
          "date": "2026-08-21",
          "realisedValue": 153119
        },
        {
          "date": "2026-09-09",
          "realisedValue": 190000
        }
      ]
    },
    {
      "id": "ben-08",
      "ref": "BEN-08",
      "name": "Service level uplift protecting at-risk revenue",
      "description": "Service level uplift protecting at-risk revenue measured as On-time in-full delivery performance, tracked monthly by the benefit owner against the pre-programme baseline.",
      "type": "customer",
      "ownerId": "own-09",
      "expectedValue": 1400000,
      "realisedValue": 0,
      "measure": "On-time in-full delivery performance",
      "baseline": 0.912,
      "target": 0.972,
      "current": 0.918,
      "startDate": "2026-08-17",
      "targetDate": "2026-10-31",
      "status": "at-risk",
      "enablingMilestoneIds": [
        "ms-23",
        "ms-26",
        "ms-28"
      ],
      "threateningRiskIds": [
        "rsk-06",
        "rsk-09",
        "rsk-13"
      ],
      "linkedChangeIds": [
        "chg-05"
      ],
      "linkedDecisionIds": [
        "dec-03"
      ],
      "history": [
        {
          "date": "2026-08-20",
          "realisedValue": 0
        },
        {
          "date": "2026-08-23",
          "realisedValue": 0
        },
        {
          "date": "2026-08-26",
          "realisedValue": 0
        },
        {
          "date": "2026-08-30",
          "realisedValue": 0
        },
        {
          "date": "2026-09-02",
          "realisedValue": 0
        },
        {
          "date": "2026-09-05",
          "realisedValue": 0
        },
        {
          "date": "2026-09-09",
          "realisedValue": 0
        }
      ]
    },
    {
      "id": "ben-09",
      "ref": "BEN-09",
      "name": "Legacy transport system decommission savings",
      "description": "Legacy transport system decommission savings measured as Annual legacy licence and hosting cost, tracked monthly by the benefit owner against the pre-programme baseline.",
      "type": "financial",
      "ownerId": "own-05",
      "expectedValue": 600000,
      "realisedValue": 0,
      "measure": "Annual legacy licence and hosting cost",
      "baseline": 600000.0,
      "target": 0.0,
      "current": 600000.0,
      "startDate": "2026-09-16",
      "targetDate": "2026-10-31",
      "status": "not-started",
      "enablingMilestoneIds": [
        "ms-10",
        "ms-28"
      ],
      "threateningRiskIds": [
        "rsk-02",
        "rsk-24"
      ],
      "linkedChangeIds": [
        "chg-12"
      ],
      "linkedDecisionIds": [],
      "history": []
    }
  ],
  "fmea": [
    {
      "id": "fma-01",
      "ref": "FM-01",
      "process": "Carrier booking to invoice",
      "processStep": "Receive booking request",
      "failureMode": "Booking message rejected by the carrier API",
      "effect": "Load is not tendered, operations revert to phone booking and premium rates apply",
      "cause": "Invoice and booking schema mismatch after the vendor specification gap",
      "severity": 4,
      "occurrence": 4,
      "detection": 3,
      "existingControl": "Message validation with retry and a dead letter queue",
      "recommendedAction": "Build the in-house invoice adapter and add contract tests against each carrier schema",
      "ownerId": "own-06",
      "dueDate": "2026-09-08",
      "actionStatus": "in-progress",
      "postSeverity": 4,
      "postOccurrence": 2,
      "postDetection": 2,
      "linkedRiskIds": [
        "rsk-01",
        "rsk-03"
      ],
      "linkedCauseIds": [
        "cse-01"
      ],
      "linkedControlIds": [
        "ctl-02",
        "ctl-17"
      ]
    },
    {
      "id": "fma-02",
      "ref": "FM-02",
      "process": "Carrier booking to invoice",
      "processStep": "Confirm carrier acceptance",
      "failureMode": "Acceptance not received within the service window",
      "effect": "Load sits unconfirmed and misses the collection slot",
      "cause": "Carrier API certification incomplete for two carriers",
      "severity": 4,
      "occurrence": 3,
      "detection": 2,
      "existingControl": "Unconfirmed booking exception report in the control tower",
      "recommendedAction": "Complete certification with the two outstanding carriers and add a fallback manual tender path",
      "ownerId": "own-07",
      "dueDate": "2026-09-02",
      "actionStatus": "in-progress",
      "postSeverity": 3,
      "postOccurrence": 2,
      "postDetection": 2,
      "linkedRiskIds": [
        "rsk-01",
        "rsk-03"
      ],
      "linkedCauseIds": [
        "cse-01"
      ],
      "linkedControlIds": [
        "ctl-01",
        "ctl-29"
      ]
    },
    {
      "id": "fma-03",
      "ref": "FM-03",
      "process": "Carrier booking to invoice",
      "processStep": "Transmit shipment data",
      "failureMode": "Address data rejected on cross-border loads",
      "effect": "Customs clearance delayed and the load is held at the border",
      "cause": "Character encoding defects in Italian and Polish address data",
      "severity": 4,
      "occurrence": 4,
      "detection": 2,
      "existingControl": "Nightly data quality rules on the eight critical attributes",
      "recommendedAction": "Extend the encoding fix from the dry run to all legacy extracts and add pre-transmission validation",
      "ownerId": "own-12",
      "dueDate": "2026-09-12",
      "actionStatus": "in-progress",
      "postSeverity": 4,
      "postOccurrence": 2,
      "postDetection": 1,
      "linkedRiskIds": [
        "rsk-04",
        "rsk-14"
      ],
      "linkedCauseIds": [
        "cse-03"
      ],
      "linkedControlIds": [
        "ctl-05",
        "ctl-07"
      ]
    },
    {
      "id": "fma-04",
      "ref": "FM-04",
      "process": "Carrier booking to invoice",
      "processStep": "Track shipment events",
      "failureMode": "Tracking events not received from the carrier",
      "effect": "Control tower shows a blind shipment and the customer promise cannot be confirmed",
      "cause": "Carrier withheld data pending the liability clause",
      "severity": 3,
      "occurrence": 4,
      "detection": 2,
      "existingControl": "Missing event alerting in the control tower",
      "recommendedAction": "Apply the fallback data sharing clause with the three holdout carriers",
      "ownerId": "own-07",
      "dueDate": "2026-08-31",
      "actionStatus": "in-progress",
      "postSeverity": 3,
      "postOccurrence": 2,
      "postDetection": 2,
      "linkedRiskIds": [
        "rsk-11",
        "rsk-10"
      ],
      "linkedCauseIds": [
        "cse-10"
      ],
      "linkedControlIds": [
        "ctl-15",
        "ctl-29"
      ]
    },
    {
      "id": "fma-05",
      "ref": "FM-05",
      "process": "Carrier booking to invoice",
      "processStep": "Submit customs declaration",
      "failureMode": "Declaration submitted with an incorrect commodity code",
      "effect": "Penalty, clearance delay and a customs correction entry",
      "cause": "Manual re-keying between the broker portal and the transport system",
      "severity": 5,
      "occurrence": 3,
      "detection": 3,
      "existingControl": "Post-submission correction report reviewed weekly",
      "recommendedAction": "Automate the declaration handover through the broker interface or managed service",
      "ownerId": "own-07",
      "dueDate": "2026-09-16",
      "actionStatus": "open",
      "postSeverity": 5,
      "postOccurrence": 2,
      "postDetection": 2,
      "linkedRiskIds": [
        "rsk-14",
        "rsk-15"
      ],
      "linkedCauseIds": [
        "cse-11",
        "cse-03"
      ],
      "linkedControlIds": [
        "ctl-16",
        "ctl-19"
      ]
    },
    {
      "id": "fma-06",
      "ref": "FM-06",
      "process": "Carrier booking to invoice",
      "processStep": "Receive carrier invoice",
      "failureMode": "Invoice cannot be matched to an executed load",
      "effect": "Invoice paid unmatched or held, causing rate leakage and disputed balances",
      "cause": "Six carrier invoice formats against a matcher designed for two",
      "severity": 3,
      "occurrence": 5,
      "detection": 2,
      "existingControl": "Automated three-way match at cost, load and contract rate",
      "recommendedAction": "Standardise carrier invoice formats to two accepted variants",
      "ownerId": "own-07",
      "dueDate": "2026-09-20",
      "actionStatus": "open",
      "postSeverity": 3,
      "postOccurrence": 3,
      "postDetection": 2,
      "linkedRiskIds": [
        "rsk-26",
        "rsk-12"
      ],
      "linkedCauseIds": [
        "cse-19"
      ],
      "linkedControlIds": [
        "ctl-25"
      ]
    },
    {
      "id": "fma-07",
      "ref": "FM-07",
      "process": "Carrier booking to invoice",
      "processStep": "Post cost to the ledger",
      "failureMode": "Cost posted against the wrong hub or cost centre",
      "effect": "Reported freight cost per load is wrong and benefit measurement is unreliable",
      "cause": "Reporting definitions differ between operations and finance",
      "severity": 4,
      "occurrence": 4,
      "detection": 3,
      "existingControl": "Monthly reconciliation of reporting to the general ledger",
      "recommendedAction": "Close the metric dictionary and align the cost centre mapping before the reporting gate",
      "ownerId": "own-11",
      "dueDate": "2026-09-06",
      "actionStatus": "in-progress",
      "postSeverity": 4,
      "postOccurrence": 2,
      "postDetection": 2,
      "linkedRiskIds": [
        "rsk-09",
        "rsk-27"
      ],
      "linkedCauseIds": [
        "cse-09"
      ],
      "linkedControlIds": [
        "ctl-13",
        "ctl-14"
      ]
    },
    {
      "id": "fma-08",
      "ref": "FM-08",
      "process": "Carrier booking to invoice",
      "processStep": "Publish the carrier scorecard",
      "failureMode": "Scorecard published from unreconciled data",
      "effect": "Carrier performance disputes and loss of credibility in commercial reviews",
      "cause": "Certified data set not available for reporting",
      "severity": 3,
      "occurrence": 3,
      "detection": 3,
      "existingControl": "Data certification flag required before publication",
      "recommendedAction": "Gate scorecard publication on the reconciliation control passing",
      "ownerId": "own-09",
      "dueDate": "2026-09-22",
      "actionStatus": "open",
      "postSeverity": 3,
      "postOccurrence": 2,
      "postDetection": 2,
      "linkedRiskIds": [
        "rsk-09",
        "rsk-04"
      ],
      "linkedCauseIds": [
        "cse-02",
        "cse-09"
      ],
      "linkedControlIds": [
        "ctl-05",
        "ctl-14"
      ]
    },
    {
      "id": "fma-09",
      "ref": "FM-09",
      "process": "Carrier booking to invoice",
      "processStep": "Authenticate the carrier connection",
      "failureMode": "Carrier credential compromised",
      "effect": "Unauthorised access to shipment and customer data across the connected estate",
      "cause": "Thirty-four carrier connections replace three regional gateways",
      "severity": 5,
      "occurrence": 2,
      "detection": 3,
      "existingControl": "Continuous pipeline scanning and gateway rate limiting",
      "recommendedAction": "Complete threat models for the remaining integration patterns and enforce credential rotation",
      "ownerId": "own-13",
      "dueDate": "2026-09-06",
      "actionStatus": "in-progress",
      "postSeverity": 5,
      "postOccurrence": 1,
      "postDetection": 2,
      "linkedRiskIds": [
        "rsk-28",
        "rsk-02"
      ],
      "linkedCauseIds": [
        "cse-08"
      ],
      "linkedControlIds": [
        "ctl-03",
        "ctl-04",
        "ctl-16"
      ]
    },
    {
      "id": "fma-10",
      "ref": "FM-10",
      "process": "Inbound to stock, automated hub",
      "processStep": "Receive the inbound trailer",
      "failureMode": "Trailer arrives outside the booked slot",
      "effect": "Automation starves or queues and throughput drops below plan",
      "cause": "Slot compliance not enforced in the new booking flow",
      "severity": 3,
      "occurrence": 4,
      "detection": 2,
      "existingControl": "Slot adherence exception report",
      "recommendedAction": "Enforce slot booking as a hard constraint in the carrier portal",
      "ownerId": "own-08",
      "dueDate": "2026-09-24",
      "actionStatus": "open",
      "postSeverity": 3,
      "postOccurrence": 2,
      "postDetection": 2,
      "linkedRiskIds": [
        "rsk-33",
        "rsk-19"
      ],
      "linkedCauseIds": [
        "cse-16"
      ],
      "linkedControlIds": [
        "ctl-29"
      ]
    },
    {
      "id": "fma-11",
      "ref": "FM-11",
      "process": "Inbound to stock, automated hub",
      "processStep": "Decant to totes",
      "failureMode": "Decant rate below the automation feed requirement",
      "effect": "Goods-to-person stations idle and the productivity benefit is not achieved",
      "cause": "Recruitment shortfall against the ramp-up curve",
      "severity": 4,
      "occurrence": 4,
      "detection": 2,
      "existingControl": "Weekly recruitment pipeline tracking against the ramp curve",
      "recommendedAction": "Targeted recruitment campaign plus a temporary agency framework",
      "ownerId": "own-15",
      "dueDate": "2026-08-25",
      "actionStatus": "in-progress",
      "postSeverity": 4,
      "postOccurrence": 2,
      "postDetection": 2,
      "linkedRiskIds": [
        "rsk-19",
        "rsk-33"
      ],
      "linkedCauseIds": [
        "cse-14"
      ],
      "linkedControlIds": [
        "ctl-22"
      ]
    },
    {
      "id": "fma-12",
      "ref": "FM-12",
      "process": "Inbound to stock, automated hub",
      "processStep": "Automated putaway",
      "failureMode": "Shuttle fault stops an aisle",
      "effect": "Aisle inventory unavailable and order fulfilment is delayed",
      "cause": "Availability assumed at contractual level from day one",
      "severity": 4,
      "occurrence": 3,
      "detection": 2,
      "existingControl": "Factory acceptance test with an availability warranty",
      "recommendedAction": "Agree a contractual availability ramp with remedies rather than a single day one target",
      "ownerId": "own-08",
      "dueDate": "2026-09-22",
      "actionStatus": "open",
      "postSeverity": 4,
      "postOccurrence": 2,
      "postDetection": 1,
      "linkedRiskIds": [
        "rsk-33",
        "rsk-08"
      ],
      "linkedCauseIds": [
        "cse-16"
      ],
      "linkedControlIds": [
        "ctl-11",
        "ctl-12"
      ]
    },
    {
      "id": "fma-13",
      "ref": "FM-13",
      "process": "Inbound to stock, automated hub",
      "processStep": "Goods-to-person pick",
      "failureMode": "Throughput below the contractual FAT figure",
      "effect": "Acceptance test fails, delaying both the payment milestone and go-live",
      "cause": "Throughput modelled on an annual average order profile",
      "severity": 4,
      "occurrence": 4,
      "detection": 3,
      "existingControl": "Peak profile simulation before commissioning",
      "recommendedAction": "Re-run the simulation with three real peak weeks and re-derive the achievable figure",
      "ownerId": "own-08",
      "dueDate": "2026-09-14",
      "actionStatus": "in-progress",
      "postSeverity": 4,
      "postOccurrence": 3,
      "postDetection": 2,
      "linkedRiskIds": [
        "rsk-08",
        "rsk-33"
      ],
      "linkedCauseIds": [
        "cse-16"
      ],
      "linkedControlIds": [
        "ctl-11",
        "ctl-12"
      ]
    },
    {
      "id": "fma-14",
      "ref": "FM-14",
      "process": "Inbound to stock, automated hub",
      "processStep": "Interface stock update to the TMS",
      "failureMode": "Stock update not received by the transport system",
      "effect": "Loads are planned against stock that is not there, causing failed collections",
      "cause": "WMS to automation interface built late and tested at low volume",
      "severity": 4,
      "occurrence": 3,
      "detection": 3,
      "existingControl": "Interface monitoring with reconciliation counts",
      "recommendedAction": "Increase masked production data volume in the test environment to 40%",
      "ownerId": "own-06",
      "dueDate": "2026-08-31",
      "actionStatus": "in-progress",
      "postSeverity": 4,
      "postOccurrence": 2,
      "postDetection": 2,
      "linkedRiskIds": [
        "rsk-34",
        "rsk-05"
      ],
      "linkedCauseIds": [
        "cse-06"
      ],
      "linkedControlIds": [
        "ctl-07",
        "ctl-17"
      ]
    },
    {
      "id": "fma-15",
      "ref": "FM-15",
      "process": "Inbound to stock, automated hub",
      "processStep": "Power the automation system",
      "failureMode": "Automation loses power during operation",
      "effect": "Full hub stoppage with recovery measured in hours",
      "cause": "Utility upgrade not energised, temporary supply in use",
      "severity": 5,
      "occurrence": 2,
      "detection": 2,
      "existingControl": "Permit and utility lead time tracker with escalation",
      "recommendedAction": "Confirm the generator bridge specification and test a controlled failover",
      "ownerId": "own-04",
      "dueDate": "2026-09-02",
      "actionStatus": "in-progress",
      "postSeverity": 5,
      "postOccurrence": 1,
      "postDetection": 2,
      "linkedRiskIds": [
        "rsk-07"
      ],
      "linkedCauseIds": [
        "cse-05"
      ],
      "linkedControlIds": [
        "ctl-10"
      ]
    },
    {
      "id": "fma-16",
      "ref": "FM-16",
      "process": "Inbound to stock, automated hub",
      "processStep": "Commission the system",
      "failureMode": "Commissioning engineers not available",
      "effect": "Factory acceptance test slips, moving warehouse go-live and the network cutover",
      "cause": "Supplier reallocated capacity to another customer",
      "severity": 5,
      "occurrence": 4,
      "detection": 2,
      "existingControl": "Weekly vendor delivery review with contractual escalation",
      "recommendedAction": "Negotiate a protected build slot with liquidated damages for further movement",
      "ownerId": "own-14",
      "dueDate": "2026-08-27",
      "actionStatus": "in-progress",
      "postSeverity": 5,
      "postOccurrence": 3,
      "postDetection": 2,
      "linkedRiskIds": [
        "rsk-06"
      ],
      "linkedCauseIds": [
        "cse-04"
      ],
      "linkedControlIds": [
        "ctl-01",
        "ctl-08",
        "ctl-09"
      ]
    },
    {
      "id": "fma-17",
      "ref": "FM-17",
      "process": "Inbound to stock, automated hub",
      "processStep": "Operate under the new process",
      "failureMode": "Operators revert to the legacy process",
      "effect": "Automation bypassed, so productivity and claims benefits are not realised",
      "cause": "Super-user certification behind target and change fatigue",
      "severity": 3,
      "occurrence": 4,
      "detection": 3,
      "existingControl": "Named tester and trainee allocation confirmed in writing",
      "recommendedAction": "Add programme contribution to hub manager scorecards and re-plan the training calendar",
      "ownerId": "own-15",
      "dueDate": "2026-08-23",
      "actionStatus": "in-progress",
      "postSeverity": 3,
      "postOccurrence": 3,
      "postDetection": 2,
      "linkedRiskIds": [
        "rsk-17",
        "rsk-36"
      ],
      "linkedCauseIds": [
        "cse-07",
        "cse-13"
      ],
      "linkedControlIds": [
        "ctl-18",
        "ctl-21"
      ]
    },
    {
      "id": "fma-18",
      "ref": "FM-18",
      "process": "Inbound to stock, automated hub",
      "processStep": "Hand over to the run organisation",
      "failureMode": "No named receiving owner for an artefact",
      "effect": "Knowledge is lost at handover and defects resurface with nobody accountable",
      "cause": "Run organisation roles not funded until the next budget cycle",
      "severity": 4,
      "occurrence": 4,
      "detection": 3,
      "existingControl": "Knowledge transfer plan with run organisation acceptance",
      "recommendedAction": "Fund and appoint the run organisation roles before the handover gate",
      "ownerId": "own-01",
      "dueDate": "2026-09-24",
      "actionStatus": "open",
      "postSeverity": 4,
      "postOccurrence": 2,
      "postDetection": 2,
      "linkedRiskIds": [
        "rsk-41",
        "rsk-10"
      ],
      "linkedCauseIds": [
        "cse-21"
      ],
      "linkedControlIds": [
        "ctl-32",
        "ctl-20"
      ]
    }
  ],
  "dmaic": [
    {
      "id": "dmc-01",
      "ref": "DM-01",
      "name": "Reduce master data defect rate to the migration exit threshold",
      "ownerId": "own-12",
      "phase": "improve",
      "startDate": "2026-06-16",
      "targetDate": "2026-10-06",
      "define": {
        "problemStatement": "The defect rate on the eight critical master data attributes is 3.4% against a migration exit threshold of 1.5%. Defects are arriving faster than the remediation team can clear them, which has moved the data quality exit date twice and now threatens the reporting gate and benefit measurement.",
        "businessImpact": "Blocks the reporting suite acceptance, delays benefit baselining and creates rework in every downstream load. Modelled cost of poor quality is 246,000 for the programme period.",
        "customerImpact": "Address and weight defects cause failed collections and border holds, which are visible to the end customer as missed delivery promises.",
        "ctq": [
          "Defect rate on critical attributes at or below 1.5% at the exit gate",
          "No critical attribute without a named accountable owner",
          "Clearance rate at or above the arrival rate for four consecutive weeks"
        ],
        "inScope": [
          "The eight critical attributes used by transport planning, customs and invoicing",
          "All three regional legacy source systems",
          "The staging layer remediation process"
        ],
        "outOfScope": [
          "Non-critical descriptive attributes",
          "Historic records outside the eighteen month migration window",
          "Customer master data, owned by the commercial programme"
        ],
        "goalStatement": "Reduce the critical attribute defect rate from 3.4% to 1.5% or below by the migration exit gate, and hold clearance at or above arrival for four consecutive weeks."
      },
      "measure": {
        "metricName": "Critical attribute defect rate",
        "unit": "percent of records",
        "baseline": 3.4,
        "volume": 1840000,
        "defectRate": 0.034,
        "cycleTimeDays": 11.5,
        "costOfPoorQuality": 246000,
        "dataSource": "Nightly data quality rule engine, eight critical attributes",
        "trend": [
          {
            "date": "2026-06-16",
            "value": 2.9
          },
          {
            "date": "2026-06-30",
            "value": 3.0
          },
          {
            "date": "2026-07-14",
            "value": 3.1
          },
          {
            "date": "2026-07-28",
            "value": 3.3
          },
          {
            "date": "2026-08-11",
            "value": 3.4
          },
          {
            "date": "2026-08-25",
            "value": 3.5
          },
          {
            "date": "2026-09-07",
            "value": 3.4
          }
        ]
      },
      "analyze": {
        "causeIds": [
          "cse-02",
          "cse-03",
          "cse-06"
        ],
        "fmeaIds": [
          "fma-03",
          "fma-07",
          "fma-08"
        ],
        "hypothesis": "Defect arrival is driven by manual re-keying at the hubs and by the absence of attribute-level ownership, not by the remediation process itself.",
        "finding": "Confirmed. Pareto shows two causes account for 78% of defect volume: no single owner for master data quality across regions, and manual re-keying between legacy systems. The staging layer approach chosen in DEC-08 clears defects but does not stop them arriving."
      },
      "improve": {
        "countermeasures": [
          {
            "id": "dmc-01-cm-1",
            "description": "Assign named owners to all eight critical attributes",
            "expectedImprovementPct": 0.35,
            "ownerId": "own-12",
            "pilotScope": "Two attributes as a pilot in period 11",
            "dueDate": "2026-09-02",
            "status": "piloting"
          },
          {
            "id": "dmc-01-cm-2",
            "description": "Add three data quality contractors to clear the backlog",
            "expectedImprovementPct": 0.2,
            "ownerId": "own-12",
            "pilotScope": "Full scope, approved as CHG-13",
            "dueDate": "2026-08-11",
            "status": "implemented"
          },
          {
            "id": "dmc-01-cm-3",
            "description": "Automate the two highest volume re-keying steps at the hubs",
            "expectedImprovementPct": 0.3,
            "ownerId": "own-06",
            "pilotScope": "Milan hub only",
            "dueDate": "2026-09-18",
            "status": "planned"
          },
          {
            "id": "dmc-01-cm-4",
            "description": "Add encoding validation before transmission",
            "expectedImprovementPct": 0.15,
            "ownerId": "own-12",
            "pilotScope": "Italian and Polish address data",
            "dueDate": "2026-09-12",
            "status": "piloting"
          }
        ]
      },
      "control": {
        "controlMetric": "Weekly critical attribute defect rate",
        "upperControlLimit": 1.5,
        "lowerControlLimit": 0.0,
        "monitoringFrequency": "weekly",
        "escalationTrigger": "Two consecutive weeks above 1.5% or any week where arrival exceeds clearance by more than 10%",
        "ownerId": "own-12",
        "linkedControlIds": [
          "ctl-05",
          "ctl-06",
          "ctl-07"
        ]
      },
      "linkedRiskIds": [
        "rsk-04",
        "rsk-09",
        "rsk-34"
      ]
    },
    {
      "id": "dmc-02",
      "ref": "DM-02",
      "name": "Reduce premium and expedited freight as a share of spend",
      "ownerId": "own-05",
      "phase": "analyze",
      "startDate": "2026-07-16",
      "targetDate": "2026-10-26",
      "define": {
        "problemStatement": "Premium and expedited freight is running at 8.3% of transport spend against a target of 4.1%. Every booking failure, missed slot or late customs clearance converts a planned movement into a premium one, and the benefit case for BEN-04 assumes the reduction happens at go-live.",
        "businessImpact": "The gap between 8.3% and 4.1% is worth 1.2M annually, which is the entire BEN-04 benefit. Modelled cost of poor quality for the programme period is 318,000.",
        "customerImpact": "Premium freight usually follows a service failure, so the customer has already experienced a missed promise before the cost is incurred.",
        "ctq": [
          "Premium freight at or below 4.1% of transport spend",
          "Booking failure rate below 0.5% of tendered loads",
          "Customs hold rate below 1% of cross-border loads"
        ],
        "inScope": [
          "All European road freight movements in the wave 1 network",
          "Booking, tender and customs handover process steps"
        ],
        "outOfScope": [
          "Air and sea freight",
          "Customer-requested expedites, which are recharged"
        ],
        "goalStatement": "Reduce premium freight from 8.3% to 4.1% of spend within four months of wave 1 cutover by removing the booking and customs failure modes that cause it."
      },
      "measure": {
        "metricName": "Premium freight share of transport spend",
        "unit": "percent of spend",
        "baseline": 8.3,
        "volume": 214000,
        "defectRate": 0.083,
        "cycleTimeDays": 2.1,
        "costOfPoorQuality": 318000,
        "dataSource": "Transport spend analysis, premium service codes",
        "trend": [
          {
            "date": "2026-07-16",
            "value": 9.4
          },
          {
            "date": "2026-07-30",
            "value": 9.1
          },
          {
            "date": "2026-08-13",
            "value": 8.8
          },
          {
            "date": "2026-08-27",
            "value": 8.5
          },
          {
            "date": "2026-09-07",
            "value": 8.3
          }
        ]
      },
      "analyze": {
        "causeIds": [
          "cse-01",
          "cse-11",
          "cse-19"
        ],
        "fmeaIds": [
          "fma-01",
          "fma-02",
          "fma-05"
        ],
        "hypothesis": "Premium freight is concentrated in loads where the booking failed or customs held the load, rather than being spread evenly across lanes.",
        "finding": "In progress. Early analysis attributes 61% of premium spend to two failure modes: booking message rejection and customs commodity code corrections. Both are already on the FMEA with actions open."
      },
      "improve": {
        "countermeasures": [
          {
            "id": "dmc-02-cm-1",
            "description": "Build the in-house invoice adapter to remove booking rejections",
            "expectedImprovementPct": 0.4,
            "ownerId": "own-06",
            "pilotScope": "Two tier 1 carriers first",
            "dueDate": "2026-09-08",
            "status": "piloting"
          },
          {
            "id": "dmc-02-cm-2",
            "description": "Automate the customs declaration handover",
            "expectedImprovementPct": 0.25,
            "ownerId": "own-07",
            "pilotScope": "Cross-border consolidated loads",
            "dueDate": "2026-09-16",
            "status": "planned"
          },
          {
            "id": "dmc-02-cm-3",
            "description": "Enforce slot booking as a hard constraint",
            "expectedImprovementPct": 0.12,
            "ownerId": "own-08",
            "pilotScope": "Milan hub",
            "dueDate": "2026-09-24",
            "status": "planned"
          }
        ]
      },
      "control": {
        "controlMetric": "Monthly premium freight share of spend",
        "upperControlLimit": 4.1,
        "lowerControlLimit": 0.0,
        "monitoringFrequency": "monthly",
        "escalationTrigger": "Any month above 5% after wave 1 cutover, or any week with more than 20 booking rejections",
        "ownerId": "own-05",
        "linkedControlIds": [
          "ctl-02",
          "ctl-17",
          "ctl-25"
        ]
      },
      "linkedRiskIds": [
        "rsk-01",
        "rsk-03",
        "rsk-14"
      ]
    }
  ],
  "metrics": [
    {
      "id": "met-01",
      "name": "Critical attribute defect rate",
      "unit": "percent",
      "workstreamId": "ws-int",
      "target": 1.5,
      "series": [
        {
          "date": "2026-06-16",
          "value": 2.9
        },
        {
          "date": "2026-06-30",
          "value": 3.0
        },
        {
          "date": "2026-07-14",
          "value": 3.1
        },
        {
          "date": "2026-07-28",
          "value": 3.3
        },
        {
          "date": "2026-08-11",
          "value": 3.4
        },
        {
          "date": "2026-08-25",
          "value": 3.5
        },
        {
          "date": "2026-09-07",
          "value": 3.4
        }
      ],
      "direction": "lower-is-better"
    },
    {
      "id": "met-02",
      "name": "Open severity 2 UAT defects",
      "unit": "defects",
      "workstreamId": "ws-tms",
      "target": 22,
      "series": [
        {
          "date": "2026-06-28",
          "value": 12
        },
        {
          "date": "2026-07-12",
          "value": 19
        },
        {
          "date": "2026-07-26",
          "value": 31
        },
        {
          "date": "2026-08-09",
          "value": 38
        },
        {
          "date": "2026-08-23",
          "value": 44
        },
        {
          "date": "2026-09-07",
          "value": 47
        }
      ],
      "direction": "lower-is-better"
    },
    {
      "id": "met-03",
      "name": "Premium freight share of spend",
      "unit": "percent",
      "workstreamId": "ws-tms",
      "target": 4.1,
      "series": [
        {
          "date": "2026-07-16",
          "value": 9.4
        },
        {
          "date": "2026-07-30",
          "value": 9.1
        },
        {
          "date": "2026-08-13",
          "value": 8.8
        },
        {
          "date": "2026-08-27",
          "value": 8.5
        },
        {
          "date": "2026-09-07",
          "value": 8.3
        }
      ],
      "direction": "lower-is-better"
    },
    {
      "id": "met-04",
      "name": "On-time in-full delivery performance",
      "unit": "percent",
      "workstreamId": "ws-ctl",
      "target": 97.2,
      "series": [
        {
          "date": "2026-06-28",
          "value": 91.2
        },
        {
          "date": "2026-07-18",
          "value": 91.4
        },
        {
          "date": "2026-08-07",
          "value": 91.6
        },
        {
          "date": "2026-08-25",
          "value": 91.9
        },
        {
          "date": "2026-09-07",
          "value": 91.8
        }
      ],
      "direction": "higher-is-better"
    },
    {
      "id": "met-05",
      "name": "Super-users certified",
      "unit": "people",
      "workstreamId": "ws-chg",
      "target": 90,
      "series": [
        {
          "date": "2026-07-18",
          "value": 8
        },
        {
          "date": "2026-08-01",
          "value": 22
        },
        {
          "date": "2026-08-15",
          "value": 38
        },
        {
          "date": "2026-08-29",
          "value": 49
        },
        {
          "date": "2026-09-07",
          "value": 55
        }
      ],
      "direction": "higher-is-better"
    },
    {
      "id": "met-06",
      "name": "Freight cost per consolidated load",
      "unit": "EUR",
      "workstreamId": "ws-net",
      "target": 318,
      "series": [
        {
          "date": "2026-04-29",
          "value": 409
        },
        {
          "date": "2026-05-29",
          "value": 401
        },
        {
          "date": "2026-06-28",
          "value": 392
        },
        {
          "date": "2026-07-28",
          "value": 383
        },
        {
          "date": "2026-08-27",
          "value": 374
        },
        {
          "date": "2026-09-07",
          "value": 371
        }
      ],
      "direction": "lower-is-better"
    }
  ]
};

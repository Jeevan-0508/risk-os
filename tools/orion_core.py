"""ORION demo programme: people, structure, schedule, benefits, dependencies.

Every generated object references an id that exists. gen_orion.py runs a
referential-integrity check over the assembled programme before emitting
TypeScript, so a broken link fails the build rather than shipping silently.
"""

from datetime import date, timedelta

START = date(2025, 9, 1)
END = date(2026, 10, 31)
STATUS = date(2026, 9, 9)

BUDGET = 8_400_000
SPEND_TO_DATE = 5_940_000
FORECAST_SPEND = 8_915_000
CURRENCY = "EUR"


def iso(d):
    return d.isoformat()


def day(offset):
    """Date offset in days from programme start."""
    return iso(START + timedelta(days=offset))


OWNERS = [
    ("own-01", "Anneke Vermeulen", "Programme Director", None),
    ("own-02", "Tomas Bergstrom", "Programme Manager", None),
    ("own-03", "Priya Raman", "Risk and Assurance Lead", None),
    ("own-04", "Luca Moretti", "Network Design Lead", "ws-net"),
    ("own-05", "Sofia Alvarez", "TMS Delivery Lead", "ws-tms"),
    ("own-06", "Daniel Okonkwo", "Integration Architect", "ws-int"),
    ("own-07", "Marta Kowalski", "Carrier Compliance Lead", "ws-car"),
    ("own-08", "Henrik Larsen", "Warehouse Automation Lead", "ws-wms"),
    ("own-09", "Aisha Rahman", "Control Tower Product Owner", "ws-ctl"),
    ("own-10", "Jonas Weber", "Change and Adoption Lead", "ws-chg"),
    ("own-11", "Chloe Fontaine", "Finance Business Partner", None),
    ("own-12", "Ravi Menon", "Data Quality Manager", "ws-int"),
    ("own-13", "Elena Petrova", "Security and Compliance Officer", None),
    ("own-14", "Stefan Mueller", "Vendor Management Lead", None),
    ("own-15", "Karin Jensen", "Operations Readiness Manager", "ws-chg"),
]


def build_owners():
    out = []
    for oid, name, role, ws in OWNERS:
        o = {"id": oid, "name": name, "role": role}
        if ws:
            o["workstreamId"] = ws
        out.append(o)
    return out


WORKSTREAMS = [
    ("ws-net", "NET", "Network Design and Hub Consolidation", "own-04", 0, 380, 1_260_000, 1_180_000, 82, "in-progress",
     "Redesign of the European hub network from eleven sites to seven, including two new consolidation hubs."),
    ("ws-tms", "TMS", "Transport Management System", "own-05", 20, 400, 2_180_000, 1_610_000, 71, "at-risk",
     "Replacement of three regional legacy transport systems with a single configured TMS platform."),
    ("ws-int", "INT", "Integration and Data Platform", "own-06", 30, 410, 1_540_000, 1_120_000, 64, "at-risk",
     "Carrier APIs, master data remediation and the event backbone that every other workstream consumes."),
    ("ws-car", "CAR", "Carrier Onboarding and Compliance", "own-07", 45, 405, 720_000, 505_000, 68, "in-progress",
     "Contractual, customs and compliance onboarding of 34 carriers onto the new operating model."),
    ("ws-wms", "WMS", "Warehouse Automation", "own-08", 60, 415, 1_760_000, 1_055_000, 58, "at-risk",
     "Goods-to-person automation at the Milan and Frankfurt consolidation hubs."),
    ("ws-ctl", "CTL", "Control Tower and Analytics", "own-09", 90, 420, 620_000, 330_000, 51, "in-progress",
     "Single operational control tower with exception management and predictive ETA."),
    ("ws-chg", "CHG", "Change, Training and Adoption", "own-10", 75, 425, 320_000, 140_000, 44, "in-progress",
     "Operational readiness, training and the benefit handover into the run organisation."),
]


def build_workstreams():
    out = []
    for wid, code, name, lead, s, e, budget, spend, pct, status, desc in WORKSTREAMS:
        out.append({
            "id": wid,
            "name": name,
            "code": code,
            "description": desc,
            "leadOwnerId": lead,
            "startDate": day(s),
            "endDate": day(e),
            "budget": budget,
            "spendToDate": spend,
            "percentComplete": pct,
            "status": status,
        })
    return out


# id, name, ws, owner, baseline offset, forecast offset, actual offset or None,
# status, isGate, predecessors, description
MILESTONES = [
    ("ms-01", "Network baseline and scenario model", "ws-net", "own-04", 45, 45, 44, "complete", True, [],
     "Validated baseline of flows, cost-to-serve and eleven-site network model."),
    ("ms-02", "Hub consolidation business case approved", "ws-net", "own-01", 90, 96, 96, "complete", True, ["ms-01"],
     "Investment committee approval of the seven-hub target network."),
    ("ms-03", "Frankfurt hub lease executed", "ws-net", "own-04", 165, 172, 172, "complete", False, ["ms-02"],
     "Head of terms and lease signature for the northern consolidation hub."),
    ("ms-04", "Milan hub fit-out complete", "ws-net", "own-04", 300, 318, 318, "complete", False, ["ms-02"],
     "Civil works, racking and power provisioning for the southern consolidation hub."),
    ("ms-05", "Network cutover wave 1", "ws-net", "own-04", 395, 412, None, "at-risk", True, ["ms-04", "ms-24"],
     "First physical flow cutover covering Italy, Austria and Slovenia."),

    ("ms-06", "TMS vendor selected", "ws-tms", "own-14", 75, 82, 82, "complete", True, ["ms-01"],
     "Competitive selection and contract award for the target transport platform."),
    ("ms-07", "TMS design authority sign-off", "ws-tms", "own-05", 150, 158, 158, "complete", True, ["ms-06"],
     "Solution design baselined and approved by the design authority."),
    ("ms-08", "TMS configuration build complete", "ws-tms", "own-05", 290, 309, 309, "complete", False, ["ms-07"],
     "All in-scope configuration objects built and unit tested in the TMS."),
    ("ms-09", "TMS UAT exit", "ws-tms", "own-05", 350, 378, None, "at-risk", True, ["ms-08", "ms-13"],
     "User acceptance testing exit criteria met with no severity 1 or 2 defects open."),
    ("ms-10", "TMS go-live wave 1", "ws-tms", "own-05", 380, 403, None, "at-risk", True, ["ms-09", "ms-14"],
     "Production cutover of the first wave of lanes onto the new platform."),

    ("ms-11", "Integration architecture approved", "ws-int", "own-06", 120, 126, 126, "complete", True, ["ms-07"],
     "Event backbone, API gateway and canonical data model approved."),
    ("ms-12", "Data migration dry run 1", "ws-int", "own-06", 240, 251, 251, "complete", False, ["ms-11"],
     "First full-volume extract, transform and load rehearsal into the target platform."),
    ("ms-13", "Carrier API integration complete", "ws-int", "own-06", 320, 349, None, "at-risk", False, ["ms-11"],
     "Bidirectional booking, tracking and invoice APIs live for all tier 1 carriers."),
    ("ms-14", "Security testing sign-off", "ws-int", "own-13", 355, 381, None, "at-risk", True, ["ms-13"],
     "Penetration test and threat model closure for the integration estate."),
    ("ms-15", "Data quality remediation complete", "ws-int", "own-12", 300, 331, None, "at-risk", False, ["ms-12"],
     "Master data defect backlog cleared to the agreed exit threshold."),

    ("ms-16", "Carrier compliance framework published", "ws-car", "own-07", 135, 140, 140, "complete", False, ["ms-02"],
     "Contractual, insurance and customs compliance standard issued to all carriers."),
    ("ms-17", "Tier 1 carrier onboarding complete", "ws-car", "own-07", 310, 322, 322, "complete", False, ["ms-16", "ms-13"],
     "Twelve tier 1 carriers contracted, integrated and operationally verified."),
    ("ms-18", "Tier 2 carrier onboarding complete", "ws-car", "own-07", 370, 380, None, "not-started", False, ["ms-17"],
     "Remaining twenty-two carriers onboarded to the new compliance standard."),
    ("ms-19", "Customs broker integration live", "ws-car", "own-07", 335, 361, 361, "complete", False, ["ms-13", "ms-16"],
     "Automated customs declaration handover for cross-border consolidated loads."),
    ("ms-20", "Carrier scorecard live", "ws-car", "own-07", 390, 396, None, "not-started", False, ["ms-18", "ms-26"],
     "Automated carrier performance scorecard published monthly from control tower data."),

    ("ms-21", "Automation vendor contract signed", "ws-wms", "own-14", 130, 137, 137, "complete", True, ["ms-02"],
     "Contract award for goods-to-person automation at both consolidation hubs."),
    ("ms-22", "Milan automation install complete", "ws-wms", "own-08", 340, 376, None, "at-risk", False, ["ms-21", "ms-04"],
     "Mechanical installation and power-on of the Milan goods-to-person system."),
    ("ms-23", "Automation commissioning and FAT", "ws-wms", "own-08", 375, 404, None, "at-risk", True, ["ms-22"],
     "Factory acceptance test passed at contractual throughput and availability."),
    ("ms-24", "Warehouse go-live wave 1", "ws-wms", "own-08", 392, 409, None, "at-risk", False, ["ms-23"],
     "First operational shift running through the automated Milan hub."),

    ("ms-25", "Control tower MVP live", "ws-ctl", "own-09", 285, 292, 292, "complete", False, ["ms-11"],
     "Exception dashboards and shipment visibility live for the pilot region."),
    ("ms-26", "Reporting suite v1 released", "ws-ctl", "own-09", 320, 344, None, "at-risk", False, ["ms-25", "ms-15"],
     "Operational and financial reporting pack released to the run organisation."),
    ("ms-27", "Predictive ETA model in production", "ws-ctl", "own-09", 385, 391, None, "not-started", False, ["ms-26"],
     "Machine-learning ETA model deployed with monitoring and drift alerting."),
    ("ms-28", "Control tower full rollout", "ws-ctl", "own-09", 405, 411, None, "not-started", False, ["ms-27", "ms-10"],
     "Control tower extended to all seven hubs and all in-scope lanes."),

    ("ms-29", "Change impact assessment complete", "ws-chg", "own-10", 200, 206, 206, "complete", False, ["ms-07"],
     "Role-level impact assessment across 1,340 affected operational staff."),
    ("ms-30", "Super-user training delivered", "ws-chg", "own-10", 345, 356, 356, "complete", False, ["ms-08", "ms-29"],
     "Ninety super-users trained and certified on the new operating process."),
    ("ms-31", "Go-live readiness review", "ws-chg", "own-15", 372, 397, None, "at-risk", True, ["ms-30", "ms-10", "ms-24"],
     "Formal readiness gate covering process, people, data and cutover rehearsal."),
    ("ms-32", "Customer launch and benefit handover", "ws-chg", "own-01", 415, 425, None, "at-risk", True, ["ms-31", "ms-05"],
     "External customer launch and formal handover of benefit ownership to operations."),
]


def build_milestones():
    out = []
    for mid, name, ws, owner, base, fc, actual, status, gate, preds, desc in MILESTONES:
        m = {
            "id": mid,
            "name": name,
            "workstreamId": ws,
            "ownerId": owner,
            "baselineDate": day(base),
            "forecastDate": day(fc),
            "status": status,
            "isGate": gate,
            "predecessorIds": list(preds),
            "deliverableIds": [],
            "description": desc,
        }
        if actual is not None:
            m["actualDate"] = day(actual)
        out.append(m)
    return out


# milestone, name, owner, due offset, status, pct, acceptance
DELIVERABLES = [
    ("ms-01", "Cost-to-serve baseline model", "own-11", 42, "complete", 100, "Signed off by finance with variance under 2% against the general ledger."),
    ("ms-02", "Seven-hub network business case", "own-04", 94, "complete", 100, "Investment committee minute recording approval."),
    ("ms-04", "Milan hub fit-out completion certificate", "own-04", 316, "complete", 100, "Landlord and safety authority sign-off obtained."),
    ("ms-05", "Wave 1 cutover runbook", "own-15", 405, "in-progress", 41, "Rehearsed end to end with rollback proven within four hours."),
    ("ms-06", "TMS evaluation and award recommendation", "own-14", 80, "complete", 100, "Scored against weighted criteria with procurement counter-signature."),
    ("ms-07", "TMS solution design document", "own-05", 156, "complete", 100, "Approved by design authority with no open severity 1 comments."),
    ("ms-08", "Configured TMS build, waves 1 to 3", "own-05", 305, "complete", 100, "All configuration objects unit tested and version controlled."),
    ("ms-09", "UAT exit report", "own-05", 370, "not-started", 12, "Zero severity 1 and 2 defects, business sign-off recorded."),
    ("ms-10", "Production cutover plan", "own-05", 399, "in-progress", 34, "Cutover, rollback and hypercare plan approved by the steering committee."),
    ("ms-11", "Integration architecture and canonical model", "own-06", 124, "complete", 100, "Approved by the architecture review board."),
    ("ms-12", "Migration dry run 1 report", "own-12", 249, "complete", 100, "Load completeness above 99.5% with a defect log raised."),
    ("ms-13", "Carrier API contract suite", "own-06", 345, "at-risk", 62, "Booking, tracking and invoice endpoints certified with each tier 1 carrier."),
    ("ms-14", "Penetration test report and remediation log", "own-13", 379, "not-started", 8, "No open high or critical findings at sign-off."),
    ("ms-15", "Master data remediation exit report", "own-12", 328, "at-risk", 55, "Defect rate at or below 1.5% on the eight critical data attributes."),
    ("ms-16", "Carrier compliance standard", "own-07", 138, "complete", 100, "Issued to all carriers with acknowledgement tracked."),
    ("ms-17", "Tier 1 onboarding evidence pack", "own-07", 320, "complete", 100, "Contract, insurance, customs and integration evidence per carrier."),
    ("ms-19", "Customs declaration interface", "own-07", 358, "complete", 100, "End-to-end declaration submitted and cleared in the test environment."),
    ("ms-21", "Automation supply contract", "own-14", 135, "complete", 100, "Executed contract including throughput and availability warranties."),
    ("ms-22", "Milan mechanical installation certificate", "own-08", 370, "at-risk", 46, "Installation verified against layout drawings and CE documentation."),
    ("ms-23", "Factory acceptance test protocol and results", "own-08", 402, "not-started", 5, "Sustained throughput of 1,850 units per hour over four hours."),
    ("ms-25", "Control tower MVP release", "own-09", 290, "complete", 100, "Pilot region users able to manage exceptions without legacy tooling."),
    ("ms-26", "Operational and financial reporting pack", "own-09", 341, "at-risk", 49, "Reconciles to finance within 1% for three consecutive periods."),
    ("ms-29", "Role level change impact assessment", "own-10", 204, "complete", 100, "Reviewed with each hub manager and works council."),
    ("ms-30", "Super-user certification register", "own-10", 353, "complete", 100, "Ninety certified super-users recorded with assessment scores."),
    ("ms-31", "Go-live readiness scorecard", "own-15", 394, "not-started", 15, "All readiness criteria green or with an accepted deviation."),
    ("ms-32", "Benefit handover pack", "own-11", 422, "not-started", 6, "Benefit owner, measure and reporting cadence agreed in writing."),
]


def build_deliverables(milestones):
    out = []
    by_id = {m["id"]: m for m in milestones}
    for i, (ms, name, owner, due, status, pct, acc) in enumerate(DELIVERABLES, start=1):
        did = "dlv-%02d" % i
        out.append({
            "id": did,
            "name": name,
            "milestoneId": ms,
            "ownerId": owner,
            "dueDate": day(due),
            "status": status,
            "percentComplete": pct,
            "acceptanceCriteria": acc,
        })
        by_id[ms]["deliverableIds"].append(did)
    return out


# id, ref, name, type, owner, expected, realised, measure, baseline, target,
# current, start offset, target offset, status, enabling milestones
BENEFITS = [
    ("ben-01", "BEN-01", "Freight cost reduction from hub consolidation", "financial", "own-11",
     3_600_000, 1_180_000, "Freight cost per consolidated load", 412.0, 318.0, 371.0, 200, 425, "in-progress",
     ["ms-05", "ms-24"]),
    ("ben-02", "BEN-02", "Carrier rate optimisation through competitive tendering", "financial", "own-07",
     2_400_000, 1_340_000, "Weighted average rate index", 100.0, 88.0, 92.5, 150, 400, "in-progress",
     ["ms-17", "ms-18", "ms-20"]),
    ("ben-03", "BEN-03", "Warehouse labour productivity uplift", "efficiency", "own-08",
     1_800_000, 240_000, "Units picked per labour hour", 78.0, 132.0, 86.0, 340, 425, "at-risk",
     ["ms-23", "ms-24"]),
    ("ben-04", "BEN-04", "Reduction in premium and expedited freight", "financial", "own-05",
     1_200_000, 155_000, "Premium freight as share of spend", 0.094, 0.041, 0.083, 320, 420, "at-risk",
     ["ms-10", "ms-13", "ms-32"]),
    ("ben-05", "BEN-05", "Inventory carrying cost reduction", "financial", "own-11",
     1_500_000, 420_000, "Average days of inventory on hand", 34.0, 26.0, 31.5, 260, 425, "in-progress",
     ["ms-05", "ms-25"]),
    ("ben-06", "BEN-06", "Claims and damage reduction", "efficiency", "own-15",
     900_000, 310_000, "Claims per thousand shipments", 4.8, 2.6, 3.9, 220, 410, "in-progress",
     ["ms-24", "ms-30"]),
    ("ben-07", "BEN-07", "Customs and compliance penalty avoidance", "compliance", "own-07",
     800_000, 190_000, "Customs corrections per month", 62.0, 12.0, 44.0, 240, 415, "at-risk",
     ["ms-19", "ms-16"]),
    ("ben-08", "BEN-08", "Service level uplift protecting at-risk revenue", "customer", "own-09",
     1_400_000, 0, "On-time in-full delivery performance", 0.912, 0.972, 0.918, 350, 425, "at-risk",
     ["ms-23", "ms-26", "ms-28"]),
    ("ben-09", "BEN-09", "Legacy transport system decommission savings", "financial", "own-05",
     600_000, 0, "Annual legacy licence and hosting cost", 600_000.0, 0.0, 600_000.0, 380, 425, "not-started",
     ["ms-10", "ms-28"]),
]

# risk ids that threaten each benefit, wired in orion_risk.
BENEFIT_THREATS = {
    "ben-01": ["rsk-04", "rsk-22", "rsk-31"],
    "ben-02": ["rsk-11", "rsk-17"],
    "ben-03": ["rsk-06", "rsk-07", "rsk-33"],
    "ben-04": ["rsk-01", "rsk-02", "rsk-03"],
    "ben-05": ["rsk-22", "rsk-27"],
    "ben-06": ["rsk-19", "rsk-33"],
    "ben-07": ["rsk-14", "rsk-15"],
    "ben-08": ["rsk-06", "rsk-09", "rsk-13"],
    "ben-09": ["rsk-02", "rsk-24"],
}

BENEFIT_CHANGES = {
    "ben-01": ["chg-02"],
    "ben-03": ["chg-07"],
    "ben-04": ["chg-05", "chg-11"],
    "ben-07": ["chg-09"],
    "ben-08": ["chg-05"],
    "ben-09": ["chg-12"],
}

BENEFIT_DECISIONS = {
    "ben-01": ["dec-01"],
    "ben-03": ["dec-06"],
    "ben-04": ["dec-02", "dec-04"],
    "ben-08": ["dec-03"],
}


def build_benefits():
    out = []
    for (bid, ref, name, btype, owner, expected, realised, measure, baseline, target,
         current, s, t, status, enabling) in BENEFITS:
        # Realisation history ramps from the start date to the status date.
        history = []
        steps = 7
        for k in range(1, steps + 1):
            offset = s + int((min(t, 373) - s) * k / steps)
            if START + timedelta(days=offset) > STATUS:
                break
            share = (k / steps) ** 1.4
            history.append({"date": day(offset), "realisedValue": round(realised * share)})
        if history:
            history[-1]["realisedValue"] = realised
        out.append({
            "id": bid,
            "ref": ref,
            "name": name,
            "description": name + " measured as " + measure + ", tracked monthly by the benefit owner against the pre-programme baseline.",
            "type": btype,
            "ownerId": owner,
            "expectedValue": expected,
            "realisedValue": realised,
            "measure": measure,
            "baseline": baseline,
            "target": target,
            "current": current,
            "startDate": day(s),
            "targetDate": day(t),
            "status": status,
            "enablingMilestoneIds": list(enabling),
            "threateningRiskIds": list(BENEFIT_THREATS.get(bid, [])),
            "linkedChangeIds": list(BENEFIT_CHANGES.get(bid, [])),
            "linkedDecisionIds": list(BENEFIT_DECISIONS.get(bid, [])),
            "history": history,
        })
    return out

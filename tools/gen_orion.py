"""Assembles the ORION demo programme and emits src/data/orion.ts.

Relationships are declared once on the owning side and inverted here, then the
whole graph is checked for dangling references. If any reference does not
resolve the script exits non-zero and no file is written.
"""

import io
import json
import os
import sys

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

from orion_core import (BUDGET, CURRENCY, END, FORECAST_SPEND, SPEND_TO_DATE, START, STATUS, day,
                        build_owners, build_workstreams, build_milestones, build_deliverables,
                        build_benefits, iso)
from orion_deps import DEP_RISKS, build_dependencies, dep_id
from orion_risk import ACTIONS, CAUSES, CONTROLS
from orion_register import ASSUMPTIONS, ISSUES, RISKS, build_history
from orion_changes import CHANGES
from orion_decisions import DECISIONS
from orion_sixsigma import DMAIC, FMEA, METRICS


def lower_id(ref):
    return ref.lower()


def build_causes():
    out = []
    for (ref, title, category, is_root, freq, owner, whys, risks, issues) in CAUSES:
        out.append({
            "id": lower_id(ref),
            "ref": ref,
            "title": title,
            "description": whys[0] + " " + (whys[1] if len(whys) > 1 else ""),
            "category": category,
            "isRootCause": is_root,
            "whyChain": list(whys),
            "frequency": freq,
            "linkedRiskIds": list(risks),
            "linkedIssueIds": list(issues),
            "ownerId": owner,
        })
    return out


def build_controls():
    out = []
    for (ref, name, ctype, owner, freq, design, operating, evidence, last, nxt,
         automated, status, risks, description) in CONTROLS:
        c = {
            "id": lower_id(ref),
            "ref": ref,
            "name": name,
            "description": description,
            "type": ctype,
            "ownerId": owner,
            "frequency": freq,
            "designEffectiveness": design,
            "operatingEffectiveness": operating,
            "evidenceRef": evidence,
            "automated": automated,
            "linkedRiskIds": list(risks),
            "status": status,
        }
        if last is not None:
            c["lastTested"] = day(last)
        if nxt is not None:
            c["nextTest"] = day(nxt)
        out.append(c)
    return out


def build_actions():
    out = []
    for (ref, title, owner, due, completed, status, priority, risks, issues, deps,
         reduction, pct, description) in ACTIONS:
        a = {
            "id": lower_id(ref),
            "ref": ref,
            "title": title,
            "description": description,
            "ownerId": owner,
            "dueDate": day(due),
            "status": status,
            "priority": priority,
            "linkedRiskIds": list(risks),
            "linkedIssueIds": [lower_id(i) for i in issues],
            "linkedDependencyIds": [dep_id(d) for d in deps],
            "expectedRiskReduction": reduction,
            "percentComplete": pct,
        }
        if completed is not None:
            a["completedDate"] = day(completed)
        out.append(a)
    return out


def build_issues():
    out = []
    for (ref, title, owner, ws, priority, status, raised, target, resolved,
         cost, days, origin, causes, milestones, description) in ISSUES:
        i = {
            "id": lower_id(ref),
            "ref": ref,
            "title": title,
            "description": description,
            "ownerId": owner,
            "workstreamId": ws,
            "priority": priority,
            "status": status,
            "dateRaised": day(raised),
            "targetResolution": day(target),
            "actualCostImpact": cost,
            "actualScheduleImpactDays": days,
            "causeIds": [lower_id(c) for c in causes],
            "actionIds": [],
            "affectedMilestoneIds": list(milestones),
            "evidence": [{
                "id": lower_id(ref) + "-ev1",
                "label": "Issue log entry and impact assessment",
                "kind": "system-record",
                "date": day(raised + 2),
                "source": "Programme issue log",
                "confidence": "verified",
            }],
            "comments": [{
                "id": lower_id(ref) + "-cm1",
                "authorId": owner,
                "date": day(min(target, 371)),
                "body": "Impact recorded at " + str(cost) + " " + CURRENCY + " and " + str(days) + " days. Status reviewed at the weekly issue forum.",
            }],
        }
        if resolved is not None:
            i["resolvedDate"] = day(resolved)
        if origin is not None:
            i["originRiskId"] = origin
        out.append(i)
    return out


def build_assumptions():
    out = []
    for (ref, statement, owner, status, confidence, validation, risk, milestones, note) in ASSUMPTIONS:
        a = {
            "id": lower_id(ref),
            "ref": ref,
            "statement": statement,
            "ownerId": owner,
            "status": status,
            "confidence": confidence,
            "validationDate": day(validation),
            "linkedMilestoneIds": list(milestones),
            "note": note,
        }
        if risk is not None:
            a["riskIfFalseId"] = risk
        out.append(a)
    return out


def build_changes():
    out = []
    for (cid, ref, title, requester, raised, reason, scope, cost, days, resource,
         risk_impact, benefit, workstreams, milestones, deps, benefits, risks,
         decision, maker, decided, rationale, status, description) in CHANGES:
        c = {
            "id": cid,
            "ref": ref,
            "title": title,
            "description": description,
            "requesterId": requester,
            "reason": reason,
            "raisedDate": day(raised),
            "scopeImpact": scope,
            "costImpact": cost,
            "scheduleImpactDays": days,
            "resourceImpact": resource,
            "riskImpact": risk_impact,
            "benefitImpact": benefit,
            "affectedWorkstreamIds": list(workstreams),
            "affectedMilestoneIds": list(milestones),
            "affectedDependencyIds": [dep_id(d) for d in deps],
            "affectedBenefitIds": list(benefits),
            "linkedRiskIds": list(risks),
            "decision": decision,
            "status": status,
        }
        if maker is not None:
            c["decisionMakerId"] = maker
        if decided is not None:
            c["decisionDate"] = day(decided)
        if rationale is not None:
            c["decisionRationale"] = rationale
        out.append(c)
    return out


def build_decisions():
    out = []
    for (did, ref, title, context, owner, maker, forum, required, decided, review,
         status, options, chosen, rationale, expected, actual, score, risks,
         changes, benefits, milestones, evidence) in DECISIONS:
        option_objs = []
        for k, (label, pros, cons, cost, days, residual) in enumerate(options, start=1):
            option_objs.append({
                "id": did + "-opt-" + str(k),
                "label": label,
                "pros": list(pros),
                "cons": list(cons),
                "estimatedCost": cost,
                "estimatedScheduleDays": days,
                "residualRiskNote": residual,
            })
        d = {
            "id": did,
            "ref": ref,
            "title": title,
            "context": context,
            "ownerId": owner,
            "decisionMakerId": maker,
            "forum": forum,
            "dateRequired": day(required),
            "status": status,
            "options": option_objs,
            "evidence": [{
                "id": did + "-ev-" + str(k),
                "label": label,
                "kind": kind,
                "date": day(off),
                "source": source,
                "confidence": conf,
            } for k, (label, kind, off, source, conf) in enumerate(evidence, start=1)],
            "expectedOutcome": expected,
            "linkedRiskIds": list(risks),
            "linkedChangeIds": list(changes),
            "linkedBenefitIds": list(benefits),
            "linkedMilestoneIds": list(milestones),
        }
        if decided is not None:
            d["dateDecided"] = day(decided)
        if review is not None:
            d["reviewDate"] = day(review)
        if chosen is not None:
            d["chosenOptionId"] = option_objs[chosen]["id"]
        if rationale is not None:
            d["rationale"] = rationale
        if actual is not None:
            d["actualOutcome"] = actual
        if score is not None:
            d["outcomeScore"] = score
        out.append(d)
    return out


def fmea_id(ref):
    return "fma-" + ref.split("-")[1]


def build_fmea():
    out = []
    for (ref, process, step, mode, effect, cause, s, o, dt, existing, recommended,
         owner, due, action_status, ps, po, pd, risks, causes, controls) in FMEA:
        out.append({
            "id": fmea_id(ref),
            "ref": ref,
            "process": process,
            "processStep": step,
            "failureMode": mode,
            "effect": effect,
            "cause": cause,
            "severity": s,
            "occurrence": o,
            "detection": dt,
            "existingControl": existing,
            "recommendedAction": recommended,
            "ownerId": owner,
            "dueDate": day(due),
            "actionStatus": action_status,
            "postSeverity": ps,
            "postOccurrence": po,
            "postDetection": pd,
            "linkedRiskIds": list(risks),
            "linkedCauseIds": [lower_id(c) for c in causes],
            "linkedControlIds": [lower_id(c) for c in controls],
        })
    return out


def build_dmaic():
    out = []
    for p in DMAIC:
        out.append({
            "id": p["id"],
            "ref": p["ref"],
            "name": p["name"],
            "ownerId": p["ownerId"],
            "phase": p["phase"],
            "startDate": day(p["start"]),
            "targetDate": day(p["target"]),
            "define": {
                "problemStatement": p["define"]["problemStatement"],
                "businessImpact": p["define"]["businessImpact"],
                "customerImpact": p["define"]["customerImpact"],
                "ctq": list(p["define"]["ctq"]),
                "inScope": list(p["define"]["inScope"]),
                "outOfScope": list(p["define"]["outOfScope"]),
                "goalStatement": p["define"]["goalStatement"],
            },
            "measure": {
                "metricName": p["measure"]["metricName"],
                "unit": p["measure"]["unit"],
                "baseline": p["measure"]["baseline"],
                "volume": p["measure"]["volume"],
                "defectRate": p["measure"]["defectRate"],
                "cycleTimeDays": p["measure"]["cycleTimeDays"],
                "costOfPoorQuality": p["measure"]["costOfPoorQuality"],
                "dataSource": p["measure"]["dataSource"],
                "trend": [{"date": day(off), "value": val} for off, val in p["measure"]["trend"]],
            },
            "analyze": {
                "causeIds": [lower_id(c) for c in p["analyze"]["causeIds"]],
                "fmeaIds": [fmea_id(f) for f in p["analyze"]["fmeaIds"]],
                "hypothesis": p["analyze"]["hypothesis"],
                "finding": p["analyze"]["finding"],
            },
            "improve": {
                "countermeasures": [{
                    "id": p["id"] + "-cm-" + str(k),
                    "description": desc,
                    "expectedImprovementPct": pct,
                    "ownerId": owner,
                    "pilotScope": pilot,
                    "dueDate": day(due),
                    "status": status,
                } for k, (desc, pct, owner, pilot, due, status) in enumerate(p["improve"], start=1)],
            },
            "control": {
                "controlMetric": p["control"]["controlMetric"],
                "upperControlLimit": p["control"]["ucl"],
                "lowerControlLimit": p["control"]["lcl"],
                "monitoringFrequency": p["control"]["frequency"],
                "escalationTrigger": p["control"]["escalationTrigger"],
                "ownerId": p["control"]["ownerId"],
                "linkedControlIds": [lower_id(c) for c in p["control"]["linkedControlIds"]],
            },
            "linkedRiskIds": list(p["riskIds"]),
        })
    return out


def build_metrics():
    return [{
        "id": mid,
        "name": name,
        "unit": unit,
        "workstreamId": ws,
        "target": target,
        "series": [{"date": day(off), "value": val} for off, val in series],
        "direction": direction,
    } for mid, name, unit, ws, target, direction, series in METRICS]


def build_risks(controls, actions, causes, dependencies, issues, benefits):
    control_map = {}
    for c in controls:
        for rid in c["linkedRiskIds"]:
            control_map.setdefault(rid, []).append(c["id"])
    action_map = {}
    for a in actions:
        for rid in a["linkedRiskIds"]:
            action_map.setdefault(rid, []).append(a["id"])
    cause_map = {}
    for c in causes:
        for rid in c["linkedRiskIds"]:
            cause_map.setdefault(rid, []).append(c["id"])
    dep_map = {}
    for ref, rids in DEP_RISKS.items():
        for rid in rids:
            dep_map.setdefault(rid, []).append(dep_id(ref))
    issue_map = {}
    for i in issues:
        origin = i.get("originRiskId")
        if origin:
            issue_map.setdefault(origin, []).append(i["id"])
    benefit_map = {}
    for b in benefits:
        for rid in b["threateningRiskIds"]:
            benefit_map.setdefault(rid, []).append(b["id"])

    out = []
    for (rid, ref, title, category, owner, ws, status, strategy, prob, impact,
         financial, sched, strategic, reputation, horizon, confidence,
         milestones, trajectory, identified, review, tags, description) in RISKS:
        history = build_history(identified, prob, impact, financial, trajectory)
        linked_issues = issue_map.get(rid, [])
        evidence = [{
            "id": rid + "-ev1",
            "label": "Exposure reassessed at the period 12 risk review",
            "kind": "meeting",
            "date": day(370),
            "source": "Programme risk review forum",
            "confidence": confidence,
        }]
        if linked_issues:
            evidence.append({
                "id": rid + "-ev2",
                "label": "Realised as issue " + linked_issues[0].upper(),
                "kind": "system-record",
                "date": day(360),
                "source": "Programme issue log",
                "confidence": "verified",
            })
        actions_for_risk = action_map.get(rid, [])
        comments = [{
            "id": rid + "-cm1",
            "authorId": owner,
            "date": day(370),
            "body": ("Trend and exposure are taken from the recorded history rather than a manual rating. "
                     + ("Primary mitigation is " + actions_for_risk[0].upper() + ". " if actions_for_risk else "No mitigating action is currently open. ")
                     + str(len(control_map.get(rid, []))) + " control(s) are linked."),
        }]
        out.append({
            "id": rid,
            "ref": ref,
            "title": title,
            "description": description,
            "category": category,
            "ownerId": owner,
            "workstreamId": ws,
            "status": status,
            "dateIdentified": day(identified),
            "reviewDate": day(review),
            "strategy": strategy,
            "inherentProbability": prob,
            "inherentImpact": impact,
            "inherentFinancialImpact": financial,
            "inherentScheduleImpactDays": sched,
            "strategicImpact": strategic,
            "reputationImpact": reputation,
            "timeHorizon": horizon,
            "evidenceConfidence": confidence,
            "controlIds": control_map.get(rid, []),
            "causeIds": cause_map.get(rid, []),
            "actionIds": actions_for_risk,
            "affectedMilestoneIds": list(milestones),
            "affectedBenefitIds": benefit_map.get(rid, []),
            "dependencyIds": dep_map.get(rid, []),
            "issueIds": linked_issues,
            "history": history,
            "evidence": evidence,
            "comments": comments,
            "tags": list(tags),
        })
    return out


def assemble():
    owners = build_owners()
    workstreams = build_workstreams()
    milestones = build_milestones()
    deliverables = build_deliverables(milestones)
    benefits = build_benefits()
    dependencies = build_dependencies()
    causes = build_causes()
    controls = build_controls()
    actions = build_actions()
    issues = build_issues()
    assumptions = build_assumptions()
    changes = build_changes()
    decisions = build_decisions()
    fmea = build_fmea()
    dmaic = build_dmaic()
    metrics = build_metrics()
    risks = build_risks(controls, actions, causes, dependencies, issues, benefits)

    # Actions declare their issue links; mirror them onto the issues.
    issue_index = {i["id"]: i for i in issues}
    for a in actions:
        for iid in a["linkedIssueIds"]:
            if iid in issue_index:
                issue_index[iid]["actionIds"].append(a["id"])

    return {
        "id": "prog-orion",
        "name": "European Logistics Transformation",
        "codename": "ORION",
        "description": ("Consolidation of eleven European distribution sites into seven hubs, replacement of three "
                        "regional transport systems with a single platform, goods-to-person automation at two "
                        "consolidation hubs, and a single operational control tower. Fourteen month programme "
                        "delivering 14.2M of benefit against an 8.4M budget."),
        "sponsor": "Anneke Vermeulen, Programme Director",
        "programManager": "Tomas Bergstrom",
        "startDate": iso(START),
        "endDate": iso(END),
        "statusDate": iso(STATUS),
        "budget": BUDGET,
        "spendToDate": SPEND_TO_DATE,
        "forecastSpend": FORECAST_SPEND,
        "currency": CURRENCY,
        "businessUnit": "European Logistics",
        "strategicPriority": "critical",
        "programStatus": "active",
        "strategicObjectives": [
            "Reduce European freight cost per consolidated load from 412 to 318",
            "Operate a single transport platform and a single operational control tower",
            "Raise on-time in-full delivery performance from 91.2% to 97.2%",
            "Remove the compliance exposure created by eleven locally managed carrier estates",
        ],
        "owners": owners,
        "workstreams": workstreams,
        "milestones": milestones,
        "deliverables": deliverables,
        "risks": risks,
        "causes": causes,
        "controls": controls,
        "actions": actions,
        "issues": issues,
        "assumptions": assumptions,
        "dependencies": dependencies,
        "changes": changes,
        "decisions": decisions,
        "benefits": benefits,
        "fmea": fmea,
        "dmaic": dmaic,
        "metrics": metrics,
    }


def check(program):
    """Referential integrity check. Returns a list of problems."""
    problems = []
    ids = {k: {x["id"] for x in program[k]} for k in
           ["owners", "workstreams", "milestones", "deliverables", "risks", "causes", "controls",
            "actions", "issues", "assumptions", "dependencies", "changes", "decisions", "benefits",
            "fmea", "dmaic", "metrics"]}

    def ref(where, kind, value):
        if value is None:
            return
        if value not in ids[kind]:
            problems.append(where + " -> missing " + kind[:-1] + " " + repr(value))

    def refs(where, kind, values):
        for v in values or []:
            ref(where, kind, v)

    for w in program["workstreams"]:
        ref("workstream " + w["id"], "owners", w["leadOwnerId"])
    for m in program["milestones"]:
        ref("milestone " + m["id"], "workstreams", m["workstreamId"])
        ref("milestone " + m["id"], "owners", m["ownerId"])
        refs("milestone " + m["id"] + " predecessors", "milestones", m["predecessorIds"])
        refs("milestone " + m["id"] + " deliverables", "deliverables", m["deliverableIds"])
    for d in program["deliverables"]:
        ref("deliverable " + d["id"], "milestones", d["milestoneId"])
        ref("deliverable " + d["id"], "owners", d["ownerId"])
    for r in program["risks"]:
        ref("risk " + r["id"], "owners", r["ownerId"])
        ref("risk " + r["id"], "workstreams", r["workstreamId"])
        refs("risk " + r["id"] + " controls", "controls", r["controlIds"])
        refs("risk " + r["id"] + " causes", "causes", r["causeIds"])
        refs("risk " + r["id"] + " actions", "actions", r["actionIds"])
        refs("risk " + r["id"] + " milestones", "milestones", r["affectedMilestoneIds"])
        refs("risk " + r["id"] + " benefits", "benefits", r["affectedBenefitIds"])
        refs("risk " + r["id"] + " dependencies", "dependencies", r["dependencyIds"])
        refs("risk " + r["id"] + " issues", "issues", r["issueIds"])
        if not r["history"]:
            problems.append("risk " + r["id"] + " has no exposure history")
    for c in program["causes"]:
        ref("cause " + c["id"], "owners", c["ownerId"])
        refs("cause " + c["id"] + " risks", "risks", c["linkedRiskIds"])
        refs("cause " + c["id"] + " issues", "issues", c["linkedIssueIds"])
    for c in program["controls"]:
        ref("control " + c["id"], "owners", c["ownerId"])
        refs("control " + c["id"] + " risks", "risks", c["linkedRiskIds"])
    for a in program["actions"]:
        ref("action " + a["id"], "owners", a["ownerId"])
        refs("action " + a["id"] + " risks", "risks", a["linkedRiskIds"])
        refs("action " + a["id"] + " issues", "issues", a["linkedIssueIds"])
        refs("action " + a["id"] + " dependencies", "dependencies", a["linkedDependencyIds"])
    for i in program["issues"]:
        ref("issue " + i["id"], "owners", i["ownerId"])
        ref("issue " + i["id"], "workstreams", i["workstreamId"])
        ref("issue " + i["id"], "risks", i.get("originRiskId"))
        refs("issue " + i["id"] + " causes", "causes", i["causeIds"])
        refs("issue " + i["id"] + " actions", "actions", i["actionIds"])
        refs("issue " + i["id"] + " milestones", "milestones", i["affectedMilestoneIds"])
    for a in program["assumptions"]:
        ref("assumption " + a["id"], "owners", a["ownerId"])
        ref("assumption " + a["id"], "risks", a.get("riskIfFalseId"))
        refs("assumption " + a["id"] + " milestones", "milestones", a["linkedMilestoneIds"])
    for d in program["dependencies"]:
        ref("dependency " + d["id"], "owners", d["upstreamOwnerId"])
        ref("dependency " + d["id"], "owners", d["downstreamOwnerId"])
        refs("dependency " + d["id"] + " milestones", "milestones", d["affectedMilestoneIds"])
        refs("dependency " + d["id"] + " benefits", "benefits", d["affectedBenefitIds"])
        refs("dependency " + d["id"] + " predecessors", "dependencies", d["predecessorIds"])
        refs("dependency " + d["id"] + " risks", "risks", d["linkedRiskIds"])
    for c in program["changes"]:
        ref("change " + c["id"], "owners", c["requesterId"])
        ref("change " + c["id"], "owners", c.get("decisionMakerId"))
        refs("change " + c["id"] + " workstreams", "workstreams", c["affectedWorkstreamIds"])
        refs("change " + c["id"] + " milestones", "milestones", c["affectedMilestoneIds"])
        refs("change " + c["id"] + " dependencies", "dependencies", c["affectedDependencyIds"])
        refs("change " + c["id"] + " benefits", "benefits", c["affectedBenefitIds"])
        refs("change " + c["id"] + " risks", "risks", c["linkedRiskIds"])
    for d in program["decisions"]:
        ref("decision " + d["id"], "owners", d["ownerId"])
        ref("decision " + d["id"], "owners", d["decisionMakerId"])
        refs("decision " + d["id"] + " risks", "risks", d["linkedRiskIds"])
        refs("decision " + d["id"] + " changes", "changes", d["linkedChangeIds"])
        refs("decision " + d["id"] + " benefits", "benefits", d["linkedBenefitIds"])
        refs("decision " + d["id"] + " milestones", "milestones", d["linkedMilestoneIds"])
        if d.get("chosenOptionId") and d["chosenOptionId"] not in [o["id"] for o in d["options"]]:
            problems.append("decision " + d["id"] + " chosen option does not exist")
    for b in program["benefits"]:
        ref("benefit " + b["id"], "owners", b["ownerId"])
        refs("benefit " + b["id"] + " milestones", "milestones", b["enablingMilestoneIds"])
        refs("benefit " + b["id"] + " risks", "risks", b["threateningRiskIds"])
        refs("benefit " + b["id"] + " changes", "changes", b["linkedChangeIds"])
        refs("benefit " + b["id"] + " decisions", "decisions", b["linkedDecisionIds"])
    for f in program["fmea"]:
        ref("fmea " + f["id"], "owners", f["ownerId"])
        refs("fmea " + f["id"] + " risks", "risks", f["linkedRiskIds"])
        refs("fmea " + f["id"] + " causes", "causes", f["linkedCauseIds"])
        refs("fmea " + f["id"] + " controls", "controls", f["linkedControlIds"])
    for p in program["dmaic"]:
        ref("dmaic " + p["id"], "owners", p["ownerId"])
        refs("dmaic " + p["id"] + " causes", "causes", p["analyze"]["causeIds"])
        refs("dmaic " + p["id"] + " fmea", "fmea", p["analyze"]["fmeaIds"])
        refs("dmaic " + p["id"] + " controls", "controls", p["control"]["linkedControlIds"])
        ref("dmaic " + p["id"] + " control owner", "owners", p["control"]["ownerId"])
        for cm in p["improve"]["countermeasures"]:
            ref("dmaic countermeasure " + cm["id"], "owners", cm["ownerId"])
    for m in program["metrics"]:
        ref("metric " + m["id"], "workstreams", m.get("workstreamId"))

    # Every risk must connect to something, otherwise it is decoration.
    for r in program["risks"]:
        connections = (len(r["controlIds"]) + len(r["causeIds"]) + len(r["actionIds"])
                       + len(r["affectedMilestoneIds"]) + len(r["affectedBenefitIds"]))
        if connections == 0:
            problems.append("risk " + r["id"] + " is not connected to any other object")
    return problems


def main():
    program = assemble()
    problems = check(program)
    if problems:
        print("Referential integrity FAILED with " + str(len(problems)) + " problem(s):")
        for p in problems[:60]:
            print("  " + p)
        return 1

    counts = {k: len(v) for k, v in program.items() if isinstance(v, list)}
    print("Referential integrity OK. Counts:")
    for k in sorted(counts):
        print("  " + k + ": " + str(counts[k]))
    print("  benefit expected total: " + str(sum(b["expectedValue"] for b in program["benefits"])))
    print("  benefit realised total: " + str(sum(b["realisedValue"] for b in program["benefits"])))

    body = json.dumps(program, indent=2, ensure_ascii=True)
    header = (
        "// GENERATED FILE. Do not edit by hand.\n"
        "// Produced by tools/gen_orion.py, which validates every cross-reference\n"
        "// in the programme before writing. Re-generate with:\n"
        "//   python tools/gen_orion.py\n"
        "import type { Program } from '@/domain/types';\n\n"
        "export const orionProgram: Program = "
    )
    out_path = os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), "src", "data", "orion.ts")
    os.makedirs(os.path.dirname(out_path), exist_ok=True)
    with io.open(out_path, "w", encoding="utf-8", newline="\n") as f:
        f.write(header + body + ";\n")
    print("wrote " + out_path + " (" + str(len(body)) + " bytes of data)")
    return 0


if __name__ == "__main__":
    sys.exit(main())

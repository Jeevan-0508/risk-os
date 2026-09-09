"""Builds ATLAS, NOVA and HELIOS -- three demo programmes that sit alongside
ORION in the RISK//OS portfolio. Each is a real, self-contained Program object
(same shape ORION's generator produces) with deliberate, hand-declared
cross-programme relationships wired up separately in gen_portfolio_links.py.

Referential integrity is checked before any file is written, the same
discipline gen_orion.py applies to ORION itself.
"""
import json
import os
import sys
from datetime import date, timedelta

def day(start, offset):
    return (start + timedelta(days=offset)).isoformat()

def build_program(p):
    start = date.fromisoformat(p["start"])
    owners = [{"id": o[0], "name": o[1], "role": o[2], **({"workstreamId": o[3]} if o[3] else {})} for o in p["owners"]]

    workstreams = []
    for (wid, code, name, lead, s_off, e_off, budget, spend, pct, status, desc) in p["workstreams"]:
        workstreams.append({
            "id": wid, "name": name, "code": code, "description": desc, "leadOwnerId": lead,
            "startDate": day(start, s_off), "endDate": day(start, e_off), "budget": budget,
            "spendToDate": spend, "percentComplete": pct, "status": status,
        })

    milestones = []
    for (mid, name, ws, owner, base_off, fc_off, status, gate, preds, delivs, desc) in p["milestones"]:
        m = {
            "id": mid, "name": name, "workstreamId": ws, "ownerId": owner,
            "baselineDate": day(start, base_off), "forecastDate": day(start, fc_off),
            "status": status, "isGate": gate, "predecessorIds": list(preds),
            "deliverableIds": list(delivs), "description": desc,
        }
        milestones.append(m)

    deliverables = []
    for (did, name, ms, owner, due_off, status, pct, ac) in p["deliverables"]:
        deliverables.append({
            "id": did, "name": name, "milestoneId": ms, "ownerId": owner, "dueDate": day(start, due_off),
            "status": status, "percentComplete": pct, "acceptanceCriteria": ac,
        })

    causes = []
    for (cid, ref, title, category, is_root, freq, owner, whys, risks, issues) in p["causes"]:
        causes.append({
            "id": cid, "ref": ref, "title": title, "description": whys[0], "category": category,
            "isRootCause": is_root, "whyChain": list(whys), "frequency": freq,
            "linkedRiskIds": list(risks), "linkedIssueIds": list(issues), "ownerId": owner,
        })

    controls = []
    for (cid, ref, name, ctype, owner, freq, design, operating, evidence, last, nxt, automated, status, risks, desc) in p["controls"]:
        c = {
            "id": cid, "ref": ref, "name": name, "description": desc, "type": ctype, "ownerId": owner,
            "frequency": freq, "designEffectiveness": design, "operatingEffectiveness": operating,
            "evidenceRef": evidence, "automated": automated, "linkedRiskIds": list(risks), "status": status,
        }
        if last is not None:
            c["lastTested"] = day(start, last)
        if nxt is not None:
            c["nextTest"] = day(start, nxt)
        controls.append(c)

    actions = []
    for (aid, ref, title, owner, due_off, completed_off, status, priority, risks, issues, deps, reduction, pct, desc) in p["actions"]:
        a = {
            "id": aid, "ref": ref, "title": title, "description": desc, "ownerId": owner, "dueDate": day(start, due_off),
            "status": status, "priority": priority, "linkedRiskIds": list(risks), "linkedIssueIds": list(issues),
            "linkedDependencyIds": list(deps), "expectedRiskReduction": reduction, "percentComplete": pct,
        }
        if completed_off is not None:
            a["completedDate"] = day(start, completed_off)
        actions.append(a)

    issues = []
    for (iid, ref, title, owner, ws, priority, status, raised_off, target_off, resolved_off, cost, sched, origin, causeIds, actionIds, msIds, desc) in p["issues"]:
        it = {
            "id": iid, "ref": ref, "title": title, "description": desc, "ownerId": owner, "workstreamId": ws,
            "priority": priority, "status": status, "dateRaised": day(start, raised_off), "targetResolution": day(start, target_off),
            "actualCostImpact": cost, "actualScheduleImpactDays": sched, "causeIds": list(causeIds), "actionIds": list(actionIds),
            "affectedMilestoneIds": list(msIds), "evidence": [], "comments": [],
        }
        if resolved_off is not None:
            it["resolvedDate"] = day(start, resolved_off)
        if origin:
            it["originRiskId"] = origin
        issues.append(it)

    assumptions = []
    for (aid, ref, statement, owner, status, confidence, val_off, risk_if_false, ms_ids, note) in p["assumptions"]:
        assumptions.append({
            "id": aid, "ref": ref, "statement": statement, "ownerId": owner, "status": status, "confidence": confidence,
            "validationDate": day(start, val_off), **({"riskIfFalseId": risk_if_false} if risk_if_false else {}),
            "linkedMilestoneIds": list(ms_ids), "note": note,
        })

    dependencies = []
    for (did, ref, name, dtype, upstream, up_owner, downstream, down_owner, due_off, status, crit, delay_p, delay_days, ms_ids, benefit_ids, preds, risk_ids, desc) in p["dependencies"]:
        dependencies.append({
            "id": did, "ref": ref, "name": name, "description": desc, "type": dtype, "upstream": upstream,
            "upstreamOwnerId": up_owner, "downstream": downstream, "downstreamOwnerId": down_owner, "dueDate": day(start, due_off),
            "status": status, "criticality": crit, "delayProbability": delay_p, "potentialDelayDays": delay_days,
            "affectedMilestoneIds": list(ms_ids), "affectedBenefitIds": list(benefit_ids), "predecessorIds": list(preds),
            "linkedRiskIds": list(risk_ids),
        })

    changes = []
    for (chid, ref, title, requester, reason, raised_off, scope, cost, sched, resource, riskimp, benefit, ws_ids, ms_ids, dep_ids, ben_ids, risk_ids, decision, dm, dd_off, rationale, status, desc) in p["changes"]:
        c = {
            "id": chid, "ref": ref, "title": title, "description": desc, "requesterId": requester, "reason": reason,
            "raisedDate": day(start, raised_off), "scopeImpact": scope, "costImpact": cost, "scheduleImpactDays": sched,
            "resourceImpact": resource, "riskImpact": riskimp, "benefitImpact": benefit, "affectedWorkstreamIds": list(ws_ids),
            "affectedMilestoneIds": list(ms_ids), "affectedDependencyIds": list(dep_ids), "affectedBenefitIds": list(ben_ids),
            "linkedRiskIds": list(risk_ids), "decision": decision, "status": status,
        }
        if dm:
            c["decisionMakerId"] = dm
        if dd_off is not None:
            c["decisionDate"] = day(start, dd_off)
        if rationale:
            c["decisionRationale"] = rationale
        changes.append(c)

    decisions = []
    for (did, ref, title, context, owner, dm, forum, req_off, options, dd_off, rev_off, status, chosen, rationale, expected, actual, score, risk_ids, change_ids, ben_ids, ms_ids) in p["decisions"]:
        d = {
            "id": did, "ref": ref, "title": title, "context": context, "ownerId": owner, "decisionMakerId": dm, "forum": forum,
            "dateRequired": day(start, req_off), "status": status, "options": options, "evidence": [], "expectedOutcome": expected,
            "linkedRiskIds": list(risk_ids), "linkedChangeIds": list(change_ids), "linkedBenefitIds": list(ben_ids), "linkedMilestoneIds": list(ms_ids),
        }
        if dd_off is not None:
            d["dateDecided"] = day(start, dd_off)
        if rev_off is not None:
            d["reviewDate"] = day(start, rev_off)
        if chosen:
            d["chosenOptionId"] = chosen
        if rationale:
            d["rationale"] = rationale
        if actual:
            d["actualOutcome"] = actual
        if score:
            d["outcomeScore"] = score
        decisions.append(d)

    benefits = []
    for (bid, ref, name, btype, owner, expected, realised, measure, baseline, target, current, start_off, target_off, status, ms_ids, risk_ids, change_ids, decision_ids, history) in p["benefits"]:
        benefits.append({
            "id": bid, "ref": ref, "name": name, "description": name, "type": btype, "ownerId": owner, "expectedValue": expected,
            "realisedValue": realised, "measure": measure, "baseline": baseline, "target": target, "current": current,
            "startDate": day(start, start_off), "targetDate": day(start, target_off), "status": status,
            "enablingMilestoneIds": list(ms_ids), "threateningRiskIds": list(risk_ids), "linkedChangeIds": list(change_ids),
            "linkedDecisionIds": list(decision_ids), "history": [{"date": day(start, o), "realisedValue": v} for (o, v) in history],
        })

    risks = []
    for r in p["risks"]:
        risk = {
            "id": r["id"], "ref": r["ref"], "title": r["title"], "description": r["description"], "category": r["category"],
            "ownerId": r["owner"], "workstreamId": r["workstream"], "status": r["status"], "dateIdentified": day(start, r["identifiedOffset"]),
            "reviewDate": day(start, r["reviewOffset"]), "strategy": r["strategy"], "inherentProbability": r["probability"],
            "inherentImpact": r["impact"], "inherentFinancialImpact": r["financialImpact"], "inherentScheduleImpactDays": r["scheduleDays"],
            "strategicImpact": r["strategic"], "reputationImpact": r["reputation"], "timeHorizon": r["horizon"],
            "evidenceConfidence": r["confidence"], "controlIds": list(r.get("controlIds", [])), "causeIds": list(r.get("causeIds", [])),
            "actionIds": list(r.get("actionIds", [])), "affectedMilestoneIds": list(r.get("milestones", [])),
            "affectedBenefitIds": list(r.get("benefits", [])), "dependencyIds": list(r.get("dependencies", [])),
            "issueIds": list(r.get("issues", [])), "evidence": [], "comments": [], "tags": list(r.get("tags", [])),
            "history": [{"date": day(start, o), "probability": pr, "impactScore": im, "financialExposure": fe} for (o, pr, im, fe) in r["history"]],
        }
        if r.get("vendor"):
            risk["vendor"] = r["vendor"]
        if r.get("sharedRiskGroupId"):
            risk["sharedRiskGroupId"] = r["sharedRiskGroupId"]
        risks.append(risk)

    fmea = []
    for (fid, ref, process, step, mode, effect, cause, sev, occ, det, existing, rec, owner, due_off, status, post_sev, post_occ, post_det, risk_ids, cause_ids, control_ids) in p["fmea"]:
        fmea.append({
            "id": fid, "ref": ref, "process": process, "processStep": step, "failureMode": mode, "effect": effect, "cause": cause,
            "severity": sev, "occurrence": occ, "detection": det, "existingControl": existing, "recommendedAction": rec, "ownerId": owner,
            "dueDate": day(start, due_off), "actionStatus": status, "postSeverity": post_sev, "postOccurrence": post_occ, "postDetection": post_det,
            "linkedRiskIds": list(risk_ids), "linkedCauseIds": list(cause_ids), "linkedControlIds": list(control_ids),
        })

    metrics = []
    for (mid, name, unit, ws, target, direction, series) in p["metrics"]:
        metrics.append({
            "id": mid, "name": name, "unit": unit, **({"workstreamId": ws} if ws else {}), "target": target, "direction": direction,
            "series": [{"date": day(start, o), "value": v} for (o, v) in series],
        })

    program = {
        "id": p["id"], "name": p["name"], "codename": p["codename"], "description": p["description"], "sponsor": p["sponsor"],
        "programManager": p["programManager"], "startDate": p["start"], "endDate": p["end"], "statusDate": p["status_date"],
        "budget": p["budget"], "spendToDate": p["spendToDate"], "forecastSpend": p["forecastSpend"], "currency": p["currency"],
        "businessUnit": p["businessUnit"], "strategicPriority": p["strategicPriority"], "programStatus": p["programStatus"],
        "createdAt": p["start"], "updatedAt": p["status_date"], "strategicObjectives": p["strategicObjectives"], "owners": owners,
        "workstreams": workstreams, "milestones": milestones, "deliverables": deliverables, "risks": risks, "causes": causes,
        "controls": controls, "actions": actions, "issues": issues, "assumptions": assumptions, "dependencies": dependencies,
        "changes": changes, "decisions": decisions, "benefits": benefits, "fmea": fmea, "dmaic": [], "metrics": metrics,
        "treatments": [], "acceptances": [],
    }
    return program


def check_references(program):
    errors = []
    def pool(items):
        return {i["id"] for i in items}
    owners = pool(program["owners"]); ws = pool(program["workstreams"]); ms = pool(program["milestones"])
    dels = pool(program["deliverables"]); risks = pool(program["risks"]); causes = pool(program["causes"])
    controls = pool(program["controls"]); actions = pool(program["actions"]); issues = pool(program["issues"])
    deps = pool(program["dependencies"]); benefits = pool(program["benefits"])

    def check(label, ids, allowed):
        for i in ids:
            if i and i not in allowed:
                errors.append(label + " -> missing id " + repr(i))

    for o in program["owners"]:
        if o.get("workstreamId"):
            check("owner.workstreamId", [o["workstreamId"]], ws)
    for m in program["milestones"]:
        check("milestone.workstreamId", [m["workstreamId"]], ws)
        check("milestone.ownerId", [m["ownerId"]], owners)
        check("milestone.predecessorIds", m["predecessorIds"], ms)
        check("milestone.deliverableIds", m["deliverableIds"], dels)
    for d in program["deliverables"]:
        check("deliverable.milestoneId", [d["milestoneId"]], ms)
        check("deliverable.ownerId", [d["ownerId"]], owners)
    for r in program["risks"]:
        check("risk.ownerId", [r["ownerId"]], owners)
        check("risk.workstreamId", [r["workstreamId"]], ws)
        check("risk.controlIds", r["controlIds"], controls)
        check("risk.causeIds", r["causeIds"], causes)
        check("risk.actionIds", r["actionIds"], actions)
        check("risk.affectedMilestoneIds", r["affectedMilestoneIds"], ms)
        check("risk.affectedBenefitIds", r["affectedBenefitIds"], benefits)
        check("risk.dependencyIds", r["dependencyIds"], deps)
        check("risk.issueIds", r["issueIds"], issues)
    for c in program["causes"]:
        check("cause.ownerId", [c["ownerId"]], owners)
        check("cause.linkedRiskIds", c["linkedRiskIds"], risks)
        check("cause.linkedIssueIds", c["linkedIssueIds"], issues)
    for c in program["controls"]:
        check("control.ownerId", [c["ownerId"]], owners)
        check("control.linkedRiskIds", c["linkedRiskIds"], risks)
    for a in program["actions"]:
        check("action.ownerId", [a["ownerId"]], owners)
        check("action.linkedRiskIds", a["linkedRiskIds"], risks)
        check("action.linkedIssueIds", a["linkedIssueIds"], issues)
        check("action.linkedDependencyIds", a["linkedDependencyIds"], deps)
    for i in program["issues"]:
        check("issue.ownerId", [i["ownerId"]], owners)
        check("issue.workstreamId", [i["workstreamId"]], ws)
        check("issue.causeIds", i["causeIds"], causes)
        check("issue.actionIds", i["actionIds"], actions)
        check("issue.affectedMilestoneIds", i["affectedMilestoneIds"], ms)
        if i.get("originRiskId"):
            check("issue.originRiskId", [i["originRiskId"]], risks)
    for a in program["assumptions"]:
        check("assumption.ownerId", [a["ownerId"]], owners)
        check("assumption.linkedMilestoneIds", a["linkedMilestoneIds"], ms)
        if a.get("riskIfFalseId"):
            check("assumption.riskIfFalseId", [a["riskIfFalseId"]], risks)
    for d in program["dependencies"]:
        check("dependency.upstreamOwnerId", [d["upstreamOwnerId"]], owners)
        check("dependency.downstreamOwnerId", [d["downstreamOwnerId"]], owners)
        check("dependency.affectedMilestoneIds", d["affectedMilestoneIds"], ms)
        check("dependency.affectedBenefitIds", d["affectedBenefitIds"], benefits)
        check("dependency.predecessorIds", d["predecessorIds"], deps)
        check("dependency.linkedRiskIds", d["linkedRiskIds"], risks)
    for c in program["changes"]:
        check("change.requesterId", [c["requesterId"]], owners)
        check("change.affectedWorkstreamIds", c["affectedWorkstreamIds"], ws)
        check("change.affectedMilestoneIds", c["affectedMilestoneIds"], ms)
        check("change.affectedDependencyIds", c["affectedDependencyIds"], deps)
        check("change.affectedBenefitIds", c["affectedBenefitIds"], benefits)
        check("change.linkedRiskIds", c["linkedRiskIds"], risks)
        if c.get("decisionMakerId"):
            check("change.decisionMakerId", [c["decisionMakerId"]], owners)
    for d in program["decisions"]:
        check("decision.ownerId", [d["ownerId"]], owners)
        check("decision.decisionMakerId", [d["decisionMakerId"]], owners)
        check("decision.linkedRiskIds", d["linkedRiskIds"], risks)
        check("decision.linkedChangeIds", d["linkedChangeIds"], [c["id"] for c in program["changes"]])
        check("decision.linkedBenefitIds", d["linkedBenefitIds"], benefits)
        check("decision.linkedMilestoneIds", d["linkedMilestoneIds"], ms)
    for b in program["benefits"]:
        check("benefit.ownerId", [b["ownerId"]], owners)
        check("benefit.enablingMilestoneIds", b["enablingMilestoneIds"], ms)
        check("benefit.threateningRiskIds", b["threateningRiskIds"], risks)
        check("benefit.linkedChangeIds", b["linkedChangeIds"], [c["id"] for c in program["changes"]])
        check("benefit.linkedDecisionIds", b["linkedDecisionIds"], [d["id"] for d in program["decisions"]])
    for f in program["fmea"]:
        check("fmea.ownerId", [f["ownerId"]], owners)
        check("fmea.linkedRiskIds", f["linkedRiskIds"], risks)
        check("fmea.linkedCauseIds", f["linkedCauseIds"], causes)
        check("fmea.linkedControlIds", f["linkedControlIds"], controls)
    return errors


def emit_ts(program, out_path, module_export_name):
    lines = []
    lines.append("// GENERATED FILE. Do not edit by hand.")
    lines.append("// Produced by tools/gen_satellite.py. Re-generate with:")
    lines.append("//   python tools/gen_satellite.py")
    lines.append("import type { Program } from '@/domain/types';")
    lines.append("")
    lines.append("export const " + module_export_name + ": Program = " + json.dumps(program, indent=2) + ";")
    lines.append("")
    with open(out_path, "w", encoding="utf-8", newline="\n") as f:
        f.write("\n".join(lines))

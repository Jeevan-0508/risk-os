"""ORION risk register (41 risks) plus issues and assumptions.

Risk tuple order:
  id, ref, title, category, owner, workstream, status, strategy,
  probability, impact, financialImpact, scheduleDays, strategic, reputation,
  horizon, confidence, affectedMilestones, trajectory, identifiedOffset,
  reviewOffset, tags, description
"""

from orion_core import day

# Trajectory shapes drive the generated exposure history. Only three risks are
# given the accelerating shape, so the "accelerating" count in the UI is a
# property of the data rather than a hardcoded headline.
RISKS = [
    ("rsk-01", "RSK-01", "TMS vendor cannot deliver the carrier API specification to plan", "vendor", "own-14", "ws-int",
     "escalated", "mitigate", 0.85, 4, 940_000, 21, 4, 3, "immediate", "verified",
     ["ms-13", "ms-14", "ms-10"], "accel", 244, 380, ["vendor", "critical-path", "scenario-a"],
     "The vendor released the carrier API specification without the invoice message schema. Without it the invoice leg of the carrier integration cannot be built, which holds the integration milestone and every gate behind it."),
    ("rsk-02", "RSK-02", "Security testing identifies critical findings too late to remediate", "security", "own-13", "ws-int",
     "escalated", "mitigate", 0.55, 4, 620_000, 18, 3, 4, "near", "measured",
     ["ms-14", "ms-10"], "deteriorate", 210, 378, ["security", "gate", "scenario-a"],
     "Penetration testing sits as a single end-stage gate. A critical finding raised at that point cannot be remediated inside the cutover window, so the go-live gate would fail on assurance rather than function."),
    ("rsk-03", "RSK-03", "Carrier API defects cause booking failures in the first operating week", "technology", "own-06", "ws-int",
     "open", "mitigate", 0.45, 5, 760_000, 12, 3, 4, "near", "measured",
     ["ms-13", "ms-10", "ms-32"], "flat", 262, 376, ["integration", "customer-impact", "scenario-a"],
     "If booking or tracking calls fail after cutover, loads revert to manual handling. Premium freight and customer credits follow immediately, which is the direct threat to the premium freight benefit."),
    ("rsk-04", "RSK-04", "Master data defects exceed the remediation exit threshold", "data", "own-12", "ws-int",
     "escalated", "mitigate", 0.8, 4, 680_000, 24, 3, 2, "immediate", "verified",
     ["ms-15", "ms-26", "ms-10"], "accel", 196, 379, ["data-quality", "scenario-b"],
     "The critical attribute defect rate is 3.4% against an exit threshold of 1.5% and the backlog is growing faster than the remediation team can clear it. Everything that reports off this data inherits the defect."),
    ("rsk-05", "RSK-05", "Integration platform cannot sustain peak event volume", "technology", "own-06", "ws-int",
     "monitoring", "mitigate", 0.3, 4, 420_000, 10, 3, 2, "mid", "indicative",
     ["ms-13", "ms-25"], "flat", 231, 386, ["platform", "capacity"],
     "Event throughput has only been proven at 4% of production volume. A capacity ceiling discovered after cutover would degrade visibility for every hub simultaneously."),
    ("rsk-06", "RSK-06", "Automation supplier capacity shortfall delays the Milan line", "vendor", "own-14", "ws-wms",
     "escalated", "mitigate", 0.9, 5, 1_150_000, 28, 4, 3, "immediate", "verified",
     ["ms-22", "ms-23", "ms-24"], "accel", 255, 377, ["vendor", "critical-path", "scenario-c"],
     "The supplier reallocated the Milan build slot and has not offered a firm replacement date. Commissioning, warehouse go-live and the network cutover all sit behind this single supplier constraint."),
    ("rsk-07", "RSK-07", "Milan power upgrade is not energised before installation", "operational", "own-04", "ws-wms",
     "monitoring", "mitigate", 0.5, 4, 380_000, 20, 2, 2, "near", "measured",
     ["ms-22", "ms-04"], "improve", 224, 381, ["infrastructure", "external", "scenario-c"],
     "The utility quoted a 26 week lead time against a fit-out plan that assumed 14. A generator bridge is being assessed, which costs money but de-couples the install from the utility date."),
    ("rsk-08", "RSK-08", "Automation throughput falls short of the contractual FAT figure", "technology", "own-08", "ws-wms",
     "open", "mitigate", 0.45, 4, 540_000, 15, 3, 2, "near", "indicative",
     ["ms-23", "ms-24"], "deteriorate", 268, 383, ["automation", "warranty"],
     "The throughput model used an annual average order profile. Against a real peak week the modelled figure drops by roughly 11%, which would fail the acceptance test and delay the payment milestone."),
    ("rsk-09", "RSK-09", "Reporting suite fails finance reconciliation and is not accepted", "data", "own-11", "ws-ctl",
     "open", "mitigate", 0.6, 3, 340_000, 14, 3, 2, "near", "measured",
     ["ms-26", "ms-20"], "deteriorate", 259, 375, ["reporting", "finance", "scenario-b"],
     "Operations and finance count different things, so the period 11 reconciliation variance was 4.1% against a 1% threshold. Without acceptance the run organisation cannot report benefit."),
    ("rsk-10", "RSK-10", "Control tower adoption stalls below the level the benefit case assumes", "people", "own-09", "ws-ctl",
     "monitoring", "mitigate", 0.4, 3, 290_000, 0, 3, 2, "mid", "indicative",
     ["ms-28", "ms-32"], "flat", 290, 388, ["adoption", "benefit"],
     "Users can still work around the control tower using legacy reports. If they do, exception handling stays local and the service level benefit does not materialise."),
    ("rsk-11", "RSK-11", "Tier 1 carriers refuse the standard data sharing terms", "vendor", "own-07", "ws-car",
     "monitoring", "mitigate", 0.35, 4, 460_000, 12, 3, 2, "near", "measured",
     ["ms-17", "ms-25"], "improve", 238, 380, ["carrier", "legal"],
     "Three carriers rejected the unlimited liability wording. The fallback clause is available but each fallback negotiation costs roughly three weeks of elapsed time."),
    ("rsk-12", "RSK-12", "Carrier rates increase between tender award and signature", "financial", "own-07", "ws-car",
     "monitoring", "transfer", 0.4, 3, 310_000, 0, 2, 1, "mid", "measured",
     ["ms-18"], "flat", 276, 384, ["commercial", "inflation"],
     "Awarded rates are held for 60 days. Slippage in onboarding pushes signature outside that window and exposes the rate to re-quotation."),
    ("rsk-13", "RSK-13", "UAT defect burn-down is too slow to hit the exit gate", "delivery", "own-05", "ws-tms",
     "escalated", "mitigate", 0.7, 4, 520_000, 22, 3, 2, "immediate", "verified",
     ["ms-09", "ms-10"], "deteriorate", 283, 374, ["testing", "critical-path"],
     "Forty-seven severity 2 defects are open against a curve that needed twenty-two by this point, and tester availability is running at 62% of committed days."),
    ("rsk-14", "RSK-14", "Customs broker interface is not certified before cross-border cutover", "regulatory", "own-07", "ws-car",
     "escalated", "mitigate", 0.75, 4, 590_000, 20, 3, 3, "immediate", "measured",
     ["ms-19", "ms-05"], "deteriorate", 249, 376, ["customs", "regulatory"],
     "The broker has not released an interface specification. Without automated declarations, cross-border consolidated loads revert to manual clearance with penalty and delay exposure."),
    ("rsk-15", "RSK-15", "Data protection constraints restrict carrier data flows", "regulatory", "own-13", "ws-int",
     "monitoring", "mitigate", 0.3, 4, 350_000, 10, 3, 3, "mid", "measured",
     ["ms-13", "ms-19"], "flat", 244, 383, ["gdpr", "regulatory"],
     "Two carrier data flows carry personal data of drivers. If the assessment restricts them, tracking granularity drops and the customs handover loses a data field."),
    ("rsk-16", "RSK-16", "Integration design knowledge is concentrated in one architect", "people", "own-06", "ws-int",
     "open", "mitigate", 0.4, 3, 240_000, 12, 2, 1, "near", "verified",
     ["ms-13", "ms-14"], "improve", 217, 382, ["key-person"],
     "Design rationale is not documented. During a two week absence in period 10, four integration decisions stalled, which is measured evidence rather than a theoretical concern."),
    ("rsk-17", "RSK-17", "Super-users are not released from operational rosters for training", "people", "own-10", "ws-chg",
     "open", "mitigate", 0.55, 3, 280_000, 14, 2, 2, "near", "measured",
     ["ms-30", "ms-31"], "deteriorate", 297, 373, ["training", "readiness"],
     "Attendance is running at 61% against a 90 super-user target. Readiness cannot be declared without certified super-users at each hub."),
    ("rsk-18", "RSK-18", "Cutover rollback cannot be completed inside the agreed window", "operational", "own-05", "ws-tms",
     "open", "mitigate", 0.35, 5, 720_000, 8, 4, 4, "near", "measured",
     ["ms-10", "ms-31"], "flat", 304, 379, ["cutover", "customer-impact"],
     "Rehearsal 1 rolled back in five hours ten minutes against a four hour window. A failed cutover that cannot be reversed inside the window becomes a customer-visible outage."),
    ("rsk-19", "RSK-19", "Warehouse recruitment shortfall at the Milan hub", "people", "own-15", "ws-wms",
     "monitoring", "mitigate", 0.45, 3, 260_000, 11, 2, 1, "near", "measured",
     ["ms-24"], "improve", 290, 381, ["recruitment"],
     "The pipeline is at 71% of the ramp-up curve in a labour market where three competing sites opened within twenty kilometres."),
    ("rsk-20", "RSK-20", "Works council objection delays the new role structure", "regulatory", "own-10", "ws-chg",
     "monitoring", "mitigate", 0.4, 4, 430_000, 24, 3, 3, "near", "verified",
     ["ms-31", "ms-05"], "improve", 262, 380, ["works-council", "regulatory"],
     "A formal objection was lodged because consultation began after the role design was fixed. A legally reviewed position paper is now in place and the objection is being worked."),
    ("rsk-21", "RSK-21", "Legacy transport system support is withdrawn before cutover completes", "vendor", "own-14", "ws-tms",
     "open", "mitigate", 0.3, 5, 640_000, 0, 3, 3, "mid", "indicative",
     ["ms-10", "ms-28"], "flat", 269, 385, ["legacy", "vendor"],
     "Legacy support expires at the end of Q1. With the go-live split into two waves, part of the estate would run unsupported unless the contract is extended in writing."),
    ("rsk-22", "RSK-22", "Operational business rules change after the configuration freeze", "delivery", "own-05", "ws-tms",
     "open", "mitigate", 0.6, 3, 390_000, 16, 2, 1, "near", "measured",
     ["ms-08", "ms-09"], "flat", 255, 377, ["scope", "rework"],
     "Rules were approved as principles rather than baselined rules, so every clarification lands as configuration rework inside an already tight build window."),
    ("rsk-23", "RSK-23", "Programme cost forecast exceeds the approved budget", "financial", "own-11", "ws-net",
     "monitoring", "mitigate", 0.65, 3, 515_000, 0, 3, 3, "immediate", "verified",
     ["ms-32"], "deteriorate", 203, 374, ["cost", "governance"],
     "The bottom-up re-forecast lands at 8.92M against an 8.40M approved budget, driven mainly by approved changes and contractor extensions."),
    ("rsk-24", "RSK-24", "Interface collision with the Commerce Replatform programme", "delivery", "own-02", "ws-int",
     "monitoring", "mitigate", 0.35, 4, 410_000, 18, 3, 2, "near", "measured",
     ["ms-10", "ms-32"], "improve", 231, 382, ["portfolio", "cross-programme"],
     "Both programmes booked change windows on the same order management interface. A shared calendar and collision review are now in place, which has reduced but not removed the exposure."),
    ("rsk-25", "RSK-25", "Hypercare capacity is insufficient for a two-wave go-live", "operational", "own-05", "ws-tms",
     "open", "mitigate", 0.4, 3, 270_000, 6, 2, 2, "near", "indicative",
     ["ms-10", "ms-31"], "flat", 311, 380, ["support", "cutover"],
     "Hypercare was sized for a single wave. Two waves stretch the same rota across a longer period with an overlap in the middle."),
    ("rsk-26", "RSK-26", "Carrier invoice reconciliation errors after go-live", "financial", "own-07", "ws-car",
     "monitoring", "mitigate", 0.5, 3, 320_000, 0, 2, 2, "mid", "measured",
     ["ms-17", "ms-20"], "flat", 276, 386, ["invoice", "finance"],
     "Six invoice formats are in use against a matching engine designed for two. Unmatched invoices become manual work and a rate leakage exposure."),
    ("rsk-27", "RSK-27", "Benefit baselines are disputed by finance at handover", "financial", "own-11", "ws-chg",
     "open", "mitigate", 0.55, 4, 480_000, 0, 4, 3, "near", "measured",
     ["ms-32"], "deteriorate", 283, 375, ["benefit", "governance", "scenario-b"],
     "Only four of nine benefit baselines are signed. An unsigned baseline at handover means the benefit cannot be claimed however well the programme delivers."),
    ("rsk-28", "RSK-28", "Expanded carrier connectivity increases cyber attack surface", "security", "own-13", "ws-int",
     "monitoring", "mitigate", 0.25, 5, 880_000, 14, 4, 5, "mid", "measured",
     ["ms-13", "ms-14"], "flat", 217, 384, ["cyber", "third-party"],
     "Thirty-four carrier connections replace three regional gateways. A compromise through a carrier connection would be both an operational and a reputational event."),
    ("rsk-29", "RSK-29", "Network cutover disrupts customer service levels", "operational", "own-04", "ws-net",
     "open", "mitigate", 0.45, 4, 610_000, 10, 4, 5, "near", "measured",
     ["ms-05", "ms-32"], "flat", 297, 378, ["customer-impact", "cutover"],
     "Wave 1 moves Italian, Austrian and Slovenian flows in a single weekend. Any degradation is immediately visible to customers rather than internal."),
    ("rsk-30", "RSK-30", "Frankfurt hub ramp-up is slower than the benefit model assumes", "operational", "own-04", "ws-net",
     "monitoring", "accept", 0.4, 3, 330_000, 0, 2, 1, "far", "indicative",
     ["ms-05"], "flat", 262, 390, ["ramp-up", "benefit"],
     "The benefit curve assumes a six week ramp to steady state. Comparable sites in the network took nine to eleven weeks."),
    ("rsk-31", "RSK-31", "Racking delivery shortfall blocks the Milan fit-out", "vendor", "own-14", "ws-net",
     "closed", "mitigate", 0.6, 3, 220_000, 12, 2, 1, "immediate", "verified",
     ["ms-04", "ms-22"], "improve", 269, 350, ["vendor", "closed"],
     "Two aisles were short-shipped. Expedited delivery closed the gap and the fit-out date was protected, so the risk was closed at the period 11 review."),
    ("rsk-32", "RSK-32", "Fuel and linehaul cost inflation erodes the savings case", "financial", "own-11", "ws-net",
     "accepted", "accept", 0.55, 3, 420_000, 0, 3, 1, "far", "measured",
     ["ms-32"], "flat", 210, 371, ["market", "accepted"],
     "Thirty-four percent of linehaul volume sits on spot rates. The exposure is accepted with a staged tender programme as the standing mitigation rather than a project action."),
    ("rsk-33", "RSK-33", "Automation availability stays below 97% through the first quarter", "technology", "own-08", "ws-wms",
     "open", "mitigate", 0.5, 4, 470_000, 0, 3, 2, "far", "indicative",
     ["ms-24", "ms-28"], "flat", 304, 388, ["automation", "availability"],
     "Comparable installations reach contractual availability after eight to twelve weeks. The benefit case assumes day one performance, which no comparable site achieved."),
    ("rsk-34", "RSK-34", "Insufficient test data volume masks defects until production", "data", "own-06", "ws-tms",
     "open", "mitigate", 0.5, 4, 450_000, 15, 3, 2, "near", "measured",
     ["ms-09", "ms-10"], "deteriorate", 290, 376, ["testing", "data"],
     "The test environment holds 4% of production volume. Volume-sensitive defects therefore cannot surface before cutover, which is why the UAT exit signal is weaker than it looks."),
    ("rsk-35", "RSK-35", "Predictive ETA model fails model risk review", "technology", "own-09", "ws-ctl",
     "open", "mitigate", 0.35, 2, 180_000, 12, 2, 2, "far", "indicative",
     ["ms-27"], "flat", 318, 385, ["analytics", "governance"],
     "The model has no documented risk assessment or drift monitoring. Model risk will not approve production use without both, which would delay the ETA capability rather than the go-live."),
    ("rsk-36", "RSK-36", "Change fatigue reduces process compliance after go-live", "people", "own-10", "ws-chg",
     "monitoring", "mitigate", 0.45, 3, 300_000, 0, 2, 2, "far", "anecdotal",
     ["ms-31", "ms-32"], "flat", 283, 389, ["adoption", "people"],
     "Operational teams are absorbing a fourth major change in two years. Reported willingness in the readiness survey fell from 74% to 58%."),
    ("rsk-37", "RSK-37", "Third party logistics partner contract gap at wave 1 cutover", "vendor", "own-07", "ws-car",
     "closed", "mitigate", 0.4, 3, 250_000, 10, 2, 1, "near", "verified",
     ["ms-05"], "improve", 255, 344, ["contract", "closed"],
     "A partner contract expired inside the cutover window. A bridging extension was signed in period 10 and the risk was closed."),
    ("rsk-38", "RSK-38", "Public commitment to a launch date that then slips", "reputational", "own-01", "ws-chg",
     "monitoring", "avoid", 0.3, 4, 400_000, 0, 4, 5, "near", "indicative",
     ["ms-32"], "flat", 311, 381, ["reputation", "communications"],
     "Commercial teams want to announce the launch date to customers. Announcing before the readiness gate converts a schedule risk into a reputational one."),
    ("rsk-39", "RSK-39", "Single carrier concentration on Italian lanes", "operational", "own-07", "ws-car",
     "accepted", "accept", 0.35, 4, 380_000, 8, 3, 2, "mid", "measured",
     ["ms-05", "ms-18"], "flat", 244, 372, ["concentration", "accepted"],
     "One carrier holds 46% of Italian volume against a 35% concentration limit. The exception is accepted for wave 1 with a standing concentration report."),
    ("rsk-40", "RSK-40", "Environmental permit night movement condition limits trunking", "regulatory", "own-04", "ws-net",
     "closed", "mitigate", 0.3, 3, 190_000, 14, 2, 2, "mid", "verified",
     ["ms-04", "ms-05"], "improve", 231, 338, ["permit", "closed"],
     "The Milan permit restricted movements between 23:00 and 05:00. The trunking plan was reworked to a 05:30 first departure and the risk was closed."),
    ("rsk-41", "RSK-41", "Knowledge transfer to the run organisation is incomplete at handover", "people", "own-10", "ws-chg",
     "open", "mitigate", 0.6, 3, 360_000, 0, 3, 2, "near", "measured",
     ["ms-32"], "deteriorate", 297, 374, ["handover", "run"],
     "Run organisation roles are not funded until the next budget cycle, so there is no named receiving owner for twenty-one of thirty-four artefacts."),
]

# Growth of financial exposure over the final 21 day window, by trajectory.
# The velocity engine reads this from the history, so the trend classification
# in the UI is derived rather than asserted.
TRAJECTORY_GROWTH = {"accel": 0.32, "deteriorate": 0.11, "flat": 0.0, "improve": -0.16}
# Longer-run shape multiplier applied to earlier samples.
TRAJECTORY_SHAPE = {"accel": 0.55, "deteriorate": 0.78, "flat": 0.94, "improve": 1.22}


def build_history(identified, probability, impact, financial, trajectory):
    """Monthly exposure samples from identification to the status date.

    The final two samples are placed 24 and 3 days before the status date so
    the 28 day velocity window always has two points to compare.
    """
    growth = TRAJECTORY_GROWTH[trajectory]
    shape = TRAJECTORY_SHAPE[trajectory]
    offsets = []
    cursor = identified + 7
    while cursor < 349:
        offsets.append(cursor)
        cursor += 30
    offsets.append(349)
    offsets.append(370)

    n = len(offsets)
    samples = []
    for i, off in enumerate(offsets):
        if off == 370:
            exposure = financial
            prob = probability
        elif off == 349:
            exposure = financial / (1.0 + growth)
            prob = max(0.05, min(0.98, probability / (1.0 + growth * 0.5)))
        else:
            # Interpolate from the shaped start value to the 349 value.
            t = 0 if n <= 3 else i / max(1, n - 3)
            start = financial * shape
            end = financial / (1.0 + growth)
            exposure = start + (end - start) * t
            prob = max(0.05, min(0.98, probability * (0.75 + 0.25 * t)))
        band = max(1, min(5, int(round(impact * (0.7 + 0.3 * (off / 370.0))))))
        samples.append({
            "date": day(off),
            "probability": round(prob, 3),
            "impactScore": band,
            "financialExposure": int(round(exposure)),
        })
    return samples


# ref, title, owner, ws, priority, status, raised, target, resolved,
# actualCost, actualDays, originRisk, causeRefs, milestones, description
ISSUES = [
    ("ISS-01", "Master data defect backlog is above the remediation exit threshold", "own-12", "ws-int",
     "critical", "escalated", 318, 372, None, 96_000, 18, "rsk-04", ["CSE-02", "CSE-03"], ["ms-15", "ms-26"],
     "The critical attribute defect rate is 3.4% against a 1.5% exit threshold. Remediation is clearing 210 defects a week against 260 new arrivals, so the backlog is growing."),
    ("ISS-02", "Reporting reconciliation variance of 4.1% against finance", "own-11", "ws-ctl",
     "high", "open", 344, 378, None, 34_000, 10, "rsk-09", ["CSE-09"], ["ms-26"],
     "Period 11 reporting did not reconcile to the general ledger. Root cause is definitional rather than technical: operations count movements and finance counts invoices."),
    ("ISS-03", "Two tier 1 carriers have not granted API certification slots", "own-07", "ws-int",
     "critical", "escalated", 330, 366, None, 41_000, 14, "rsk-01", ["CSE-01"], ["ms-13", "ms-17"],
     "Certification requires a joint test window with each carrier. Two carriers have not offered a slot inside the programme window, and one has linked it to the invoice schema being final."),
    ("ISS-04", "Milan power upgrade delayed by the distribution utility", "own-04", "ws-wms",
     "high", "in-progress", 306, 364, None, 58_000, 16, "rsk-07", ["CSE-05"], ["ms-22", "ms-04"],
     "The utility confirmed energisation eight weeks later than the fit-out plan assumed. A temporary generator is being priced as a bridge."),
    ("ISS-05", "Automation supplier moved the Milan build slot", "own-14", "ws-wms",
     "critical", "escalated", 322, 370, None, 124_000, 28, "rsk-06", ["CSE-04"], ["ms-22", "ms-23"],
     "The supplier reallocated the build slot to another customer and has offered no firm replacement date. There is no slot protection clause in the contract to enforce against."),
    ("ISS-06", "Forty-seven severity 2 UAT defects open against a curve of twenty-two", "own-05", "ws-tms",
     "critical", "open", 336, 371, None, 72_000, 15, "rsk-13", ["CSE-06", "CSE-07"], ["ms-09"],
     "Defect arrival is steady but closure is behind because business testers are attending part time and three defects require vendor releases."),
    ("ISS-07", "Customs broker has not released an interface specification", "own-07", "ws-car",
     "high", "escalated", 328, 368, None, 46_000, 18, "rsk-14", ["CSE-11"], ["ms-19"],
     "Repeated requests since period 9 have not produced a specification. The broker platform is bespoke legacy and they have offered a managed service instead."),
    ("ISS-08", "Super-user training attendance at 61% of the certified target", "own-10", "ws-chg",
     "high", "in-progress", 340, 373, None, 28_000, 12, "rsk-17", ["CSE-07"], ["ms-30", "ms-31"],
     "Fifty-five of ninety super-users are certified. Hub managers are prioritising operational service because programme contribution is not in their scorecard."),
    ("ISS-09", "Racking delivery short by two aisles at Milan", "own-04", "ws-net",
     "medium", "resolved", 300, 340, 344, 22_000, 6, "rsk-31", ["CSE-04"], ["ms-04"],
     "Two aisles were short-shipped against the delivery note. Expedited replacement arrived within the fit-out float and the milestone date held."),
    ("ISS-10", "Legacy extract failures in migration dry run 2", "own-12", "ws-int",
     "medium", "in-progress", 352, 376, None, 18_000, 5, None, ["CSE-03", "CSE-06"], ["ms-15"],
     "Three of eleven legacy extracts failed on character encoding for Italian and Polish address data. Not a risk realisation, it was found by the rehearsal control working as intended."),
    ("ISS-11", "Formal works council objection to the new role structure", "own-10", "ws-chg",
     "high", "in-progress", 296, 366, None, 39_000, 20, "rsk-20", ["CSE-13"], ["ms-31"],
     "The council objected on process grounds because consultation began after the design was fixed. A legally reviewed position paper has been submitted and sessions have resumed."),
    ("ISS-12", "Integration architect unavailable for two weeks", "own-06", "ws-int",
     "medium", "closed", 288, 306, 304, 14_000, 8, "rsk-16", ["CSE-12"], ["ms-13"],
     "Four integration design decisions stalled during the absence because the design rationale was undocumented. This is the measured evidence behind the key person risk."),
]


# ref, statement, owner, status, confidence, validationOffset, riskIfFalse,
# milestones, note
ASSUMPTIONS = [
    ("ASM-01", "The seven-hub network can absorb peak volume without a further site", "own-04",
     "validated", "measured", 96, None, ["ms-05"],
     "Confirmed by the network model against three peak weeks with 8% headroom at the tightest hub."),
    ("ASM-02", "All tier 1 carriers will support the standard API contract suite", "own-06",
     "invalidated", "verified", 330, "rsk-01", ["ms-13", "ms-17"],
     "Proved false. Two carriers require the invoice message schema to be final before granting certification slots, which is the origin of the vendor specification risk."),
    ("ASM-03", "Master data quality can be remediated by the existing data team", "own-12",
     "invalidated", "verified", 318, "rsk-04", ["ms-15"],
     "Proved false. Arrival rate exceeds clearance rate, so three contractors were added and the exit date still moved."),
    ("ASM-04", "The automation supplier will hold the contracted build slot", "own-14",
     "invalidated", "verified", 322, "rsk-06", ["ms-22", "ms-23"],
     "Proved false. Without a slot protection clause the supplier reallocated capacity and the programme has no contractual remedy."),
    ("ASM-05", "Business testers will be available for 80% of planned UAT days", "own-15",
     "invalidated", "measured", 336, "rsk-13", ["ms-09"],
     "Proved false. Actual availability is 62% of committed days because hub managers are measured on operational service only."),
    ("ASM-06", "Utility connection lead times fit inside the fit-out float", "own-04",
     "invalidated", "verified", 306, "rsk-07", ["ms-04", "ms-22"],
     "Proved false. The quoted lead time was 26 weeks against 14 assumed."),
    ("ASM-07", "Legacy transport system support will remain available until full cutover", "own-14",
     "validating", "indicative", 372, "rsk-21", ["ms-10", "ms-28"],
     "Under negotiation. A written extension to the end of Q2 has been requested but not yet countersigned."),
    ("ASM-08", "Finance will accept the programme reporting pack without a separate build", "own-11",
     "validating", "measured", 378, "rsk-09", ["ms-26"],
     "Partially challenged. Acceptance now depends on closing the metric dictionary, which is 31 of 48 metrics agreed."),
    ("ASM-09", "The run organisation will be funded from the next budget cycle", "own-01",
     "unvalidated", "anecdotal", 388, "rsk-41", ["ms-32"],
     "No written confirmation. Verbal indication only, and the knowledge transfer plan depends on it."),
    ("ASM-10", "Automation reaches contractual availability from the first operating day", "own-08",
     "unvalidated", "indicative", 386, "rsk-33", ["ms-24"],
     "Not yet tested and contradicted by comparable installations, which took eight to twelve weeks to reach contractual availability."),
    ("ASM-11", "Carrier rates awarded at tender will hold to signature", "own-07",
     "validating", "measured", 384, "rsk-12", ["ms-18"],
     "Rates are held for 60 days from award. Two awards are inside 15 days of expiry."),
    ("ASM-12", "Works council consultation will complete without design change", "own-10",
     "validating", "measured", 366, "rsk-20", ["ms-31"],
     "Objection lodged and being worked. A design change to two roles is a possible outcome."),
]

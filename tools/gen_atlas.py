"""ATLAS: Data Platform Modernization. Profile consumed by gen_satellite.build_program."""

RISK_CATS = ["technology", "data", "vendor", "delivery", "operational", "security", "financial", "people"]
STRATS = ["mitigate", "mitigate", "mitigate", "transfer", "accept"]
HORIZONS = ["immediate", "near", "near", "mid", "far"]
CONF = ["measured", "verified", "indicative", "anecdotal"]

def risk_bulk(ids, owners, ws, ms_pool, tags_extra):
    titles = [
        ("Legacy ETL pipeline migration exceeds the planned cutover window", "technology"),
        ("Data lineage cannot be proven for three regulated reporting feeds", "data"),
        ("Cloud egress cost model is materially wrong against actual volumes", "financial"),
        ("Schema drift between source systems breaks the unified data model", "technology"),
        ("Platform SRE team is understaffed against the go-live support model", "people"),
        ("PII discovery sweep finds unmasked fields in the new lake zone", "security"),
        ("Batch-to-streaming rework for the finance feed slips past the freeze date", "delivery"),
        ("Third-party data quality tool licence negotiation stalls procurement", "vendor"),
        ("Historical data backfill volume is 4x the original sizing estimate", "operational"),
        ("Access control model for the new platform is not ready for audit", "security"),
        ("Two source systems retire before their consumers are migrated", "delivery"),
        ("Data contract sign-off from a regulated business unit is delayed", "data"),
        ("Query performance on the new warehouse regresses for finance workloads", "technology"),
        ("Cost allocation tagging is incomplete, blocking chargeback to business units", "financial"),
        ("On-call runbook for the new platform does not exist yet", "operational"),
    ]
    out_list = []
    for i, num in enumerate(ids):
        title, cat = titles[i % len(titles)]
        rid = "rsk-" + str(num).zfill(2)
        ref = "ATL-" + str(num).zfill(2)
        owner = owners[i % len(owners)]
        wsid = ws[i % len(ws)]
        prob = round(0.25 + 0.6 * ((i * 7) % 10) / 10, 2)
        impact = 2 + (i % 4)
        fin = 80_000 + (i * 53_000) % 900_000
        sched = 5 + (i * 3) % 40
        hist_base_off = 30 + i * 5
        history = [
            (hist_base_off, max(0.1, prob - 0.15), max(1, impact - 1), int(fin * 0.7)),
            (hist_base_off + 60, prob, impact, fin),
        ]
        out_list.append({
            "id": rid, "ref": ref, "title": title, "description": title + ".",
            "category": cat, "owner": owner, "workstream": wsid, "status": "open" if i % 4 else "monitoring",
            "strategy": STRATS[i % len(STRATS)], "probability": prob, "impact": impact, "financialImpact": fin,
            "scheduleDays": sched, "strategic": 2 + (i % 3), "reputation": 1 + (i % 3),
            "horizon": HORIZONS[i % len(HORIZONS)], "confidence": CONF[i % len(CONF)],
            "milestones": [ms_pool[i % len(ms_pool)]], "identifiedOffset": 20 + i * 4, "reviewOffset": 300 + i * 3,
            "tags": ["atlas"] + (tags_extra[i] if i < len(tags_extra) else []),
            "history": history,
        })
    return out_list

def profile():
    owners = [
        ("own-a1", "Nadia Kessler", "Programme Director", None),
        ("own-a2", "Marcus Lindqvist", "Programme Manager", None),
        ("own-a3", "Fatima Zohra", "Data Platform Architect", "ws-a-plat"),
        ("own-a4", "Owen Chukwu", "Migration Lead", "ws-a-mig"),
        ("own-a5", "Yuki Tanaka", "Data Governance Lead", "ws-a-gov"),
        ("own-a6", "Sara Lindberg", "API Platform Lead", "ws-a-api"),
        ("own-a7", "Ben Osei", "Security and Compliance Lead", None),
        ("own-a8", "Ines Duarte", "Vendor Management Lead", None),
    ]
    workstreams = [
        ("ws-a-plat", "PLAT", "Cloud Data Platform Build", "own-a3", 0, 420, 3_200_000, 2_100_000, 68, "in-progress",
         "Build of the new cloud data lake and warehouse to replace eleven legacy on-premise data stores."),
        ("ws-a-mig", "MIG", "Legacy Migration and Backfill", "own-a4", 30, 400, 2_400_000, 1_650_000, 60, "in-progress",
         "Migration of source-system feeds and historical backfill onto the new platform."),
        ("ws-a-gov", "GOV", "Data Governance and Quality", "own-a5", 0, 410, 900_000, 520_000, 55, "in-progress",
         "Lineage, cataloguing, access control and quality rules for the new platform."),
        ("ws-a-api", "API", "API Platform and Integration", "own-a6", 60, 415, 1_500_000, 780_000, 48, "in-progress",
         "The API layer that exposes platform data to consuming programmes, including ORION's integration."),
    ]
    milestones = [
        ("ms-a-01", "Cloud landing zone live", "ws-a-plat", "own-a3", 20, 20, "complete", True, [], [], "Core cloud landing zone provisioned and accredited."),
        ("ms-a-02", "Warehouse schema v1 signed off", "ws-a-plat", "own-a3", 80, 92, "in-progress", True, ["ms-a-01"], [], "Unified warehouse schema agreed with all consuming business units."),
        ("ms-a-03", "Finance feed migrated", "ws-a-mig", "own-a4", 150, 178, "in-progress", False, ["ms-a-02"], [], "Finance source system feed cut over to the new platform."),
        ("ms-a-04", "Historical backfill complete", "ws-a-mig", "own-a4", 220, 260, "at-risk", False, ["ms-a-03"], [], "Five years of historical data backfilled and reconciled."),
        ("ms-a-05", "Lineage and catalogue live", "ws-a-gov", "own-a5", 120, 130, "complete", False, [], [], "End-to-end lineage tracing available for every regulated feed."),
        ("ms-a-06", "Access control model accredited", "ws-a-gov", "own-a5", 200, 215, "in-progress", True, ["ms-a-05"], [], "Role-based access model passes internal audit."),
        ("ms-a-07", "API Platform GA", "ws-a-api", "own-a6", 260, 296, "at-risk", True, ["ms-a-02"], [], "General availability of the API layer, the fulcrum milestone that ORION's Integration workstream depends on."),
        ("ms-a-08", "ORION integration contract signed off", "ws-a-api", "own-a6", 280, 305, "in-progress", False, ["ms-a-07"], [], "API contract for ORION's carrier integration formally accepted."),
        ("ms-a-09", "Legacy platform decommissioned", "ws-a-mig", "own-a4", 380, 400, "not-started", True, ["ms-a-04"], [], "Final legacy data stores switched off."),
        ("ms-a-10", "Cost allocation live", "ws-a-plat", "own-a3", 300, 310, "in-progress", False, ["ms-a-02"], [], "Chargeback tagging live for every consuming business unit."),
    ]
    deliverables = [
        ("dlv-a-01", "Landing zone accreditation pack", "ms-a-01", "own-a3", 18, "complete", 100, "Security accreditation signed by CISO."),
        ("dlv-a-02", "Warehouse schema document", "ms-a-02", "own-a3", 88, "in-progress", 80, "Schema reviewed by all business unit data leads."),
        ("dlv-a-03", "Finance feed cutover runbook", "ms-a-03", "own-a4", 170, "in-progress", 65, "Runbook tested in staging with production volumes."),
        ("dlv-a-04", "Backfill reconciliation report", "ms-a-04", "own-a4", 255, "in-progress", 40, "Five-year reconciliation signed off by finance."),
        ("dlv-a-05", "Data catalogue", "ms-a-05", "own-a5", 128, "complete", 100, "Catalogue live and searchable for every regulated feed."),
        ("dlv-a-06", "Access model audit evidence", "ms-a-06", "own-a5", 212, "in-progress", 70, "Evidence pack accepted by internal audit."),
        ("dlv-a-07", "API platform OpenAPI spec", "ms-a-07", "own-a6", 290, "in-progress", 55, "Spec published and versioned for consuming programmes."),
        ("dlv-a-08", "ORION integration contract", "ms-a-08", "own-a6", 300, "in-progress", 30, "Contract signed by both ATLAS and ORION integration leads."),
    ]
    causes = [
        ("cse-a1", "ATL-C-01", "Legacy source system documentation is incomplete", "process", True, 9, "own-a4",
         ["Why did the migration slip? Source system behaviour was undocumented.", "Why undocumented? Original vendor support contract lapsed years ago."],
         ["rsk-01", "rsk-11"], []),
        ("cse-a2", "ATL-C-02", "Cloud cost model was built on list price, not negotiated volume pricing", "measurement", True, 6, "own-a8",
         ["Why was the forecast wrong? List price was used instead of the negotiated tier."], ["rsk-03", "rsk-14"], []),
        ("cse-a3", "ATL-C-03", "Platform SRE hiring plan was built before scope was finalised", "people", True, 5, "own-a1",
         ["Why is SRE short-staffed? Headcount was approved against an earlier, smaller scope."], ["rsk-05"], []),
        ("cse-a4", "ATL-C-04", "Masking rules were written against a sample, not the full production schema", "technology", True, 4, "own-a7",
         ["Why did PII leak through? Masking rules never saw the fields added later."], ["rsk-06"], []),
        ("cse-a5", "ATL-C-05", "Vendor procurement cycle was not started until after the pilot concluded", "process", False, 3, "own-a8",
         ["Why is licensing stalled? Procurement only opened after the pilot proved the tool, losing the early-adopter pricing window."], ["rsk-08"], []),
        ("cse-a6", "ATL-C-06", "Backfill volume estimate used average daily volume, not peak retention periods", "measurement", True, 5, "own-a4",
         ["Why is backfill 4x over? The estimate ignored the retention peak in Q4 archives."], ["rsk-09"], []),
    ]
    controls = [
        ("ctl-a01", "ATL-CTL-01", "Weekly migration cutover readiness review", "detective", "own-a4", "weekly", 0.7, 0.6, "steering pack", 260, 267, False, "active", ["rsk-01", "rsk-11"], "Cross-functional review of every source feed against cutover exit criteria."),
        ("ctl-a02", "ATL-CTL-02", "Automated cost anomaly alerting", "detective", "own-a8", "continuous", 0.75, 0.7, "billing dashboard", 250, None, True, "active", ["rsk-03", "rsk-14"], "Alerts finance and platform leads when cloud spend deviates from forecast by more than 8%."),
        ("ctl-a03", "ATL-CTL-03", "SRE surge-hire and contractor bench", "corrective", "own-a1", "monthly", 0.5, 0.45, "resourcing tracker", 270, 300, False, "active", ["rsk-05"], "Pre-approved contractor bench to cover SRE gaps through go-live."),
        ("ctl-a04", "ATL-CTL-04", "Full-schema PII discovery scan", "preventive", "own-a7", "monthly", 0.85, 0.75, "scan report", 265, 295, True, "active", ["rsk-06"], "Automated scan of every field in the new lake zone, not a sample."),
        ("ctl-a05", "ATL-CTL-05", "Vendor licence fallback agreement", "preventive", "own-a8", "quarterly", 0.6, 0.55, "contract file", 240, None, False, "active", ["rsk-08"], "Short-term fallback licence to bridge the negotiation gap."),
        ("ctl-a06", "ATL-CTL-06", "Backfill volume re-forecast with peak retention", "corrective", "own-a4", "monthly", 0.65, 0.5, "capacity model v2", 275, 305, False, "active", ["rsk-09"], "Revised backfill sizing including Q4 archive peaks."),
        ("ctl-a07", "ATL-CTL-07", "Access model pre-audit dry run", "detective", "own-a5", "monthly", 0.7, 0.65, "dry-run report", 280, 310, False, "active", ["rsk-10"], "Internal dry run of the access model against audit criteria before the real audit."),
        ("ctl-a08", "ATL-CTL-08", "Dual-run reconciliation for retiring source systems", "preventive", "own-a4", "weekly", 0.8, 0.7, "reconciliation log", 290, None, True, "active", ["rsk-11"], "Old and new systems run in parallel until reconciliation is clean."),
        ("ctl-a09", "ATL-CTL-09", "Data contract escalation path to business unit sponsors", "corrective", "own-a2", "event-driven", 0.55, 0.5, "escalation log", None, None, False, "active", ["rsk-12"], "Direct escalation route when a business unit stalls a data contract sign-off."),
        ("ctl-a10", "ATL-CTL-10", "Warehouse workload query performance baseline", "detective", "own-a3", "weekly", 0.7, 0.6, "perf dashboard", 285, 315, True, "active", ["rsk-13"], "Ongoing benchmark of finance workloads against the legacy baseline."),
    ]
    actions = [
        ("act-a01", "ATL-A-01", "Recover source system documentation via original vendor archive", "own-a4", 280, None, "in-progress", "high", ["rsk-01"], [], [], 0.3, 55, "Requesting archived documentation under the lapsed support contract's data-return clause."),
        ("act-a02", "ATL-A-02", "Re-negotiate cloud pricing to committed-use tier", "own-a8", 260, None, "in-progress", "high", ["rsk-03"], [], [], 0.4, 60, "Moving from on-demand to a three-year committed-use discount."),
        ("act-a03", "ATL-A-03", "Confirm SRE contractor bench start dates", "own-a1", 275, None, "open", "medium", ["rsk-05"], [], [], 0.25, 20, "Locking contractor start dates against the go-live date."),
        ("act-a04", "ATL-A-04", "Re-run PII scan against full production schema", "own-a7", 270, 268, "complete", "critical", ["rsk-06"], [], [], 0.6, 100, "Full-schema scan completed; two additional fields masked."),
        ("act-a05", "ATL-A-05", "Sign interim licence bridge with data quality vendor", "own-a8", 250, None, "in-progress", "medium", ["rsk-08"], [], [], 0.35, 40, "Interim licence in legal review."),
        ("act-a06", "ATL-A-06", "Re-forecast backfill volume against Q4 peak retention", "own-a4", 285, 282, "complete", "high", ["rsk-09"], [], [], 0.3, 100, "Revised model delivered to steering committee."),
        ("act-a07", "ATL-A-07", "Run access model dry audit with internal audit team", "own-a5", 295, None, "in-progress", "high", ["rsk-10"], [], [], 0.4, 45, "Dry-run scheduled ahead of the formal audit window."),
        ("act-a08", "ATL-A-08", "Escalate finance data contract to steering committee", "own-a2", 265, None, "open", "high", ["rsk-12"], [], [], 0.25, 15, "Sponsor-level escalation drafted for next steering meeting."),
    ]
    issues = [
        ("iss-a01", "ATL-I-01", "Two source systems missed their planned retirement date", "own-a4", "ws-a-mig", "high", "open", 200, 260, None, 45_000, 12, None, ["cse-a1"], ["act-a01"], ["ms-a-04"], "Legacy support cost accruing beyond the planned retirement date."),
        ("iss-a02", "ATL-I-02", "Cloud spend exceeded forecast for two consecutive months", "own-a8", "ws-a-plat", "medium", "in-progress", 230, 290, None, 180_000, 0, None, ["cse-a2"], ["act-a02"], [], "Committed-use negotiation is the resolution path."),
        ("iss-a03", "ATL-I-03", "PII fields found unmasked in a lake zone during internal review", "own-a7", "ws-a-gov", "critical", "resolved", 260, 270, 268, 0, 0, None, ["cse-a4"], ["act-a04"], ["ms-a-06"], "Resolved by full-schema scan and remediation; no external disclosure required."),
        ("iss-a04", "ATL-I-04", "Finance data contract sign-off overdue by three weeks", "own-a2", "ws-a-api", "high", "open", 255, 285, None, 0, 21, None, [], ["act-a08"], ["ms-a-08"], "Business unit sponsor unavailable; escalation path invoked."),
    ]
    assumptions = [
        ("asm-a01", "ATL-AS-01", "Original source system vendor will provide archived documentation on request", "own-a4", "validating", "indicative", 300, "rsk-01", ["ms-a-03"], "Formal request submitted; response pending."),
        ("asm-a02", "ATL-AS-02", "Committed-use cloud pricing will be approved within the current budget cycle", "own-a8", "unvalidated", "anecdotal", 280, "rsk-03", ["ms-a-10"], "Finance sign-off still required."),
        ("asm-a03", "ATL-AS-03", "Contractor bench candidates remain available through go-live", "own-a1", "validated", "measured", 275, "rsk-05", ["ms-a-04"], "Three contractors confirmed availability in writing."),
        ("asm-a04", "ATL-AS-04", "ORION's Integration workstream will accept the API contract without material rework", "own-a6", "unvalidated", "indicative", 305, None, ["ms-a-08"], "First joint review with ORION integration lead scheduled."),
    ]
    dependencies = [
        ("dep-a01", "ATL-DEP-01", "Finance system vendor sign-off on data export format", "external", "Legacy finance vendor", "own-a4", "ATLAS migration workstream", "own-a4", 165, "at-risk", "high", 0.4, 20, ["ms-a-03"], [], [], ["rsk-01"], "Vendor must confirm the export format before the finance feed can migrate."),
        ("dep-a02", "ATL-DEP-02", "Cloud committed-use contract execution", "vendor", "Cloud provider commercial team", "own-a8", "ATLAS platform workstream", "own-a3", 255, "on-track", "medium", 0.3, 15, ["ms-a-10"], [], [], ["rsk-03"], "Signed contract needed to lock in committed-use pricing."),
        ("dep-a03", "ATL-DEP-03", "Internal audit slot for access model review", "internal", "Internal Audit", "own-a5", "ATLAS governance workstream", "own-a5", 215, "on-track", "high", 0.25, 10, ["ms-a-06"], [], [], ["rsk-10"], "Audit slot booked; dry run must complete before it."),
        ("dep-a04", "ATL-DEP-04", "Meridian Cloud Systems platform capacity guarantee", "vendor", "Meridian Cloud Systems", "own-a8", "ATLAS API workstream", "own-a6", 290, "at-risk", "critical", 0.5, 25, ["ms-a-07"], [], [], ["rsk-15"], "Capacity guarantee needed before API Platform GA can be declared safe at production load."),
        ("dep-a05", "ATL-DEP-05", "ORION integration lead joint design review", "cross-program", "ATLAS API workstream", "own-a6", "ORION integration workstream", "own-a6", 300, "on-track", "high", 0.3, 15, ["ms-a-08"], [], [], [], "Joint review confirming ORION can consume the ATLAS API contract as designed."),
        ("dep-a06", "ATL-DEP-06", "Business unit sponsor sign-off on data contract", "internal", "Finance business unit", "own-a2", "ATLAS API workstream", "own-a2", 285, "late", "high", 0.5, 21, ["ms-a-08"], [], [], [], "Sponsor sign-off is the last gate before the contract can be finalised."),
        ("dep-a07", "ATL-DEP-07", "Security accreditation renewal for the landing zone", "internal", "CISO office", "own-a7", "ATLAS platform workstream", "own-a3", 25, "delivered", "medium", 0.1, 5, ["ms-a-01"], [], [], [], "Renewal completed ahead of schedule."),
        ("dep-a08", "ATL-DEP-08", "Legacy platform decommission approval", "internal", "IT operations", "own-a4", "ATLAS migration workstream", "own-a4", 395, "on-track", "medium", 0.2, 10, ["ms-a-09"], [], ["dep-a01"], [], "Formal approval to switch off legacy stores once reconciliation is clean."),
    ]
    changes = [
        ("chg-a01", "ATL-CHG-01", "Extend committed-use contract term from 1 to 3 years", "own-a8", "Better discount tier available for a longer commitment", 240, "No scope change", -420_000, 0, "None", "Reduces cost-overrun risk", -420_000, ["ws-a-plat"], ["ms-a-10"], ["dep-a02"], [], ["rsk-03"], "approved", "own-a1", 248, "Net saving outweighs the reduced flexibility", "implemented", "Locking in a longer commitment to capture a materially better discount tier."),
        ("chg-a02", "ATL-CHG-02", "Add a second SRE surge-hire wave", "own-a1", "First wave insufficient to cover go-live support model", 270, "No scope change", 180_000, 0, "Two additional contractors", "Reduces operational risk at go-live", 0, ["ws-a-plat"], [], [], [], ["rsk-05"], "approved", "own-a1", 274, "Support model risk outweighs the incremental cost", "implemented", "A second contractor wave to close the remaining SRE gap before go-live."),
        ("chg-a03", "ATL-CHG-03", "Defer legacy decommission by six weeks", "own-a4", "Reconciliation taking longer than planned", 380, "Schedule only", 0, 42, "None", "Reduces risk of premature decommission", 0, ["ws-a-mig"], ["ms-a-09"], ["dep-a08"], [], ["rsk-09"], "pending", None, None, None, "in-review", "Extra runway to make sure reconciliation is genuinely clean before switch-off."),
    ]
    decisions = [
        ("dec-a01", "ATL-DEC-01", "Committed-use vs on-demand cloud pricing", "Cloud spend has exceeded forecast for two months running", "own-a8", "own-a1", "Programme Steering", 245,
         [{"id": "opt-a01a", "label": "Move to 3-year committed-use", "pros": ["Largest discount", "Predictable spend"], "cons": ["Less flexibility"], "estimatedCost": -420000, "estimatedScheduleDays": 0, "residualRiskNote": "Locks in usage assumptions for 3 years."},
          {"id": "opt-a01b", "label": "Stay on-demand, tighten anomaly alerting", "pros": ["Full flexibility"], "cons": ["No discount", "Cost risk continues"], "estimatedCost": 0, "estimatedScheduleDays": 0, "residualRiskNote": "Cost overrun risk remains open."}],
         248, None, "decided", "opt-a01a", "Discount outweighs the flexibility cost given stable usage growth", "Cloud spend variance reduced below 5 percent within two quarters", None, None, ["rsk-03"], ["chg-a01"], [], ["ms-a-10"]),
        ("dec-a02", "ATL-DEC-02", "SRE surge-hire scope", "Go-live support model is short-staffed against original plan", "own-a1", "own-a1", "Programme Steering", 272,
         [{"id": "opt-a02a", "label": "Second contractor wave", "pros": ["Closes gap before go-live"], "cons": ["Incremental cost"], "estimatedCost": 180000, "estimatedScheduleDays": 0, "residualRiskNote": "Contractor availability not guaranteed."},
          {"id": "opt-a02b", "label": "Reduce go-live support model scope", "pros": ["No added cost"], "cons": ["Higher incident risk at go-live"], "estimatedCost": 0, "estimatedScheduleDays": 0, "residualRiskNote": "Accepts higher incident risk."}],
         274, None, "decided", "opt-a02a", "Incident risk at go-live is not an acceptable trade for the saving", "Go-live support model fully staffed", None, None, ["rsk-05"], ["chg-a02"], [], []),
        ("dec-a03", "ATL-DEC-03", "Legacy decommission timing", "Reconciliation is not yet clean for two source systems", "own-a4", "own-a2", "Programme Steering", 378,
         [{"id": "opt-a03a", "label": "Defer decommission six weeks", "pros": ["Avoids premature switch-off"], "cons": ["Extends dual-run cost"], "estimatedCost": 30000, "estimatedScheduleDays": 42, "residualRiskNote": "Small extension of dual-run cost."},
          {"id": "opt-a03b", "label": "Decommission on original date", "pros": ["No schedule slip"], "cons": ["Risk of reconciliation gaps going undetected"], "estimatedCost": 0, "estimatedScheduleDays": 0, "residualRiskNote": "Data integrity risk if reconciliation is not actually clean."}],
         None, None, "required", None, None, "Zero data-integrity findings after decommission", None, None, ["rsk-09"], ["chg-a03"], [], ["ms-a-09"]),
    ]
    benefits = [
        ("ben-a01", "ATL-BEN-01", "Legacy platform running-cost reduction", "financial", "own-a1", 4200000, 900000, "Annualised infrastructure and licence spend", 6800000, 2600000, 5900000, 0, 400, "in-progress", ["ms-a-09"], ["rsk-01", "rsk-09"], ["chg-a03"], ["dec-a03"], [(120, 200000), (240, 500000), (360, 900000)]),
        ("ben-a02", "ATL-BEN-02", "Regulated reporting lineage compliance", "compliance", "own-a5", 1500000, 1500000, "Feeds with full lineage evidence", 0, 12, 12, 0, 150, "realised", ["ms-a-05"], [], [], [], [(60, 400000), (120, 900000), (150, 1500000)]),
        ("ben-a03", "ATL-BEN-03", "Query performance improvement for finance workloads", "efficiency", "own-a3", 900000, 300000, "P95 query latency reduction", 0, 60, 25, 100, 320, "at-risk", ["ms-a-02"], ["rsk-13"], [], [], [(150, 80000), (250, 200000), (320, 300000)]),
        ("ben-a04", "ATL-BEN-04", "API platform reuse value for downstream programmes", "strategic", "own-a6", 2000000, 0, "Downstream programmes onboarded", 0, 3, 0, 260, 380, "not-started", ["ms-a-07", "ms-a-08"], ["rsk-15"], [], [], []),
    ]
    fmea = [
        ("fme-a01", "ATL-FM-01", "Finance feed cutover", "Export and load", "Export format mismatch", "Load job fails silently", "Undocumented source schema", 5, 3, 3, "Manual spot-check of load counts", "Automated schema-diff gate before load", "own-a4", 260, "in-progress", 5, 2, 2, ["rsk-01"], ["cse-a1"], ["ctl-a01"]),
        ("fme-a02", "ATL-FM-02", "PII discovery", "Scan and mask", "Field added after sample was taken", "PII exposed in lake zone", "Sample-based masking rules", 5, 2, 2, "Sample-based scan", "Full-schema scan on every release", "own-a7", 270, "complete", 5, 1, 1, ["rsk-06"], ["cse-a4"], ["ctl-a04"]),
        ("fme-a03", "ATL-FM-03", "Backfill sizing", "Capacity estimate", "Peak retention period ignored", "Storage and compute under-provisioned", "Average-volume estimate", 4, 4, 3, "Manual capacity review", "Automated capacity model including peak retention", "own-a4", 285, "complete", 4, 2, 2, ["rsk-09"], ["cse-a6"], ["ctl-a06"]),
        ("fme-a04", "ATL-FM-04", "API contract handoff", "Joint design review", "Contract accepted without full ORION validation", "Rework after ORION integration starts", "Single-side review", 4, 3, 3, "ATLAS-only review", "Mandatory joint sign-off with ORION integration lead", "own-a6", 300, "in-progress", 4, 2, 2, [], [], ["ctl-a09"]),
    ]
    metrics = [
        ("met-a01", "Source feeds migrated", "feeds", "ws-a-mig", 14, "higher-is-better", [(30, 2), (150, 6), (250, 9), (350, 11)]),
        ("met-a02", "Cloud spend variance vs forecast", "pct", "ws-a-plat", 5, "lower-is-better", [(60, 4), (150, 9), (250, 11), (350, 6)]),
        ("met-a03", "Critical PII findings open", "findings", "ws-a-gov", 0, "lower-is-better", [(200, 3), (260, 1), (270, 0), (350, 0)]),
    ]
    signature_risks = [
        {"id": "rsk-01", "ref": "ATL-01", "title": "Legacy finance source system export format is undocumented and inconsistent",
         "description": "Original vendor support lapsed years ago; the export format actually produced differs from the last known specification, and the migration cannot be tested reliably against it.",
         "category": "technology", "owner": "own-a4", "workstream": "ws-a-mig", "status": "escalated", "strategy": "mitigate",
         "probability": 0.75, "impact": 4, "financialImpact": 620000, "scheduleDays": 30, "strategic": 4, "reputation": 2,
         "horizon": "immediate", "confidence": "verified", "controlIds": ["ctl-a01"], "causeIds": ["cse-a1"], "actionIds": ["act-a01"],
         "milestones": ["ms-a-03"], "benefits": ["ben-a01"], "dependencies": ["dep-a01"], "issues": ["iss-a01"],
         "identifiedOffset": 190, "reviewOffset": 350, "tags": ["migration", "critical-path"],
         "history": [(190, 0.6, 3, 400000), (250, 0.75, 4, 620000)]},
        {"id": "rsk-03", "ref": "ATL-03", "title": "Cloud egress and compute cost model is materially under forecast",
         "description": "The original cost model used list price rather than negotiated volume pricing; actual spend has exceeded forecast for two consecutive months.",
         "category": "financial", "owner": "own-a8", "workstream": "ws-a-plat", "status": "monitoring", "strategy": "mitigate",
         "probability": 0.6, "impact": 3, "financialImpact": 420000, "scheduleDays": 0, "strategic": 2, "reputation": 1,
         "horizon": "near", "confidence": "measured", "controlIds": ["ctl-a02"], "causeIds": ["cse-a2"], "actionIds": ["act-a02"],
         "milestones": ["ms-a-10"], "benefits": [], "dependencies": ["dep-a02"], "issues": ["iss-a02"],
         "identifiedOffset": 220, "reviewOffset": 340, "tags": ["cost"],
         "history": [(220, 0.5, 2, 250000), (280, 0.6, 3, 420000)]},
        {"id": "rsk-06", "ref": "ATL-06", "title": "Unmasked PII fields found in the new data lake zone",
         "description": "Masking rules were validated against a schema sample, not the full production schema; fields added later were never covered.",
         "category": "security", "owner": "own-a7", "workstream": "ws-a-gov", "status": "monitoring", "strategy": "mitigate",
         "probability": 0.3, "impact": 5, "financialImpact": 900000, "scheduleDays": 10, "strategic": 4, "reputation": 5,
         "horizon": "immediate", "confidence": "verified", "controlIds": ["ctl-a04"], "causeIds": ["cse-a4"], "actionIds": ["act-a04"],
         "milestones": ["ms-a-06"], "benefits": [], "dependencies": [], "issues": ["iss-a03"],
         "identifiedOffset": 258, "reviewOffset": 330, "tags": ["security", "compliance"],
         "history": [(258, 0.5, 5, 1400000), (270, 0.3, 5, 900000)]},
        {"id": "rsk-09", "ref": "ATL-09", "title": "Historical data backfill volume is four times the original estimate",
         "description": "The sizing model used average daily volume and ignored the Q4 archive retention peak, so storage and compute are under-provisioned for the real backfill.",
         "category": "operational", "owner": "own-a4", "workstream": "ws-a-mig", "status": "escalated", "strategy": "mitigate",
         "probability": 0.85, "impact": 4, "financialImpact": 540000, "scheduleDays": 40, "strategic": 3, "reputation": 1,
         "horizon": "immediate", "confidence": "verified", "controlIds": ["ctl-a06"], "causeIds": ["cse-a6"], "actionIds": ["act-a06"],
         "milestones": ["ms-a-04"], "benefits": ["ben-a01"], "dependencies": [], "issues": [],
         "identifiedOffset": 200, "reviewOffset": 345, "tags": ["capacity", "critical-path"],
         "history": [(200, 0.7, 3, 350000), (260, 0.85, 4, 540000)]},
        {"id": "rsk-15", "ref": "ATL-15", "title": "Meridian Cloud Systems cannot guarantee production-scale capacity for API Platform GA",
         "description": "The shared cloud platform vendor Meridian Cloud Systems has not confirmed a firm capacity guarantee ahead of the API Platform go-live; the same vendor constraint is separately threatening HELIOS's SOC tooling rollout.",
         "category": "vendor", "owner": "own-a8", "workstream": "ws-a-api", "status": "escalated", "strategy": "mitigate",
         "probability": 0.7, "impact": 4, "financialImpact": 780000, "scheduleDays": 25, "strategic": 4, "reputation": 2,
         "horizon": "immediate", "confidence": "verified", "controlIds": [], "causeIds": [], "actionIds": [],
         "milestones": ["ms-a-07"], "benefits": ["ben-a04"], "dependencies": ["dep-a04"], "issues": [],
         "identifiedOffset": 270, "reviewOffset": 355, "tags": ["vendor", "critical-path", "shared-vendor"],
         "vendor": "Meridian Cloud Systems", "sharedRiskGroupId": "shared-meridian-capacity-01",
         "history": [(270, 0.5, 3, 450000), (300, 0.7, 4, 780000)]},
    ]

    bulk_ids = [2, 4, 5, 7, 8, 10, 11, 12, 13, 14, 16, 17, 18, 19, 20]
    bulk = risk_bulk(bulk_ids, [o[0] for o in owners], [w[0] for w in workstreams], [m[0] for m in milestones],
                      [["vendor"], ["data-quality"], ["cost"], ["technology"], ["people"], ["security"], ["delivery"], ["vendor"], ["capacity"], ["security"], ["delivery"], ["data-quality"], ["technology"], ["cost"], ["operational"]])
    all_risks = signature_risks + bulk

    return {
        "id": "prog-atlas", "name": "Enterprise Data Platform Modernization", "codename": "ATLAS",
        "description": "Replacement of eleven legacy on-premise data stores with a single cloud data platform, including a governed catalogue, unified access model and an API layer that ORION and other programmes integrate against.",
        "sponsor": "Nadia Kessler, Chief Data Officer", "programManager": "Marcus Lindqvist",
        "start": "2025-11-01", "end": "2026-12-15", "status_date": "2026-09-09",
        "budget": 8000000, "spendToDate": 5050000, "forecastSpend": 8450000, "currency": "EUR",
        "businessUnit": "Enterprise Technology", "strategicPriority": "critical", "programStatus": "active",
        "strategicObjectives": [
            "Retire eleven legacy on-premise data stores onto a single governed cloud platform",
            "Provide full lineage evidence for every regulated reporting feed",
            "Expose a stable API layer that downstream programmes, including ORION, can integrate against",
            "Bring cloud spend in line with the negotiated committed-use pricing model",
        ],
        "owners": owners, "workstreams": workstreams, "milestones": milestones, "deliverables": deliverables,
        "causes": causes, "controls": controls, "actions": actions, "issues": issues, "assumptions": assumptions,
        "dependencies": dependencies, "changes": changes, "decisions": decisions, "benefits": benefits,
        "fmea": fmea, "metrics": metrics, "risks": all_risks,
    }

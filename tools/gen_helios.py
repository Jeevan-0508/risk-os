"""HELIOS: Cybersecurity Transformation. Profile consumed by gen_satellite.build_program."""

STRATS = ["mitigate", "mitigate", "mitigate", "transfer", "accept"]
HORIZONS = ["immediate", "near", "near", "mid", "far"]
CONF = ["measured", "verified", "indicative", "anecdotal"]

def risk_bulk(ids, owners, ws, ms_pool, tags_extra):
    titles = [
        ("Multi-factor authentication rollout increases contact centre call volume", "operational"),
        ("Cloud security posture tool reports a high rate of false positives", "technology"),
        ("Third-party risk assessment backlog grows faster than it can be cleared", "vendor"),
        ("Security awareness training completion lags target ahead of go-live", "people"),
        ("SOC analyst headcount plan lags the tooling rollout schedule", "people"),
        ("Data loss prevention rules block a legitimate finance data export process", "operational"),
        ("Legacy VPN decommission is blocked by one remaining regional office", "delivery"),
        ("Regulatory penetration test finds a critical finding close to the audit date", "regulatory"),
        ("Security budget reforecast is driven by license cost growth, not scope growth", "financial"),
        ("Incident response tabletop exercise reveals unclear escalation ownership", "operational"),
        ("Identity provider migration produces duplicate accounts for contractors", "technology"),
        ("Cloud workload protection agent conflicts with a finance batch process", "technology"),
        ("Third-party penetration testers cannot access a segmented production network", "vendor"),
        ("Security exception backlog grows faster than the governance forum can clear it", "delivery"),
        ("Encryption key rotation breaks a legacy reporting integration", "technology"),
    ]
    out_list = []
    for i, num in enumerate(ids):
        title, cat = titles[i % len(titles)]
        rid = "rsk-" + str(num).zfill(2)
        ref = "HEL-" + str(num).zfill(2)
        owner = owners[i % len(owners)]
        wsid = ws[i % len(ws)]
        prob = round(0.2 + 0.6 * ((i * 13) % 10) / 10, 2)
        impact = 2 + (i % 4)
        fin = 70_000 + (i * 47_000) % 800_000
        sched = 4 + (i * 3) % 30
        hist_base_off = 20 + i * 6
        history = [
            (hist_base_off, max(0.1, prob - 0.14), max(1, impact - 1), int(fin * 0.72)),
            (hist_base_off + 55, prob, impact, fin),
        ]
        out_list.append({
            "id": rid, "ref": ref, "title": title, "description": title + ".",
            "category": cat, "owner": owner, "workstream": wsid, "status": "open" if i % 3 else "monitoring",
            "strategy": STRATS[i % len(STRATS)], "probability": prob, "impact": impact, "financialImpact": fin,
            "scheduleDays": sched, "strategic": 2 + (i % 3), "reputation": 2 + (i % 3),
            "horizon": HORIZONS[i % len(HORIZONS)], "confidence": CONF[i % len(CONF)],
            "milestones": [ms_pool[i % len(ms_pool)]], "identifiedOffset": 22 + i * 4, "reviewOffset": 290 + i * 3,
            "tags": ["helios"] + (tags_extra[i] if i < len(tags_extra) else []),
            "history": history,
        })
    return out_list

def profile():
    owners = [
        ("own-h1", "Marcus Weber", "Programme Director", None),
        ("own-h2", "Priya Anand", "Programme Manager", None),
        ("own-h3", "Sofia Almeida", "Identity and Access Management Lead", "ws-h-iam"),
        ("own-h4", "Kwame Mensah", "Security Operations Centre Lead", "ws-h-soc"),
        ("own-h5", "Elena Petrova", "Cloud Security Posture Lead", "ws-h-cloud"),
        ("own-h6", "Noah Bergstrom", "Governance Risk and Compliance Lead", "ws-h-gov"),
        ("own-h7", "Layla Haddad", "Data Protection and Privacy Officer", None),
        ("own-h8", "Ravi Desai", "Vendor and Third-Party Risk Lead", None),
    ]
    workstreams = [
        ("ws-h-iam", "IAM", "Identity and Access Management Modernisation", "own-h3", 0, 340, 1_900_000, 1_050_000, 60, "in-progress",
         "Modernisation of identity, privileged access and authentication across the estate."),
        ("ws-h-soc", "SOC", "Security Operations Centre Uplift", "own-h4", 20, 360, 2_300_000, 1_350_000, 52, "in-progress",
         "New detection, response and SOC tooling stack replacing the legacy monitoring platform."),
        ("ws-h-cloud", "CLOUD", "Cloud Security Posture Management", "own-h5", 30, 355, 1_700_000, 950_000, 48, "in-progress",
         "Zero-trust segmentation and continuous posture management across all cloud accounts."),
        ("ws-h-gov", "GOV", "Governance, Risk and Compliance", "own-h6", 10, 370, 1_200_000, 640_000, 44, "in-progress",
         "Regulatory, privacy and audit programme underpinning the transformation."),
    ]
    milestones = [
        ("ms-h-01", "IAM target architecture signed off", "ws-h-iam", "own-h3", 30, 30, "complete", True, [], [], "Target identity and access architecture agreed with all platform owners."),
        ("ms-h-02", "Privileged access review complete", "ws-h-iam", "own-h3", 90, 95, "complete", False, ["ms-h-01"], [], "Full review of standing privileged access across the estate."),
        ("ms-h-03", "SOC tooling platform general availability", "ws-h-soc", "own-h4", 170, 205, "at-risk", True, ["ms-h-02"], [], "New SOC detection and response tooling live for all monitored estates, dependent on Meridian Cloud Systems capacity."),
        ("ms-h-04", "Zero-trust network segmentation phase 1 live", "ws-h-cloud", "own-h5", 200, 225, "in-progress", False, ["ms-h-01"], [], "First phase of network micro-segmentation live in production."),
        ("ms-h-05", "Cloud security posture management live in all accounts", "ws-h-cloud", "own-h5", 235, 265, "at-risk", False, ["ms-h-04"], [], "Continuous posture management live across every cloud account in scope."),
        ("ms-h-06", "Endpoint detection and response rollout complete", "ws-h-soc", "own-h4", 250, 285, "in-progress", True, ["ms-h-03"], [], "EDR agent deployed and tuned across all managed endpoints."),
        ("ms-h-07", "Data protection impact assessments complete for all markets", "ws-h-gov", "own-h7", 210, 245, "at-risk", True, [], [], "DPIAs signed off for every in-scope regulatory market."),
        ("ms-h-08", "Security awareness training complete", "ws-h-gov", "own-h6", 270, 295, "in-progress", False, [], [], "All staff complete the refreshed security awareness curriculum."),
        ("ms-h-09", "Regulatory penetration test and audit sign-off", "ws-h-gov", "own-h6", 320, 345, "not-started", True, ["ms-h-06", "ms-h-07"], [], "Independent penetration test and regulator sign-off ahead of the transformation close."),
        ("ms-h-10", "Legacy VPN decommissioned", "ws-h-cloud", "own-h5", 335, 360, "not-started", False, ["ms-h-04"], [], "Legacy remote-access VPN fully retired in favour of zero-trust access."),
    ]
    deliverables = [
        ("dlv-h-01", "IAM target architecture document", "ms-h-01", "own-h3", 28, "complete", 100, "Architecture signed by every platform owner."),
        ("dlv-h-02", "Privileged access review report", "ms-h-02", "own-h3", 93, "complete", 100, "All excessive standing access findings tracked to remediation."),
        ("dlv-h-03", "SOC tooling deployment runbook", "ms-h-03", "own-h4", 195, "in-progress", 65, "Runbook covers detection, triage and escalation for the new platform."),
        ("dlv-h-04", "Network segmentation phase 1 build", "ms-h-04", "own-h5", 215, "in-progress", 70, "Segmentation policy live for the first wave of business-critical zones."),
        ("dlv-h-05", "Cloud posture management dashboard", "ms-h-05", "own-h5", 250, "in-progress", 50, "Dashboard covers every in-scope cloud account and control."),
        ("dlv-h-06", "EDR deployment and tuning report", "ms-h-06", "own-h4", 270, "in-progress", 55, "Deployment coverage and false-positive tuning tracked per estate."),
        ("dlv-h-07", "DPIA pack for all in-scope markets", "ms-h-07", "own-h7", 230, "in-progress", 60, "DPIA pack complete and signed for every in-scope regulatory market."),
        ("dlv-h-08", "Audit readiness pack", "ms-h-09", "own-h6", 330, "not-started", 15, "Evidence pack ready ahead of the independent penetration test."),
    ]
    causes = [
        ("cse-h1", "HEL-C-01", "Legacy application inventory was incomplete when IAM scope was set", "process", True, 6, "own-h3",
         ["Why is a legacy tier missed? The original application inventory did not cover a regional finance system."], ["rsk-01"], []),
        ("cse-h2", "HEL-C-02", "Standing access grants were never time-boxed under the legacy identity model", "process", True, 7, "own-h3",
         ["Why is standing access excessive? The legacy model granted access indefinitely with no periodic re-certification."], ["rsk-03"], []),
        ("cse-h3", "HEL-C-03", "Network segmentation policy was modelled from architecture diagrams, not live traffic", "technology", True, 5, "own-h5",
         ["Why did segmentation break a batch job? The policy did not account for an undocumented legacy data flow."], ["rsk-06"], []),
        ("cse-h4", "HEL-C-04", "Meridian Cloud Systems underestimated regional capacity demand from multiple concurrent customers", "management", False, 5, "own-h8",
         ["Why is the SOC tooling vendor short on capacity? Meridian sized regional capacity against a single-customer forecast, and ATLAS draws on the same regional pool."], ["rsk-09"], []),
        ("cse-h5", "HEL-C-05", "DPIA process was designed for one regulatory regime and not re-scoped per market", "policy", True, 4, "own-h7",
         ["Why are DPIAs behind? The assessment template assumed the home market's regulation and needed rework for each additional market."], ["rsk-15"], []),
        ("cse-h6", "HEL-C-06", "Third-party risk assessment intake has no capacity ceiling against demand", "process", False, 4, "own-h8",
         ["Why is the backlog growing? Intake accepts every vendor request with no prioritisation against assessor capacity."], ["rsk-05"], []),
    ]
    controls = [
        ("ctl-h01", "HEL-CTL-01", "Legacy application inventory reconciliation", "corrective", "own-h3", "monthly", 0.65, 0.55, "inventory reconciliation log", 250, 280, False, "active", ["rsk-01"], "Full reconciliation of the application inventory against network discovery data."),
        ("ctl-h02", "HEL-CTL-02", "Time-boxed access with periodic re-certification", "preventive", "own-h3", "quarterly", 0.75, 0.65, "re-certification log", 100, 130, False, "active", ["rsk-03"], "All privileged access now expires unless re-certified by the resource owner."),
        ("ctl-h03", "HEL-CTL-03", "Live-traffic segmentation policy validation", "detective", "own-h5", "continuous", 0.7, 0.6, "traffic validation dashboard", 205, None, True, "active", ["rsk-06"], "Segmentation policy is validated against live traffic before each phase gate."),
        ("ctl-h04", "HEL-CTL-04", "Joint capacity forecasting forum with Meridian Cloud Systems", "corrective", "own-h8", "monthly", 0.55, 0.45, "capacity forum minutes", 180, 210, False, "active", ["rsk-09"], "Joint capacity forecast across every Meridian customer programme, including ATLAS."),
        ("ctl-h05", "HEL-CTL-05", "Per-market DPIA re-scoping", "preventive", "own-h7", "quarterly", 0.75, 0.65, "DPIA sign-off log", 210, 240, False, "active", ["rsk-15"], "Each market's DPIA re-scoped against local regulation before rollout."),
        ("ctl-h06", "HEL-CTL-06", "Third-party assessment intake prioritisation", "corrective", "own-h8", "monthly", 0.5, 0.4, "intake backlog report", 200, 230, False, "active", ["rsk-05"], "Intake now prioritised by vendor criticality against fixed assessor capacity."),
        ("ctl-h07", "HEL-CTL-07", "SOC analyst hiring and tooling readiness gate", "preventive", "own-h4", "monthly", 0.6, 0.5, "hiring tracker", 220, 250, False, "active", ["rsk-10"], "Tooling go-live gated on SOC analyst headcount reaching the staffing plan."),
        ("ctl-h08", "HEL-CTL-08", "Security awareness completion dashboard with manager escalation", "detective", "own-h6", "weekly", 0.6, 0.5, "completion dashboard", 260, 290, False, "active", ["rsk-08"], "Managers are escalated automatically when their team's completion lags target."),
        ("ctl-h09", "HEL-CTL-09", "VPN decommission regional office migration plan", "preventive", "own-h5", "event-driven", 0.6, 0.5, "migration plan", 320, 350, False, "active", ["rsk-07"], "Dedicated migration plan for the last regional office blocking VPN decommission."),
        ("ctl-h10", "HEL-CTL-10", "Pre-audit penetration test remediation sprint", "corrective", "own-h6", "event-driven", 0.65, 0.55, "remediation tracker", 300, 330, False, "active", ["rsk-12"], "Dedicated remediation sprint ahead of the regulatory penetration test."),
    ]
    actions = [
        ("act-h01", "HEL-A-01", "Reconcile application inventory against network discovery", "own-h3", 260, 255, "complete", "high", ["rsk-01"], [], [], 0.35, 100, "Reconciliation complete; legacy finance system added to IAM scope."),
        ("act-h02", "HEL-A-02", "Implement time-boxed access with owner re-certification", "own-h3", 120, 118, "complete", "critical", ["rsk-03"], [], [], 0.45, 100, "All standing privileged access now expires without re-certification."),
        ("act-h03", "HEL-A-03", "Validate segmentation policy against live batch traffic", "own-h5", 215, None, "in-progress", "critical", ["rsk-06"], [], [], 0.4, 55, "Live validation under way; one undocumented flow found and being added to policy."),
        ("act-h04", "HEL-A-04", "Escalate Meridian capacity forecast across all customer programmes", "own-h8", 195, None, "in-progress", "high", ["rsk-09"], [], [], 0.4, 40, "Joint forum raised the shortfall; Meridian is re-forecasting regional capacity."),
        ("act-h05", "HEL-A-05", "Re-scope DPIA template per in-scope market", "own-h7", 225, None, "in-progress", "high", ["rsk-15"], [], [], 0.4, 45, "Two of four markets re-scoped and signed off."),
        ("act-h06", "HEL-A-06", "Prioritise third-party assessment backlog by vendor criticality", "own-h8", 215, None, "open", "medium", ["rsk-05"], [], [], 0.3, 25, "Prioritisation model agreed; backlog re-ordering under way."),
    ]
    issues = [
        ("iss-h01", "HEL-I-01", "Regional finance system found unmanaged by IAM after go-live of phase 1", "own-h3", "ws-h-iam", "high", "resolved", 258, 262, 260, 0, 0, None, ["cse-h1"], ["act-h01"], ["ms-h-01"], "Resolved by adding the system to IAM scope before the next phase."),
        ("iss-h02", "HEL-I-02", "Privileged access audit finds three service accounts with no owner", "own-h3", "ws-h-iam", "critical", "resolved", 96, 100, 98, 0, 0, None, ["cse-h2"], ["act-h02"], ["ms-h-02"], "Resolved; accounts reassigned or decommissioned before re-certification went live."),
        ("iss-h03", "HEL-I-03", "Meridian Cloud Systems confirms a regional capacity shortfall for SOC tooling", "own-h8", "ws-h-soc", "high", "in-progress", 190, 220, None, 180_000, 20, None, ["cse-h4"], ["act-h04"], [], "Escalated jointly with ATLAS, which shares the same regional Meridian capacity pool."),
        ("iss-h04", "HEL-I-04", "DPIA review finds one market's flow non-compliant ahead of rollout", "own-h7", "ws-h-gov", "high", "in-progress", 218, 250, None, 0, 15, None, ["cse-h5"], ["act-h05"], ["ms-h-07"], "Re-scoping under way for the affected market."),
    ]
    assumptions = [
        ("asm-h01", "HEL-AS-01", "The legacy finance system can be onboarded to IAM without a further cutover window", "own-h3", "validated", "measured", 262, "rsk-01", ["ms-h-01"], "Onboarded within the existing IAM phase 1 window."),
        ("asm-h02", "HEL-AS-02", "Meridian Cloud Systems can resolve the regional capacity shortfall without slipping SOC GA", "own-h8", "unvalidated", "indicative", 205, "rsk-09", ["ms-h-03"], "Dependent on Meridian's re-forecast; not yet confirmed against the GA date."),
        ("asm-h03", "HEL-AS-03", "ATLAS's own Meridian capacity draw will not worsen the shared regional shortfall", "own-h1", "unvalidated", "anecdotal", 205, "rsk-09", ["ms-h-03"], "Tracked jointly with ATLAS as a shared vendor risk, not treated as independent."),
        ("asm-h04", "HEL-AS-04", "SOC analyst hiring will reach the staffing plan before EDR rollout completes", "own-h4", "validating", "indicative", 270, "rsk-10", ["ms-h-06"], "Hiring pipeline tracked weekly; two of six roles still open."),
    ]
    dependencies = [
        ("dep-h01", "HEL-DEP-01", "Meridian Cloud Systems shared regional capacity", "vendor", "Meridian Cloud Systems", "own-h8", "HELIOS SOC workstream", "own-h4", 195, "at-risk", "high", 0.5, 22, ["ms-h-03"], [], [], ["rsk-09"], "SOC tooling GA depends on Meridian resolving the same regional capacity shortfall that also affects ATLAS."),
        ("dep-h02", "HEL-DEP-02", "ATLAS API Platform identity data contract", "cross-program", "ATLAS API workstream", "own-h3", "HELIOS IAM workstream", "own-h3", 250, "on-track", "medium", 0.3, 14, ["ms-h-01"], [], [], [], "IAM modernisation consumes identity attribute data from the ATLAS API layer."),
        ("dep-h03", "HEL-DEP-03", "NOVA consent and privacy programme shared resourcing", "cross-program", "NOVA marketing workstream", "own-h7", "HELIOS governance workstream", "own-h7", 220, "at-risk", "high", 0.4, 16, ["ms-h-07"], [], [], ["rsk-15"], "DPIA delivery shares its privacy officer with NOVA's consent management workstream."),
        ("dep-h04", "HEL-DEP-04", "SOC tooling vendor licence and support contract", "vendor", "Meridian Cloud Systems", "own-h8", "HELIOS SOC workstream", "own-h4", 170, "at-risk", "critical", 0.5, 20, ["ms-h-03"], [], [], ["rsk-09"], "Licence and support contract underpins the SOC tooling platform GA."),
        ("dep-h05", "HEL-DEP-05", "Regional office network migration for VPN decommission", "internal", "IT operations", "own-h5", "HELIOS cloud workstream", "own-h5", 335, "on-track", "medium", 0.3, 12, ["ms-h-10"], [], [], ["rsk-07"], "Last regional office needs its own network migration before the VPN can be retired."),
        ("dep-h06", "HEL-DEP-06", "Independent penetration testing firm engagement", "external", "Penetration testing firm", "own-h6", "HELIOS governance workstream", "own-h6", 300, "on-track", "high", 0.3, 10, ["ms-h-09"], [], [], ["rsk-12"], "Regulatory sign-off depends on the independent penetration test completing on schedule."),
        ("dep-h07", "HEL-DEP-07", "Regulator engagement on audit scope", "regulatory", "Data protection regulator", "own-h7", "HELIOS governance workstream", "own-h6", 310, "on-track", "high", 0.3, 10, ["ms-h-09"], [], [], [], "Regulator confirms audit scope ahead of the penetration test and sign-off."),
        ("dep-h08", "HEL-DEP-08", "Finance system owner sign-off for IAM legacy onboarding", "internal", "Finance systems team", "own-h3", "HELIOS IAM workstream", "own-h3", 258, "on-track", "medium", 0.2, 8, ["ms-h-01"], [], [], ["rsk-01"], "Finance system owner sign-off needed before the legacy tier can be onboarded to IAM."),
    ]
    changes = [
        ("chg-h01", "HEL-CHG-01", "Add legacy finance system to IAM phase 1 scope", "own-h3", "Application inventory gap found after phase 1 went live", 260, "Small scope increase", 30_000, 5, "Additional onboarding effort", "Reduces unmanaged-identity risk", 0, ["ws-h-iam"], ["ms-h-01"], [], [], ["rsk-01"], "approved", "own-h1", 261, "Cost is small against the exposure of an unmanaged legacy system", "implemented", "Finance system added to IAM scope and onboarded within the existing window."),
        ("chg-h02", "HEL-CHG-02", "Establish a joint Meridian capacity forum with ATLAS", "own-h8", "Meridian capacity shortfall found to affect both HELIOS and ATLAS", 192, "No scope change", 0, 0, "None", "Reduces double-counted vendor escalation effort", 0, ["ws-h-soc"], ["ms-h-03"], ["dep-h01"], [], ["rsk-09"], "approved", "own-h1", 194, "A joint forum avoids two programmes independently escalating the same shortfall", "implemented", "Forum established; ATLAS and HELIOS now escalate jointly."),
        ("chg-h03", "HEL-CHG-03", "Re-scope DPIA template per market ahead of schedule", "own-h7", "DPIA review found a non-compliant flow in one market", 220, "No scope change", 35_000, 10, "None", "Reduces regulatory exposure", 0, ["ws-h-gov"], ["ms-h-07"], ["dep-h03"], [], ["rsk-15"], "pending", None, None, None, "in-review", "Per-market re-scoping ahead of each market's own DPIA sign-off."),
    ]
    decisions = [
        ("dec-h01", "HEL-DEC-01", "IAM legacy system onboarding scope", "Application inventory gap found after phase 1 went live", "own-h3", "own-h1", "Programme Steering", 260,
         [{"id": "opt-h01a", "label": "Add the legacy system to phase 1 scope now", "pros": ["Closes the identity gap immediately"], "cons": ["Small scope and cost increase"], "estimatedCost": 30000, "estimatedScheduleDays": 5, "residualRiskNote": "Minor schedule cost."},
          {"id": "opt-h01b", "label": "Defer onboarding to phase 2", "pros": ["No cost or schedule impact now"], "cons": ["System remains unmanaged for another phase"], "estimatedCost": 0, "estimatedScheduleDays": 0, "residualRiskNote": "Unmanaged identity risk persists longer."},],
         261, None, "decided", "opt-h01a", "Closing the identity gap now is worth the small scope increase", "System onboarded and managed under IAM controls", None, None, ["rsk-01"], ["chg-h01"], [], ["ms-h-01"]),
        ("dec-h02", "HEL-DEC-02", "Meridian capacity shortfall escalation approach", "Meridian capacity shortfall found to affect both HELIOS and ATLAS", "own-h8", "own-h1", "Programme Steering", 192,
         [{"id": "opt-h02a", "label": "Escalate jointly with ATLAS through one forum", "pros": ["Single view of shared demand", "Avoids duplicated escalation effort"], "cons": ["Requires cross-programme coordination"], "estimatedCost": 0, "estimatedScheduleDays": 0, "residualRiskNote": "Coordination overhead."},
          {"id": "opt-h02b", "label": "Escalate independently as two separate programmes", "pros": ["No coordination needed"], "cons": ["Meridian sees inconsistent demand signals"], "estimatedCost": 0, "estimatedScheduleDays": 0, "residualRiskNote": "Risk of Meridian under-resourcing the shared pool."},],
         194, None, "decided", "opt-h02a", "A joint forum gives Meridian one consistent demand signal across both programmes", "Meridian re-forecasts regional capacity against combined demand", None, None, ["rsk-09"], ["chg-h02"], [], ["ms-h-03"]),
        ("dec-h03", "HEL-DEC-03", "DPIA re-scoping sequencing", "DPIA review found a non-compliant flow in one market", "own-h7", "own-h1", "Programme Steering", 219,
         [{"id": "opt-h03a", "label": "Re-scope market by market ahead of each rollout", "pros": ["Reduces regulatory exposure per market"], "cons": ["Schedule slip per market"], "estimatedCost": 35000, "estimatedScheduleDays": 10, "residualRiskNote": "Cumulative slip across markets."},
          {"id": "opt-h03b", "label": "Roll out on the home-market template everywhere", "pros": ["No schedule slip"], "cons": ["Regulatory exposure in non-home markets"], "estimatedCost": 0, "estimatedScheduleDays": 0, "residualRiskNote": "Direct regulatory exposure."},],
         None, None, "required", None, None, "Zero DPIA findings at rollout across all markets", None, None, ["rsk-15"], ["chg-h03"], [], ["ms-h-07"]),
    ]
    benefits = [
        ("ben-h01", "HEL-BEN-01", "Security incident cost avoidance", "financial", "own-h4", 4200000, 500000, "Annualised incident cost", 3800000, 1200000, 2600000, 200, 380, "in-progress", ["ms-h-03", "ms-h-06"], ["rsk-09"], [], [], [(200, 300000), (280, 600000), (360, 900000)]),
        ("ben-h02", "HEL-BEN-02", "Privileged access reduction", "efficiency", "own-h3", 900000, 100000, "Standing privileged accounts", 1400, 400, 700, 100, 300, "in-progress", ["ms-h-02"], ["rsk-03"], [], [], [(100, 200000), (200, 550000), (300, 850000)]),
        ("ben-h03", "HEL-BEN-03", "Regulatory audit finding reduction", "strategic", "own-h6", 1600000, 700000, "Open audit findings", 24, 6, 15, 250, 400, "at-risk", ["ms-h-09"], ["rsk-15"], [], [], [(250, 150000), (330, 400000)]),
        ("ben-h04", "HEL-BEN-04", "Cyber insurance premium reduction", "financial", "own-h1", 700000, 0, "Annual premium delta", 0, -700000, -200000, 300, 400, "not-started", ["ms-h-05", "ms-h-06"], [], [], [], []),
    ]
    fmea = [
        ("fme-h01", "HEL-FM-01", "IAM legacy onboarding", "Application inventory", "Legacy application tier missed from scope", "Unmanaged identity exposure for that tier", "Inventory built from architecture diagrams only", 4, 3, 3, "Manual architecture review", "Inventory reconciled against live network discovery", "own-h3", 260, "complete", 4, 1, 1, ["rsk-01"], ["cse-h1"], ["ctl-h01"]),
        ("fme-h02", "HEL-FM-02", "Privileged access", "Access grant lifecycle", "Standing access never expires", "Excessive access persists indefinitely", "No re-certification requirement", 5, 4, 3, "Ad hoc manual review", "Time-boxed access with periodic re-certification", "own-h3", 118, "complete", 5, 1, 1, ["rsk-03"], ["cse-h2"], ["ctl-h02"]),
        ("fme-h03", "HEL-FM-03", "Network segmentation", "Policy modelling", "Policy built from diagrams, not live traffic", "Segmentation breaks an undocumented data flow", "Diagram-only policy design", 4, 3, 3, "Design review only", "Live-traffic validation before each phase gate", "own-h5", 215, "in-progress", 4, 2, 2, ["rsk-06"], ["cse-h3"], ["ctl-h03"]),
        ("fme-h04", "HEL-FM-04", "SOC tooling vendor", "Capacity planning", "Vendor sizes capacity per customer, not shared pool", "Two concurrent customers exhaust regional capacity", "Single-customer capacity forecast", 5, 3, 3, "Vendor's own forecast only", "Joint capacity forum spanning every affected customer programme", "own-h8", 194, "in-progress", 5, 2, 2, ["rsk-09"], ["cse-h4"], ["ctl-h04"]),
    ]
    metrics = [
        ("met-h01", "Standing privileged accounts", "count", "ws-h-iam", 400, "lower-is-better", [(100, 1400), (180, 1050), (240, 800), (300, 700)]),
        ("met-h02", "Mean time to detect", "hours", "ws-h-soc", 2, "lower-is-better", [(170, 18), (230, 10), (290, 5), (340, 3)]),
        ("met-h03", "Open regulatory audit findings", "count", "ws-h-gov", 6, "lower-is-better", [(250, 24), (300, 18), (340, 12), (370, 8)]),
    ]
    signature_risks = [
        {"id": "rsk-01", "ref": "HEL-01", "title": "Identity and access management rollout misses a legacy application tier",
         "description": "The original application inventory did not cover a regional finance system, which went live outside IAM control until a reconciliation sweep found it.",
         "category": "technology", "owner": "own-h3", "workstream": "ws-h-iam", "status": "monitoring", "strategy": "mitigate",
         "probability": 0.3, "impact": 3, "financialImpact": 340000, "scheduleDays": 8, "strategic": 3, "reputation": 2,
         "horizon": "near", "confidence": "measured", "controlIds": ["ctl-h01"], "causeIds": ["cse-h1"], "actionIds": ["act-h01"],
         "milestones": ["ms-h-01"], "benefits": [], "dependencies": ["dep-h08"], "issues": ["iss-h01"],
         "identifiedOffset": 258, "reviewOffset": 300, "tags": ["identity", "legacy"],
         "history": [(258, 0.55, 4, 620000), (270, 0.3, 3, 340000)]},
        {"id": "rsk-03", "ref": "HEL-03", "title": "Privileged access review finds accounts with excessive standing access",
         "description": "A full audit of privileged access under the legacy identity model found accounts, including service accounts with no owner, that had never been re-certified.",
         "category": "security", "owner": "own-h3", "workstream": "ws-h-iam", "status": "monitoring", "strategy": "mitigate",
         "probability": 0.25, "impact": 4, "financialImpact": 420000, "scheduleDays": 6, "strategic": 3, "reputation": 4,
         "horizon": "immediate", "confidence": "verified", "controlIds": ["ctl-h02"], "causeIds": ["cse-h2"], "actionIds": ["act-h02"],
         "milestones": ["ms-h-02"], "benefits": ["ben-h02"], "dependencies": [], "issues": ["iss-h02"],
         "identifiedOffset": 96, "reviewOffset": 300, "tags": ["identity", "security"],
         "history": [(96, 0.5, 5, 900000), (120, 0.25, 4, 420000)]},
        {"id": "rsk-06", "ref": "HEL-06", "title": "Zero-trust network segmentation breaks a business-critical batch job",
         "description": "The segmentation policy was modelled from architecture diagrams rather than live traffic and did not account for an undocumented legacy data flow feeding a nightly finance batch job.",
         "category": "operational", "owner": "own-h5", "workstream": "ws-h-cloud", "status": "escalated", "strategy": "mitigate",
         "probability": 0.45, "impact": 4, "financialImpact": 480000, "scheduleDays": 12, "strategic": 3, "reputation": 3,
         "horizon": "immediate", "confidence": "verified", "controlIds": ["ctl-h03"], "causeIds": ["cse-h3"], "actionIds": ["act-h03"],
         "milestones": ["ms-h-04"], "benefits": [], "dependencies": [], "issues": [],
         "identifiedOffset": 210, "reviewOffset": 305, "tags": ["operational", "critical-path"],
         "history": [(210, 0.6, 4, 640000), (235, 0.45, 4, 480000)]},
        {"id": "rsk-09", "ref": "HEL-09", "title": "Meridian Cloud Systems capacity shortfall delays SOC tooling rollout",
         "description": "Meridian Cloud Systems sized regional capacity against a single-customer forecast; ATLAS's data platform work draws on the same regional pool, and the shared shortfall now threatens the SOC tooling general-availability date.",
         "category": "vendor", "owner": "own-h4", "workstream": "ws-h-soc", "status": "escalated", "strategy": "mitigate",
         "probability": 0.5, "impact": 4, "financialImpact": 560000, "scheduleDays": 20, "strategic": 4, "reputation": 2,
         "horizon": "immediate", "confidence": "verified", "controlIds": ["ctl-h04"], "causeIds": ["cse-h4"], "actionIds": ["act-h04"],
         "milestones": ["ms-h-03"], "benefits": ["ben-h01"], "dependencies": ["dep-h01", "dep-h04"], "issues": ["iss-h03"],
         "vendor": "Meridian Cloud Systems", "sharedRiskGroupId": "shared-meridian-capacity-01",
         "identifiedOffset": 190, "reviewOffset": 300, "tags": ["vendor", "critical-path", "shared-vendor"],
         "history": [(190, 0.65, 4, 780000), (220, 0.5, 4, 560000)]},
        {"id": "rsk-15", "ref": "HEL-15", "title": "Data protection impact assessment backlog blocks endpoint rollout in regulated markets",
         "description": "The DPIA template was designed for the home market only; two other in-scope regulatory markets have not yet been re-scoped, and the same privacy officer also carries NOVA's consent management workstream.",
         "category": "regulatory", "owner": "own-h7", "workstream": "ws-h-gov", "status": "escalated", "strategy": "mitigate",
         "probability": 0.4, "impact": 4, "financialImpact": 380000, "scheduleDays": 15, "strategic": 3, "reputation": 4,
         "horizon": "near", "confidence": "verified", "controlIds": ["ctl-h05"], "causeIds": ["cse-h5"], "actionIds": ["act-h05"],
         "milestones": ["ms-h-07"], "benefits": ["ben-h03"], "dependencies": ["dep-h03"], "issues": ["iss-h04"],
         "identifiedOffset": 218, "reviewOffset": 295, "tags": ["regulatory", "shared-resource"],
         "history": [(218, 0.55, 4, 500000), (240, 0.4, 4, 380000)]},
    ]

    bulk_ids = [2, 4, 5, 7, 8, 10, 11, 12, 13, 14, 16, 17, 18, 19, 20]
    bulk = risk_bulk(bulk_ids, [o[0] for o in owners], [w[0] for w in workstreams], [m[0] for m in milestones],
                      [["operational"], ["technology"], ["vendor"], ["people"], ["people"], ["operational"], ["delivery"], ["regulatory"], ["financial"], ["operational"], ["technology"], ["technology"], ["vendor"], ["delivery"], ["technology"]])
    all_risks = signature_risks + bulk

    return {
        "id": "prog-helios", "name": "Cybersecurity Transformation", "codename": "HELIOS",
        "description": "Modernisation of identity, security operations, cloud security posture and governance, with a SOC tooling vendor whose regional capacity shortfall also affects ATLAS, and a privacy officer shared with NOVA's consent programme.",
        "sponsor": "Marcus Weber, Chief Information Security Officer", "programManager": "Priya Anand",
        "start": "2025-11-01", "end": "2026-12-31", "status_date": "2026-09-09",
        "budget": 7100000, "spendToDate": 3980000, "forecastSpend": 7450000, "currency": "EUR",
        "businessUnit": "Information Security", "strategicPriority": "critical", "programStatus": "active",
        "strategicObjectives": [
            "Modernise identity and access management with time-boxed, re-certified privileged access",
            "Stand up a new SOC detection and response capability across every monitored estate",
            "Move to zero-trust network segmentation and continuous cloud security posture management",
            "Close every open regulatory audit finding ahead of the transformation close",
        ],
        "owners": owners, "workstreams": workstreams, "milestones": milestones, "deliverables": deliverables,
        "causes": causes, "controls": controls, "actions": actions, "issues": issues, "assumptions": assumptions,
        "dependencies": dependencies, "changes": changes, "decisions": decisions, "benefits": benefits,
        "fmea": fmea, "metrics": metrics, "risks": all_risks,
    }

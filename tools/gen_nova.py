"""NOVA: Customer Experience Transformation. Profile consumed by gen_satellite.build_program."""

STRATS = ["mitigate", "mitigate", "mitigate", "transfer", "accept"]
HORIZONS = ["immediate", "near", "near", "mid", "far"]
CONF = ["measured", "verified", "indicative", "anecdotal"]

def risk_bulk(ids, owners, ws, ms_pool, tags_extra):
    titles = [
        ("Customer app redesign fails usability testing with the target cohort", "delivery"),
        ("Contact centre agents are not trained ahead of the new workflow launch", "people"),
        ("Personalisation engine recommendations degrade checkout conversion", "technology"),
        ("Loyalty programme migration loses point balances for a customer segment", "operational"),
        ("Consent management gaps block personalised marketing in two markets", "regulatory"),
        ("Customer data platform vendor delays the identity resolution milestone", "vendor"),
        ("Voice-of-customer survey response rate is too low to validate the redesign", "data"),
        ("Mobile app store review rejects the release ahead of the launch date", "delivery"),
        ("Customer support ticket volume spikes beyond the new workflow's capacity", "operational"),
        ("Brand and legal sign-off on new messaging is delayed past the campaign date", "delivery"),
        ("A/B test infrastructure cannot reliably attribute conversion lift", "technology"),
        ("Third-party payment provider integration fails PCI compliance review", "security"),
        ("Customer segmentation model uses stale data from the legacy CRM", "data"),
        ("Regional pricing engine miscalculates promotional discounts at launch", "financial"),
        ("Customer journey orchestration tool licence costs exceed budget", "financial"),
    ]
    out_list = []
    for i, num in enumerate(ids):
        title, cat = titles[i % len(titles)]
        rid = "rsk-" + str(num).zfill(2)
        ref = "NOV-" + str(num).zfill(2)
        owner = owners[i % len(owners)]
        wsid = ws[i % len(ws)]
        prob = round(0.2 + 0.65 * ((i * 11) % 10) / 10, 2)
        impact = 2 + (i % 4)
        fin = 60_000 + (i * 41_000) % 700_000
        sched = 4 + (i * 2) % 35
        hist_base_off = 25 + i * 6
        history = [
            (hist_base_off, max(0.1, prob - 0.12), max(1, impact - 1), int(fin * 0.75)),
            (hist_base_off + 55, prob, impact, fin),
        ]
        out_list.append({
            "id": rid, "ref": ref, "title": title, "description": title + ".",
            "category": cat, "owner": owner, "workstream": wsid, "status": "open" if i % 3 else "monitoring",
            "strategy": STRATS[i % len(STRATS)], "probability": prob, "impact": impact, "financialImpact": fin,
            "scheduleDays": sched, "strategic": 2 + (i % 3), "reputation": 1 + (i % 4),
            "horizon": HORIZONS[i % len(HORIZONS)], "confidence": CONF[i % len(CONF)],
            "milestones": [ms_pool[i % len(ms_pool)]], "identifiedOffset": 18 + i * 5, "reviewOffset": 280 + i * 3,
            "tags": ["nova"] + (tags_extra[i] if i < len(tags_extra) else []),
            "history": history,
        })
    return out_list

def profile():
    owners = [
        ("own-n1", "Camille Rousseau", "Programme Director", None),
        ("own-n2", "Diego Fernandez", "Programme Manager", None),
        ("own-n3", "Aoife Byrne", "Customer Experience Lead", "ws-n-cx"),
        ("own-n4", "Rian Cole", "Mobile Platform Lead", "ws-n-app"),
        ("own-n5", "Meera Krishnan", "Contact Centre Transformation Lead", "ws-n-cc"),
        ("own-n6", "Tobias Hahn", "Marketing Technology Lead", "ws-n-mkt"),
        ("own-n7", "Layla Haddad", "Data and Privacy Lead", None),
        ("own-n8", "Connor Walsh", "Vendor Management Lead", None),
    ]
    workstreams = [
        ("ws-n-cx", "CX", "Customer Journey Redesign", "own-n3", 0, 360, 2_100_000, 1_250_000, 62, "in-progress",
         "Redesign of the end-to-end customer journey across web, app and contact centre."),
        ("ws-n-app", "APP", "Mobile App and Personalisation", "own-n4", 30, 370, 2_600_000, 1_500_000, 55, "in-progress",
         "Rebuild of the customer mobile app with a new personalisation and checkout engine."),
        ("ws-n-cc", "CC", "Contact Centre Transformation", "own-n5", 40, 350, 1_400_000, 780_000, 50, "in-progress",
         "New agent workflow, training and capacity model for the redesigned contact centre."),
        ("ws-n-mkt", "MKT", "Loyalty and Marketing Technology", "own-n6", 20, 365, 1_600_000, 900_000, 46, "in-progress",
         "Loyalty programme migration and consent-aware personalised marketing."),
    ]
    milestones = [
        ("ms-n-01", "Customer journey blueprint signed off", "ws-n-cx", "own-n3", 30, 30, "complete", True, [], [], "End-to-end journey blueprint agreed with all channel owners."),
        ("ms-n-02", "Usability testing round 1 complete", "ws-n-cx", "own-n3", 90, 95, "complete", False, ["ms-n-01"], [], "First round of usability testing with the target customer cohort."),
        ("ms-n-03", "Mobile app beta release", "ws-n-app", "own-n4", 160, 190, "in-progress", True, ["ms-n-02"], [], "Beta release of the redesigned mobile app to a limited customer cohort."),
        ("ms-n-04", "Personalisation engine live", "ws-n-app", "own-n4", 210, 245, "at-risk", False, ["ms-n-03"], [], "Checkout personalisation engine live for all customers."),
        ("ms-n-05", "Agent workflow training complete", "ws-n-cc", "own-n5", 240, 265, "in-progress", False, ["ms-n-01"], [], "All contact centre agents trained on the new workflow."),
        ("ms-n-06", "Loyalty programme migrated", "ws-n-mkt", "own-n6", 200, 230, "at-risk", True, [], [], "Customer loyalty balances migrated to the new platform."),
        ("ms-n-07", "Consent management live in all markets", "ws-n-mkt", "own-n7", 180, 205, "in-progress", True, [], [], "Consent capture and enforcement live in every operating market."),
        ("ms-n-08", "Customer launch", "ws-n-cx", "own-n1", 300, 340, "at-risk", True, ["ms-n-04", "ms-n-05"], [], "Full customer-facing launch, the fulcrum milestone that receives ATLAS/ORION integration slip and depends on ORION's carrier integration being live."),
        ("ms-n-09", "Contact centre capacity ramp complete", "ws-n-cc", "own-n5", 320, 345, "not-started", False, ["ms-n-05", "ms-n-08"], [], "Contact centre scaled to handle post-launch ticket volume."),
        ("ms-n-10", "Post-launch conversion review", "ws-n-app", "own-n4", 360, 380, "not-started", False, ["ms-n-08"], [], "First conversion and satisfaction review after full launch."),
    ]
    deliverables = [
        ("dlv-n-01", "Customer journey blueprint document", "ms-n-01", "own-n3", 28, "complete", 100, "Blueprint signed by every channel owner."),
        ("dlv-n-02", "Usability test report round 1", "ms-n-02", "own-n3", 93, "complete", 100, "Findings incorporated into the design backlog."),
        ("dlv-n-03", "Mobile app beta build", "ms-n-03", "own-n4", 185, "in-progress", 75, "Beta build passes app store pre-review."),
        ("dlv-n-04", "Personalisation engine integration", "ms-n-04", "own-n4", 240, "in-progress", 55, "Engine integrated with checkout and A/B test infrastructure."),
        ("dlv-n-05", "Agent workflow training pack", "ms-n-05", "own-n5", 260, "in-progress", 60, "Training pack covers every new workflow path."),
        ("dlv-n-06", "Loyalty balance migration report", "ms-n-06", "own-n6", 225, "in-progress", 45, "Reconciliation report for every migrated customer segment."),
        ("dlv-n-07", "Consent management rollout plan", "ms-n-07", "own-n7", 200, "in-progress", 70, "Rollout plan covering all regulatory regimes in scope."),
        ("dlv-n-08", "Launch readiness pack", "ms-n-08", "own-n1", 335, "in-progress", 30, "Go/no-go pack for the full customer launch."),
    ]
    causes = [
        ("cse-n1", "NOV-C-01", "Usability testing recruited too narrow a customer cohort", "process", True, 7, "own-n3",
         ["Why did the redesign fail testing? The cohort skewed to power users, not typical customers."], ["rsk-01", "rsk-11"], []),
        ("cse-n2", "NOV-C-02", "Contact centre training schedule was built before the workflow was finalised", "process", True, 6, "own-n5",
         ["Why are agents untrained? Training content could not be finalised until the workflow was frozen, which happened late."], ["rsk-03", "rsk-14"], []),
        ("cse-n3", "NOV-C-03", "Personalisation engine was tuned on a synthetic dataset, not live traffic", "technology", True, 5, "own-n4",
         ["Why is conversion degrading? The model was never validated against real customer behaviour before launch."], ["rsk-06"], []),
        ("cse-n4", "NOV-C-04", "Loyalty platform migration script does not handle multi-currency balances", "technology", True, 5, "own-n6",
         ["Why are balances lost? The migration script assumes single-currency accounts."], ["rsk-09"], []),
        ("cse-n5", "NOV-C-05", "Consent capture flow was designed against one market's regulation only", "policy", True, 4, "own-n7",
         ["Why is consent non-compliant elsewhere? The flow was designed for the home market and not re-validated per market."], ["rsk-15"], []),
        ("cse-n6", "NOV-C-06", "Customer data platform vendor underestimated identity resolution complexity", "technology", False, 4, "own-n8",
         ["Why is the vendor late? Their original estimate assumed clean source data, which was not true here."], ["rsk-08"], []),
    ]
    controls = [
        ("ctl-n01", "NOV-CTL-01", "Widened usability panel with representative recruitment", "corrective", "own-n3", "monthly", 0.65, 0.55, "panel report", 240, 270, False, "active", ["rsk-01", "rsk-11"], "Recruitment broadened to match the real customer base, not just power users."),
        ("ctl-n02", "NOV-CTL-02", "Workflow freeze gate before training content lock", "preventive", "own-n5", "event-driven", 0.7, 0.6, "gate log", None, None, False, "active", ["rsk-03", "rsk-14"], "Training content cannot be finalised until the workflow is formally frozen."),
        ("ctl-n03", "NOV-CTL-03", "Live-traffic shadow testing for the personalisation engine", "detective", "own-n4", "continuous", 0.75, 0.65, "shadow test dashboard", 230, None, True, "active", ["rsk-06"], "Model recommendations run in shadow against live traffic before going live."),
        ("ctl-n04", "NOV-CTL-04", "Multi-currency migration dry run with reconciliation", "preventive", "own-n6", "weekly", 0.7, 0.6, "reconciliation log", 220, 250, False, "active", ["rsk-09"], "Full dry run of the migration script against multi-currency test accounts."),
        ("ctl-n05", "NOV-CTL-05", "Per-market consent flow legal review", "preventive", "own-n7", "quarterly", 0.75, 0.65, "legal sign-off log", 190, 220, False, "active", ["rsk-15"], "Each market's consent flow reviewed against local regulation before launch."),
        ("ctl-n06", "NOV-CTL-06", "Vendor identity-resolution data quality remediation plan", "corrective", "own-n8", "monthly", 0.55, 0.45, "remediation tracker", 210, 240, False, "active", ["rsk-08"], "Joint remediation plan with the vendor to clean source data before resolution runs."),
        ("ctl-n07", "NOV-CTL-07", "Contact centre capacity model with launch-week surge factor", "detective", "own-n5", "weekly", 0.6, 0.5, "capacity model", 300, 330, False, "active", ["rsk-10"], "Capacity model includes a surge factor for the launch week specifically."),
        ("ctl-n08", "NOV-CTL-08", "App store pre-review submission a fortnight early", "preventive", "own-n4", "event-driven", 0.6, 0.55, "submission log", None, None, False, "active", ["rsk-12"], "Early pre-review submission to surface rejection reasons before the real deadline."),
        ("ctl-n09", "NOV-CTL-09", "PCI compliance pre-assessment with the payment provider", "preventive", "own-n8", "quarterly", 0.7, 0.6, "pre-assessment report", 250, 280, False, "active", ["rsk-13"], "Independent PCI pre-assessment ahead of the formal compliance review."),
        ("ctl-n10", "NOV-CTL-10", "A/B test attribution audit", "detective", "own-n4", "monthly", 0.65, 0.55, "attribution audit", 260, 290, True, "active", ["rsk-17"], "Independent audit of the A/B attribution pipeline for leakage between arms."),
    ]
    actions = [
        ("act-n01", "NOV-A-01", "Re-recruit usability panel with representative sampling", "own-n3", 250, 246, "complete", "high", ["rsk-01"], [], [], 0.35, 100, "Second round completed with a representative cohort."),
        ("act-n02", "NOV-A-02", "Freeze workflow design and unlock training content build", "own-n5", 245, None, "in-progress", "high", ["rsk-03"], [], [], 0.4, 50, "Workflow frozen; training content build now underway."),
        ("act-n03", "NOV-A-03", "Run shadow test of personalisation engine against live traffic", "own-n4", 235, None, "in-progress", "critical", ["rsk-06"], [], [], 0.45, 60, "Shadow test running; early results show conversion parity within tolerance."),
        ("act-n04", "NOV-A-04", "Fix multi-currency handling in migration script", "own-n6", 225, 223, "complete", "critical", ["rsk-09"], [], [], 0.5, 100, "Script patched and re-tested against multi-currency accounts."),
        ("act-n05", "NOV-A-05", "Localise consent flow for each in-scope market", "own-n7", 200, None, "in-progress", "high", ["rsk-15"], [], [], 0.4, 45, "Two of four markets localised and legally signed off."),
        ("act-n06", "NOV-A-06", "Escalate vendor data quality remediation plan", "own-n8", 215, None, "open", "medium", ["rsk-08"], [], [], 0.3, 25, "Escalation raised at vendor governance forum."),
    ]
    issues = [
        ("iss-n01", "NOV-I-01", "First usability round failed on three of five target tasks", "own-n3", "ws-n-cx", "high", "resolved", 92, 250, 246, 0, 0, None, ["cse-n1"], ["act-n01"], ["ms-n-02"], "Resolved by re-testing with a representative cohort; redesign validated on retest."),
        ("iss-n02", "NOV-I-02", "Loyalty balance discrepancy found for multi-currency accounts in dry run", "own-n6", "ws-n-mkt", "critical", "resolved", 222, 226, 223, 0, 0, None, ["cse-n4"], ["act-n04"], ["ms-n-06"], "Resolved before production migration; no live balances affected."),
        ("iss-n03", "NOV-I-03", "Consent flow found non-compliant in one market during legal review", "own-n7", "ws-n-mkt", "high", "in-progress", 195, 230, None, 0, 15, None, ["cse-n5"], ["act-n05"], ["ms-n-07"], "Localisation underway for the affected market."),
        ("iss-n04", "NOV-I-04", "Customer data platform vendor missed the identity resolution milestone date", "own-n8", "ws-n-app", "medium", "open", 210, 260, None, 90_000, 20, None, ["cse-n6"], ["act-n06"], [], "Vendor remediation plan in progress; new date not yet firm."),
    ]
    assumptions = [
        ("asm-n01", "NOV-AS-01", "The widened usability panel will validate the redesign without further major rework", "own-n3", "validated", "measured", 255, "rsk-01", ["ms-n-02"], "Retest passed on all five target tasks."),
        ("asm-n02", "NOV-AS-02", "Contact centre agents can complete training within the two-week window before launch", "own-n5", "unvalidated", "indicative", 260, "rsk-03", ["ms-n-05"], "Training capacity not yet confirmed against the compressed window."),
        ("asm-n03", "NOV-AS-03", "ORION's carrier integration will be live before the NOVA customer launch date", "own-n1", "unvalidated", "anecdotal", 335, None, ["ms-n-08"], "Dependent on ORION's own integration milestone, tracked as a cross-programme link."),
        ("asm-n04", "NOV-AS-04", "Payment provider will pass the PCI pre-assessment without material remediation", "own-n8", "validating", "indicative", 275, "rsk-13", ["ms-n-04"], "Pre-assessment scheduled; provider has flagged one likely finding."),
    ]
    dependencies = [
        ("dep-n01", "NOV-DEP-01", "ORION carrier integration go-live", "cross-program", "ORION integration workstream", "own-n1", "NOVA customer launch workstream", "own-n1", 296, "at-risk", "critical", 0.4, 20, ["ms-n-08"], [], [], [], "NOVA's customer launch assumes ORION's carrier integration (with real-time order tracking) is live first."),
        ("dep-n02", "NOV-DEP-02", "ATLAS API Platform contract for customer data", "cross-program", "ATLAS API workstream", "own-n4", "NOVA personalisation workstream", "own-n4", 296, "at-risk", "high", 0.45, 18, ["ms-n-04"], [], [], [], "Personalisation engine consumes customer data through the ATLAS API layer once it reaches general availability."),
        ("dep-n03", "NOV-DEP-03", "Customer data platform vendor identity resolution delivery", "vendor", "Customer data platform vendor", "own-n8", "NOVA app workstream", "own-n4", 240, "at-risk", "high", 0.5, 22, ["ms-n-04"], [], [], ["rsk-08"], "Personalisation depends on resolved customer identities from the vendor platform."),
        ("dep-n04", "NOV-DEP-04", "Payment provider PCI compliance sign-off", "vendor", "Payment provider", "own-n8", "NOVA app workstream", "own-n4", 280, "on-track", "critical", 0.3, 15, ["ms-n-04"], [], [], ["rsk-13"], "Checkout cannot go live without a clean PCI sign-off."),
        ("dep-n05", "NOV-DEP-05", "App store review and approval", "external", "Mobile app store", "own-n4", "NOVA app workstream", "own-n4", 190, "on-track", "high", 0.35, 10, ["ms-n-03"], [], [], ["rsk-12"], "Store review must clear before the beta can release."),
        ("dep-n06", "NOV-DEP-06", "Legal sign-off on per-market consent flows", "regulatory", "Legal and compliance", "own-n7", "NOVA marketing workstream", "own-n7", 205, "at-risk", "high", 0.4, 18, ["ms-n-07"], [], [], ["rsk-15"], "Each market's consent flow needs independent legal sign-off."),
        ("dep-n07", "NOV-DEP-07", "Contact centre workforce management system upgrade", "internal", "IT operations", "own-n5", "NOVA contact centre workstream", "own-n5", 260, "on-track", "medium", 0.25, 10, ["ms-n-09"], [], [], [], "Capacity ramp needs the upgraded workforce management system."),
        ("dep-n08", "NOV-DEP-08", "Brand and legal sign-off on launch messaging", "internal", "Brand and legal", "own-n1", "NOVA CX workstream", "own-n3", 330, "on-track", "medium", 0.3, 12, ["ms-n-08"], [], [], [], "Final messaging sign-off ahead of the customer launch."),
    ]
    changes = [
        ("chg-n01", "NOV-CHG-01", "Widen the usability panel recruitment brief", "own-n3", "First round skewed to power users and failed on three tasks", 248, "No scope change", 25_000, 10, "Additional recruitment budget", "Reduces redesign-rejection risk", 0, ["ws-n-cx"], ["ms-n-02"], [], [], ["rsk-01"], "approved", "own-n1", 249, "Cost is small against the risk of shipping an unvalidated redesign", "implemented", "Broadened recruitment to better represent the real customer base."),
        ("chg-n02", "NOV-CHG-02", "Compress training window and add a second trainer cohort", "own-n5", "Workflow freeze slipped, compressing the available training time", 246, "No scope change", 60_000, 0, "Second trainer cohort", "Reduces go-live support risk", 0, ["ws-n-cc"], ["ms-n-05"], [], [], ["rsk-03"], "approved", "own-n1", 250, "Protects the launch date without descoping training depth", "implemented", "A second trainer cohort compresses delivery time without cutting content."),
        ("chg-n03", "NOV-CHG-03", "Localise consent flow ahead of legal review, market by market", "own-n7", "Consent flow found non-compliant in one market during review", 198, "No scope change", 40_000, 14, "None", "Reduces regulatory exposure", 0, ["ws-n-mkt"], ["ms-n-07"], ["dep-n06"], [], ["rsk-15"], "pending", None, None, None, "in-review", "Per-market localisation ahead of each market's own legal review."),
    ]
    decisions = [
        ("dec-n01", "NOV-DEC-01", "Usability panel recruitment scope", "First usability round failed on three of five target tasks", "own-n3", "own-n1", "Programme Steering", 246,
         [{"id": "opt-n01a", "label": "Widen recruitment to a representative cohort", "pros": ["More representative signal"], "cons": ["Added cost and time"], "estimatedCost": 25000, "estimatedScheduleDays": 10, "residualRiskNote": "Small schedule cost."},
          {"id": "opt-n01b", "label": "Proceed on the existing panel's findings", "pros": ["No added cost"], "cons": ["Redesign risk stays unvalidated"], "estimatedCost": 0, "estimatedScheduleDays": 0, "residualRiskNote": "Risk of shipping an unvalidated redesign."}],
         249, None, "decided", "opt-n01a", "Validating against a representative cohort is worth the small delay", "Redesign validated on retest with representative users", None, None, ["rsk-01"], ["chg-n01"], [], ["ms-n-02"]),
        ("dec-n02", "NOV-DEC-02", "Training delivery model under a compressed window", "Workflow freeze slipped, compressing the training window before launch", "own-n5", "own-n1", "Programme Steering", 247,
         [{"id": "opt-n02a", "label": "Add a second trainer cohort", "pros": ["Protects depth and the launch date"], "cons": ["Incremental cost"], "estimatedCost": 60000, "estimatedScheduleDays": 0, "residualRiskNote": "Trainer availability not guaranteed."},
          {"id": "opt-n02b", "label": "Cut training content depth", "pros": ["No added cost"], "cons": ["Higher agent error rate at launch"], "estimatedCost": 0, "estimatedScheduleDays": 0, "residualRiskNote": "Accepts higher go-live support risk."}],
         250, None, "decided", "opt-n02a", "Go-live support risk is not an acceptable trade for the saving", "Agents fully trained ahead of launch", None, None, ["rsk-03"], ["chg-n02"], [], ["ms-n-05"]),
        ("dec-n03", "NOV-DEC-03", "Consent flow localisation sequencing", "Consent flow found non-compliant in one market during legal review", "own-n7", "own-n1", "Programme Steering", 197,
         [{"id": "opt-n03a", "label": "Localise market by market ahead of each review", "pros": ["Reduces regulatory exposure per market"], "cons": ["Schedule slip per market"], "estimatedCost": 40000, "estimatedScheduleDays": 14, "residualRiskNote": "Cumulative slip across markets."},
          {"id": "opt-n03b", "label": "Launch on the home-market flow everywhere", "pros": ["No schedule slip"], "cons": ["Regulatory exposure in non-home markets"], "estimatedCost": 0, "estimatedScheduleDays": 0, "residualRiskNote": "Direct regulatory exposure."}],
         None, None, "required", None, None, "Zero regulatory findings at launch across all markets", None, None, ["rsk-15"], ["chg-n03"], [], ["ms-n-07"]),
    ]
    benefits = [
        ("ben-n01", "NOV-BEN-01", "Checkout conversion rate uplift", "financial", "own-n4", 3500000, 400000, "Checkout conversion rate", 2.1, 3.4, 2.5, 190, 380, "in-progress", ["ms-n-04"], ["rsk-06"], [], [], [(200, 100000), (280, 250000), (360, 400000)]),
        ("ben-n02", "NOV-BEN-02", "Contact centre cost-to-serve reduction", "efficiency", "own-n5", 1800000, 200000, "Average handle time", 620, 420, 560, 240, 360, "at-risk", ["ms-n-05", "ms-n-09"], ["rsk-03"], [], [], [(260, 60000), (320, 140000), (360, 200000)]),
        ("ben-n03", "NOV-BEN-03", "Customer satisfaction score improvement", "customer", "own-n3", 1200000, 500000, "Net customer satisfaction score", 61, 75, 68, 30, 380, "in-progress", ["ms-n-01", "ms-n-08"], [], [], [], [(100, 100000), (250, 300000), (360, 500000)]),
        ("ben-n04", "NOV-BEN-04", "Loyalty programme retention uplift", "strategic", "own-n6", 2200000, 0, "12-month repeat purchase rate", 34, 42, 34, 230, 400, "not-started", ["ms-n-06"], ["rsk-09"], [], [], []),
    ]
    fmea = [
        ("fme-n01", "NOV-FM-01", "Usability validation", "Panel recruitment", "Panel skews to power users", "Redesign fails on typical customer tasks", "Convenience-sample recruitment", 4, 3, 3, "Manual recruitment review", "Representative recruitment quota by segment", "own-n3", 246, "complete", 4, 1, 1, ["rsk-01"], ["cse-n1"], ["ctl-n01"]),
        ("fme-n02", "NOV-FM-02", "Loyalty migration", "Balance transfer", "Multi-currency balances mis-converted", "Customer-visible balance loss", "Single-currency migration script", 5, 3, 2, "Spot-check sample", "Full dry-run reconciliation before production migration", "own-n6", 223, "complete", 5, 1, 1, ["rsk-09"], ["cse-n4"], ["ctl-n04"]),
        ("fme-n03", "NOV-FM-03", "Consent capture", "Flow design", "Flow designed for one market only", "Non-compliant capture in other markets", "Home-market-only design", 4, 3, 3, "Home-market legal review only", "Per-market legal review before each market's launch", "own-n7", 230, "in-progress", 4, 1, 2, ["rsk-15"], ["cse-n5"], ["ctl-n05"]),
        ("fme-n04", "NOV-FM-04", "Personalisation launch", "Model validation", "Model validated on synthetic data only", "Conversion degrades against real traffic", "Synthetic-dataset validation", 4, 3, 3, "Offline synthetic validation", "Live-traffic shadow testing before full rollout", "own-n4", 235, "in-progress", 4, 2, 2, ["rsk-06"], ["cse-n3"], ["ctl-n03"]),
    ]
    metrics = [
        ("met-n01", "Checkout conversion rate", "pct", "ws-n-app", 3.4, "higher-is-better", [(190, 2.1), (260, 2.4), (320, 2.8), (370, 3.0)]),
        ("met-n02", "Average agent handle time", "seconds", "ws-n-cc", 420, "lower-is-better", [(240, 620), (290, 560), (330, 500), (350, 460)]),
        ("met-n03", "Net customer satisfaction score", "score", "ws-n-cx", 75, "higher-is-better", [(30, 61), (150, 64), (280, 68), (360, 70)]),
    ]
    signature_risks = [
        {"id": "rsk-01", "ref": "NOV-01", "title": "Customer app redesign fails usability testing with the target cohort",
         "description": "The first usability round recruited a convenience sample skewed to power users; the redesign failed on three of five target tasks with typical customers.",
         "category": "delivery", "owner": "own-n3", "workstream": "ws-n-cx", "status": "monitoring", "strategy": "mitigate",
         "probability": 0.35, "impact": 3, "financialImpact": 380000, "scheduleDays": 10, "strategic": 3, "reputation": 3,
         "horizon": "near", "confidence": "measured", "controlIds": ["ctl-n01"], "causeIds": ["cse-n1"], "actionIds": ["act-n01"],
         "milestones": ["ms-n-02"], "benefits": ["ben-n03"], "dependencies": [], "issues": ["iss-n01"],
         "identifiedOffset": 92, "reviewOffset": 300, "tags": ["ux", "customer-impact"],
         "history": [(92, 0.6, 4, 700000), (250, 0.35, 3, 380000)]},
        {"id": "rsk-03", "ref": "NOV-03", "title": "Contact centre agents are not trained ahead of the new workflow launch",
         "description": "Training content could not be finalised until the workflow design was frozen, which happened later than planned, compressing the training window before launch.",
         "category": "people", "owner": "own-n5", "workstream": "ws-n-cc", "status": "escalated", "strategy": "mitigate",
         "probability": 0.55, "impact": 4, "financialImpact": 260000, "scheduleDays": 14, "strategic": 3, "reputation": 3,
         "horizon": "immediate", "confidence": "verified", "controlIds": ["ctl-n02"], "causeIds": ["cse-n2"], "actionIds": ["act-n02"],
         "milestones": ["ms-n-05"], "benefits": ["ben-n02"], "dependencies": [], "issues": [],
         "identifiedOffset": 240, "reviewOffset": 310, "tags": ["people", "critical-path"],
         "history": [(240, 0.65, 4, 320000), (280, 0.55, 4, 260000)]},
        {"id": "rsk-06", "ref": "NOV-06", "title": "Personalisation engine recommendations degrade checkout conversion",
         "description": "The recommendation model was tuned on a synthetic dataset and has not yet been validated against real customer behaviour; a live-traffic shadow test is under way.",
         "category": "technology", "owner": "own-n4", "workstream": "ws-n-app", "status": "monitoring", "strategy": "mitigate",
         "probability": 0.4, "impact": 4, "financialImpact": 520000, "scheduleDays": 8, "strategic": 3, "reputation": 2,
         "horizon": "near", "confidence": "measured", "controlIds": ["ctl-n03"], "causeIds": ["cse-n3"], "actionIds": ["act-n03"],
         "milestones": ["ms-n-04"], "benefits": ["ben-n01"], "dependencies": [], "issues": [],
         "identifiedOffset": 230, "reviewOffset": 305, "tags": ["technology", "customer-impact"],
         "history": [(230, 0.5, 4, 600000), (290, 0.4, 4, 520000)]},
        {"id": "rsk-09", "ref": "NOV-09", "title": "Loyalty programme migration loses point balances for a customer segment",
         "description": "The migration script does not correctly handle multi-currency balances; a dry run found discrepancies before any production migration occurred.",
         "category": "operational", "owner": "own-n6", "workstream": "ws-n-mkt", "status": "monitoring", "strategy": "mitigate",
         "probability": 0.3, "impact": 5, "financialImpact": 640000, "scheduleDays": 15, "strategic": 3, "reputation": 5,
         "horizon": "near", "confidence": "verified", "controlIds": ["ctl-n04"], "causeIds": ["cse-n4"], "actionIds": ["act-n04"],
         "milestones": ["ms-n-06"], "benefits": ["ben-n04"], "dependencies": [], "issues": ["iss-n02"],
         "identifiedOffset": 218, "reviewOffset": 300, "tags": ["customer-impact", "compliance"],
         "history": [(218, 0.55, 5, 900000), (225, 0.3, 5, 640000)]},
        {"id": "rsk-15", "ref": "NOV-15", "title": "Consent management gaps block personalised marketing in two markets",
         "description": "The consent capture flow was designed and legally validated for the home market only; two other in-scope markets have not yet been re-validated against local regulation.",
         "category": "regulatory", "owner": "own-n7", "workstream": "ws-n-mkt", "status": "escalated", "strategy": "mitigate",
         "probability": 0.5, "impact": 4, "financialImpact": 460000, "scheduleDays": 18, "strategic": 4, "reputation": 4,
         "horizon": "immediate", "confidence": "verified", "controlIds": ["ctl-n05"], "causeIds": ["cse-n5"], "actionIds": ["act-n05"],
         "milestones": ["ms-n-07"], "benefits": [], "dependencies": ["dep-n06"], "issues": ["iss-n03"],
         "identifiedOffset": 195, "reviewOffset": 295, "tags": ["regulatory", "critical-path"],
         "history": [(195, 0.65, 4, 600000), (230, 0.5, 4, 460000)]},
    ]

    bulk_ids = [2, 4, 5, 7, 8, 10, 11, 12, 13, 14, 16, 17, 18, 19, 20]
    bulk = risk_bulk(bulk_ids, [o[0] for o in owners], [w[0] for w in workstreams], [m[0] for m in milestones],
                      [["people"], ["technology"], ["operational"], ["regulatory"], ["vendor"], ["data"], ["delivery"], ["operational"], ["delivery"], ["technology"], ["security"], ["data"], ["financial"], ["financial"], ["people"]])
    all_risks = signature_risks + bulk

    return {
        "id": "prog-nova", "name": "Customer Experience Transformation", "codename": "NOVA",
        "description": "End-to-end redesign of the customer journey across mobile app, web, contact centre and loyalty, with a launch that depends on ATLAS's API platform and ORION's carrier integration both being live.",
        "sponsor": "Camille Rousseau, Chief Customer Officer", "programManager": "Diego Fernandez",
        "start": "2025-12-01", "end": "2026-12-31", "status_date": "2026-09-09",
        "budget": 7700000, "spendToDate": 4430000, "forecastSpend": 8050000, "currency": "EUR",
        "businessUnit": "Customer and Marketing", "strategicPriority": "high", "programStatus": "active",
        "strategicObjectives": [
            "Redesign the customer journey end to end across app, web and contact centre",
            "Lift checkout conversion through validated, live-traffic-tested personalisation",
            "Migrate the loyalty programme without losing a single customer's balance",
            "Bring consent management to full regulatory compliance in every operating market",
        ],
        "owners": owners, "workstreams": workstreams, "milestones": milestones, "deliverables": deliverables,
        "causes": causes, "controls": controls, "actions": actions, "issues": issues, "assumptions": assumptions,
        "dependencies": dependencies, "changes": changes, "decisions": decisions, "benefits": benefits,
        "fmea": fmea, "metrics": metrics, "risks": all_risks,
    }

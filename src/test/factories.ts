import type {
  Acceptance,
  Action,
  Benefit,
  ChangeRequest,
  Control,
  CrossProgramLink,
  Decision,
  Dependency,
  FMEAItem,
  Milestone,
  Portfolio,
  Program,
  Risk,
  Treatment,
} from '@/domain/types';

/** Minimal builders so each test states only the fields it cares about. */

export function makeControl(over: Partial<Control> = {}): Control {
  return {
    id: 'ctl-t1',
    ref: 'CTL-T1',
    name: 'Test control',
    description: 'Control used in unit tests.',
    type: 'preventive',
    ownerId: 'own-1',
    frequency: 'monthly',
    designEffectiveness: 1,
    operatingEffectiveness: 1,
    evidenceRef: 'test',
    automated: false,
    linkedRiskIds: [],
    status: 'active',
    ...over,
  };
}

export function makeRisk(over: Partial<Risk> = {}): Risk {
  return {
    id: 'rsk-t1',
    ref: 'RSK-T1',
    title: 'Test risk',
    description: 'Risk used in unit tests.',
    category: 'delivery',
    ownerId: 'own-1',
    workstreamId: 'ws-1',
    status: 'open',
    dateIdentified: '2026-01-01',
    reviewDate: '2026-09-01',
    strategy: 'mitigate',
    inherentProbability: 0.5,
    inherentImpact: 3,
    inherentFinancialImpact: 1_000_000,
    inherentScheduleImpactDays: 10,
    strategicImpact: 3,
    reputationImpact: 2,
    timeHorizon: 'mid',
    evidenceConfidence: 'verified',
    controlIds: [],
    causeIds: [],
    actionIds: [],
    affectedMilestoneIds: [],
    affectedBenefitIds: [],
    dependencyIds: [],
    issueIds: [],
    history: [],
    evidence: [],
    comments: [],
    tags: [],
    ...over,
  };
}

export function makeMilestone(over: Partial<Milestone> = {}): Milestone {
  return {
    id: 'ms-t1',
    name: 'Test milestone',
    workstreamId: 'ws-1',
    ownerId: 'own-1',
    baselineDate: '2026-06-01',
    forecastDate: '2026-06-01',
    status: 'in-progress',
    isGate: false,
    predecessorIds: [],
    deliverableIds: [],
    description: 'Milestone used in unit tests.',
    ...over,
  };
}

export function makeDependency(over: Partial<Dependency> = {}): Dependency {
  return {
    id: 'dep-t1',
    ref: 'DEP-T1',
    name: 'Test dependency',
    description: 'Dependency used in unit tests.',
    type: 'vendor',
    upstream: 'Vendor',
    upstreamOwnerId: 'own-1',
    downstream: 'Team',
    downstreamOwnerId: 'own-1',
    dueDate: '2026-06-01',
    status: 'at-risk',
    criticality: 'critical',
    delayProbability: 0.5,
    potentialDelayDays: 10,
    affectedMilestoneIds: [],
    affectedBenefitIds: [],
    predecessorIds: [],
    linkedRiskIds: [],
    ...over,
  };
}

export function makeBenefit(over: Partial<Benefit> = {}): Benefit {
  return {
    id: 'ben-t1',
    ref: 'BEN-T1',
    name: 'Test benefit',
    description: 'Benefit used in unit tests.',
    type: 'financial',
    ownerId: 'own-1',
    expectedValue: 1_000_000,
    realisedValue: 0,
    measure: 'Test measure',
    baseline: 100,
    target: 50,
    current: 90,
    startDate: '2026-01-01',
    targetDate: '2026-12-31',
    status: 'in-progress',
    enablingMilestoneIds: [],
    threateningRiskIds: [],
    linkedChangeIds: [],
    linkedDecisionIds: [],
    history: [],
    ...over,
  };
}

export function makeAction(over: Partial<Action> = {}): Action {
  return {
    id: 'act-t1',
    ref: 'ACT-T1',
    title: 'Test action',
    description: 'Action used in unit tests.',
    ownerId: 'own-1',
    dueDate: '2026-06-01',
    status: 'open',
    priority: 'high',
    linkedRiskIds: [],
    linkedIssueIds: [],
    linkedDependencyIds: [],
    expectedRiskReduction: 0.2,
    percentComplete: 0,
    ...over,
  };
}

export function makeChange(over: Partial<ChangeRequest> = {}): ChangeRequest {
  return {
    id: 'chg-t1',
    ref: 'CHG-T1',
    title: 'Test change',
    description: 'Change used in unit tests.',
    requesterId: 'own-1',
    reason: 'Test reason',
    raisedDate: '2026-05-01',
    scopeImpact: 'Test scope impact',
    costImpact: 100_000,
    scheduleImpactDays: 5,
    resourceImpact: 'None',
    riskImpact: 'None',
    benefitImpact: 200_000,
    affectedWorkstreamIds: [],
    affectedMilestoneIds: [],
    affectedDependencyIds: [],
    affectedBenefitIds: [],
    linkedRiskIds: [],
    decision: 'pending',
    status: 'in-review',
    ...over,
  };
}

export function makeDecision(over: Partial<Decision> = {}): Decision {
  return {
    id: 'dec-t1',
    ref: 'DEC-T1',
    title: 'Test decision',
    context: 'Decision used in unit tests.',
    ownerId: 'own-1',
    decisionMakerId: 'own-1',
    forum: 'Test board',
    dateRequired: '2026-06-01',
    status: 'required',
    options: [],
    evidence: [],
    expectedOutcome: 'Something measurable happens.',
    linkedRiskIds: [],
    linkedChangeIds: [],
    linkedBenefitIds: [],
    linkedMilestoneIds: [],
    ...over,
  };
}

export function makeFmea(over: Partial<FMEAItem> = {}): FMEAItem {
  return {
    id: 'fma-t1',
    ref: 'FM-T1',
    process: 'Test process',
    processStep: 'Test step',
    failureMode: 'Test failure mode',
    effect: 'Test effect',
    cause: 'Test cause',
    severity: 3,
    occurrence: 3,
    detection: 3,
    existingControl: 'Test control',
    recommendedAction: 'Test action',
    ownerId: 'own-1',
    dueDate: '2026-06-01',
    actionStatus: 'open',
    postSeverity: 3,
    postOccurrence: 2,
    postDetection: 2,
    linkedRiskIds: [],
    linkedCauseIds: [],
    linkedControlIds: [],
    ...over,
  };
}

export function makeTreatment(over: Partial<Treatment> = {}): Treatment {
  return {
    id: 'trt-t1',
    ref: 'TRT-T1',
    riskId: 'rsk-t1',
    strategy: 'reduce',
    title: 'Test treatment',
    description: 'Treatment used in unit tests.',
    ownerId: 'own-1',
    status: 'in-progress',
    startDate: '2026-01-01',
    targetDate: '2026-06-01',
    expectedExposureReductionPct: 0.4,
    evidenceConfidence: 'measured',
    linkedControlIds: [],
    linkedActionIds: [],
    notes: '',
    ...over,
  };
}

export function makeAcceptance(over: Partial<Acceptance> = {}): Acceptance {
  return {
    id: 'acc-t1',
    ref: 'ACC-T1',
    riskId: 'rsk-t1',
    status: 'accepted',
    rationale: 'Acceptance used in unit tests.',
    approverId: 'own-1',
    approvalDate: '2026-01-01',
    expiryDate: '2026-12-31',
    reviewDate: '2026-11-01',
    conditions: [],
    ...over,
  };
}

export function makeProgram(over: Partial<Program> = {}): Program {
  return {
    id: 'prog-t1',
    name: 'Test programme',
    codename: 'TESTPROG',
    description: 'Programme used in unit tests.',
    sponsor: 'Sponsor',
    programManager: 'Manager',
    startDate: '2026-01-01',
    endDate: '2026-12-31',
    statusDate: '2026-06-30',
    budget: 10_000_000,
    spendToDate: 5_000_000,
    forecastSpend: 10_000_000,
    currency: 'EUR',
    strategicObjectives: [],
    owners: [{ id: 'own-1', name: 'Test Owner', role: 'Tester' }],
    workstreams: [],
    milestones: [],
    deliverables: [],
    risks: [],
    causes: [],
    controls: [],
    actions: [],
    issues: [],
    assumptions: [],
    dependencies: [],
    changes: [],
    decisions: [],
    benefits: [],
    fmea: [],
    dmaic: [],
    metrics: [],
    treatments: [],
    acceptances: [],
    ...over,
  };
}

export function makeCrossLink(over: Partial<CrossProgramLink> = {}): CrossProgramLink {
  return {
    id: 'xlink-t1',
    kind: 'dependency',
    label: 'Test cross-programme link',
    description: 'Cross-programme link used in unit tests.',
    fromProgramId: 'prog-a',
    toProgramId: 'prog-b',
    passThroughPct: 1,
    ...over,
  };
}

export function makePortfolio(over: Partial<Portfolio> = {}): Portfolio {
  return {
    id: 'portfolio-t1',
    name: 'Test portfolio',
    description: 'Portfolio used in unit tests.',
    programs: [],
    crossLinks: [],
    ...over,
  };
}

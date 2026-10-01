/**
 * RISK//OS domain model.
 *
 * Every entity is referenced by string ID. Relationships are stored as ID
 * arrays on the owning side so a Program is a single serialisable object
 * with no cycles at the JSON level.
 */

export type ISODate = string;

export type RagStatus = 'green' | 'amber' | 'red';

export type HealthDimension =
  | 'overall'
  | 'schedule'
  | 'cost'
  | 'risk'
  | 'scope'
  | 'dependency'
  | 'benefit';

export type Likert5 = 1 | 2 | 3 | 4 | 5;

export type RiskCategory =
  | 'delivery'
  | 'technology'
  | 'vendor'
  | 'regulatory'
  | 'financial'
  | 'operational'
  | 'people'
  | 'security'
  | 'data'
  | 'reputational';

export type RiskResponseStrategy = 'mitigate' | 'transfer' | 'avoid' | 'accept';

export type RiskStatus = 'open' | 'monitoring' | 'escalated' | 'closed' | 'accepted' | 'materialised';

/** Direction of travel derived from the exposure history, not typed by hand. */
export type RiskTrend = 'accelerating' | 'deteriorating' | 'stagnant' | 'improving' | 'new';

export type TimeHorizon = 'immediate' | 'near' | 'mid' | 'far';

export type EvidenceConfidence = 'anecdotal' | 'indicative' | 'measured' | 'verified';

export type Priority = 'critical' | 'high' | 'medium' | 'low';

export type WorkItemStatus =
  | 'not-started'
  | 'in-progress'
  | 'blocked'
  | 'complete'
  | 'cancelled'
  | 'at-risk';

export interface Owner {
  id: string;
  name: string;
  role: string;
  workstreamId?: string;
}

export interface Evidence {
  id: string;
  label: string;
  kind: 'metric' | 'document' | 'test-result' | 'meeting' | 'system-record' | 'observation';
  date: ISODate;
  source: string;
  confidence: EvidenceConfidence;
  note?: string;
}

export interface Comment {
  id: string;
  authorId: string;
  date: ISODate;
  body: string;
}

// ---------------------------------------------------------------- program

export type ProgramStatus = 'active' | 'on-hold' | 'closed' | 'archived';

export interface Program {
  id: string;
  name: string;
  codename: string;
  description: string;
  sponsor: string;
  programManager: string;
  startDate: ISODate;
  endDate: ISODate;
  /** Reporting "today". Kept in data so the demo is deterministic. */
  statusDate: ISODate;
  budget: number;
  spendToDate: number;
  forecastSpend: number;
  currency: string;
  /** Portfolio metadata. Optional so a pre-portfolio programme JSON still imports; validate.ts fills defaults. */
  businessUnit?: string;
  strategicPriority?: Priority;
  programStatus?: ProgramStatus;
  createdAt?: ISODate;
  updatedAt?: ISODate;
  strategicObjectives: string[];
  owners: Owner[];
  workstreams: Workstream[];
  milestones: Milestone[];
  deliverables: Deliverable[];
  risks: Risk[];
  /** MESH-originated intake records remain separate until an operator supplies the fields required by Risk[]. */
  riskIntakes?: RiskIntakeRecord[];
  causes: Cause[];
  controls: Control[];
  actions: Action[];
  issues: Issue[];
  assumptions: Assumption[];
  dependencies: Dependency[];
  changes: ChangeRequest[];
  decisions: Decision[];
  benefits: Benefit[];
  fmea: FMEAItem[];
  dmaic: DmaicProject[];
  metrics: Metric[];
  /** Explicit management boundary. Optional so a pre-tolerance programme still imports; every reader defaults to DEFAULT_RISK_APPETITE. */
  riskAppetite?: RiskAppetite;
  treatments: Treatment[];
  acceptances: Acceptance[];
}

export type RiskIntakeLifecycle = 'hypothesis' | 'unverified_external' | 'operator_review' | 'accepted' | 'rejected';
export type RiskIntakeAuthority = 'synthetic' | 'model_output' | 'external_unverified' | 'operator_validated';

/**
 * A provenance-bound handoff from the controlled MESH feedback boundary into Risk OS.
 * It is deliberately not a Risk: unknown likelihood, impact, owner, effectiveness and
 * confidence stay null until a human review supplies them.
 */
export interface RiskIntakeRecord {
  intakeId: string;
  canonicalRiskId: string;
  schemaVersion: 'risk-intake.v1';
  statement: string;
  sourceSystem: string;
  sourceRepository: string;
  sourceRevision: string | null;
  sourceUri: string | null;
  sourceIdentity: string;
  capturedAt: ISODate;
  dataClass: 'synthetic_simulation' | 'model_output' | 'external_source_content' | 'operator_observation';
  authority: RiskIntakeAuthority;
  lifecycle: RiskIntakeLifecycle;
  evidenceIds: string[];
  contradictingEvidenceIds: string[];
  hypothesisContextHash: string | null;
  modeOfOperationId: string | null;
  likelihood: number | null;
  impact: Likert5 | null;
  financialImpact: number | null;
  ownerId: string | null;
  controlEffectiveness: number | null;
  confidence: number | null;
  idempotencyKey: string;
  history: { at: ISODate; lifecycle: RiskIntakeLifecycle; sourceRevision: string | null; note: string }[];
}

export interface Workstream {
  id: string;
  name: string;
  code: string;
  description: string;
  leadOwnerId: string;
  startDate: ISODate;
  endDate: ISODate;
  budget: number;
  spendToDate: number;
  percentComplete: number;
  status: WorkItemStatus;
}

export interface Milestone {
  id: string;
  name: string;
  workstreamId: string;
  ownerId: string;
  baselineDate: ISODate;
  forecastDate: ISODate;
  actualDate?: ISODate;
  status: WorkItemStatus;
  isGate: boolean;
  /** Milestones that must complete before this one can. */
  predecessorIds: string[];
  deliverableIds: string[];
  description: string;
}

export interface Deliverable {
  id: string;
  name: string;
  milestoneId: string;
  ownerId: string;
  dueDate: ISODate;
  status: WorkItemStatus;
  percentComplete: number;
  acceptanceCriteria: string;
}

// ---------------------------------------------------------------- risk

export interface ExposureSample {
  date: ISODate;
  probability: number;
  impactScore: Likert5;
  /** Financial exposure in program currency at that point in time. */
  financialExposure: number;
  note?: string;
}

export interface Risk {
  id: string;
  ref: string;
  title: string;
  description: string;
  category: RiskCategory;
  ownerId: string;
  workstreamId: string;
  status: RiskStatus;
  dateIdentified: ISODate;
  reviewDate: ISODate;
  strategy: RiskResponseStrategy;
  /** Probability of occurrence before controls, 0..1. */
  inherentProbability: number;
  inherentImpact: Likert5;
  /** Loss in program currency if it materialises, before controls. */
  inherentFinancialImpact: number;
  /** Days of schedule slip if it materialises, before controls. */
  inherentScheduleImpactDays: number;
  strategicImpact: Likert5;
  reputationImpact: Likert5;
  timeHorizon: TimeHorizon;
  evidenceConfidence: EvidenceConfidence;
  controlIds: string[];
  causeIds: string[];
  actionIds: string[];
  affectedMilestoneIds: string[];
  affectedBenefitIds: string[];
  dependencyIds: string[];
  issueIds: string[];
  history: ExposureSample[];
  evidence: Evidence[];
  comments: Comment[];
  tags: string[];
  /** Supplier this risk concentrates on, for cross-program vendor-concentration analysis. Two risks sharing a vendor are not automatically the same risk. */
  vendor?: string;
  /** Set only when this risk is literally the same underlying risk manifesting in more than one programme (e.g. one shared vendor's capacity shortfall). Distinct from merely sharing a vendor or category. */
  sharedRiskGroupId?: string;
  /** Optional so legacy risks import cleanly; every reader defaults with ??. */
  treatmentIds?: string[];
  acceptanceIds?: string[];
  /** Last time this risk's assessment was actually revisited, distinct from reviewDate (next assessment due). Defaults to dateIdentified when absent. */
  lastAssessmentDate?: ISODate;
  reassessmentFrequency?: ReassessmentFrequency;
}

export interface Cause {
  id: string;
  ref: string;
  title: string;
  description: string;
  /** Ishikawa category. */
  category: FishboneCategory;
  isRootCause: boolean;
  /** 5-Whys chain, first entry is the immediate why. */
  whyChain: string[];
  /** Observed occurrences, drives the Pareto view. */
  frequency: number;
  linkedRiskIds: string[];
  linkedIssueIds: string[];
  ownerId: string;
}

export type FishboneCategory =
  | 'people'
  | 'process'
  | 'technology'
  | 'policy'
  | 'environment'
  | 'measurement'
  | 'management';

export type ControlType = 'preventive' | 'detective' | 'corrective' | 'directive';

export type ControlFrequency =
  | 'continuous'
  | 'daily'
  | 'weekly'
  | 'fortnightly'
  | 'monthly'
  | 'quarterly'
  | 'event-driven';

export interface Control {
  id: string;
  ref: string;
  name: string;
  description: string;
  type: ControlType;
  ownerId: string;
  frequency: ControlFrequency;
  /** Design effectiveness 0..1: how much of the risk it would remove if operated perfectly. */
  designEffectiveness: number;
  /** Operating effectiveness 0..1 from the last test. */
  operatingEffectiveness: number;
  evidenceRef: string;
  lastTested?: ISODate;
  nextTest?: ISODate;
  automated: boolean;
  linkedRiskIds: string[];
  status: 'active' | 'degraded' | 'failed' | 'planned' | 'retired';
}

export interface Action {
  id: string;
  ref: string;
  title: string;
  description: string;
  ownerId: string;
  dueDate: ISODate;
  completedDate?: ISODate;
  status: 'open' | 'in-progress' | 'complete' | 'overdue' | 'cancelled';
  priority: Priority;
  linkedRiskIds: string[];
  linkedIssueIds: string[];
  linkedDependencyIds: string[];
  /** Expected residual-exposure reduction if delivered, 0..1. */
  expectedRiskReduction: number;
  percentComplete: number;
}

export interface Issue {
  id: string;
  ref: string;
  title: string;
  description: string;
  ownerId: string;
  workstreamId: string;
  priority: Priority;
  status: 'open' | 'in-progress' | 'resolved' | 'escalated' | 'closed';
  dateRaised: ISODate;
  targetResolution: ISODate;
  resolvedDate?: ISODate;
  /** Realised cost, unlike a risk which is potential. */
  actualCostImpact: number;
  actualScheduleImpactDays: number;
  originRiskId?: string;
  causeIds: string[];
  actionIds: string[];
  affectedMilestoneIds: string[];
  evidence: Evidence[];
  comments: Comment[];
}

export interface Assumption {
  id: string;
  ref: string;
  statement: string;
  ownerId: string;
  status: 'unvalidated' | 'validating' | 'validated' | 'invalidated';
  confidence: EvidenceConfidence;
  validationDate: ISODate;
  /** Risk raised if the assumption proves false. */
  riskIfFalseId?: string;
  linkedMilestoneIds: string[];
  note: string;
}

export type DependencyType = 'internal' | 'external' | 'vendor' | 'regulatory' | 'cross-program';

export interface Dependency {
  id: string;
  ref: string;
  name: string;
  description: string;
  type: DependencyType;
  /** Providing side. */
  upstream: string;
  upstreamOwnerId: string;
  /** Receiving side. */
  downstream: string;
  downstreamOwnerId: string;
  dueDate: ISODate;
  status: 'on-track' | 'at-risk' | 'late' | 'delivered' | 'cancelled';
  criticality: Priority;
  /** 0..1 likelihood this dependency slips. */
  delayProbability: number;
  /** Expected slip in days if it does. */
  potentialDelayDays: number;
  affectedMilestoneIds: string[];
  affectedBenefitIds: string[];
  /** Dependencies that must land before this one. */
  predecessorIds: string[];
  linkedRiskIds: string[];
}

export type ChangeDecision = 'pending' | 'approved' | 'rejected' | 'deferred' | 'escalated';

export interface ChangeRequest {
  id: string;
  ref: string;
  title: string;
  description: string;
  requesterId: string;
  reason: string;
  raisedDate: ISODate;
  scopeImpact: string;
  costImpact: number;
  scheduleImpactDays: number;
  resourceImpact: string;
  riskImpact: string;
  benefitImpact: number;
  affectedWorkstreamIds: string[];
  affectedMilestoneIds: string[];
  affectedDependencyIds: string[];
  affectedBenefitIds: string[];
  linkedRiskIds: string[];
  decision: ChangeDecision;
  decisionMakerId?: string;
  decisionDate?: ISODate;
  decisionRationale?: string;
  status: 'draft' | 'in-review' | 'decided' | 'implemented' | 'withdrawn';
}

export interface DecisionOption {
  id: string;
  label: string;
  pros: string[];
  cons: string[];
  estimatedCost: number;
  estimatedScheduleDays: number;
  residualRiskNote: string;
}

export interface Decision {
  id: string;
  ref: string;
  title: string;
  context: string;
  ownerId: string;
  decisionMakerId: string;
  forum: string;
  dateRequired: ISODate;
  dateDecided?: ISODate;
  reviewDate?: ISODate;
  status: 'required' | 'scheduled' | 'decided' | 'reversed' | 'superseded';
  options: DecisionOption[];
  chosenOptionId?: string;
  rationale?: string;
  evidence: Evidence[];
  expectedOutcome: string;
  /** Populated at review; drives decision-quality analytics. */
  actualOutcome?: string;
  /** 1..5 self-assessed at review, only meaningful once actualOutcome exists. */
  outcomeScore?: Likert5;
  linkedRiskIds: string[];
  linkedChangeIds: string[];
  linkedBenefitIds: string[];
  linkedMilestoneIds: string[];
}

export interface BenefitSample {
  date: ISODate;
  realisedValue: number;
}

export interface Benefit {
  id: string;
  ref: string;
  name: string;
  description: string;
  type: 'financial' | 'efficiency' | 'risk-reduction' | 'compliance' | 'customer' | 'strategic';
  ownerId: string;
  expectedValue: number;
  realisedValue: number;
  measure: string;
  baseline: number;
  target: number;
  current: number;
  startDate: ISODate;
  targetDate: ISODate;
  status: 'not-started' | 'in-progress' | 'partially-realised' | 'realised' | 'at-risk' | 'lost';
  enablingMilestoneIds: string[];
  threateningRiskIds: string[];
  linkedChangeIds: string[];
  linkedDecisionIds: string[];
  history: BenefitSample[];
}

// ---------------------------------------------------------------- six sigma

export interface FMEAItem {
  id: string;
  ref: string;
  process: string;
  processStep: string;
  failureMode: string;
  effect: string;
  cause: string;
  severity: Likert5;
  occurrence: Likert5;
  detection: Likert5;
  existingControl: string;
  recommendedAction: string;
  ownerId: string;
  dueDate: ISODate;
  actionStatus: 'open' | 'in-progress' | 'complete';
  postSeverity: Likert5;
  postOccurrence: Likert5;
  postDetection: Likert5;
  linkedRiskIds: string[];
  linkedCauseIds: string[];
  linkedControlIds: string[];
}

export interface DmaicProject {
  id: string;
  ref: string;
  name: string;
  ownerId: string;
  phase: 'define' | 'measure' | 'analyze' | 'improve' | 'control';
  startDate: ISODate;
  targetDate: ISODate;
  define: {
    problemStatement: string;
    businessImpact: string;
    customerImpact: string;
    ctq: string[];
    inScope: string[];
    outOfScope: string[];
    goalStatement: string;
  };
  measure: {
    metricName: string;
    unit: string;
    baseline: number;
    volume: number;
    defectRate: number;
    cycleTimeDays: number;
    costOfPoorQuality: number;
    dataSource: string;
    trend: { date: ISODate; value: number }[];
  };
  analyze: {
    causeIds: string[];
    fmeaIds: string[];
    hypothesis: string;
    finding: string;
  };
  improve: {
    countermeasures: {
      id: string;
      description: string;
      expectedImprovementPct: number;
      ownerId: string;
      pilotScope: string;
      dueDate: ISODate;
      status: 'planned' | 'piloting' | 'implemented' | 'rejected';
    }[];
  };
  control: {
    controlMetric: string;
    upperControlLimit: number;
    lowerControlLimit: number;
    monitoringFrequency: ControlFrequency;
    escalationTrigger: string;
    ownerId: string;
    linkedControlIds: string[];
  };
  linkedRiskIds: string[];
}

export interface Metric {
  id: string;
  name: string;
  unit: string;
  workstreamId?: string;
  target: number;
  series: { date: ISODate; value: number }[];
  direction: 'higher-is-better' | 'lower-is-better';
}

// ---------------------------------------------------------------- risk intelligence

export type ToleranceDimension = 'financial' | 'schedule' | 'benefit' | 'severity';

export interface ToleranceThreshold {
  dimension: ToleranceDimension;
  /** Display unit only; comparisons always use the raw number. */
  unit: string;
  /** Value at which this dimension moves from WITHIN to NEAR tolerance. */
  nearLimit: number;
  /** Value at which this dimension moves from NEAR to BREACH. */
  breachLimit: number;
}

/**
 * An explicit management boundary set once per programme, never derived from
 * probability x impact. A risk's tolerance status compares its current
 * residual position against these limits per dimension; the worst dimension
 * decides the risk's overall status. See domain/engines/toleranceEngine.ts.
 */
export interface RiskAppetite {
  id: string;
  statement: string;
  thresholds: ToleranceThreshold[];
}

export type TreatmentStrategy = 'avoid' | 'reduce' | 'transfer' | 'accept' | 'share' | 'exploit' | 'enhance';
export type TreatmentStatus = 'proposed' | 'planned' | 'in-progress' | 'complete' | 'cancelled';

/**
 * A formal, resourced response plan for a risk. Distinct from Risk.strategy
 * (a single-word summary kept for backward compatibility): a Treatment
 * carries an owner, a plan, and expected vs observed exposure reduction so
 * response effectiveness engine has something to measure against.
 */
export interface Treatment {
  id: string;
  ref: string;
  riskId: string;
  strategy: TreatmentStrategy;
  title: string;
  description: string;
  ownerId: string;
  status: TreatmentStatus;
  startDate: ISODate;
  targetDate: ISODate;
  completedDate?: ISODate;
  /** Asserted at plan time: 0..1 share of baseline residual exposure this treatment expects to remove. */
  expectedExposureReductionPct: number;
  /** Filled in only once there is enough post-start evidence to measure; see responseEffectivenessEngine. */
  observedExposureReductionPct?: number;
  evidenceConfidence: EvidenceConfidence;
  linkedControlIds: string[];
  linkedActionIds: string[];
  notes: string;
}

export type AcceptanceStatus = 'proposed' | 'under-review' | 'accepted' | 'rejected' | 'expired' | 'revoked';

/**
 * Formal, time-boxed risk acceptance. status is the last recorded human
 * decision; EXPIRED is computed at read time from expiryDate (see
 * acceptanceEngine.effectiveAcceptanceStatus) so a stale acceptance can never
 * silently stay valid forever.
 */
export interface Acceptance {
  id: string;
  ref: string;
  riskId: string;
  status: AcceptanceStatus;
  rationale: string;
  approverId: string;
  approvalDate?: ISODate;
  expiryDate?: ISODate;
  reviewDate?: ISODate;
  conditions: string[];
}

export type ReassessmentFrequency = 'weekly' | 'monthly' | 'quarterly' | 'event-based' | 'milestone-based' | 'change-based';

// ---------------------------------------------------------------- simulation

export interface SimulationTask {
  id: string;
  name: string;
  milestoneId?: string;
  optimisticDays: number;
  mostLikelyDays: number;
  pessimisticDays: number;
  optimisticCost: number;
  mostLikelyCost: number;
  pessimisticCost: number;
  /** Risks whose materialisation adds their impact to this task. */
  riskIds: string[];
}

export interface SimulationConfig {
  iterations: number;
  seed: number;
  includeRiskEvents: boolean;
  confidenceLevels: number[];
}

// ---------------------------------------------------------------- persistence

export interface PersistedState {
  version: number;
  /** ISO timestamp, not a date: two saves on the same day must be distinguishable. */
  savedAt: string;
  /** Where the current programme came from, shown in Settings. */
  source: 'demo' | 'imported' | 'created' | 'edited';
  program: Program;
}

// ---------------------------------------------------------------- portfolio

/**
 * A dependency that crosses a programme boundary. Ordinary Dependency rows
 * stay inside one programme (their upstream/downstream are free text); a
 * CrossProgramLink is the only place an id from one programme's arrays is
 * used to point at another programme, and it always lives on the Portfolio,
 * never inside a Program, so a programme's own JSON export still stands alone.
 */
export type CrossProgramLinkKind = 'dependency' | 'vendor' | 'resource';

export interface CrossProgramLink {
  id: string;
  kind: CrossProgramLinkKind;
  label: string;
  description: string;
  fromProgramId: string;
  /** Milestone in the "from" programme whose slip is the trigger, when kind is 'dependency'. */
  fromMilestoneId?: string;
  toProgramId: string;
  /** Milestone in the "to" programme that inherits the slip, when kind is 'dependency'. */
  toMilestoneId?: string;
  /** Shared supplier name, when kind is 'vendor'. */
  vendorName?: string;
  /** Shared owner name, when kind is 'resource'. */
  resourceName?: string;
  /** 0..1: how much of the upstream slip/exposure actually transfers downstream. A link can exist without transferring 100%. */
  passThroughPct: number;
}

export interface Portfolio {
  id: string;
  name: string;
  description: string;
  programs: Program[];
  crossLinks: CrossProgramLink[];
}

export interface PersistedPortfolioState {
  version: number;
  savedAt: string;
  source: 'demo' | 'imported' | 'created' | 'edited';
  activeProgramId: string;
  portfolio: Portfolio;
}

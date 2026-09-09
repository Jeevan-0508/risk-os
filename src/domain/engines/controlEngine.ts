import type { Control, EvidenceConfidence, ISODate, Risk } from '@/domain/types';
import { clamp } from '@/lib/format';
import { daysBetween } from '@/lib/dates';

/**
 * Evidence confidence discounts a control's claimed effectiveness. A control
 * asserted to be 90% effective on anecdotal evidence is not worth the same as
 * one verified by test.
 */
export const CONFIDENCE_WEIGHT: Record<EvidenceConfidence, number> = {
  anecdotal: 0.55,
  indicative: 0.75,
  measured: 0.9,
  verified: 1,
};

/** A failed or retired control contributes nothing regardless of its design. */
export const STATUS_WEIGHT: Record<Control['status'], number> = {
  active: 1,
  degraded: 0.6,
  failed: 0,
  planned: 0,
  retired: 0,
};

export interface ControlAssessment {
  controlId: string;
  /** design x operating x status x evidence, 0..1 */
  effectiveness: number;
  designEffectiveness: number;
  operatingEffectiveness: number;
  statusWeight: number;
  confidenceWeight: number;
  /** True when the control acts on likelihood rather than consequence. */
  reducesProbability: boolean;
  testOverdueDays: number | null;
  drivers: string[];
}

/**
 * Preventive and directive controls act on likelihood. Detective and
 * corrective controls act on consequence: they do not stop the event, they
 * limit what it costs.
 */
export function reducesProbability(control: Control): boolean {
  return control.type === 'preventive' || control.type === 'directive';
}

export function assessControl(control: Control, statusDate: ISODate, confidence: EvidenceConfidence): ControlAssessment {
  const design = clamp(control.designEffectiveness, 0, 1);
  const operating = clamp(control.operatingEffectiveness, 0, 1);
  const statusWeight = STATUS_WEIGHT[control.status] ?? 0;
  const confidenceWeight = CONFIDENCE_WEIGHT[confidence] ?? 0.75;
  const overdue = control.nextTest ? daysBetween(control.nextTest, statusDate) : null;
  const testOverdueDays = overdue !== null && overdue > 0 ? overdue : null;

  // An overdue test erodes assurance progressively, capped at a 30% haircut.
  const staleness = testOverdueDays === null ? 1 : clamp(1 - Math.min(testOverdueDays, 180) / 600, 0.7, 1);

  const effectiveness = clamp(design * operating * statusWeight * confidenceWeight * staleness, 0, 0.95);

  const drivers: string[] = [];
  if (control.status !== 'active') drivers.push('Control status is ' + control.status);
  if (operating < design - 0.1) drivers.push('Operating effectiveness is below design intent');
  if (testOverdueDays !== null) drivers.push('Assurance test overdue by ' + testOverdueDays + ' days');
  if (confidenceWeight < 0.9) drivers.push('Evidence is only ' + confidence);
  if (control.automated) drivers.push('Automated control, lower operator-error exposure');

  return {
    controlId: control.id,
    effectiveness,
    designEffectiveness: design,
    operatingEffectiveness: operating,
    statusWeight,
    confidenceWeight,
    reducesProbability: reducesProbability(control),
    testOverdueDays,
    drivers,
  };
}

export interface CombinedControlEffect {
  /** Combined likelihood reduction 0..0.95 */
  probabilityReduction: number;
  /** Combined consequence reduction 0..0.95 */
  impactReduction: number;
  assessments: ControlAssessment[];
  /** Single headline figure used in the control-effectiveness view. */
  overallEffectiveness: number;
}

/**
 * Controls are combined as independent barriers rather than added:
 *   combined = 1 - PRODUCT(1 - e_i)
 * Adding effectiveness would let three 40% controls "remove" 120% of a risk.
 * The 0.95 ceiling encodes that no control set eliminates a risk entirely.
 */
export function combineControls(controls: Control[], statusDate: ISODate, confidence: EvidenceConfidence): CombinedControlEffect {
  const assessments = controls.map((c) => assessControl(c, statusDate, confidence));
  let probResidual = 1;
  let impactResidual = 1;
  for (const a of assessments) {
    if (a.reducesProbability) probResidual *= 1 - a.effectiveness;
    else impactResidual *= 1 - a.effectiveness;
  }
  const probabilityReduction = clamp(1 - probResidual, 0, 0.95);
  const impactReduction = clamp(1 - impactResidual, 0, 0.95);
  // Overall is the reduction in the product prob x impact.
  const overallEffectiveness = clamp(1 - (1 - probabilityReduction) * (1 - impactReduction), 0, 0.99);
  return { probabilityReduction, impactReduction, assessments, overallEffectiveness };
}

export interface ControlPortfolioSummary {
  total: number;
  active: number;
  degraded: number;
  failed: number;
  planned: number;
  automatedShare: number;
  averageEffectiveness: number;
  overdueTests: number;
  uncontrolledRiskIds: string[];
  /** Controls that are the sole barrier on at least one risk. */
  singlePointsOfFailure: string[];
}

export function summariseControlPortfolio(controls: Control[], risks: Risk[], statusDate: ISODate): ControlPortfolioSummary {
  const byStatus = (s: Control['status']) => controls.filter((c) => c.status === s).length;
  const live = controls.filter((c) => c.status === 'active' || c.status === 'degraded');
  const effs = live.map((c) => assessControl(c, statusDate, 'measured').effectiveness);
  const overdueTests = controls.filter((c) => {
    if (!c.nextTest) return false;
    const d = daysBetween(c.nextTest, statusDate);
    return d !== null && d > 0;
  }).length;

  const openRisks = risks.filter((r) => r.status !== 'closed');
  const uncontrolledRiskIds = openRisks.filter((r) => r.controlIds.length === 0).map((r) => r.id);
  const singlePointsOfFailure: string[] = [];
  for (const r of openRisks) {
    if (r.controlIds.length === 1) {
      const only = r.controlIds[0];
      if (!singlePointsOfFailure.includes(only)) singlePointsOfFailure.push(only);
    }
  }

  return {
    total: controls.length,
    active: byStatus('active'),
    degraded: byStatus('degraded'),
    failed: byStatus('failed'),
    planned: byStatus('planned'),
    automatedShare: controls.length === 0 ? 0 : controls.filter((c) => c.automated).length / controls.length,
    averageEffectiveness: effs.length === 0 ? 0 : effs.reduce((a, b) => a + b, 0) / effs.length,
    overdueTests,
    uncontrolledRiskIds,
    singlePointsOfFailure,
  };
}

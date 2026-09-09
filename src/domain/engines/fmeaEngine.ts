import type { FMEAItem, Likert5 } from '@/domain/types';
import { clamp, ratio } from '@/lib/format';

export type RpnBand = 'critical' | 'high' | 'moderate' | 'low';

/**
 * RPN bands. AIAG-VDA guidance warns against a single RPN threshold, so
 * severity is treated as an independent escalation trigger: a severity 5
 * failure mode is actionable regardless of its RPN.
 */
export function rpnBand(rpn: number, severity: Likert5): RpnBand {
  if (severity >= 5 && rpn >= 40) return 'critical';
  if (rpn >= 80) return 'critical';
  if (rpn >= 40) return 'high';
  if (rpn >= 20) return 'moderate';
  return 'low';
}

export interface FmeaAssessment {
  itemId: string;
  ref: string;
  failureMode: string;
  severity: Likert5;
  occurrence: Likert5;
  detection: Likert5;
  rpn: number;
  band: RpnBand;
  postSeverity: Likert5;
  postOccurrence: Likert5;
  postDetection: Likert5;
  residualRpn: number;
  residualBand: RpnBand;
  rpnReduction: number;
  rpnReductionPct: number;
  /**
   * Criticality = severity x occurrence, the AIAG-VDA "S x O" pair. Flags modes
   * that are severe and frequent even when detection is strong.
   */
  criticality: number;
  /** True when detection is the only thing holding the risk down. */
  detectionDependent: boolean;
  actionStatus: FMEAItem['actionStatus'];
  actionRequired: boolean;
  drivers: string[];
}

export function computeRpn(severity: number, occurrence: number, detection: number): number {
  return clamp(Math.round(severity), 1, 5) * clamp(Math.round(occurrence), 1, 5) * clamp(Math.round(detection), 1, 5);
}

export function assessFmeaItem(item: FMEAItem): FmeaAssessment {
  const rpn = computeRpn(item.severity, item.occurrence, item.detection);
  const residualRpn = computeRpn(item.postSeverity, item.postOccurrence, item.postDetection);
  const band = rpnBand(rpn, item.severity);
  const residualBand = rpnBand(residualRpn, item.postSeverity);
  const reduction = Math.max(0, rpn - residualRpn);
  const criticality = clamp(item.severity, 1, 5) * clamp(item.occurrence, 1, 5);
  const detectionDependent = item.detection <= 2 && criticality >= 12;

  const drivers: string[] = [];
  drivers.push('S' + item.severity + ' x O' + item.occurrence + ' x D' + item.detection + ' = RPN ' + rpn);
  if (item.severity >= 5) drivers.push('Severity 5: escalate regardless of RPN');
  if (detectionDependent) drivers.push('Held down by detection only, a detection failure exposes the full severity');
  if (item.postSeverity < item.severity) drivers.push('Countermeasure changes the effect, not just the frequency');
  if (reduction === 0 && item.actionStatus !== 'complete') drivers.push('No modelled reduction yet, action is ' + item.actionStatus);

  const actionRequired = band === 'critical' || band === 'high' || item.severity >= 5;

  return {
    itemId: item.id,
    ref: item.ref,
    failureMode: item.failureMode,
    severity: item.severity,
    occurrence: item.occurrence,
    detection: item.detection,
    rpn,
    band,
    postSeverity: item.postSeverity,
    postOccurrence: item.postOccurrence,
    postDetection: item.postDetection,
    residualRpn,
    residualBand,
    rpnReduction: reduction,
    rpnReductionPct: ratio(reduction, rpn),
    criticality,
    detectionDependent,
    actionStatus: item.actionStatus,
    actionRequired,
    drivers,
  };
}

export interface FmeaSummary {
  assessments: FmeaAssessment[];
  byId: Record<string, FmeaAssessment>;
  total: number;
  criticalCount: number;
  highCount: number;
  totalRpn: number;
  totalResidualRpn: number;
  rpnReductionPct: number;
  averageRpn: number;
  openActions: number;
  detectionDependentCount: number;
  severity5Count: number;
  /** Ranked worst-first by current RPN then severity. */
  ranked: FmeaAssessment[];
  byProcess: { process: string; count: number; totalRpn: number; residualRpn: number }[];
}

export function summariseFmea(items: FMEAItem[]): FmeaSummary {
  const assessments = items.map(assessFmeaItem);
  const byId: Record<string, FmeaAssessment> = {};
  for (const a of assessments) byId[a.itemId] = a;
  const totalRpn = assessments.reduce((s, a) => s + a.rpn, 0);
  const totalResidualRpn = assessments.reduce((s, a) => s + a.residualRpn, 0);

  const processMap = new Map<string, { count: number; totalRpn: number; residualRpn: number }>();
  for (const item of items) {
    const a = byId[item.id];
    const cur = processMap.get(item.process) ?? { count: 0, totalRpn: 0, residualRpn: 0 };
    cur.count += 1;
    cur.totalRpn += a.rpn;
    cur.residualRpn += a.residualRpn;
    processMap.set(item.process, cur);
  }

  return {
    assessments,
    byId,
    total: items.length,
    criticalCount: assessments.filter((a) => a.band === 'critical').length,
    highCount: assessments.filter((a) => a.band === 'high').length,
    totalRpn,
    totalResidualRpn,
    rpnReductionPct: ratio(totalRpn - totalResidualRpn, totalRpn),
    averageRpn: items.length === 0 ? 0 : totalRpn / items.length,
    openActions: items.filter((i) => i.actionStatus !== 'complete').length,
    detectionDependentCount: assessments.filter((a) => a.detectionDependent).length,
    severity5Count: assessments.filter((a) => a.severity >= 5).length,
    ranked: [...assessments].sort((a, b) => b.rpn - a.rpn || b.severity - a.severity),
    byProcess: [...processMap.entries()]
      .map(([process, v]) => ({ process, ...v }))
      .sort((a, b) => b.totalRpn - a.totalRpn),
  };
}

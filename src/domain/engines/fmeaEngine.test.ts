import { describe, expect, it } from 'vitest';
import { assessFmeaItem, computeRpn, rpnBand, summariseFmea } from './fmeaEngine';
import { makeFmea } from '@/test/factories';

describe('computeRpn', () => {
  it('multiplies severity, occurrence and detection', () => {
    expect(computeRpn(5, 4, 3)).toBe(60);
  });

  it('clamps out-of-range inputs into the 1..5 Likert scale', () => {
    expect(computeRpn(9, 4, 3)).toBe(60);
    expect(computeRpn(0, 4, 3)).toBe(12);
  });
});

describe('rpnBand', () => {
  it('escalates a severity 5 mode even when the RPN is only moderate', () => {
    expect(rpnBand(50, 5)).toBe('critical');
    expect(rpnBand(50, 3)).toBe('high');
  });

  it('bands on the documented thresholds', () => {
    expect(rpnBand(80, 2)).toBe('critical');
    expect(rpnBand(79, 2)).toBe('high');
    expect(rpnBand(39, 2)).toBe('moderate');
    expect(rpnBand(19, 2)).toBe('low');
  });
});

describe('assessFmeaItem', () => {
  it('computes residual RPN and the reduction achieved', () => {
    const a = assessFmeaItem(makeFmea({ severity: 5, occurrence: 4, detection: 4, postSeverity: 5, postOccurrence: 2, postDetection: 2 }));
    expect(a.rpn).toBe(80);
    expect(a.residualRpn).toBe(20);
    expect(a.rpnReduction).toBe(60);
    expect(a.rpnReductionPct).toBeCloseTo(0.75, 5);
  });

  it('never reports a negative reduction when the countermeasure made things worse', () => {
    const a = assessFmeaItem(makeFmea({ severity: 2, occurrence: 2, detection: 2, postSeverity: 4, postOccurrence: 4, postDetection: 4 }));
    expect(a.rpnReduction).toBe(0);
  });

  it('flags a mode that is only held down by detection', () => {
    const a = assessFmeaItem(makeFmea({ severity: 5, occurrence: 4, detection: 1 }));
    expect(a.criticality).toBe(20);
    expect(a.detectionDependent).toBe(true);
    expect(a.drivers.some((d) => d.includes('detection'))).toBe(true);
  });

  it('does not flag detection dependence when severity x occurrence is low', () => {
    const a = assessFmeaItem(makeFmea({ severity: 2, occurrence: 2, detection: 1 }));
    expect(a.detectionDependent).toBe(false);
  });

  it('requires action for every severity 5 mode', () => {
    const a = assessFmeaItem(makeFmea({ severity: 5, occurrence: 1, detection: 1 }));
    expect(a.rpn).toBe(5);
    expect(a.actionRequired).toBe(true);
  });

  it('explains a stalled countermeasure', () => {
    const a = assessFmeaItem(makeFmea({ severity: 3, occurrence: 3, detection: 3, postSeverity: 3, postOccurrence: 3, postDetection: 3, actionStatus: 'open' }));
    expect(a.rpnReduction).toBe(0);
    expect(a.drivers.some((d) => d.includes('No modelled reduction'))).toBe(true);
  });
});

describe('summariseFmea', () => {
  const items = [
    makeFmea({ id: 'f1', process: 'Integration', severity: 5, occurrence: 4, detection: 4, postSeverity: 5, postOccurrence: 2, postDetection: 2, actionStatus: 'open' }),
    makeFmea({ id: 'f2', process: 'Integration', severity: 3, occurrence: 2, detection: 2, postSeverity: 3, postOccurrence: 1, postDetection: 2, actionStatus: 'complete' }),
    makeFmea({ id: 'f3', process: 'Data', severity: 4, occurrence: 3, detection: 3, postSeverity: 4, postOccurrence: 2, postDetection: 2, actionStatus: 'in-progress' }),
  ];

  it('ranks worst first by RPN', () => {
    const s = summariseFmea(items);
    expect(s.ranked.map((a) => a.itemId)).toEqual(['f1', 'f3', 'f2']);
  });

  it('aggregates RPN and reduction across the register', () => {
    const s = summariseFmea(items);
    expect(s.total).toBe(3);
    expect(s.totalRpn).toBe(80 + 12 + 36);
    expect(s.totalResidualRpn).toBe(20 + 6 + 16);
    expect(s.rpnReductionPct).toBeCloseTo((128 - 42) / 128, 5);
  });

  it('counts open actions and severity 5 modes', () => {
    const s = summariseFmea(items);
    expect(s.openActions).toBe(2);
    expect(s.severity5Count).toBe(1);
  });

  it('groups by process, highest total RPN first', () => {
    const s = summariseFmea(items);
    expect(s.byProcess[0].process).toBe('Integration');
    expect(s.byProcess[0].count).toBe(2);
    expect(s.byProcess[1].process).toBe('Data');
  });

  it('tolerates an empty register', () => {
    const s = summariseFmea([]);
    expect(s.total).toBe(0);
    expect(s.averageRpn).toBe(0);
    expect(s.rpnReductionPct).toBe(0);
  });
});

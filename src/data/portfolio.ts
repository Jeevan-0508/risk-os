import type { CrossProgramLink, Portfolio } from '@/domain/types';
import { orionProgram } from './orion';
import { atlasProgram } from './atlas';
import { novaProgram } from './nova';
import { heliosProgram } from './helios';

/**
 * The demo cross-programme story, deliberately wired rather than random:
 * a milestone-slip chain running ATLAS -> ORION -> NOVA through ORION's own
 * carrier integration milestone as the shared fulcrum, a vendor exposure
 * shared between ATLAS and HELIOS (Meridian Cloud Systems), and a resource
 * exposure shared between NOVA and HELIOS (Layla Haddad, on both programmes'
 * owner lists). See tools/gen_atlas.py, gen_nova.py and gen_helios.py for the
 * risk/dependency detail each link's penalty is computed from.
 */
export const demoCrossLinks: CrossProgramLink[] = [
  {
    id: 'link-atlas-orion-api',
    kind: 'dependency',
    label: 'ATLAS API Platform GA -> ORION Carrier Integration',
    description:
      "ORION's carrier API integration consumes the ATLAS data platform's API layer once it reaches general availability; ATLAS's own slip on that milestone carries through to ORION.",
    fromProgramId: 'prog-atlas',
    fromMilestoneId: 'ms-a-07',
    toProgramId: 'prog-orion',
    toMilestoneId: 'ms-13',
    passThroughPct: 0.6,
  },
  {
    id: 'link-orion-nova-launch',
    kind: 'dependency',
    label: 'ORION Carrier Integration -> NOVA Customer Launch',
    description:
      "NOVA's customer launch assumes ORION's carrier API integration (with real-time order tracking) is live first; ORION's effective slip, including whatever it has already inherited from ATLAS, carries through to NOVA's launch date.",
    fromProgramId: 'prog-orion',
    fromMilestoneId: 'ms-13',
    toProgramId: 'prog-nova',
    toMilestoneId: 'ms-n-08',
    passThroughPct: 0.5,
  },
  {
    id: 'link-atlas-helios-meridian',
    kind: 'vendor',
    label: 'Shared vendor: Meridian Cloud Systems',
    vendorName: 'Meridian Cloud Systems',
    description:
      "Meridian Cloud Systems supplies the shared regional cloud capacity behind both ATLAS's API Platform GA and HELIOS's SOC tooling rollout. ATLAS's open, escalated risk against this vendor also exposes HELIOS's own capacity-dependent milestone.",
    fromProgramId: 'prog-atlas',
    toProgramId: 'prog-helios',
    passThroughPct: 0.7,
  },
  {
    id: 'link-nova-helios-haddad',
    kind: 'resource',
    label: 'Shared resource: Layla Haddad',
    resourceName: 'Layla Haddad',
    description:
      "Layla Haddad carries NOVA's consent-management privacy workstream and HELIOS's data-protection-impact-assessment workstream at the same time; a spike in her open action load on either programme is a workload exposure on both.",
    fromProgramId: 'prog-nova',
    toProgramId: 'prog-helios',
    passThroughPct: 0.6,
  },
];

export const demoPortfolio: Portfolio = {
  id: 'portfolio-demo',
  name: 'Group Transformation Portfolio',
  description:
    'Four concurrent transformation programmes: ORION (European Logistics), ATLAS (Data Platform Modernization), NOVA (Customer Experience Transformation) and HELIOS (Cybersecurity Transformation), linked by a real milestone-dependency chain, a shared cloud vendor and a shared specialist resource.',
  programs: [orionProgram, atlasProgram, novaProgram, heliosProgram],
  crossLinks: demoCrossLinks,
};

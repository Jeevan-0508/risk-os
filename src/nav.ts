export interface RouteMeta {
  /** Two digit code shown in the rail and the command palette. */
  code: string;
  path: string;
  label: string;
  /** Lucide icon name, resolved in Sidebar. */
  icon: string;
  group: string;
  /** One line shown in the command palette and as the screen strapline. */
  purpose: string;
}

export const ROUTES: RouteMeta[] = [
  {
    code: '00',
    path: '/portfolio',
    label: 'Portfolio',
    icon: 'layout-dashboard',
    group: 'Situation',
    purpose: 'Portfolio health, cross-programme dependencies, vendor and owner concentration across every programme',
  },
  {
    code: '01',
    path: '/',
    label: 'Command Center',
    icon: 'gauge',
    group: 'Situation',
    purpose: 'Programme health, exposure and every headline number with its drivers',
  },
  {
    code: '02',
    path: '/program',
    label: 'Program',
    icon: 'layers',
    group: 'Situation',
    purpose: 'Workstreams, milestones, deliverables and the programme digital twin',
  },
  {
    code: '03',
    path: '/raid',
    label: 'RAID++',
    icon: 'list-tree',
    group: 'Registers',
    purpose: 'Risks, assumptions, issues and dependencies with the links between them',
  },
  {
    code: '04',
    path: '/risk',
    label: 'Risk Engine',
    icon: 'activity',
    group: 'Registers',
    purpose: 'Inherent to residual exposure, velocity, trajectory and control effectiveness',
  },
  {
    code: '05',
    path: '/global-risks',
    label: 'Global Risks',
    icon: 'list-tree',
    group: 'Registers',
    purpose: 'Every risk in every programme, one table, filterable by cross-programme link and severity',
  },
  {
    code: '06',
    path: '/fmea',
    label: 'FMEA Studio',
    icon: 'grid-3x3',
    group: 'Analysis',
    purpose: 'Failure modes, RPN ranking and modelled reduction after countermeasures',
  },
  {
    code: '07',
    path: '/root-cause',
    label: 'Root Cause',
    icon: 'git-branch',
    group: 'Analysis',
    purpose: 'Five Whys, Ishikawa, Pareto and the DMAIC record behind them',
  },
  {
    code: '08',
    path: '/dependencies',
    label: 'Dependencies',
    icon: 'share-2',
    group: 'Flow',
    purpose: 'Critical chain, slip cascade and the benefits each dependency guards',
  },
  {
    code: '09',
    path: '/change',
    label: 'Change Control',
    icon: 'git-pull-request',
    group: 'Flow',
    purpose: 'Change requests, six impact axes and the decision on each one',
  },
  {
    code: '10',
    path: '/decisions',
    label: 'Decisions',
    icon: 'scale',
    group: 'Flow',
    purpose: 'Options considered, rationale, evidence and expected versus actual outcome',
  },
  {
    code: '11',
    path: '/benefits',
    label: 'Benefits',
    icon: 'trending-up',
    group: 'Value',
    purpose: 'Expected against realised value and the exposure threatening the rest',
  },
  {
    code: '12',
    path: '/simulation',
    label: 'Simulation',
    icon: 'dices',
    group: 'Value',
    purpose: 'Monte Carlo schedule and cost ranges with their assumptions stated',
  },
  {
    code: '13',
    path: '/brief',
    label: 'Executive Brief',
    icon: 'file-text',
    group: 'Output',
    purpose: 'One page for the steering committee, ready to present or export',
  },
  {
    code: '14',
    path: '/settings',
    label: 'Settings',
    icon: 'settings',
    group: 'Output',
    purpose: 'Import, export, create a programme and manage local persistence',
  },
  {
    code: '15',
    path: '/risk-intake',
    label: 'Risk Intake',
    icon: 'list-tree',
    group: 'Registers',
    purpose: 'Review provenance-bound MESH handoffs before any operator creates a scored risk',
  },
];

export const ROUTE_BY_PATH: Record<string, RouteMeta> = Object.fromEntries(ROUTES.map((r) => [r.path, r]));

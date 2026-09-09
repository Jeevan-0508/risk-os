/** Shared Recharts styling so every chart in the product reads the same way. */
export const chartTheme = {
  grid: { stroke: '#1c2430', strokeDasharray: '3 3', vertical: false },
  axis: {
    stroke: '#5b6675',
    tick: { fill: '#8b97a8', fontSize: 10 },
    tickLine: false,
    axisLine: { stroke: '#1c2430' },
  },
} as const;

export const tooltipStyle = {
  contentStyle: {
    background: '#0f141c',
    border: '1px solid #2a3441',
    borderRadius: 6,
    fontSize: 11,
    color: '#e6ebf2',
  },
  labelStyle: { color: '#8b97a8', fontSize: 10, textTransform: 'uppercase' as const, letterSpacing: '0.08em' },
  itemStyle: { fontSize: 11 },
} as const;

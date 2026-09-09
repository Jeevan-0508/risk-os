import { useEffect, useState } from 'react';
import { Navigate, Route, Routes, useLocation } from 'react-router-dom';
import { ROUTES } from '@/nav';
import { Sidebar } from '@/ui/Sidebar';
import { TopBar } from '@/ui/TopBar';
import { CommandPalette } from '@/ui/CommandPalette';
import { NoticeHost } from '@/ui/NoticeHost';
import { ErrorBoundary } from '@/ui/ErrorBoundary';

import { CommandCenter } from '@/screens/CommandCenter';
import { ProgramScreen } from '@/screens/ProgramScreen';
import { RaidScreen } from '@/screens/RaidScreen';
import { RiskEngineScreen } from '@/screens/RiskEngineScreen';
import { FmeaScreen } from '@/screens/FmeaScreen';
import { RootCauseScreen } from '@/screens/RootCauseScreen';
import { DependencyScreen } from '@/screens/DependencyScreen';
import { ChangeScreen } from '@/screens/ChangeScreen';
import { DecisionScreen } from '@/screens/DecisionScreen';
import { BenefitScreen } from '@/screens/BenefitScreen';
import { SimulationScreen } from '@/screens/SimulationScreen';
import { BriefScreen } from '@/screens/BriefScreen';
import { SettingsScreen } from '@/screens/SettingsScreen';

const ELEMENTS: Record<string, () => JSX.Element> = {
  '/': CommandCenter,
  '/program': ProgramScreen,
  '/raid': RaidScreen,
  '/risk': RiskEngineScreen,
  '/fmea': FmeaScreen,
  '/root-cause': RootCauseScreen,
  '/dependencies': DependencyScreen,
  '/change': ChangeScreen,
  '/decisions': DecisionScreen,
  '/benefits': BenefitScreen,
  '/simulation': SimulationScreen,
  '/brief': BriefScreen,
  '/settings': SettingsScreen,
};

export default function App() {
  const [paletteOpen, setPaletteOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setPaletteOpen((v) => !v);
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  return (
    <div className="flex h-screen overflow-hidden bg-base-900 bg-grid text-ink-200 print:h-auto print:overflow-visible">
      <a href="#main" className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50 focus:rounded focus:bg-base-700 focus:px-3 focus:py-2 focus:text-sm focus:text-ink-100">
        Skip to content
      </a>
      <div className="contents print:hidden">
        <Sidebar onOpenPalette={() => setPaletteOpen(true)} />
      </div>
      <div className="flex min-w-0 flex-1 flex-col print:block">
        <div className="contents print:hidden">
          <TopBar onOpenPalette={() => setPaletteOpen(true)} />
        </div>
        <main id="main" tabIndex={-1} className="min-w-0 flex-1 overflow-y-auto p-4 print:overflow-visible print:p-0">
          <Routes>
            {ROUTES.map((r) => {
              const Screen = ELEMENTS[r.path];
              return (
                <Route
                  key={r.path}
                  path={r.path}
                  element={
                    <ErrorBoundary area={r.code + ' ' + r.label} key={location.key}>
                      <Screen />
                    </ErrorBoundary>
                  }
                />
              );
            })}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </main>
      </div>
      <div className="contents print:hidden">
        <CommandPalette open={paletteOpen} onClose={() => setPaletteOpen(false)} />
        <NoticeHost />
      </div>
    </div>
  );
}

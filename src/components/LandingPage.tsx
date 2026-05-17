'use client';

import { useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import { ArchitecturePanel } from './ArchitecturePanel';
import { ControlPanel } from './ControlPanel';
import { DecompositionPanel } from './DecompositionPanel';
import { DocumentUploadPanel } from './DocumentUploadPanel';
import { Hero } from './Hero';
import { MonthlyBudgetPanel } from './MonthlyBudgetPanel';
import { QuestionsPanel } from './QuestionsPanel';
import { RisksPanel } from './RisksPanel';
import { SummaryGrid } from './SummaryGrid';
import { TeamPanel } from './TeamPanel';
import { Topbar } from './Topbar';
import type { Complexity, SupportScheme, Theme } from '@/types';
import { buildMonthlyPlan, calculateTotals, getComplexityFactor } from '@/utils';

export function LandingPage() {
  const router = useRouter();
  const [theme, setTheme] = useState<Theme>('light');
  const [complexity, setComplexity] = useState<Complexity>('medium');
  const [support, setSupport] = useState<SupportScheme>('full');
  const [duration, setDuration] = useState(6);
  const [selectedOutputs, setSelectedOutputs] = useState(['Трудозатраты', 'Архитектура', 'НФТ', 'Риски', 'Сайзинг']);

  const complexityFactor = getComplexityFactor(complexity);
  const totals = useMemo(() => calculateTotals(complexityFactor, support), [complexityFactor, support]);
  const monthlyPlan = useMemo(() => buildMonthlyPlan(duration, totals), [duration, totals]);

  const toggleOutput = (item: string) => {
    setSelectedOutputs((current) =>
      current.includes(item) ? current.filter((value) => value !== item) : [...current, item],
    );
  };

  const goToAuth = () => router.push('/auth');

  return (
    <main className="app" data-theme={theme}>
      <section className="shell">
        <Topbar theme={theme} onToggleTheme={() => setTheme((current) => (current === 'light' ? 'dark' : 'light'))} onStart={goToAuth} />
        <Hero onStart={goToAuth} />
        <SummaryGrid duration={duration} totals={totals} />

        <section className="workspace">
          <ControlPanel
            complexity={complexity}
            duration={duration}
            selectedOutputs={selectedOutputs}
            support={support}
            onComplexityChange={setComplexity}
            onDurationChange={setDuration}
            onSupportChange={setSupport}
            onToggleOutput={toggleOutput}
          />

          <div className="content-grid">
            <DocumentUploadPanel />
            <QuestionsPanel />
            <ArchitecturePanel />
            <DecompositionPanel complexityFactor={complexityFactor} />
            <TeamPanel />
            <RisksPanel />
            <MonthlyBudgetPanel monthlyPlan={monthlyPlan} totals={totals} />
          </div>
        </section>
      </section>
    </main>
  );
}

'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useMemo, useState } from 'react';
import { ArrowLeft, BarChart3, ClipboardList, FileText, LogOut, ShieldCheck, UsersRound } from 'lucide-react';
import { ControlPanel } from './ControlPanel';
import { DecompositionPanel } from './DecompositionPanel';
import { MonthlyBudgetPanel } from './MonthlyBudgetPanel';
import { RisksPanel } from './RisksPanel';
import { SummaryGrid } from './SummaryGrid';
import { TeamPanel } from './TeamPanel';
import type { Complexity, SupportScheme } from '@/types';
import { buildMonthlyPlan, calculateTotals, getComplexityFactor } from '@/utils';

export function AdminPage() {
  const router = useRouter();
  const [isReady, setIsReady] = useState(false);
  const [hasAnswers, setHasAnswers] = useState(false);
  const [complexity, setComplexity] = useState<Complexity>('medium');
  const [support, setSupport] = useState<SupportScheme>('full');
  const [duration, setDuration] = useState(6);
  const [selectedOutputs, setSelectedOutputs] = useState(['Трудозатраты', 'Архитектура', 'Риски']);

  const complexityFactor = getComplexityFactor(complexity);
  const totals = useMemo(() => calculateTotals(complexityFactor, support), [complexityFactor, support]);
  const monthlyPlan = useMemo(() => buildMonthlyPlan(duration, totals), [duration, totals]);

  useEffect(() => {
    if (window.localStorage.getItem('presales-auth') !== 'true') {
      router.replace('/auth');
      return;
    }

    setIsReady(true);
  }, [router]);

  const logout = () => {
    window.localStorage.removeItem('presales-auth');
    router.push('/');
  };

  const toggleOutput = (item: string) => {
    setSelectedOutputs((current) =>
      current.includes(item) ? current.filter((value) => value !== item) : [...current, item],
    );
  };

  if (!isReady) {
    return null;
  }

  return (
    <main className="app admin-route" data-theme="light">
      <section className="admin-shell">
        <aside className="admin-sidebar">
          <Link className="back-link" href="/">
            <ArrowLeft size={18} />
            Главная
          </Link>
          <div className="admin-logo">
            <strong>Presale AI</strong>
            <span>Админ-панель</span>
          </div>
          <nav className="admin-menu" aria-label="Админка">
            <a className="active" href="#request">
              <ClipboardList size={18} />
              Новый пресейл
            </a>
            <a href="#estimate">
              <BarChart3 size={18} />
              Оценка
            </a>
            <a href="#team">
              <UsersRound size={18} />
              Команда
            </a>
            <a href="#security">
              <ShieldCheck size={18} />
              On-prem
            </a>
          </nav>
          <button className="logout-button" type="button" onClick={logout}>
            <LogOut size={18} />
            Выйти
          </button>
        </aside>

        <section className="admin-main">
          <header className="admin-header">
            <div>
              <span>После авторизации</span>
              <h1>{hasAnswers ? 'Рабочая панель пресейла' : 'Ответьте на вопросы проекта'}</h1>
            </div>
            <button className="primary-button" type="button" onClick={() => setHasAnswers(true)}>
              Сформировать оценку
            </button>
          </header>

          {!hasAnswers ? (
            <section className="answer-panel" id="request">
              <div className="answer-intro">
                <FileText size={28} />
                <div>
                  <h2>Вводный опрос</h2>
                  <p>Эти ответы нужны, чтобы открыть расчёты, рекомендации и итоговый документ в админке.</p>
                </div>
              </div>
              <div className="answer-grid">
                <label>
                  <span>Название проекта</span>
                  <input placeholder="Например, B2B портал клиента" />
                </label>
                <label>
                  <span>Сфера заказчика</span>
                  <input placeholder="Финтех, ритейл, производство" />
                </label>
                <label>
                  <span>Цель пресейла</span>
                  <select defaultValue="budget">
                    <option value="budget">Бюджет и сроки</option>
                    <option value="architecture">Архитектура</option>
                    <option value="support">Поддержка и гарантия</option>
                  </select>
                </label>
                <label>
                  <span>Критичные ограничения</span>
                  <textarea placeholder="On-prem, ИБ, интеграции, сроки, SLA" />
                </label>
              </div>
            </section>
          ) : (
            <>
              <SummaryGrid duration={duration} totals={totals} />
              <section className="workspace admin-workspace" id="estimate">
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
                  <DecompositionPanel complexityFactor={complexityFactor} />
                  <TeamPanel />
                  <RisksPanel />
                  <MonthlyBudgetPanel monthlyPlan={monthlyPlan} totals={totals} />
                </div>
              </section>
            </>
          )}
        </section>
      </section>
    </main>
  );
}

import { modules, rates } from './data';
import type { Complexity, MonthPlanItem, SupportScheme, Totals } from './types';

export function formatMoney(value: number) {
  return new Intl.NumberFormat('ru-RU', {
    style: 'currency',
    currency: 'RUB',
    maximumFractionDigits: 0,
  }).format(value);
}

export function formatNumber(value: number) {
  return new Intl.NumberFormat('ru-RU', { maximumFractionDigits: 0 }).format(value);
}

export function getComplexityFactor(complexity: Complexity) {
  return { low: 0.82, medium: 1, high: 1.28 }[complexity];
}

export function calculateTotals(complexityFactor: number, support: SupportScheme): Totals {
  const baseHours = modules.reduce((sum, module) => sum + module.hours, 0) * complexityFactor;
  const blendedRate =
    rates.reduce((sum, person) => sum + person.rate * person.count, 0) /
    rates.reduce((sum, person) => sum + person.count, 0);
  const devBudget = baseHours * blendedRate;
  const warranty = devBudget * 0.08;
  const supportMonthly = support === 'full' ? 1380000 : 420000;
  const supportAnnual = supportMonthly * 12;
  const total = devBudget + warranty + supportAnnual;

  return { baseHours, blendedRate, devBudget, warranty, supportMonthly, supportAnnual, total };
}

export function buildMonthlyPlan(duration: number, totals: Totals): MonthPlanItem[] {
  return Array.from({ length: duration }, (_, index) => {
    const progress = [0.12, 0.17, 0.2, 0.22, 0.18, 0.11, 0.08, 0.06][index] ?? 0.06;
    const label = ['Discovery', 'MVP core', 'AI/RAG', 'Расчёты', 'Пилот', 'Запуск'][index] ?? 'Стабилизация';

    return {
      month: index + 1,
      label,
      cost: totals.devBudget * progress + totals.warranty / duration,
    };
  });
}

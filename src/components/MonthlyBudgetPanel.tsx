import { WalletCards } from 'lucide-react';
import type { MonthPlanItem, Totals } from '../types';
import { formatMoney } from '../utils';
import { SectionTitle } from './SectionTitle';

type MonthlyBudgetPanelProps = {
  monthlyPlan: MonthPlanItem[];
  totals: Totals;
};

export function MonthlyBudgetPanel({ monthlyPlan, totals }: MonthlyBudgetPanelProps) {
  return (
    <article className="panel wide">
      <SectionTitle icon={<WalletCards />} title="Расходы по месяцам" />
      <div className="month-grid">
        {monthlyPlan.map((month) => (
          <div className="month" key={month.month}>
            <span>Месяц {month.month}</span>
            <strong>{month.label}</strong>
            <b>{formatMoney(month.cost)}</b>
          </div>
        ))}
      </div>
      <div className="budget-footer">
        <span>Разработка: {formatMoney(totals.devBudget)}</span>
        <span>Гарантия 8%: {formatMoney(totals.warranty)}</span>
        <strong>Итого с поддержкой: {formatMoney(totals.total)}</strong>
      </div>
    </article>
  );
}

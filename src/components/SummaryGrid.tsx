import { Clock3, ShieldCheck, UsersRound, WalletCards } from 'lucide-react';
import type { Totals } from '../types';
import { formatMoney } from '../utils';
import { Metric } from './Metric';

type SummaryGridProps = {
  duration: number;
  totals: Totals;
};

export function SummaryGrid({ duration, totals }: SummaryGridProps) {
  return (
    <section className="summary-grid" aria-label="Ключевые показатели">
      <Metric icon={<Clock3 />} label="Длительность" value={`${duration} мес.`} tone="blue" />
      <Metric icon={<UsersRound />} label="Команда" value="7 ролей" tone="green" />
      <Metric icon={<WalletCards />} label="Бюджет проекта" value={formatMoney(totals.devBudget)} tone="gold" />
      <Metric icon={<ShieldCheck />} label="Поддержка / год" value={formatMoney(totals.supportAnnual)} tone="red" />
    </section>
  );
}

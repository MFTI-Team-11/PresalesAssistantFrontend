import { PieChart } from 'lucide-react';
import { modules } from '../data';
import { formatNumber } from '../utils';
import { SectionTitle } from './SectionTitle';

type DecompositionPanelProps = {
  complexityFactor: number;
};

export function DecompositionPanel({ complexityFactor }: DecompositionPanelProps) {
  return (
    <article className="panel wide">
      <SectionTitle icon={<PieChart />} title="Декомпозиция и трудозатраты" />
      <div className="table">
        <div className="table-row table-head">
          <span>Блок</span>
          <span>Ответственные</span>
          <span>Часы</span>
        </div>
        {modules.map((module) => (
          <div className="table-row" key={module.title}>
            <span>{module.title}</span>
            <span>{module.owner}</span>
            <strong>{formatNumber(module.hours * complexityFactor)}</strong>
          </div>
        ))}
      </div>
    </article>
  );
}

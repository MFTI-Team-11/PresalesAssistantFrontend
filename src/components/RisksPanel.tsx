import { AlertTriangle } from 'lucide-react';
import { risks } from '../data';
import { SectionTitle } from './SectionTitle';

export function RisksPanel() {
  return (
    <article className="panel">
      <SectionTitle icon={<AlertTriangle />} title="Риски и митигация" />
      <div className="risk-list">
        {risks.map(([risk, mitigation]) => (
          <div className="risk" key={risk}>
            <strong>{risk}</strong>
            <span>{mitigation}</span>
          </div>
        ))}
      </div>
    </article>
  );
}

import type { ReactNode } from 'react';

type MetricProps = {
  icon: ReactNode;
  label: string;
  value: string;
  tone: string;
};

export function Metric({ icon, label, value, tone }: MetricProps) {
  return (
    <article className={`metric metric-${tone}`}>
      <div className="metric-icon">{icon}</div>
      <span>{label}</span>
      <strong>{value}</strong>
    </article>
  );
}

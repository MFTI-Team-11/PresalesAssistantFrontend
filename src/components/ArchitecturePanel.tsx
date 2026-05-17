import { BrainCircuit, Building2, Database, Layers3, Network } from 'lucide-react';
import type { ReactNode } from 'react';
import { SectionTitle } from './SectionTitle';

export function ArchitecturePanel() {
  return (
    <article className="panel">
      <SectionTitle icon={<Network />} title="Архитектура" />
      <div className="architecture">
        <ArchitectureNode icon={<Building2 />} label="Веб-интерфейс пресейла" />
        <ArchitectureNode icon={<Layers3 />} label="API и оркестратор расчётов" />
        <ArchitectureNode icon={<BrainCircuit />} label="Локальная LLM + RAG" />
        <ArchitectureNode icon={<Database />} label="Хранилище документов и версий" />
      </div>
    </article>
  );
}

function ArchitectureNode({ icon, label }: { icon: ReactNode; label: string }) {
  return (
    <div className="architecture-node">
      {icon}
      <span>{label}</span>
    </div>
  );
}

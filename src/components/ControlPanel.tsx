import { ClipboardList } from 'lucide-react';
import { outputOptions } from '../data';
import type { Complexity, SupportScheme } from '../types';
import { SectionTitle } from './SectionTitle';

type ControlPanelProps = {
  complexity: Complexity;
  duration: number;
  selectedOutputs: string[];
  support: SupportScheme;
  onComplexityChange: (complexity: Complexity) => void;
  onDurationChange: (duration: number) => void;
  onSupportChange: (support: SupportScheme) => void;
  onToggleOutput: (output: string) => void;
};

export function ControlPanel({
  complexity,
  duration,
  selectedOutputs,
  support,
  onComplexityChange,
  onDurationChange,
  onSupportChange,
  onToggleOutput,
}: ControlPanelProps) {
  return (
    <aside className="control-panel">
      <SectionTitle icon={<ClipboardList />} title="Параметры запроса" />
      <label className="field">
        <span>Сложность</span>
        <select value={complexity} onChange={(event) => onComplexityChange(event.target.value as Complexity)}>
          <option value="low">Низкая</option>
          <option value="medium">Средняя</option>
          <option value="high">Высокая</option>
        </select>
      </label>
      <label className="field">
        <span>Длительность, месяцев</span>
        <input type="range" min="4" max="8" value={duration} onChange={(event) => onDurationChange(Number(event.target.value))} />
        <b>{duration}</b>
      </label>
      <div className="field">
        <span>Схема поддержки</span>
        <div className="segmented">
          <button className={support === 'full' ? 'active' : ''} type="button" onClick={() => onSupportChange('full')}>
            1/2/3 линии 24x7
          </button>
          <button className={support === 'third-line' ? 'active' : ''} type="button" onClick={() => onSupportChange('third-line')}>
            3 линия 6-18
          </button>
        </div>
      </div>
      <div className="field">
        <span>Что получить</span>
        <div className="chips">
          {outputOptions.map((item) => (
            <button className={selectedOutputs.includes(item) ? 'chip selected' : 'chip'} key={item} type="button" onClick={() => onToggleOutput(item)}>
              {item}
            </button>
          ))}
        </div>
      </div>
    </aside>
  );
}

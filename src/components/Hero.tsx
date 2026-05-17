import { ArrowRight, BrainCircuit, CheckCircle2, ChevronRight, Sparkles, UploadCloud } from 'lucide-react';

type HeroProps = {
  onStart: () => void;
};

export function Hero({ onStart }: HeroProps) {
  return (
    <header className="hero">
      <div className="hero-copy">
        <div className="eyebrow">
          <Sparkles size={16} />
          On-premise пресейл без передачи данных наружу
        </div>
        <h1>Единый рабочий стол для быстрой оценки IT-проектов</h1>
        <p>
          Ассистент принимает документы заказчика, задаёт вопросы, формирует требования, предлагает архитектуру,
          считает команду, сроки, поддержку, гарантию, риски и бюджет по месяцам.
        </p>
        <div className="hero-actions">
          <button className="primary-button" type="button" onClick={onStart}>
            <UploadCloud size={18} />
            Начать оценку
          </button>
          <button className="secondary-button" type="button">
            Открыть шаблон
            <ArrowRight size={18} />
          </button>
        </div>
      </div>
      <div className="assistant-panel" aria-label="Состояние ассистента">
        <div className="assistant-orbit">
          <BrainCircuit size={46} />
        </div>
        <div className="assistant-status">
          <span>Готовность оценки</span>
          <strong>82%</strong>
        </div>
        <div className="pipeline">
          {['Документы', 'Вопросы', 'Архитектура', 'Смета'].map((step, index) => (
            <div className="pipeline-step" key={step}>
              <CheckCircle2 size={18} />
              <span>{step}</span>
              {index < 3 && <ChevronRight size={16} />}
            </div>
          ))}
        </div>
      </div>
    </header>
  );
}

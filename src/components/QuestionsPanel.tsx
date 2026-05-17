import { PanelRight } from 'lucide-react';
import { questions } from '../data';
import { SectionTitle } from './SectionTitle';

export function QuestionsPanel() {
  return (
    <article className="panel">
      <SectionTitle icon={<PanelRight />} title="Вопросы преданализа" />
      <ul className="question-list">
        {questions.map((question) => (
          <li key={question}>{question}</li>
        ))}
      </ul>
    </article>
  );
}

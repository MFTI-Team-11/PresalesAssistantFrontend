import { UsersRound } from 'lucide-react';
import { rates } from '../data';
import { SectionTitle } from './SectionTitle';

export function TeamPanel() {
  return (
    <article className="panel">
      <SectionTitle icon={<UsersRound />} title="Состав команды" />
      <div className="role-list">
        {rates.map((person) => (
          <div className="role" key={person.role}>
            <span>{person.role}</span>
            <b>{person.level}</b>
            <strong>{person.count} FTE</strong>
          </div>
        ))}
      </div>
    </article>
  );
}

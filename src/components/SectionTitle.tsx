import type { ReactNode } from 'react';

type SectionTitleProps = {
  icon: ReactNode;
  title: string;
};

export function SectionTitle({ icon, title }: SectionTitleProps) {
  return (
    <div className="section-title">
      {icon}
      <h2>{title}</h2>
    </div>
  );
}

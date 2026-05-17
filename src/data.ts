import type { Module, Rate } from './types';

export const rates: Rate[] = [
  { role: 'Аналитик', level: 'Middle+', rate: 2600, count: 1 },
  { role: 'Архитектор', level: 'Senior', rate: 4200, count: 0.35 },
  { role: 'Backend', level: 'Middle', rate: 3200, count: 2 },
  { role: 'Frontend', level: 'Middle', rate: 3000, count: 1.5 },
  { role: 'QA', level: 'Middle', rate: 2400, count: 1 },
  { role: 'DevOps', level: 'Senior', rate: 3900, count: 0.5 },
  { role: 'PM', level: 'Middle+', rate: 3300, count: 0.5 },
  { role: 'UX/UI', level: 'Middle', rate: 2600, count: 0.4 },
];

export const modules: Module[] = [
  { title: 'Сбор требований', hours: 128, owner: 'Аналитик + PM' },
  { title: 'AI-пайплайн и RAG', hours: 340, owner: 'Backend + Архитектор' },
  { title: 'Документы и шаблоны', hours: 196, owner: 'Backend + Аналитик' },
  { title: 'Интерфейс пресейла', hours: 280, owner: 'Frontend + UX/UI' },
  { title: 'Расчёты и бюджетирование', hours: 220, owner: 'Backend + QA' },
  { title: 'On-prem контур', hours: 176, owner: 'DevOps + Архитектор' },
  { title: 'Тестирование и пилот', hours: 248, owner: 'QA + команда' },
];

export const risks = [
  ['Недостаточно исходных требований', 'Встроить обязательный преданализ и чек-лист вопросов до расчёта.'],
  ['Ограничение on-prem', 'Использовать локальные LLM, изолированное хранилище и аудит обращений.'],
  ['Плавающие ставки и состав команды', 'Хранить версии ставок и пересчитывать сценарии состава команды.'],
  ['Большой поток 30-50 пресейлов', 'Очередь задач, шаблоны типовых решений и пакетная генерация документов.'],
];

export const questions = [
  'Какие бизнес-процессы должны быть покрыты в первом релизе?',
  'Есть ли обязательные интеграции с CRM, ERP, DWH или документооборотом?',
  'Какие документы заказчик готов передать для анализа?',
  'Нужны ли роли согласования и контроль версий пресейла?',
  'Какие ограничения по инфраструктуре, ИБ и персональным данным?',
  'Какие SLA ожидаются для эксплуатации и поддержки?',
];

export const outputOptions = ['Трудозатраты', 'Архитектура', 'НФТ', 'Риски', 'Сайзинг', 'Поддержка'];

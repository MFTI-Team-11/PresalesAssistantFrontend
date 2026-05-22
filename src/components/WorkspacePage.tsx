'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { type FormEvent, useEffect, useMemo, useState } from 'react';
import { ArrowLeft, BarChart3, ClipboardList, FileText, LogOut, ShieldCheck, UsersRound } from 'lucide-react';
import { useAuthApi, type AuthUser } from '@features/auth';
import { type DefaultPresaleQuestion, usePresaleApi } from '@features/presale';
import { ControlPanel } from './ControlPanel';
import { DecompositionPanel } from './DecompositionPanel';
import { MonthlyBudgetPanel } from './MonthlyBudgetPanel';
import { RisksPanel } from './RisksPanel';
import { SummaryGrid } from './SummaryGrid';
import { TeamPanel } from './TeamPanel';
import { outputOptions } from '@/data';
import type { Complexity, SupportScheme } from '@/types';
import { buildMonthlyPlan, calculateTotals, getComplexityFactor } from '@/utils';

const fallbackQuestions: DefaultPresaleQuestion[] = [
  {
    id: 'business_goal',
    text: 'Какая бизнес-цель проекта и какие KPI должны быть достигнуты?',
    category: 'business',
    required: true,
    answer_type: 'text',
    allow_file: false,
    file_required: false,
    file_hint: null,
    placeholder: 'Например: ускорить пресейл, снизить ручной труд, повысить точность оценки',
  },
  {
    id: 'users_and_scenarios',
    text: 'Кто основные пользователи системы и какие пользовательские сценарии нужно поддержать?',
    category: 'scope',
    required: true,
    answer_type: 'text',
    allow_file: false,
    file_required: false,
    file_hint: null,
    placeholder: 'Опишите роли пользователей и основные сценарии работы',
  },
  {
    id: 'input_documents',
    text: 'Какие входные документы, таблицы и вложенные файлы будут загружаться для анализа?',
    category: 'data',
    required: true,
    answer_type: 'text',
    allow_file: true,
    file_required: false,
    file_hint: 'Можно приложить ТЗ, письмо заказчика или документ с требованиями',
    placeholder: 'Например: ТЗ, таблицы ставок, письма заказчика',
  },
  {
    id: 'desired_outputs',
    text: 'Какие результаты пресейла нужно получить: трудозатраты, архитектура, сайзинг, риски, ФТ, НФТ, поддержка, гарантия?',
    category: 'result',
    required: true,
    answer_type: 'text',
    allow_file: false,
    file_required: false,
    file_hint: null,
    placeholder: 'Например: архитектура, бюджет, сайзинг, риски, ФТ/НФТ',
  },
  {
    id: 'integrations',
    text: 'Какие внешние системы и интеграции требуются, какие протоколы и форматы обмена используются?',
    category: 'integrations',
    required: true,
    answer_type: 'text',
    allow_file: false,
    file_required: false,
    file_hint: null,
    placeholder: 'Укажите системы, API, протоколы, форматы обмена',
  },
  {
    id: 'deployment_constraints',
    text: 'Какие ограничения есть по размещению: on-premise, контур компании, запрет передачи данных наружу?',
    category: 'infrastructure',
    required: true,
    answer_type: 'text',
    allow_file: false,
    file_required: false,
    file_hint: null,
    placeholder: 'Например: on-premise, закрытый контур, запрет внешних облаков',
  },
  {
    id: 'security_requirements',
    text: 'Какие требования есть к безопасности, ролям, аудиту, хранению и обработке персональных данных?',
    category: 'security',
    required: true,
    answer_type: 'text',
    allow_file: false,
    file_required: false,
    file_hint: null,
    placeholder: 'Опишите роли, аудит, персональные данные, требования ИБ',
  },
  {
    id: 'load',
    text: 'Какая ожидаемая нагрузка: количество пользователей, пресейлов в месяц, объем документов и данных?',
    category: 'sizing',
    required: true,
    answer_type: 'text',
    allow_file: false,
    file_required: false,
    file_hint: null,
    placeholder: 'Пользователи, запросы, пресейлы в месяц, объем файлов и данных',
  },
  {
    id: 'timeline_budget_priorities',
    text: 'Какие сроки, бюджетные ограничения и приоритеты по этапам проекта?',
    category: 'planning',
    required: true,
    answer_type: 'text',
    allow_file: false,
    file_required: false,
    file_hint: null,
    placeholder: 'Сроки, бюджетные ограничения, приоритеты MVP/этапов',
  },
  {
    id: 'rates_and_roles',
    text: 'Какие ставки специалистов и роли команды нужно использовать в оценке?',
    category: 'budget',
    required: true,
    answer_type: 'text',
    allow_file: false,
    file_required: false,
    file_hint: null,
    placeholder: 'Например: бэкендер 1000р/час, архитектор 2000р/час',
  },
  {
    id: 'support_scheme',
    text: 'Какая схема технической поддержки нужна после завершения проекта?',
    category: 'support',
    required: true,
    answer_type: 'text',
    allow_file: false,
    file_required: false,
    file_hint: null,
    placeholder: 'Например: 24/7 1-3 линии или только 3 линия в рабочее время',
  },
  {
    id: 'warranty',
    text: 'Нужно ли включать годовое гарантийное обслуживание в бюджет проекта?',
    category: 'support',
    required: true,
    answer_type: 'text',
    allow_file: false,
    file_required: false,
    file_hint: null,
    placeholder: 'Да/нет, срок гарантии, процент или бюджетный лимит',
  },
  {
    id: 'known_risks',
    text: 'Какие ключевые риски, ограничения и допущения уже известны?',
    category: 'risks',
    required: true,
    answer_type: 'text',
    allow_file: false,
    file_required: false,
    file_hint: null,
    placeholder: 'Опишите известные ограничения, зависимости, риски и допущения',
  },
];

export function WorkspacePage() {
  const router = useRouter();
  const authApi = useAuthApi();
  const presaleApi = usePresaleApi();
  const [isReady, setIsReady] = useState(false);
  const [user, setUser] = useState<AuthUser | null>(null);
  const [presaleId, setPresaleId] = useState('');
  const [presaleTitle, setPresaleTitle] = useState('');
  const [customerName, setCustomerName] = useState('');
  const [createPresaleError, setCreatePresaleError] = useState('');
  const [isCreatePresaleSubmitting, setIsCreatePresaleSubmitting] = useState(false);
  const [hasAnswers, setHasAnswers] = useState(false);
  const [questions, setQuestions] = useState<DefaultPresaleQuestion[]>([]);
  const [questionAnswers, setQuestionAnswers] = useState<Record<string, string>>({});
  const [questionFiles, setQuestionFiles] = useState<Record<string, File | null>>({});
  const [estimateError, setEstimateError] = useState('');
  const [isEstimateSubmitting, setIsEstimateSubmitting] = useState(false);
  const [complexity, setComplexity] = useState<Complexity>('medium');
  const [support, setSupport] = useState<SupportScheme>('full');
  const [duration, setDuration] = useState(6);
  const [selectedOutputs, setSelectedOutputs] = useState(['Трудозатраты', 'Архитектура', 'Риски']);

  const complexityFactor = getComplexityFactor(complexity);
  const totals = useMemo(() => calculateTotals(complexityFactor, support), [complexityFactor, support]);
  const monthlyPlan = useMemo(() => buildMonthlyPlan(duration, totals), [duration, totals]);
  const renderedQuestions = questions.length ? questions : fallbackQuestions;
  const canCreatePresale = Boolean(presaleTitle.trim()) && Boolean(customerName.trim()) && selectedOutputs.length > 0;
  const isQuestionAnswered = (question: DefaultPresaleQuestion) => {
    const hasTextAnswer = Boolean(questionAnswers[question.id]?.trim());
    const hasFileAnswer = Boolean(question.allow_file && questionFiles[question.id]);

    return question.file_required ? hasFileAnswer : hasTextAnswer || hasFileAnswer;
  };
  const canGenerateEstimate = useMemo(
    () => renderedQuestions.every((question) => !question.required || isQuestionAnswered(question)),
    [questionAnswers, questionFiles, renderedQuestions],
  );

  useEffect(() => {
    let isMounted = true;

    authApi
      .me()
      .then((currentUser) => {
        if (!isMounted) return;
        setUser(currentUser);
        window.localStorage.setItem('presales-auth', 'true');
        setIsReady(true);
      })
      .catch(() => {
        window.localStorage.removeItem('presales-auth');
        router.replace('/auth');
      });

    return () => {
      isMounted = false;
    };
  }, [authApi, router]);

  useEffect(() => {
    if (!isReady || !presaleId) return;

    let isMounted = true;

    presaleApi
      .getDefaultQuestions()
      .then((payload) => {
        if (!isMounted) return;
        setQuestions(payload.questions);
      })
      .catch(() => {
        if (!isMounted) return;
        setQuestions(fallbackQuestions);
      });

    return () => {
      isMounted = false;
    };
  }, [isReady, presaleApi, presaleId]);

  const logout = async () => {
    try {
      await authApi.logout();
    } finally {
      window.localStorage.removeItem('presales-auth');
      router.push('/');
    }
  };

  const toggleOutput = (item: string) => {
    setSelectedOutputs((current) =>
      current.includes(item) ? current.filter((value) => value !== item) : [...current, item],
    );
  };

  const updateQuestionAnswer = (questionId: string, value: string) => {
    setQuestionAnswers((current) => ({
      ...current,
      [questionId]: value,
    }));
  };

  const updateQuestionFile = (questionId: string, file: File | null) => {
    setQuestionFiles((current) => ({
      ...current,
      [questionId]: file,
    }));
  };

  const createPresale = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setCreatePresaleError('');
    setIsCreatePresaleSubmitting(true);

    try {
      const presale = await presaleApi.createPresale({
        title: presaleTitle.trim(),
        customer_name: customerName.trim(),
        desired_outputs: selectedOutputs,
      });

      setPresaleId(presale.id);
    } catch {
      setCreatePresaleError('Не удалось создать пресейл. Проверьте данные и авторизацию.');
    } finally {
      setIsCreatePresaleSubmitting(false);
    }
  };

  const generateEstimate = async () => {
    if (!presaleId) return;

    setEstimateError('');
    setIsEstimateSubmitting(true);

    try {
      const answers = renderedQuestions.map((question) => questionAnswers[question.id] || '');
      const files = Object.values(questionFiles).filter((file): file is File => Boolean(file));

      await presaleApi.generateEstimate({
        presaleId,
        answers,
        files,
      });
      setHasAnswers(true);
    } catch {
      setEstimateError('Не удалось сформировать оценку. Проверьте ответы, файлы и доступность AI-сервиса.');
    } finally {
      setIsEstimateSubmitting(false);
    }
  };

  if (!isReady) {
    return null;
  }

  return (
    <main className="app workspace-route" data-theme="light">
      <section className="workspace-shell">
        <aside className="workspace-sidebar">
          <Link className="back-link" href="/">
            <ArrowLeft size={18} />
            Главная
          </Link>
          <div className="workspace-logo">
            <strong>Presale AI</strong>
            <span>{user?.full_name || user?.email || 'Рабочее пространство'}</span>
          </div>
          <nav className="workspace-menu" aria-label="Рабочее пространство">
            <a className="active" href="#request">
              <ClipboardList size={18} />
              Новый пресейл
            </a>
            <a href="#estimate">
              <BarChart3 size={18} />
              Оценка
            </a>
            <a href="#team">
              <UsersRound size={18} />
              Команда
            </a>
            <a href="#security">
              <ShieldCheck size={18} />
              On-prem
            </a>
            <Link href="/history">
              <FileText size={18} />
              История
            </Link>
          </nav>
          <button className="logout-button" type="button" onClick={logout}>
            <LogOut size={18} />
            Выйти
          </button>
        </aside>

        <section className="workspace-main">
          <header className="workspace-header">
            <div>
              <span>Единый кабинет</span>
              <h1>{hasAnswers ? 'Рабочая панель пресейла' : presaleId ? 'Ответьте на вопросы проекта' : 'Создайте пресейл'}</h1>
            </div>
          </header>

          {!presaleId ? (
            <section className="answer-panel" id="request">
              <div className="answer-intro">
                <ClipboardList size={28} />
                <div>
                  <h2>Новый пресейл</h2>
                  <p>Сначала создайте карточку пресейла, затем заполните вопросы и сформируйте оценку по ее id.</p>
                </div>
              </div>
              <form className="answer-grid" onSubmit={createPresale}>
                <label>
                  <span>Название пресейла</span>
                  <input
                    placeholder="Тестовый пресейл AI-ассистента"
                    value={presaleTitle}
                    onChange={(event) => setPresaleTitle(event.target.value)}
                    required
                  />
                </label>
                <label>
                  <span>Заказчик</span>
                  <input
                    placeholder="Тестовый заказчик"
                    value={customerName}
                    onChange={(event) => setCustomerName(event.target.value)}
                    required
                  />
                </label>
                <div className="answer-output-field">
                  <span>Что нужно получить</span>
                  <div className="chips">
                    {outputOptions.map((item) => (
                      <button className={selectedOutputs.includes(item) ? 'chip selected' : 'chip'} key={item} type="button" onClick={() => toggleOutput(item)}>
                        {item}
                      </button>
                    ))}
                  </div>
                </div>
                {createPresaleError && <p className="form-error">{createPresaleError}</p>}
                <div className="answer-actions">
                  <button className="primary-button" type="submit" disabled={isCreatePresaleSubmitting || !canCreatePresale}>
                    {isCreatePresaleSubmitting ? 'Создаем...' : 'Создать пресейл'}
                  </button>
                </div>
              </form>
            </section>
          ) : !hasAnswers ? (
            <section className="answer-panel" id="request">
              <div className="answer-intro">
                <FileText size={28} />
                <div>
                  <h2>Вводный опрос</h2>
                  <p>Эти ответы нужны, чтобы открыть расчёты, рекомендации и итоговый документ в рабочем пространстве.</p>
                </div>
              </div>
              <div className="answer-list">
                {renderedQuestions.map((question) => (
                  <div className="answer-question" key={question.id}>
                    <span className="answer-question-meta">{question.category}</span>
                    <label htmlFor={`answer-${question.id}`}>
                      {question.text}
                      {question.required && <b>*</b>}
                    </label>
                    <input
                      id={`answer-${question.id}`}
                      required={question.required && !questionFiles[question.id]}
                      placeholder={question.placeholder}
                      value={questionAnswers[question.id] || ''}
                      onChange={(event) => updateQuestionAnswer(question.id, event.target.value)}
                    />
                    {question.allow_file && (
                      <div className="answer-file">
                        {question.file_hint && <span>{question.file_hint}</span>}
                        <input
                          id={`file-${question.id}`}
                          className="answer-file-native"
                          type="file"
                          required={question.file_required}
                          onChange={(event) => updateQuestionFile(question.id, event.target.files?.[0] || null)}
                        />
                        <label className="answer-file-control" htmlFor={`file-${question.id}`}>
                          <span>Выберите файл</span>
                          <b>{questionFiles[question.id]?.name || 'Файл не выбран'}</b>
                        </label>
                      </div>
                    )}
                  </div>
                ))}
              </div>
              {estimateError && <p className="form-error">{estimateError}</p>}
              <div className="answer-actions">
                <button className="primary-button" type="button" disabled={isEstimateSubmitting || !canGenerateEstimate} onClick={generateEstimate}>
                  {isEstimateSubmitting ? 'Формируем...' : 'Сформировать оценку'}
                </button>
              </div>
            </section>
          ) : (
            <>
              <SummaryGrid duration={duration} totals={totals} />
              <section className="workspace workspace-estimate" id="estimate">
                <ControlPanel
                  complexity={complexity}
                  duration={duration}
                  selectedOutputs={selectedOutputs}
                  support={support}
                  onComplexityChange={setComplexity}
                  onDurationChange={setDuration}
                  onSupportChange={setSupport}
                  onToggleOutput={toggleOutput}
                />
                <div className="content-grid">
                  <DecompositionPanel complexityFactor={complexityFactor} />
                  <TeamPanel />
                  <RisksPanel />
                  <MonthlyBudgetPanel monthlyPlan={monthlyPlan} totals={totals} />
                </div>
              </section>
            </>
          )}
        </section>
      </section>
    </main>
  );
}

'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { type FormEvent, useEffect, useMemo, useState } from 'react';
import {
  ArrowLeft,
  Bot,
  Boxes,
  BrainCircuit,
  CalendarDays,
  Download,
  FileText,
  MessageSquareText,
  ReceiptText,
  Send,
  ShieldAlert,
  Eye,
  EyeOff,
  UserRound,
  UsersRound,
} from 'lucide-react';
import { useAuthApi } from '@features/auth';
import { type PresaleChatMessage, type PresaleDetailsPayload, usePresaleApi } from '@features/presale';

type PresaleChatPageProps = {
  presaleId: string;
};

type UiMessage = {
  id: string;
  role: string;
  text: string;
};

type AnyRecord = Record<string, unknown>;

function asRecord(value: unknown): AnyRecord {
  return value && typeof value === 'object' && !Array.isArray(value) ? (value as AnyRecord) : {};
}

function asArray<T = AnyRecord>(value: unknown): T[] {
  return Array.isArray(value) ? (value as T[]) : [];
}

function asString(value: unknown, fallback = '') {
  return typeof value === 'string' && value.trim() ? value : fallback;
}

function asNumber(value: unknown) {
  return typeof value === 'number' && Number.isFinite(value) ? value : 0;
}

function formatMoney(value: unknown) {
  return new Intl.NumberFormat('ru-RU', {
    maximumFractionDigits: 0,
    style: 'currency',
    currency: 'RUB',
  }).format(asNumber(value));
}

function formatNumber(value: unknown) {
  return new Intl.NumberFormat('ru-RU', { maximumFractionDigits: 2 }).format(asNumber(value));
}

function formatPlainNumber(value: unknown, fallback = '0') {
  if (typeof value === 'number' && Number.isFinite(value)) {
    return new Intl.NumberFormat('ru-RU', { maximumFractionDigits: 2 }).format(value);
  }

  if (typeof value === 'string' && value.trim()) {
    return value;
  }

  return fallback;
}

function formatTeamRole(value: unknown) {
  if (typeof value === 'string') {
    return value;
  }

  const role = asRecord(value);
  const name = asString(role.role, 'Роль');
  const grade = asString(role.grade);
  const rate = asNumber(role.hourly_rate);
  const details = [grade, rate ? `${formatMoney(rate)}/ч` : ''].filter(Boolean).join(' · ');

  return details ? `${name} · ${details}` : name;
}

function formatBytes(value: unknown) {
  const bytes = asNumber(value);
  if (!bytes) return 'Размер не указан';
  if (bytes < 1024 * 1024) return `${formatNumber(bytes / 1024)} КБ`;
  return `${formatNumber(bytes / 1024 / 1024)} МБ`;
}

function formatDate(value: unknown) {
  if (typeof value !== 'string') return '';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return '';

  return new Intl.DateTimeFormat('ru-RU', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(date);
}

function formatPresaleStatus(value: unknown) {
  const statuses: Record<string, string> = {
    draft: 'Черновик',
    analysis_ready: 'Оценка готова',
  };

  return typeof value === 'string' ? statuses[value] || value : 'Не указан';
}

function getMessageText(message: PresaleChatMessage) {
  const value = message.content || message.message || message.answer || message.text;
  return typeof value === 'string' ? value : '';
}

function getMessageRole(message: PresaleChatMessage) {
  return typeof message.role === 'string' ? message.role : 'assistant';
}

function toUiMessage(message: PresaleChatMessage): UiMessage {
  return {
    id: message.id,
    role: getMessageRole(message),
    text: getMessageText(message),
  };
}

function getAnalysis(details: PresaleDetailsPayload | null) {
  const analysis = asRecord(details?.analysis);
  const payload = asRecord(analysis.payload);
  return asRecord(payload.analysis);
}

function getEffortBudget(details: PresaleDetailsPayload | null) {
  const payload = asRecord(asRecord(details?.analysis).payload);
  return asRecord(payload.effort_budget);
}

function getSupportBudget(details: PresaleDetailsPayload | null) {
  const payload = asRecord(asRecord(details?.analysis).payload);
  return asRecord(payload.support_budget);
}

function getWarrantyBudget(details: PresaleDetailsPayload | null) {
  const payload = asRecord(asRecord(details?.analysis).payload);
  return asRecord(payload.warranty_budget);
}

function getMonthlyExpenses(details: PresaleDetailsPayload | null) {
  const payload = asRecord(asRecord(details?.analysis).payload);
  return asArray(payload.monthly_expenses);
}

export function PresaleChatPage({ presaleId }: PresaleChatPageProps) {
  const router = useRouter();
  const authApi = useAuthApi();
  const presaleApi = usePresaleApi();
  const [isReady, setIsReady] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isSending, setIsSending] = useState(false);
  const [downloadingFileId, setDownloadingFileId] = useState('');
  const [isQuestionsOpen, setIsQuestionsOpen] = useState(false);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const [details, setDetails] = useState<PresaleDetailsPayload | null>(null);
  const [messages, setMessages] = useState<UiMessage[]>([]);

  const presale = details?.presale;
  const questions = details?.questions || [];
  const documents = details?.documents || [];
  const analysis = useMemo(() => getAnalysis(details), [details]);
  const effortBudget = useMemo(() => getEffortBudget(details), [details]);
  const supportBudget = useMemo(() => getSupportBudget(details), [details]);
  const warrantyBudget = useMemo(() => getWarrantyBudget(details), [details]);
  const monthlyExpenses = useMemo(() => getMonthlyExpenses(details), [details]);
  const functionalRequirements = asArray(analysis.functional_requirements);
  const nonfunctionalRequirements = asArray(analysis.nonfunctional_requirements);
  const tasks = asArray(analysis.tasks);
  const risks = asArray(analysis.risks);
  const architectureOptions = asArray(analysis.architecture_options);
  const teamOptions = asArray(analysis.team_options);
  const sizing = asRecord(analysis.sizing);
  const sizingComponents = asArray(sizing.components);
  const outputs = presale?.desired_outputs || [];
  const createdAt = formatDate(presale?.created_at);
  const updatedAt = formatDate(presale?.updated_at);

  useEffect(() => {
    let isMounted = true;

    authApi
      .me()
      .then(() => {
        if (!isMounted) return;
        setIsReady(true);
      })
      .catch(() => {
        router.replace('/auth');
      });

    return () => {
      isMounted = false;
    };
  }, [authApi, router]);

  useEffect(() => {
    if (!isReady) return;

    let isMounted = true;
    setIsLoading(true);
    setError('');

    Promise.all([presaleApi.getPresale(presaleId), presaleApi.getChatMessages(presaleId)])
      .then(([presaleDetails, chatMessages]) => {
        if (!isMounted) return;
        setDetails(presaleDetails);
        setMessages(chatMessages.map(toUiMessage));
      })
      .catch(() => {
        if (!isMounted) return;
        setError('Не удалось открыть пресейл или загрузить сообщения чата.');
      })
      .finally(() => {
        if (!isMounted) return;
        setIsLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, [isReady, presaleApi, presaleId]);

  const downloadDocument = async (fileId: string, filename: string) => {
    setDownloadingFileId(fileId);
    setError('');

    try {
      const blob = await presaleApi.downloadFile({ presaleId, fileId });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = filename || 'document';
      document.body.append(link);
      link.click();
      link.remove();
      URL.revokeObjectURL(url);
    } catch {
      setError('Не удалось скачать файл.');
    } finally {
      setDownloadingFileId('');
    }
  };

  const sendMessage = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const trimmed = message.trim();
    if (!trimmed || isSending) return;

    const userMessageId = `user-${Date.now()}`;
    const assistantMessageId = `assistant-${Date.now()}`;
    setMessage('');
    setError('');
    setIsSending(true);
    setMessages((current) => [
      ...current,
      { id: userMessageId, role: 'user', text: trimmed },
      { id: assistantMessageId, role: 'assistant', text: '' },
    ]);

    try {
      await presaleApi.streamChatMessage({
        presaleId,
        message: trimmed,
        onDelta: (delta) => {
          setMessages((current) =>
            current.map((item) =>
              item.id === assistantMessageId ? { ...item, text: `${item.text}${delta}` } : item,
            ),
          );
        },
      });
    } catch {
      setError('Не удалось отправить сообщение в чат.');
      setMessages((current) => current.filter((item) => item.id !== assistantMessageId));
    } finally {
      setIsSending(false);
    }
  };

  if (!isReady) {
    return null;
  }

  return (
    <main className="app presale-detail-route" data-theme="light">
      <section className="presale-detail-shell">
        <header className="presale-detail-hero">
          <Link className="back-link" href="/history">
            <ArrowLeft size={18} />
            История пресейлов
          </Link>
          <div className="presale-detail-title">
            <span>Пресейл</span>
            <h1>{presale?.title || 'Загружаем данные пресейла'}</h1>
            <p>{presale?.customer_name || 'Заказчик не указан'}</p>
          </div>
          <div className="presale-detail-metrics">
            <div>
              <span>Статус</span>
              <strong>{formatPresaleStatus(presale?.status)}</strong>
            </div>
            <div>
              <span>Вопросы</span>
              <strong>{questions.length}</strong>
            </div>
            <div>
              <span>Файлы</span>
              <strong>{documents.length}</strong>
            </div>
            <div>
              <span>Бюджет разработки</span>
              <strong>{formatMoney(effortBudget.total_cost)}</strong>
            </div>
          </div>
        </header>

        {error && <p className="form-error">{error}</p>}
        {isLoading && <div className="history-empty">Загружаем пресейл...</div>}

        {!isLoading && (
          <>
            <section className="presale-section">
              <div className="presale-section-head">
                <ReceiptText size={24} />
                <div>
                  <span>Вводные данные</span>
                  <h2>Что было отправлено на оценку</h2>
                </div>
              </div>
              <div className="presale-info-grid">
                <div>
                  <span>Создан</span>
                  <strong>{createdAt || 'Дата не указана'}</strong>
                </div>
                <div>
                  <span>Обновлен</span>
                  <strong>{updatedAt || 'Дата не указана'}</strong>
                </div>
                <div>
                  <span>Нужные результаты</span>
                  <div className="presale-tags">
                    {outputs.map((output) => (
                      <b key={output}>{output}</b>
                    ))}
                  </div>
                </div>
              </div>
              {presale?.description && <p className="presale-description">{presale.description}</p>}
            </section>

            <section className="presale-section">
              <div className="presale-section-head with-action">
                <div className="presale-section-title">
                  <MessageSquareText size={24} />
                  <div>
                    <span>Анкета</span>
                    <h2>Ваши вопросы и ответы</h2>
                  </div>
                </div>
                <button className="secondary-button compact-action" type="button" onClick={() => setIsQuestionsOpen((current) => !current)}>
                  {isQuestionsOpen ? <EyeOff size={18} /> : <Eye size={18} />}
                  {isQuestionsOpen ? 'Скрыть' : `Показать ответы (${questions.length})`}
                </button>
              </div>

              {isQuestionsOpen && (
                <div className="qa-list">
                  {questions.map((item, index) => (
                    <article className="qa-item" key={asString(item.id, `${index}`)}>
                      <span>Вопрос {index + 1}</span>
                      <h3>{asString(item.question, 'Вопрос без текста')}</h3>
                      <p>{asString(item.answer, 'Ответ не был заполнен')}</p>
                    </article>
                  ))}
                </div>
              )}
            </section>

            <section className="presale-section">
              <div className="presale-section-head">
                <FileText size={24} />
                <div>
                  <span>Документы</span>
                  <h2>Загруженные файлы</h2>
                </div>
              </div>
              <div className="document-download-list">
                {documents.map((document) => {
                  const id = asString(document.id);
                  const filename = asString(document.filename, 'Файл без названия');

                  return (
                    <button
                      className="document-download"
                      disabled={!id || downloadingFileId === id}
                      key={id || filename}
                      type="button"
                      onClick={() => downloadDocument(id, filename)}
                    >
                      <FileText size={20} />
                      <span>
                        <strong>{filename}</strong>
                        <small>{formatBytes(document.size_bytes)} · {asString(document.content_type, 'тип не указан')}</small>
                      </span>
                      <Download size={18} />
                    </button>
                  );
                })}
              </div>
            </section>

            <section className="presale-section">
              <div className="presale-section-head">
                <BrainCircuit size={24} />
                <div>
                  <span>Результат AI</span>
                  <h2>Оценка проекта</h2>
                </div>
              </div>
              <div className="analysis-summary-grid">
                <div>
                  <span>Часы разработки</span>
                  <strong>{formatNumber(effortBudget.total_hours)}</strong>
                </div>
                <div>
                  <span>Стоимость разработки</span>
                  <strong>{formatMoney(effortBudget.total_cost)}</strong>
                </div>
                <div>
                  <span>Поддержка в месяц</span>
                  <strong>{formatMoney(supportBudget.monthly_cost)}</strong>
                </div>
                <div>
                  <span>Гарантия в год</span>
                  <strong>{formatMoney(warrantyBudget.annual_cost)}</strong>
                </div>
              </div>

              <div className="analysis-grid">
                <article className="analysis-card">
                  <h3>Функциональные требования</h3>
                  <div className="compact-list">
                    {functionalRequirements.map((item, index) => (
                      <p key={`${asString(item.code)}-${index}`}>
                        <b>{asString(item.code, `FR-${index + 1}`)}</b>
                        {asString(item.title, 'Требование без названия')}
                      </p>
                    ))}
                  </div>
                </article>

                <article className="analysis-card">
                  <h3>Нефункциональные требования</h3>
                  <div className="compact-list">
                    {nonfunctionalRequirements.map((item, index) => (
                      <p key={`${asString(item.code)}-${index}`}>
                        <b>{asString(item.code, `NFR-${index + 1}`)}</b>
                        {asString(item.title, 'Требование без названия')}
                      </p>
                    ))}
                  </div>
                </article>

                <article className="analysis-card wide-analysis">
                  <h3>Декомпозиция работ</h3>
                  <div className="task-list">
                    {tasks.map((task, index) => (
                      <div key={`${asString(task.name)}-${index}`}>
                        <strong>{asString(task.name, `Задача ${index + 1}`)}</strong>
                        <span>{asString(task.description, 'Описание не указано')}</span>
                        <small>
                          {asArray(task.estimates)
                            .map((estimate) => `${asString(asRecord(estimate).role, 'роль')}: ${formatNumber(asRecord(estimate).hours)} ч`)
                            .join(', ') || 'Оценка часов не указана'}
                        </small>
                      </div>
                    ))}
                  </div>
                </article>

                <article className="analysis-card">
                  <h3><ShieldAlert size={18} /> Риски</h3>
                  <div className="risk-detail-list">
                    {risks.map((risk, index) => (
                      <div key={`${asString(risk.risk)}-${index}`}>
                        <strong>{asString(risk.risk, `Риск ${index + 1}`)}</strong>
                        <span>Влияние: {asString(risk.impact, 'не указано')}</span>
                        <p>{asString(risk.mitigation, 'Митигирующие меры не указаны')}</p>
                      </div>
                    ))}
                  </div>
                </article>

                <article className="analysis-card">
                  <h3><Boxes size={18} /> Архитектура</h3>
                  <div className="compact-list">
                    {architectureOptions.map((option, index) => (
                      <p key={`${asString(option.name)}-${index}`}>
                        <b>{asRecord(option).recommended ? 'Рекомендовано' : 'Вариант'}</b>
                        {asString(option.name, 'Архитектурный вариант')}
                      </p>
                    ))}
                  </div>
                </article>

                <article className="analysis-card">
                  <h3><UsersRound size={18} /> Команда</h3>
                  <div className="team-option-list">
                    {teamOptions.map((team, index) => (
                      <div className="team-option" key={`${asString(team.name)}-${index}`}>
                        <div>
                          <strong>{asString(team.name, 'Команда')}</strong>
                          <span>{formatPlainNumber(team.duration_months)} мес.</span>
                        </div>
                        <div className="team-role-tags">
                          {asArray(team.roles).map((role, roleIndex) => (
                            <b key={`${formatTeamRole(role)}-${roleIndex}`}>{formatTeamRole(role)}</b>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </article>

                <article className="analysis-card">
                  <h3><CalendarDays size={18} /> Помесячные расходы</h3>
                  <div className="compact-list">
                    {monthlyExpenses.map((month, index) => (
                      <p key={`${asString(month.month)}-${index}`}>
                        <b>Месяц {formatNumber(month.month)}</b>
                        {formatMoney(month.total)}
                      </p>
                    ))}
                  </div>
                </article>

                <article className="analysis-card wide-analysis">
                  <h3>Сайзинг</h3>
                  <p className="analysis-note">{asString(sizing.summary, 'Сводка по сайзингу не сформирована')}</p>
                  <div className="sizing-list">
                    {sizingComponents.map((component, index) => (
                      <div key={`${asString(component.name)}-${index}`}>
                        <strong>{asString(component.name, 'Компонент')}</strong>
                        <span>CPU: {formatNumber(component.cpu)} · RAM: {formatNumber(component.ram_gb)} ГБ · Диск: {formatNumber(component.storage_gb)} ГБ</span>
                      </div>
                    ))}
                  </div>
                </article>
              </div>
            </section>

            <section className="presale-section chat-section">
              <div className="presale-section-head">
                <Bot size={24} />
                <div>
                  <span>Чат</span>
                  <h2>Сообщения по пресейлу</h2>
                </div>
              </div>

              <div className="chat-messages">
                {!messages.length && <div className="history-empty">Сообщений пока нет. Задайте первый вопрос по оценке.</div>}
                {messages.map((item) => {
                  const isUser = item.role === 'user';

                  return (
                    <div className={isUser ? 'chat-message user' : 'chat-message assistant'} key={item.id}>
                      <div className="chat-message-icon">{isUser ? <UserRound size={18} /> : <Bot size={18} />}</div>
                      <p>{item.text || (isSending && !isUser ? '...' : '')}</p>
                    </div>
                  );
                })}
              </div>

              <form className="chat-form" onSubmit={sendMessage}>
                <input
                  placeholder="Задайте вопрос по бюджету, рискам, требованиям или файлам"
                  value={message}
                  onChange={(event) => setMessage(event.target.value)}
                  disabled={isSending}
                />
                <button className="primary-button" type="submit" disabled={isSending || !message.trim()}>
                  <Send size={18} />
                  {isSending ? 'Отправляем' : 'Отправить'}
                </button>
              </form>
            </section>
          </>
        )}
      </section>
    </main>
  );
}

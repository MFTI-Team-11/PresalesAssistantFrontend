'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { ArrowLeft, FileText, MessageSquareText, RefreshCw } from 'lucide-react';
import { useAuthApi } from '@features/auth';
import { type Presale, usePresaleApi } from '@features/presale';

function formatDate(value: unknown) {
  if (typeof value !== 'string') return '';

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return '';

  return new Intl.DateTimeFormat('ru-RU', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(date);
}

export function HistoryPage() {
  const router = useRouter();
  const authApi = useAuthApi();
  const presaleApi = usePresaleApi();
  const [isReady, setIsReady] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [presales, setPresales] = useState<Presale[]>([]);

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

    presaleApi
      .getPresales()
      .then((items) => {
        if (!isMounted) return;
        setPresales(items);
      })
      .catch(() => {
        if (!isMounted) return;
        setError('Не удалось загрузить историю пресейлов.');
      })
      .finally(() => {
        if (!isMounted) return;
        setIsLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, [isReady, presaleApi]);

  if (!isReady) {
    return null;
  }

  return (
    <main className="app workspace-route" data-theme="light">
      <section className="history-shell">
        <header className="history-header">
          <Link className="back-link" href="/workspace">
            <ArrowLeft size={18} />
            Рабочее пространство
          </Link>
          <div>
            <span>История</span>
            <h1>Пресейлы</h1>
          </div>
        </header>

        <section className="history-panel">
          <div className="history-panel-head">
            <div>
              <h2>Список пресейлов</h2>
              <span>Откройте пресейл, чтобы посмотреть чат и сохраненный контекст.</span>
            </div>
            <RefreshCw size={22} />
          </div>

          {error && <p className="form-error">{error}</p>}
          {isLoading && <div className="history-empty">Загружаем историю...</div>}
          {!isLoading && !presales.length && <div className="history-empty">История пока пустая.</div>}

          <div className="history-list">
            {presales.map((presale) => {
              const createdAt = formatDate(presale.created_at);

              return (
                <Link className="history-item" href={`/history/${presale.id}`} key={presale.id}>
                  <FileText size={22} />
                  <div>
                    <strong>{presale.title || 'Без названия'}</strong>
                    <span>{presale.customer_name || 'Заказчик не указан'}</span>
                    {presale.description && <p>{presale.description}</p>}
                  </div>
                  <div className="history-item-meta">
                    {createdAt && <span>{createdAt}</span>}
                    <MessageSquareText size={18} />
                  </div>
                </Link>
              );
            })}
          </div>
        </section>
      </section>
    </main>
  );
}

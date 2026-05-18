'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { type FormEvent, useState } from 'react';
import { ArrowLeft, Bot } from 'lucide-react';
import { useAuthApi } from '@features/auth';
import { getClientInfo } from '@shared/lib/clientInfo';
import { useFingerprint } from '@shared/lib/useFingerprint';
import type { AuthMode } from '@/types';

export function AuthPage() {
  const router = useRouter();
  const fingerprint = useFingerprint();
  const authApi = useAuthApi();
  const [mode, setMode] = useState<AuthMode>('login');
  const [email, setEmail] = useState('');
  const [fullName, setFullName] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const isLogin = mode === 'login';

  const submitAuth = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError('');
    setIsSubmitting(true);

    try {
      if (isLogin) {
        await authApi.login({
          email,
          password,
          fingerprint,
          ...getClientInfo(),
        });
      } else {
        await authApi.register({
          email,
          full_name: fullName,
          password,
        });
      }

      window.localStorage.setItem('presales-auth', 'true');
      router.push('/workspace');
    } catch (requestError) {
      setError(getErrorMessage(requestError));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="app auth-route" data-theme="light">
      <section className="auth-page-shell">
        <Link className="back-link" href="/">
          <ArrowLeft size={18} />
          На главную
        </Link>

        <section className="auth-card" aria-labelledby="auth-title">
          <div className="auth-brand">
            <div className="brand-mark">
              <Bot size={24} />
            </div>
            <div>
              <span>Кейс 6</span>
              <strong>AI ассистент для пресейла</strong>
            </div>
          </div>

          <div className="auth-head">
            <span>Личный кабинет</span>
            <h1 id="auth-title">{isLogin ? 'Вход' : 'Регистрация'}</h1>
          </div>

          <div className="auth-switch" role="tablist" aria-label="Режим формы">
            <button className={isLogin ? 'active' : ''} type="button" role="tab" aria-selected={isLogin} onClick={() => setMode('login')}>
              Вход
            </button>
            <button className={!isLogin ? 'active' : ''} type="button" role="tab" aria-selected={!isLogin} onClick={() => setMode('register')}>
              Регистрация
            </button>
          </div>

          <form className="auth-form" onSubmit={submitAuth}>
            {!isLogin && (
              <label>
                <span>ФИО</span>
                <input type="text" placeholder="Иван Петров" value={fullName} onChange={(event) => setFullName(event.target.value)} required />
              </label>
            )}
            <label>
              <span>Email</span>
              <input type="email" placeholder="team@example.ru" value={email} onChange={(event) => setEmail(event.target.value)} required />
            </label>
            <label>
              <span>Пароль</span>
              <input type="password" placeholder="Минимум 8 символов" value={password} onChange={(event) => setPassword(event.target.value)} required />
            </label>
            {error && <p className="form-error">{error}</p>}
            <button className="primary-button auth-submit" type="submit" disabled={isSubmitting || (isLogin && !fingerprint)}>
              {isSubmitting ? 'Отправка...' : isLogin ? 'Войти в кабинет' : 'Создать аккаунт'}
            </button>
          </form>
        </section>
      </section>
    </main>
  );
}

function getErrorMessage(error: unknown) {
  if (typeof error === 'object' && error && 'response' in error) {
    const response = (error as { response?: { data?: { error?: { detail?: unknown }; detail?: unknown } } }).response;
    const detail = response?.data?.error?.detail ?? response?.data?.detail;

    if (typeof detail === 'string') {
      return detail;
    }
  }

  return 'Не удалось выполнить запрос. Проверьте данные и доступность сервера.';
}

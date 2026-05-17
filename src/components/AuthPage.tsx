'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { ArrowLeft, Bot } from 'lucide-react';
import type { AuthMode } from '@/types';

export function AuthPage() {
  const router = useRouter();
  const [mode, setMode] = useState<AuthMode>('login');

  const isLogin = mode === 'login';

  const submitAuth = () => {
    window.localStorage.setItem('presales-auth', 'true');
    router.push('/admin');
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

          <form className="auth-form">
            {!isLogin && (
              <label>
                <span>Название компании</span>
                <input type="text" placeholder="Например, Лоция" />
              </label>
            )}
            <label>
              <span>Email</span>
              <input type="email" placeholder="team@example.ru" />
            </label>
            <label>
              <span>Пароль</span>
              <input type="password" placeholder="Минимум 8 символов" />
            </label>
            {!isLogin && (
              <label>
                <span>Роль</span>
                <select defaultValue="presale">
                  <option value="presale">Пресейл</option>
                  <option value="pm">Руководитель проекта</option>
                  <option value="analyst">Аналитик</option>
                </select>
              </label>
            )}
            <button className="primary-button auth-submit" type="button" onClick={submitAuth}>
              {isLogin ? 'Войти в админку' : 'Создать аккаунт'}
            </button>
          </form>
        </section>
      </section>
    </main>
  );
}

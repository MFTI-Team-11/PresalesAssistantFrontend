'use client';

import { useEffect, useState } from 'react';

const storageKey = 'presales.fingerprint';

function createFingerprint() {
  if (typeof crypto !== 'undefined' && 'randomUUID' in crypto) {
    return crypto.randomUUID();
  }

  return `${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

export function useFingerprint() {
  const [fingerprint, setFingerprint] = useState('');

  useEffect(() => {
    const saved = window.localStorage.getItem(storageKey);
    const value = saved || createFingerprint();

    if (!saved) {
      window.localStorage.setItem(storageKey, value);
    }

    setFingerprint(value);
  }, []);

  return fingerprint;
}

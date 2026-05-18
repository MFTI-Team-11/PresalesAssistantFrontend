import axios, { AxiosError, type AxiosInstance, type AxiosRequestConfig } from 'axios';
import { withRefreshLock } from './refreshLock';

export type ApiService = 'base' | 'auth' | 'ai' | 'presale';

const instances = new Map<ApiService, AxiosInstance>();

const trimSlash = (value?: string) => value?.replace(/\/+$/, '') || '';

const serviceFallbacks: Record<ApiService, string> = {
  base: process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:8088',
  auth: process.env.NEXT_PUBLIC_AUTH_SERVICE_URL || 'http://localhost:8088/auth_service',
  ai: process.env.NEXT_PUBLIC_AI_SERVICE_URL || 'http://localhost:8088/ai_service',
  presale: process.env.NEXT_PUBLIC_PRESALE_SERVICE_URL || 'http://localhost:8088/presale_service',
};

function getBaseUrl(service: ApiService) {
  const configured = serviceFallbacks[service];

  if (typeof window === 'undefined') {
    return configured;
  }

  if (configured) {
    return configured;
  }

  const origin = trimSlash(window.location.origin);
  const suffixMap: Partial<Record<ApiService, string>> = {
    auth: 'auth_service',
    ai: 'ai_service',
    presale: 'presale_service',
  };
  const suffix = suffixMap[service];

  return suffix ? `${origin}/${suffix}` : origin;
}

function getPath(config: AxiosRequestConfig) {
  try {
    const url = new URL(config.url || '', config.baseURL || 'http://local');
    return url.pathname;
  } catch {
    return config.url || '';
  }
}

function shouldSkipRefresh(config?: AxiosRequestConfig) {
  if (!config) {
    return true;
  }

  const path = getPath(config);
  const method = (config.method || 'get').toLowerCase();

  if (method === 'options') {
    return true;
  }

  return ['/auth/login', '/auth/register', '/auth/refresh', '/auth/logout'].some((item) => path.startsWith(item));
}

export function useApi(service: ApiService = 'base'): AxiosInstance {
  if (typeof window !== 'undefined' && instances.has(service)) {
    return instances.get(service)!;
  }

  const api = axios.create({
    baseURL: getBaseUrl(service),
    withCredentials: true,
  });

  const refreshApi = axios.create({
    baseURL: getBaseUrl('auth'),
    withCredentials: true,
  });

  api.interceptors.response.use(
    (response) => response,
    async (error: AxiosError) => {
      const original = error.config as (AxiosRequestConfig & { _retry?: boolean }) | undefined;

      if (error.response?.status !== 401 || !original || original._retry || shouldSkipRefresh(original)) {
        return Promise.reject(error);
      }

      original._retry = true;

      try {
        await withRefreshLock(() => refreshApi.post('/auth/refresh', {}));
        return api.request(original);
      } catch {
        return Promise.reject(error);
      }
    },
  );

  if (typeof window !== 'undefined') {
    instances.set(service, api);
  }

  return api;
}

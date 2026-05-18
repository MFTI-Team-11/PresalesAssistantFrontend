import { apiRoutes, getPayload, type ApiResponse, useApi } from '@shared/api';
import type { Session } from '../types';

export function useSessionsApi() {
  const api = useApi('auth');

  const list = async () => {
    const { data } = await api.get<ApiResponse<Session[]>>(apiRoutes.sessions());
    return getPayload(data);
  };

  const revoke = async (sessionId: string) => {
    const { data } = await api.post<ApiResponse<unknown>>(apiRoutes.sessions(`${sessionId}/revoke`), {});
    return data;
  };

  return {
    list,
    revoke,
  };
}

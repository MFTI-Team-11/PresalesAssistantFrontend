import { type ApiResponse, getPayload, useApi } from '@shared/api';
import type { PresaleHealth } from '../types';

export function usePresaleApi() {
  const api = useApi('presale');

  const health = async () => {
    const { data } = await api.get<ApiResponse<PresaleHealth>>('/health');
    return getPayload(data);
  };

  return {
    health,
  };
}

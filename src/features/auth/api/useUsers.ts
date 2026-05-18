import { apiRoutes, getPayload, type ApiResponse, useApi } from '@shared/api';
import type { User } from '../types';

export function useUsersApi() {
  const api = useApi('auth');

  const list = async () => {
    const { data } = await api.get<ApiResponse<User[]>>(apiRoutes.users());
    return getPayload(data);
  };

  const getById = async (userId: string) => {
    const { data } = await api.get<ApiResponse<User>>(apiRoutes.users(userId));
    return getPayload(data);
  };

  return {
    list,
    getById,
  };
}

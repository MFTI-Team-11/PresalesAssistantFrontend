import { apiRoutes, getPayload, type ApiResponse, useApi } from '@shared/api';
import type { Role, RoleCreate } from '../types';

export function useRolesApi() {
  const api = useApi('auth');

  const list = async () => {
    const { data } = await api.get<ApiResponse<Role[]>>(apiRoutes.roles());
    return getPayload(data);
  };

  const create = async (payload: RoleCreate) => {
    const { data } = await api.post<ApiResponse<Role>>(apiRoutes.roles(), payload);
    return getPayload(data);
  };

  const assignToUser = async (roleId: string, userId: string) => {
    const { data } = await api.post<ApiResponse<unknown>>(apiRoutes.roles(`${roleId}/users/${userId}`), {});
    return data;
  };

  return {
    list,
    create,
    assignToUser,
  };
}

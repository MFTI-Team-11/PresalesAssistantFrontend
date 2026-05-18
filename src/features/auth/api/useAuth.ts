import { useMemo } from 'react';
import { apiRoutes, getPayload, type ApiResponse, useApi } from '@shared/api';
import type { AuthUser, LoginRequest, RegisterRequest } from '../types';

export function useAuthApi() {
  const api = useApi('auth');

  return useMemo(() => {
    const register = async (payload: RegisterRequest) => {
      const { data } = await api.post<ApiResponse<AuthUser>>(apiRoutes.auth('register'), payload);
      return getPayload(data);
    };

    const login = async (payload: LoginRequest) => {
      const { data } = await api.post<ApiResponse<AuthUser>>(apiRoutes.auth('login'), payload);
      return getPayload(data);
    };

    const refresh = async () => {
      const { data } = await api.post<ApiResponse<AuthUser>>(apiRoutes.auth('refresh'), {});
      return data;
    };

    const me = async () => {
      const { data } = await api.get<ApiResponse<AuthUser>>(apiRoutes.auth('me'));
      return getPayload(data);
    };

    const logout = async () => {
      const { data } = await api.post<ApiResponse<AuthUser>>(apiRoutes.auth('logout'), {});
      return data;
    };

    return {
      register,
      login,
      refresh,
      me,
      logout,
    };
  }, [api]);
}

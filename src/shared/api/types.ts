export type ApiResponse<T> = {
  success: boolean;
  payload?: T;
  error?: {
    detail: unknown;
  };
};

export function getPayload<T>(response: ApiResponse<T>): T {
  if (!response.success) {
    throw response.error?.detail ?? new Error('API request failed');
  }

  return response.payload as T;
}

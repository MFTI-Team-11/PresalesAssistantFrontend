import { useMemo } from 'react';
import { type ApiResponse, getPayload, useApi } from '@shared/api';
import type { AiHealth, DefaultQuestionsPayload, PresaleEstimatePayload, PresaleEstimateRequest } from '../types';

export function useAiApi() {
  const api = useApi('ai');

  return useMemo(() => {
    const health = async () => {
      const { data } = await api.get<ApiResponse<AiHealth>>('/health');
      return getPayload(data);
    };

    const getDefaultQuestions = async () => {
      const { data } = await api.get<ApiResponse<DefaultQuestionsPayload>>('/questions/default');
      return getPayload(data);
    };

    const generatePresaleEstimate = async ({ answers, files = [] }: PresaleEstimateRequest) => {
      const formData = new FormData();
      formData.append('answers', JSON.stringify(answers));
      files.forEach((file) => formData.append('files', file));

      const { data } = await api.post<ApiResponse<PresaleEstimatePayload>>('/presale/estimate', formData);
      return getPayload(data);
    };

    return {
      health,
      getDefaultQuestions,
      generatePresaleEstimate,
    };
  }, [api]);
}

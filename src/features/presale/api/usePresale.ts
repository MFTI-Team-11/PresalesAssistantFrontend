import { useMemo } from 'react';
import { type ApiResponse, getPayload, useApi } from '@shared/api';
import type {
  CreatePresaleRequest,
  DefaultPresaleQuestionsPayload,
  DownloadPresaleFileRequest,
  GeneratePresaleEstimateRequest,
  Presale,
  PresaleChatMessage,
  PresaleDetailsPayload,
  PresaleEstimatePayload,
  PresaleHealth,
  PresaleChatStreamEvent,
  SendPresaleChatMessageRequest,
  StreamPresaleChatMessageRequest,
} from '../types';

export function usePresaleApi() {
  const api = useApi('presale');

  return useMemo(() => {
    const health = async () => {
      const { data } = await api.get<ApiResponse<PresaleHealth>>('/health');
      return getPayload(data);
    };

    const createPresale = async (payload: CreatePresaleRequest) => {
      const { data } = await api.post<ApiResponse<Presale>>('/presales', payload);
      return getPayload(data);
    };

    const getPresales = async () => {
      const { data } = await api.get<ApiResponse<Presale[]>>('/presales');
      return getPayload(data);
    };

    const getPresale = async (presaleId: string) => {
      const { data } = await api.get<ApiResponse<PresaleDetailsPayload>>(`/presales/${presaleId}`);
      return getPayload(data);
    };

    const getDefaultQuestions = async () => {
      const { data } = await api.get<ApiResponse<DefaultPresaleQuestionsPayload>>('/presales/questions/default');
      return getPayload(data);
    };

    const generateEstimate = async ({ presaleId, answers, files = [] }: GeneratePresaleEstimateRequest) => {
      const formData = new FormData();
      formData.append('answers', JSON.stringify(answers));
      files.forEach((file) => formData.append('files', file));

      const { data } = await api.post<ApiResponse<PresaleEstimatePayload>>(`/presales/${presaleId}/estimate`, formData);
      return getPayload(data);
    };

    const downloadFile = async ({ presaleId, fileId }: DownloadPresaleFileRequest) => {
      const { data } = await api.get<Blob>(`/presales/${presaleId}/files/${fileId}`, {
        responseType: 'blob',
      });
      return data;
    };

    const getChatMessages = async (presaleId: string) => {
      const { data } = await api.get<ApiResponse<PresaleChatMessage[]>>(`/presales/${presaleId}/chat/messages`);
      return getPayload(data);
    };

    const sendChatMessage = async ({ presaleId, message }: SendPresaleChatMessageRequest) => {
      const { data } = await api.post<ApiResponse<PresaleChatMessage>>(`/presales/${presaleId}/chat/messages`, { message });
      return getPayload(data);
    };

    const streamChatMessage = async ({ presaleId, message, signal, onDelta, onDone }: StreamPresaleChatMessageRequest) => {
      const response = await fetch(api.getUri({ url: `/presales/${presaleId}/chat/messages/stream` }), {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message }),
        signal,
      });

      if (!response.ok) {
        throw new Error(`Failed to stream presale chat message: ${response.status}`);
      }

      if (!response.body) {
        throw new Error('Presale chat stream response body is empty');
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let assistantText = '';
      let buffer = '';

      const handleEvent = (event: string) => {
        const dataLine = event
          .split(/\r?\n/)
          .find((line) => line.startsWith('data: '));

        if (!dataLine) return;

        const data = JSON.parse(dataLine.slice(6)) as PresaleChatStreamEvent;

        if (data.delta) {
          assistantText += data.delta;
          onDelta?.(data.delta);
        }

        if (data.done) {
          onDone?.(assistantText);
        }
      };

      while (true) {
        const { value, done } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });
        const events = buffer.split(/\r?\n\r?\n/);
        buffer = events.pop() || '';
        events.forEach(handleEvent);
      }

      buffer += decoder.decode();
      if (buffer.trim()) {
        handleEvent(buffer);
      }

      return assistantText;
    };

    return {
      health,
      createPresale,
      getPresales,
      getPresale,
      getDefaultQuestions,
      generateEstimate,
      downloadFile,
      getChatMessages,
      sendChatMessage,
      streamChatMessage,
    };
  }, [api]);
}

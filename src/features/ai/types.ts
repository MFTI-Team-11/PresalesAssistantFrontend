export type AiHealth = {
  status: string;
};

export type DefaultQuestion = {
  id: string;
  text: string;
  category: string;
  required: boolean;
  answer_type?: 'text' | string;
  allow_file?: boolean;
  file_required?: boolean;
  file_hint?: string | null;
  placeholder: string;
};

export type DefaultQuestionsPayload = {
  questions: DefaultQuestion[];
};

export type PresaleEstimateRequest = {
  answers: string[];
  files?: File[];
};

export type PresaleEstimatePayload = Record<string, unknown>;

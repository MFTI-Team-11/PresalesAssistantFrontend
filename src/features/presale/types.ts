export type PresaleHealth = {
  status: string;
};

export type CreatePresaleRequest = {
  title: string;
  customer_name: string;
  description?: string;
  desired_outputs: string[];
};

export type Presale = {
  id: string;
  title?: string;
  customer_name?: string;
  description?: string;
  desired_outputs?: string[];
  status?: 'draft' | 'analysis_ready' | string;
  [key: string]: unknown;
};

export type PresaleDocument = {
  id: string;
  [key: string]: unknown;
};

export type PresaleQuestion = {
  id?: string;
  question_id?: string;
  question?: string;
  answer?: string;
  [key: string]: unknown;
};

export type PresaleChatMessage = {
  id: string;
  message?: string;
  content?: string;
  role?: string;
  created_at?: string;
  [key: string]: unknown;
};

export type PresaleAnalysis = Record<string, unknown>;

export type PresaleDetailsPayload = {
  presale: Presale;
  questions: PresaleQuestion[];
  documents: PresaleDocument[];
  analysis: PresaleAnalysis;
  chat?: PresaleChatMessage[];
};

export type DefaultPresaleQuestion = {
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

export type DefaultPresaleQuestionsPayload = {
  questions: DefaultPresaleQuestion[];
};

export type GeneratePresaleEstimateRequest = {
  presaleId: string;
  answers: string[];
  files?: File[];
};

export type PresaleEstimatePayload = Record<string, unknown>;

export type DownloadPresaleFileRequest = {
  presaleId: string;
  fileId: string;
};

export type SendPresaleChatMessageRequest = {
  presaleId: string;
  message: string;
};

export type PresaleChatStreamEvent = {
  delta?: string;
  done?: boolean;
};

export type StreamPresaleChatMessageRequest = SendPresaleChatMessageRequest & {
  signal?: AbortSignal;
  onDelta?: (delta: string) => void;
  onDone?: (assistantText: string) => void;
};

export type ErrorEnvelope = {
  code: string;
  message: string;
  fieldErrors?: Record<string, string>;
};

export type ApiMeta = {
  correlationId: string;
};

export type ApiResponse<T> = {
  data: T | null;
  meta: ApiMeta;
  error: ErrorEnvelope | null;
};

export type ErrorData = {
  message: string;
  statusText: string;
};

// ErrorResponse holds error response from backend.
export type ErrorResponse = {
  error: string;
  message: string;
  data?: any;
};

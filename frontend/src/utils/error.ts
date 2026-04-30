import { isAxiosError } from 'axios';

export function getErrorMessage(error: unknown, defaultMessage: string = 'An error occurred'): string {
  if (isAxiosError(error)) {
    return error.response?.data?.error?.message || error.message || defaultMessage;
  }
  if (error instanceof Error) {
    return error.message;
  }
  return typeof error === 'string' ? error : defaultMessage;
}

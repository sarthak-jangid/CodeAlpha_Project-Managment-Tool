import type { AxiosError } from 'axios';

export function getApiErrorMessage(error: unknown): string {
  if (!error) {
    return 'Something went wrong';
  }

  if (typeof error === 'string') {
    return error;
  }

  if (error instanceof Error) {
    const axiosError = error as AxiosError;
    const responseData = axiosError.response?.data as
      | { message?: unknown; error?: unknown }
      | undefined;

    if (responseData) {
      if (typeof responseData.message === 'string' && responseData.message.trim()) {
        return responseData.message;
      }
      if (typeof responseData.error === 'string' && responseData.error.trim()) {
        return responseData.error;
      }
    }

    return error.message || 'Something went wrong';
  }

  if (typeof error === 'object' && error !== null) {
    const errObj = error as Record<string, unknown>;
    if (typeof errObj.message === 'string' && errObj.message.trim()) {
      return errObj.message;
    }
    if (typeof errObj.error === 'string' && errObj.error.trim()) {
      return errObj.error;
    }
  }

  return 'Something went wrong';
}

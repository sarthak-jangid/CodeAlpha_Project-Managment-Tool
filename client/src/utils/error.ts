type ErrorPayload = {
  message?: unknown;
  error?: unknown;
  errors?: unknown[];
};

const getMessageFromPayload = (payload: unknown): string | null => {
  if (typeof payload === 'string') {
    const trimmed = payload.trim();
    return trimmed ? trimmed : null;
  }

  if (!payload || typeof payload !== 'object') {
    return null;
  }

  const data = payload as ErrorPayload;

  if (typeof data.message === 'string' && data.message.trim()) {
    return data.message.trim();
  }

  if (typeof data.error === 'string' && data.error.trim()) {
    return data.error.trim();
  }

  if (Array.isArray(data.errors)) {
    for (const entry of data.errors) {
      if (typeof entry === 'string' && entry.trim()) {
        return entry.trim();
      }

      if (entry && typeof entry === 'object') {
        const item = entry as { message?: unknown };
        if (typeof item.message === 'string' && item.message.trim()) {
          return item.message.trim();
        }
      }
    }
  }

  return null;
};

export function getApiErrorMessage(error: unknown): string {
  if (!error) {
    return 'Something went wrong';
  }

  if (typeof error === 'string') {
    return error;
  }

  if (typeof error === 'object' && error !== null) {
    const errObj = error as Record<string, unknown>;
    const response = errObj.response;

    if (response && typeof response === 'object') {
      const responseData = (response as { data?: unknown }).data;
      const fromResponse = getMessageFromPayload(responseData);
      if (fromResponse) {
        return fromResponse;
      }
    }

    const fromError = getMessageFromPayload(error);
    if (fromError) {
      return fromError;
    }

    if (typeof errObj.message === 'string' && errObj.message.trim()) {
      return errObj.message.trim();
    }
  }

  return 'Something went wrong';
}

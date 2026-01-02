export default function getErrorMessage(err: unknown): string {
  if (!err) return '';

  if (typeof err === 'string') return err;

  if (err instanceof Error) return err.message;

  // AxiosError shape (and many similar HTTP error shapes)
  const anyErr = err as any;
  const fromResponse = anyErr?.response?.data;

  if (typeof fromResponse === 'string') return fromResponse;
  if (fromResponse && typeof fromResponse === 'object' && typeof fromResponse.message === 'string') {
    return fromResponse.message;
  }

  if (typeof anyErr?.message === 'string') return anyErr.message;

  try {
    return JSON.stringify(err);
  } catch {
    return String(err);
  }
}

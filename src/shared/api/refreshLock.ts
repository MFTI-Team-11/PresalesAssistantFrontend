let refreshPromise: Promise<unknown> | null = null;

export async function withRefreshLock<T>(fn: () => Promise<T>): Promise<T> {
  if (refreshPromise) {
    return refreshPromise as Promise<T>;
  }

  refreshPromise = fn();

  try {
    return await (refreshPromise as Promise<T>);
  } finally {
    refreshPromise = null;
  }
}

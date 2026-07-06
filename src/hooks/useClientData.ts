"use client";
import { useCallback, useEffect, useState } from "react";

/**
 * Load data from the client CMS store (localStorage overlay) after mount, so the
 * dashboard reflects edits without an SSR/CSR hydration mismatch. Returns the
 * data (null until mounted) and a `refresh` to re-read after a mutation.
 */
export function useClientData<T>(load: () => T): { data: T | null; refresh: () => void; ready: boolean } {
  const [data, setData] = useState<T | null>(null);
  const [ready, setReady] = useState(false);
  const refresh = useCallback(() => {
    setData(load());
    setReady(true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  useEffect(() => {
    refresh();
  }, [refresh]);
  return { data, refresh, ready };
}

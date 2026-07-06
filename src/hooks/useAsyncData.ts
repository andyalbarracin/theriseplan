/* =============================================================================
   Archivo:     useAsyncData.ts
   Ruta:        web/src/hooks/useAsyncData.ts
   Modificado:  2026-07-06
   Descripcion: Igual que useClientData pero para cargas ASINCRONAS (Supabase).
                Ejecuta el loader despues de montar (evita desajustes SSR/CSR),
                expone { data, ready, error, refresh } y permite re-leer tras un
                guardado con refresh().
   ============================================================================= */
"use client";
import { useCallback, useEffect, useState } from "react";

export function useAsyncData<T>(load: () => Promise<T>): {
  data: T | null;
  ready: boolean;
  error: string | null;
  refresh: () => void;
} {
  const [data, setData] = useState<T | null>(null);
  const [ready, setReady] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const refresh = useCallback(() => {
    let cancelled = false;
    load()
      .then((d) => {
        if (!cancelled) {
          setData(d);
          setError(null);
          setReady(true);
        }
      })
      .catch((e) => {
        if (!cancelled) {
          setError(e instanceof Error ? e.message : String(e));
          setReady(true);
        }
      });
    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const cleanup = refresh();
    return cleanup;
  }, [refresh]);

  return { data, ready, error, refresh };
}

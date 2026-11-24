import { useEffect, useState } from 'react';

/** Carga un catálogo (caché-primero). `desdeCache` indica que se usó la copia local por falta de señal. */
export function useCatalogo<T>(cargar: () => Promise<{ datos: T[]; desdeCache: boolean }>) {
  const [datos, setDatos] = useState<T[]>([]);
  const [cargando, setCargando] = useState(true);
  const [desdeCache, setDesdeCache] = useState(false);

  useEffect(() => {
    let activo = true;
    cargar()
      .then((r) => {
        if (!activo) return;
        setDatos(r.datos);
        setDesdeCache(r.desdeCache);
      })
      .finally(() => activo && setCargando(false));
    return () => { activo = false; };
    // `cargar` es una función de módulo estable; solo se carga al montar.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return { datos, cargando, desdeCache };
}

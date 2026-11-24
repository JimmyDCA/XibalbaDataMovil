import { useRef, useState } from 'react';
import { encolar, leerCola } from '../offline/cola';
import { useSincronizacion } from '../offline/SincronizacionContext';
import type { Modulo } from '../api/types';

export type ResultadoCaptura =
  | { tipo: 'enviado' }
  | { tipo: 'en_cola' }
  | { tipo: 'rechazado'; mensaje: string };

/**
 * Guarda la captura en la cola local y de inmediato intenta enviarla.
 * Con señal se envía al momento; sin señal queda guardada y se envía sola después.
 */
export function useEnviarCaptura() {
  const { sincronizarAhora } = useSincronizacion();
  const [guardando, setGuardando] = useState(false);
  const bloqueo = useRef(false); // evita doble envío por doble toque

  const enviar = async (
    modulo: Modulo,
    payload: Record<string, unknown>,
    resumen: string,
  ): Promise<ResultadoCaptura | null> => {
    if (bloqueo.current) return null;
    bloqueo.current = true;
    setGuardando(true);
    try {
      const idLocal = await encolar(modulo, payload, resumen);
      await sincronizarAhora();
      const elemento = (await leerCola()).find((e) => e.idLocal === idLocal);
      if (!elemento) return { tipo: 'enviado' };
      if (elemento.estado === 'error') return { tipo: 'rechazado', mensaje: elemento.ultimoError ?? 'Error del servidor' };
      return { tipo: 'en_cola' };
    } finally {
      bloqueo.current = false;
      setGuardando(false);
    }
  };

  return { enviar, guardando };
}

import { isAxiosError } from 'axios';
import { api } from '../api/client';
import { RUTA_POST, type Modulo } from '../api/types';
import { leerJSON, guardarJSON } from './almacen';

const CLAVE_COLA = 'cola_envios';

export type ElementoCola = {
  idLocal: string;
  modulo: Modulo;
  /** Texto corto para identificar la captura en la lista (ej. clave de pozo). */
  resumen: string;
  payload: Record<string, unknown>;
  creadoEn: string;
  intentos: number;
  estado: 'pendiente' | 'error';
  ultimoError?: string;
};

type Oyente = (cola: ElementoCola[]) => void;
const oyentes = new Set<Oyente>();

export function suscribirCola(oyente: Oyente) {
  oyentes.add(oyente);
  return () => { oyentes.delete(oyente); };
}

/** Indica si hay un envío en curso (para mostrar "Enviando…"). */
let procesos = 0;
const oyentesEnvio = new Set<(enviando: boolean) => void>();

export function suscribirEnvio(oyente: (enviando: boolean) => void) {
  oyentesEnvio.add(oyente);
  return () => { oyentesEnvio.delete(oyente); };
}

function cambiarProcesos(delta: number) {
  procesos += delta;
  oyentesEnvio.forEach((o) => o(procesos > 0));
}

export const leerCola = () => leerJSON<ElementoCola[]>(CLAVE_COLA, []);

async function escribirCola(cola: ElementoCola[]) {
  await guardarJSON(CLAVE_COLA, cola);
  oyentes.forEach((o) => o(cola));
}

/** Serializa los cambios a la cola para que no se pisen entre sí. */
let cadena: Promise<unknown> = Promise.resolve();
function enSerie<T>(tarea: () => Promise<T>): Promise<T> {
  const resultado = cadena.then(tarea, tarea);
  cadena = resultado.catch(() => undefined);
  return resultado;
}

const nuevoId = () => `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`;

export function encolar(modulo: Modulo, payload: Record<string, unknown>, resumen: string) {
  return enSerie(async () => {
    const cola = await leerCola();
    const elemento: ElementoCola = {
      idLocal: nuevoId(), modulo, resumen, payload,
      creadoEn: new Date().toISOString(), intentos: 0, estado: 'pendiente',
    };
    await escribirCola([...cola, elemento]);
    return elemento.idLocal;
  });
}

export function descartar(idLocal: string) {
  return enSerie(async () => {
    const cola = await leerCola();
    await escribirCola(cola.filter((e) => e.idLocal !== idLocal));
  });
}

/** Vuelve a poner como pendiente un elemento con error para reintentarlo. */
export function marcarParaReintento(idLocal: string) {
  return enSerie(async () => {
    const cola = await leerCola();
    await escribirCola(cola.map((e) =>
      e.idLocal === idLocal ? { ...e, estado: 'pendiente' as const, ultimoError: undefined } : e,
    ));
  });
}

function describirError(e: unknown): { deRed: boolean; mensaje: string } {
  if (isAxiosError(e)) {
    if (!e.response) return { deRed: true, mensaje: 'Sin conexión con el servidor' };
    const cuerpo = e.response.data;
    const detalle = typeof cuerpo === 'string' ? cuerpo : cuerpo?.message ?? cuerpo?.error;
    return { deRed: false, mensaje: `Error ${e.response.status}${detalle ? `: ${String(detalle).slice(0, 160)}` : ''}` };
  }
  return { deRed: false, mensaje: e instanceof Error ? e.message : 'Error desconocido' };
}

export type ResultadoProceso = { enviados: string[]; quedanPendientes: number; errores: number };

/**
 * Envía en orden los elementos pendientes.
 * - 2xx: se elimina de la cola.
 * - Sin respuesta (red/timeout): se detiene y queda pendiente para el próximo intento.
 * - Respuesta 4xx/5xx: se marca como error (no se reintenta solo) y sigue con el siguiente.
 */
export async function procesarCola(): Promise<ResultadoProceso> {
  cambiarProcesos(1);
  try {
    return await procesarEnSerie();
  } finally {
    cambiarProcesos(-1);
  }
}

function procesarEnSerie(): Promise<ResultadoProceso> {
  return enSerie(async () => {
    const enviados: string[] = [];
    let cola = await leerCola();

    for (const elemento of cola.filter((e) => e.estado === 'pendiente')) {
      try {
        await api.post(RUTA_POST[elemento.modulo], elemento.payload);
        enviados.push(elemento.idLocal);
        cola = cola.filter((e) => e.idLocal !== elemento.idLocal);
        await escribirCola(cola);
      } catch (e) {
        const { deRed, mensaje } = describirError(e);
        cola = cola.map((x) => x.idLocal === elemento.idLocal
          ? { ...x, intentos: x.intentos + 1, ultimoError: mensaje, estado: deRed ? 'pendiente' : 'error' }
          : x);
        await escribirCola(cola);
        if (deRed) break;
      }
    }

    return {
      enviados,
      quedanPendientes: cola.filter((e) => e.estado === 'pendiente').length,
      errores: cola.filter((e) => e.estado === 'error').length,
    };
  });
}

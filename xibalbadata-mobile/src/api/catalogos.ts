import { api } from './client';
import { leerJSON, guardarJSON } from '../offline/almacen';
import type { AlertaTipo, Operador, Pozo } from './types';

/**
 * Catálogos con estrategia caché-primero: se pide al servidor y, si no hay señal,
 * se usa la última copia guardada en el teléfono.
 */
async function obtenerConCache<T>(ruta: string, clave: string): Promise<{ datos: T[]; desdeCache: boolean }> {
  try {
    const { data } = await api.get<T[]>(ruta);
    const datos = Array.isArray(data) ? data : [];
    await guardarJSON(clave, datos);
    return { datos, desdeCache: false };
  } catch {
    const datos = await leerJSON<T[]>(clave, []);
    return { datos, desdeCache: true };
  }
}

export const obtenerPozos = () => obtenerConCache<Pozo>('/api/lista_pozos', 'cat_pozos');
export const obtenerOperadores = () => obtenerConCache<Operador>('/api/operadores', 'cat_operadores');
export const obtenerTiposAlerta = () => obtenerConCache<AlertaTipo>('/api/alertas_tipo', 'cat_alertas_tipo');

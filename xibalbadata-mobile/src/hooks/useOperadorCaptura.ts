import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import type { Operador } from '../api/types';

/**
 * Decide quién es el operador de una captura.
 * - Operador: se toma de la sesión (no ve selector).
 * - Admin: elige el operador (si el admin también está en operadores, se preselecciona).
 * - `requiereId`: si el módulo guarda el id_o y el operador de la sesión no tiene id_o, se muestra el selector como respaldo.
 */
export function useOperadorCaptura(operadores: Operador[], requiereId: boolean) {
  const { usuario, idOperador, esAdmin } = useAuth();
  // Elección explícita del usuario; si no ha elegido, se usa su propio registro de operador.
  const [elegido, setSeleccionado] = useState<Operador | null>(null);

  const sinId = requiereId && !esAdmin && idOperador === null;
  const mostrarSelector = esAdmin || sinId;
  const propio = operadores.find((o) => o.id_o === idOperador) ?? null;
  const seleccionado = elegido ?? propio;

  /** Operador final de la captura, o null si falta elegirlo. */
  const resolver = (): { id: number | null; nombre: string } | null => {
    if (mostrarSelector) return seleccionado ? { id: seleccionado.id_o, nombre: seleccionado.o_nombre } : null;
    return { id: idOperador, nombre: propio?.o_nombre ?? usuario?.nombre ?? '' };
  };

  const reiniciar = () => setSeleccionado(null);

  return {
    mostrarSelector,
    sinId,
    seleccionado,
    setSeleccionado,
    nombreSesion: propio?.o_nombre ?? usuario?.nombre ?? '',
    resolver,
    reiniciar,
  };
}

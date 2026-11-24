import { createContext, useCallback, useContext, useEffect, useState, type ReactNode } from 'react';
import { AppState } from 'react-native';
import { useNetworkState } from 'expo-network';
import { obtenerOperadores, obtenerPozos, obtenerTiposAlerta } from '../api/catalogos';
import { leerCola, procesarCola, suscribirCola, suscribirEnvio, type ElementoCola, type ResultadoProceso } from './cola';

type SincronizacionContextType = {
  cola: ElementoCola[];
  pendientes: number;
  errores: number;
  enviando: boolean;
  conectado: boolean;
  sincronizarAhora: () => Promise<ResultadoProceso | null>;
};

const SincronizacionContext = createContext<SincronizacionContextType | null>(null);

export function SincronizacionProvider({ children }: { children: ReactNode }) {
  const [cola, setCola] = useState<ElementoCola[]>([]);
  const [enviando, setEnviando] = useState(false);
  const red = useNetworkState();
  // Antes del primer evento el estado es indefinido: se asume conectado y, si no, la cola lo detecta.
  const conectado = red.isConnected !== false && red.isInternetReachable !== false;
  useEffect(() => {
    leerCola().then(setCola);
    const quitarCola = suscribirCola(setCola);
    const quitarEnvio = suscribirEnvio(setEnviando);
    return () => { quitarCola(); quitarEnvio(); };
  }, []);

  // procesarCola se serializa internamente: llamadas simultáneas se encadenan.
  const sincronizarAhora = useCallback(
    () => procesarCola().catch((): ResultadoProceso | null => null),
    [],
  );

  // Al abrir la app y cada vez que vuelve la conexión: envía la cola y actualiza
  // los catálogos en el teléfono para poder capturar después sin señal.
  useEffect(() => {
    if (!conectado) return;
    sincronizarAhora();
    Promise.all([obtenerPozos(), obtenerOperadores(), obtenerTiposAlerta()]).catch(() => undefined);
  }, [conectado, sincronizarAhora]);

  // Al regresar la app a primer plano.
  useEffect(() => {
    const sub = AppState.addEventListener('change', (estado) => {
      if (estado === 'active') sincronizarAhora();
    });
    return () => sub.remove();
  }, [sincronizarAhora]);

  const value: SincronizacionContextType = {
    cola,
    pendientes: cola.filter((e) => e.estado === 'pendiente').length,
    errores: cola.filter((e) => e.estado === 'error').length,
    enviando,
    conectado,
    sincronizarAhora,
  };

  return <SincronizacionContext.Provider value={value}>{children}</SincronizacionContext.Provider>;
}

export function useSincronizacion() {
  const ctx = useContext(SincronizacionContext);
  if (!ctx) throw new Error('useSincronizacion debe usarse dentro de SincronizacionProvider');
  return ctx;
}

import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import * as SecureStore from 'expo-secure-store';
import { api } from '../api/client';
import { obtenerOperadores } from '../api/catalogos';

const USER_KEY = 'xd_user';
const ID_OPERADOR_KEY = 'xd_id_operador';

export type Usuario = {
  id_us: number;
  nombre: string;
  matricula?: string;
  telefono?: string;
  correo: string;
  rol: string; // 'administrador' | 'operador'
};

type AuthContextType = {
  usuario: Usuario | null;
  /** id_o del operador (tabla operadores) que corresponde al usuario de la sesión, buscado por correo. */
  idOperador: number | null;
  esAdmin: boolean;
  cargando: boolean;
  signIn: (correo: string, contrasena: string) => Promise<void>;
  signOut: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType | null>(null);

/** Busca el id_o cuyo correo coincide con el del usuario. Funciona offline con el catálogo en caché. */
async function resolverIdOperador(usuario: Usuario): Promise<number | null> {
  const correo = usuario.correo?.trim().toLowerCase();
  if (!correo) return null;
  const { datos } = await obtenerOperadores();
  const op = datos.find((o) => o.o_correo?.trim().toLowerCase() === correo);
  return op ? op.id_o : null;
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [usuario, setUsuario] = useState<Usuario | null>(null);
  const [idOperador, setIdOperador] = useState<number | null>(null);
  const [cargando, setCargando] = useState(true);

  const actualizarIdOperador = async (user: Usuario) => {
    const id = await resolverIdOperador(user);
    if (id !== null) {
      setIdOperador(id);
      await SecureStore.setItemAsync(ID_OPERADOR_KEY, String(id));
    }
  };

  // Al abrir la app, restaura la sesión guardada
  useEffect(() => {
    (async () => {
      try {
        const user = await SecureStore.getItemAsync(USER_KEY);
        if (user) {
          const parsed: Usuario = JSON.parse(user);
          setUsuario(parsed);
          const idGuardado = await SecureStore.getItemAsync(ID_OPERADOR_KEY);
          if (idGuardado) setIdOperador(Number(idGuardado));
          else actualizarIdOperador(parsed); // en segundo plano, no bloquea el inicio
        }
      } finally {
        setCargando(false);
      }
    })();
  }, []);

  const signIn = async (correo: string, contrasena: string) => {
    const { data } = await api.post('/api/usuarios/login', { correo, contrasena });
    const user: Usuario = data;
    await SecureStore.setItemAsync(USER_KEY, JSON.stringify(user));
    await SecureStore.deleteItemAsync(ID_OPERADOR_KEY);
    setIdOperador(null);
    await actualizarIdOperador(user).catch(() => undefined);
    setUsuario(user);
  };

  const signOut = async () => {
    await SecureStore.deleteItemAsync(USER_KEY);
    await SecureStore.deleteItemAsync(ID_OPERADOR_KEY);
    setUsuario(null);
    setIdOperador(null);
  };

  const esAdmin = usuario?.rol?.toLowerCase() === 'administrador';

  return (
    <AuthContext.Provider value={{ usuario, idOperador, esAdmin, cargando, signIn, signOut }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth debe usarse dentro de AuthProvider');
  return ctx;
}
